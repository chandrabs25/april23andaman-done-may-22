-- Helper Views and Functions for Enhanced Booking System
-- This migration provides utility views and functions for easier booking management

-- ============================================================================
-- HELPER VIEWS FOR AVAILABILITY CHECKING
-- ============================================================================

-- View to get current room availability with pricing
CREATE VIEW v_room_availability AS
SELECT 
  hra.id,
  hra.room_type_id,
  hrt.service_id,
  hrt.room_type,
  hrt.base_price,
  hra.date,
  hra.total_rooms,
  hra.booked_rooms,
  hra.blocked_rooms,
  hra.available_rooms,
  
  -- Calculate current price with seasonal adjustments
  COALESCE(
    hsr.price_override,
    hrt.base_price * (1 + COALESCE(hsr.price_modifier, 0))
  ) as current_price,
  
  -- Season information
  hsr.season_name,
  hsr.price_modifier,
  
  -- Hotel information
  s.name as hotel_name,
  s.description as hotel_description,
  h.star_rating,
  
  hra.last_updated,
  hra.created_at
FROM hotel_room_availability hra
JOIN hotel_room_types hrt ON hra.room_type_id = hrt.id
JOIN services s ON hrt.service_id = s.id
JOIN hotels h ON s.id = h.service_id
LEFT JOIN hotel_seasonal_rates hsr ON (
  hrt.id = hsr.room_type_id 
  AND hra.date BETWEEN hsr.start_date AND hsr.end_date
)
WHERE s.is_active = 1 AND s.is_admin_approved = 1
AND hrt.is_admin_approved = 1;

-- View to get current service availability
CREATE VIEW v_service_availability AS
SELECT 
  sa.id,
  sa.service_id,
  s.name as service_name,
  s.description,
  s.type as service_type,
  s.price as base_price,
  sa.date,
  sa.total_capacity,
  sa.booked_capacity,
  sa.blocked_capacity,
  sa.available_capacity,
  
  -- Service provider information
  sp.business_name as provider_name,
  
  -- Island information
  i.name as island_name,
  
  sa.last_updated,
  sa.created_at
FROM service_availability sa
JOIN services s ON sa.service_id = s.id
JOIN service_providers sp ON s.provider_id = sp.id
JOIN islands i ON s.island_id = i.id
WHERE s.is_active = 1 AND s.is_admin_approved = 1;

-- View to get active booking holds with details
CREATE VIEW v_active_holds AS
SELECT 
  bh.id,
  bh.session_id,
  bh.user_id,
  bh.hold_type,
  bh.hold_date,
  bh.quantity,
  bh.hold_price,
  bh.expires_at,
  bh.status,
  
  -- Room type information (for hotel holds)
  CASE WHEN bh.hold_type = 'hotel_room' THEN
    hrt.room_type || ' at ' || s_hotel.name
  END as room_description,
  
  -- Service information (for service holds)
  CASE WHEN bh.hold_type = 'service' THEN
    s_service.name || ' (' || s_service.type || ')'
  END as service_description,
  
  -- User information
  u.first_name || ' ' || u.last_name as user_name,
  u.email as user_email,
  
  bh.created_at
FROM booking_holds bh
LEFT JOIN hotel_room_types hrt ON bh.room_type_id = hrt.id
LEFT JOIN services s_hotel ON hrt.service_id = s_hotel.id
LEFT JOIN services s_service ON bh.service_id = s_service.id
LEFT JOIN users u ON bh.user_id = u.id
WHERE bh.status = 'active' AND bh.expires_at > datetime('now');

-- View for booking analytics and reporting
CREATE VIEW v_booking_analytics AS
SELECT 
  b.id as booking_id,
  b.start_date,
  b.end_date,
  b.total_people,
  b.total_amount,
  b.status as booking_status,
  b.payment_status,
  
  -- Guest information
  COALESCE(u.first_name || ' ' || u.last_name, b.guest_name) as guest_name,
  COALESCE(u.email, b.guest_email) as guest_email,
  COALESCE(u.phone, b.guest_phone) as guest_phone,
  
  -- Package information
  p.name as package_name,
  pc.category_name as package_category,
  
  -- Count of services in booking
  (SELECT COUNT(*) FROM booking_services WHERE booking_id = b.id) as service_count,
  
  -- Revenue breakdown
  b.total_amount as total_revenue,
  CASE WHEN b.payment_status = 'SUCCESS' THEN b.total_amount ELSE 0 END as confirmed_revenue,
  
  b.created_at as booking_created,
  b.updated_at as booking_updated
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN packages p ON b.package_id = p.id
LEFT JOIN package_categories pc ON b.package_category_id = pc.id;

-- ============================================================================
-- STORED PROCEDURES / FUNCTIONS (SQL Functions for SQLite)
-- ============================================================================

-- Note: SQLite doesn't support stored procedures, but we can create these as application-level functions
-- The following are SQL snippets that can be used in application code

/*
-- Function to check room availability for a date range
-- Usage in application: 
SELECT * FROM v_room_availability 
WHERE room_type_id = ? 
AND date BETWEEN ? AND ? 
AND available_rooms >= ?
ORDER BY date;
*/

/*
-- Function to create a booking hold
-- Usage in application:
INSERT INTO booking_holds (
  session_id, user_id, hold_type, room_type_id, service_id,
  hold_date, quantity, hold_price, expires_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+15 minutes'));
*/

/*
-- Function to convert hold to booking
-- This would be implemented in application code as a transaction:
BEGIN TRANSACTION;

-- 1. Create the booking
INSERT INTO bookings (...) VALUES (...);

-- 2. Create booking_services entries
INSERT INTO booking_services (...) VALUES (...);

-- 3. Update hold status
UPDATE booking_holds SET status = 'converted' WHERE id = ?;

COMMIT;
*/

-- ============================================================================
-- UTILITY QUERIES FOR COMMON OPERATIONS
-- ============================================================================

-- Clean up expired holds (should be run periodically)
-- UPDATE booking_holds SET status = 'expired' WHERE expires_at < datetime('now') AND status = 'active';

-- Get availability summary for a hotel
-- SELECT 
--   hrt.room_type,
--   COUNT(*) as days_tracked,
--   AVG(hra.available_rooms) as avg_available,
--   MIN(hra.available_rooms) as min_available,
--   MAX(hra.available_rooms) as max_available
-- FROM hotel_room_availability hra
-- JOIN hotel_room_types hrt ON hra.room_type_id = hrt.id
-- WHERE hrt.service_id = ? 
-- AND hra.date BETWEEN ? AND ?
-- GROUP BY hrt.id, hrt.room_type;

-- Get bookings for a specific date range
-- SELECT * FROM v_booking_analytics 
-- WHERE start_date <= ? AND end_date >= ?
-- ORDER BY start_date;

-- Get revenue summary by month
-- SELECT 
--   strftime('%Y-%m', start_date) as month,
--   COUNT(*) as total_bookings,
--   SUM(total_amount) as total_revenue,
--   SUM(confirmed_revenue) as confirmed_revenue,
--   AVG(total_amount) as avg_booking_value
-- FROM v_booking_analytics
-- WHERE start_date >= ?
-- GROUP BY strftime('%Y-%m', start_date)
-- ORDER BY month;

-- ============================================================================
-- MAINTENANCE AND OPTIMIZATION
-- ============================================================================

-- Query to identify potential overbooking situations
CREATE VIEW v_potential_overbooking AS
SELECT 
  'hotel_room' as resource_type,
  hra.room_type_id as resource_id,
  hrt.room_type || ' at ' || s.name as resource_name,
  hra.date,
  hra.total_rooms,
  hra.booked_rooms,
  hra.blocked_rooms,
  hra.available_rooms,
  CASE WHEN hra.available_rooms < 0 THEN 'OVERBOOKED' ELSE 'OK' END as status
FROM hotel_room_availability hra
JOIN hotel_room_types hrt ON hra.room_type_id = hrt.id
JOIN services s ON hrt.service_id = s.id
WHERE hra.available_rooms < 0

UNION ALL

SELECT 
  'service' as resource_type,
  sa.service_id as resource_id,
  s.name as resource_name,
  sa.date,
  sa.total_capacity as total_rooms,
  sa.booked_capacity as booked_rooms,
  sa.blocked_capacity as blocked_rooms,
  sa.available_capacity as available_rooms,
  CASE WHEN sa.available_capacity < 0 THEN 'OVERBOOKED' ELSE 'OK' END as status
FROM service_availability sa
JOIN services s ON sa.service_id = s.id
WHERE sa.available_capacity < 0;

-- Query to find rooms/services with low availability
CREATE VIEW v_low_availability_alert AS
SELECT 
  'hotel_room' as resource_type,
  hra.room_type_id as resource_id,
  hrt.room_type || ' at ' || s.name as resource_name,
  hra.date,
  hra.available_rooms as available,
  hra.total_rooms,
  ROUND((hra.available_rooms * 100.0) / hra.total_rooms, 2) as availability_percentage
FROM hotel_room_availability hra
JOIN hotel_room_types hrt ON hra.room_type_id = hrt.id
JOIN services s ON hrt.service_id = s.id
WHERE hra.available_rooms > 0 
AND (hra.available_rooms * 100.0) / hra.total_rooms <= 20 -- Less than 20% available
AND hra.date >= date('now')

UNION ALL

SELECT 
  'service' as resource_type,
  sa.service_id as resource_id,
  s.name as resource_name,
  sa.date,
  sa.available_capacity as available,
  sa.total_capacity as total_rooms,
  ROUND((sa.available_capacity * 100.0) / sa.total_capacity, 2) as availability_percentage
FROM service_availability sa
JOIN services s ON sa.service_id = s.id
WHERE sa.available_capacity > 0
AND (sa.available_capacity * 100.0) / sa.total_capacity <= 20 -- Less than 20% available
AND sa.date >= date('now')
ORDER BY availability_percentage ASC; 