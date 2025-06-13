-- Debug script to identify foreign key constraint issues

-- Check if required parent records exist
SELECT 'Roles check:' as debug_info;
SELECT COUNT(*) as role_count, 'roles in table' as description FROM roles;
SELECT id, name FROM roles ORDER BY id;

SELECT 'Users check:' as debug_info;  
SELECT COUNT(*) as user_count, 'users in table' as description FROM users;
SELECT id, email, role_id FROM users ORDER BY id;

-- Verify the specific foreign key references that might be failing
SELECT 'Checking role_id references:' as debug_info;
SELECT DISTINCT role_id FROM users WHERE role_id NOT IN (SELECT id FROM roles);

-- Test individual inserts to isolate the failing constraint
PRAGMA foreign_keys=ON;

-- Test role insert
SELECT 'Testing role insert...' as debug_info;
INSERT OR IGNORE INTO roles (id, name, description, permissions) VALUES
  (2, 'user', 'Regular user/traveler', 'basic');

-- Test user insert
SELECT 'Testing user insert...' as debug_info;  
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role_id) VALUES
  (2, 'testuser@example.com', '$2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S', 'Test', 'User', '9876543210', 2);

SELECT 'Final verification:' as debug_info;
SELECT id, email, role_id FROM users WHERE id = 2; 