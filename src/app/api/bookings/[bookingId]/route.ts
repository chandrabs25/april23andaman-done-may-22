// Path: src/app/api/bookings/[bookingId]/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database'; // Assuming this path is correct
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user || !authResult.user.id) { // Also check user.id
      return NextResponse.json(
        { success: false, message: 'Authentication required to view booking details.' },
        { status: 401 }
      );
    }
    const authenticatedUserId = parseInt(authResult.user.id as string, 10);
    if (isNaN(authenticatedUserId)) {
         // This case should ideally not happen if user.id is guaranteed by auth system
         console.error("Authenticated user ID is NaN:", authResult.user.id);
         return NextResponse.json({ success: false, message: 'Invalid user ID format in authentication token.' }, { status: 500 });
    }

    const bookingIdStr = params.bookingId;
    const bookingId = parseInt(bookingIdStr, 10);

    if (isNaN(bookingId) || bookingId <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid booking ID.' }, { status: 400 });
    }

    const dbService = new DatabaseService();
    const bookingDetails = await dbService.getBookingDetailsById(bookingId);

    if (!bookingDetails) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }

    // Authorization check:
    // Allows access if the booking has no user_id (guest booking) 
    // OR if the booking's user_id matches the authenticated user.
    // TODO: Future enhancement - check for admin role for universal access.
    if (bookingDetails.user_id !== null && bookingDetails.user_id !== authenticatedUserId) {
      console.warn(`User ${authenticatedUserId} attempted to access booking ${bookingId} owned by user ${bookingDetails.user_id}`);
      return NextResponse.json(
          { success: false, message: 'You do not have permission to view this booking.' },
          { status: 403 } // Forbidden
      );
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
