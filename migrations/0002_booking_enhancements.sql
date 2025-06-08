-- Migration: Enhanced Booking System with Real-time Inventory and Booking Holds
-- Priority: High - Real-time inventory management
-- Priority: Medium - Booking holds system

-- ============================================================================
-- HIGH PRIORITY: Real-time Inventory Management
-- ============================================================================

-- Table to track daily room availability for each room type
CREATE TABLE hotel_room_availability (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  room_type_id      INTEGER NOT NULL,
  date              DATE NOT NULL,
  total_rooms       INTEGER NOT NULL,        -- Total rooms available for this type on this date
  booked_rooms      INTEGER NOT NULL DEFAULT 0, -- Currently booked rooms
  blocked_rooms     INTEGER NOT NULL DEFAULT 0, -- Rooms blocked for maintenance/special use
  available_rooms   INTEGER GENERATED ALWAYS AS (total_rooms - booked_rooms - blocked_rooms) STORED,
  last_updated      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (room_type_id) REFERENCES hotel_room_types(id) ON DELETE CASCADE,
  UNIQUE(room_type_id, date),
  CHECK (booked_rooms >= 0),
  CHECK (blocked_rooms >= 0),
  CHECK (total_rooms > 0)
);

-- Table to track service availability (for non-hotel services)
CREATE TABLE service_availability (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id        INTEGER NOT NULL,
  date              DATE NOT NULL,
  total_capacity    INTEGER NOT NULL,        -- Total capacity for this service on this date
  booked_capacity   INTEGER NOT NULL DEFAULT 0, -- Currently booked capacity
  blocked_capacity  INTEGER NOT NULL DEFAULT 0, -- Capacity blocked for maintenance/special use
  available_capacity INTEGER GENERATED ALWAYS AS (total_capacity - booked_capacity - blocked_capacity) STORED,
  last_updated      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE(service_id, date),
  CHECK (booked_capacity >= 0),
  CHECK (blocked_capacity >= 0),
  CHECK (total_capacity > 0)
);

-- ============================================================================
-- MEDIUM PRIORITY: Booking Holds System
-- ============================================================================

-- Table to manage temporary booking holds (shopping cart equivalent)
CREATE TABLE booking_holds (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id        TEXT NOT NULL,           -- Browser/user session identifier
  user_id           INTEGER,                 -- Optional: if user is logged in
  hold_type         TEXT NOT NULL,           -- 'hotel_room' or 'service'
  
  -- Hotel-specific fields
  room_type_id      INTEGER,                 -- For hotel room holds
  
  -- Service-specific fields  
  service_id        INTEGER,                 -- For general service holds
  
  -- Common fields
  hold_date         DATE NOT NULL,           -- Date for which items are held
  quantity          INTEGER NOT NULL DEFAULT 1, -- Number of rooms/service units held
  hold_price        REAL,                    -- Price locked at time of hold
  
  -- Hold management
  expires_at        DATETIME NOT NULL,       -- When this hold expires
  status            TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'converted', 'cancelled'
  
  -- Metadata
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES hotel_room_types(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  
  CHECK (hold_type IN ('hotel_room', 'service')),
  CHECK (status IN ('active', 'expired', 'converted', 'cancelled')),
  CHECK (quantity > 0),
  CHECK (
    (hold_type = 'hotel_room' AND room_type_id IS NOT NULL AND service_id IS NULL) OR
    (hold_type = 'service' AND service_id IS NOT NULL AND room_type_id IS NULL)
  )
);

-- Table to track inventory adjustments and audit trail
CREATE TABLE inventory_adjustments (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  adjustment_type   TEXT NOT NULL,           -- 'booking', 'cancellation', 'block', 'unblock', 'maintenance'
  reference_type    TEXT NOT NULL,           -- 'booking', 'hold', 'manual'
  reference_id      INTEGER,                 -- ID of booking, hold, or admin action
  
  -- Target resource
  resource_type     TEXT NOT NULL,           -- 'hotel_room', 'service'
  room_type_id      INTEGER,
  service_id        INTEGER,
  
  -- Adjustment details
  adjustment_date   DATE NOT NULL,
  quantity_change   INTEGER NOT NULL,        -- Positive or negative adjustment
  reason            TEXT,
  performed_by      INTEGER,                 -- User who made the adjustment
  
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (performed_by) REFERENCES users(id),
  FOREIGN KEY (room_type_id) REFERENCES hotel_room_types(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  
  CHECK (adjustment_type IN ('booking', 'cancellation', 'block', 'unblock', 'maintenance')),
  CHECK (reference_type IN ('booking', 'hold', 'manual')),
  CHECK (resource_type IN ('hotel_room', 'service')),
  CHECK (quantity_change != 0),
  CHECK (
    (resource_type = 'hotel_room' AND room_type_id IS NOT NULL AND service_id IS NULL) OR
    (resource_type = 'service' AND service_id IS NOT NULL AND room_type_id IS NULL)
  )
);

-- ============================================================================
-- ENHANCED BOOKING STATES
-- ============================================================================

-- Add a booking state tracking table for more granular status management
CREATE TABLE booking_state_history (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id        INTEGER NOT NULL,
  from_state        TEXT,
  to_state          TEXT NOT NULL,
  changed_by        INTEGER,                 -- User who triggered the state change
  change_reason     TEXT,
  metadata          TEXT,                    -- JSON for additional state-specific data
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id),
  
  CHECK (to_state IN ('pending', 'payment_initiated', 'payment_confirmed', 'confirmed', 'checked_in', 'completed', 'cancelled', 'refunded'))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Hotel room availability indexes
CREATE INDEX idx_room_availability_room_type_date ON hotel_room_availability(room_type_id, date);
CREATE INDEX idx_room_availability_date ON hotel_room_availability(date);
CREATE INDEX idx_room_availability_available_rooms ON hotel_room_availability(available_rooms);

-- Service availability indexes  
CREATE INDEX idx_service_availability_service_date ON service_availability(service_id, date);
CREATE INDEX idx_service_availability_date ON service_availability(date);
CREATE INDEX idx_service_availability_available ON service_availability(available_capacity);

-- Booking holds indexes
CREATE INDEX idx_booking_holds_session_id ON booking_holds(session_id);
CREATE INDEX idx_booking_holds_expires_at ON booking_holds(expires_at);
CREATE INDEX idx_booking_holds_status ON booking_holds(status);
CREATE INDEX idx_booking_holds_room_type_date ON booking_holds(room_type_id, hold_date);
CREATE INDEX idx_booking_holds_service_date ON booking_holds(service_id, hold_date);
CREATE INDEX idx_booking_holds_user_id ON booking_holds(user_id);

-- Inventory adjustments indexes
CREATE INDEX idx_inventory_adj_room_type_date ON inventory_adjustments(room_type_id, adjustment_date);
CREATE INDEX idx_inventory_adj_service_date ON inventory_adjustments(service_id, adjustment_date);
CREATE INDEX idx_inventory_adj_reference ON inventory_adjustments(reference_type, reference_id);
CREATE INDEX idx_inventory_adj_type ON inventory_adjustments(adjustment_type);

-- Booking state history indexes
CREATE INDEX idx_booking_state_booking_id ON booking_state_history(booking_id);
CREATE INDEX idx_booking_state_to_state ON booking_state_history(to_state);
CREATE INDEX idx_booking_state_created_at ON booking_state_history(created_at);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC INVENTORY MANAGEMENT
-- ============================================================================

-- Trigger to automatically update room availability when bookings are created
CREATE TRIGGER update_room_availability_on_booking_insert
AFTER INSERT ON booking_services
WHEN NEW.hotel_room_type_id IS NOT NULL
BEGIN
  -- Update booked_rooms in hotel_room_availability
  INSERT INTO hotel_room_availability (room_type_id, date, total_rooms, booked_rooms)
  VALUES (NEW.hotel_room_type_id, NEW.date, 
    (SELECT quantity FROM hotel_room_types WHERE id = NEW.hotel_room_type_id), 
    NEW.quantity)
  ON CONFLICT(room_type_id, date) DO UPDATE SET
    booked_rooms = booked_rooms + NEW.quantity,
    updated_at = CURRENT_TIMESTAMP;
    
  -- Log the inventory adjustment
  INSERT INTO inventory_adjustments (
    adjustment_type, reference_type, reference_id, 
    resource_type, room_type_id, adjustment_date, 
    quantity_change, performed_by
  ) VALUES (
    'booking', 'booking', NEW.booking_id,
    'hotel_room', NEW.hotel_room_type_id, NEW.date,
    NEW.quantity, 
    (SELECT user_id FROM bookings WHERE id = NEW.booking_id)
  );
END;

-- Trigger to automatically update service availability when bookings are created
CREATE TRIGGER update_service_availability_on_booking_insert
AFTER INSERT ON booking_services
WHEN NEW.hotel_room_type_id IS NULL
BEGIN
  -- Update booked_capacity in service_availability
  INSERT INTO service_availability (service_id, date, total_capacity, booked_capacity)
  VALUES (NEW.service_id, NEW.date, 100, NEW.quantity) -- Default capacity of 100
  ON CONFLICT(service_id, date) DO UPDATE SET
    booked_capacity = booked_capacity + NEW.quantity,
    updated_at = CURRENT_TIMESTAMP;
    
  -- Log the inventory adjustment
  INSERT INTO inventory_adjustments (
    adjustment_type, reference_type, reference_id,
    resource_type, service_id, adjustment_date,
    quantity_change, performed_by
  ) VALUES (
    'booking', 'booking', NEW.booking_id,
    'service', NEW.service_id, NEW.date,
    NEW.quantity,
    (SELECT user_id FROM bookings WHERE id = NEW.booking_id)
  );
END;

-- Trigger to clean up expired holds
CREATE TRIGGER cleanup_expired_holds
AFTER UPDATE ON booking_holds
WHEN NEW.expires_at < datetime('now') AND OLD.status = 'active'
BEGIN
  UPDATE booking_holds 
  SET status = 'expired', updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;

-- ============================================================================
-- INITIAL DATA AND SETUP
-- ============================================================================

-- Create availability records for existing hotel room types (next 365 days)
INSERT INTO hotel_room_availability (room_type_id, date, total_rooms, booked_rooms, blocked_rooms)
SELECT 
  hrt.id,
  date('now', '+' || seq.n || ' days') as availability_date,
  hrt.quantity as total_rooms,
  0 as booked_rooms,
  0 as blocked_rooms
FROM hotel_room_types hrt
CROSS JOIN (
  WITH RECURSIVE sequence(n) AS (
    SELECT 0
    UNION ALL
    SELECT n + 1 FROM sequence WHERE n < 364
  )
  SELECT n FROM sequence
) seq
WHERE EXISTS (SELECT 1 FROM hotel_room_types WHERE id = hrt.id);

-- Create service availability records for existing services (next 365 days)
INSERT INTO service_availability (service_id, date, total_capacity, booked_capacity, blocked_capacity)
SELECT 
  s.id,
  date('now', '+' || seq.n || ' days') as availability_date,
  100 as total_capacity, -- Default capacity, should be configured per service
  0 as booked_capacity,
  0 as blocked_capacity
FROM services s
CROSS JOIN (
  WITH RECURSIVE sequence(n) AS (
    SELECT 0
    UNION ALL 
    SELECT n + 1 FROM sequence WHERE n < 364
  )
  SELECT n FROM sequence
) seq
WHERE s.type != 'hotel' -- Exclude hotels as they use room-specific availability
AND EXISTS (SELECT 1 FROM services WHERE id = s.id); 