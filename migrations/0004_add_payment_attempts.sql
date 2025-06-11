CREATE TABLE IF NOT EXISTS payment_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    attempt_no INTEGER NOT NULL,
    mtid TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    amount_paise INTEGER NOT NULL,
    phonepe_status TEXT,
    phonepe_transaction_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE INDEX IF NOT EXISTS idx_attempt_booking ON payment_attempts(booking_id);


   INSERT INTO payment_attempts (booking_id, attempt_no, mtid, status, amount_paise)
   SELECT id, 1, 'LEGACY-' || id, payment_status, total_amount
   FROM bookings
   WHERE payment_status IN ('PAID','FAILED');
