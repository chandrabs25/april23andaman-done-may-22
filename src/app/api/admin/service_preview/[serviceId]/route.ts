// src/app/api/admin/service_preview/[serviceId]/route.ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../../../../lib/database"; // Adjusted path
import type {
  CategorizedService,
  TransportService,
  RentalService,
  ActivityService,
  SingleServiceResponse,
  ServiceProviderBasicInfo
} from "../../../../../types/transport_rental"; // Adjusted path

// Helper to parse comma-separated strings or JSON arrays into string arrays
function parseStringList(value: string | null): string[] {
  if (!value) return [];
  try {
    if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(s => s.length > 0);
      }
    }
  } catch (e) { /* Not valid JSON, continue */ }
  return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to safely parse potentially invalid JSON amenities
function parseAmenities(amenitiesStr: string | null): any {
  if (!amenitiesStr) return { general: [], specifics: {} };
  try {
    if ((amenitiesStr.trim().startsWith('{') && amenitiesStr.trim().endsWith('}')) ||
        (amenitiesStr.trim().startsWith('[') && amenitiesStr.trim().endsWith(']'))) {
      return JSON.parse(amenitiesStr);
    } else {
      return { general: parseStringList(amenitiesStr), specifics: {} };
    }
  } catch (e) {
    console.error("Failed to parse amenities:", e);
    return { general: parseStringList(amenitiesStr), specifics: {} };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  // This route is automatically protected by src/middleware.ts for admin access.
  try {
    const db = await getDatabase();
    const serviceId = parseInt(params.serviceId, 10);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { success: false, message: "Invalid service ID format.", data: null },
        { status: 400 }
      );
    }

    // Modified query: Removed 'AND s.is_active = TRUE' for admin preview
    const queryString = `
      SELECT
        s.id, s.name, s.description, s.type, s.provider_id, s.island_id,
        s.price, s.availability, s.images, s.amenities, s.cancellation_policy,
        s.is_active, s.is_admin_approved, -- Added s.is_admin_approved
        s.created_at, s.updated_at,
        i.name AS island_name,
        sp.business_name AS provider_business_name,
        sp.id AS service_provider_table_id,
        (SELECT AVG(r.rating) FROM reviews r WHERE r.service_id = s.id) AS avg_rating
      FROM services s
      LEFT JOIN islands i ON s.island_id = i.id  -- Changed to LEFT JOIN in case island_id is nullable or invalid temporarily
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      WHERE s.id = ?
      AND (s.type LIKE 'transport%' OR s.type LIKE 'rental%' OR s.type LIKE 'activity%')
    `;

    const stmt = db.prepare(queryString).bind(serviceId);
    const raw = await stmt.first<any>();

    if (!raw) {
      return NextResponse.json(
        { success: false, message: "Service not found for admin preview.", data: null },
        { status: 404 }
      );
    }

    const parsedAmenities = parseAmenities(raw.amenities);
    const specificFields = parsedAmenities.specifics || {};
    const activitySpecifics = specificFields; // Assuming activity specifics might be directly under specifics

    const locationDetails = specificFields.location_details || null;
    const whatToBring = specificFields.what_to_bring || [];
    const includedServices = specificFields.included_services || [];
    const notIncludedServices = specificFields.not_included_services || [];
    const latitude = specificFields.latitude ? parseFloat(specificFields.latitude) : null;
    const longitude = specificFields.longitude ? parseFloat(specificFields.longitude) : null;

    const vehicleType = specificFields.vehicle_type || null;
    const capacityPassengers = specificFields.capacity_passengers ? parseInt(specificFields.capacity_passengers) : (specificFields.capacity ? parseInt(specificFields.capacity) : null);
    const routeDetails = specificFields.route_details || specificFields.route || null;
    const pricePerKm = specificFields.price_per_km ? parseFloat(specificFields.price_per_km) : null;
    const pricePerTrip = specificFields.price_per_trip ? parseFloat(specificFields.price_per_trip) : null;
    const driverIncluded = specificFields.driver_included === true;

    const itemType = specificFields.item_type || null;
    const rentalDurationOptions = specificFields.rental_duration_options || [];
    const pricePerHour = specificFields.price_per_hour ? parseFloat(specificFields.price_per_hour) : null;
    const pricePerDay = specificFields.price_per_day ? parseFloat(specificFields.price_per_day) : null;
    const depositAmount = specificFields.deposit?.amount ? parseFloat(specificFields.deposit.amount) : null;
    const pickupLocationOptions = specificFields.pickup_location_options || specificFields.pickup_locations || [];
    const rentalTerms = specificFields.rental_terms || specificFields.requirements?.details || null;

    const providerInfo: ServiceProviderBasicInfo | undefined = raw.provider_business_name ? {
        id: raw.service_provider_table_id,
        business_name: raw.provider_business_name,
      } : undefined;

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
        price_details: raw.price,
        price_numeric: raw.price_numeric ? parseFloat(raw.price_numeric) : (parseFloat(raw.price) || null),
        availability_summary: raw.availability,
        rating: raw.avg_rating ? parseFloat(raw.avg_rating.toFixed(1)) : null, // Ensure rating is fixed to 1 decimal place
        is_active: Boolean(raw.is_active),
        is_admin_approved: raw.is_admin_approved, // Include this field
        cancellation_policy: raw.cancellation_policy,
        amenities: parsedAmenities.general || [],
        duration: activitySpecifics.duration?.value ? parseInt(activitySpecifics.duration.value) : null,
        duration_unit: activitySpecifics.duration?.unit || null,
        location_details: locationDetails,
        what_to_bring: Array.isArray(whatToBring) ? whatToBring : parseStringList(whatToBring as any),
        included_services: Array.isArray(includedServices) ? includedServices : parseStringList(includedServices as any),
        not_included_services: Array.isArray(notIncludedServices) ? notIncludedServices : parseStringList(notIncludedServices as any),
        latitude: latitude,
        longitude: longitude,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
    };

    let serviceData: CategorizedService | null = null;

    if (raw.type && raw.type.startsWith("transport")) {
      serviceData = {
          ...baseData,
          service_category: "transport",
          vehicle_type: vehicleType,
          capacity_passengers: capacityPassengers,
          route_details: routeDetails,
          price_per_km: pricePerKm,
          price_per_trip: pricePerTrip,
          driver_included: driverIncluded,
      } as TransportService;
    } else if (raw.type && raw.type.startsWith("rental")) {
      serviceData = {
          ...baseData,
          service_category: "rental",
          item_type: itemType,
          rental_duration_options: Array.isArray(rentalDurationOptions) ? rentalDurationOptions : (specificFields.unit ? [`${specificFields.unit}`] : []),
          price_per_hour: specificFields.unit === 'per hour' && raw.price ? parseFloat(raw.price) : pricePerHour,
          price_per_day: specificFields.unit === 'per day' && raw.price ? parseFloat(raw.price) : pricePerDay,
          deposit_amount: depositAmount,
          pickup_location_options: Array.isArray(pickupLocationOptions) ? pickupLocationOptions : [],
          rental_terms: rentalTerms,
      } as RentalService;
    } else if (raw.type && raw.type.startsWith("activity")) {
      serviceData = {
        ...baseData,
        service_category: "activity",
        // duration and duration_unit are already in baseData
        group_size_min: activitySpecifics.group_size?.min ? parseInt(activitySpecifics.group_size.min) : null,
        group_size_max: activitySpecifics.group_size?.max ? parseInt(activitySpecifics.group_size.max) : null,
        difficulty_level: activitySpecifics.difficulty || null,
        equipment_provided: activitySpecifics.equipment_provided || activitySpecifics.equipment || [],
        safety_requirements: activitySpecifics.safety_requirements || activitySpecifics.safety || null,
        guide_required: activitySpecifics.guide_required !== undefined ? activitySpecifics.guide_required : (activitySpecifics.guide === true),
      } as ActivityService;
    }

    if (!serviceData) {
        return NextResponse.json(
            { success: false, message: "Service type is not recognized for admin preview.", data: null },
            { status: 400 }
        );
    }
    // Ensure is_admin_approved is part of the response data
    serviceData.is_admin_approved = raw.is_admin_approved;


    const response: SingleServiceResponse = { success: true, data: serviceData };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error(`Error fetching service for admin preview (ID: ${params.serviceId}):`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const errorResponse: SingleServiceResponse = {
        success: false,
        message: `Failed to fetch service for admin preview: ${errorMessage}`,
        data: null,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
