// src/app/api/bookings/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path as needed
import { dbQuery } from '@/lib/database'; // Assuming this is the DB utility

interface BookingRequestBody {
  packageId: number;
  packageCategoryId: number;
  total_people: number;
  start_date: string;
  end_date: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
}

// Helper to validate if a string is a valid date
function isValidDate(dateString: string): boolean {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null; // Get user ID or null if not logged in

    const body: BookingRequestBody = await request.json();

    // 1. Validate presence of required fields
    const requiredFields: (keyof BookingRequestBody)[] = [
      'packageId', 'packageCategoryId', 'total_people', 'start_date', 'end_date',
      'guest_name', 'guest_email', 'guest_phone'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json({ message: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // 2. Validate data types
    if (typeof body.packageId !== 'number' || !Number.isInteger(body.packageId)) {
      return NextResponse.json({ message: 'Invalid packageId: must be an integer' }, { status: 400 });
    }
    if (typeof body.packageCategoryId !== 'number' || !Number.isInteger(body.packageCategoryId)) {
      return NextResponse.json({ message: 'Invalid packageCategoryId: must be an integer' }, { status: 400 });
    }
    if (typeof body.total_people !== 'number' || !Number.isInteger(body.total_people) || body.total_people < 1) {
      return NextResponse.json({ message: 'Invalid total_people: must be a positive integer' }, { status: 400 });
    }
    if (typeof body.start_date !== 'string' || !isValidDate(body.start_date)) {
      return NextResponse.json({ message: 'Invalid start_date: must be a valid date in YYYY-MM-DD format' }, { status: 400 });
    }
    if (typeof body.end_date !== 'string' || !isValidDate(body.end_date)) {
      return NextResponse.json({ message: 'Invalid end_date: must be a valid date in YYYY-MM-DD format' }, { status: 400 });
    }
    if (typeof body.guest_name !== 'string' || body.guest_name.trim().length === 0) {
      return NextResponse.json({ message: 'Guest name cannot be empty' }, { status: 400 });
    }
    if (typeof body.guest_email !== 'string' || !/\S+@\S+\.\S+/.test(body.guest_email)) {
      return NextResponse.json({ message: 'Invalid guest_email format' }, { status: 400 });
    }
    if (typeof body.guest_phone !== 'string' || body.guest_phone.trim().length === 0) {
      return NextResponse.json({ message: 'Guest phone cannot be empty' }, { status: 400 });
    }
    if (body.special_requests !== undefined && typeof body.special_requests !== 'string') {
      return NextResponse.json({ message: 'Invalid special_requests: must be a string if provided' }, { status: 400 });
    }

    // 3. Date logic validation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    const startDate = new Date(body.start_date);
    const endDate = new Date(body.end_date);

    if (startDate < today) {
      return NextResponse.json({ message: 'Start date cannot be in the past' }, { status: 400 });
    }
    if (endDate <= startDate) {
      return NextResponse.json({ message: 'End date must be after the start date' }, { status: 400 });
    }

    // 4. Database Validation (Package & Category)
    const packageResult = await dbQuery('SELECT id FROM packages WHERE id = $1 AND is_active = 1', [body.packageId]);
    if (packageResult.rowCount === 0) {
      return NextResponse.json({ message: 'Package not found or is not active' }, { status: 404 });
    }

    const categoryResult = await dbQuery(
      'SELECT id, package_id, price FROM package_categories WHERE id = $1', 
      [body.packageCategoryId]
    );

    if (categoryResult.rowCount === 0) {
      return NextResponse.json({ message: 'Package category not found' }, { status: 404 });
    }

    const category = categoryResult.rows[0];
    if (category.package_id !== body.packageId) {
      return NextResponse.json({ message: 'Package category does not belong to the specified package' }, { status: 400 });
    }

    // 5. Calculate Total Amount (Server-Side)
    const packageCategoryPrice = parseFloat(category.price);
    if (isNaN(packageCategoryPrice)) {
        // This should ideally not happen if DB data is clean
        console.error('Invalid price for category:', category);
        return NextResponse.json({ message: 'Error calculating total amount due to invalid category price.' }, { status: 500 });
    }
    const totalAmount = packageCategoryPrice * body.total_people;

    // 6. Database Insertion
    const insertQuery = `
      INSERT INTO bookings (
        user_id, package_id, package_category_id, total_people, start_date, end_date, 
        status, total_amount, payment_status, guest_name, guest_email, guest_phone, special_requests
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;
    
    // Default status values from schema: status = 'pending', payment_status = 'pending'
    const bookingParams = [
      userId,                           // user_id
      body.packageId,                 // package_id
      body.packageCategoryId,         // package_category_id
      body.total_people,              // total_people
      body.start_date,                // start_date
      body.end_date,                  // end_date
      'pending',                      // status (default)
      totalAmount,                    // total_amount (server-calculated)
      'pending',                      // payment_status (default)
      body.guest_name,                // guest_name
      body.guest_email,               // guest_email
      body.guest_phone,               // guest_phone
      body.special_requests || null   // special_requests (null if empty or not provided)
    ];

    const bookingInsertResult = await dbQuery(insertQuery, bookingParams);

    if (bookingInsertResult.rowCount > 0 && bookingInsertResult.rows[0].id) {
      return NextResponse.json({
        message: 'Booking created successfully!',
        booking_id: bookingInsertResult.rows[0].id,
      }, { status: 201 });
    } else {
      console.error("Booking insertion failed:", bookingInsertResult);
      return NextResponse.json({ message: 'Failed to create booking. Please try again.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof SyntaxError) { // From request.json() if body is malformed
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}

// Basic OPTIONS handler for CORS preflight (if needed by your setup)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: { 'Allow': 'POST, OPTIONS' } });
}

