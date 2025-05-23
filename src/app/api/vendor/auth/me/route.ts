// Path: src/app/api/vendor/auth/me/route.ts
export const dynamic = 'force-dynamic'; // Ensure dynamic execution for reading cookies/env vars

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// Define User type expected by useVendorAuth hook
interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  role_id?: number;
  providerId?: number; // Vendor-specific field
  businessName?: string; // Vendor-specific field
}

// Vendor role ID constant
const VENDOR_ROLE_ID = 3; // Must match the same constant in login route

export async function GET(request: NextRequest) {
  console.log("--- GET /api/vendor/auth/me Request Received ---");
  try {
    // Use the same verifyAuth function as the regular /api/auth/me endpoint
    const { isAuthenticated, user } = await verifyAuth(request);

    if (!isAuthenticated || !user) {
      console.log("/api/vendor/auth/me: Not authenticated or user data missing.");
      return NextResponse.json(
        { success: false, message: 'Not authenticated.', data: null },
        { status: 401 } // Unauthorized
      );
    }

    // Additional check: Verify the user has the vendor role
    if (user.role_id !== VENDOR_ROLE_ID) {
      console.log(`/api/vendor/auth/me: User ${user.email} is not a vendor (role_id: ${user.role_id})`);
      return NextResponse.json(
        { success: false, message: 'Access denied. Not a vendor account.', data: null },
        { status: 403 } // Forbidden
      );
    }

    console.log("/api/vendor/auth/me: Vendor authenticated. User data:", user);

    // Get additional vendor-specific data if needed
    // For example, you might want to fetch the service provider details
    // const databaseService = new DatabaseService();
    // const serviceProvider = await databaseService.getServiceProviderByUserId(user.id);

    // Construct the user data object expected by the frontend (useVendorAuth hook)
    const userData: User = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      // Include provider-specific fields if available
      // providerId: serviceProvider?.id,
      // businessName: serviceProvider?.business_name,
    };

    return NextResponse.json({
      success: true,
      message: 'Vendor authenticated.',
      data: userData
    });

  } catch (error) {
    console.error('Error in /api/vendor/auth/me:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.', error: error instanceof Error ? error.message : 'Unknown error', data: null },
      { status: 500 }
    );
  }
}
