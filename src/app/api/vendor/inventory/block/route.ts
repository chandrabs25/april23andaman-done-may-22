import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyAuth } from "@/lib/auth";
import { DatabaseService, dbQuery } from "@/lib/database";

export const dynamic = "force-dynamic";

// POST /api/vendor/inventory/block
// Body: { room_type_id: number, from: "YYYY-MM-DD", to: "YYYY-MM-DD", quantity: number, reason?: string }
export async function POST(request: NextRequest) {
  const authResp = await requireAuth(request, [3]);
  if (authResp) return authResp;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
  }

  interface BlockRoomsBody {
    room_type_id: number;
    from: string;   // YYYY-MM-DD
    to: string;     // YYYY-MM-DD
    quantity: number;
    reason?: string;
  }

  const body = (await request.json()) as Partial<BlockRoomsBody> | null;

  const room_type_id = body?.room_type_id;
  const from = body?.from;
  const to = body?.to;
  const quantity = body?.quantity;
  const reason = body?.reason;

  if (!room_type_id || !from || !to || !quantity) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }
  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    return NextResponse.json({ success: false, message: "Quantity must be positive number" }, { status: 400 });
  }

  try {
    const db = new DatabaseService();

    // Validate room type exists & vendor owns it
    const roomType: any = await db.getRoomTypeById(Number(room_type_id));
    if (!roomType) {
      return NextResponse.json({ success: false, message: "Room type not found" }, { status: 404 });
    }

    const serviceRecord: any = await db.getServiceById(roomType.service_id);
    if (!serviceRecord) {
      return NextResponse.json({ success: false, message: "Parent hotel service not found" }, { status: 404 });
    }

    // Ensure vendor owns hotel
    const provider = await db.getServiceProviderByUserId(Number(user.id));
    if (!provider || provider.id !== serviceRecord.provider_id) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    // Iterate date range inclusive
    const fromDate = new Date(from + "T00:00:00Z");
    const toDate = new Date(to + "T00:00:00Z");
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || fromDate > toDate) {
      return NextResponse.json({ success: false, message: "Invalid date range" }, { status: 400 });
    }

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const adjustments: Promise<any>[] = [];

    for (let d = new Date(fromDate); d <= toDate; d = new Date(d.getTime() + ONE_DAY)) {
      const dateStr = d.toISOString().slice(0, 10);

      // Ensure availability record exists and increment blocked_rooms atomically
      const upsertSql = `
        INSERT INTO hotel_room_availability (room_type_id, date, total_rooms, booked_rooms, blocked_rooms)
        VALUES (?, ?, (SELECT quantity FROM hotel_room_types WHERE id = ?), 0, ?)
        ON CONFLICT(room_type_id, date) DO UPDATE SET
          blocked_rooms = blocked_rooms + excluded.blocked_rooms,
          updated_at = CURRENT_TIMESTAMP;
      `;
      adjustments.push(dbQuery(upsertSql, [room_type_id, dateStr, room_type_id, qty]));

      // Insert into inventory_adjustments
      const adjSql = `
        INSERT INTO inventory_adjustments (
          adjustment_type, reference_type, reference_id,
          resource_type, room_type_id, adjustment_date,
          quantity_change, reason, performed_by
        ) VALUES ('block', 'manual', NULL, 'hotel_room', ?, ?, ?, ?, ?);
      `;
      adjustments.push(dbQuery(adjSql, [room_type_id, dateStr, qty, reason || null, user.id]));
    }

    await Promise.all(adjustments);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error blocking rooms", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
} 