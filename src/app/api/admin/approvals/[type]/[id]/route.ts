export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth, VerifiedUser } from '@/lib/auth'; // Import custom auth

interface ApiError {
  message: string;
  error?: string;
}

// --- PUT handler: Approve a specific item ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]); 
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const { type, id } = params;
  const itemId = parseInt(id, 10);
  
  if (isNaN(itemId) || itemId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid item ID.' }, { status: 400 });
  }

  if (!['hotel', 'room', 'service'].includes(type)) {
    return NextResponse.json({ success: false, message: 'Invalid item type. Must be hotel, room, or service.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    let result: { success: boolean; error?: string } = { success: false, error: 'Not implemented' }; // Ensure result is typed
    let itemName = type;

    // Handle approval based on item type
    switch (type) {
      case 'hotel':
        result = await dbService.approveHotel(itemId);
        itemName = 'hotel';
        break;
        
      case 'room':
        result = await dbService.approveHotelRoom(itemId);
        itemName = 'hotel room';
        break;
        
      case 'service':
        result = await dbService.approveService(itemId);
        itemName = 'service';
        break;
        
      default:
        return NextResponse.json({ success: false, message: 'Invalid item type.' }, { status: 400 });
    }

    if (!result.success) {
      console.error(`Error approving ${itemName} ${itemId}:`, result.error);
      return NextResponse.json({
        success: false,
        message: `Failed to approve ${itemName}`,
        error: result.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} approved successfully`
    }, { status: 200 });

  } catch (error) {
    console.error(`Error approving ${type} ${itemId}:`, error);
    const apiError: ApiError = {
      message: `Failed to approve ${type}`,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
}

// --- GET handler: Get details of a specific item pending approval ---
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]); 
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const { type, id } = params;
  const itemId = parseInt(id, 10);
  
  if (isNaN(itemId) || itemId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid item ID.' }, { status: 400 });
  }

  if (!['hotel', 'room', 'service'].includes(type)) {
    return NextResponse.json({ success: false, message: 'Invalid item type. Must be hotel, room, or service.' }, { status: 400 });
  }

  const dbService = new DatabaseService();

  try {
    let result;
    let itemName = type;

    // Get details based on item type
    switch (type) {
      case 'hotel':
        // Use existing method to get hotel details
        result = await dbService.getHotelById(itemId);
        itemName = 'hotel';
        break;
        
      case 'room':
        // Use existing method to get room details
        result = await dbService.getRoomTypeById(itemId);
        itemName = 'hotel room';
        break;
        
      case 'service':
        // Use existing method to get service details
        result = await dbService.getServiceById(itemId);
        itemName = 'service';
        break;
        
      default:
        return NextResponse.json({ success: false, message: 'Invalid item type.' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ success: false, message: `${itemName} not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} details retrieved successfully`,
      data: result
    }, { status: 200 });

  } catch (error) {
    console.error(`Error getting ${type} ${itemId} details:`, error);
    const apiError: ApiError = {
      message: `Failed to retrieve ${type} details`,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
}

// --- DELETE handler: Reject a specific item ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]); 
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  const { type, id } = params;
  const itemId = parseInt(id, 10);
  
  if (isNaN(itemId) || itemId <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid item ID.' }, { status: 400 });
  }

  if (!['hotel', 'room', 'service'].includes(type)) {
    return NextResponse.json({ success: false, message: 'Invalid item type. Must be hotel, room, or service.' }, { status: 400 });
  }

  // Get rejection reason if provided in request body
  let rejectReason = '';
  try {
    const body = await request.json() as { reason?: string };
    rejectReason = body.reason || '';
  } catch (e) {
    // If request has no body or invalid JSON, proceed with empty reason
  }

  const dbService = new DatabaseService();

  try {
    let result: { success: boolean; error?: string } = { success: false, error: 'Not implemented' }; // Ensure result is typed
    let itemName = type;

    // Handle rejection based on item type
    switch (type) {
      case 'hotel':
        result = await dbService.rejectHotel(itemId, rejectReason);
        itemName = 'hotel';
        break;
        
      case 'room':
        result = await dbService.rejectHotelRoom(itemId, rejectReason);
        itemName = 'hotel room';
        break;
        
      case 'service':
        result = await dbService.rejectService(itemId, rejectReason);
        itemName = 'service';
        break;
        
      default:
        return NextResponse.json({ success: false, message: 'Invalid item type.' }, { status: 400 });
    }

    if (!result.success) {
      console.error(`Error rejecting ${itemName} ${itemId}:`, result.error);
      return NextResponse.json({
        success: false,
        message: `Failed to reject ${itemName}`,
        error: result.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} rejected successfully`
    }, { status: 200 });

  } catch (error) {
    console.error(`Error rejecting ${type} ${itemId}:`, error);
    const apiError: ApiError = {
      message: `Failed to reject ${type}`,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
} 