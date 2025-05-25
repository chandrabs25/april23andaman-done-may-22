import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { generateXVerifyHeader } from '../../../../lib/phonepeUtils';
import { DatabaseService } from '../../../../lib/database'; // Import D1 Database Service

const dbService = new DatabaseService();

interface GuestDetails {
  name?: string;
  email?: string;
  mobileNumber?: string;
}

interface BookingDetails {
  packageId: string;
  categoryId: string;
  userId: string; 
  guestDetails: GuestDetails;
  dates: {
    startDate: string;
    endDate: string;
  };
  totalPeople: number;
  specialRequests?: string; // Added specialRequests
}

export async function POST(request: NextRequest) {
  let newBookingId: string | null = null; // To store D1 generated booking ID

  try {
    const body: BookingDetails = await request.json();

    if (!body.packageId || !body.categoryId || !body.totalPeople || body.totalPeople <= 0 || !body.dates?.startDate || !body.dates?.endDate) {
      // Removed userId check from here as it can be null for guests.
      // The backend (D1 insert) will handle userId: null if body.userId is not present.
      return NextResponse.json({ success: false, message: "Missing or invalid booking details." }, { status: 400 });
    }

    // Mock Package Price Fetching - TODO: Replace with actual logic
    let pricePerPersonInPaise: number;
    switch (body.categoryId) {
      case 'A': pricePerPersonInPaise = 100000; break;
      case 'B': pricePerPersonInPaise = 200000; break;
      default: pricePerPersonInPaise = 150000;
    }
    console.log(`TODO: Fetch actual price for packageId: ${body.packageId}, categoryId: ${body.categoryId}`);
    const totalAmountInPaise = pricePerPersonInPaise * body.totalPeople;
    
    const merchantUserId = body.userId || `GUEST_${crypto.randomUUID()}`;

    // 1. Database Interaction - Create Booking using D1
    const d1BookingData = {
      package_id: parseInt(body.packageId, 10) || null,
      package_category_id: parseInt(body.categoryId, 10) || null,
      // Ensure userId is parsed to int if present, otherwise null. D1 schema expects INT for user_id.
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
      newBookingId = String(createBookingResult.meta.last_row_id);
    } catch (dbError) {
      console.error("Database error creating booking with D1:", dbError);
      return NextResponse.json({ success: false, message: "Failed to save booking details." }, { status: 500 });
    }

    const clientRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking-payment-status?mtid=${newBookingId}`;
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/phonepe-callback`;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: newBookingId, // Use D1 generated ID
      merchantUserId: merchantUserId,
      amount: totalAmountInPaise,
      redirectUrl: clientRedirectUrl,
      redirectMode: "POST", 
      callbackUrl: callbackUrl,
      mobileNumber: body.guestDetails?.mobileNumber,
      paymentInstrument: { type: "PAY_PAGE" }
    };
    if (!payload.mobileNumber) delete payload.mobileNumber;

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const apiEndpointPath = "/pg/v1/pay";
    const xVerify = generateXVerifyHeader(
      payloadBase64,
      apiEndpointPath,
      process.env.PHONEPE_SALT_KEY!,
      process.env.PHONEPE_SALT_INDEX!
    );

    // 3. Call PhonePe Pay API
    const phonePeResponseRaw = await fetch(process.env.PHONEPE_PAY_API_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify, 'Accept': 'application/json' },
      body: JSON.stringify({ request: payloadBase64 }),
    });
    const phonePeResponse = await phonePeResponseRaw.json();

    if (phonePeResponse.success && phonePeResponse.data?.instrumentResponse?.redirectInfo?.url) {
      // Optional: Update booking with PhonePe's own transaction ID if needed (e.g., from phonePeResponse.data.transactionId)
      // await dbService.updateBookingStatusAndPaymentStatus(newBookingId, 'PENDING_PAYMENT', 'INITIATED', phonePeResponse.data.transactionId);
      return NextResponse.json({
        success: true,
        redirectUrl: phonePeResponse.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId: newBookingId,
      });
    } else {
      console.error("PhonePe API call failed:", phonePeResponse);
      // Update booking status to FAILED in D1
      if (newBookingId) { // Ensure newBookingId was set
        await dbService.updateBookingStatusAndPaymentStatus(newBookingId, 'FAILED', 'FAILED');
      }
      return NextResponse.json({
        success: false,
        message: phonePeResponse.message || "Payment initiation failed with PhonePe.",
        details: phonePeResponse.code, 
      }, { status: phonePeResponseRaw.status !== 200 ? phonePeResponseRaw.status : 400 });
    }

  } catch (error) {
    console.error("Error in initiate-payment route:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    // If a booking record was potentially created (newBookingId is not null) and an error occurred AFTERWARD (e.g., during PhonePe API call preparation or fetch itself)
    // We might want to mark this booking as FAILED in D1.
    if (newBookingId && !(error instanceof Error && error.message.includes('Failed to save booking details'))) { // Avoid double update if initial DB save failed
        try {
            await dbService.updateBookingStatusAndPaymentStatus(newBookingId, 'FAILED', 'FAILED');
            console.log(`Booking ${newBookingId} marked as FAILED due to error: ${errorMessage}`);
        } catch (dbUpdateError) {
            console.error(`Failed to update booking ${newBookingId} to FAILED after an error:`, dbUpdateError);
        }
    }
    return NextResponse.json({ success: false, message: "Error processing payment initiation.", errorDetail: errorMessage }, { status: 500 });
  }
}
