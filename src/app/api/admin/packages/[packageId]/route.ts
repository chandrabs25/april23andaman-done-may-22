export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth, VerifiedUser } from '@/lib/auth'; // Import custom auth

// --- Interfaces ---
interface PackageCategoryPayload {
  category_name: string;
  price: number;
  hotel_details?: string | null;
  category_description?: string | null;
  max_pax_included_in_price?: number | null;
  images?: string[] | string | null;
}

interface UpdatePackagePayload {
  name: string;
  description?: string | null;
  duration: string;
  base_price: number;
  max_people?: number | null;
  itinerary?: string | object | null;
  included_services?: string | object | null;
  images?: string | object | null;
  cancellation_policy?: string | null;
  package_categories?: PackageCategoryPayload[];
  is_active?: boolean;
}

interface ApiError {
  message: string;
  error?: string;
}

// --- GET handler: Get a specific package by ID ---
export async function GET(
  request: NextRequest,
  { params }: { params: { packageId: string } }
) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]);
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const packageIdInt = parseInt(params.packageId, 10);
  if (isNaN(packageIdInt) || packageIdInt <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid package ID.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    // Get the package details
    const packageResult = await dbService.getPackageById(packageIdInt);
    if (!packageResult) {
      return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
    }

    // Fetch package categories for this package
    const categoriesResult = await dbService.getPackageCategories(packageIdInt);
    const categories = categoriesResult.results || [];
    
    return NextResponse.json({
      success: true,
      message: 'Package retrieved successfully',
      data: {
        package: packageResult,
        categories: categories
      }
    });

  } catch (error) {
    console.error(`Error fetching package ${packageIdInt}:`, error);
    const apiError: ApiError = {
      message: 'Failed to retrieve package',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
}

// --- PUT handler: Update a specific package by ID ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { packageId: string } }
) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]);
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const packageIdInt = parseInt(params.packageId, 10);
  if (isNaN(packageIdInt) || packageIdInt <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid package ID.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    // Check if package exists
    const existingPackage = await dbService.getPackageById(packageIdInt);
    if (!existingPackage) {
      return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
    }

    const body = await request.json() as UpdatePackagePayload;

    // --- Validation ---
    if (!body.name || !body.duration || body.base_price === undefined || body.base_price === null) {
      return NextResponse.json({
        success: false, message: 'Name, duration, and base price are required fields.'
      }, { status: 400 });
    }
    if (typeof body.base_price !== 'number' || body.base_price <= 0) {
      return NextResponse.json({ success: false, message: 'Base price must be a positive number.' }, { status: 400 });
    }
    if (body.max_people !== undefined && body.max_people !== null && (typeof body.max_people !== 'number' || body.max_people <= 0)) {
      return NextResponse.json({ success: false, message: 'Max people must be a positive number if provided.' }, { status: 400 });
    }
    if (body.package_categories && !Array.isArray(body.package_categories)) {
      return NextResponse.json({ success: false, message: 'Package categories must be an array.'}, { status: 400 });
    }
    if (body.package_categories) {
      for (const category of body.package_categories) {
        if (!category.category_name || category.price === undefined || category.price === null) {
          return NextResponse.json({ success: false, message: 'Each package category must have a name and price.'}, { status: 400 });
        }
        if (typeof category.price !== 'number' || category.price <= 0) {
          return NextResponse.json({ success: false, message: 'Category price must be a positive number.'}, { status: 400 });
        }
      }
    }

    // --- Prepare data for DB ---
    const packageDataToUpdate = {
      name: body.name,
      description: body.description || null,
      duration: body.duration,
      base_price: body.base_price,
      max_people: body.max_people || null,
      itinerary: typeof body.itinerary === 'object' ? JSON.stringify(body.itinerary) : body.itinerary || null,
      included_services: typeof body.included_services === 'object' ? JSON.stringify(body.included_services) : body.included_services || null,
      images: typeof body.images === 'object' ? JSON.stringify(body.images) : body.images || null,
      cancellation_policy: body.cancellation_policy || null,
      package_categories: (body.package_categories || []).map(category => ({
        ...category,
        images: Array.isArray(category.images) ? JSON.stringify(category.images) : (typeof category.images === 'string' ? category.images : null)
      })),
      is_active: body.is_active === false ? 0 : 1 // Default to active if not specified
    };

    const result: { success: boolean; error?: string; meta?: any; results?: any[] } = await dbService.updatePackage(packageIdInt, packageDataToUpdate);

    if (!result.success) {
      console.error("Package update failed:", result.error);
      return NextResponse.json({
        success: false,
        message: 'Failed to update package',
        error: result.error
      }, { status: 500 });
    }

    if (result.error) {
      // This is a partial success case (package updated but some categories failed)
      return NextResponse.json({
        success: true,
        message: 'Package updated with warnings',
        warning: result.error
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: 'Package updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error(`Error updating package ${packageIdInt}:`, error);
    const apiError: ApiError = {
      message: 'Error updating package',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
}

// --- DELETE handler: Delete a specific package by ID ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { packageId: string } }
) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]);
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const packageIdInt = parseInt(params.packageId, 10);
  if (isNaN(packageIdInt) || packageIdInt <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid package ID.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    // Check if package exists
    const existingPackage = await dbService.getPackageById(packageIdInt);
    if (!existingPackage) {
      return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
    }

    // For safety, we might want to soft delete by setting is_active to 0 instead of actually deleting
    // This would require a method like deactivatePackage() in DatabaseService
    // For now, we'll just update the is_active flag to 0
    const result = await dbService.updatePackage(packageIdInt, { 
      ...existingPackage, // Keep all existing data
      is_active: 0 // Set to inactive
    });

    if (!result.success) {
      console.error("Package deletion (deactivation) failed:", result.error);
      return NextResponse.json({
        success: false,
        message: 'Failed to delete package',
        error: result.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting package ${packageIdInt}:`, error);
    const apiError: ApiError = {
      message: 'Error deleting package',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
} 