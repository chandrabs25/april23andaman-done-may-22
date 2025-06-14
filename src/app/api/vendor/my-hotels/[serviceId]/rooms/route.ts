import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { verifyAuth, requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    serviceId: string; // This is the hotel\"s service ID
  };
}

// Helper function (copied/adapted from parent route)
async function checkHotelOwnershipAndVerification(
  db: DatabaseService,
  userId: number | string,
  serviceId: number
): Promise<{ isOwner: boolean; isVerified: boolean; isHotelVendor: boolean; serviceProviderId: number | null }> {
  const serviceProvider = await db.getServiceProviderByUserId(Number(userId));
  if (!serviceProvider || !serviceProvider.id) {
    return { isOwner: false, isVerified: false, isHotelVendor: false, serviceProviderId: null };
  }

  const isVerified = serviceProvider.verified === 1;
  const isHotelVendor = serviceProvider.type === "hotel";
  const serviceProviderId = serviceProvider.id;

  const service = await db.getServiceById(serviceId);
  const isOwner = service !== null && service?.provider_id === serviceProvider.id;

  if (isOwner && service?.type !== "hotel") {
      return { isOwner: false, isVerified, isHotelVendor, serviceProviderId };
  }

  return { isOwner, isVerified, isHotelVendor, serviceProviderId };
}

// GET: Fetch all room types for a specific hotel
export async function GET(request: NextRequest, { params }: RouteContext) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, message: "User not found after auth check" },
      { status: 401 }
    );
  }

  const serviceId = parseInt(params.serviceId, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Hotel Service ID" },
      { status: 400 }
    );
  }

  try {
    const db = new DatabaseService();

    // Verify ownership, verification, and type for the parent hotel
    const { isOwner, isVerified, isHotelVendor } = await checkHotelOwnershipAndVerification(db, user.id, serviceId);

    if (!isOwner) {
      return NextResponse.json(
        { success: false, message: "Hotel not found or permission denied." },
        { status: 404 }
      );
    }
    // --- Verification Check Removed for GET as per requirements ---
    // if (!isVerified) {
    //     return NextResponse.json(
    //         { success: false, message: "Vendor account not verified. Cannot manage rooms." },
    //         { status: 403 }
    //     );
    // }
    // --- End Check ---
    if (!isHotelVendor) {
        return NextResponse.json(
            { success: false, message: "Access denied. Not a hotel vendor." },
            { status: 403 }
        );
    }

    // Fetch room types for this hotel service ID
    const result = await db.getRoomTypesByHotelServiceId(serviceId);

    if (!result || !result.success) {
      console.error(
        `Failed to fetch room types for hotel ${serviceId}:`,
        result?.error
      );
      return NextResponse.json(
        { success: false, message: "Failed to fetch room types." },
        { status: 500 }
      );
    }

    const roomTypes = result.results ?? [];
    
    // Check booking status for each room type
    const roomTypesWithBookingStatus = await Promise.all(
      roomTypes.map(async (room: any) => {
        const hasActiveBookings = await db.roomHasActiveBookings(room.id);
        return {
          ...room,
          has_active_bookings: hasActiveBookings
        };
      })
    );
    
    return NextResponse.json({ success: true, data: roomTypesWithBookingStatus });

  } catch (error) {
    console.error(`Error fetching room types for hotel ${serviceId}:`, error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to fetch room types.", error: message },
      { status: 500 }
    );
  }
}

// POST: Add a new room type to a specific hotel
export async function POST(request: NextRequest, { params }: RouteContext) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, message: "User not found after auth check" },
      { status: 401 }
    );
  }

  const serviceId = parseInt(params.serviceId, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Hotel Service ID" },
      { status: 400 }
    );
  }

  try {
    const db = new DatabaseService();

    // Verify ownership, verification, and type for the parent hotel
    const { isOwner, isVerified, isHotelVendor } = await checkHotelOwnershipAndVerification(db, user.id, serviceId);

    if (!isOwner) {
      return NextResponse.json(
        { success: false, message: "Hotel not found or permission denied." },
        { status: 404 }
      );
    }
     if (!isVerified) {
        return NextResponse.json(
            { success: false, message: "Vendor account not verified. Cannot add room type." },
            { status: 403 }
        );
    }
    if (!isHotelVendor) {
        return NextResponse.json(
            { success: false, message: "Access denied. Not a hotel vendor." },
            { status: 403 }
        );
    }

    // Define expected body structure based on design_hotel_management_pages.md
    interface RoomTypeCreateBody {
      room_type_name: string;
      base_price: number;
      max_guests: number;
      quantity_available?: number;
      amenities?: string[] | null; // e.g., ["Wi-Fi", "Balcony"]
      images?: string | null; // URLs, comma-separated or single
    }

    const body: RoomTypeCreateBody = await request.json();

    // --- Enhanced Validation and Parsing ---
    if (!body.room_type_name || typeof body.room_type_name !== 'string' || body.room_type_name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Room type name is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const basePrice = Number(body.base_price);
    if (isNaN(basePrice) || basePrice <= 0) {
      return NextResponse.json(
        { success: false, message: "Base price must be a positive number." },
        { status: 400 }
      );
    }

    const maxGuests = Number(body.max_guests);
    if (isNaN(maxGuests) || maxGuests <= 0) {
      return NextResponse.json(
        { success: false, message: "Max guests must be a positive number." },
        { status: 400 }
      );
    }

    let quantityAvailable: number | null = null;
    if (body.quantity_available !== undefined && body.quantity_available !== null) {
        const qty = Number(body.quantity_available);
        if (!isNaN(qty) && qty >= 0) {
            quantityAvailable = qty;
        } else {
            // Optionally, you could return a 400 error here if quantity_available is present but invalid
            // For now, we'll treat invalid as null, but stricter validation might be desired.
            // Example: return NextResponse.json({ success: false, message: "Quantity available must be a non-negative number if provided." }, { status: 400 });
            quantityAvailable = null; // Defaulting to null if present but not a valid non-negative number
        }
    }

    // Prepare data for database insertion
    const roomTypeData = {
      hotel_service_id: serviceId,
      room_type_name: body.room_type_name.trim(),
      base_price: basePrice,
      max_guests: maxGuests,
      quantity_available: quantityAvailable,
      amenities: body.amenities ?? null, // Use body.amenities directly as it's already a JSON string from frontend
      images: body.images ?? null, // Expecting comma-separated string or null from frontend
    };

    // Log the data being sent to the database
    console.log("Attempting to create room type with data:", JSON.stringify(roomTypeData, null, 2));

    // Use the database method to create the room type
    const result = await db.createRoomType(roomTypeData);

    if (!result.success || !result.meta?.last_row_id) {
      throw new Error(result.error || "Failed to create room type in database");
    }

    // Fetch the newly created room type to return it
    const newRoomType = await db.getRoomTypeById(result.meta.last_row_id);
    if (!newRoomType) {
      throw new Error("Failed to retrieve newly created room type.");
    }

    return NextResponse.json(
      { success: true, message: "Room type added successfully", data: newRoomType },
      { status: 201 }
    );

  } catch (error) {
    console.error(`Error adding room type to hotel ${serviceId}:`, error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to add room type.", error: message },
      { status: 500 }
    );
  }
}

