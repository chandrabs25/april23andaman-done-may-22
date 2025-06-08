// File: src/app/api/bookings/phonepe-callback/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DatabaseService } from '../../../../lib/database'; // Adjust path if your lib is elsewhere
import { verifyXVerifyHeader } from '../../../../lib/phonepeUtils'; // Adjust path if your lib is elsewhere
import { bookingSystem } from '../../../../lib/booking-system';
import crypto from 'crypto';

// --- Interface Definition for PhonePe S2S Callback Body ---
interface PhonePeS2SCallbackBody {
  response: string; // This is a Base64 encoded JSON string
}
// --- End Interface Definition ---

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

export async function POST(request: NextRequest) {
  console.log('--- PhonePe Callback Endpoint Hit ---'); // LOG 1
  try {
    console.log('LOG 2: Attempting to parse request.json()');
    const requestBody: PhonePeS2SCallbackBody = await request.json();
    console.log('LOG 3: Successfully parsed request.json(). requestBody content snippet:', JSON.stringify(requestBody, null, 2)?.substring(0, 200) + "...");

    const base64Response = requestBody.response;
    console.log('LOG 4: base64Response (type):', typeof base64Response);
    console.log('LOG 5: base64Response (content snippet):', String(base64Response).substring(0, 100) + "...");

    if (!base64Response || typeof base64Response !== 'string') {
        console.warn("LOG Error: Missing or invalid 'response' field (not a string) in PhonePe callback body. Value:", base64Response);
        return NextResponse.json({ success: false, message: "Missing or invalid 'response' field in callback body." }, { status: 400 });
    }

    const receivedXVerifyHeader = request.headers.get('x-verify');
    if (!receivedXVerifyHeader) {
      console.warn("LOG Error: X-Verify header missing in callback from PhonePe.");
      return NextResponse.json({ success: false, message: "X-Verify header missing." }, { status: 400 });
    }

    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    if (!saltKey || !saltIndex) {
      console.error("LOG Error: PhonePe salt key or salt index is not configured in environment.");
      return NextResponse.json({ success: false, message: "Server configuration error (salt)." }, { status: 500 });
    }

    const isAuthenticCallback = verifyXVerifyHeader(base64Response, receivedXVerifyHeader, saltKey, saltIndex);
    if (!isAuthenticCallback) {
      console.warn("LOG Error: X-Verify header mismatch. Callback authenticity check failed.");
      return NextResponse.json({ success: false, message: "Callback authenticity check failed." }, { status: 400 });
    }

    console.log('LOG 6: All initial checks passed, attempting to decode base64Response.');
    const decodedJsonString = Buffer.from(base64Response, 'base64').toString();
    console.log("LOG 7: Decoded JSON string from callback (snippet):", decodedJsonString.substring(0, 500) + "...");

    const decodedResponse = JSON.parse(decodedJsonString);
    console.log("LOG 8: Parsed decodedResponse object from PhonePe callback:", JSON.stringify(decodedResponse, null, 2));

    const merchantTransactionId = decodedResponse.data?.merchantTransactionId || decodedResponse.merchantTransactionId || decodedResponse.MerchantTransactionId || decodedResponse.merchant_transaction_id || decodedResponse.data?.MerchantTransactionId || decodedResponse.data?.merchant_transaction_id;
    const phonepeMainTransactionId = decodedResponse.data?.transactionId || decodedResponse.transactionId || decodedResponse.TransactionId || decodedResponse.transaction_id || decodedResponse.data?.TransactionId || decodedResponse.data?.transaction_id || decodedResponse.data?.providerReferenceId;
    const callbackPaymentStatusCode = decodedResponse.code || decodedResponse.data?.code || decodedResponse.Code || decodedResponse.data?.Code || decodedResponse.status || decodedResponse.data?.status || decodedResponse.Status || decodedResponse.data?.State;

    console.log(`LOG 9: Values after resilient access - MTID: ${merchantTransactionId}, PhonePeTID: ${phonepeMainTransactionId}, CallbackStatusCode: ${callbackPaymentStatusCode}`);

    if (!merchantTransactionId) {
        console.warn("LOG Error: merchantTransactionId is undefined after attempting all access patterns from decodedResponse. Critical: Check LOG 8 output.");
        return NextResponse.json({ success: false, message: "Could not extract merchantTransactionId from callback. Check server logs for LOG 8." }, { status: 400 });
    }

    const bookingId = parseInt(merchantTransactionId, 10);
    if (isNaN(bookingId)) {
      console.warn(`LOG Error: Invalid merchantTransactionId after parsing: '${merchantTransactionId}' resulted in NaN.`);
      return NextResponse.json({ success: false, message: "Invalid transaction ID format after parsing." }, { status: 400 });
    }

    // Check if this is a hold-based transaction
    const isHoldTransaction = merchantTransactionId.startsWith('HOLD_');
    let actualBookingId = bookingId;
    let holdId: number | null = null;

    if (isHoldTransaction) {
      // Extract hold ID from merchant transaction ID (format: HOLD_{holdId}_{timestamp})
      const holdIdMatch = merchantTransactionId.match(/^HOLD_(\d+)_/);
      if (!holdIdMatch) {
        console.error(`LOG Error: Invalid hold transaction ID format: ${merchantTransactionId}`);
        return NextResponse.json({ success: true, message: "Callback acknowledged, but invalid hold transaction format." });
      }
      
      holdId = parseInt(holdIdMatch[1], 10);
      console.log(`LOG 10a: Hold transaction detected. Hold ID: ${holdId}`);
      
      // For hold transactions, we don't have a booking yet - we'll create it on successful payment
      actualBookingId = 0; // Placeholder
    } else {
      console.log(`LOG 10: Parsed bookingId: ${bookingId}. Proceeding with idempotency check.`);
      const booking = await dbService.getBookingById(bookingId);
      if (!booking) {
        console.error(`LOG Error: Booking not found for bookingId ${bookingId} (from MTID ${merchantTransactionId}).`);
        return NextResponse.json({ success: true, message: "Callback acknowledged, but booking not found locally." });
      }
      if (booking.status === 'CONFIRMED' || booking.status === 'FAILED') {
        console.log(`LOG Info: Booking ${bookingId} already in a terminal state: ${booking.status}. Acknowledging callback.`);
        return NextResponse.json({ success: true, message: "Callback acknowledged for already processed transaction." });
      }
    }

    console.log(`LOG 11: Booking ${bookingId} found, not in terminal state. Proceeding to call PhonePe Check Status API.`);
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    if (!merchantId) {
      console.error("LOG Error: PhonePe Merchant ID is not configured in environment.");
      return NextResponse.json({ success: false, message: "Server configuration error (merchant_id)." }, { status: 500 });
    }

    // Path for constructing the full fetch URL (appended to prefix)
    const fetchUrlPathSegment = `/${merchantId}/${merchantTransactionId}`;
    // Path used specifically for generating the X-VERIFY hash for the Status API
    const pathForHashing = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    const stringToHashForStatusCheck = pathForHashing + saltKey;
    const sha256Status = crypto.createHash('sha256').update(stringToHashForStatusCheck).digest('hex');
    const xVerifyStatusCheck = `${sha256Status}###${saltIndex}`;

    let statusResponse: PhonePeCheckStatusApiResponse;
    try {
      const fullStatusApiUrl = process.env.PHONEPE_STATUS_API_URL_PREFIX! + fetchUrlPathSegment;
      console.log(`LOG 12: Calling PhonePe Check Status API for MTID ${merchantTransactionId}. URL: ${fullStatusApiUrl}`);
      const statusResponseRaw = await fetch(fullStatusApiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-MERCHANT-ID': merchantId, 'X-VERIFY': xVerifyStatusCheck, 'Accept': 'application/json' },
      });
      statusResponse = await statusResponseRaw.json() as PhonePeCheckStatusApiResponse;
      console.log(`LOG 13: PhonePe Check Status API response for MTID ${merchantTransactionId}:`, JSON.stringify(statusResponse, null, 2));
    } catch (statusApiError) {
      console.error(`LOG Error: PhonePe Check Status API call failed for MTID ${merchantTransactionId}:`, statusApiError);
      return NextResponse.json({ success: true, message: "Callback processed, but status check API failed. Manual reconciliation may be needed." });
    }

    if (statusResponse && statusResponse.success) {
      const confirmedPaymentCode = statusResponse.code;
      const phonepeInternalTxId = statusResponse.data?.transactionId || phonepeMainTransactionId;
      console.log(`LOG 14: Status API for MTID ${merchantTransactionId} successful. Code: ${confirmedPaymentCode}, PhonePeInternalTID: ${phonepeInternalTxId}`);

      if (confirmedPaymentCode === 'PAYMENT_SUCCESS') {
        if (isHoldTransaction && holdId) {
          // Convert hold to booking
          try {
            console.log(`LOG 14a: Converting hold ${holdId} to booking on successful payment`);
            
            // Get hold details first
            const holds = await bookingSystem.getActiveHolds();
            const targetHold = holds.find(h => h.id === holdId);
            
            if (!targetHold) {
              console.error(`LOG Error: Hold ${holdId} not found for conversion`);
              return NextResponse.json({ success: true, message: "Hold not found for conversion" });
            }

            // Create booking data from hold
            const bookingData = {
              user_id: targetHold.user_id || undefined,
              package_id: undefined, // Hotel bookings don't use package_id
              package_category_id: undefined,
              total_people: 1, // Will be updated with actual guest count
              start_date: targetHold.hold_date,
              end_date: targetHold.hold_date, // Will be updated with actual end date
              total_amount: targetHold.hold_price || 0,
              guest_name: targetHold.user_name || 'Guest',
              guest_email: targetHold.user_email || '',
              guest_phone: '',
              special_requests: '',
            };

            const conversionResult = await bookingSystem.convertHoldToBooking(holdId, bookingData);
            
            if (conversionResult.success && conversionResult.booking_id) {
              // Update the booking with payment details
              await dbService.updateBookingStatusAndPaymentStatus(
                conversionResult.booking_id.toString(), 
                'CONFIRMED', 
                'PAID', 
                phonepeInternalTxId
              );
              console.log(`LOG Info: Hold ${holdId} converted to booking ${conversionResult.booking_id} and marked as CONFIRMED/PAID`);
            } else {
              console.error(`LOG Error: Failed to convert hold ${holdId} to booking`);
              await bookingSystem.updateHoldStatus(holdId, 'cancelled');
            }
          } catch (holdConversionError) {
            console.error(`LOG Error: Exception during hold conversion for hold ${holdId}:`, holdConversionError);
            await bookingSystem.updateHoldStatus(holdId, 'cancelled');
          }
        } else {
          // Regular booking flow
          await dbService.updateBookingStatusAndPaymentStatus(actualBookingId.toString(), 'CONFIRMED', 'PAID', phonepeInternalTxId);
          console.log(`LOG Info: Booking ${actualBookingId} CONFIRMED and payment PAID via D1.`);
        }
      } else if (['PAYMENT_ERROR', 'TRANSACTION_NOT_FOUND', 'PAYMENT_FAILURE', 'TIMED_OUT', 'CARD_NOT_SUPPORTED', 'BANK_OFFLINE', 'PAYMENT_DECLINED'].includes(confirmedPaymentCode)) {
        if (isHoldTransaction && holdId) {
          // Cancel hold on payment failure
          await bookingSystem.updateHoldStatus(holdId, 'cancelled');
          console.log(`LOG Info: Hold ${holdId} cancelled due to payment failure. Status: ${confirmedPaymentCode}`);
        } else {
          // Regular booking flow
          await dbService.updateBookingStatusAndPaymentStatus(actualBookingId.toString(), 'FAILED', 'FAILED', phonepeInternalTxId);
          console.log(`LOG Info: Booking ${actualBookingId} FAILED via D1. Status from API: ${confirmedPaymentCode}`);
        }
      } else if (confirmedPaymentCode === 'PAYMENT_PENDING') {
        console.log(`LOG Info: Transaction ${merchantTransactionId} is PENDING according to status check. No DB update to terminal state from callback.`);
      } else {
        console.log(`LOG Info: Transaction ${merchantTransactionId} has unhandled status via check API: ${confirmedPaymentCode}.`);
      }
    } else {
      console.error(`LOG Error: PhonePe Check Status API call for ${merchantTransactionId} was not successful or malformed:`, statusResponse?.message || "No message in status response", "Full statusResponse:", JSON.stringify(statusResponse, null, 2));
      return NextResponse.json({ success: true, message: "Callback processed, but status check was not successful. Manual reconciliation may be needed." });
    }

    console.log(`LOG 15: Callback for MTID ${merchantTransactionId} processed successfully.`);
    return NextResponse.json({ success: true, message: "Callback processed successfully." });

  } catch (error) {
    console.error("--- LOG CATCH_ALL: ERROR IN CALLBACK HANDLER (outer try-catch) ---", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error processing callback.";
    return NextResponse.json({ success: true, message: `Callback acknowledged with internal error: ${errorMessage}` });
  }
}