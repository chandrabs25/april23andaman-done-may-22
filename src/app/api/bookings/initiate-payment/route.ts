// File: src/app/api/bookings/initiate-payment/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { generateXVerifyHeader } from '../../../../lib/phonepeUtils'; // Adjust path if needed
import { DatabaseService } from '../../../../lib/database'; // Adjust path if needed

// --- Interface Definition for PhonePe Pay API Response ---
interface PhonePePayApiResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId?: string;
    instrumentResponse?: {
      type?: string;
      redirectInfo?: {
        url: string;
        method: string;
      };
    };
  };
}
// --- End Interface Definition ---

const dbService = new DatabaseService();

interface GuestDetails {
  name?: string;
  email?: string;
  mobileNumber?: string;
}

interface BookingDetails {
  packageId: string;
  categoryId: string;
  userId: string | null; // userId can be null for guest users
  guestDetails: GuestDetails;
  dates: {
    startDate: string;
    endDate: string;
  };
  totalPeople: number;
  specialRequests?: string;
}

export async function POST(request: NextRequest) {
  let newBookingIdAsString: string | null = null; // To store D1 generated booking ID as string
  let newBookingIdAsNumber: number | null = null; // To store D1 generated booking ID as number for DB calls

  try {
    const body: BookingDetails = await request.json();

    if (!body.packageId || !body.categoryId || !body.totalPeople || body.totalPeople <= 0 || !body.dates?.startDate || !body.dates?.endDate) {
      return NextResponse.json({ success: false, message: "Missing or invalid booking details." }, { status: 400 });
    }

    // Mock Package Price Fetching - TODO: Replace with actual logic
    let pricePerPersonInPaise: number;
    switch (body.categoryId) {
      // Ensure these category IDs match what you expect (string vs number)
      case '1': pricePerPersonInPaise = 100000; break; // Example if categoryId from body is string
      case '2': pricePerPersonInPaise = 200000; break;
      default: pricePerPersonInPaise = 100; // Default for safety, ensure this is handled
    }
    console.log(`INFO: Using mock price. Actual price fetching for packageId: ${body.packageId}, categoryId: ${body.categoryId} is a TODO.`);
    const totalAmountInPaise = pricePerPersonInPaise * body.totalPeople;

    const merchantUserId = body.userId || `GUEST_${crypto.randomUUID()}`;

    const d1BookingData = {
      package_id: parseInt(body.packageId, 10) || null,
      package_category_id: parseInt(body.categoryId, 10) || null,
      user_id: body.userId ? parseInt(body.userId, 10) : null,
      total_amount: totalAmountInPaise,
      guest_name: body.guestDetails?.name || null,
      guest_email: body.guestDetails?.email || null,
      guest_phone: body.guestDetails?.mobileNumber || null,
      start_date: body.dates.startDate,
      end_date: body.dates.endDate,
      total_people: body.totalPeople,
      special_requests: body.specialRequests || null,
    };

    try {
      const createBookingResult = await dbService.createInitialPhonePeBooking(d1BookingData);
      if (!createBookingResult.success || !createBookingResult.meta?.last_row_id) {
        console.error("D1 error creating booking:", createBookingResult.error);
        throw new Error(createBookingResult.error || 'Failed to create booking in D1 or get last_row_id.');
      }
      newBookingIdAsNumber = createBookingResult.meta.last_row_id;
      newBookingIdAsString = String(newBookingIdAsNumber);
      console.log(`INFO: Booking created with ID (merchantTransactionId): ${newBookingIdAsString}`);
    } catch (dbError) {
      console.error("Database error creating booking with D1:", dbError);
      return NextResponse.json({ success: false, message: "Failed to save booking details." }, { status: 500 });
    }
    console.log('hardcoded site url: http://127.0.0.1:8787 because env variables are not working for site url but ngrok url is working for callback url')
    
    const clientRedirectUrl = `http://127.0.0.1:8787/booking-payment-status?mtid=${newBookingIdAsString}`;
    // THIS IS THE CRUCIAL LOG:
    console.log("DEBUG: Sending this redirectUrl to PhonePe (clientRedirectUrl):", clientRedirectUrl);

    const siteUrl = process.env.NGROK_PUBLIC_URL?.trim() || process.env.SITE_URL;
    const s2sCallbackUrl = `${siteUrl}/api/bookings/phonepe-callback`;
    console.log("DEBUG: Using this S2S callbackUrl for PhonePe:", s2sCallbackUrl);

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: newBookingIdAsString,
      merchantUserId: merchantUserId,
      amount: totalAmountInPaise,
      redirectUrl: clientRedirectUrl,
      redirectMode: "GET",
      callbackUrl: s2sCallbackUrl,
      mobileNumber: body.guestDetails?.mobileNumber,
      paymentInstrument: { type: "PAY_PAGE" }
    };
    if (!payload.mobileNumber) delete payload.mobileNumber;

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    console.log("DEBUG: Full payload being sent to PhonePe:", JSON.stringify(payload, null, 2));
    const apiEndpointPath = "/pg/v1/pay";

    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    if (!saltKey) {
      console.error("CRITICAL: PHONEPE_SALT_KEY environment variable is not set.");
      return NextResponse.json({ success: false, message: "Payment gateway configuration error. [Ref: SK_MISSING]" }, { status: 500 });
    }
    if (!saltIndex) {
      console.error("CRITICAL: PHONEPE_SALT_INDEX environment variable is not set.");
      return NextResponse.json({ success: false, message: "Payment gateway configuration error. [Ref: SI_MISSING]" }, { status: 500 });
    }

    const xVerify = generateXVerifyHeader(payloadBase64, apiEndpointPath, saltKey, saltIndex);

    console.log("DEBUG: Calling PhonePe Pay API. URL:", process.env.PHONEPE_PAY_API_URL);
    const phonePeResponseRaw = await fetch(process.env.PHONEPE_PAY_API_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify, 'Accept': 'application/json' },
      body: JSON.stringify({ request: payloadBase64 }),
    });
    const phonePeResponse: PhonePePayApiResponse = await phonePeResponseRaw.json();
    console.log("DEBUG: PhonePe Pay API Response:", JSON.stringify(phonePeResponse, null, 2));

    if (phonePeResponse.success && phonePeResponse.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        redirectUrl: phonePeResponse.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId: newBookingIdAsString,
      });
    } else {
      console.error("PhonePe API call failed or returned unexpected response:", phonePeResponse);
      if (newBookingIdAsString) {
        await dbService.updateBookingStatusAndPaymentStatus(newBookingIdAsString, 'FAILED', 'FAILED', null);
      }
      return NextResponse.json({
        success: false,
        message: phonePeResponse.message || "Payment initiation failed with PhonePe.",
        details: phonePeResponse.code,
      }, { status: phonePeResponseRaw.status !== 200 ? phonePeResponseRaw.status : 400 });
    }

  } catch (error) {
    console.error("Error in initiate-payment route (outer catch block):", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    if (newBookingIdAsString && !(error instanceof Error && error.message.includes('Failed to save booking details'))) {
      try {
        await dbService.updateBookingStatusAndPaymentStatus(newBookingIdAsString, 'FAILED', 'FAILED', null);
        console.log(`Booking ${newBookingIdAsString} marked as FAILED due to error: ${errorMessage}`);
      } catch (dbUpdateError) {
        console.error(`Failed to update booking ${newBookingIdAsString} to FAILED after an error:`, dbUpdateError);
      }
    }
    return NextResponse.json({ success: false, message: "Error processing payment initiation.", errorDetail: errorMessage }, { status: 500 });
  }
}