import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { bookingSystem } from '../../../../lib/booking-system';

interface CreateHoldRequest {
  session_id: string;
  user_id?: number | null;
  hold_type: 'hotel_room' | 'service';
  room_type_id?: number;
  service_id?: number;
  hold_date: string;
  quantity: number;
  hold_price?: number;
  expires_in_minutes?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateHoldRequest = await request.json();
    
    // Validation
    if (!body.session_id || !body.hold_type || !body.hold_date || !body.quantity) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.hold_type === 'hotel_room' && (!body.room_type_id || !body.service_id)) {
      return NextResponse.json(
        { success: false, message: 'Room type ID and service ID required for hotel room holds' },
        { status: 400 }
      );
    }

    if (body.hold_type === 'service' && !body.service_id) {
      return NextResponse.json(
        { success: false, message: 'Service ID required for service holds' },
        { status: 400 }
      );
    }

    // Check for existing active hold for this session
    const existingHolds = await bookingSystem.getActiveHolds(body.session_id);
    if (existingHolds.length > 0) {
      // Cancel existing holds for this session to create a new one
      for (const hold of existingHolds) {
        await bookingSystem.updateHoldStatus(hold.id, 'cancelled');
      }
    }

    // Create the hold
    const holdResult = await bookingSystem.createBookingHold({
      session_id: body.session_id,
      user_id: body.user_id || undefined,
      hold_type: body.hold_type,
      room_type_id: body.room_type_id,
      service_id: body.service_id,
      hold_date: body.hold_date,
      quantity: body.quantity,
      hold_price: body.hold_price,
      expires_in_minutes: body.expires_in_minutes || 15,
    });

    if (holdResult.success && holdResult.meta?.last_row_id) {
      // Calculate expiration time
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + (body.expires_in_minutes || 15));

      return NextResponse.json({
        success: true,
        hold_id: holdResult.meta.last_row_id,
        expires_at: expiresAt.toISOString(),
        message: 'Hold created successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to create hold' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Create hold error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create hold' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve active holds
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    const userId = url.searchParams.get('user_id');

    if (!sessionId && !userId) {
      return NextResponse.json(
        { success: false, message: 'Session ID or User ID required' },
        { status: 400 }
      );
    }

    const holds = await bookingSystem.getActiveHolds(
      sessionId || undefined,
      userId ? parseInt(userId) : undefined
    );

    return NextResponse.json({
      success: true,
      holds: holds
    });

  } catch (error) {
    console.error('Get holds error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve holds' },
      { status: 500 }
    );
  }
} 