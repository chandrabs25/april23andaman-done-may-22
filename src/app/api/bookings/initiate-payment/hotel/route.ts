import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { generateXVerifyHeader } from '../../../../../lib/phonepeUtils';
import { DatabaseService } from '../../../../../lib/database';
import { bookingSystem } from '../../../../../lib/booking-system';

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

const dbService = new DatabaseService();

interface GuestDetails {
  name?: string;
  email?: string;
  mobileNumber?: string;
}

interface HotelBookingDetails {
  holdId?: number | null;
  sessionId: string;
  userId: string | null;
  guestDetails: GuestDetails;
  numberOfRooms: number;
  numberOfGuests: number;
  specialRequests?: string;
  // Direct booking data for fallback
  hotelId?: number;
  roomTypeId?: number;
  checkInDate?: string;
  checkOutDate?: string;
  totalAmount?: number;
}

export async function POST(request: NextRequest) {
  let holdId: number | null = null;
  
  try {
    const body: HotelBookingDetails = await request.json();
    holdId = body.holdId || null; // Store for error handling
    console.log("DEBUG: Received hotel booking details:", JSON.stringify(body, null, 2));

    // Validation - check if we have either hold-based or direct booking data
    if (!body.sessionId || !body.numberOfRooms || body.numberOfRooms <= 0 || 
        !body.numberOfGuests || body.numberOfGuests <= 0) {
      return NextResponse.json({ success: false, message: "Missing or invalid booking details." }, { status: 400 });
    }

    // Check if we have either hold data or direct booking data
    const hasHoldData = body.holdId;
    const hasDirectData = body.hotelId && body.roomTypeId && body.checkInDate && body.checkOutDate && body.totalAmount;
    
    if (!hasHoldData && !hasDirectData) {
      return NextResponse.json({ 
        success: false, 
        message: "Either hold ID or complete booking details (hotel, room, dates, amount) are required." 
      }, { status: 400 });
    }

    let roomTypeId: number;
    let serviceId: number;
    let holdPrice: number;
    let targetHold: any = null;
    let newBookingId: number | null = null;

    if (hasHoldData && body.holdId) {
      // Get the hold details to extract booking information
      const holds = await bookingSystem.getActiveHolds(body.sessionId);
      targetHold = holds.find(hold => hold.id === body.holdId && hold.status === 'active');
      
      if (!targetHold) {
        return NextResponse.json({ 
          success: false, 
          message: "Hold not found or expired. Please check availability again." 
        }, { status: 400 });
      }

      // Verify hold hasn't expired
      const now = new Date();
      const expiresAt = new Date(targetHold.expires_at);
      if (now >= expiresAt) {
        await bookingSystem.updateHoldStatus(body.holdId, 'expired');
        return NextResponse.json({ 
          success: false, 
          message: "Hold has expired. Please check availability again." 
        }, { status: 400 });
      }

      // Get hold details
      roomTypeId = targetHold.room_type_id;
      serviceId = targetHold.service_id;
      holdPrice = targetHold.hold_price;

      if (!roomTypeId || !serviceId || !holdPrice) {
        return NextResponse.json({ 
          success: false, 
          message: "Invalid hold data. Please check availability again." 
        }, { status: 400 });
      }
    } else {
      // Direct booking: create booking immediately so we have bookingId
      roomTypeId = body.roomTypeId!;
      serviceId = body.hotelId!;
      holdPrice = body.totalAmount!;

      // Create initial hotel booking record
      const bookingResult = await dbService.createInitialHotelBooking({
        service_id: serviceId,
        hotel_room_type_id: roomTypeId,
        user_id: body.userId ? parseInt(body.userId) : null,
        total_amount: holdPrice,
        guest_name: body.guestDetails?.name || null,
        guest_email: body.guestDetails?.email || null,
        guest_phone: body.guestDetails?.mobileNumber || null,
        start_date: body.checkInDate!,
        end_date: body.checkOutDate!,
        total_people: body.numberOfGuests,
        number_of_rooms: body.numberOfRooms,
        special_requests: body.specialRequests || null,
      });

      if (!bookingResult.success) {
        return NextResponse.json({ success:false, message:'Failed to create booking.'},{status:500});
      }

      newBookingId = bookingResult.meta.last_row_id;
    }

    // Get room type details for validation
    try {
      const roomType = await dbService.getRoomTypeById(roomTypeId);
      if (!roomType) {
        return NextResponse.json({ success: false, message: "Room type not found." }, { status: 404 });
      }

      // Use hold price (already calculated and locked)
      const totalAmountInPaise = Math.round(holdPrice * 100);

      console.log(`INFO: Hotel booking with hold - Total: ₹${totalAmountInPaise / 100}, Hold ID: ${body.holdId}`);

      const merchantUserId = body.userId || `GUEST_${crypto.randomUUID()}`;
      
      // Use completely unique merchant transaction id (UUID)
      const merchantTransactionId = crypto.randomUUID();

      // Persist payment attempt row (bookingId will be linked later if hold converts)
      try {
        await dbService.createPaymentAttempt(
          hasHoldData ? null : newBookingId,
          merchantTransactionId,
          totalAmountInPaise,
          'INITIATED',
          hasHoldData ? body.holdId! : null
        );
      } catch (attemptErr) {
        console.error('Failed to write payment_attempt for hotel booking:', attemptErr);
      }

      // PhonePe Payment Setup
      const clientRedirectUrl = `${process.env.NGROK_PUBLIC_URL}/api/bookings/booking-payment-status?mtid=${merchantTransactionId}`;
      console.log("DEBUG: Sending this redirectUrl to PhonePe (clientRedirectUrl):", clientRedirectUrl);

      const siteUrl = process.env.NGROK_PUBLIC_URL?.trim() || process.env.SITE_URL;
      const s2sCallbackUrl = `${siteUrl}/api/bookings/phonepe-callback`;
      console.log("DEBUG: Using this S2S callbackUrl for PhonePe:", s2sCallbackUrl);

      const payload = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
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

      console.log("DEBUG: Calling PhonePe Pay API for hotel booking. URL:", process.env.PHONEPE_PAY_API_URL);
      const phonePeResponseRaw = await fetch(process.env.PHONEPE_PAY_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify, 'Accept': 'application/json' },
        body: JSON.stringify({ request: payloadBase64 }),
      });

      const phonePeResponse: PhonePePayApiResponse = await phonePeResponseRaw.json();
      console.log("DEBUG: PhonePe Pay API Response for hotel booking:", JSON.stringify(phonePeResponse, null, 2));

      if (phonePeResponse.success && phonePeResponse.data?.instrumentResponse?.redirectInfo?.url) {
        return NextResponse.json({
          success: true,
          redirectUrl: phonePeResponse.data.instrumentResponse.redirectInfo.url,
          merchantTransactionId: merchantTransactionId,
          holdId: body.holdId || null,
        });
      } else {
        console.error("PhonePe API call failed for hotel booking or returned unexpected response:", phonePeResponse);
        // Mark hold as cancelled on payment failure
        if (body.holdId) {
          await bookingSystem.updateHoldStatus(body.holdId, 'cancelled');
        }
        return NextResponse.json({
          success: false,
          message: phonePeResponse.message || "Payment initiation failed with PhonePe.",
          details: phonePeResponse.code,
        }, { status: phonePeResponseRaw.status !== 200 ? phonePeResponseRaw.status : 400 });
      }

    } catch (dbError) {
      console.error("Database error during hotel booking creation:", dbError);
      // Mark hold as cancelled on database error
      if (body.holdId) {
        await bookingSystem.updateHoldStatus(body.holdId, 'cancelled');
      }
      return NextResponse.json({ success: false, message: "Failed to fetch room details or process booking." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in hotel booking initiate-payment route (outer catch block):", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    // Mark hold as cancelled on any error
    if (holdId) {
      try {
        await bookingSystem.updateHoldStatus(holdId, 'cancelled');
        console.log(`Hold ${holdId} marked as cancelled due to error: ${errorMessage}`);
      } catch (holdUpdateError) {
        console.error(`Failed to update hold ${holdId} to cancelled after an error:`, holdUpdateError);
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Error processing hotel booking payment initiation.", 
      errorDetail: errorMessage 
    }, { status: 500 });
  }
} 