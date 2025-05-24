export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth, VerifiedUser, verifyAuth } from '@/lib/auth'; // Import custom auth

// --- Interfaces ---
interface PackageCategoryPayload {
  category_name: string;
  price: number;
  hotel_details?: string | null;
  category_description?: string | null;
  max_pax_included_in_price?: number | null;
  images?: string[];
}

interface CreatePackagePayload {
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

// --- GET handler: List all packages (admin view includes inactive) ---
export async function GET(request: NextRequest) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]);
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const dbService = new DatabaseService();
  const searchParams = request.nextUrl.searchParams;

  try {
    // --- Pagination ---
    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '10';
    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ success: false, message: 'Invalid page parameter.' }, { status: 400 });
    }
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ success: false, message: 'Invalid limit parameter.' }, { status: 400 });
    }
    const offset = (page - 1) * limit;

    // --- Filtering ---
    // For admin view, we might want to add status filter (active/inactive)
    const filters: { 
      minPrice?: number; 
      maxPrice?: number; 
      duration?: string; 
      maxPeople?: number;
      isActive?: boolean;
    } = {};
    
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const durationParam = searchParams.get('duration');
    const maxPeopleParam = searchParams.get('maxPeople');
    const statusParam = searchParams.get('status'); // 'active', 'inactive', or null for all

    if (minPriceParam) {
      const minPrice = parseFloat(minPriceParam);
      if (!isNaN(minPrice)) filters.minPrice = minPrice;
    }
    if (maxPriceParam) {
      const maxPrice = parseFloat(maxPriceParam);
      if (!isNaN(maxPrice)) filters.maxPrice = maxPrice;
    }
    if (durationParam) {
      filters.duration = durationParam;
    }
    if (maxPeopleParam) {
      const maxPeople = parseInt(maxPeopleParam, 10);
      if (!isNaN(maxPeople)) filters.maxPeople = maxPeople;
    }
    if (statusParam === 'active') {
      filters.isActive = true;
    } else if (statusParam === 'inactive') {
      filters.isActive = false;
    }

    // --- Execute Queries ---
    // Note: For admin, we need to get ALL packages, not just active ones
    // This would require a new method in DatabaseService like getAllPackages() instead of getAllActivePackages()
    // For now, we'll use the existing method and note that it should be extended
    
    // Use getAllPackages to get both active and inactive packages based on filters
    const countResult = await dbService.countAllPackages(filters);
    const total = countResult?.total ?? 0;

    const packagesResult = await dbService.getAllPackages(limit, offset, filters);
    if (!packagesResult.success) {
      console.error('Failed to fetch packages from D1:', packagesResult.error);
      throw new Error('Database query failed to fetch packages.');
    }

    const rawPackagesData = packagesResult.results || [];
    
    // Helper function to safely parse JSON strings (adapted from DatabaseService._parseJsonString)
    const parseJsonStringForImages = (jsonString: string | null | undefined): string[] => {
      if (jsonString === null || jsonString === undefined || typeof jsonString !== 'string' || jsonString.trim() === "") {
        return [];
      }
      try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          return parsed;
        }
        if (typeof parsed === 'string' && parsed.trim()) {
          return [parsed.trim()];
        }
        if (Array.isArray(parsed)) {
          const stringArray = parsed.map(String).filter(Boolean);
          return stringArray.length > 0 ? stringArray : [];
        }
        if (parsed !== null && parsed !== undefined) {
          const strVal = String(parsed).trim();
          return strVal ? [strVal] : [];
        }
        return [];
      } catch (e) {
        // If JSON.parse fails, treat the original string as a single item or comma-separated list
        if (jsonString.includes(',')) {
          return jsonString.split(',').map(s => s.trim()).filter(Boolean);
        }
        const trimmedString = jsonString.trim();
        if (trimmedString) {
          return [trimmedString];
        }
        return [];
      }
    };

    const packagesData = rawPackagesData.map((pkg: { images: string | null | undefined; }) => ({
      ...pkg,
      images: parseJsonStringForImages(pkg.images),
    }));

    const totalPages = Math.ceil(total / limit);

    // --- Format Response ---
    return NextResponse.json({
      success: true,
      message: 'Packages retrieved successfully',
      data: {
        packages: packagesData,
        pagination: {
          totalItems: total,
          currentPage: page,
          pageSize: limit,
          totalPages: totalPages
        }
      }
    });

  } catch (error) {
    console.error('Error fetching packages for admin:', error);
    const apiError: ApiError = {
      message: 'Failed to retrieve packages',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
}

// --- POST handler: Create a new package ---
export async function POST(request: NextRequest) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]);
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  // Additionally, we need the admin's ID to set as created_by
  // We can get this by calling verifyAuth separately if requireAuth doesn't return it
  // For now, this is a simplified version. If verifyAuth is updated to return user, use that.
  const { user } = await verifyAuth(request); // Assuming verifyAuth can be called like this
  if (!user || !user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized: Could not retrieve admin user ID." }, { status: 403 });
  }
  const adminId = Number(user.id);

  const dbService = new DatabaseService();

  try {
    const body = await request.json() as CreatePackagePayload;

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
    const packageDataToCreate = {
      name: body.name,
      description: body.description || null,
      duration: body.duration,
      base_price: body.base_price,
      max_people: body.max_people || null,
      itinerary: typeof body.itinerary === 'object' ? JSON.stringify(body.itinerary) : body.itinerary || null,
      included_services: typeof body.included_services === 'object' ? JSON.stringify(body.included_services) : body.included_services || null,
      images: typeof body.images === 'object' ? JSON.stringify(body.images) : body.images || null,
      cancellation_policy: body.cancellation_policy || null,
      created_by: adminId, // Use the fetched adminId
      package_categories: (body.package_categories || []).map(cat => ({
        ...cat,
        images: cat.images && Array.isArray(cat.images) ? JSON.stringify(cat.images) : null // Stringify category images
      })),
      is_active: body.is_active === false ? 0 : 1 // Default to active if not specified
    };

    const result: { success: boolean; error?: string; meta?: any } = await dbService.createPackage(packageDataToCreate);

    if (!result.success) {
      console.error("Package creation failed:", result.error);
      return NextResponse.json({
        success: false,
        message: 'Failed to create package',
        error: result.error
      }, { status: 500 });
    }

    if (result.error) {
      // This is a partial success case (package created but some categories failed)
      return NextResponse.json({
        success: true,
        message: 'Package created with warnings',
        warning: result.error,
        data: { id: result.meta?.last_row_id } // Access last_row_id safely
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data: { id: result.meta?.last_row_id } // Access last_row_id safely
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating package:', error);
    const apiError: ApiError = {
      message: 'Error creating package',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
} 