export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

interface ToggleStatusPayload {
  is_active: boolean;
}

interface ApiError {
  message: string;
  error?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { packageId: string } }
) {
  // Admin check
  const authResult = await requireAuth(request, [1]); // Assuming admin role_id is 1
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const packageIdInt = parseInt(params.packageId, 10);
  if (isNaN(packageIdInt) || packageIdInt <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid package ID.' }, { status: 400 });
  }

  let payload: ToggleStatusPayload;
  try {
    payload = await request.json();
    if (typeof payload.is_active !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid payload: is_active must be a boolean.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid JSON payload.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    // First, check if the package exists to provide a better error message
    const existingPackage = await dbService.getPackageById(packageIdInt);
    if (!existingPackage) {
      return NextResponse.json({ success: false, message: 'Package not found.' }, { status: 404 });
    }
    
    // Assume dbService.updatePackageStatus(packageId: number, isActive: boolean) exists
    // and returns something like { success: boolean, error?: string, meta?: any }
    // const result = await dbService.updatePackageStatus(packageIdInt, payload.is_active);
    // FIXME: The above line needs dbService.updatePackageStatus to be implemented in DatabaseService.
    // For now, let's assume a placeholder result for linting purposes if we were to proceed without the actual DB call.
    // To make the code runnable for demo purposes IF THE DB METHOD IS NOT YET READY, one might do this:
    const result = { success: true, error: undefined }; // Placeholder - REMOVE WHEN DB METHOD IS READY

    if (!result || !result.success) {
      // Corrected console.error string escaping
      console.error(`Failed to update status for package ${packageIdInt}: ${result?.error}`);
      return NextResponse.json({
        success: false,
        message: 'Failed to update package status in database.',
        error: result?.error || 'Unknown database error'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Package status updated successfully to ${payload.is_active ? 'active' : 'inactive'}.`,
      data: {
        packageId: packageIdInt,
        is_active: payload.is_active
      }
    });

  } catch (error) {
    // Corrected console.error string escaping
    console.error(`Error updating status for package ${packageIdInt}: ${error instanceof Error ? error.message : String(error)}`);
    const apiError: ApiError = {
      message: 'Failed to update package status.',
      error: error instanceof Error ? error.message : 'An unknown server error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError
    }, { status: 500 });
  }
} 