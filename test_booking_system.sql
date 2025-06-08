-- Test Queries for Enhanced Booking System
-- Run these queries to verify the migration was successful and test functionality

-- ============================================================================
-- 1. VERIFY MIGRATION SUCCESS
-- ============================================================================

-- Check if new tables were created
.tables

-- Verify new table structures
.schema hotel_room_availability
.schema service_availability  
.schema booking_holds
.schema inventory_adjustments
.schema booking_state_history

-- Check if indexes were created
.indices hotel_room_availability
.indices booking_holds

-- ============================================================================
-- 2. VERIFY VIEWS WERE CREATED
-- ============================================================================

-- List all views
SELECT name FROM sqlite_master WHERE type = 'view';

-- Test room availability view
SELECT COUNT(*) as total_room_availability_records FROM v_room_availability;

-- Test service availability view  
SELECT COUNT(*) as total_service_availability_records FROM v_service_availability;

-- ============================================================================
-- 3. SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert a test island if it doesn't exist
INSERT OR IGNORE INTO islands (id, name, description) 
VALUES (999, 'Test Island', 'Test island for booking system verification');

-- Insert a test service provider if it doesn't exist
INSERT OR IGNORE INTO service_providers (id, user_id, business_name, type, verified)
VALUES (999, 1, 'Test Hotel Provider', 'hotel', 1);

-- Insert a test hotel service
INSERT OR IGNORE INTO services (id, name, type, provider_id, island_id, price, is_active, is_admin_approved)
VALUES (999, 'Test Beach Resort', 'hotel', 999, 999, 100.00, 1, 1);

-- Insert hotel details
INSERT OR IGNORE INTO hotels (service_id, star_rating, total_rooms)
VALUES (999, 4, 50);

-- Insert room types
INSERT OR IGNORE INTO hotel_room_types (id, service_id, room_type, base_price, max_guests, quantity, is_admin_approved)
VALUES 
  (999, 999, 'Standard Room', 100.00, 2, 20, 1),
  (998, 999, 'Deluxe Room', 150.00, 3, 15, 1),
  (997, 999, 'Suite', 250.00, 4, 10, 1);

-- Insert a test non-hotel service
INSERT OR IGNORE INTO services (id, name, type, provider_id, island_id, price, is_active, is_admin_approved)
VALUES (998, 'Test Scuba Diving', 'activity', 999, 999, 75.00, 1, 1);

-- ============================================================================
-- 4. TEST AVAILABILITY QUERIES
-- ============================================================================

-- Check room availability for the next 7 days
SELECT 
  room_type,
  date,
  total_rooms,
  booked_rooms,
  available_rooms,
  current_price
FROM v_room_availability 
WHERE service_id = 999 
AND date BETWEEN date('now') AND date('now', '+7 days')
ORDER BY room_type, date;

-- Check service availability
SELECT 
  service_name,
  date,
  total_capacity,
  booked_capacity,
  available_capacity
FROM v_service_availability 
WHERE service_id = 998
AND date BETWEEN date('now') AND date('now', '+7 days')
ORDER BY date;

-- ============================================================================
-- 5. TEST BOOKING HOLDS
-- ============================================================================

-- Create a test booking hold for a hotel room
INSERT INTO booking_holds (
  session_id, 
  user_id, 
  hold_type, 
  room_type_id,
  hold_date, 
  quantity, 
  hold_price, 
  expires_at
) VALUES (
  'test_session_001', 
  1, 
  'hotel_room', 
  999,
  date('now', '+1 day'), 
  2, 
  100.00, 
  datetime('now', '+15 minutes')
);

-- Create a test booking hold for a service
INSERT INTO booking_holds (
  session_id,
  user_id,
  hold_type,
  service_id,
  hold_date,
  quantity,
  hold_price,
  expires_at
) VALUES (
  'test_session_002',
  1,
  'service',
  998,
  date('now', '+2 days'),
  4,
  75.00,
  datetime('now', '+15 minutes')
);

-- View active holds
SELECT * FROM v_active_holds;

-- ============================================================================
-- 6. TEST BOOKING CREATION AND INVENTORY UPDATES
-- ============================================================================

-- Create a test booking
INSERT INTO bookings (
  user_id,
  total_people,
  start_date,
  end_date,
  status,
  total_amount,
  guest_name,
  guest_email
) VALUES (
  1,
  2,
  date('now', '+3 days'),
  date('now', '+5 days'),
  'confirmed',
  200.00,
  'Test Guest',
  'test@example.com'
);

-- Get the booking ID (this would be done programmatically)
-- For testing, let's assume the booking ID is the last inserted ID

-- Create booking service (this should trigger inventory update)
INSERT INTO booking_services (
  booking_id,
  service_id,
  hotel_room_type_id,
  quantity,
  price,
  date
) VALUES (
  (SELECT MAX(id) FROM bookings), -- Use last booking ID
  999,
  999, -- Standard Room
  1,
  100.00,
  date('now', '+3 days')
);

-- Verify inventory was updated automatically
SELECT 
  room_type,
  date,
  total_rooms,
  booked_rooms,
  available_rooms
FROM v_room_availability 
WHERE room_type_id = 999 
AND date = date('now', '+3 days');

-- Check inventory adjustments log
SELECT 
  adjustment_type,
  resource_type,
  adjustment_date,
  quantity_change,
  created_at
FROM inventory_adjustments 
WHERE room_type_id = 999
ORDER BY created_at DESC;

-- ============================================================================
-- 7. TEST MONITORING VIEWS
-- ============================================================================

-- Check for any overbooking situations
SELECT * FROM v_potential_overbooking;

-- Check for low availability alerts
SELECT * FROM v_low_availability_alert;

-- View booking analytics
SELECT 
  booking_id,
  guest_name,
  total_amount,
  booking_status,
  service_count
FROM v_booking_analytics 
ORDER BY booking_created DESC
LIMIT 10;

-- ============================================================================
-- 8. PERFORMANCE TESTS
-- ============================================================================

-- Test availability lookup performance (should be fast with indexes)
EXPLAIN QUERY PLAN 
SELECT * FROM v_room_availability 
WHERE room_type_id = 999 
AND date BETWEEN date('now') AND date('now', '+30 days')
AND available_rooms >= 1;

-- Test holds lookup performance
EXPLAIN QUERY PLAN
SELECT * FROM v_active_holds 
WHERE session_id = 'test_session_001';

-- ============================================================================
-- 9. CLEANUP TEST DATA (OPTIONAL)
-- ============================================================================

-- Uncomment these lines to clean up test data after verification:

-- DELETE FROM booking_services WHERE booking_id IN (SELECT id FROM bookings WHERE guest_email = 'test@example.com');
-- DELETE FROM bookings WHERE guest_email = 'test@example.com';
-- DELETE FROM booking_holds WHERE session_id LIKE 'test_session_%';
-- DELETE FROM hotel_room_types WHERE service_id = 999;
-- DELETE FROM hotels WHERE service_id = 999;
-- DELETE FROM services WHERE id IN (998, 999);
-- DELETE FROM service_providers WHERE id = 999;
-- DELETE FROM islands WHERE id = 999;

-- ============================================================================
-- 10. SYSTEM HEALTH CHECK
-- ============================================================================

-- Count records in new tables
SELECT 'hotel_room_availability' as table_name, COUNT(*) as record_count FROM hotel_room_availability
UNION ALL
SELECT 'service_availability', COUNT(*) FROM service_availability
UNION ALL
SELECT 'booking_holds', COUNT(*) FROM booking_holds
UNION ALL
SELECT 'inventory_adjustments', COUNT(*) FROM inventory_adjustments
UNION ALL
SELECT 'booking_state_history', COUNT(*) FROM booking_state_history;

-- Check triggers exist
SELECT name FROM sqlite_master WHERE type = 'trigger';

PRAGMA integrity_check; 