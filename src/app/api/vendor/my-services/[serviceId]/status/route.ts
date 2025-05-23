import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { verifyAuth, requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    serviceId: string;
  };
}

// Helper function to check ownership and verification status (adapted from parent route)
async function checkServiceOwnershipAndVerification(db: DatabaseService, userId: number | string, serviceId: number): Promise<{ isOwner: boolean; isVerified: boolean; serviceProviderId: number | null }> {
    const serviceProvider = await db.getServiceProviderByUserId(Number(userId));
    if (!serviceProvider || !serviceProvider.id) {
        return { isOwner: false, isVerified: false, serviceProviderId: null };
    }

    const isVerified = serviceProvider.verified === 1;
    const serviceProviderId = serviceProvider.id;

    const service = await db.getServiceById(serviceId);
    const isOwner = service !== null && service?.provider_id === serviceProvider.id;

    return { isOwner, isVerified, serviceProviderId };
}

// PUT: Update the active status of a specific service
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: 'User not found after auth check' }, { status: 401 });
  }

  const serviceId = parseInt(params.serviceId, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ success: false, message: 'Invalid Service ID' }, { status: 400 });
  }

  try {
    const db = new DatabaseService();

    // Verify ownership and verification status
    const { isOwner, isVerified } = await checkServiceOwnershipAndVerification(db, user.id, serviceId);

    if (!isOwner) {
        // Use 404 as the user doesn't own it, hiding its existence
        return NextResponse.json({ success: false, message: 'Service not found or permission denied.' }, { status: 404 });
    }

    // Add verification check for PUT operation
    if (!isVerified) {
        return NextResponse.json({ success: false, message: 'Vendor account not verified. Cannot update service status.' }, { status: 403 });
    }

    // Define expected body structure
    interface StatusUpdateBody {
      isActive: boolean;
    }

    const body: StatusUpdateBody = await request.json();

    // Validate body content
    if (typeof body.isActive !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid request body: isActive must be a boolean.' }, { status: 400 });
    }

    // Call the database service method to update the status
    const result = await db.updateServiceStatus(serviceId, body.isActive);

    if (!result.success) {
        // Check if the update affected any rows
        if (result.meta?.changes === 0) {
             // If owner check passed but update affected 0 rows, it means service was not found (shouldn't happen) or status was already set
             return NextResponse.json({ success: false, message: 'Service not found or status already up-to-date.' }, { status: 404 });
        }
        // Throw error for other database issues
        throw new Error(result.error || 'Failed to update service status in database');
    }

    // Fetch the updated service to confirm the change (optional but good practice)
    const updatedService = await db.getServiceById(serviceId);

    return NextResponse.json({ success: true, message: 'Service status updated successfully', data: updatedService });

  } catch (error) {
    console.error(`Error updating status for service ${serviceId}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    // Handle specific errors if needed, otherwise return 500
    return NextResponse.json({ success: false, message: 'Failed to update service status.', error: message }, { status: 500 });
  }
}

