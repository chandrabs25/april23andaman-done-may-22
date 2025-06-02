// Path: src/app/api/activities/route.ts

export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

interface Activity {
  id: number
  name: string
  description: string | null
  type: string
  provider_id: number
  island_id: number
  price: string
  availability: string | null
  images: string | null
  amenities: string | null
  cancellation_policy: string | null
  island_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function GET(request: Request) {
  console.log('🔍 [API] GET /api/activities: Request received');
  try {
    console.log('🔍 [API] GET /api/activities: Attempting database connection...');

    // First check if database connection works
    let db;
    try {
      db = await getDatabase();
      console.log('🔍 [API] GET /api/activities: Database connection successful');
    } catch (dbError) {
      console.error('❌ [API] GET /api/activities: Database connection failed:', dbError);
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }

    // await the D1Database instance

    const { searchParams } = new URL(request.url);
    console.log('🔍 [API] GET /api/activities: Request URL:', request.url);

    const islandIdParam = searchParams.get('islandId')
    const islandId = islandIdParam ? parseInt(islandIdParam, 10) : null

    const providerIdParam = searchParams.get('providerId')
    const providerId = providerIdParam ? parseInt(providerIdParam, 10) : null

    console.log(`🔍 [API] GET /api/activities: Filters - islandId: ${islandId}, providerId: ${providerId}`);

    // First check if the services table exists and has records
    try {
      console.log('🔍 [API] GET /api/activities: Testing database by checking services table...');
      const tableCheck = await db.prepare(`SELECT COUNT(*) as count FROM services`).first();
      console.log('🔍 [API] GET /api/activities: Services table check result:', tableCheck);
    } catch (tableError) {
      console.error('❌ [API] GET /api/activities: Error checking services table:', tableError);
      // Continue with the main query even if this check fails
    }

    let queryString = `
      SELECT
        s.id, s.name, s.description, s.type, s.provider_id, s.island_id,
        s.price, s.availability, s.images, s.amenities, s.cancellation_policy,
        i.name AS island_name
      FROM services s
      JOIN islands i ON s.island_id = i.id
      WHERE s.type LIKE ? AND s.is_active = TRUE AND s.is_admin_approved = 1` // Added s.is_admin_approved = 1

    const queryParams: (string | number)[] = ['%activity%']

    if (islandId !== null && !isNaN(islandId)) {
      queryString += ' AND s.island_id = ?'
      queryParams.push(islandId)
    }

    if (providerId !== null && !isNaN(providerId)) {
      queryString += ' AND s.provider_id = ?'
      queryParams.push(providerId)
    }

    queryString += ' ORDER BY s.name ASC'

    console.log('🔍 [API] GET /api/activities: Query String:', queryString);
    console.log('🔍 [API] GET /api/activities: Query Params:', queryParams);

    const stmt = db.prepare(queryString).bind(...queryParams)
    console.log('🔍 [API] GET /api/activities: Executing query...');

    let queryResult;
    try {
      queryResult = await stmt.all<Activity>();
      console.log('🔍 [API] GET /api/activities: Query execution complete');
    } catch (queryError) {
      console.error('❌ [API] GET /api/activities: Query execution failed:', queryError);
      throw new Error(`Query execution failed: ${queryError instanceof Error ? queryError.message : String(queryError)}`);
    }

    const { results, success, error } = queryResult;

    console.log('🔍 [API] GET /api/activities: Query complete, success:', success);

    if (!success) {
      console.error('❌ [API] GET /api/activities: Failed to fetch activities from D1:', error)
      throw new Error(error || 'Database query failed')
    }

    const activitiesData = results ?? []
    console.log(`🔍 [API] GET /api/activities: Found ${activitiesData.length} activities`);

    // Log each activity for debugging (limit to first 5 for brevity)
    const logLimit = Math.min(activitiesData.length, 5);
    for (let i = 0; i < logLimit; i++) {
      console.log(`🔍 [API] Activity ${i+1}/${logLimit}:`, {
        id: activitiesData[i].id,
        name: activitiesData[i].name,
        island: activitiesData[i].island_name,
        price: activitiesData[i].price,
        type: activitiesData[i].type
      });
    }

    if (activitiesData.length === 0) {
      console.warn('⚠️ [API] GET /api/activities: No activities found matching the criteria');

      // Try a broader query to see if any services exist at all
      try {
        console.log('🔍 [API] GET /api/activities: Trying broader query to check if any services exist...');
        const checkServices = await db.prepare(`SELECT COUNT(*) as count FROM services`).first();
        console.log('🔍 [API] GET /api/activities: Services count:', checkServices);

        if (checkServices && checkServices.count > 0) {
          console.log('🔍 [API] GET /api/activities: Services exist but no activities match the query criteria');
        } else {
          console.warn('⚠️ [API] GET /api/activities: No services found in the database');
        }
      } catch (checkError) {
        console.error('❌ [API] GET /api/activities: Error checking services table:', checkError);
      }
    }

    console.log('🔍 [API] GET /api/activities: Returning success response');
    return NextResponse.json({
      success: true,
      message: 'Activities retrieved successfully',
      data: activitiesData,
    })
  } catch (err) {
    console.error('❌ [API] GET /api/activities: Error fetching activities:', err)
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve activities', error: errorMessage, data: [] },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {

  console.warn("POST /api/activities is not fully implemented.");
   try {

       return NextResponse.json({
           success: false, // Set to false as it's not implemented
           message: 'POST method for activities not implemented yet.',
           data: null
       }, { status: 501 }); // 501 Not Implemented

   } catch (error) {
       console.error("Error in POST /api/activities:", error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
       return NextResponse.json({ success: false, message: "Failed to process request", error: errorMessage }, { status: 500 });
   }
}
