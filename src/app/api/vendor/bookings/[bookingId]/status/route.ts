import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyAuth } from "@/lib/auth";
import { DatabaseService } from "@/lib/database";

export const dynamic = "force-dynamic";

// PUT /api/vendor/bookings/[bookingId]/status
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  const authResp = await requireAuth(request, [3]); // Only vendors (role_id 3)
  if (authResp) return authResp;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
  }

  const bookingId = parseInt(params.bookingId);
  if (isNaN(bookingId)) {
    return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const { status: newStatus } = body;
  if (!newStatus || typeof newStatus !== 'string') {
    return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
  }

  // Validate status values
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(newStatus.toLowerCase())) {
    return NextResponse.json({ 
      success: false, 
      message: `Invalid status. Valid values: ${validStatuses.join(', ')}` 
    }, { status: 400 });
  }

  const dbSvc = new DatabaseService();

  try {
    // 1. Get the booking and verify vendor ownership
    const booking = await dbSvc.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // 2. Verify vendor has access to this booking
    const provider = await dbSvc.getServiceProviderByUserId(Number(user.id));
    if (!provider) {
      return NextResponse.json({ success: false, message: "Vendor profile not found" }, { status: 403 });
    }

    // 3. Check if booking belongs to vendor's services
    // For package bookings, check if package was created by vendor
    // For service bookings, check if service belongs to vendor's provider
    let hasAccess = false;

    if (booking.package_id) {
      // Package booking - check package creator
      const packageData = await dbSvc.getPackageById(booking.package_id);
      if (packageData && packageData.created_by === Number(user.id)) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      // Check service bookings
      const { dbQuery } = await import('@/lib/database');
      const { rows } = await dbQuery(`
        SELECT COUNT(*) as count
        FROM booking_services bs
        JOIN services s ON bs.service_id = s.id
        WHERE bs.booking_id = ? AND s.provider_id = ?
      `, [bookingId, provider.id]);

      if (rows.length > 0 && rows[0].count > 0) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ 
        success: false, 
        message: "Access denied - booking does not belong to your services" 
      }, { status: 403 });
    }

    // 4. Update the booking status
    const result = await dbSvc.updateBookingStatusAndPaymentStatus(
      bookingId.toString(),
      newStatus.toUpperCase(),
      booking.payment_status // Keep existing payment status
    );

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        message: "Failed to update booking status" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Booking status updated to ${newStatus}`,
      data: { id: bookingId, status: newStatus.toUpperCase() }
    });

  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
} 