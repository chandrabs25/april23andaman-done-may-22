import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseService } from '../../../../lib/database'; // Import D1 Database Service
import { verifyXVerifyHeader } from '../../../../lib/phonepeUtils';
import crypto from 'crypto';

const dbService = new DatabaseService(); // Instantiate DatabaseService

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
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

    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    if (!saltKey || !saltIndex) {
      console.error("PhonePe salt key or salt index is not configured.");
      return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
    }

    const isAuthenticCallback = verifyXVerifyHeader(base64Response, receivedXVerifyHeader, saltKey, saltIndex);
    if (!isAuthenticCallback) {
      console.warn("X-Verify header mismatch. Callback authenticity check failed.");
      return NextResponse.json({ success: false, message: "Callback authenticity check failed." }, { status: 400 });
    }

    const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString());
    const { merchantTransactionId, transactionId: phonepeMainTransactionId, code: callbackPaymentStatusCode } = decodedResponse;
    console.log(`PhonePe Callback received for MTID: ${merchantTransactionId}, PhonePe TID: ${phonepeMainTransactionId}, Callback Status Code: ${callbackPaymentStatusCode}`);

    const bookingId = parseInt(merchantTransactionId, 10);
    if (isNaN(bookingId)) {
        console.warn(`Invalid merchantTransactionId received in callback: ${merchantTransactionId}`);
        return NextResponse.json({ success: false, message: "Invalid transaction ID format." }, { status: 400 });
    }

    // 3. Idempotency Check: Fetch current booking status using D1 Service
    const booking = await dbService.getBookingById(bookingId); // Using D1 service
    if (!booking) {
      console.error(`Booking not found for merchantTransactionId (bookingId ${bookingId}) from PhonePe callback.`);
      return NextResponse.json({ success: true, message: "Callback acknowledged, but booking not found locally." });
    }
    if (booking.status === 'CONFIRMED' || booking.status === 'FAILED') {
      console.log(`Booking ${bookingId} already in a terminal state: ${booking.status}. Acknowledging callback.`);
      return NextResponse.json({ success: true, message: "Callback acknowledged for already processed transaction." });
    }

    // 4. Call PhonePe Check Status API
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    if (!merchantId) {
        console.error("PhonePe Merchant ID is not configured.");
        return NextResponse.json({ success: false, message: "Server configuration error for status check." }, { status: 500 });
    }
    const statusApiEndpointPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`; // Use original string merchantTransactionId here
    const stringToHashForStatusCheck = statusApiEndpointPath + saltKey;
    const sha256Status = crypto.createHash('sha256').update(stringToHashForStatusCheck).digest('hex');
    const xVerifyStatusCheck = `${sha256Status}###${saltIndex}`;

    let statusResponse;
    try {
        const statusResponseRaw = await fetch(process.env.PHONEPE_STATUS_API_URL_PREFIX! + statusApiEndpointPath, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-MERCHANT-ID': merchantId, 'X-VERIFY': xVerifyStatusCheck, 'Accept': 'application/json' },
        });
        statusResponse = await statusResponseRaw.json();
    } catch (statusApiError) {
        console.error(`PhonePe Check Status API call failed for MTID ${merchantTransactionId}:`, statusApiError);
        return NextResponse.json({ success: true, message: "Callback processed, but status check API failed. Manual reconciliation may be needed." });
    }
    
    // 5. Process Confirmed Payment Status from Check Status API
    if (statusResponse && statusResponse.success) {
      const confirmedPaymentCode = statusResponse.code;
      const phonepeInternalTxId = statusResponse.data?.transactionId || phonepeMainTransactionId; 
      console.log(`Status API for MTID ${merchantTransactionId} successful. Code: ${confirmedPaymentCode}, PhonePeInternalTID: ${phonepeInternalTxId}`);

      if (confirmedPaymentCode === 'PAYMENT_SUCCESS') {
        await dbService.updateBookingStatusAndPaymentStatus(String(bookingId), 'CONFIRMED', 'PAID', phonepeInternalTxId); // Use String(bookingId) as method expects string
        console.log(`Booking ${bookingId} CONFIRMED and payment PAID via D1.`);
      } else if (['PAYMENT_ERROR', 'TRANSACTION_NOT_FOUND', 'PAYMENT_FAILURE', 'TIMED_OUT', 'CARD_NOT_SUPPORTED', 'BANK_OFFLINE', 'PAYMENT_DECLINED'].includes(confirmedPaymentCode)) {
        await dbService.updateBookingStatusAndPaymentStatus(String(bookingId), 'FAILED', 'FAILED', phonepeInternalTxId); // Use String(bookingId)
        console.log(`Booking ${bookingId} FAILED via D1. Status from API: ${confirmedPaymentCode}`);
      } else if (confirmedPaymentCode === 'PAYMENT_PENDING') {
        console.log(`Booking ${bookingId} is PENDING according to status check. No DB update to terminal state from callback.`);
      } else {
        console.log(`Booking ${bookingId} has unhandled status via check API: ${confirmedPaymentCode}.`);
      }
    } else {
      console.error(`PhonePe Check Status API call for ${merchantTransactionId} was not successful or malformed:`, statusResponse?.message || "No message in status response");
      return NextResponse.json({ success: true, message: "Callback processed, but status check was not successful. Manual reconciliation may be needed." });
    }

    return NextResponse.json({ success: true, message: "Callback processed successfully." });

  } catch (error) {
    console.error("Error in phonepe-callback general processing:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error processing callback.";
    return NextResponse.json({ success: true, message: `Callback acknowledged with internal error: ${errorMessage}` });
  }
}
