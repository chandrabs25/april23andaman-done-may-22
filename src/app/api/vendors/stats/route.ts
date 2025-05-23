import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '../../../../../cloudflare-env'; // Adjust path

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get('userId');

  if (!userIdParam) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'Invalid User ID format' }, { status: 400 });
  }

  try {
    // const context = getCloudflareContext<CloudflareEnv>(); // Optional, see profile route comment
    const dbService = new DatabaseService();
    const stats = await dbService.getVendorStats(userId);

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
     if (errorMessage.includes('Vendor not found')) {
        return NextResponse.json({ success: false, message: errorMessage }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: `Failed to fetch stats: ${errorMessage}` }, { status: 500 });
  }
}
