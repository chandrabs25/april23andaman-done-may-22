import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyAuth } from "@/lib/auth";
import { DatabaseService, dbQuery } from "@/lib/database";

export const dynamic = "force-dynamic";

// GET /api/vendor/inventory/calendar?serviceId=123&from=2024-07-01&to=2024-07-31
// Returns day-wise availability of each room-type for the vendor's hotel.
export async function GET(request: NextRequest) {
  // 1. Authentication – vendor role id is assumed to be 3 throughout the codebase
  const authResponse = await requireAuth(request, [3]);
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, message: "User not found after auth check" },
      { status: 401 }
    );
  }

  // 2. Extract & validate query params
  const { searchParams } = request.nextUrl;
  const serviceIdParam = searchParams.get("serviceId");
  const fromDate = searchParams.get("from"); // YYYY-MM-DD
  const toDate = searchParams.get("to");     // YYYY-MM-DD

  if (!serviceIdParam || !fromDate || !toDate) {
    return NextResponse.json(
      { success: false, message: "Missing required params: serviceId, from, to" },
      { status: 400 }
    );
  }

  const serviceId = Number(serviceIdParam);
  if (isNaN(serviceId)) {
    return NextResponse.json(
      { success: false, message: "Invalid serviceId" },
      { status: 400 }
    );
  }

  try {
    const db = new DatabaseService();

    // 3. Ensure the authenticated vendor owns this service (hotel)
    const serviceRecord: any = await db.getServiceById(serviceId);
    if (!serviceRecord) {
      return NextResponse.json(
        { success: false, message: "Hotel service not found" },
        { status: 404 }
      );
    }

    // Fetch the vendor's provider profile to compare provider_id
    const provider = await db.getServiceProviderByUserId(Number(user.id));
    if (!provider || provider.id !== serviceRecord.provider_id) {
      return NextResponse.json(
        { success: false, message: "Access denied: you do not own this hotel" },
        { status: 403 }
      );
    }

    if (provider.type !== "hotel") {
      return NextResponse.json(
        { success: false, message: "Access denied: inventory calendar is for hotel vendors" },
        { status: 403 }
      );
    }

    // 4. Get room types for this hotel to generate complete availability grid
    const roomTypesSql = `
      SELECT id, room_type, quantity, base_price 
      FROM hotel_room_types 
      WHERE service_id = ? AND is_admin_approved = 1
    `;
    
    const { rows: roomTypes, success: roomTypesSuccess, error: roomTypesError } = await dbQuery(roomTypesSql, [serviceId]);
    
    if (!roomTypesSuccess) {
      console.error("DB error fetching room types", roomTypesError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch room types" },
        { status: 500 }
      );
    }

    if (roomTypes.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 5. Get bookings that span the date range (for multi-day stays)
    const bookingsSql = `
      SELECT 
        bs.hotel_room_type_id,
        bs.quantity as rooms_booked,
        b.start_date,
        b.end_date,
        b.payment_status,
        b.status
      FROM bookings b
      JOIN booking_services bs ON b.id = bs.booking_id
      WHERE bs.service_id = ?
        AND b.payment_status = 'PAID'
        AND b.status NOT IN ('cancelled', 'CANCELLED')
        AND (
          (b.start_date <= ? AND COALESCE(b.end_date, b.start_date) >= ?)
        )
      ORDER BY b.start_date;
    `;

    const { rows: bookings, success: bookingsSuccess, error: bookingsError } = await dbQuery(bookingsSql, [serviceId, toDate, fromDate]);

    if (!bookingsSuccess) {
      console.error("DB error fetching bookings", bookingsError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    // 6. Get manual blocks from inventory_adjustments
    const blocksSql = `
      SELECT 
        room_type_id,
        quantity_change,
        adjustment_date as start_date,
        adjustment_date as end_date
      FROM inventory_adjustments
      WHERE service_id = ?
        AND adjustment_type = 'block'
        AND adjustment_date BETWEEN ? AND ?
    `;

    const { rows: blocks, success: blocksSuccess, error: blocksError } = await dbQuery(blocksSql, [serviceId, fromDate, toDate]);

    if (!blocksSuccess) {
      console.error("DB error fetching blocks", blocksError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch blocks" },
        { status: 500 }
      );
    }

    // 7. Calculate availability for each date and room type
    const completeAvailability = [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      for (const roomType of roomTypes) {
        // Calculate booked rooms for this date
        let bookedRooms = 0;
        for (const booking of bookings) {
          if (booking.hotel_room_type_id === roomType.id) {
            const bookingStart = new Date(booking.start_date);
            const bookingEnd = new Date(booking.end_date || booking.start_date);
            const currentDate = new Date(dateStr);
            
            // Check if current date falls within booking period
            if (currentDate >= bookingStart && currentDate <= bookingEnd) {
              bookedRooms += booking.rooms_booked;
            }
          }
        }

        // Calculate blocked rooms for this date
        let blockedRooms = 0;
        for (const block of blocks) {
          if (block.room_type_id === roomType.id) {
            const blockStart = new Date(block.start_date);
            const blockEnd = new Date(block.end_date || block.start_date);
            const currentDate = new Date(dateStr);
            
            // Check if current date falls within block period
            if (currentDate >= blockStart && currentDate <= blockEnd) {
              blockedRooms += Math.abs(block.quantity_change); // quantity_change is negative for blocks
            }
          }
        }

        const availableRooms = Math.max(0, roomType.quantity - bookedRooms - blockedRooms);

        completeAvailability.push({
          room_type_id: roomType.id,
          room_type: roomType.room_type,
          date: dateStr,
          total_rooms: roomType.quantity,
          booked_rooms: bookedRooms,
          blocked_rooms: blockedRooms,
          available_rooms: availableRooms,
          current_price: roomType.base_price
        });
      }
    }

    return NextResponse.json({ success: true, data: completeAvailability });
  } catch (err) {
    console.error("Unexpected error in calendar API", err);
    return NextResponse.json(
      { success: false, message: "Unexpected server error" },
      { status: 500 }
    );
  }
} 