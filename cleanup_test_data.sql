-- Cleanup script to remove test data for hotel ID 999
-- Run this to remove the hardcoded test data

-- Clean up in correct order to respect foreign key constraints
DELETE FROM booking_services WHERE booking_id IN (SELECT id FROM bookings WHERE guest_email = 'test@example.com');
DELETE FROM bookings WHERE guest_email = 'test@example.com';
DELETE FROM booking_holds WHERE session_id LIKE 'test_session_%';

-- Clean up hotel-related test data
DELETE FROM hotel_room_availability WHERE room_type_id IN (997, 998, 999);
DELETE FROM hotel_room_types WHERE service_id = 999;
DELETE FROM hotels WHERE service_id = 999;

-- Clean up services and related data
DELETE FROM service_availability WHERE service_id IN (998, 999);
DELETE FROM services WHERE id IN (998, 999);
DELETE FROM service_providers WHERE id = 999;
DELETE FROM islands WHERE id = 999;

-- Verify cleanup
SELECT 'Services remaining' as check_type, COUNT(*) as count FROM services WHERE id IN (998, 999)
UNION ALL
SELECT 'Hotel room types remaining', COUNT(*) FROM hotel_room_types WHERE service_id = 999
UNION ALL
SELECT 'Hotels remaining', COUNT(*) FROM hotels WHERE service_id = 999
UNION ALL
SELECT 'Service providers remaining', COUNT(*) FROM service_providers WHERE id = 999
UNION ALL  
SELECT 'Islands remaining', COUNT(*) FROM islands WHERE id = 999; 