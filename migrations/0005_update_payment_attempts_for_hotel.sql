-- Migration: Make booking_id nullable and add hold_id column to support hotel payment attempts
-- This migration recreates payment_attempts table because SQLite cannot drop NOT NULL constraints.
-- Safe for prod: existing rows are copied over.

-- D1 automatically wraps each migration statement in a transaction; explicit BEGIN/COMMIT are disallowed in workers environment.
PRAGMA foreign_keys=off;

-- 1. Rename old table
ALTER TABLE payment_attempts RENAME TO _payment_attempts_old;

-- 2. Re-create table with new schema
CREATE TABLE payment_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,                -- now nullable
    hold_id INTEGER,                   -- new: links to booking_holds.id (nullable)
    attempt_no INTEGER NOT NULL,
    mtid TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    amount_paise INTEGER NOT NULL,
    phonepe_status TEXT,
    phonepe_transaction_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (hold_id) REFERENCES booking_holds(id)
);

-- 3. Copy data
INSERT INTO payment_attempts (
    id, booking_id, attempt_no, mtid, status, amount_paise,
    phonepe_status, phonepe_transaction_id, created_at, updated_at
)
SELECT id, booking_id, attempt_no, mtid, status, amount_paise,
       phonepe_status, phonepe_transaction_id, created_at, updated_at
FROM _payment_attempts_old;

-- 4. Drop old table
DROP TABLE _payment_attempts_old;

-- 5. Re-create indexes
CREATE INDEX IF NOT EXISTS idx_attempt_booking ON payment_attempts(booking_id);
CREATE INDEX IF NOT EXISTS idx_attempt_hold    ON payment_attempts(hold_id);

PRAGMA foreign_keys=on;

-- 6. Back-fill legacy HOLD_ mtids (only if not already present)
INSERT OR IGNORE INTO payment_attempts (booking_id, hold_id, attempt_no, mtid, status, amount_paise)
SELECT NULL,
       CAST(SUBSTR(merchant_transaction_id, 6, INSTR(merchant_transaction_id,'_')-6) AS INTEGER),
       1,
       merchant_transaction_id,
       payment_status,
       ROUND(total_amount * 100)
FROM bookings
WHERE merchant_transaction_id LIKE 'HOLD_%'; 