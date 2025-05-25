// src/app/api/bookings/[bookingId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust if your authOptions are elsewhere
import { dbQuery } from '@/lib/database'; // Assuming DB utility

export async function GET(request: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    const { bookingId } = params;

    if (!bookingId || isNaN(parseInt(bookingId))) {
      return NextResponse.json({ message: 'Invalid booking ID format.' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    // Query to fetch booking details along with package and category names
    const query = `
      SELECT 
        b.id AS booking_id,
        b.package_id,
        b.package_category_id,
        b.user_id,
        b.total_people,
        TO_CHAR(b.start_date, 'YYYY-MM-DD') AS start_date,
        TO_CHAR(b.end_date, 'YYYY-MM-DD') AS end_date,
        b.status AS booking_status,
        b.total_amount,
        b.payment_status,
        b.guest_name,
        b.guest_email,
        b.guest_phone,
        b.special_requests,
        b.created_at AS booking_created_at,
        p.name AS package_name,
        pc.category_name AS package_category_name,
        pc.price AS category_price_per_person
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN package_categories pc ON b.package_category_id = pc.id
      WHERE b.id = $1;
    `;

    const result = await dbQuery(query, [parseInt(bookingId)]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    const bookingDetails = result.rows[0];

    // Security Check: If the booking has a user_id, it must match the current session user_id.
    // If booking.user_id is null, it's considered a guest booking (for this scope).
    if (bookingDetails.user_id && bookingDetails.user_id !== currentUserId) {
        // To avoid leaking information that a booking exists, return 404 instead of 403 for non-matching users.
        // A true 403 might be reserved for roles/permissions checks if an admin system were in place.
        return NextResponse.json({ message: 'Booking not found or access denied.' }, { status: 404 });
    }

    // If booking.user_id is null, or if it matches currentUserId, proceed.
    return NextResponse.json(bookingDetails, { status: 200 });

  } catch (error) {
    console.error(`Error fetching booking ${params.bookingId}:`, error);
    // Check if error is due to DB connection or query syntax, etc.
    if (error instanceof Error && (error.message.includes("database") || error.message.includes("syntax"))) {
        return NextResponse.json({ message: 'Database error occurred.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}

// Basic OPTIONS handler for CORS preflight (if needed by your setup)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: { 'Allow': 'GET, OPTIONS' } });
}
