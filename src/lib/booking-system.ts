import { getDatabase } from './database';

// Types for the enhanced booking system
export interface RoomAvailability {
  id: number;
  room_type_id: number;
  service_id: number;
  room_type: string;
  base_price: number;
  date: string;
  total_rooms: number;
  booked_rooms: number;
  blocked_rooms: number;
  available_rooms: number;
  current_price: number;
  season_name?: string;
  price_modifier?: number;
  hotel_name: string;
  hotel_description: string;
  star_rating: number;
}

export interface ServiceAvailability {
  id: number;
  service_id: number;
  service_name: string;
  description: string;
  service_type: string;
  base_price: number;
  date: string;
  total_capacity: number;
  booked_capacity: number;
  blocked_capacity: number;
  available_capacity: number;
  provider_name: string;
  island_name: string;
}

export interface BookingHold {
  id: number;
  session_id: string;
  user_id?: number;
  hold_type: 'hotel_room' | 'service';
  room_type_id?: number;
  service_id?: number;
  hold_date: string;
  quantity: number;
  hold_price?: number;
  expires_at: string;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
  room_description?: string;
  service_description?: string;
  user_name?: string;
  user_email?: string;
}

export interface InventoryAdjustment {
  id: number;
  adjustment_type: 'booking' | 'cancellation' | 'block' | 'unblock' | 'maintenance';
  reference_type: 'booking' | 'hold' | 'manual';
  reference_id?: number;
  resource_type: 'hotel_room' | 'service';
  room_type_id?: number;
  service_id?: number;
  adjustment_date: string;
  quantity_change: number;
  reason?: string;
  performed_by?: number;
  created_at: string;
}

/**
 * Enhanced Booking System Service
 * Provides methods for real-time inventory management and booking holds
 */
export class BookingSystemService {
  
  // ============================================================================
  // AVAILABILITY CHECKING
  // ============================================================================

  /**
   * Check room availability for a date range
   */
  async checkRoomAvailability(params: {
    room_type_id?: number;
    service_id?: number;
    start_date: string;
    end_date: string;
    required_rooms?: number;
  }): Promise<RoomAvailability[]> {
    const db = await getDatabase();
    
    let query = `
      SELECT * FROM v_room_availability 
      WHERE date BETWEEN ? AND ?
    `;
    const bindings: any[] = [params.start_date, params.end_date];

    if (params.room_type_id) {
      query += ' AND room_type_id = ?';
      bindings.push(params.room_type_id);
    }

    if (params.service_id) {
      query += ' AND service_id = ?';
      bindings.push(params.service_id);
    }

    if (params.required_rooms) {
      query += ' AND available_rooms >= ?';
      bindings.push(params.required_rooms);
    }

    query += ' ORDER BY date, room_type';

    const result = await db.prepare(query).bind(...bindings).all();
    return result.results as RoomAvailability[];
  }

  /**
   * Check service availability for a date range
   */
  async checkServiceAvailability(params: {
    service_id: number;
    start_date: string;
    end_date: string;
    required_capacity?: number;
  }): Promise<ServiceAvailability[]> {
    const db = await getDatabase();
    
    let query = `
      SELECT * FROM v_service_availability 
      WHERE service_id = ? AND date BETWEEN ? AND ?
    `;
    const bindings = [params.service_id, params.start_date, params.end_date];

    if (params.required_capacity) {
      query += ' AND available_capacity >= ?';
      bindings.push(params.required_capacity);
    }

    query += ' ORDER BY date';

    const result = await db.prepare(query).bind(...bindings).all();
    return result.results as ServiceAvailability[];
  }

  // ============================================================================
  // BOOKING HOLDS MANAGEMENT
  // ============================================================================

  /**
   * Create a booking hold (shopping cart functionality)
   */
  async createBookingHold(params: {
    session_id: string;
    user_id?: number;
    hold_type: 'hotel_room' | 'service';
    room_type_id?: number;
    service_id?: number;
    hold_date: string;
    quantity: number;
    hold_price?: number;
    expires_in_minutes?: number;
  }) {
    const db = await getDatabase();
    
    const expiresInMinutes = params.expires_in_minutes || 15;
    
    const result = await db.prepare(`
      INSERT INTO booking_holds (
        session_id, user_id, hold_type, room_type_id, service_id,
        hold_date, quantity, hold_price, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+${expiresInMinutes} minutes'))
    `).bind(
      params.session_id,
      params.user_id || null,
      params.hold_type,
      params.room_type_id || null,
      params.service_id || null,
      params.hold_date,
      params.quantity,
      params.hold_price || null
    ).run();

    return result;
  }

  /**
   * Get active holds for a session or user
   */
  async getActiveHolds(session_id?: string, user_id?: number): Promise<BookingHold[]> {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM v_active_holds WHERE 1=1';
    const bindings: any[] = [];

    if (session_id) {
      query += ' AND session_id = ?';
      bindings.push(session_id);
    }

    if (user_id) {
      query += ' AND user_id = ?';
      bindings.push(user_id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.prepare(query).bind(...bindings).all();
    return result.results as BookingHold[];
  }

  /**
   * Update hold status (cancel, extend, etc.)
   */
  async updateHoldStatus(hold_id: number, status: 'active' | 'expired' | 'converted' | 'cancelled') {
    const db = await getDatabase();
    
    return await db.prepare(`
      UPDATE booking_holds 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(status, hold_id).run();
  }

  /**
   * Convert hold to booking (when payment is successful)
   */
  async convertHoldToBooking(hold_id: number, booking_data: {
    user_id?: number;
    package_id?: number;
    package_category_id?: number;
    total_people: number;
    start_date: string;
    end_date: string;
    total_amount: number;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    special_requests?: string;
  }) {
    const db = await getDatabase();
    
    try {
      // Get hold details
      const hold = await db.prepare('SELECT * FROM booking_holds WHERE id = ?')
        .bind(hold_id).first() as BookingHold;

      if (!hold || hold.status !== 'active') {
        throw new Error('Invalid or expired hold');
      }

      // Create booking
      const bookingResult = await db.prepare(`
        INSERT INTO bookings (
          user_id, package_id, package_category_id, total_people,
          start_date, end_date, total_amount, status, payment_status,
          guest_name, guest_email, guest_phone, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'SUCCESS', ?, ?, ?, ?)
      `).bind(
        booking_data.user_id || null,
        booking_data.package_id || null,
        booking_data.package_category_id || null,
        booking_data.total_people,
        booking_data.start_date,
        booking_data.end_date,
        booking_data.total_amount,
        booking_data.guest_name || null,
        booking_data.guest_email || null,
        booking_data.guest_phone || null,
        booking_data.special_requests || null
      ).run();

      if (!bookingResult.success || !bookingResult.meta?.last_row_id) {
        throw new Error('Failed to create booking');
      }

      const booking_id = bookingResult.meta.last_row_id;

      // Create booking service entry
      await db.prepare(`
        INSERT INTO booking_services (
          booking_id, service_id, hotel_room_type_id, quantity, price, date
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        booking_id,
        hold.service_id || (hold.room_type_id ? 
          (await db.prepare('SELECT service_id FROM hotel_room_types WHERE id = ?')
            .bind(hold.room_type_id).first() as any)?.service_id : null
        ),
        hold.room_type_id || null,
        hold.quantity,
        hold.hold_price || booking_data.total_amount,
        hold.hold_date
      ).run();

      // Mark hold as converted
      await this.updateHoldStatus(hold_id, 'converted');

      return { booking_id, success: true };

    } catch (error) {
      console.error('Error converting hold to booking:', error);
      throw error;
    }
  }

  /**
   * Clean up expired holds
   */
  async cleanupExpiredHolds() {
    const db = await getDatabase();
    
    return await db.prepare(`
      UPDATE booking_holds 
      SET status = 'expired', updated_at = CURRENT_TIMESTAMP 
      WHERE expires_at < datetime('now') AND status = 'active'
    `).run();
  }

  // ============================================================================
  // INVENTORY MANAGEMENT
  // ============================================================================

  /**
   * Initialize availability for a new room type
   */
  async initializeRoomAvailability(room_type_id: number, total_rooms: number, days_ahead: number = 365) {
    const db = await getDatabase();
    
    // Use batch insert for better performance
    const values = Array.from({ length: days_ahead }, (_, i) => 
      `(${room_type_id}, date('now', '+${i} days'), ${total_rooms}, 0, 0)`
    ).join(',');

    return await db.prepare(`
      INSERT OR IGNORE INTO hotel_room_availability (room_type_id, date, total_rooms, booked_rooms, blocked_rooms)
      VALUES ${values}
    `).run();
  }

  /**
   * Initialize availability for a new service
   */
  async initializeServiceAvailability(service_id: number, total_capacity: number, days_ahead: number = 365) {
    const db = await getDatabase();
    
    const values = Array.from({ length: days_ahead }, (_, i) => 
      `(${service_id}, date('now', '+${i} days'), ${total_capacity}, 0, 0)`
    ).join(',');

    return await db.prepare(`
      INSERT OR IGNORE INTO service_availability (service_id, date, total_capacity, booked_capacity, blocked_capacity)
      VALUES ${values}
    `).run();
  }

  /**
   * Block rooms for maintenance or special use
   */
  async blockRooms(params: {
    room_type_id: number;
    start_date: string;
    end_date: string;
    quantity: number;
    reason?: string;
    performed_by?: number;
  }) {
    const db = await getDatabase();
    
    // Update availability
    await db.prepare(`
      UPDATE hotel_room_availability 
      SET blocked_rooms = blocked_rooms + ?, updated_at = CURRENT_TIMESTAMP
      WHERE room_type_id = ? AND date BETWEEN ? AND ?
    `).bind(params.quantity, params.room_type_id, params.start_date, params.end_date).run();

    // Log the adjustment
    return await db.prepare(`
      INSERT INTO inventory_adjustments (
        adjustment_type, reference_type, resource_type, 
        room_type_id, adjustment_date, quantity_change, 
        reason, performed_by
      ) VALUES ('block', 'manual', 'hotel_room', ?, ?, ?, ?, ?)
    `).bind(
      params.room_type_id,
      params.start_date,
      params.quantity,
      params.reason || 'Manual block',
      params.performed_by || null
    ).run();
  }

  // ============================================================================
  // MONITORING AND ANALYTICS
  // ============================================================================

  /**
   * Get overbooking alerts
   */
  async getOverbookingAlerts() {
    const db = await getDatabase();
    const result = await db.prepare('SELECT * FROM v_potential_overbooking').all();
    return result.results;
  }

  /**
   * Get low availability alerts
   */
  async getLowAvailabilityAlerts(threshold: number = 20) {
    const db = await getDatabase();
    const result = await db.prepare(`
      SELECT * FROM v_low_availability_alert 
      WHERE availability_percentage <= ?
      ORDER BY availability_percentage ASC
    `).bind(threshold).all();
    return result.results;
  }

  /**
   * Get booking analytics
   */
  async getBookingAnalytics(params: {
    start_date?: string;
    end_date?: string;
    limit?: number;
  } = {}) {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM v_booking_analytics WHERE 1=1';
    const bindings: any[] = [];

    if (params.start_date) {
      query += ' AND booking_created >= ?';
      bindings.push(params.start_date);
    }

    if (params.end_date) {
      query += ' AND booking_created <= ?';
      bindings.push(params.end_date);
    }

    query += ' ORDER BY booking_created DESC';

    if (params.limit) {
      query += ' LIMIT ?';
      bindings.push(params.limit);
    }

    const result = await db.prepare(query).bind(...bindings).all();
    return result.results;
  }

  /**
   * Get inventory adjustments history
   */
  async getInventoryHistory(params: {
    resource_type?: 'hotel_room' | 'service';
    resource_id?: number;
    start_date?: string;
    end_date?: string;
    adjustment_type?: string;
  } = {}) {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM inventory_adjustments WHERE 1=1';
    const bindings: any[] = [];

    if (params.resource_type) {
      query += ' AND resource_type = ?';
      bindings.push(params.resource_type);
    }

    if (params.resource_id) {
      if (params.resource_type === 'hotel_room') {
        query += ' AND room_type_id = ?';
      } else {
        query += ' AND service_id = ?';
      }
      bindings.push(params.resource_id);
    }

    if (params.start_date) {
      query += ' AND adjustment_date >= ?';
      bindings.push(params.start_date);
    }

    if (params.end_date) {
      query += ' AND adjustment_date <= ?';
      bindings.push(params.end_date);
    }

    if (params.adjustment_type) {
      query += ' AND adjustment_type = ?';
      bindings.push(params.adjustment_type);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.prepare(query).bind(...bindings).all();
    return result.results as InventoryAdjustment[];
  }
}

// Export singleton instance
export const bookingSystem = new BookingSystemService(); 