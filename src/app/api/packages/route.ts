// Path: src/app/api/packages/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth, verifyAuth } from '@/lib/auth';

// Interface for raw package data from DB for the list
interface DbPackageListItem {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  starting_price?: number | null; // This might be calculated later or come from a view
  max_people: number | null;
  created_by: number;
  is_active: number;
  itinerary: string | Record<string, any> | null;      // Can be JSON string or already object
  included_services: string | string[] | null; // Can be JSON string, array, or raw string
  images: string | string[] | null;            // Can be JSON string, array, or raw string
  cancellation_policy: string | null;
  created_at: string;
  updated_at: string;
}

// Interface for the processed package data to be sent in the API response
interface ProcessedPackage {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  starting_price: number | null;
  max_people: number | null;
  created_by: number;
  is_active: number;
  itinerary_parsed: Record<string, any> | null;
  included_services_parsed: string[];
  images_parsed: string[];
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
  packages: ProcessedPackage[]; // Changed from Package[]
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
  created_by: number;
}

interface PackageFilters {
  searchQuery?: string;
  duration?: string;
  priceRange?: string;
  maxPeople?: number;
}

// Updated Helper function for safe JSON parsing
function safeJsonParse<T>(jsonString: string | null | undefined, parsingFieldName: string, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    if (typeof jsonString === 'object') return jsonString as T; // Already an object
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn(`safeJsonParse: Failed to parse JSON string for ${parsingFieldName}:`, jsonString, error);
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
    const limitParam = searchParams.get('limit') || '9';
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

    if (searchQuery) filters.searchQuery = searchQuery;
    if (durationParam) filters.duration = durationParam;
    if (priceRangeParam) filters.priceRange = priceRangeParam;
    if (maxPeopleParam) {
      const maxPeopleNum = parseInt(maxPeopleParam, 10);
      if (!isNaN(maxPeopleNum)) filters.maxPeople = maxPeopleNum;
    }

    const countResult = await dbService.countAllActivePackages(filters);
    const total = countResult?.total ?? 0;

    const packagesResult = await dbService.getAllActivePackages(limit, offset, filters);

    if (!packagesResult.success || !packagesResult.results) {
      console.error('Failed to fetch packages from DB:', packagesResult.error);
      throw new Error('Database query failed to fetch packages.');
    }

    const rawPackages: DbPackageListItem[] = packagesResult.results;
    
    const processedPackages: ProcessedPackage[] = await Promise.all(rawPackages.map(async (pkg) => {
      // Starting_price calculation (mocked as per original, should be from DB service)
      let calculatedStartingPrice: number | null = pkg.starting_price !== undefined ? pkg.starting_price : pkg.base_price;
      // const categories = await dbService.getPackageCategoriesByPackageId(pkg.id); // Ideal
      // if (categories && categories.length > 0) {
      //   calculatedStartingPrice = categories.reduce((min, cat) => Math.min(min, cat.price), Infinity);
      //   if (calculatedStartingPrice === Infinity) calculatedStartingPrice = pkg.base_price;
      // }

      // --- Parse included_services ---
      let parsedIncludedServices: string[] = [];
      if (pkg.included_services) {
        if (Array.isArray(pkg.included_services)) {
          parsedIncludedServices = pkg.included_services.map(s => String(s));
        } else if (typeof pkg.included_services === 'string') {
          const serviceStr = pkg.included_services.trim();
          if ((serviceStr.startsWith('[') && serviceStr.endsWith(']')) || (serviceStr.startsWith('"') && serviceStr.endsWith('"'))) {
            try {
              const tempParsed = JSON.parse(serviceStr);
              if (Array.isArray(tempParsed)) {
                parsedIncludedServices = tempParsed.map(s => String(s));
              } else if (typeof tempParsed === 'string') {
                parsedIncludedServices = [tempParsed];
              } else {
                console.warn(`Package ID ${pkg.id}: included_services initially looked like JSON but parsed to an unexpected type. Original: '${serviceStr}'. Splitting by comma.`);
                parsedIncludedServices = serviceStr.split(',').map(s => s.trim()).filter(s => s !== '');
              }
            } catch (e) {
              console.log(`Package ID ${pkg.id}: JSON.parse failed for apparent JSON included_services ('${serviceStr}'), attempting comma split.`);
              parsedIncludedServices = serviceStr.split(',').map(s => s.trim()).filter(s => s !== '');
            }
          } else {
            // console.log(`Package ID ${pkg.id}: included_services ('${serviceStr}') does not look like JSON, splitting by comma.`);
            parsedIncludedServices = serviceStr.split(',').map(s => s.trim()).filter(s => s !== '');
          }
        }
      }

      // --- Parse images ---
      let parsedImages: string[] = [];
      if (pkg.images) {
        if (Array.isArray(pkg.images)) {
          parsedImages = pkg.images.map(s => String(s));
        } else if (typeof pkg.images === 'string') {
          const imageStr = pkg.images.trim();
          if ((imageStr.startsWith('[') && imageStr.endsWith(']')) || (imageStr.startsWith('"') && imageStr.endsWith('"'))) {
            try {
              const tempParsed = JSON.parse(imageStr);
              if (Array.isArray(tempParsed)) {
                parsedImages = tempParsed.map(s => String(s));
              } else if (typeof tempParsed === 'string') {
                parsedImages = [tempParsed];
              } else {
                console.warn(`Package ID ${pkg.id}: images initially looked like JSON but parsed to an unexpected type. Original: '${imageStr}'. Splitting/treating as single.`);
                parsedImages = (imageStr.startsWith('http') || imageStr.startsWith('/')) && !imageStr.includes(',') ? [imageStr] : imageStr.split(',').map(s => s.trim()).filter(s => s !== '');
              }
            } catch (e) {
              console.log(`Package ID ${pkg.id}: JSON.parse failed for apparent JSON images ('${imageStr}'), attempting comma split or treating as single.`);
              parsedImages = (imageStr.startsWith('http') || imageStr.startsWith('/')) && !imageStr.includes(',') ? [imageStr] : imageStr.split(',').map(s => s.trim()).filter(s => s !== '');
            }
          } else {
            // console.log(`Package ID ${pkg.id}: images ('${imageStr}') does not look like JSON, splitting by comma or treating as single.`);
            parsedImages = (imageStr.startsWith('http') || imageStr.startsWith('/')) && !imageStr.includes(',') ? [imageStr] : imageStr.split(',').map(s => s.trim()).filter(s => s !== '');
          }
        }
      }

      // --- Parse itinerary ---
      let parsedItinerary: Record<string, any> | null = null;
      if (pkg.itinerary) {
        if (typeof pkg.itinerary === 'object' && !Array.isArray(pkg.itinerary)) { // Already an object (and not an array)
          parsedItinerary = pkg.itinerary;
        } else if (typeof pkg.itinerary === 'string') {
          parsedItinerary = safeJsonParse(pkg.itinerary, `pkg.itinerary for Package ID ${pkg.id}`, {});
        }
      }
      if (parsedItinerary === null) parsedItinerary = {}; // Default to empty object

      return {
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        duration: pkg.duration,
        base_price: pkg.base_price,
        starting_price: calculatedStartingPrice, // Use calculated or existing
        max_people: pkg.max_people,
        created_by: pkg.created_by,
        is_active: pkg.is_active,
        itinerary_parsed: parsedItinerary,
        included_services_parsed: parsedIncludedServices,
        images_parsed: parsedImages,
        cancellation_policy: pkg.cancellation_policy,
        created_at: pkg.created_at,
        updated_at: pkg.updated_at,
      };
    }));

    const totalPages = Math.ceil(total / limit);

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

// POST handler (remains largely the same, ensure it uses CreatePackagePayload)
export async function POST(request: NextRequest) {
  const dbService = new DatabaseService();
  // ... (auth and validation logic as before) ...
  // Ensure the rest of the POST handler is compatible with CreatePackagePayload
  // and the DatabaseService method for creating packages.
  // This part is complex and depends on the dbService.createPackageWithCategories method implementation.

  // Example of how to handle potentially stringified JSON from payload for DB insertion:
  // let itineraryForDb: string | null = null;
  // if (body.itinerary) {
  //   itineraryForDb = typeof body.itinerary === 'string' ? body.itinerary : JSON.stringify(body.itinerary);
  // }
  // Similar for included_services, images if they can be objects in payload.

  // Placeholder for the rest of the POST logic
  try {
    const authResult = await requireAuth(request, [1]);
    if (authResult) return authResult;
    const { user } = await verifyAuth(request);
    if (!user || !user.id) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 });
    }
    const userId = Number(user.id);
    const body = await request.json() as CreatePackagePayload;

    // Validation (simplified, ensure it's robust)
    if (!body.name || !body.duration || body.base_price === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    // Construct the payload for dbService.createPackage
    const packageDataForDb: CreatePackagePayload = {
        name: body.name,
        description: body.description || null,
        duration: body.duration,
        base_price: body.base_price,
        max_people: body.max_people || null,
        // Ensure itinerary, included_services, images are stringified if they are objects
        itinerary: body.itinerary ? (typeof body.itinerary === 'string' ? body.itinerary : JSON.stringify(body.itinerary)): null,
        included_services: body.included_services ? (typeof body.included_services === 'string' ? body.included_services : JSON.stringify(body.included_services)) : null,
        images: body.images ? (typeof body.images === 'string' ? body.images : JSON.stringify(body.images)) : null,
        cancellation_policy: body.cancellation_policy || null,
        created_by: userId,
        package_categories: body.package_categories || [] 
    };

    // Call the correct DatabaseService method with the single payload object
    const newPackageResult = await dbService.createPackage(packageDataForDb);

    // Check the structure of newPackageResult based on its Promise return type in DatabaseService
    // It can be D1Result, D1ResultWithError, or { success: false; error: string; ... }
    if ('success' in newPackageResult && !newPackageResult.success) {
        // This handles the { success: false; error: string; ... } case
        return NextResponse.json({ success: false, message: newPackageResult.error || 'Failed to create package.' }, { status: 500 });
    }
    
    // For D1Result, check for meta.last_row_id. D1ResultWithError also has meta.
    // The 'as any' is used because D1Result doesn't strictly define 'meta' in its base type, but it's usually there for inserts.
    const d1Result = newPackageResult as any;
    if (!d1Result.meta || d1Result.meta.last_row_id === undefined || d1Result.meta.last_row_id === null) {
        console.error('Package creation failed or did not return last_row_id:', d1Result);
        return NextResponse.json({ success: false, message: d1Result.error || 'Failed to create package or retrieve ID.' }, { status: 500 });
    }

    return NextResponse.json({ 
        success: true, 
        message: 'Package created successfully', 
        data: { id: d1Result.meta.last_row_id } // Return the new package ID
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ 
        success: false, 
        message: 'Failed to create package', 
        error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}