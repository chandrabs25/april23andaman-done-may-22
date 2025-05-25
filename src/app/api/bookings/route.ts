// Path: src/app/api/bookings/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

interface BookingCreationPayload {
  packageId: number;
  packageCategoryId: number;
  totalPeople: number;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  userId?: number | string | null; // Can be null for guest
  // clientCalculatedTotalAmount is not strictly needed for backend processing but might be logged
}

export async function POST(request: NextRequest) {
  try {
    const payload: BookingCreationPayload = await request.json();

    // --- Server-Side Validation ---
    if (!payload.packageId || !payload.packageCategoryId || !payload.totalPeople || 
        !payload.startDate || !payload.endDate || !payload.guestName || 
        !payload.guestEmail || !payload.guestPhone) {
      return NextResponse.json({ success: false, message: "Validation failed: Missing required fields." }, { status: 400 });
    }

    if (payload.totalPeople <= 0) {
      return NextResponse.json({ success: false, message: "Validation failed: Total people must be greater than 0." }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDateObj = new Date(payload.startDate);
    // Adjust for potential timezone offset when creating Date from string
    startDateObj.setTime(startDateObj.getTime() + startDateObj.getTimezoneOffset() * 60 * 1000);
    startDateObj.setHours(0,0,0,0); 


    if (startDateObj < today) {
      return NextResponse.json({ success: false, message: "Validation failed: Start date cannot be in the past." }, { status: 400 });
    }

    const endDateObj = new Date(payload.endDate);
    // Adjust for potential timezone offset
    endDateObj.setTime(endDateObj.getTime() + endDateObj.getTimezoneOffset() * 60 * 1000);
    endDateObj.setHours(0,0,0,0);


    if (endDateObj <= startDateObj) {
      return NextResponse.json({ success: false, message: "Validation failed: End date must be after the start date." }, { status: 400 });
    }

    // --- Database Operations ---
    const dbService = new DatabaseService();

    // Fetch package category
    const category = await dbService.getPackageCategoryById(payload.packageCategoryId);

    if (!category) {
      return NextResponse.json({ success: false, message: "Invalid package category: Category not found." }, { status: 404 });
    }

    // Ensure category.package_id (from DB) matches payload.packageId
    if (category.package_id !== payload.packageId) {
      return NextResponse.json({ success: false, message: "Invalid package category: Category does not belong to the specified package." }, { status: 400 });
    }

    // Calculate total amount based on server-side price
    const serverTotalAmount = payload.totalPeople * category.price;

    // Prepare booking data
    const bookingData = {
      user_id: payload.userId || null,
      package_id: payload.packageId,
      package_category_id: payload.packageCategoryId,
      total_people: payload.totalPeople,
      start_date: payload.startDate, // Ensure format is YYYY-MM-DD
      end_date: payload.endDate,     // Ensure format is YYYY-MM-DD
      guest_name: payload.guestName,
      guest_email: payload.guestEmail,
      guest_phone: payload.guestPhone,
      special_requests: payload.specialRequests || null,
      total_amount: serverTotalAmount,
      status: 'pending_payment', 
      payment_status: 'pending',
    };

    // Create booking
    const result = await dbService.createBooking(bookingData);

    return NextResponse.json({ success: true, bookingId: result.id, message: 'Booking created successfully.' }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof Error && (error.message.includes("Validation failed") || error.message.includes("Invalid package category") || error.message.includes("Category not found"))) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create booking.', error: (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}
