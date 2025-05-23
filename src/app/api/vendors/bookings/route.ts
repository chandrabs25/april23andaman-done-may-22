import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '../../../../../cloudflare-env'; // Adjust path



export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get('vendorUserId'); // Match param name from frontend
  const limitParam = searchParams.get('limit');

  if (!userIdParam) {
    return NextResponse.json({ success: false, message: 'Vendor User ID is required' }, { status: 400 });
  }

  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'Invalid Vendor User ID format' }, { status: 400 });
  }

  const limit = limitParam ? parseInt(limitParam, 10) : 5; // Default limit if needed
   if (isNaN(limit)) {
        return NextResponse.json({ success: false, message: 'Invalid limit format' }, { status: 400 });
   }

  try {
    // const context = getCloudflareContext<CloudflareEnv>(); // Optional
    const dbService = new DatabaseService();
    const bookingsResult = await dbService.getBookingsForVendor(userId, limit); // Pass limit

    return NextResponse.json({ success: true, data: bookingsResult.results || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching vendor bookings:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: `Failed to fetch bookings: ${errorMessage}` }, { status: 500 });
  }
}
