import { NextResponse } from 'next/server';
import { DatabaseService, getDatabase } from '@/lib/database'; // Adjust path if necessary

interface RouteParams { params: { bookingId: string; }; }

const dbService = new DatabaseService();

export async function GET(request: Request, { params }: RouteParams) {
  const { bookingId: bookingIdStr } = params;

  if (!bookingIdStr) {
    return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
  }
  const parsedBookingId = parseInt(bookingIdStr, 10);
  if (isNaN(parsedBookingId)) {
    return NextResponse.json({ message: "Invalid Booking ID format" }, { status: 400 });
  }

  try {
    const bookingFromDb = await dbService.getBookingDetailsWithRelations(parsedBookingId);

    if (!bookingFromDb) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // Calculate number of nights for hotel bookings
    let numberOfNights = 0;
    if (bookingFromDb.start_date && bookingFromDb.end_date) {
      const checkIn = new Date(bookingFromDb.start_date);
      const checkOut = new Date(bookingFromDb.end_date);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    // Transform flat DB result to nested structure for frontend
    // Ensure all fields from the 'bookings' table (selected by b.* in the SQL query)
    // that are needed by the frontend are explicitly mapped here.
    const responseData = {
      // Direct fields from booking (ensure all needed fields are selected by b.* or explicitly)
      id: String(bookingFromDb.id), // D1 returns number for ID, frontend might expect string
      status: bookingFromDb.status,
      paymentStatus: bookingFromDb.payment_status,
      totalAmount: bookingFromDb.total_amount, // In paise
      phonepeTransactionId: bookingFromDb.phonepe_transaction_id, // Field name from schema
      createdAt: bookingFromDb.created_at, // ISO string from D1
      updatedAt: bookingFromDb.updated_at, // ISO string from D1
      startDate: bookingFromDb.start_date, // Date string from D1
      endDate: bookingFromDb.end_date,     // Date string from D1
      totalPeople: bookingFromDb.total_people,
      specialRequests: bookingFromDb.special_requests,
      guestName: bookingFromDb.guest_name,
      guestEmail: bookingFromDb.guest_email,
      guestPhone: bookingFromDb.guest_phone, // Schema uses guest_phone
      userId: bookingFromDb.user_id, // Foreign key
      packageId: bookingFromDb.package_id, // Foreign key
      packageCategoryId: bookingFromDb.package_category_id, // Foreign key
      numberOfNights: numberOfNights,
      
      // Hotel booking specific fields
      numberOfRooms: bookingFromDb.numberOfRooms,
      bookingServicePrice: bookingFromDb.bookingServicePrice,
      bookingServiceDate: bookingFromDb.bookingServiceDate,

      // Nested related data based on aliased names from the SQL query
      package: bookingFromDb.packageName ? { name: bookingFromDb.packageName } : undefined,
      packageCategory: bookingFromDb.packageCategoryName ? { name: bookingFromDb.packageCategoryName } : undefined,
      
      // Hotel/Service information
      service: bookingFromDb.serviceName ? {
        name: bookingFromDb.serviceName,
        type: bookingFromDb.serviceType,
        description: bookingFromDb.serviceDescription,
        images: bookingFromDb.serviceImages,
        amenities: bookingFromDb.serviceAmenities,
        basePrice: bookingFromDb.serviceBasePrice
      } : undefined,
      
      // Hotel specific details
      hotel: (bookingFromDb.hotelStarRating || bookingFromDb.hotelCheckInTime || bookingFromDb.hotelAddress) ? {
        starRating: bookingFromDb.hotelStarRating,
        checkInTime: bookingFromDb.hotelCheckInTime,
        checkOutTime: bookingFromDb.hotelCheckOutTime,
        facilities: bookingFromDb.hotelFacilities,
        totalRooms: bookingFromDb.hotelTotalRooms,
        address: bookingFromDb.hotelAddress,
        mealPlans: bookingFromDb.hotelMealPlans,
        petsAllowed: bookingFromDb.hotelPetsAllowed,
        childrenAllowed: bookingFromDb.hotelChildrenAllowed,
        cancellationPolicy: bookingFromDb.hotelCancellationPolicy
      } : undefined,
      
      // Room type details
      roomType: (bookingFromDb.roomTypeId || bookingFromDb.roomTypeName) ? {
        id: bookingFromDb.roomTypeId,
        name: bookingFromDb.roomTypeName,
        basePrice: bookingFromDb.roomTypeBasePrice,
        maxGuests: bookingFromDb.roomTypeMaxGuests,
        amenities: bookingFromDb.roomTypeAmenities,
        images: bookingFromDb.roomTypeImages
      } : undefined,
      
      // Location details
      island: bookingFromDb.islandName ? {
        name: bookingFromDb.islandName,
        description: bookingFromDb.islandDescription
      } : undefined,
      
      // User details
      user: (bookingFromDb.userEmail || bookingFromDb.userFirstName || bookingFromDb.userLastName) ? { 
        name: [bookingFromDb.userFirstName, bookingFromDb.userLastName].filter(Boolean).join(' ').trim() || undefined, 
        email: bookingFromDb.userEmail || undefined
      } : undefined,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error(`Error fetching booking ${parsedBookingId}:`, error);
    // Avoid sending raw error messages to client in production
    return NextResponse.json({ message: "An internal server error occurred while fetching booking details." }, { status: 500 });
  }
}
