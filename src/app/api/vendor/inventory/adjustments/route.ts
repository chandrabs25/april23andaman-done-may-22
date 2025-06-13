import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyAuth } from "@/lib/auth";
import { DatabaseService, dbQuery } from "@/lib/database";

export const dynamic = "force-dynamic";

// GET /api/vendor/inventory/adjustments?serviceId=123&from=2024-07-01&to=2024-07-31
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

  // Build SQL selecting relevant adjustments for room types in this hotel
  let sql = `
    SELECT ia.id, ia.adjustment_date, ia.adjustment_type, ia.quantity_change, ia.reason,
           ia.room_type_id, hrt.room_type
    FROM inventory_adjustments ia
    JOIN hotel_room_types hrt ON ia.room_type_id = hrt.id
    WHERE ia.resource_type = 'hotel_room' AND ia.adjustment_type = 'block' AND hrt.service_id = ?`;
  const params: any[] = [serviceId];

  if (from && to) {
    sql += " AND ia.adjustment_date BETWEEN ? AND ?";
    params.push(from, to);
  }

  sql += " ORDER BY ia.adjustment_date DESC, ia.id DESC";

  const { rows, success, error } = await dbQuery(sql, params);
  if (!success) {
    console.error("Error fetching adjustments", error);
    return NextResponse.json({ success: false, message: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: rows });
} 