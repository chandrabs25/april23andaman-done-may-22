-- seed.sql - Seed data for Andaman Travel Platform

-- Clear existing data
-- Ordered to attempt to respect foreign key constraints,
-- though PRAGMA foreign_keys=OFF makes it less strict during this block.
PRAGMA foreign_keys=OFF; -- Temporarily disable FK checks during seeding

DELETE FROM hotel_seasonal_rates;
DELETE FROM hotel_room_types;
DELETE FROM hotels;
DELETE FROM booking_services;
DELETE FROM reviews;
DELETE FROM package_categories; -- New table
DELETE FROM packages;
DELETE FROM bookings;
DELETE FROM ferry_schedules;
DELETE FROM ferries;
DELETE FROM permits;
DELETE FROM services;
DELETE FROM service_providers;
DELETE FROM islands;
DELETE FROM users WHERE email NOT LIKE 'admin@%'; -- Keep admin user (ID 1)
-- Roles are typically managed by migrations and not cleared in general seeds unless intended.

-- =============================================
-- Ensure Roles Exist (Safety check - should already exist from migrations)
-- =============================================
INSERT OR IGNORE INTO roles (id, name, description, permissions) VALUES
  (1, 'admin', 'Administrator with full access', 'all'),
  (2, 'user', 'Regular user/traveler', 'basic'),
  (3, 'vendor', 'Service provider/vendor', 'vendor');

-- =============================================
-- Ensure Admin User Exists (Safety check - should already exist from migrations)
-- =============================================
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, role_id) VALUES
  (1, 'admin@reachandaman.com', '$2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S', 'Admin', 'User', 1);

-- =============================================
-- Users (Admin user 'admin@reachandaman.com' should already exist from migration 0001_initial.sql)
-- Passwords are 'password' hashed with bcrypt ($2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S)
-- =============================================
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role_id) VALUES
  (2, 'testuser@example.com', '$2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S', 'Test', 'User', '9876543210', 2),
  (3, 'scubavendor@example.com', '$2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S', 'Scuba', 'Vendor', '9876543211', 3),
  (4, 'hotelvendor@example.com', '$2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S', 'Hotel', 'Manager', '9876543212', 3);

-- =============================================
-- Islands
-- =============================================
INSERT INTO islands (id, name, description, permit_required, images) VALUES
  (1, 'Port Blair', 'The capital city and entry point to the Andaman Islands, known for its historical significance and cellular jail.', 0, '/images/portblair/hero.webp'),
  (2, 'Havelock Island (Swaraj Dweep)', 'Famous for its stunning beaches like Radhanagar Beach (Beach No. 7) and clear waters ideal for water sports.', 0, '/images/havelock/hero.webp'),
  (3, 'Neil Island (Shaheed Dweep)', 'A smaller, quieter island known for its relaxed vibe, natural bridge formations, and beautiful beaches like Laxmanpur and Bharatpur.', 0, '/images/neil/hero.webp'),
  (4, 'Baratang Island', 'Known for its unique mangrove creeks, limestone caves, and mud volcanoes. Requires permits.', 1, '/images/baratang/hero.webp'),
  (5, 'Rangat', 'A tranquil town in Middle Andaman offering India''s longest mangrove boardwalk at Dhani Nallah, eco-parks like Amkunj Beach, and secluded turtle-nesting beaches.', 0, '/images/rangat/hero.webp'), -- Corrected: India''s
  (6, 'Mayabundar', 'The administrative hub of North & Middle Andaman, notable for its cultural mix of Karen and Bengali communities, turtle-nesting Karmatang Beach, and nearby mangrove creeks.', 0, '/images/mayabundar/hero.webp'),
  (7, 'Diglipur', 'The northern frontier town famed for the twin-islands of Ross & Smith, Saddle Peak National Park treks, limestone caves, mud volcanoes, and seasonal turtle nesting.', 0, '/images/diglipur/hero.webp'),
  (8, 'Little Andaman', 'A remote southern island known for Butler Bay surf breaks, pristine beaches, White Surf and Whisper Wave waterfalls, and lush rainforest trails.', 0, '/images/little-andaman/hero.webp');
  
-- =============================================
-- Service Providers
-- user_id 3 = scubavendor@example.com
-- user_id 4 = hotelvendor@example.com
-- =============================================
INSERT INTO service_providers (id, user_id, business_name, type, address, verified, bank_details) VALUES
  (1, 3, 'Andaman Scuba Experts', 'activity_provider', 'Beach No. 3, Havelock Island', 1, '{"account_no": "123", "ifsc": "ABC"}'),
  (2, 4, 'SeaShell Port Blair', 'hotel', 'Marine Hill, Port Blair', 1, '{"account_no": "456", "ifsc": "DEF"}'),
  (3, 3, 'Havelock Snorkeling Tours', 'activity_provider', 'Jetty Area, Havelock Island', 1, '{"account_no": "789", "ifsc": "GHI"}');

PRAGMA foreign_keys=ON; -- Re-enable FK checks

-- End of seed data