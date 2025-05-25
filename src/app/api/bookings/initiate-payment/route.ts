import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { generateXVerifyHeader } from '../../../../lib/phonepeUtils';
import prisma from '../../../../lib/prisma'; // Import Prisma client

interface GuestDetails {
  name?: string;
  email?: string;
  mobileNumber?: string;
}

interface BookingDetails {
  packageId: string;
  categoryId: string;
  userId: string; // Assuming userId will be available from auth or request
  guestDetails: GuestDetails;
  dates: {
    startDate: string;
    endDate: string;
  };
  totalPeople: number;
}

export async function POST(request: NextRequest) {
  let merchantTransactionId = crypto.randomUUID(); // Define here to be accessible in catch block if needed

  try {
    const body: BookingDetails = await request.json();

    // TODO: Add proper validation for body (e.g., using Zod or a similar library)
    if (!body.packageId || !body.categoryId || !body.userId || !body.totalPeople || body.totalPeople <= 0 || !body.dates?.startDate || !body.dates?.endDate) {
      return NextResponse.json({ success: false, message: "Missing or invalid booking details." }, { status: 400 });
    }

    // Mock Package Price Fetching
    // TODO: Integrate with actual price fetching from /api/packages/[id]/route.ts
    let pricePerPersonInPaise: number;
    switch (body.categoryId) {
      case 'A':
        pricePerPersonInPaise = 100000; // Rs. 1000.00
        break;
      case 'B':
        pricePerPersonInPaise = 200000; // Rs. 2000.00
        break;
      default:
        pricePerPersonInPaise = 150000; // Default price Rs. 1500.00
    }
    console.log(`TODO: Fetch actual price for packageId: ${body.packageId}, categoryId: ${body.categoryId}`);

    const totalAmountInPaise = pricePerPersonInPaise * body.totalPeople;
    
    // Use userId from request for merchantUserId, or generate one for guests
    const merchantUserId = body.userId || "GUEST_" + crypto.randomUUID();

    // 1. Database Interaction - Create Booking
    let newBooking;
    try {
      newBooking = await prisma.booking.create({
        data: {
          id: merchantTransactionId,
          userId: body.userId || null, // Handle guest users by allowing null if DB schema permits
          packageId: body.packageId,
          packageCategoryId: body.categoryId,
          totalAmount: totalAmountInPaise,
          status: 'PENDING_PAYMENT', // Ensure this enum value exists in your schema
          paymentStatus: 'INITIATED', // Ensure this enum value exists in your schema
          startDate: new Date(body.dates.startDate),
          endDate: new Date(body.dates.endDate),
          totalPeople: body.totalPeople,
          guestName: body.guestDetails?.name,
          guestEmail: body.guestDetails?.email,
          guestMobile: body.guestDetails?.mobileNumber,
          // Add other relevant fields as per your schema
        },
      });
    } catch (dbError) {
      console.error("Database error creating booking:", dbError);
      return NextResponse.json({ success: false, message: "Failed to save booking details." }, { status: 500 });
    }

    const clientRedirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/booking-payment-status?mtid=${newBooking.id}`;
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/phonepe-callback`;

    // Prepare PhonePe Pay API Request Payload
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: newBooking.id, // Use the ID from the created booking record
      merchantUserId: merchantUserId,
      amount: totalAmountInPaise,
      redirectUrl: clientRedirectUrl,
      redirectMode: "POST", 
      callbackUrl: callbackUrl,
      mobileNumber: body.guestDetails?.mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    if (!payload.mobileNumber) {
      delete payload.mobileNumber;
    }

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
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ request: payloadBase64 }), // IMPORTANT: Wrap base64 payload
    });

    const phonePeResponse = await phonePeResponseRaw.json();

    if (phonePeResponse.success && phonePeResponse.data?.instrumentResponse?.redirectInfo?.url) {
      // Optional: Update booking with PhonePe's transaction ID if different or any other reference
      // await prisma.booking.update({
      //   where: { id: newBooking.id },
      //   data: { phonepeTransactionId: phonePeResponse.data.transactionId (example) }, 
      // });
      return NextResponse.json({
        success: true,
        redirectUrl: phonePeResponse.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId: newBooking.id,
      });
    } else {
      console.error("PhonePe API call failed:", phonePeResponse);
      // Update booking status to FAILED in DB
      await prisma.booking.update({
        where: { id: newBooking.id },
        data: { status: 'FAILED', paymentStatus: 'FAILED' }, // Ensure these enum values exist
      });
      return NextResponse.json({
        success: false,
        message: phonePeResponse.message || "Payment initiation failed with PhonePe.",
        details: phonePeResponse.code, 
      }, { status: phonePeResponseRaw.status !== 200 ? phonePeResponseRaw.status : 400 });
    }

  } catch (error) {
    console.error("Error in initiate-payment route:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    // If a booking record was potentially created before an unhandled error
    // you might want to attempt to update its status to FAILED here,
    // but ensure `merchantTransactionId` is defined and the error isn't from the DB creation itself.
    // This part can be complex and depends on how you want to handle partial failures.
    return NextResponse.json({ success: false, message: "Error processing payment initiation.", errorDetail: errorMessage }, { status: 500 });
  }
}
