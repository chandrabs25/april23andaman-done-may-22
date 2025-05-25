import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const merchantTransactionId = request.nextUrl.searchParams.get('mtid');

  if (!merchantTransactionId) {
    return NextResponse.json({ success: false, message: "Merchant transaction ID (mtid) is required." }, { status: 400 });
  }

  try {
    // 1. Call PhonePe Check Status API
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const statusApiUrlPrefix = process.env.PHONEPE_STATUS_API_URL_PREFIX;

    if (!merchantId || !saltKey || !saltIndex || !statusApiUrlPrefix) {
        console.error("PhonePe environment variables are not fully configured for status check.");
        return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
    }

    const statusApiEndpointPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToHash = statusApiEndpointPath + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerifyStatus = `${sha256}###${saltIndex}`;

    let phonePeStatusResponse;
    try {
      const apiResponse = await fetch(statusApiUrlPrefix + statusApiEndpointPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-MERCHANT-ID': merchantId,
          'X-VERIFY': xVerifyStatus,
          'Accept': 'application/json',
        },
      });
      if (!apiResponse.ok) {
        // Attempt to parse error from PhonePe if possible, but prioritize our own error message
        let errorBody = {};
        try {
            errorBody = await apiResponse.json();
        } catch (e) { /* ignore parsing error */ }
        console.error(`PhonePe Status API request failed for ${merchantTransactionId} with status: ${apiResponse.status}`, errorBody);
        return NextResponse.json({ success: false, message: `Payment provider API error (HTTP ${apiResponse.status}).`, details: errorBody }, { status: apiResponse.status });
      }
      phonePeStatusResponse = await apiResponse.json();
    } catch (fetchError) {
      console.error(`Fetch error calling PhonePe Status API for ${merchantTransactionId}:`, fetchError);
      return NextResponse.json({ success: false, message: "Could not connect to payment provider to check status." }, { status: 503 }); // Service Unavailable
    }
    
    // 2. Process PhonePe Status API Response
    if (!phonePeStatusResponse.success) {
      console.warn(`PhonePe Status API returned failure for ${merchantTransactionId}:`, phonePeStatusResponse.message, `Code: ${phonePeStatusResponse.code}`);
      return NextResponse.json({
        success: false,
        message: phonePeStatusResponse.message || "Failed to get status from PhonePe.",
        phonePeCode: phonePeStatusResponse.code, // e.g. "F404" if transaction not found on their end
        merchantTransactionId: merchantTransactionId,
      }, { status: 400 }); // Or appropriate status based on PhonePe's error (e.g. 404 if F404)
    }

    const phonePePaymentCode = phonePeStatusResponse.code; // e.g. PAYMENT_SUCCESS
    const phonePeTransactionState = phonePeStatusResponse.data?.state; // e.g. COMPLETED
    const phonePeApiTransactionId = phonePeStatusResponse.data?.transactionId;
    const phonePeAmount = phonePeStatusResponse.data?.amount; // Amount in Paise from PhonePe

    // 3. Fetch Current Booking & Idempotent Database Update
    const booking = await prisma.booking.findUnique({ where: { id: merchantTransactionId } });

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found locally.", merchantTransactionId: merchantTransactionId }, { status: 404 });
    }

    let updatedBookingStatus = booking.status;
    let updatedPaymentStatus = booking.paymentStatus;

    // Only update if not in a terminal state AND if there's a change needed
    if (booking.status !== 'CONFIRMED' && booking.status !== 'FAILED') {
      if (phonePePaymentCode === 'PAYMENT_SUCCESS') {
        if (booking.status !== 'CONFIRMED' || booking.paymentStatus !== 'PAID') {
            await prisma.booking.update({
              where: { id: merchantTransactionId },
              data: {
                paymentStatus: 'PAID',
                status: 'CONFIRMED',
                phonepeTransactionId: phonePeApiTransactionId || booking.phonepeTransactionId,
                // Optional: Verify amount from PhonePe matches booking.totalAmount
                // paymentDetails: phonePeStatusResponse.data, // Store more details if needed
              },
            });
            updatedBookingStatus = 'CONFIRMED';
            updatedPaymentStatus = 'PAID';
            console.log(`Booking ${merchantTransactionId} updated to CONFIRMED/PAID via check-status.`);
        }
      } else if (['PAYMENT_ERROR', 'TRANSACTION_NOT_FOUND', 'PAYMENT_FAILURE', 'TIMED_OUT', 'PAYMENT_DECLINED', 'CARD_NOT_SUPPORTED', 'BANK_OFFLINE'].includes(phonePePaymentCode)) {
         if (booking.status !== 'FAILED' || booking.paymentStatus !== 'FAILED') {
            await prisma.booking.update({
              where: { id: merchantTransactionId },
              data: { 
                paymentStatus: 'FAILED', 
                status: 'FAILED',
                phonepeTransactionId: phonePeApiTransactionId || booking.phonepeTransactionId,
                // paymentDetails: phonePeStatusResponse.data, // Store more details if needed
              },
            });
            updatedBookingStatus = 'FAILED';
            updatedPaymentStatus = 'FAILED';
            console.log(`Booking ${merchantTransactionId} updated to FAILED via check-status due to ${phonePePaymentCode}.`);
        }
      }
      // If PAYMENT_PENDING, no DB update is made here by check-payment-status, client can interpret PENDING status
    }
    
    return NextResponse.json({
      success: true,
      message: "Status successfully retrieved.",
      merchantTransactionId: merchantTransactionId,
      phonePePaymentStatus: phonePePaymentCode,         // e.g. "PAYMENT_SUCCESS", "PAYMENT_PENDING"
      phonePeTransactionState: phonePeTransactionState, // e.g. "COMPLETED", "PENDING", "FAILED"
      phonePeAmount: phonePeAmount,                     // Amount from PhonePe (in paise)
      bookingStatus: updatedBookingStatus,              // Reflects updated local status
      paymentStatus: updatedPaymentStatus,              // Reflects updated local status
    });

  } catch (error) {
    console.error(`Error in check-payment-status for ${merchantTransactionId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ success: false, message: "An unexpected error occurred while checking payment status.", errorDetail: errorMessage }, { status: 500 });
  }
}
