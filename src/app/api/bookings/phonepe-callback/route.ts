import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyXVerifyHeader } from '../../../../lib/phonepeUtils';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json(); // Contains { response: "base64encodedstring" }
    const base64Response = requestBody.response;
    const receivedXVerifyHeader = request.headers.get('x-verify');

    if (!base64Response) {
        console.warn("Missing 'response' field in PhonePe callback body.");
        return NextResponse.json({ success: false, message: "Missing 'response' field in callback body." }, { status: 400 });
    }

    if (!receivedXVerifyHeader) {
      console.warn("X-Verify header missing in callback from PhonePe.");
      return NextResponse.json({ success: false, message: "X-Verify header missing." }, { status: 400 });
    }

    // 1. Verify X-Verify header from PhonePe
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    if (!saltKey || !saltIndex) {
      console.error("PhonePe salt key or salt index is not configured in environment variables.");
      return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
    }

    const isAuthenticCallback = verifyXVerifyHeader(
      base64Response,
      receivedXVerifyHeader,
      saltKey,
      saltIndex
    );

    if (!isAuthenticCallback) {
      console.warn("X-Verify header mismatch. Callback authenticity check failed.");
      // Consider logging expected vs received for debugging if possible securely
      return NextResponse.json({ success: false, message: "Callback authenticity check failed." }, { status: 400 });
    }

    // 2. Decode Base64 Response
    const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString());
    const { merchantTransactionId, transactionId: phonepeMainTransactionId, code: callbackPaymentStatusCode } = decodedResponse;
    
    console.log(`PhonePe Callback received for MTID: ${merchantTransactionId}, PhonePe TID: ${phonepeMainTransactionId}, Callback Status Code: ${callbackPaymentStatusCode}`);

    // 3. Idempotency Check: Fetch current booking status
    const booking = await prisma.booking.findUnique({ where: { id: merchantTransactionId } });
    if (!booking) {
      console.error(`Booking not found for merchantTransactionId: ${merchantTransactionId} from PhonePe callback.`);
      // Responding 200 to acknowledge callback to PhonePe even if booking not found on our side to prevent retries for this specific callback.
      // This scenario indicates a potential issue on our side (e.g. booking not created or deleted).
      return NextResponse.json({ success: true, message: "Callback acknowledged, but booking not found locally." });
    }
    if (booking.status === 'CONFIRMED' || booking.status === 'FAILED') {
      console.log(`Booking ${merchantTransactionId} already in a terminal state: ${booking.status}. Acknowledging callback.`);
      return NextResponse.json({ success: true, message: "Callback acknowledged for already processed transaction." });
    }

    // 4. Call PhonePe Check Status API
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    if (!merchantId) {
        console.error("PhonePe Merchant ID is not configured.");
        return NextResponse.json({ success: false, message: "Server configuration error for status check." }, { status: 500 });
    }

    const statusApiEndpointPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    
    const stringToHashForStatusCheck = statusApiEndpointPath + saltKey;
    const sha256Status = crypto.createHash('sha256').update(stringToHashForStatusCheck).digest('hex');
    const xVerifyStatusCheck = `${sha256Status}###${saltIndex}`;

    let statusResponse;
    try {
        const statusResponseRaw = await fetch(process.env.PHONEPE_STATUS_API_URL_PREFIX! + statusApiEndpointPath, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-MERCHANT-ID': merchantId,
            'X-VERIFY': xVerifyStatusCheck,
            'Accept': 'application/json',
            },
        });
        statusResponse = await statusResponseRaw.json();
    } catch (statusApiError) {
        console.error(`PhonePe Check Status API call failed for MTID ${merchantTransactionId}:`, statusApiError);
        // Even if status check fails, we acknowledge the callback to prevent PhonePe retries for this specific callback
        return NextResponse.json({ success: true, message: "Callback processed, but status check API failed. Manual reconciliation may be needed." });
    }
    

    // 5. Process Confirmed Payment Status from Check Status API
    if (statusResponse && statusResponse.success) {
      const confirmedPaymentCode = statusResponse.code;
      const phonepeInternalTxId = statusResponse.data?.transactionId || phonepeMainTransactionId; 

      console.log(`Status API for MTID ${merchantTransactionId} successful. Code: ${confirmedPaymentCode}, PhonePeInternalTID: ${phonepeInternalTxId}`);

      if (confirmedPaymentCode === 'PAYMENT_SUCCESS') {
        await prisma.booking.update({
          where: { id: merchantTransactionId },
          data: {
            paymentStatus: 'PAID', // Ensure 'PAID' is a valid enum value in your schema
            status: 'CONFIRMED',   // Ensure 'CONFIRMED' is a valid enum value
            phonepeTransactionId: phonepeInternalTxId,
          },
        });
        console.log(`Booking ${merchantTransactionId} CONFIRMED and payment PAID.`);
      } else if (['PAYMENT_ERROR', 'TRANSACTION_NOT_FOUND', 'PAYMENT_FAILURE', 'TIMED_OUT', 'CARD_NOT_SUPPORTED', 'BANK_OFFLINE', 'PAYMENT_DECLINED'].includes(confirmedPaymentCode)) {
        await prisma.booking.update({
          where: { id: merchantTransactionId },
          data: { 
            paymentStatus: 'FAILED', // Ensure 'FAILED' is valid
            status: 'FAILED',        // Ensure 'FAILED' is valid
            phonepeTransactionId: phonepeInternalTxId, // Store ID even on failure for reference
        },
        });
        console.log(`Booking ${merchantTransactionId} FAILED. Status from API: ${confirmedPaymentCode}`);
      } else if (confirmedPaymentCode === 'PAYMENT_PENDING') {
        console.log(`Booking ${merchantTransactionId} is PENDING according to status check. No DB update to terminal state from callback.`);
      } else {
        console.log(`Booking ${merchantTransactionId} has unhandled status via check API: ${confirmedPaymentCode}.`);
      }
    } else {
      console.error(`PhonePe Check Status API call for ${merchantTransactionId} was not successful or malformed:`, statusResponse?.message || "No message in status response");
      // Acknowledge callback to prevent retries, but log that status could not be definitively verified.
       return NextResponse.json({ success: true, message: "Callback processed, but status check was not successful. Manual reconciliation may be needed." });
    }

    // 6. Respond to PhonePe S2S Callback
    return NextResponse.json({ success: true, message: "Callback processed successfully." });

  } catch (error) {
    console.error("Error in phonepe-callback general processing:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error processing callback.";
    // For unexpected errors after X-Verify has passed, it's often better to return 200 OK to PhonePe
    // to prevent retries for this specific callback if the issue might be temporary on our side.
    // However, if the error means we couldn't process it reliably, a 500 might also be considered.
    // Given the flow, if X-Verify passed, we try to always send 200 back to PhonePe for the callback itself.
    return NextResponse.json({ success: true, message: `Callback acknowledged with internal error: ${errorMessage}` });
  }
}
