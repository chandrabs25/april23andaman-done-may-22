import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseService } from '../../../../lib/database'; // Import D1 Database Service
import crypto from 'crypto';

// --- Interface Definition for PhonePe Check Status API Response ---
interface PhonePeCheckStatusApiResponse {
  success: boolean;
  code: string; // Main status code from PhonePe, e.g., "PAYMENT_SUCCESS", "PAYMENT_ERROR", "INTERNAL_SERVER_ERROR"
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId: string; // This is our booking ID (mtid)
    transactionId: string; // PhonePe's unique transaction ID
    amount: number; // Amount in paise
    state: string; // Overall state of the transaction, e.g., "COMPLETED", "FAILED", "PENDING"
    responseCode: string; // Detailed response code from PhonePe, e.g., "SUCCESS", "TIMED_OUT", "U01"
    paymentInstrument?: any; // Can be an object with payment details (e.g., type, cardType, etc.)
    providerReferenceId?: string; // Bank reference number or similar
    payResponseCode?: string; // May sometimes be present, often similar to responseCode
    // Other fields might be present depending on PhonePe API version and transaction type.
  };
}
// --- End Interface Definition ---

const dbService = new DatabaseService(); // Instantiate DatabaseService

export async function GET(request: NextRequest) {
  const mtidString = request.nextUrl.searchParams.get('mtid');

  if (!mtidString) {
    return NextResponse.json({ success: false, message: "Merchant transaction ID (mtid) is required." }, { status: 400 });
  }

  const bookingIdInt = parseInt(mtidString, 10);
  if (isNaN(bookingIdInt)) {
    return NextResponse.json({ success: false, message: "Invalid Merchant Transaction ID format." }, { status: 400 });
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

    const statusApiEndpointPath = `/pg/v1/status/${merchantId}/${mtidString}`; // Use original string mtidString for PhonePe API
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
        let errorBody = {};
        try { errorBody = await apiResponse.json(); } catch (e) { /* ignore */ }
        console.error(`PhonePe Status API request failed for ${mtidString} with status: ${apiResponse.status}`, errorBody);
        return NextResponse.json({ success: false, message: `Payment provider API error (HTTP ${apiResponse.status}).`, details: errorBody }, { status: apiResponse.status });
      }
      phonePeStatusResponse = await apiResponse.json() as PhonePeCheckStatusApiResponse; // Type assertion
    } catch (fetchError) {
      console.error(`Fetch error calling PhonePe Status API for ${mtidString}:`, fetchError);
      return NextResponse.json({ success: false, message: "Could not connect to payment provider to check status." }, { status: 503 });
    }
    
    if (!phonePeStatusResponse.success) {
      console.warn(`PhonePe Status API returned failure for ${mtidString}:`, phonePeStatusResponse.message, `Code: ${phonePeStatusResponse.code}`);
      return NextResponse.json({
        success: false,
        message: phonePeStatusResponse.message || "Failed to get status from PhonePe.",
        phonePeCode: phonePeStatusResponse.code,
        merchantTransactionId: mtidString,
      }, { status: 400 });
    }

    const phonePePaymentCode = phonePeStatusResponse.code;
    const phonePeTransactionState = phonePeStatusResponse.data?.state;
    const phonePeApiTransactionId = phonePeStatusResponse.data?.transactionId; // This is string
    const phonePeAmount = phonePeStatusResponse.data?.amount;

    // 3. Fetch Current Booking & Idempotent Database Update
    const booking = await dbService.getBookingById(bookingIdInt); // Use parsed integer ID

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found locally.", merchantTransactionId: mtidString }, { status: 404 });
    }

    let updatedBookingStatus = booking.status;
    let updatedPaymentStatus = booking.paymentStatus;

    if (booking.status !== 'CONFIRMED' && booking.status !== 'FAILED') {
      if (phonePePaymentCode === 'PAYMENT_SUCCESS') {
        if (booking.status !== 'CONFIRMED' || booking.paymentStatus !== 'PAID') {
            await dbService.updateBookingStatusAndPaymentStatus(String(bookingIdInt), 'CONFIRMED', 'PAID', phonePeApiTransactionId);
            updatedBookingStatus = 'CONFIRMED';
            updatedPaymentStatus = 'PAID';
            console.log(`Booking ${bookingIdInt} updated to CONFIRMED/PAID via check-status using D1.`);
        }
      } else if (['PAYMENT_ERROR', 'TRANSACTION_NOT_FOUND', 'PAYMENT_FAILURE', 'TIMED_OUT', 'PAYMENT_DECLINED', 'CARD_NOT_SUPPORTED', 'BANK_OFFLINE'].includes(phonePePaymentCode)) {
         if (booking.status !== 'FAILED' || booking.paymentStatus !== 'FAILED') {
            await dbService.updateBookingStatusAndPaymentStatus(String(bookingIdInt), 'FAILED', 'FAILED', phonePeApiTransactionId);
            updatedBookingStatus = 'FAILED';
            updatedPaymentStatus = 'FAILED';
            console.log(`Booking ${bookingIdInt} updated to FAILED via check-status due to ${phonePePaymentCode} using D1.`);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "Status successfully retrieved.",
      merchantTransactionId: mtidString, // Return original string mtid
      phonePePaymentStatus: phonePePaymentCode,
      phonePeTransactionState: phonePeTransactionState,
      phonePeAmount: phonePeAmount,
      bookingStatus: updatedBookingStatus,
      paymentStatus: updatedPaymentStatus,
    });

  } catch (error) {
    console.error(`Error in check-payment-status for ${mtidString}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ success: false, message: "An unexpected error occurred while checking payment status.", errorDetail: errorMessage }, { status: 500 });
  }
}
