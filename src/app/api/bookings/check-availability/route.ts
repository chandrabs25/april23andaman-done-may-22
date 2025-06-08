import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { bookingSystem } from '../../../../lib/booking-system';

interface AvailabilityRequest {
  type: 'hotel_room' | 'service';
  room_type_id?: number;
  service_id?: number;
  start_date: string;
  end_date: string;
  required_rooms?: number;
  required_capacity?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AvailabilityRequest = await request.json();
    
    // Validation
    if (!body.type || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { available: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let isAvailable = false;
    let availabilityData = null;

    if (body.type === 'hotel_room') {
      if (!body.room_type_id || !body.service_id) {
        return NextResponse.json(
          { available: false, message: 'Room type ID and service ID required for hotel rooms' },
          { status: 400 }
        );
      }

      const roomAvailability = await bookingSystem.checkRoomAvailability({
        room_type_id: body.room_type_id,
        service_id: body.service_id,
        start_date: body.start_date,
        end_date: body.end_date,
        required_rooms: body.required_rooms || 1,
      });

      // Check if all dates have sufficient availability
      const requiredRooms = body.required_rooms || 1;
      isAvailable = roomAvailability.length > 0 && 
        roomAvailability.every(day => day.available_rooms >= requiredRooms);
      
      availabilityData = roomAvailability;

    } else if (body.type === 'service') {
      if (!body.service_id) {
        return NextResponse.json(
          { available: false, message: 'Service ID required for service bookings' },
          { status: 400 }
        );
      }

      const serviceAvailability = await bookingSystem.checkServiceAvailability({
        service_id: body.service_id,
        start_date: body.start_date,
        end_date: body.end_date,
        required_capacity: body.required_capacity || 1,
      });

      // Check if all dates have sufficient availability
      const requiredCapacity = body.required_capacity || 1;
      isAvailable = serviceAvailability.length > 0 && 
        serviceAvailability.every(day => day.available_capacity >= requiredCapacity);
      
      availabilityData = serviceAvailability;
    }

    return NextResponse.json({
      available: isAvailable,
      data: availabilityData,
      message: isAvailable ? 'Available' : 'Not available for selected dates/quantity'
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { available: false, message: 'Failed to check availability' },
      { status: 500 }
    );
  }
} 