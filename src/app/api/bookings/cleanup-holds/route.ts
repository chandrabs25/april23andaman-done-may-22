import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { bookingSystem } from '../../../../lib/booking-system';

export async function POST(request: NextRequest) {
  try {
    console.log('Cleaning up expired booking holds...');
    
    const result = await bookingSystem.cleanupExpiredHolds();
    
    console.log(`Cleanup result: ${result.changes} expired holds updated`);
    
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.changes} expired holds`,
      cleaned_holds: result.changes
    });

  } catch (error) {
    console.error('Error cleaning up expired holds:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup expired holds' },
      { status: 500 }
    );
  }
}

// GET endpoint for manual cleanup (useful for testing)
export async function GET(request: NextRequest) {
  try {
    const result = await bookingSystem.cleanupExpiredHolds();
    
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.changes} expired holds`,
      cleaned_holds: result.changes
    });

  } catch (error) {
    console.error('Error cleaning up expired holds:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup expired holds' },
      { status: 500 }
    );
  }
} 