// Path: src/app/api/bookings/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server'; // NextRequest for GET
import { getDb } from '../../../lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth'; // Adjust path if necessary, assuming ../../../lib/auth for now

// Interface for the Booking Database Record (align with your schema)
interface BookingDbRecord {
  id: number;
  user_id: string | number | null; // Can be string from session.user.id
  package_id: string | number;
  package_category_id: string | number; // Important: Add this field
  total_people: number;
  start_date: string; // 'YYYY-MM-DD'
  end_date: string;   // 'YYYY-MM-DD'
  status: string;     // e.g., 'pending_payment', 'confirmed', 'cancelled'
  total_amount: number;
  payment_status: string; // e.g., 'pending', 'paid', 'failed'
  payment_details: string | null;
  special_requests: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

// Interface for the expected POST request payload from client
interface BookingPayload {
  user_id?: string | number | null; // Optional from client, server validates/overrides with session
  package_id: string | number;
  package_category_id: string | number;
  total_people: number;
  start_date: string; // Expected format 'yyyy-MM-dd'
  end_date: string;   // Expected format 'yyyy-MM-dd'
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string | null;
}


// GET Handler (Updated to use next-auth)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, message: 'Authentication required to view bookings.' }, { status: 401 });
  }
  const userId = session.user.id; // session.user.id type might be string or number

  try {
    const db = getDb(); 
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'SELECT * FROM bookings WHERE user_id = ?';
    const params: (string | number)[] = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY start_date DESC';

    const stmt = db.prepare(query);
    const bookings = stmt.all(...params) as BookingDbRecord[]; 

    return NextResponse.json({ success: true, bookings: bookings || [] }, { status: 200 });
  } catch (error) {
    console.error('[API Bookings GET] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings', error: errorMessage },
      { status: 500 }
    );
  }
}


// POST Handler for Booking Creation
export async function POST(request: Request) { // Use generic Request for POST body parsing
  try {
    const payload: BookingPayload = await request.json();
    const {
      user_id: payloadUserId, 
      package_id,
      package_category_id,
      total_people,
      start_date,
      end_date,
      guest_name,
      guest_email,
      guest_phone,
      special_requests,
    } = payload;

    // Server-Side Authentication & User ID determination
    const session = await getServerSession(authOptions);
    let dbUserId: string | number | null = null;

    if (payloadUserId) { 
      if (!session || !session.user || String(session.user.id) !== String(payloadUserId)) {
        return NextResponse.json({ success: false, message: 'Unauthorized: Session does not match user_id or no active session.' }, { status: 401 });
      }
      dbUserId = payloadUserId; 
    } else { 
      dbUserId = null; 
      if (session && session.user) {
        console.warn("Guest booking (null/undefined user_id in payload) made while a session is active for user: ", session.user.id);
      }
    }
    
    // Data Validation (Basic)
    const requiredFields: (keyof Omit<BookingPayload, 'user_id' | 'special_requests'>)[] = [
        'package_id', 'package_category_id', 'total_people', 
        'start_date', 'end_date', 'guest_name', 'guest_email', 'guest_phone'
    ];
    for (const field of requiredFields) {
        // Check for undefined, null, or empty string. Allow 0 for numeric fields if it's a valid value (not for total_people here).
        if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
            return NextResponse.json({ success: false, message: `Missing required field: ${field}.` }, { status: 400 });
        }
    }

    if (typeof total_people !== 'number' || total_people <= 0) {
      return NextResponse.json({ success: false, message: 'Total people must be a number greater than 0.' }, { status: 400 });
    }
    try {
      if (new Date(end_date) <= new Date(start_date)) {
        return NextResponse.json({ success: false, message: 'End date must be after start date.' }, { status: 400 });
      }
    } catch (dateError) {
      return NextResponse.json({ success: false, message: 'Invalid start_date or end_date format.' }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(guest_email)) { // Basic email format validation
        return NextResponse.json({ success: false, message: 'Invalid guest_email format.' }, { status: 400 });
    }

    // Fetch Package Category & Verify
    const db = getDb();
    const categoryStmt = db.prepare('SELECT price, package_id AS db_package_id FROM package_categories WHERE id = ?');
    // Ensure type casting for categoryInfo if your DB driver doesn't auto-map types well
    const categoryInfo = categoryStmt.get(package_category_id) as { price: number; db_package_id: string | number } | undefined;

    if (!categoryInfo) {
      return NextResponse.json({ success: false, message: 'Selected package category not found.' }, { status: 404 });
    }
    if (String(categoryInfo.db_package_id) !== String(package_id)) { // Compare as strings for type safety
      return NextResponse.json({ success: false, message: 'Category does not belong to the specified package.' }, { status: 400 });
    }

    // Calculate Total Amount
    const totalAmount = categoryInfo.price * total_people;

    // Database Insertion
    const sqlInsertStatement = `
      INSERT INTO bookings (
          user_id, package_id, package_category_id, total_people,
          start_date, end_date, total_amount, status, payment_status,
          guest_name, guest_email, guest_phone, special_requests,
          created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_payment', 'pending', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;
    const bindings = [
      dbUserId, 
      package_id, 
      package_category_id, 
      total_people, 
      start_date, // Dates are 'yyyy-MM-dd' strings, directly usable by SQLite
      end_date, 
      totalAmount, 
      guest_name, 
      guest_email, 
      guest_phone, 
      special_requests || null // Ensure null if undefined/empty
    ];
    
    const insertStmt = db.prepare(sqlInsertStatement);
    const result = insertStmt.run(...bindings); 
    const newBookingId = result.lastRowid; 

    // Check if lastRowid is valid (0 is a possible valid ID if table is empty and PK starts at 0)
    if (newBookingId === undefined || newBookingId === null) { 
        console.error("Booking insert failed or lastRowid not returned as expected:", result);
        return NextResponse.json({ success: false, message: 'Failed to create booking in database or retrieve booking ID.' }, { status: 500 });
    }

    // Successful Response
    return NextResponse.json({ 
      success: true, 
      booking_id: newBookingId, 
      message: 'Booking successfully created. Please proceed to payment.' 
    }, { status: 201 });

  } catch (error: any) { 
    console.error('[API Bookings POST] Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error while creating booking.', 
      error: error?.message || 'An unknown error occurred.' 
    }, { status: 500 });
  }
}
