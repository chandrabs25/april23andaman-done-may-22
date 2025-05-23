-- Drop tables if they exist (order matters less here due to IF EXISTS, but good practice)
DROP TABLE IF EXISTS hotel_seasonal_rates;
DROP TABLE IF EXISTS booking_services; -- Depends on hotel_room_types
DROP TABLE IF EXISTS hotel_room_types;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS ferry_schedules;
DROP TABLE IF EXISTS ferries;
DROP TABLE IF EXISTS permits;
DROP TABLE IF EXISTS bookings; -- Depends on package_categories
DROP TABLE IF EXISTS package_categories; -- Depends on packages
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS service_providers;
DROP TABLE IF EXISTS islands;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Table Definitions (Reordered for Correct FK Dependencies)

CREATE TABLE roles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT UNIQUE NOT NULL,
  description  TEXT,
  permissions  TEXT,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  first_name    TEXT,
  last_name     TEXT,
  phone         TEXT,
  role_id       INTEGER NOT NULL,
  profile_image TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE service_providers (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id                INTEGER NOT NULL,
  business_name          TEXT NOT NULL,
  type                   TEXT NOT NULL,
  license_no             TEXT,
  business_phone         TEXT,
  business_email         TEXT,
  address                TEXT,
  verified               INTEGER DEFAULT 0, -- Changed BOOLEAN to INTEGER
  verification_documents TEXT,
  bank_details           TEXT,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)
);

CREATE TABLE islands (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  description     TEXT,
  permit_required INTEGER DEFAULT 0, -- Changed BOOLEAN to INTEGER
  permit_details  TEXT,
  coordinates     TEXT,
  attractions     TEXT,
  activities      TEXT,
  images          TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  name                TEXT NOT NULL,
  description         TEXT,
  type                TEXT NOT NULL,
  provider_id         INTEGER NOT NULL,
  island_id           INTEGER NOT NULL,
  price               REAL NOT NULL,
  availability        TEXT,
  images              TEXT,
  amenities           TEXT,
  cancellation_policy TEXT,
  is_active           INTEGER DEFAULT 1, -- Changed BOOLEAN to INTEGER
  is_admin_approved   INTEGER DEFAULT 0, -- Changed BOOLEAN to INTEGER
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES service_providers(id),
  FOREIGN KEY (island_id)   REFERENCES islands(id)
);

CREATE TABLE packages (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  description       TEXT,
  duration          TEXT NOT NULL,
  base_price        REAL NOT NULL,
  max_people        INTEGER,
  created_by        INTEGER NOT NULL,
  is_active         INTEGER DEFAULT 1, -- Changed BOOLEAN to INTEGER
  itinerary         TEXT,
  included_services TEXT,
  images            TEXT,
  cancellation_policy TEXT,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE package_categories (
  id                        INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id                INTEGER NOT NULL,
  category_name             TEXT NOT NULL,
  price                     REAL NOT NULL,
  hotel_details             TEXT,
  category_description      TEXT,
  max_pax_included_in_price INTEGER,
  created_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id)  REFERENCES packages(id) ON DELETE CASCADE
);

CREATE TABLE hotels (
  service_id        INTEGER PRIMARY KEY,
  star_rating       INTEGER,
  room_types        TEXT,
  check_in_time     TEXT,
  check_out_time    TEXT,
  facilities        TEXT,
  policies          TEXT,
  extra_images      TEXT,
  total_rooms       INTEGER,
  street_address    TEXT,
  geo_lat           REAL,
  geo_lng           REAL,
  meal_plans        TEXT,
  pets_allowed      INTEGER DEFAULT 0, -- Changed BOOLEAN to INTEGER
  children_allowed  INTEGER DEFAULT 1, -- Changed BOOLEAN to INTEGER
  accessibility     TEXT,
  is_admin_approved INTEGER DEFAULT 0, -- Changed BOOLEAN to INTEGER
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE hotel_room_types (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id        INTEGER NOT NULL, -- Refers to the hotel's service_id (from services table)
  room_type         TEXT    NOT NULL,
  base_price        REAL    NOT NULL,
  max_guests        INTEGER NOT NULL,
  quantity          INTEGER NOT NULL,
  amenities         TEXT,
  extra_images      TEXT,
  is_admin_approved INTEGER DEFAULT 0, -- Changed BOOLEAN to INTEGER
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE -- This ensures it refers to an existing service (hotel)
);

CREATE TABLE hotel_seasonal_rates (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  room_type_id   INTEGER NOT NULL,
  season_name    TEXT    NOT NULL,
  start_date     DATE    NOT NULL,
  end_date       DATE    NOT NULL,
  price_modifier REAL    NOT NULL,
  price_override REAL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_type_id) REFERENCES hotel_room_types(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id               INTEGER,
  package_id            INTEGER,
  package_category_id   INTEGER,
  total_people          INTEGER NOT NULL,
  start_date            DATE NOT NULL,
  end_date              DATE NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending',
  total_amount          REAL NOT NULL,
  payment_status        TEXT NOT NULL DEFAULT 'pending',
  payment_details       TEXT,
  special_requests      TEXT,
  guest_name            TEXT,
  guest_email           TEXT,
  guest_phone           TEXT,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)             REFERENCES users(id),
  FOREIGN KEY (package_id)          REFERENCES packages(id),
  FOREIGN KEY (package_category_id) REFERENCES package_categories(id)
);

CREATE TABLE booking_services (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id          INTEGER NOT NULL,
  service_id          INTEGER NOT NULL,
  hotel_room_type_id  INTEGER, -- Nullable, for specific room type if service is a hotel
  quantity            INTEGER NOT NULL DEFAULT 1,
  price               REAL NOT NULL,
  date                DATE,
  status              TEXT NOT NULL DEFAULT 'confirmed',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (hotel_room_type_id) REFERENCES hotel_room_types(id) -- Now hotel_room_types is defined earlier
);

CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  rating     INTEGER NOT NULL,
  comment    TEXT,
  images     TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE ferries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  capacity    INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  amenities   TEXT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES service_providers(id)
);

CREATE TABLE ferry_schedules (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  ferry_id       INTEGER NOT NULL,
  origin_id      INTEGER NOT NULL,
  destination_id INTEGER NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time   DATETIME NOT NULL,
  availability   INTEGER NOT NULL,
  price          REAL NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ferry_id)       REFERENCES ferries(id),
  FOREIGN KEY (origin_id)      REFERENCES islands(id),
  FOREIGN KEY (destination_id) REFERENCES islands(id)
);

CREATE TABLE permits (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT NOT NULL,
  requirements TEXT,
  process      TEXT,
  duration     TEXT,
  cost         REAL,
  island_id    INTEGER NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (island_id) REFERENCES islands(id)
);

-- Indexes (Ensure these are created after all tables are defined)

CREATE INDEX idx_users_email                    ON users(email);
CREATE INDEX idx_users_role_id                  ON users(role_id);
CREATE INDEX idx_service_providers_user_id      ON service_providers(user_id);
CREATE INDEX idx_service_providers_type         ON service_providers(type);
CREATE INDEX idx_services_provider_id           ON services(provider_id);
CREATE INDEX idx_services_island_id             ON services(island_id);
CREATE INDEX idx_services_type                  ON services(type);
CREATE INDEX idx_packages_created_by            ON packages(created_by);
CREATE INDEX idx_package_categories_package_id  ON package_categories(package_id);
CREATE INDEX idx_bookings_user_id               ON bookings(user_id);
CREATE INDEX idx_bookings_package_id            ON bookings(package_id);
CREATE INDEX idx_bookings_package_category_id   ON bookings(package_category_id);
CREATE INDEX idx_bookings_status                ON bookings(status);
CREATE INDEX idx_bookings_guest_email           ON bookings(guest_email);
CREATE INDEX idx_booking_services_booking_id    ON booking_services(booking_id);
CREATE INDEX idx_booking_services_service_id    ON booking_services(service_id);
CREATE INDEX idx_booking_services_hotel_room_id ON booking_services(hotel_room_type_id);
CREATE INDEX idx_reviews_user_id                ON reviews(user_id);
CREATE INDEX idx_reviews_service_id             ON reviews(service_id);
CREATE INDEX idx_ferry_schedules_ferry_id       ON ferry_schedules(ferry_id);
CREATE INDEX idx_ferry_schedules_origin_id      ON ferry_schedules(origin_id);
CREATE INDEX idx_ferry_schedules_destination_id ON ferry_schedules(destination_id);
CREATE INDEX idx_permits_island_id              ON permits(island_id);
CREATE INDEX idx_hotels_service_id              ON hotels(service_id);
CREATE INDEX idx_room_types_service_id          ON hotel_room_types(service_id);
CREATE INDEX idx_seasonal_room_id               ON hotel_seasonal_rates(room_type_id);

-- Initial Data

INSERT INTO roles (name, description, permissions) VALUES
  ('admin',  'Administrator with full access', 'all'),
  ('user',   'Regular user / traveler',        'basic'),
  ('vendor', 'Service provider / vendor',      'vendor');

INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES
  ('admin@reachandaman.com','$2b$10$/McUJV1/0CQOVf6JXppp4.zyJn0A5VkdLTtADPQm8hw9NHHWCaZ0S','Admin','User',1);