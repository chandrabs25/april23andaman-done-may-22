import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '../../../../../cloudflare-env'; // Adjust path as needed

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
    const dbService = new DatabaseService();

    // Fetch the service provider profile first
    const profile = await dbService.getServiceProviderByUserId(userId);

    // If the specific service provider profile doesn't exist for this user ID
    if (!profile) {
      // Check if the base user exists just for logging/debugging, but return profile not found
      const userExists = await dbService.getUserById(userId);
      if (userExists) {
          console.warn(`User ${userId} exists, but no corresponding service_provider entry found.`);
      } else {
          console.warn(`Neither user nor service_provider found for ID ${userId}.`);
          // You could return 404 here if the user *must* exist
          // return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      // Return success: true but data: null, as expected by the dashboard check
      return NextResponse.json({ success: true, data: null }, { status: 200 });
    }

    // Profile exists, now fetch user details to potentially supplement
    const user = await dbService.getUserById(userId);

    // Combine data - prioritize profile data, supplement with user data if needed
    // Ensure required fields expected by the frontend are present
    const responseData = {
        ...profile,
        // Add user email/phone if they aren't already columns in service_providers
        // and if the user record was found
        email: profile.email || user?.email, // Adjust if 'email' is actually in service_providers
        phone: profile.phone || user?.phone, // Adjust if 'phone' is actually in service_providers
        // Ensure all fields expected by VendorProfile interface are included
        // Add default/null values for any potentially missing optional fields if necessary
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: `Failed to fetch profile: ${errorMessage}` }, { status: 500 });
  }
}
