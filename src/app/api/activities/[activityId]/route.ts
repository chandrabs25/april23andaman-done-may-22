// src/app/api/activities/[activityId]/route.ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import type { Activity, ActivityProviderDetails } from "@/types/activity";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { activityId: string } }
) {
  try {
    const db = await getDatabase();
    const activityId = parseInt(params.activityId, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { success: false, message: "Invalid activity ID format.", data: null },
        { status: 400 }
      );
    }

    const queryString = `
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
      WHERE s.id = ? AND s.type LIKE ? AND s.is_active = TRUE
    `;

    const stmt = db.prepare(queryString).bind(activityId, "%activity%");
    const rawActivity = await stmt.first<any>();

    if (!rawActivity) {
      return NextResponse.json(
        { success: false, message: "Activity not found or not active.", data: null },
        { status: 404 }
      );
    }

    // Parse amenities to extract specific fields like duration
    const parsedAmenities = parseAmenities(rawActivity.amenities);

    // Extract specific fields from amenities.specifics
    const specificFields = parsedAmenities.specifics || {};
    const activitySpecifics = specificFields;

    // Format duration as a string (e.g., "2 hours" or "4 days")
    let durationStr: string | null = null;
    if (activitySpecifics.duration?.value && activitySpecifics.duration?.unit) {
      durationStr = `${activitySpecifics.duration.value} ${activitySpecifics.duration.unit}`;
    }

    // Extract location and other details from amenities JSON
    const locationDetails = specificFields.location_details || null;
    const whatToBring = specificFields.what_to_bring || [];
    const includedServices = specificFields.included_services || [];
    const notIncludedServices = specificFields.not_included_services || [];
    const latitude = specificFields.latitude ? parseFloat(specificFields.latitude) : null;
    const longitude = specificFields.longitude ? parseFloat(specificFields.longitude) : null;

    const activityData: Activity = {
      id: rawActivity.id,
      name: rawActivity.name,
      description: rawActivity.description,
      type: rawActivity.type,
      provider_id: rawActivity.provider_id,
      provider: rawActivity.provider_business_name ? {
        id: rawActivity.service_provider_table_id,
        business_name: rawActivity.provider_business_name,
      } : undefined,
      island_id: rawActivity.island_id,
      island_name: rawActivity.island_name,
      price: parseFloat(rawActivity.price) || 0,
      availability: rawActivity.availability,
      images: parseStringList(rawActivity.images),
      amenities: parsedAmenities.general || [],
      cancellation_policy: rawActivity.cancellation_policy,
      duration: durationStr,
      rating: rawActivity.avg_rating ? parseFloat(rawActivity.avg_rating) : null,
      is_active: Boolean(rawActivity.is_active),
      location_details: locationDetails,
      what_to_bring: Array.isArray(whatToBring) ? whatToBring : parseStringList(whatToBring),
      included_services: Array.isArray(includedServices) ? includedServices : parseStringList(includedServices),
      not_included_services: Array.isArray(notIncludedServices) ? notIncludedServices : parseStringList(notIncludedServices),
      latitude: latitude,
      longitude: longitude,
      created_at: rawActivity.created_at,
      updated_at: rawActivity.updated_at,
    };

    return NextResponse.json({ success: true, data: activityData }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching activity with ID ${params.activityId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: `Failed to fetch activity: ${errorMessage}`, data: null },
      { status: 500 }
    );
  }
}

