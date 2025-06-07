import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { verifyAuth } from '@/lib/auth';

const dbService = new DatabaseService();

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { isAuthenticated, user } = await verifyAuth(request);
    
    if (!isAuthenticated || user?.role_id !== 1) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // packages, services, hotels, activities, rentals, transport
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let bookingsData: any[] = [];
    let totalCount = 0;

    switch (type) {
      case 'packages':
        const packageBookings = await dbService.getAllPackageBookingsForAdmin(limit, offset);
        const packageCount = await dbService.countAllPackageBookingsForAdmin();
        bookingsData = packageBookings.results || [];
        totalCount = packageCount?.total || 0;
        break;

      case 'hotels':
        const hotelBookings = await dbService.getAllServiceBookingsForAdmin('hotels', limit, offset);
        const hotelCount = await dbService.countAllServiceBookingsForAdmin('hotels');
        bookingsData = hotelBookings.results || [];
        totalCount = hotelCount?.total || 0;
        break;

      case 'activities':
        const activityBookings = await dbService.getAllServiceBookingsForAdmin('activity', limit, offset);
        const activityCount = await dbService.countAllServiceBookingsForAdmin('activity');
        bookingsData = activityBookings.results || [];
        totalCount = activityCount?.total || 0;
        break;

      case 'rentals':
        const rentalBookings = await dbService.getAllServiceBookingsForAdmin('rental', limit, offset);
        const rentalCount = await dbService.countAllServiceBookingsForAdmin('rental');
        bookingsData = rentalBookings.results || [];
        totalCount = rentalCount?.total || 0;
        break;

      case 'transport':
        const transportBookings = await dbService.getAllServiceBookingsForAdmin('transport', limit, offset);
        const transportCount = await dbService.countAllServiceBookingsForAdmin('transport');
        bookingsData = transportBookings.results || [];
        totalCount = transportCount?.total || 0;
        break;

      case 'services':
        const allServiceBookings = await dbService.getAllServiceBookingsForAdmin(undefined, limit, offset);
        const allServiceCount = await dbService.countAllServiceBookingsForAdmin();
        bookingsData = allServiceBookings.results || [];
        totalCount = allServiceCount?.total || 0;
        break;

      case 'all':
      default:
        // Get both package and service bookings
        const [packages, services] = await Promise.all([
          dbService.getAllPackageBookingsForAdmin(Math.floor(limit/2), offset),
          dbService.getAllServiceBookingsForAdmin(undefined, Math.floor(limit/2), 0)
        ]);
        
        const [packageTotal, serviceTotal] = await Promise.all([
          dbService.countAllPackageBookingsForAdmin(),
          dbService.countAllServiceBookingsForAdmin()
        ]);

        // Combine and mark booking types
        const packageResults = (packages.results || []).map((booking: any) => ({
          ...booking,
          booking_type: 'package'
        }));
        
        const serviceResults = (services.results || []).map((booking: any) => ({
          ...booking,
          booking_type: 'service'
        }));

        bookingsData = [...packageResults, ...serviceResults];
        totalCount = (packageTotal?.total || 0) + (serviceTotal?.total || 0);
        break;
    }

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        bookings: bookingsData,
        pagination: {
          totalItems: totalCount,
          currentPage: page,
          pageSize: limit,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch bookings. Please try again.' 
      },
      { status: 500 }
    );
  }
} 