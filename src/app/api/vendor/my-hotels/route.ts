import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { verifyAuth, requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Fetch all hotels for the authenticated vendor
export async function GET(request: NextRequest) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, message: "User not found after auth check" },
      { status: 401 }
    );
  }

  try {
    const db = new DatabaseService();
    const serviceProvider = await db.getServiceProviderByUserId(Number(user.id));

    if (!serviceProvider || !serviceProvider.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service provider profile not found for this user.",
        },
        { status: 404 }
      );
    }

    // --- Verification Check Removed for GET as per requirements ---
    // if (!serviceProvider.verified) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Vendor account not verified. Cannot manage hotels.",
    //     },
    //     { status: 403 }
    //   );
    // }
    // --- End Check ---
    if (serviceProvider.type !== "hotel") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. This endpoint is for hotel vendors only.",
        },
        { status: 403 }
      );
    }

    // Fetch hotels (services with type=\'hotel\' joined with hotels table)
    const result = await db.getHotelsByProvider(serviceProvider.id);

    if (!result || !result.success) {
      console.error(
        "Failed to fetch vendor hotels from database:",
        result?.error
      );
      return NextResponse.json(
        { success: false, message: "Failed to fetch hotels." },
        { status: 500 }
      );
    }

    const rawHotels = result.results ?? [];

    // Helper to parse image JSON and get the first URL
    const getFirstImageUrl = (imagesJsonString: string | null | undefined): string | null => {
      if (!imagesJsonString) return null;
      try {
        const imageUrls = JSON.parse(imagesJsonString);
        if (Array.isArray(imageUrls) && imageUrls.length > 0 && typeof imageUrls[0] === 'string') {
          return imageUrls[0];
        }
      } catch (e) {
        console.error("Failed to parse images JSON in API:", imagesJsonString, e);
        // Optionally, handle non-JSON string if it might be a single URL
        if (typeof imagesJsonString === 'string' && imagesJsonString.startsWith('http')) {
            return imagesJsonString;
        }
      }
      return null;
    };

    const hotelsWithImageUrl = rawHotels.map((hotel: any) => ({
      ...hotel,
      image_url: getFirstImageUrl(hotel.images), // hotel.images is from s.images
      // Remove the raw images field if you don't want to send it to the client
      // images: undefined, 
    }));

    return NextResponse.json({ success: true, data: hotelsWithImageUrl });
  } catch (error) {
    console.error("Error fetching vendor hotels:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to fetch hotels.", error: message },
      { status: 500 }
    );
  }
}

// POST: Create a new hotel for the authenticated vendor
export async function POST(request: NextRequest) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, message: "User not found after auth check" },
      { status: 401 }
    );
  }

  try {
    const db = new DatabaseService();
    const serviceProvider = await db.getServiceProviderByUserId(Number(user.id));

    if (!serviceProvider || !serviceProvider.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Service provider profile not found for this user. Cannot create hotel.",
        },
        { status: 403 }
      );
    }

    // Check Verification Status & Type
    if (!serviceProvider.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Vendor account not verified. Cannot create hotel.",
        },
        { status: 403 }
      );
    }
    if (serviceProvider.type !== "hotel") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. This endpoint is for hotel vendors only.",
        },
        { status: 403 }
      );
    }

    // Define expected body structure based on design_hotel_management_pages.md
    interface HotelCreateBody {
      // Generic Service Fields
      name: string;
      description?: string;
      price_base: number; // Changed from price
      cancellation_policy?: string; // Expecting a string
      images?: string | null; // Expecting stringified JSON array
      island_id: number;
      is_active?: boolean;
      // Hotel-Specific Fields
      star_rating: number;
      check_in_time: string; // e.g., "14:00"
      check_out_time: string; // e.g., "12:00"
      total_rooms?: number;
      facilities?: string; // Expecting stringified JSON array
      meal_plans?: string;  // Expecting stringified JSON array
      pets_allowed?: boolean;
      children_allowed?: boolean;
      accessibility_features?: string;
      street_address: string;
      geo_lat?: number | null;
      geo_lng?: number | null;
      // service_provider_id is derived from auth, not in body
    }

    const body: HotelCreateBody = await request.json();

    // Basic validation
    if (
      !body.name ||
      body.price_base === undefined || // Changed from price
      body.island_id === undefined ||
      body.star_rating === undefined ||
      !body.check_in_time ||
      !body.check_out_time ||
      !body.street_address
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields (name, price_base, island_id, star_rating, check_in_time, check_out_time, street_address)",
        },
        { status: 400 }
      );
    }

    // Ensure island exists
    const island = await db.getIslandById(Number(body.island_id));
    if (!island) {
      return NextResponse.json(
        { success: false, message: `Island with ID ${body.island_id} not found.` },
        { status: 400 }
      );
    }

    // --- Enhanced Validation for Numeric Fields ---
    const priceBase = Number(body.price_base);
    if (isNaN(priceBase) || priceBase <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing price. Price must be a positive number." },
        { status: 400 }
      );
    }

    const starRating = Number(body.star_rating);
    if (isNaN(starRating) || starRating < 1 || starRating > 5) {
         return NextResponse.json(
            { success: false, message: "Invalid star rating. Must be between 1 and 5." },
            { status: 400 }
        );
    }

    let totalRooms: number | null = null;
    if (body.total_rooms !== undefined && body.total_rooms !== null) {
        const parsedRooms = Number(body.total_rooms);
        if (isNaN(parsedRooms) || parsedRooms < 0) { // Assuming 0 rooms could be valid for a new listing before rooms are defined
            return NextResponse.json(
                { success: false, message: "Invalid total number of rooms. Must be a non-negative number." },
                { status: 400 }
            );
        }
        totalRooms = parsedRooms;
    }
    // --- End Enhanced Validation ---

    // Define type for serviceData based on createService input
    interface ServiceDataForCreate {
        name: string;
        description: string | null;
        type: string;
        provider_id: number;
        island_id: number;
        price: number;
        availability: string | null;
        images: string | null;
        amenities: string | null;
        cancellation_policy: string | null;
        is_active?: boolean;
    }

    // Prepare data for database insertion
    const serviceData: ServiceDataForCreate = {
      name: body.name,
      description: body.description ?? null,
      type: "hotel", // Hardcoded type
      provider_id: serviceProvider.id,
      island_id: Number(body.island_id),
      price: priceBase, // Use validated priceBase
      availability: null, // Hotels usually manage availability via rooms
      images: null, // MODIFIED: Set to null initially, images added in PUT
      amenities: null, // Use hotel-specific fields instead
      cancellation_policy: body.cancellation_policy ?? null, // Directly use the string
      is_active: body.is_active === undefined ? true : body.is_active,
    };

    // Safely stringify JSON fields for hotelData - NO, frontend already sends stringified
    // let facilitiesString: string | null = null;
    // try {
    //     if (body.facilities) {
    //         facilitiesString = JSON.stringify(body.facilities);
    //     }
    // } catch (e) {
    //     console.error("Hotel Creation: Failed to stringify facilities", e);
    //     return NextResponse.json({ success: false, message: 'Invalid format for facilities data.' }, { status: 400 });
    // }

    // let mealPlansString: string | null = null;
    // try {
    //     if (body.meal_plans) {
    //         mealPlansString = JSON.stringify(body.meal_plans);
    //     }
    // } catch (e) {
    //     console.error("Hotel Creation: Failed to stringify meal_plans", e);
    //     return NextResponse.json({ success: false, message: 'Invalid format for meal plans data.' }, { status: 400 });
    // }

    // Safely stringify JSON for cancellation_policy in serviceData - NO, frontend sends string
    // let cancellationPolicyString: string | null = null;
    // try {
    //     if (body.cancellation_policy) {
    //         cancellationPolicyString = JSON.stringify(body.cancellation_policy);
    //     }
    // } catch (e) {
    //     console.error("Hotel Creation: Failed to stringify cancellation_policy", e);
    //     return NextResponse.json({ success: false, message: 'Invalid format for cancellation policy data.' }, { status: 400 });
    // }
    // Update serviceData with the safe string
    // serviceData.cancellation_policy = cancellationPolicyString; // Use body.cancellation_policy directly

    const hotelData = {
      // service_id will be set after service creation
      star_rating: starRating, // Use validated starRating
      check_in_time: body.check_in_time,
      check_out_time: body.check_out_time,
      total_rooms: totalRooms, // Use validated totalRooms
      facilities: body.facilities ?? null, // Use directly as it's already a stringified JSON
      meal_plans: body.meal_plans ?? null,   // Use directly as it's already a stringified JSON
      pets_allowed: body.pets_allowed === undefined ? false : body.pets_allowed,
      children_allowed:
        body.children_allowed === undefined ? true : body.children_allowed,
      accessibility: body.accessibility_features ?? null, // Map API name to DB name
      street_address: body.street_address,
      geo_lat: body.geo_lat ?? null,
      geo_lng: body.geo_lng ?? null,
      policies: null, // Explicitly pass null for policies
      extra_images: null, // Explicitly pass null for extra_images
    };

    // Use the new database method to create hotel (handles transaction)
    const result = await db.createHotel(serviceData, hotelData);

    if (!result.success || !result.serviceId) {
      throw new Error(result.error || "Failed to create hotel in database");
    }

    // Fetch the newly created hotel (joined data) to return it
    const newHotel = await db.getHotelById(result.serviceId);
    if (!newHotel) {
      throw new Error("Failed to retrieve newly created hotel.");
    }

    return NextResponse.json(
      { success: true, message: "Hotel created successfully", data: newHotel },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hotel:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to create hotel.", error: message },
      { status: 500 }
    );
  }
}

