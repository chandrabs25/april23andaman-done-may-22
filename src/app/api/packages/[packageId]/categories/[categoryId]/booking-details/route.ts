// Path: src/app/api/packages/[packageId]/categories/[categoryId]/booking-details/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// Helper function for safe JSON parsing for objects (e.g. itinerary, hotel_details)
function safeJsonParseObject(jsonString: string | null | undefined, parsingFieldName: string, defaultValue: Record<string, any>): Record<string, any> {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    if (typeof jsonString === 'object' && jsonString !== null) {
        console.warn(`safeJsonParseObject: ${parsingFieldName} was already an object. Returning as is.`);
        return jsonString; 
    }
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
    }
    console.warn(`safeJsonParseObject: ${parsingFieldName} did not parse to a valid object. Original:`, jsonString);
    return defaultValue;
  } catch (error) {
    console.warn(`safeJsonParseObject: Failed to parse JSON string for ${parsingFieldName}:`, jsonString, error);
    return defaultValue;
  }
}

// Helper function for safe JSON parsing for arrays (e.g. images, included_services)
function safeJsonParseArray(jsonString: string | string[] | null | undefined, parsingFieldName: string): string[] {
  if (!jsonString) {
    return [];
  }
  if (Array.isArray(jsonString)) { // If it's already an array
    return jsonString.map(s => String(s));
  }
  // If it's a string, try to parse
  if (typeof jsonString === 'string') {
    const str = jsonString.trim();
    if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('"') && str.endsWith('"'))) { // Check if it looks like a JSON array/string
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          return parsed.map(s => String(s));
        } else if (typeof parsed === 'string') { // If JSON.parse results in a single string
          return [parsed];
        }
        console.warn(`safeJsonParseArray: ${parsingFieldName} looked like JSON but parsed to an unexpected type. Original: '${str}'.`);
        return []; // Or handle as comma-separated if that's a fallback
      } catch (e) {
        console.warn(`safeJsonParseArray: JSON.parse failed for ${parsingFieldName} ('${str}').`);
        // Fallback for non-JSON strings if necessary, e.g., comma-separated
        // For now, if it looks like JSON but fails to parse, return empty or handle as error
        return (str.startsWith('http') || str.startsWith('/')) && !str.includes(',') ? [str] : str.split(',').map(s => s.trim()).filter(s => s !== '');
      }
    } else { // Treat as a single item or comma-separated list if not wrapped in [] or ""
        return (str.startsWith('http') || str.startsWith('/')) && !str.includes(',') ? [str] : str.split(',').map(s => s.trim()).filter(s => s !== '');
    }
  }
  console.warn(`safeJsonParseArray: ${parsingFieldName} was not a string or array. Returning empty array.`);
  return [];
}

// --- DB Structure Interfaces ---
interface DbPackage {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number; // 0 or 1
  itinerary: string | Record<string, any> | null;
  included_services: string | string[] | null;
  images: string | string[] | null;
  created_at: string;
  updated_at: string;
  cancellation_policy?: string | null;
}

interface DbPackageCategory {
  id: number;
  package_id: number;
  category_name: string;
  price: number;
  hotel_details: string | null; 
  category_description: string | null;
  max_pax_included_in_price: number | null;
  images: string | null; // JSON string from DB
  created_at?: string;
  updated_at?: string;
}

// --- API Response Interface for this endpoint ---
interface BookingDetailsApiResponseData {
  packageName: string;
  packageImage: string | null;
  categoryName: string;
  categoryDescription: string | null;
  pricePerPerson: number;
  maxPaxIncludedInPrice: number | null;
  hotelDetails: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { packageId: string; categoryId: string } }
) {
  const dbService = new DatabaseService();
  const packageId = parseInt(params.packageId, 10);
  const categoryId = parseInt(params.categoryId, 10);

  if (isNaN(packageId) || packageId <= 0 || isNaN(categoryId) || categoryId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid package or category ID.' }, { status: 400 });
  }

  try {
    // Fetch basic package details
    const pkg = await dbService.getPackageById(packageId) as DbPackage | null;

    if (!pkg) {
      return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
    }
    console.log(`[API GET /booking-details] Raw package from DB (ID ${packageId}):`, JSON.stringify(pkg));

    // Fetch all categories for the package
    const categoriesResult = await dbService.getPackageCategories(packageId);
    const rawCategories: DbPackageCategory[] = categoriesResult?.results || [];
    console.log(`[API GET /booking-details] Raw categories for package ID ${packageId}:`, JSON.stringify(rawCategories));

    // Find the specific category
    const targetCategory = rawCategories.find(cat => cat.id === categoryId);

    if (!targetCategory) {
      return NextResponse.json({ success: false, message: 'Category not found for this package.' }, { status: 404 });
    }
    // Implicit check: targetCategory.package_id should match packageId because we fetched categories for this packageId
    console.log(`[API GET /booking-details] Found target category (ID ${categoryId}):`, JSON.stringify(targetCategory));

    // Parse package images
    const parsedPackageImages = safeJsonParseArray(pkg.images, `pkg.images for Package ID ${pkg.id}`);
    const packageImage = parsedPackageImages.length > 0 ? parsedPackageImages[0] : null;

    const responseData: BookingDetailsApiResponseData = {
      packageName: pkg.name,
      packageImage: packageImage,
      categoryName: targetCategory.category_name,
      categoryDescription: targetCategory.category_description,
      pricePerPerson: targetCategory.price,
      maxPaxIncludedInPrice: targetCategory.max_pax_included_in_price,
      hotelDetails: targetCategory.hotel_details, // Used directly as string
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching booking details for package ${packageId}, category ${categoryId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve details.', error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
