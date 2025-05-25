export const dynamic = 'force-dynamic';
// src/app/api/bookings/[bookingId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth'; // Custom auth
import { dbQuery } from '@/lib/database'; // DB utility

export async function GET(request: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    const { bookingId } = params;

    if (!bookingId || isNaN(parseInt(bookingId))) {
      return NextResponse.json({ message: 'Invalid booking ID format.' }, { status: 400 });
    }

    const { isAuthenticated, user: apiUser } = await verifyAuth(request);
    const currentUserId = isAuthenticated && apiUser ? apiUser.id : null;

    const query = `
      SELECT 
        b.id AS booking_id,
        b.package_id,
        b.package_category_id,
        b.user_id,
        b.total_people,
        strftime('%Y-%m-%d', b.start_date) AS start_date,
        strftime('%Y-%m-%d', b.end_date) AS end_date,
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
    console.log(result);
    console.log(currentUserId);
    console.log(typeof currentUserId);
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }

    const bookingDetails = result.rows[0];
    console.log( bookingDetails.user_id);
    console.log(typeof bookingDetails.user_id);
    if (bookingDetails.user_id && String(bookingDetails.user_id) !== currentUserId) {
        return NextResponse.json({ message: 'Booking not found or access denied.' }, { status: 404 });
    }

    return NextResponse.json(bookingDetails, { status: 200 });

  } catch (error) {
    console.error(`Error fetching booking ${params.bookingId}:`, error);
    if (error instanceof Error && (error.message.includes("database") || error.message.includes("syntax"))) {
        return NextResponse.json({ message: 'Database error occurred.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: { 'Allow': 'GET, OPTIONS' } });
}
