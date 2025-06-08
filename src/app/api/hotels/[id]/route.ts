// src/app/api/hotels/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import type { Hotel } from "@/types/hotel";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

// Helper function for safe JSON parsing for arrays
function safeJsonParseArray(jsonString: string | string[] | null | undefined, parsingFieldName: string): string[] {
  if (!jsonString) {
    return [];
  }
  if (Array.isArray(jsonString)) {
    return jsonString.map(s => String(s));
  }
  if (typeof jsonString === 'string') {
    const str = jsonString.trim();
    if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('"') && str.endsWith('"'))) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          return parsed.map(s => String(s));
        } else if (typeof parsed === 'string') {
          return [parsed];
        }
        console.warn(`safeJsonParseArray: ${parsingFieldName} looked like JSON but parsed to an unexpected type. Original: '${str}'.`);
        return [];
      } catch (e) {
        console.warn(`safeJsonParseArray: JSON.parse failed for ${parsingFieldName} ('${str}').`);
        return (str.startsWith('http') || str.startsWith('/')) && !str.includes(',') ? [str] : str.split(',').map(s => s.trim()).filter(s => s !== '');
      }
    } else {
      return (str.startsWith('http') || str.startsWith('/')) && !str.includes(',') ? [str] : str.split(',').map(s => s.trim()).filter(s => s !== '');
    }
  }
  console.warn(`safeJsonParseArray: ${parsingFieldName} was not a string or array. Returning empty array.`);
  return [];
}

// --- Define Hotel Room Type interface ---
interface HotelRoomType {
  id: number;
  service_id: number;
  room_type: string;
  base_price: number;
  capacity: number;
  amenities?: string[];
  description?: string;
  images?: string[];
  room_size?: string;
  bed_type?: string;
  special_features?: string;
}

// Raw DB structure for room types
interface DbHotelRoomType {
  id: number;
  service_id: number;
  room_type: string;
  base_price: number;
  capacity: number;
  amenities?: string | null;
  description?: string | null;
  images?: string | null;
  room_size?: string | null;
  bed_type?: string | null;
  special_features?: string | null;
}

// --- Hotel interface ---
interface DbHotel {
  id: number;
  name: string;
  description?: string | null;
  star_rating?: number | null;
  images?: string | string[] | null;
  amenities?: string | string[] | null;
  address?: string | null;
  island_name?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  cancellation_policy?: string | null;
  policies?: string | null;
}

interface ApiHotelResponse {
  id: number;
  name: string;
  description?: string | null;
  star_rating?: number | null;
  images_parsed?: string[];
  amenities_parsed?: string[];
  address?: string | null;
  island_name?: string | null;
  room_types?: HotelRoomType[];
  check_in_time?: string | null;
  check_out_time?: string | null;
  cancellation_policy?: string | null;
  policies?: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const dbService = new DatabaseService();
  const hotelId = parseInt(params.id, 10);

  if (isNaN(hotelId) || hotelId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid hotel ID.' }, { status: 400 });
  }

  try {
    // Get hotel details
    const hotel = await dbService.getHotelById(hotelId) as DbHotel | null;

    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found.' }, { status: 404 });
    }

    console.log(`[API GET /api/hotels/${hotelId}] Raw hotel from DB:`, JSON.stringify(hotel));

    // Parse images and amenities
    const parsedImages = safeJsonParseArray(hotel.images, `hotel.images for Hotel ID ${hotel.id}`);
    const parsedAmenities = safeJsonParseArray(hotel.amenities, `hotel.amenities for Hotel ID ${hotel.id}`);

    console.log(`[API GET /api/hotels/${hotelId}] Parsed images:`, parsedImages);
    console.log(`[API GET /api/hotels/${hotelId}] Parsed amenities:`, parsedAmenities);

    // Get room types for this hotel
    const roomTypesResult = await dbService.getRoomTypesByHotelServiceId(hotelId);
    const rawRoomTypes: DbHotelRoomType[] = roomTypesResult?.results || [];

    console.log(`[API GET /api/hotels/${hotelId}] Raw room types from DB:`, JSON.stringify(rawRoomTypes));

    // Process room types
    const processedRoomTypes: HotelRoomType[] = rawRoomTypes.map(roomType => {
      const parsedRoomImages = safeJsonParseArray(roomType.images, `room type ${roomType.id} images`);
      const parsedRoomAmenities = safeJsonParseArray(roomType.amenities, `room type ${roomType.id} amenities`);

      return {
        id: roomType.id,
        service_id: roomType.service_id,
        room_type: roomType.room_type,
        base_price: roomType.base_price,
        capacity: roomType.capacity,
        amenities: parsedRoomAmenities,
        description: roomType.description || undefined,
        images: parsedRoomImages,
        room_size: roomType.room_size || undefined,
        bed_type: roomType.bed_type || undefined,
        special_features: roomType.special_features || undefined,
      };
    });

    console.log(`[API GET /api/hotels/${hotelId}] Processed room types for client:`, JSON.stringify(processedRoomTypes));

    // Build response
    const enrichedHotel: ApiHotelResponse = {
      id: hotel.id,
      name: hotel.name,
      description: hotel.description,
      star_rating: hotel.star_rating,
      images_parsed: parsedImages,
      amenities_parsed: parsedAmenities,
      address: hotel.address,
      island_name: hotel.island_name,
      room_types: processedRoomTypes,
      check_in_time: hotel.check_in_time,
      check_out_time: hotel.check_out_time,
      cancellation_policy: hotel.cancellation_policy,
      policies: hotel.policies,
    };

    return NextResponse.json({ success: true, data: enrichedHotel });

  } catch (error) {
    console.error(`Error fetching hotel ${hotelId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve hotel details', error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// PUT/DELETE placeholders
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.warn(`PUT /api/hotels/${params.id} is not fully implemented.`);
  return NextResponse.json({
    success: false,
    message: `PUT method for hotel ID ${params.id} not implemented yet.`,
    data: null
  }, { status: 501 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.warn(`DELETE /api/hotels/${params.id} is not fully implemented.`);
  return NextResponse.json({
    success: false,
    message: `DELETE method for hotel ID ${params.id} not implemented yet.`
  }, { status: 501 });
}

