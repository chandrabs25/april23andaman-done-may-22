// src/app/api/hotels/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import type { Hotel } from "@/types/hotel";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

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
    const hotel = await dbService.getHotelById(hotelId);

    if (!hotel) {
      return NextResponse.json(
        { success: false, message: "Hotel not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hotel as Hotel }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching hotel with ID ${hotelId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: `Failed to fetch hotel: ${errorMessage}` },
      { status: 500 }
    );
  }
}

