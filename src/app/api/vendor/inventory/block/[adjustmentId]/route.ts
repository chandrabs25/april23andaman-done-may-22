import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyAuth } from "@/lib/auth";
import { DatabaseService, dbQuery } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest, { params }: { params: { adjustmentId: string } }) {
  const authResp = await requireAuth(request, [3]);
  if (authResp) return authResp;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
  }

  const adjustmentId = Number(params.adjustmentId);
  if (isNaN(adjustmentId)) {
    return NextResponse.json({ success: false, message: "Invalid adjustmentId" }, { status: 400 });
  }

  try {
    const dbSvc = new DatabaseService();

    // Fetch the adjustment row
    const adjSql = `SELECT * FROM inventory_adjustments WHERE id = ?`;
    const { rows: adjRows } = await dbQuery(adjSql, [adjustmentId]);
    const adj = adjRows[0];
    if (!adj) {
      return NextResponse.json({ success: false, message: "Adjustment not found" }, { status: 404 });
    }

    if (adj.adjustment_type !== 'block' || adj.resource_type !== 'hotel_room') {
      return NextResponse.json({ success: false, message: "Only manual block adjustments can be reverted" }, { status: 400 });
    }

    // Ensure vendor owns the hotel
    const roomType: any = await dbSvc.getRoomTypeById(adj.room_type_id);
    if (!roomType) {
      return NextResponse.json({ success: false, message: "Room type not found" }, { status: 404 });
    }
    const service = await dbSvc.getServiceById(roomType.service_id);
    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }
    const provider = await dbSvc.getServiceProviderByUserId(Number(user.id));
    if (!provider || provider.id !== service.provider_id) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const dateStr = adj.adjustment_date; // stored as YYYY-MM-DD
    const qty = adj.quantity_change; // positive number of rooms blocked

    // Reverse the block: decrease blocked_rooms
    const updateSql = `
      UPDATE hotel_room_availability
      SET blocked_rooms = MAX(blocked_rooms - ?, 0), updated_at = CURRENT_TIMESTAMP
      WHERE room_type_id = ? AND date = ?;`;
    await dbQuery(updateSql, [qty, adj.room_type_id, dateStr]);

    // Insert new adjustment row for unblock
    const insertSql = `
      INSERT INTO inventory_adjustments (
        adjustment_type, reference_type, reference_id, resource_type,
        room_type_id, adjustment_date, quantity_change, reason, performed_by
      ) VALUES ('unblock', 'manual', ?, 'hotel_room', ?, ?, ?, 'unblock', ?);
    `;
    await dbQuery(insertSql, [adjustmentId, adj.room_type_id, dateStr, -qty, user.id]);

    // Optionally, mark original adjustment as reverted (add reason?)

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error reverting block", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
} 