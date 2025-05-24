// Path: src/app/api/packages/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth, verifyAuth } from '@/lib/auth';

// Define all interfaces for the API
interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  starting_price: number | null; // Added starting_price
  max_people: number | null;
  created_by: number;
  is_active: number; // 0 or 1
  itinerary: Record<string, string> | null; // Changed type
  included_services: string[] | null; // Changed type
  images: string[] | null; // Changed type
  cancellation_policy: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface GetPackagesResponse {
  packages: Package[];
  pagination: PaginationInfo;
}

interface ApiError {
  message: string;
  error?: string;
}

interface PackageCategoryPayload {
  category_name: string;
  price: number;
  hotel_details?: string | null;
  category_description?: string | null;
  max_pax_included_in_price?: number | null;
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
}

interface PackageFilters {
  searchQuery?: string; // Added searchQuery
  duration?: string; // Type remains string, logic will handle specific formats
  priceRange?: string; // Added priceRange, replacing minPrice and maxPrice
  maxPeople?: number;
}

// Helper function for safe JSON parsing
function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON string:', jsonString, error);
    return defaultValue;
  }
}

// GET handler to retrieve packages
export async function GET(request: NextRequest) {
  const dbService = new DatabaseService();
  const searchParams = request.nextUrl.searchParams;

  try {
    // Pagination
    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '9'; // Default limit
    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ success: false, message: 'Invalid page parameter.' }, { status: 400 });
    }
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({ success: false, message: 'Invalid limit parameter.' }, { status: 400 });
    }
    const offset = (page - 1) * limit;

    // Filtering
    const filters: PackageFilters = {};
    const searchQuery = searchParams.get('searchQuery');
    const durationParam = searchParams.get('duration');
    const priceRangeParam = searchParams.get('priceRange');
    const maxPeopleParam = searchParams.get('maxPeople');

    if (searchQuery) {
      filters.searchQuery = searchQuery;
    }
    if (durationParam) {
      filters.duration = durationParam;
    }
    if (priceRangeParam) {
      filters.priceRange = priceRangeParam;
    }
    if (maxPeopleParam) {
      const maxPeople = parseInt(maxPeopleParam, 10);
      if (!isNaN(maxPeople)) filters.maxPeople = maxPeople;
    }

    // Execute Queries using Service
    const countResult = await dbService.countAllActivePackages(filters);
    const total = countResult?.total ?? 0;

    const packagesResult = await dbService.getAllActivePackages(limit, offset, filters);

    if (!packagesResult.success) {
      console.error('Failed to fetch packages from D1:', packagesResult.error);
      throw new Error('Database query failed to fetch packages.');
    }

    const rawPackages = packagesResult.results || [];
    
    // Process packages: calculate starting_price and parse JSON fields
    const processedPackages: Package[] = await Promise.all(rawPackages.map(async (pkg: any) => {
      // TODO: Replace with actual DB call: const categories = await dbService.getPackageCategoriesByPackageId(pkg.id);
      // TODO: Replace with actual DB call: const categories = await dbService.getPackageCategoriesByPackageId(pkg.id);
      // For now, mocking categories or assuming none. This will be part of lib/database.ts changes.
      const categories: PackageCategoryPayload[] = []; // Mock: assuming no categories for now

      let calculatedStartingPrice: number | null = null;
      if (categories && categories.length > 0) {
        calculatedStartingPrice = categories.reduce((min, cat) => Math.min(min, cat.price), Infinity);
        if (calculatedStartingPrice === Infinity) { // Should not happen if categories is not empty and prices are valid
            calculatedStartingPrice = null; 
        }
      } else {
        // If no categories, starting_price is null.
        // Alternative: calculatedStartingPrice = pkg.base_price; if base_price should be the fallback.
      }

      return {
        ...pkg,
        starting_price: calculatedStartingPrice,
        images: safeJsonParse<string[] | null>(pkg.images, null),
        itinerary: safeJsonParse<Record<string, string> | null>(pkg.itinerary, null),
        included_services: safeJsonParse<string[] | null>(pkg.included_services, null),
        // Ensure other fields like base_price, duration etc. are correctly passed through
        // The ...pkg spread should handle this, but explicit mapping can be done if needed.
      };
    }));

    const totalPages = Math.ceil(total / limit);

    // Format Response
    const responseData: GetPackagesResponse = {
      packages: processedPackages,
      pagination: {
        totalItems: total,
        currentPage: page,
        pageSize: limit,
        totalPages: totalPages
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Packages retrieved successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
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

// POST handler to create a new package
export async function POST(request: NextRequest) {
  const dbService = new DatabaseService();

  try {
    // Admin check - assuming admin role_id is 1
    const authResult = await requireAuth(request, [1]);
    if (authResult) {
      // If authResult is not null, authentication failed
      return authResult;
    }

    // Get authenticated user info from token
    const { user } = await verifyAuth(request);
    
    // Ensure userId exists and is a number
    if (!user || !user.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unable to identify user from authentication token' 
      }, { status: 401 });
    }
    
    const userId = Number(user.id);

    const body = await request.json() as CreatePackagePayload;

    // Validation
    if (!body.name || !body.duration || body.base_price === undefined || body.base_price === null) {
      return NextResponse.json({
        success: false, message: 'Name, duration, and base price are required fields.', data: null
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
      created_by: userId,
      package_categories: body.package_categories || [] 
    };

    const result = await dbService.createPackage(packageDataToCreate);

    if (!result.success || !result.meta?.last_row_id) {
      console.error("Package insert failed using service, D1 result:", result);
      throw new Error('Database operation failed to create package or return ID.');
    }

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data: { id: result.meta.last_row_id } 
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