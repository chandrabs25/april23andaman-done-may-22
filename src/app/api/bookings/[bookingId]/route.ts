import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/database'; // Path relative to src/app/api/bookings/[bookingId]/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth'; // Path relative to src/app/api/bookings/[bookingId]/route.ts

export async function GET(request: Request, { params }: { params: { bookingId: string } }) {
  const bookingId = params.bookingId;

  if (!bookingId) {
    return NextResponse.json({ success: false, message: 'Booking ID is required.' }, { status: 400 });
  }

  try {
    const db = getDb();

    const SQL_QUERY = `
      SELECT
          b.id, b.user_id, b.package_id, b.package_category_id, b.total_people,
          b.start_date, b.end_date, b.total_amount, b.status, b.payment_status,
          b.guest_name, b.guest_email, b.guest_phone, b.special_requests,
          b.created_at, b.updated_at,
          p.name AS package_name,
          p.primary_image AS primary_package_image,
          pc.category_name AS category_name
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN package_categories pc ON b.package_category_id = pc.id
      WHERE b.id = ?;
    `;
    
    const bookingStmt = db.prepare(SQL_QUERY);
    // Assuming bookingId from params might be string, db driver usually handles type conversion for '?'
    const booking = bookingStmt.get(bookingId) as any; // Cast as any for now, or define a proper joined type

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }

    // Security Check
    const session = await getServerSession(authOptions);

    if (booking.user_id !== null) { // Check if it's a user's booking (not a guest's)
      if (!session || !session.user || String(session.user.id) !== String(booking.user_id)) {
        // Add admin check here in the future if roles are implemented: && !session.user.isAdmin
        return NextResponse.json({ success: false, message: 'Forbidden. You do not have access to this booking.' }, { status: 403 });
      }
    }
    // If booking.user_id is null, it's a guest booking. 
    // Access control for guest bookings might be handled differently (e.g., via a temporary token or link, not covered here).
    // For this task, if user_id is null, we allow fetching (assuming it's a guest booking accessed via its ID).

    return NextResponse.json({ success: true, booking }, { status: 200 });

  } catch (error: any) { // Catch any for error.message
    console.error(`[API GET /api/bookings/${bookingId}] Error:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error.', 
      error: error?.message || 'An unknown error occurred.' // Provide error message
    }, { status: 500 });
  }
}
