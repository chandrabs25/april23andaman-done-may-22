export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

interface Island {
  id: number;
  name: string;
  description: string | null;
  permit_required: number;
  permit_details: string | null;
  coordinates: string | null;
  attractions: string | null;
  activities: string | null;
  images: string | null;
  created_at: string;
  updated_at: string;
}



export async function GET() {
  try {
    const dbService = new DatabaseService();
    const { results } = await dbService.getAllIslands();
    
    return NextResponse.json({
      success: true,
      message: 'Destinations retrieved successfully',
      data: results ?? []
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve destinations',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        data: []
      },
      { status: 500 }
    );
  }
}



// POST handler with proper binding access
export async function POST(request: NextRequest, context: any) {
  console.warn("POST /api/destinations is not fully implemented.");
  try {
    // Access the DB binding from context.env
    const dbService = new DatabaseService();
    
    // Placeholder implementation - Needs logic to create a destination in the DB
    // const body = await request.json();
    // Basic validation
    // const result = await dbService.createIsland(body);
    
    return NextResponse.json({
      success: false, // Set to false as it's not implemented
      message: 'POST method for destinations not implemented yet.',
      data: null
    }, { status: 501 }); // 501 Not Implemented
    
  } catch (error) {
    console.error("Error in POST /api/destinations:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      message: "Failed to process request", 
      error: errorMessage 
    }, { status: 500 });
  }
}
