// Path: src/app/api/packages/[id]/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
// --- FIX: Import DatabaseService instead of getDatabase ---
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


// --- Define PackageCategory interface ---
interface PackageCategory { // This is the structure we want for the API response for categories
  id: number;
  package_id: number;
  category_name: string;
  price: number;
  hotel_details: string | null; // CHANGED: Was Record<string, any> | null
  category_description: string | null;
  max_pax_included_in_price: number | null;
  images: string[] | null; // Parsed from JSON string
  // created_at and updated_at can be added if needed for the response
}

// Raw DB structure for categories (assuming 'images' and 'hotel_details' are strings)
interface DbPackageCategory {
  id: number;
  package_id: number;
  category_name: string;
  price: number;
  hotel_details: string | null; // JSON string from DB
  category_description: string | null;
  max_pax_included_in_price: number | null;
  images: string | null; // JSON string from DB
  created_at?: string;
  updated_at?: string;
}


// --- Updated Package interface ---
// This interface reflects the structure of the data AS STORED IN THE DATABASE (raw form)
interface DbPackage {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  number_of_days?: number | null; // Added field for number of days
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number; // 0 or 1
  itinerary: string | Record<string, any> | null;      // Can be JSON string or already object
  included_services: string | string[] | null; // Can be JSON string, array, or raw string
  images: string | string[] | null;            // Can be JSON string, array, or raw string
  created_at: string;
  updated_at: string;
  cancellation_policy?: string | null; // Added to match potential DB field
  // categories are not directly on this table, fetched separately
}

// --- Define structure for itinerary parts expected by Frontend ---
interface ApiItineraryActivity {
    name: string;
    time: string;
    duration: string;
}
interface ApiItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: ApiItineraryActivity[];
  meals: string[];
  accommodation: string;
}

interface ApiItineraryParsed {
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    days?: ApiItineraryDay[];
    notes?: string;
}

// This interface reflects the structure of the data WE WANT TO SEND TO THE CLIENT
interface ApiPackageResponse {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  number_of_days?: number | null; // Added field for number of days
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number;
  itinerary_parsed: ApiItineraryParsed | null;
  included_services_parsed: string[];
  images_parsed: string[];
  created_at: string;
  updated_at: string;
  categories: PackageCategory[]; // Added categories field
  cancellation_policy?: string | null;
}
// --- End Interface Definitions ---


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const dbService = new DatabaseService();
  const packageId = parseInt(params.id, 10);

  if (isNaN(packageId) || packageId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid package ID.' }, { status: 400 });
  }

  try {
    const pkg = await dbService.getPackageById(packageId) as DbPackage | null;

    if (!pkg) {
      return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
    }
    console.log(`[API GET /api/packages/${packageId}] Raw package from DB:`, JSON.stringify(pkg));

    const parsedIncludedServices = safeJsonParseArray(pkg.included_services, `pkg.included_services for Package ID ${pkg.id}`);
    console.log(`[API GET /api/packages/${packageId}] Parsed included_services:`, parsedIncludedServices);

    const parsedImages = safeJsonParseArray(pkg.images, `pkg.images for Package ID ${pkg.id}`);
    console.log(`[API GET /api/packages/${packageId}] Parsed images:`, parsedImages);
    
    let parsedItineraryRaw: Record<string, any>;
    if (typeof pkg.itinerary === 'object' && pkg.itinerary !== null) {
        parsedItineraryRaw = pkg.itinerary; 
    } else if (typeof pkg.itinerary === 'string') {
        parsedItineraryRaw = safeJsonParseObject(pkg.itinerary, `pkg.itinerary for Package ID ${pkg.id}`, {});
    } else {
        parsedItineraryRaw = {};
    }
    console.log(`[API GET /api/packages/${packageId}] Raw parsed itinerary object:`, parsedItineraryRaw);

    const finalItineraryForClient: ApiItineraryParsed = {
        days: [],
        highlights: Array.isArray(parsedItineraryRaw.highlights) ? parsedItineraryRaw.highlights.map((h:any) => String(h)) : [],
        inclusions: Array.isArray(parsedItineraryRaw.inclusions) ? parsedItineraryRaw.inclusions.map((i:any) => String(i)) : [],
        exclusions: Array.isArray(parsedItineraryRaw.exclusions) ? parsedItineraryRaw.exclusions.map((e:any) => String(e)) : [],
        notes: typeof parsedItineraryRaw.notes === 'string' ? parsedItineraryRaw.notes : ""
    };

    if (Array.isArray(parsedItineraryRaw.days)) {
        finalItineraryForClient.days = parsedItineraryRaw.days.map((d: any) => ({
            day: typeof d.day === 'number' ? d.day : 0,
            title: typeof d.title === 'string' ? d.title : "Untitled Day",
            description: typeof d.description === 'string' ? d.description : "",
            activities: Array.isArray(d.activities) ? d.activities.map((a: any) => ({
                name: typeof a.name === 'string' ? a.name : "Unnamed Activity",
                time: typeof a.time === 'string' ? a.time : "N/A",
                duration: typeof a.duration === 'string' ? a.duration : "N/A"
            })) : [],
            meals: Array.isArray(d.meals) ? d.meals.map((m:any) => String(m)) : [],
            accommodation: typeof d.accommodation === 'string' ? d.accommodation : "N/A"
        }));
    } else {
        const dayEntries = Object.entries(parsedItineraryRaw)
            .filter(([key]) => key.startsWith('day') && !isNaN(parseInt(key.substring(3))))
            .sort(([keyA], [keyB]) => parseInt(keyA.substring(3)) - parseInt(keyB.substring(3))); 
        
        if (dayEntries.length > 0) {
            finalItineraryForClient.days = dayEntries.map(([key, value]) => {
                const dayNum = parseInt(key.substring(3));
                let dayTitle = `Day ${dayNum}`;
                let dayDesc = "";
                let dayActivities: ApiItineraryActivity[] = [];
                let dayMeals: string[] = [];
                let dayAccommodation = "N/A";

                if (typeof value === 'object' && value !== null) {
                    dayTitle = typeof (value as any).title === 'string' ? (value as any).title : dayTitle;
                    dayDesc = typeof (value as any).description === 'string' ? (value as any).description : (typeof value === 'string' ? value : "");
                    dayActivities = (Array.isArray((value as any).activities) ? (value as any).activities.map((a: any) => ({
                        name: typeof a.name === 'string' ? a.name : "Unnamed Activity",
                        time: typeof a.time === 'string' ? a.time : "N/A",
                        duration: typeof a.duration === 'string' ? a.duration : "N/A"
                    })) : []) as ApiItineraryActivity[];
                    dayMeals = (Array.isArray((value as any).meals) ? (value as any).meals.map((m: any) => String(m)) : []) as string[];
                    dayAccommodation = typeof (value as any).accommodation === 'string' ? (value as any).accommodation : "N/A";
                } else if (typeof value === 'string') {
                    dayDesc = value;
                }
                
                return {
                    day: dayNum,
                    title: dayTitle,
                    description: dayDesc,
                    activities: dayActivities,
                    meals: dayMeals,
                    accommodation: dayAccommodation
                };
            });
        }
    }
    console.log(`[API GET /api/packages/${packageId}] Final itinerary_parsed for client:`, JSON.stringify(finalItineraryForClient));
    
    // --- Fetch and process package categories ---
    const categoriesResult = await dbService.getPackageCategories(packageId); // D1Result<any[]>
    const rawCategories: DbPackageCategory[] = categoriesResult?.results || [];
    console.log(`[API GET /api/packages/${packageId}] Raw categories from DB:`, JSON.stringify(rawCategories));

    const processedCategories: PackageCategory[] = rawCategories.map(cat => {
      // Use safeJsonParseArray for category images
      const parsedCatImages = safeJsonParseArray(cat.images, `category ${cat.id} images`);
      
      // REMOVED: Old parsing for hotel_details
      // const parsedHotelDetails = safeJsonParseObject(cat.hotel_details, `category ${cat.id} hotel_details`, {});

      return {
        id: cat.id,
        package_id: cat.package_id,
        category_name: cat.category_name,
        price: cat.price,
        hotel_details: cat.hotel_details, // CHANGED: Directly use the string from DB
        category_description: cat.category_description,
        max_pax_included_in_price: cat.max_pax_included_in_price,
        images: parsedCatImages,
        // created_at: cat.created_at, // uncomment if needed
        // updated_at: cat.updated_at, // uncomment if needed
      };
    });
    console.log(`[API GET /api/packages/${packageId}] Processed categories for client:`, JSON.stringify(processedCategories));


    const enrichedPkg: ApiPackageResponse = {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      number_of_days: pkg.number_of_days,
      base_price: pkg.base_price,
      max_people: pkg.max_people,
      created_by: pkg.created_by,
      is_active: pkg.is_active,
      itinerary_parsed: finalItineraryForClient,
      included_services_parsed: parsedIncludedServices,
      images_parsed: parsedImages,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
      categories: processedCategories, 
      cancellation_policy: pkg.cancellation_policy
    };

    return NextResponse.json({ success: true, data: enrichedPkg });

  } catch (error) {
    console.error(`Error fetching package ${packageId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve package details', error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
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
