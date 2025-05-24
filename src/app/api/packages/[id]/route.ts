// Path: src/app/api/packages/[id]/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
// --- FIX: Import DatabaseService instead of getDatabase ---
import { DatabaseService } from '@/lib/database';

// Helper function for safe JSON parsing
function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    // For good measure, ensure it's not already an object (though DB should give string)
    if (typeof jsonString === 'object') return jsonString as T;
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON string:', jsonString, error);
    return defaultValue;
  }
}

// --- Define PackageCategory interface ---
interface PackageCategory {
  id: number;
  package_id: number;
  category_name: string;
  price: number;
  hotel_details: Record<string, any> | null; // Parsed from JSON string
  category_description: string | null;
  max_pax_included_in_price: number | null;
  images: string[] | null; // Parsed from JSON string
  // created_at and updated_at can be added if needed for the response
}

// --- Updated Package interface ---
interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number; // 0 or 1
  itinerary: Record<string, any> | null; // Parsed from JSON string
  included_services: string[] | null; // Parsed from JSON string
  images: string[] | null; // Parsed from JSON string
  created_at: string;
  updated_at: string;
  categories: PackageCategory[]; // Added categories field
}
// --- End Interface Definitions ---


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
    // enriqueta: Adding placeholder fields for categories and parsed fields
    const enrichedPkg = { 
      ...(pkg as any), // Spread existing package data
      categories: [], // Placeholder for package categories
      images_parsed: typeof pkg.images === 'string' ? JSON.parse(pkg.images) : (Array.isArray(pkg.images) ? pkg.images : []), 
      itinerary_parsed: typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary) : (typeof pkg.itinerary === 'object' ? pkg.itinerary : {}),
      included_services_parsed: typeof pkg.included_services === 'string' ? JSON.parse(pkg.included_services) : (Array.isArray(pkg.included_services) ? pkg.included_services : [])
    };

    return NextResponse.json({
      success: true,
      message: `Package details retrieved successfully for ID: ${idAsNumber}`,
      data: enrichedPkg
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