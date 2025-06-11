// File: src/app/api/bookings/check-payment-status/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseService } from '../../../../lib/database'; // Adjust path if needed
import crypto from 'crypto';

// --- Interface Definition for PhonePe Check Status API Response ---
interface PhonePeCheckStatusApiResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument?: any;
    providerReferenceId?: string;
    payResponseCode?: string;
  };
}
// --- End Interface Definition ---

const dbService = new DatabaseService();

export async function GET(request: NextRequest) {
  const mtid = request.nextUrl.searchParams.get('mtid');

  if (!mtid) {
    return NextResponse.json({ success: false, message: "Merchant transaction ID (mtid) is required." }, { status: 400 });
  }

  // -------------------------------------------------------------------
  // Retrieve payment_attempt to map MTID → booking_id
  // -------------------------------------------------------------------
  const attempt = await dbService.getPaymentAttemptByMtid(mtid);

  if (!attempt) {
    return NextResponse.json({ success: false, message: "Unknown or expired transaction reference." }, { status: 404 });
  }

  const bookingIdInt = attempt.booking_id;

  try {
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const statusApiUrlPrefix = process.env.PHONEPE_STATUS_API_URL_PREFIX;

    if (!merchantId || !saltKey || !saltIndex || !statusApiUrlPrefix) {
      console.error("LOG Error: Missing PhonePe configuration for check status API (merchantId, saltKey, saltIndex, or prefix).");
      return NextResponse.json({ success: false, message: "Server configuration error for payment status check." }, { status: 500 });
    }

    // Path for constructing the full fetch URL (appended to prefix)
    const fetchUrlPathSegment = `/${merchantId}/${mtid}`;
    // Path used specifically for generating the X-VERIFY hash
    const pathForHashing = `/pg/v1/status/${merchantId}/${mtid}`;

    const stringToHash = pathForHashing + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerifyStatus = `${sha256}###${saltIndex}`;

    let phonePeStatusResponse: PhonePeCheckStatusApiResponse;
    const fullApiUrl = statusApiUrlPrefix + fetchUrlPathSegment;
    console.log(`DEBUG: Calling PhonePe Check Status API from check-payment-status route. URL: ${fullApiUrl}`);

    try {
      const apiResponse = await fetch(fullApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-MERCHANT-ID': merchantId,
          'X-VERIFY': xVerifyStatus,
          'Accept': 'application/json',
        },
      });

      if (!apiResponse.ok) {
        // Define the expected error response type
        interface PhonePeErrorResponse {
          message?: string;
          code?: string;
        }
        
        let errorResponse: PhonePeErrorResponse = {};
        
        try {
          const parsed = await apiResponse.json();
          // Safely cast the parsed object to our error response type
          if (parsed && typeof parsed === 'object') {
            const { message, code } = parsed as Partial<PhonePeErrorResponse>;
            errorResponse = {
              message: typeof message === 'string' ? message : undefined,
              code: typeof code === 'string' ? code : undefined
            };
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        
        const errorMessage = errorResponse.message || `PhonePe Status API request failed: ${apiResponse.statusText}`;
        console.error(`LOG Error: PhonePe Status API request failed for ${mtid} with status: ${apiResponse.status}`, errorResponse);
        
        return NextResponse.json(
          { 
            success: false, 
            message: errorMessage, 
            phonePeCode: errorResponse.code 
          },
          { status: apiResponse.status }
        );
      }
      phonePeStatusResponse = await apiResponse.json() as PhonePeCheckStatusApiResponse;
      console.log(`DEBUG: PhonePe Check Status API response for ${mtid}:`, JSON.stringify(phonePeStatusResponse, null, 2));

    } catch (fetchError) {
      console.error(`LOG Error: Fetch error calling PhonePe Status API for ${mtid}:`, fetchError);
      return NextResponse.json({ success: false, message: "Could not connect to payment provider to check status." }, { status: 503 });
    }

    if (!phonePeStatusResponse.success) {
      console.warn(`LOG Warn: PhonePe Status API returned success:false for ${mtid}:`, phonePeStatusResponse.message, `Code: ${phonePeStatusResponse.code}`);
      // Even if PhonePe says success:false, we return a 200 from our API but indicate the failure from PhonePe's perspective.
      // The client page will decide how to handle this (e.g. if it's PAYMENT_ERROR or TRANSACTION_NOT_FOUND)
      // We pass along PhonePe's assessment.
      return NextResponse.json({
        success: false, // Our API call was successful, but PhonePe indicates a non-success state for the transaction
        message: phonePeStatusResponse.message || "Failed to get a successful status from PhonePe.",
        phonePePaymentStatus: phonePeStatusResponse.code, // Pass along PhonePe's code
        phonePeCode: phonePeStatusResponse.code,
        merchantTransactionId: mtid,
      });
    }

    const phonePePaymentCode = phonePeStatusResponse.code;
    const phonePeTransactionState = phonePeStatusResponse.data?.state;
    const phonePeApiTransactionId = phonePeStatusResponse.data?.transactionId;
    const phonePeAmount = phonePeStatusResponse.data?.amount; // This should be number as per interface

    const booking = await dbService.getBookingById(bookingIdInt);
    if (!booking) {
      console.error(`LOG Error: Booking ${bookingIdInt} not found locally after checking status.`);
      return NextResponse.json({ success: false, message: "Booking not found locally after status check.", phonePePaymentStatus: phonePePaymentCode }, { status: 404 });
    }

    let updatedBookingStatus = booking.status;
    let updatedPaymentStatus = booking.paymentStatus;

    if (booking.status !== 'CONFIRMED' && booking.status !== 'FAILED') {
      if (phonePePaymentCode === 'PAYMENT_SUCCESS') {
        await dbService.updateBookingStatusAndPaymentStatus(String(bookingIdInt), 'CONFIRMED', 'PAID', phonePeApiTransactionId);
        await dbService.updatePaymentAttemptStatus(mtid, 'SUCCESS', phonePePaymentCode, phonePeApiTransactionId);
        updatedBookingStatus = 'CONFIRMED';
        updatedPaymentStatus = 'PAID';
        console.log(`LOG Info: Booking ${bookingIdInt} updated to CONFIRMED/PAID via check-payment-status.`);
      } else if (['PAYMENT_ERROR', 'TRANSACTION_NOT_FOUND', 'PAYMENT_FAILURE', 'TIMED_OUT'].includes(phonePePaymentCode)) {
        await dbService.updateBookingStatusAndPaymentStatus(String(bookingIdInt), 'FAILED', 'FAILED', phonePeApiTransactionId);
        await dbService.updatePaymentAttemptStatus(mtid, 'FAILURE', phonePePaymentCode, phonePeApiTransactionId);
        updatedBookingStatus = 'FAILED';
        updatedPaymentStatus = 'FAILED';
        console.log(`LOG Info: Booking ${bookingIdInt} updated to FAILED/FAILED via check-payment-status.`);
      } else if (phonePePaymentCode === 'PAYMENT_PENDING') {
        await dbService.updatePaymentAttemptStatus(mtid, 'PENDING', phonePePaymentCode, phonePeApiTransactionId);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Status successfully retrieved.",
      merchantTransactionId: mtid,
      phonePePaymentStatus: phonePePaymentCode,
      phonePeTransactionState: phonePeTransactionState,
      phonePeAmount: phonePeAmount,
      bookingStatus: updatedBookingStatus,
      paymentStatus: updatedPaymentStatus,
      bookingId: bookingIdInt,
    });

  } catch (error) {
    console.error(`LOG Error: Outer try-catch in check-payment-status for ${mtid}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ success: false, message: "Error checking payment status.", errorDetail: errorMessage }, { status: 500 });
  }
}