export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { requireAuth } from '@/lib/auth'; // Import custom auth

interface ApiError {
  message: string;
  error?: string;
}

interface ApprovalResponseItem {
  // Common fields for all approval types
  id: number;
  created_at: string;
  // Specific fields that may be present
  name?: string;
  hotel_name?: string;
  type?: string;
  room_type?: string;
  price?: number;
  price_per_night?: number;
  provider_id?: number;
  hotel_service_id?: number;
  star_rating?: number;
}

// Helper function to check admin access is removed as requireAuth handles it.

// --- GET handler: List all items pending approval ---
export async function GET(request: NextRequest) {
  // Admin check using requireAuth. Assuming admin role_id is 1.
  const authResult = await requireAuth(request, [1]); 
  if (authResult) {
    return authResult; // Not authorized or other error
  }

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const pageStr = searchParams.get('page');
  const limitStr = searchParams.get('limit');
  const type = searchParams.get('type'); // 'hotels', 'rooms', 'services', or undefined for 'all'
  
  // Parse pagination params
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = limitStr ? parseInt(limitStr, 10) : 10;
  const offset = (page - 1) * limit;

  // Validate pagination params
  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json(
      { success: false, message: 'Invalid pagination parameters' },
      { status: 400 }
    );
  }

  const dbService = new DatabaseService();

  try {
    let items: any[] = [];
    let total = 0;
    
    // Get items based on specified type (or all types if not specified)
    if (!type || type === 'all') {
      // For "all", we need to fetch each type separately then combine
      const [hotelsResult, hotelRoomsResult, servicesResult] = await Promise.all([
        dbService.getUnapprovedHotels(limit, offset),
        dbService.getUnapprovedHotelRooms(limit, offset),
        dbService.getUnapprovedServices(limit, offset)
      ]);
      
      // Combine results
      items = [
        ...(hotelsResult.results || []).map(h => ({ ...h, type: 'hotel' })),
        ...(hotelRoomsResult.results || []),
        ...(servicesResult.results || [])
      ];
      
      // Get total count for pagination
      const [hotelCount, roomCount, serviceCount] = await Promise.all([
        dbService.countUnapprovedHotels(),
        dbService.countUnapprovedHotelRooms(),
        dbService.countUnapprovedServices()
      ]);
      
      total = (hotelCount?.total || 0) + (roomCount?.total || 0) + (serviceCount?.total || 0);
      
      // Sort combined results by created_at
      items.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      // Apply pagination manually after combining
      items = items.slice(0, limit);
      
    } else {
      // Handle specific type filter
      switch (type) {
        case 'hotels':
          const hotelsResult = await dbService.getUnapprovedHotels(limit, offset);
          items = (hotelsResult.results || []).map(h => ({ ...h, type: 'hotel' }));
          const hotelCount = await dbService.countUnapprovedHotels();
          total = hotelCount?.total || 0;
          break;
          
        case 'rooms':
          const roomsResult = await dbService.getUnapprovedHotelRooms(limit, offset);
          items = roomsResult.results || [];
          const roomCount = await dbService.countUnapprovedHotelRooms();
          total = roomCount?.total || 0;
          break;
          
        case 'services':
          const servicesResult = await dbService.getUnapprovedServices(limit, offset);
          items = servicesResult.results || [];
          const serviceCount = await dbService.countUnapprovedServices();
          total = serviceCount?.total || 0;
          break;
          
        default:
          return NextResponse.json(
            { 
              success: false, 
              message: 'Invalid type parameter. Use "hotels", "rooms", "services", or omit for all.' 
            },
            { status: 400 }
          );
      }
    }
    
    // Calculate pagination values
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      message: 'Pending approvals retrieved successfully',
      data: {
        items,
        pagination: {
          totalItems: total,
          currentPage: page,
          pageSize: limit,
          totalPages
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    const apiError: ApiError = {
      message: 'Failed to fetch pending approvals',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    return NextResponse.json({
      success: false,
      ...apiError,
      data: null
    }, { status: 500 });
  }
} 