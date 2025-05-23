import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '../../../../../cloudflare-env'; // Adjust path



export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get('providerUserId'); // Match param name from frontend
  const limitParam = searchParams.get('limit');

  if (!userIdParam) {
    return NextResponse.json({ success: false, message: 'Provider User ID is required' }, { status: 400 });
  }

  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'Invalid Provider User ID format' }, { status: 400 });
  }

  const limit = limitParam ? parseInt(limitParam, 10) : undefined; // Default to no limit if not specified or invalid
   if (limit !== undefined && isNaN(limit)) {
        return NextResponse.json({ success: false, message: 'Invalid limit format' }, { status: 400 });
   }


  try {
    // const context = getCloudflareContext<CloudflareEnv>(); // Optional
    const dbService = new DatabaseService();

    // 1. Get Provider ID from User ID
    const provider = await dbService.getServiceProviderByUserId(userId);
    if (!provider) {
      // If the user is valid but not registered as a provider yet
      return NextResponse.json({ success: true, data: [] }, { status: 200 }); // Return empty array
      // Or return 404 if user *must* be a provider:
      // return NextResponse.json({ success: false, message: 'Service provider profile not found for this user' }, { status: 404 });
    }
    const providerId = provider.id;

    // 2. Get Services by Provider ID
    // Modify getServicesByProvider if it doesn't support limit, or apply limit here
    const servicesResult = await dbService.getServicesByProvider(providerId); // Assuming this returns D1Result

    let services = servicesResult.results || [];

    // Apply limit if specified and the DB method didn't handle it
    if (limit !== undefined && services.length > limit) {
        services = services.slice(0, limit);
    }

    return NextResponse.json({ success: true, data: services }, { status: 200 });
  } catch (error) {
    console.error('Error fetching vendor services:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: `Failed to fetch services: ${errorMessage}` }, { status: 500 });
  }
}
