// src/app/api/admin/hotel_preview/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "../../../../../lib/database"; // Corrected path
import type { Hotel } from "../../../../../types/hotel"; // Corrected path

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

// This route is automatically protected by src/middleware.ts for admin access.

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const dbService = new DatabaseService();
  const hotelId = parseInt(params.id, 10);

  if (isNaN(hotelId)) {
    return NextResponse.json(
      { success: false, message: "Invalid hotel ID format." },
      { status: 400 }
    );
  }

  try {
    // getHotelById fetches the hotel and its rooms, regardless of approval status,
    // which is suitable for an admin preview.
    const hotel = await dbService.getHotelById(hotelId);

    if (!hotel) {
      return NextResponse.json(
        { success: false, message: "Hotel not found for preview." },
        { status: 404 }
      );
    }

    // We can add an indicator that this data is for admin preview if needed,
    // but the main purpose is to provide the full data.
    // The frontend will handle the "Admin Preview" banner.
    return NextResponse.json({ success: true, data: hotel as Hotel }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching hotel for admin preview (ID: ${hotelId}):`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: `Failed to fetch hotel for admin preview: ${errorMessage}` },
      { status: 500 }
    );
  }
}
