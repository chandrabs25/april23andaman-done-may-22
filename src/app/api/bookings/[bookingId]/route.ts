// Path: src/app/api/bookings/[bookingId]/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database'; // Assuming this path is correct

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  const bookingIdStr = params.bookingId;
  const bookingId = parseInt(bookingIdStr, 10);

  if (isNaN(bookingId) || bookingId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid booking ID.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    const bookingDetails = await dbService.getBookingDetailsById(bookingId);

    if (!bookingDetails) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }

    // Placeholder for Security Check:
    // If bookingDetails.user_id is present, this booking belongs to an authenticated user.
    // Future implementation: check if the currently authenticated user (from request headers/session)
    // matches bookingDetails.user_id or if the user is an admin.
    // For now, any valid bookingId will return data.
    if (bookingDetails.user_id) {
        console.log(`[API GET /bookings/${bookingId}] Booking belongs to user ID: ${bookingDetails.user_id}`);
    } else {
        console.log(`[API GET /bookings/${bookingId}] This is a guest booking.`);
    }


    return NextResponse.json({ success: true, data: bookingDetails }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching booking details for ID ${bookingId}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve booking details.', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
