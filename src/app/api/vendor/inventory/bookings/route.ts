import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyAuth } from "@/lib/auth";
import { DatabaseService, dbQuery } from "@/lib/database";

export const dynamic = "force-dynamic";

// GET /api/vendor/inventory/bookings?serviceId=123&from=2024-07-01&to=2024-07-31&status=pending,confirmed
export async function GET(request: NextRequest) {
  const authResp = await requireAuth(request, [3]);
  if (authResp) return authResp;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const serviceIdParam = searchParams.get("serviceId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const statusParam = searchParams.get("status"); // comma separated

  if (!serviceIdParam) {
    return NextResponse.json({ success: false, message: "serviceId param required" }, { status: 400 });
  }
  const serviceId = Number(serviceIdParam);
  if (isNaN(serviceId)) {
    return NextResponse.json({ success: false, message: "Invalid serviceId" }, { status: 400 });
  }

  const dbSvc = new DatabaseService();
  const service = await dbSvc.getServiceById(serviceId);
  if (!service) {
    return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
  }

  const provider = await dbSvc.getServiceProviderByUserId(Number(user.id));
  if (!provider || provider.id !== service.provider_id) {
    return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
  }

  // Build SQL
  let sql = `
    SELECT b.id as booking_id, b.status as booking_status, b.start_date, b.end_date, bs.date as service_date,
           bs.quantity, hrt.room_type, hrt.id as room_type_id,
           b.guest_name, b.guest_email, b.guest_phone
    FROM bookings b
    JOIN booking_services bs ON bs.booking_id = b.id
    JOIN hotel_room_types hrt ON bs.hotel_room_type_id = hrt.id
    WHERE hrt.service_id = ?`;
  const params: any[] = [serviceId];

  if (from && to) {
    sql += " AND bs.date BETWEEN ? AND ?";
    params.push(from, to);
  }

  if (statusParam) {
    const statuses = statusParam.split(",").map(s => s.trim());
    const placeholders = statuses.map(() => "?").join(",");
    sql += ` AND b.status IN (${placeholders})`;
    params.push(...statuses);
  }

  sql += " ORDER BY bs.date ASC";

  const { rows, success, error } = await dbQuery(sql, params);
  if (!success) {
    console.error("Error fetching bookings", error);
    return NextResponse.json({ success: false, message: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: rows });
} 