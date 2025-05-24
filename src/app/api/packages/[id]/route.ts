// Path: src/app/api/packages/[id]/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
// --- FIX: Import DatabaseService instead of getDatabase ---
import { DatabaseService } from '@/lib/database';

// Helper function for safe JSON parsing for objects (e.g. itinerary)
function safeJsonParseObject(jsonString: string | null | undefined, parsingFieldName: string, defaultValue: Record<string, any>): Record<string, any> {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    // If it's already an object (and not null), no need to parse. This case should ideally be handled before calling.
    // However, keeping it here as a safeguard within the function itself.
    if (typeof jsonString === 'object' && jsonString !== null) {
        console.warn(`safeJsonParseObject: ${parsingFieldName} was already an object. Returning as is. This might indicate redundant parsing call.`);
        return jsonString; 
    }
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
    }
    console.warn(`safeJsonParseObject: ${parsingFieldName} did not parse to a valid object after JSON.parse. Original:`, jsonString);
    return defaultValue;
  } catch (error) {
    console.warn(`safeJsonParseObject: Failed to parse JSON string for ${parsingFieldName}:`, jsonString, error);
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
// This interface reflects the structure of the data AS STORED IN THE DATABASE (raw form)
interface DbPackage {
  id: number;
  name: string;
  description: string | null;
  duration: string;
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

    // --- Parse included_services ---
    let parsedIncludedServices: string[] = [];
    if (pkg.included_services) {
      if (Array.isArray(pkg.included_services)) {
        parsedIncludedServices = pkg.included_services.map((s: any) => String(s));
      } else if (typeof pkg.included_services === 'string') {
        const serviceStr = pkg.included_services.trim();
        if ((serviceStr.startsWith('[') && serviceStr.endsWith(']')) || (serviceStr.startsWith('"') && serviceStr.endsWith('"'))) {
          try {
            const tempParsed = JSON.parse(serviceStr);
            if (Array.isArray(tempParsed)) {
              parsedIncludedServices = tempParsed.map((s: any) => String(s));
            } else if (typeof tempParsed === 'string') {
              parsedIncludedServices = [tempParsed];
            } else {
              console.warn(`Package ID ${pkg.id}: included_services initially looked like JSON but parsed to an unexpected type. Original: '${serviceStr}'. Splitting by comma.`);
              parsedIncludedServices = serviceStr.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
            }
          } catch (e) {
            console.log(`Package ID ${pkg.id}: JSON.parse failed for apparent JSON included_services ('${serviceStr}'), attempting comma split.`);
            parsedIncludedServices = serviceStr.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
          }
        } else {
          parsedIncludedServices = serviceStr.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
        }
      }
    }
    console.log(`[API GET /api/packages/${packageId}] Parsed included_services:`, parsedIncludedServices);

    // --- Parse images ---
    let parsedImages: string[] = [];
    if (pkg.images) {
      if (Array.isArray(pkg.images)) {
        parsedImages = pkg.images.map((s: any) => String(s));
      } else if (typeof pkg.images === 'string') {
        const imageStr = pkg.images.trim();
        if ((imageStr.startsWith('[') && imageStr.endsWith(']')) || (imageStr.startsWith('"') && imageStr.endsWith('"'))) {
          try {
            const tempParsed = JSON.parse(imageStr);
            if (Array.isArray(tempParsed)) {
              parsedImages = tempParsed.map((s: any) => String(s));
            } else if (typeof tempParsed === 'string') {
              parsedImages = [tempParsed];
            } else {
              console.warn(`Package ID ${pkg.id}: images initially looked like JSON but parsed to an unexpected type. Original: '${imageStr}'. Splitting/treating as single.`);
              parsedImages = (imageStr.startsWith('http') || imageStr.startsWith('/')) && !imageStr.includes(',') ? [imageStr] : imageStr.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
            }
          } catch (e) {
            console.log(`Package ID ${pkg.id}: JSON.parse failed for apparent JSON images ('${imageStr}'), attempting comma split or treating as single.`);
            parsedImages = (imageStr.startsWith('http') || imageStr.startsWith('/')) && !imageStr.includes(',') ? [imageStr] : imageStr.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
          }
        } else {
          parsedImages = (imageStr.startsWith('http') || imageStr.startsWith('/')) && !imageStr.includes(',') ? [imageStr] : imageStr.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
        }
      }
    }
    console.log(`[API GET /api/packages/${packageId}] Parsed images:`, parsedImages);

    // --- Transform itinerary --- 
    let parsedItineraryRaw: Record<string, any>;
    if (typeof pkg.itinerary === 'object' && pkg.itinerary !== null) {
        parsedItineraryRaw = pkg.itinerary; // Use directly if already an object
    } else if (typeof pkg.itinerary === 'string') {
        parsedItineraryRaw = safeJsonParseObject(pkg.itinerary, `pkg.itinerary for Package ID ${pkg.id}`, {});
    } else {
        parsedItineraryRaw = {}; // Default to empty object if null or undefined
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
        // If a 'days' array already exists, use it directly, ensuring structure.
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
        // If no 'days' array, try to construct it from dayN properties
        const dayEntries = Object.entries(parsedItineraryRaw)
            .filter(([key]) => key.startsWith('day') && !isNaN(parseInt(key.substring(3))))
            .sort(([keyA], [keyB]) => parseInt(keyA.substring(3)) - parseInt(keyB.substring(3))); // Sort by day number
        
        if (dayEntries.length > 0) {
            finalItineraryForClient.days = dayEntries.map(([key, value]) => {
                const dayNum = parseInt(key.substring(3));
                // Attempt to get more structured day data if value is an object
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
                    dayDesc = value; // Simple string value is the description
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
    
    // TODO: Fetch and parse categories similarly
    const categories: PackageCategory[] = []; // Placeholder

    const enrichedPkg: ApiPackageResponse = {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      base_price: pkg.base_price,
      max_people: pkg.max_people,
      created_by: pkg.created_by,
      is_active: pkg.is_active,
      itinerary_parsed: finalItineraryForClient,
      included_services_parsed: parsedIncludedServices,
      images_parsed: parsedImages,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
      categories: categories, 
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