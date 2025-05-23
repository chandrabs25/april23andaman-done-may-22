// src/app/api/services-main/route.ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import type {
  CategorizedService,
  TransportService,
  RentalService,
  ActivityService,
  PaginatedServicesResponse,
  ServiceProviderBasicInfo
} from "@/types/transport_rental";

// Helper to parse comma-separated strings or JSON arrays into string arrays
function parseStringList(value: string | null): string[] {
  if (!value) return [];
  
  // Try to parse as JSON first
  try {
    // Check if the string starts with [ and ends with ] which suggests it's a JSON array
    if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(s => s.length > 0);
      }
    }
  } catch (e) {
    // Not valid JSON, continue to comma-separated logic
  }
  
  // Handle comma-separated string
  return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to safely parse potentially invalid JSON amenities
function parseAmenities(amenitiesStr: string | null): any {
  if (!amenitiesStr) return { general: [], specifics: {} };
  
  try {
    // Check if it looks like JSON (starts with { or [)
    if ((amenitiesStr.trim().startsWith('{') && amenitiesStr.trim().endsWith('}')) || 
        (amenitiesStr.trim().startsWith('[') && amenitiesStr.trim().endsWith(']'))) {
      return JSON.parse(amenitiesStr);
    } else {
      // If it's not JSON, treat it as comma-separated list for general amenities
      const amenitiesList = parseStringList(amenitiesStr);
      return { 
        general: amenitiesList,
        specifics: {} 
      };
    }
  } catch (e) {
    console.error("Failed to parse amenities:", e);
    // If it's not valid JSON, create a default structure with the raw string in general
    const amenitiesList = parseStringList(amenitiesStr);
    return { 
      general: amenitiesList,
      specifics: {} 
    };
  }
}

export async function GET(request: NextRequest) {
  console.log('🔍 [API] GET /api/services-main: Request received');
  try {
    const db = await getDatabase();
    console.log('🔍 [API] GET /api/services-main: Database connection successful');
    
    const { searchParams } = new URL(request.url);
    console.log('🔍 [API] GET /api/services-main: Request URL:', request.url);

    // Filtering parameters
    const islandIdParam = searchParams.get("islandId");
    const islandId = islandIdParam ? parseInt(islandIdParam, 10) : null;
    const searchTerm = searchParams.get("search") || null;
    // Specific type filter for this endpoint, e.g., "transport" or "rental" or comma-separated for both
    const serviceCategory = searchParams.get("category"); // e.g., "transport", "rental"
    
    console.log(`🔍 [API] GET /api/services-main: Filters - islandId: ${islandId}, search: ${searchTerm}, category: ${serviceCategory}`);

    // First check if the services table exists and has records
    try {
      console.log('🔍 [API] GET /api/services-main: Testing database by checking services table...');
      const tableCheck = await db.prepare(`SELECT COUNT(*) as count FROM services`).first();
      console.log('🔍 [API] GET /api/services-main: Services table check result:', tableCheck);
    } catch (tableError) {
      console.error('❌ [API] GET /api/services-main: Error checking services table:', tableError);
      // Continue with the main query even if this check fails
    }

    let queryString = `
      SELECT
        s.id, s.name, s.description, s.type, s.provider_id, s.island_id,
        s.price, s.availability, s.images, s.amenities, s.cancellation_policy,
        s.is_active, s.created_at, s.updated_at,
        i.name AS island_name,
        sp.business_name AS provider_business_name,
        sp.id AS service_provider_table_id,
        (SELECT AVG(r.rating) FROM reviews r WHERE r.service_id = s.id) AS avg_rating
      FROM services s
      JOIN islands i ON s.island_id = i.id
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      WHERE s.is_active = TRUE
    `;

    const queryParams: (string | number)[] = [];

    if (serviceCategory) {
      const categories = serviceCategory.split(",").map(cat => cat.trim());
      if (categories.length > 0) {
        const typeConditions = categories.map(cat => `s.type LIKE ?`).join(" OR ");
        queryString += ` AND (${typeConditions})`;
        categories.forEach(cat => queryParams.push(`${cat}%`)); // e.g., "transport%", "rental%"
      }
    } else {
      // Default to fetching both transport and rental if no specific category is given
      queryString += " AND (s.type LIKE ? OR s.type LIKE ?)";
      queryParams.push("transport%", "rental%");
    }

    if (islandId !== null && !isNaN(islandId)) {
      queryString += " AND s.island_id = ?";
      queryParams.push(islandId);
    }

    if (searchTerm) {
      queryString += " AND (s.name LIKE ? OR s.description LIKE ?)";
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    
    // Add other filters as needed: minPrice, maxPrice, minRating, specific vehicle_type, item_type etc.

    queryString += " ORDER BY s.type, avg_rating DESC, s.name ASC";

    console.log('🔍 [API] GET /api/services-main: Query String:', queryString);
    console.log('🔍 [API] GET /api/services-main: Query Params:', queryParams);

    const stmt = db.prepare(queryString).bind(...queryParams);
    console.log('🔍 [API] GET /api/services-main: Executing query...');
    
    const { results, success, error } = await stmt.all<any>();
    
    console.log('🔍 [API] GET /api/services-main: Query success:', success);
    if (error) {
      console.error('❌ [API] GET /api/services-main: Query error:', error);
    }
    
    console.log(`🔍 [API] GET /api/services-main: Raw results count: ${results?.length || 0}`);
    // Log the first few results for debugging
    if (results && results.length > 0) {
      const sampleResults = results.slice(0, Math.min(3, results.length));
      console.log('🔍 [API] GET /api/services-main: Sample raw results:', 
        sampleResults.map((r: any) => ({ id: r.id, name: r.name, type: r.type }))
      );
    }

    if (!success) {
      console.error("Failed to fetch services from D1:", error);
      throw new Error(error || "Database query failed");
    }

    // Map to typed services
    console.log('🔍 [API] GET /api/services-main: Starting to map raw results to typed services...');
    const servicesData: CategorizedService[] = (results || []).map((raw: any) => {
      // Parse amenities JSON if it exists
      const parsedAmenities = parseAmenities(raw.amenities);

      // Extract specific fields from amenities.specifics
      const specificFields = parsedAmenities.specifics || {};
      
      const providerInfo: ServiceProviderBasicInfo | undefined = raw.provider_business_name ? {
        id: raw.service_provider_table_id,
        business_name: raw.provider_business_name,
      } : undefined;

      // Extract location and other details from amenities JSON
      const locationDetails = specificFields.location_details || null;
      const whatToBring = specificFields.what_to_bring || [];
      const includedServices = specificFields.included_services || [];
      const notIncludedServices = specificFields.not_included_services || [];
      const latitude = specificFields.latitude ? parseFloat(specificFields.latitude) : null;
      const longitude = specificFields.longitude ? parseFloat(specificFields.longitude) : null;

      const baseData = {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        type: raw.type,
        provider_id: raw.provider_id,
        provider: providerInfo,
        island_id: raw.island_id,
        island_name: raw.island_name,
        images: parseStringList(raw.images),
        price_details: raw.price, // Assuming 'price' column stores general price string
        price_numeric: raw.price_numeric ? parseFloat(raw.price_numeric) : (parseFloat(raw.price) || null), // Heuristic for numeric price
        availability_summary: raw.availability,
        rating: raw.avg_rating ? parseFloat(raw.avg_rating) : null,
        is_active: Boolean(raw.is_active),
        cancellation_policy: raw.cancellation_policy,
        amenities: parsedAmenities.general || [],
        // Additional fields from amenities JSON
        location_details: locationDetails,
        what_to_bring: Array.isArray(whatToBring) ? whatToBring : parseStringList(whatToBring),
        included_services: Array.isArray(includedServices) ? includedServices : parseStringList(includedServices),
        not_included_services: Array.isArray(notIncludedServices) ? notIncludedServices : parseStringList(notIncludedServices),
        latitude: latitude,
        longitude: longitude,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      };

      if (raw.type && raw.type.startsWith("transport")) {
        console.log(`🔍 [API] GET /api/services-main: Processing transport service: ${raw.id} - ${raw.name}`);
        return {
          ...baseData,
          service_category: "transport",
          vehicle_type: specificFields.vehicle_type || null,
          capacity_passengers: specificFields.capacity ? parseInt(specificFields.capacity) : null,
          route_details: specificFields.route || null,
          price_per_km: specificFields.price_per_km ? parseFloat(specificFields.price_per_km) : null,
          price_per_trip: specificFields.price_per_trip ? parseFloat(specificFields.price_per_trip) : null,
          driver_included: specificFields.driver_included === true,
        } as TransportService;
      } else if (raw.type && raw.type.startsWith("rental")) {
        console.log(`🔍 [API] GET /api/services-main: Processing rental service: ${raw.id} - ${raw.name}`);
        // Extract rental-specific data from specifics
        const rentalSpecifics = specificFields;
        return {
          ...baseData,
          service_category: "rental",
          item_type: rentalSpecifics.item_type || null,
          rental_duration_options: (rentalSpecifics.unit ? [`${rentalSpecifics.unit}`] : []),
          price_per_hour: rentalSpecifics.unit === 'per hour' ? parseFloat(raw.price) : null,
          price_per_day: rentalSpecifics.unit === 'per day' ? parseFloat(raw.price) : null,
          deposit_amount: (rentalSpecifics.deposit?.amount ? parseFloat(rentalSpecifics.deposit.amount) : null),
          pickup_location_options: [],
          rental_terms: rentalSpecifics.requirements?.details || null,
        } as RentalService;
      } else if (raw.type && raw.type.startsWith("activity")) {
        console.log(`🔍 [API] GET /api/services-main: Processing activity service: ${raw.id} - ${raw.name}`);
        // Extract activity-specific data from specifics
        const activitySpecifics = specificFields;
        return {
          ...baseData,
          service_category: "activity",
          duration: activitySpecifics.duration?.value ? parseInt(activitySpecifics.duration.value) : null,
          duration_unit: activitySpecifics.duration?.unit || null,
          group_size_min: activitySpecifics.group_size?.min ? parseInt(activitySpecifics.group_size.min) : null,
          group_size_max: activitySpecifics.group_size?.max ? parseInt(activitySpecifics.group_size.max) : null,
          difficulty_level: activitySpecifics.difficulty || null,
          equipment_provided: activitySpecifics.equipment || [],
          safety_requirements: activitySpecifics.safety || null,
          guide_required: activitySpecifics.guide || false,
        } as ActivityService;
      } else {
        console.log(`🔍 [API] GET /api/services-main: Ignoring service with unknown type: ${raw.id} - ${raw.name} (${raw.type})`);
        return null; // Fallback for unknown types - moved inside the else block
      }
    }).filter((service: CategorizedService | null) => service !== null) as CategorizedService[]; // Filter out nulls
    
    console.log(`🔍 [API] GET /api/services-main: Processed ${servicesData.length} services`);
    // Count services by category
    const transportCount = servicesData.filter(s => s.service_category === 'transport').length;
    const rentalCount = servicesData.filter(s => s.service_category === 'rental').length;
    const activityCount = servicesData.filter(s => s.service_category === 'activity').length;
    console.log(`🔍 [API] GET /api/services-main: Services by category - Transport: ${transportCount}, Rental: ${rentalCount}, Activity: ${activityCount}`);
    
    const response: PaginatedServicesResponse = {
        success: true,
        message: "Services retrieved successfully",
        data: servicesData,
    };

    console.log('🔍 [API] GET /api/services-main: Returning success response with data');
    return NextResponse.json(response);
  } catch (err) {
    console.error("❌ [API] GET /api/services-main: Error fetching main services:", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    const errorResponse: PaginatedServicesResponse = {
        success: false,
        message: `Failed to retrieve services: ${errorMessage}`,
        data: [],
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

