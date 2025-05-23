// Path: src/app/api/packages/[id]/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
// --- FIX: Import DatabaseService instead of getDatabase ---
import { DatabaseService } from '@/lib/database';

// --- Keep the Package interface (matches DB schema and expected data) ---
interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number; // 0 or 1
  itinerary: string | null; // Raw TEXT/JSON string from DB
  included_services: string | null; // Raw TEXT/JSON string from DB
  images: string | null; // Raw TEXT/JSON string from DB
  created_at: string;
  updated_at: string;
}
// --- End Interface ---


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Destructure 'id' from params
) {
  // --- FIX: Instantiate DatabaseService ---
  const dbService = new DatabaseService();
  const packageId = params.id;

  try {
    // --- Validate ID ---
    const idAsNumber = parseInt(packageId, 10);
    if (isNaN(idAsNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid package ID format. Must be a number.' },
        { status: 400 } // Bad Request
      );
    }
    // --- End Validation ---

    // --- FIX: Use the service method to fetch the package ---
    // The service method already handles fetching by ID and checking is_active = 1
    // Assuming getPackageById returns the package object or null/undefined
    const pkg = await dbService.getPackageById(idAsNumber);

    // --- Check if package was found ---
    if (!pkg) {
      // If the service method returns null/undefined, the package wasn't found or isn't active
      return NextResponse.json(
        { success: false, message: `Active package with ID ${idAsNumber} not found.` },
        { status: 404 } // Not Found
      );
    }
    console.log(`Package found in api: ${JSON.stringify(pkg)}`);
    // --- Package found, return its data ---
    // The page.tsx component handles parsing JSON fields (itinerary, included_services)
    // So, we return the raw data from the database here.
    return NextResponse.json({
      success: true,
      message: `Package details retrieved successfully for ID: ${idAsNumber}`,
      // Cast the result if needed, though the service method might already return the correct type implicitly
      data: pkg as Package // Explicit cast can add type safety
    });

  } catch (err) {
    console.error(`Error fetching package with ID ${packageId}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve package details',
        error: errorMessage,
        data: null
      },
      { status: 500 } // Internal Server Error
    );
  }
}

// --- PUT/DELETE placeholders remain the same ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.warn(`PUT /api/packages/${params.id} is not fully implemented.`);
  return NextResponse.json({
    success: false,
    message: `PUT method for package ID ${params.id} not implemented yet.`,
    data: null
  }, { status: 501 }); // Not Implemented
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.warn(`DELETE /api/packages/${params.id} is not fully implemented.`);
  return NextResponse.json({
    success: false,
    message: `DELETE method for package ID ${params.id} not implemented yet.`
  }, { status: 501 }); // Not Implemented
}