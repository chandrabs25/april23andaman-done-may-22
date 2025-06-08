# Enhanced Booking System Implementation Guide

This guide explains the implementation of the high-priority real-time inventory management and medium-priority booking holds system for hotels and services.

## 🎯 Overview

The enhanced booking system provides:

1. **Real-time Inventory Management** - Track availability of hotel rooms and services in real-time
2. **Booking Holds System** - Temporary reservation system (shopping cart functionality)
3. **Automated Inventory Updates** - Triggers that automatically update availability when bookings are made
4. **Comprehensive Audit Trail** - Track all inventory changes and booking state transitions
5. **Performance Optimized** - Proper indexing and views for fast queries

## 📊 Database Schema Changes

### New Tables Added

#### 1. `hotel_room_availability`
Tracks daily availability for each hotel room type:
```sql
- room_type_id: Links to hotel_room_types
- date: Specific date for availability
- total_rooms: Total rooms available for this type
- booked_rooms: Currently booked rooms
- blocked_rooms: Rooms blocked for maintenance
- available_rooms: Computed field (total - booked - blocked)
```

#### 2. `service_availability`
Tracks daily availability for non-hotel services:
```sql
- service_id: Links to services table
- date: Specific date for availability  
- total_capacity: Total capacity for the service
- booked_capacity: Currently booked capacity
- blocked_capacity: Capacity blocked
- available_capacity: Computed field
```

#### 3. `booking_holds`
Manages temporary bookings (shopping cart):
```sql
- session_id: Browser session identifier
- hold_type: 'hotel_room' or 'service'
- room_type_id/service_id: What's being held
- hold_date: Date for the hold
- quantity: Number of units held
- expires_at: When the hold expires (default: 15 minutes)
- status: 'active', 'expired', 'converted', 'cancelled'
```

#### 4. `inventory_adjustments`
Audit trail for all inventory changes:
```sql
- adjustment_type: 'booking', 'cancellation', 'block', 'unblock'
- reference_type: 'booking', 'hold', 'manual'
- quantity_change: Positive or negative adjustment
- performed_by: User who made the change
```

#### 5. `booking_state_history`
Tracks booking status transitions:
```sql
- booking_id: Reference to booking
- from_state/to_state: State transition
- changed_by: User who triggered change
- change_reason: Optional reason
```

## 🔧 Key Features

### 1. Automatic Inventory Updates

**Triggers automatically update availability when bookings are created:**

```sql
-- When a hotel room booking is made
CREATE TRIGGER update_room_availability_on_booking_insert
AFTER INSERT ON booking_services
WHEN NEW.hotel_room_type_id IS NOT NULL
-- Updates hotel_room_availability.booked_rooms
-- Logs change in inventory_adjustments
```

### 2. Real-time Availability Checking

**Use the `v_room_availability` view for hotel rooms:**
```sql
SELECT * FROM v_room_availability 
WHERE room_type_id = ? 
AND date BETWEEN '2024-01-01' AND '2024-01-07'
AND available_rooms >= 2
ORDER BY date;
```

**Use the `v_service_availability` view for services:**
```sql
SELECT * FROM v_service_availability 
WHERE service_id = ? 
AND date = '2024-01-01'
AND available_capacity >= 4;
```

### 3. Booking Holds Management

**Create a hold (shopping cart):**
```sql
INSERT INTO booking_holds (
  session_id, user_id, hold_type, room_type_id,
  hold_date, quantity, hold_price, expires_at
) VALUES (
  'session_123', 456, 'hotel_room', 789,
  '2024-01-01', 2, 150.00, datetime('now', '+15 minutes')
);
```

**Convert hold to booking:**
```sql
BEGIN TRANSACTION;

-- 1. Create the booking
INSERT INTO bookings (user_id, total_people, start_date, end_date, total_amount, status)
VALUES (?, ?, ?, ?, ?, 'pending');

-- 2. Create booking services
INSERT INTO booking_services (booking_id, service_id, hotel_room_type_id, quantity, price, date)
VALUES (?, ?, ?, ?, ?, ?);

-- 3. Mark hold as converted
UPDATE booking_holds SET status = 'converted' WHERE id = ?;

COMMIT;
```

## 🚀 Usage Examples

### Hotel Booking Flow

```javascript
// 1. Check availability
const availability = await db.query(`
  SELECT * FROM v_room_availability 
  WHERE service_id = ? AND date BETWEEN ? AND ? 
  AND available_rooms >= ?
`, [hotelId, checkIn, checkOut, roomsNeeded]);

// 2. Create hold
const holdId = await db.query(`
  INSERT INTO booking_holds (
    session_id, user_id, hold_type, room_type_id,
    hold_date, quantity, hold_price, expires_at
  ) VALUES (?, ?, 'hotel_room', ?, ?, ?, ?, datetime('now', '+15 minutes'))
`, [sessionId, userId, roomTypeId, checkInDate, quantity, price]);

// 3. Convert to booking (when payment succeeds)
await convertHoldToBooking(holdId, paymentDetails);
```

### Service Booking Flow

```javascript
// 1. Check service availability
const available = await db.query(`
  SELECT available_capacity FROM v_service_availability 
  WHERE service_id = ? AND date = ?
`, [serviceId, bookingDate]);

// 2. Create hold
await db.query(`
  INSERT INTO booking_holds (
    session_id, hold_type, service_id, hold_date, 
    quantity, expires_at
  ) VALUES (?, 'service', ?, ?, ?, datetime('now', '+15 minutes'))
`, [sessionId, serviceId, bookingDate, quantity]);
```

## 📈 Monitoring & Analytics

### 1. Overbooking Detection
```sql
SELECT * FROM v_potential_overbooking;
```

### 2. Low Availability Alerts
```sql
SELECT * FROM v_low_availability_alert 
WHERE availability_percentage < 20;
```

### 3. Booking Analytics
```sql
SELECT * FROM v_booking_analytics 
WHERE booking_created >= date('now', '-30 days');
```

### 4. Active Holds Monitoring
```sql
SELECT * FROM v_active_holds 
WHERE expires_at < datetime('now', '+5 minutes'); -- Expiring soon
```

## 🛠️ Maintenance Tasks

### 1. Clean Up Expired Holds
```sql
-- Run this periodically (e.g., every 5 minutes)
UPDATE booking_holds 
SET status = 'expired' 
WHERE expires_at < datetime('now') AND status = 'active';
```

### 2. Initialize Availability for New Resources
```sql
-- For new hotel room types
INSERT INTO hotel_room_availability (room_type_id, date, total_rooms)
SELECT id, date('now', '+' || n || ' days'), quantity
FROM hotel_room_types 
CROSS JOIN generate_series(0, 364) AS s(n)
WHERE id = ?; -- New room type ID
```

### 3. Block Rooms for Maintenance
```sql
UPDATE hotel_room_availability 
SET blocked_rooms = blocked_rooms + ?, updated_at = CURRENT_TIMESTAMP
WHERE room_type_id = ? AND date BETWEEN ? AND ?;

-- Log the adjustment
INSERT INTO inventory_adjustments (
  adjustment_type, reference_type, resource_type, 
  room_type_id, adjustment_date, quantity_change, 
  reason, performed_by
) VALUES (
  'block', 'manual', 'hotel_room', 
  ?, ?, ?, 'Maintenance block', ?
);
```

## 🔒 Security Considerations

1. **Hold Expiration**: Holds automatically expire after 15 minutes to prevent inventory hoarding
2. **Session Validation**: Always validate session_id before creating/converting holds
3. **Capacity Limits**: Check constraints prevent negative availability
4. **Audit Trail**: All changes are logged in `inventory_adjustments`

## ⚡ Performance Tips

1. **Use Views**: Always use the provided views (`v_room_availability`, `v_service_availability`) for consistency
2. **Index Usage**: Queries on date ranges will use the provided indexes efficiently
3. **Batch Operations**: When updating multiple dates, use batch INSERT/UPDATE operations
4. **Regular Cleanup**: Run hold cleanup regularly to maintain performance

## 🔄 Integration Points

### API Endpoints to Implement

1. `GET /api/availability/rooms` - Check room availability
2. `POST /api/holds` - Create booking hold  
3. `PUT /api/holds/:id/convert` - Convert hold to booking
4. `DELETE /api/holds/:id` - Cancel hold
5. `GET /api/admin/availability` - Admin availability management
6. `POST /api/admin/block-inventory` - Block rooms/services

### Frontend Integration

```javascript
// Example: React hook for availability checking
const useAvailability = (resourceType, resourceId, dateRange) => {
  const [availability, setAvailability] = useState(null);
  
  useEffect(() => {
    const checkAvailability = async () => {
      const response = await fetch(`/api/availability/${resourceType}`, {
        method: 'POST',
        body: JSON.stringify({ resourceId, dateRange })
      });
      setAvailability(await response.json());
    };
    
    checkAvailability();
  }, [resourceType, resourceId, dateRange]);
  
  return availability;
};
```

## 📝 Migration Notes

1. **Run migrations in order**: `0001_initial.sql` → `0002_booking_enhancements.sql` → `0003_booking_helper_functions.sql`
2. **Initial data**: The migration automatically creates 365 days of availability data for existing resources
3. **Existing bookings**: Historical bookings won't affect the new availability system until they're re-synced
4. **Backup first**: Always backup your database before running migrations

This enhanced booking system provides a robust foundation for managing hotel and service reservations with real-time inventory tracking and temporary holds functionality. 