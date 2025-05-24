// src/app/api/admin/packages/[packageId]/route.ts
export const dynamic = 'force-dynamic' // Ensure dynamic processing

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth } from '@/lib/auth'; // Custom auth helper

interface ApiError {
  message: string;
  error?: string;
}

// --- DELETE handler: Delete a specific package ---
export async function DELETE(
  request: NextRequest, // NextRequest is typically used, not generic Request
  { params }: { params: { packageId: string } }
) {
  // 1. Authentication and Authorization
  // Assuming admin role_id is 1, as seen in other admin routes.
  const authResult = await requireAuth(request, [1]); 
  if (authResult) {
    // requireAuth returns a NextResponse directly if auth fails
    return authResult; 
  }

  const dbService = new DatabaseService();

  try {
    // 2. Parameter Validation
    const { packageId } = params;
    if (!packageId) {
      return NextResponse.json({ success: false, message: 'Package ID is required.' }, { status: 400 });
    }

    const parsedPackageId = parseInt(packageId, 10);
    if (isNaN(parsedPackageId) || parsedPackageId <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid Package ID format.' }, { status: 400 });
    }

    // 3. Database Operation
    const result = await dbService.deletePackage(parsedPackageId);

    // 4. Response Handling
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Package deleted successfully' 
      }, { status: 200 });
    } else {
      // Check for specific "not found" error message from dbService.deletePackage
      if (result.error && result.error.toLowerCase().includes('not found')) {
        return NextResponse.json({ 
          success: false, 
          message: result.error 
        }, { status: 404 });
      }
      // Other database errors
      return NextResponse.json({ 
        success: false, 
        message: result.error || 'Failed to delete package due to a database error.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error(`Error deleting package [ID: ${params.packageId}]:`, error);
    const apiError: ApiError = {
      message: 'Failed to delete package due to an unexpected error.',
      error: error instanceof Error ? error.message : String(error)
    };
    return NextResponse.json({
      success: false,
      ...apiError
    }, { status: 500 });
  }
}
