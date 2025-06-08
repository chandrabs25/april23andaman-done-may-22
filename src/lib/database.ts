// src/lib/database.ts

import { getCloudflareContext } from '@opennextjs/cloudflare'
// Adjust the path to your CloudflareEnv type definition
// This typically comes from `wrangler types` or your manual definition
import type { CloudflareEnv } from '../../cloudflare-env'
import type { Hotel, Room, HotelFilters } from '../types/hotel'; // Adjusted path

// --- Interfaces (Define or import necessary data structures) ---

// Example Package interface (align with your schema)
interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  number_of_days?: number | null; // Added field for number of days
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number; // 0 or 1
  itinerary: string | null; // Raw TEXT/JSON string from DB
  included_services: string | null; // Raw TEXT/JSON string from DB
  images: string | null; // Raw TEXT/JSON string from DB
  cancellation_policy: string | null; // Added from schema
  created_at: string;
  updated_at: string;
}

// Interface for package filtering options
interface PackageFilters {
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  maxPeople?: number;
  isActive?: boolean;
  // Add other potential filters here if needed
}

// Interface for creating package categories (similar to API payload but for DB layer)
interface PackageCategoryDbPayload {
  package_id?: number; // Will be set after package creation
  category_name: string;
  price: number;
  hotel_details?: string | null;
  category_description?: string | null;
  max_pax_included_in_price?: number | null;
  images?: string | null; // Added for category images (JSON string)
  activities?: string | null; // Category-specific activities (JSON string)
  meals?: string | null; // Category-specific meals (JSON string)
  accommodation?: string | null; // Category-specific accommodation (JSON string)
}

interface CreatePackageDbPayload {
  name: string;
  description?: string | null;
  duration: string;
  number_of_days?: number | null; // Added field for number of days
  base_price: number;
  max_people?: number | null;
  created_by: number;
  itinerary?: string | object | null;
  included_services?: string | object | null;
  images?: string | object | null;
  cancellation_policy?: string | null;
  package_categories?: Omit<PackageCategoryDbPayload, 'package_id'>[]; // Categories to be created
}

// Define a custom type for D1Result with error for partial success cases
type D1ResultWithError = D1Result & { error: string };

// You might have other interfaces for Users, Islands, Services, etc.
// Define them here or import them if they are defined elsewhere.
// For brevity, only Package and PackageFilters are explicitly defined here,
// assuming others are inferred or defined elsewhere.

// --- Database Connection ---

let _db: CloudflareEnv['DB'] | undefined;

// Asynchronous function to get the D1 Database binding
export async function getDatabase(): Promise<CloudflareEnv['DB']> {
  if (_db) {
    console.log("🔍 [Database] Returning cached DB instance.");
    return _db;
  }

  console.log("🔍 [Database] Attempting to get Cloudflare context for DB...");
  try {
    // Fetch the async context which contains the environment variables including bindings
    const ctx = await getCloudflareContext<CloudflareEnv>({ async: true });
    const { env } = ctx;
    console.log("🔍 [Database] Cloudflare context obtained.");

    if (!env) {
      console.error("❌ [Database] Cloudflare environment is undefined.");
      throw new Error("Cloudflare environment is undefined. Check your open-next configuration.");
    }

    if (!env.DB) {
      console.error("❌ [Database] D1 binding 'DB' not found in Cloudflare environment.");
      throw new Error(
        "D1 binding 'DB' not found. Ensure it's configured in wrangler.toml and `npm run cf-typegen` was run."
      );
    }

    console.log("✅ [Database] D1 binding 'DB' found. Caching instance.");
    _db = env.DB;
    return _db;
  } catch (error) {
    console.error("❌ [Database] Error getting Cloudflare context or DB binding:", error);
    throw new Error(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Generic query function
export async function dbQuery(query: string, params: any[] = []): Promise<{ rows: any[], rowCount: number, success?: boolean, error?: string, meta?: any }> {
  const db = await getDatabase();
  try {
    const stmt = db.prepare(query).bind(...params);
    // For SELECT queries, .all() is typical. For INSERT/UPDATE/DELETE, .run() is typical.
    // We need to infer based on the query type, or the calling code needs to handle it.
    // Given the usage in API routes, they expect 'rows' and 'rowCount'.
    // .all() provides 'results' (rows) and 'success'/'meta'. .run() provides 'success'/'meta'.
    // Let's try to make it somewhat compatible.
    
    const queryType = query.trim().toUpperCase().split(" ")[0];

    if (queryType === "SELECT") {
      const result = await stmt.all();
      return { rows: result.results || [], rowCount: result.results?.length || 0, success: result.success, meta: result.meta };
    } else { // INSERT, UPDATE, DELETE
      const result = await stmt.run();
      // For INSERT returning id, D1 stores it in meta.last_row_id
      // The API routes expect 'rows' for RETURNING id.
      const returnedRows = result.meta?.last_row_id ? [{ id: result.meta.last_row_id }] : [];
      return { rows: returnedRows, rowCount: result.meta?.changes || 0, success: result.success, meta: result.meta };
    }
  } catch (e: any) {
    console.error("Error executing dbQuery:", e.message, "Query:", query, "Params:", params);
    return { rows: [], rowCount: 0, success: false, error: e.message };
  }
}

// --- Database Service Layer ---

/**
 * Service layer wrapping common D1 database operations.
 * Each method retrieves the database binding when called.
 */
export class DatabaseService {

  // Helper function to safely parse JSON strings
  private _parseJsonString(jsonString: string | null | undefined, defaultValue: string[] = []): string[] {
    if (jsonString === null || jsonString === undefined || typeof jsonString !== 'string' || jsonString.trim() === "") {
      return defaultValue;
    }
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
      // If parsed is a single string, wrap it in an array
      if (typeof parsed === 'string' && parsed.trim()) {
        return [parsed.trim()];
      }
      // If it's an array but not of strings, try to convert or return default
      if (Array.isArray(parsed)) {
        const stringArray = parsed.map(String).filter(Boolean);
        return stringArray.length > 0 ? stringArray : defaultValue;
      }
      // If it's some other type (number, boolean), convert to string and wrap in array
      if (parsed !== null && parsed !== undefined) {
        const strVal = String(parsed).trim();
        return strVal ? [strVal] : defaultValue;
      }
      return defaultValue;
    } catch (e) {
      // If JSON.parse fails, treat the original string as a single item or comma-separated list
      if (jsonString.includes(',')) {
        return jsonString.split(',').map(s => s.trim()).filter(Boolean);
      }
      // If not comma-separated, and not empty, treat as a single item array
      const trimmedString = jsonString.trim();
      if (trimmedString) {
        return [trimmedString];
      }
      return defaultValue;
    }
  }

  // --- User Methods ---
  async getUserByEmail(email: string) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  }

  async getUserById(id: number) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
  }

  async createUser(userData: {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string | null; // Allow null
    role_id: number;
  }) {
    const db = await getDatabase();
    return db
      .prepare(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.phone ?? null, // Ensure null is inserted if undefined
        userData.role_id
      )
      .run(); // Returns Promise<D1Result>
  }

  // --- Island Methods ---
  async getAllIslands() {
    const db = await getDatabase();
    // Returns Promise<D1Result<Island[]>> - Let the caller handle .results
    return db.prepare('SELECT * FROM islands ORDER BY name ASC').all();
  }

  async getIslandById(id: number) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM islands WHERE id = ?').bind(id).first();
  }

  // --- Service Methods ---
  async getServicesByIsland(islandId: number) {
    const db = await getDatabase();
    // Returns Promise<D1Result<Service[]>>
    return db
      .prepare('SELECT * FROM services WHERE island_id = ? ORDER BY name ASC')
      .bind(islandId)
      .all();
  }

  async getServiceById(id: number) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM services WHERE id = ?').bind(id).first();
  }

  async getServicesByProvider(providerId: number) {
    const db = await getDatabase();
    // Returns Promise<D1Result<Service[]>>
    return db
      .prepare('SELECT * FROM services WHERE provider_id = ? ORDER BY name ASC')
      .bind(providerId)
      .all();
  }

  /**
   * Creates a new service for a provider.
   * @param serviceData Data for the new service.
   * @returns Promise<D1Result>
   */
  async createService(serviceData: {
    name: string;
    description: string | null;
    type: string;
    provider_id: number;
    island_id: number; // Assuming island_id is required or handled
    price: number;
    availability: string | null; // JSON string
    images: string | null; // Comma-separated string or single URL
    amenities: string | null;
    cancellation_policy: string | null;
    is_active?: boolean; // Added is_active
  }) {
    const db = await getDatabase();
    return db
      .prepare(`
        INSERT INTO services (
          name, description, type, provider_id, island_id, price,
          availability, images, amenities, cancellation_policy, is_active,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      .bind(
        serviceData.name,
        serviceData.description,
        serviceData.type,
        serviceData.provider_id,
        serviceData.island_id, // Make sure this is provided or handled
        serviceData.price,
        serviceData.availability,
        serviceData.images,
        serviceData.amenities,
        serviceData.cancellation_policy,
        serviceData.is_active === undefined ? 1 : (serviceData.is_active ? 1 : 0) // Default to active (1)
      )
      .run();
  }

  /**
   * Updates an existing service.
   * @param serviceId The ID of the service to update.
   * @param serviceData The data to update.
   * @returns Promise<D1Result>
   */
  async updateService(serviceId: number, serviceData: {
    name: string;
    description: string | null;
    type: string;
    island_id: number; // Assuming island_id can be updated
    price: number;
    availability: string | null; // JSON string
    images: string | null;
    amenities: string | null;
    cancellation_policy: string | null;
  }) {
    const db = await getDatabase();
    return db
      .prepare(`
        UPDATE services SET
          name = ?, description = ?, type = ?, island_id = ?, price = ?,
          availability = ?, images = ?, amenities = ?, cancellation_policy = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(
        serviceData.name,
        serviceData.description,
        serviceData.type,
        serviceData.island_id,
        serviceData.price,
        serviceData.availability,
        serviceData.images,
        serviceData.amenities,
        serviceData.cancellation_policy,
        serviceId
      )
      .run();
  }

  /**
   * Deletes a service.
   * @param serviceId The ID of the service to delete.
   * @returns Promise<D1Result>
   */
  async deleteService(serviceId: number) {
    const db = await getDatabase();
    // Consider adding checks for related bookings before deleting
    return db.prepare('DELETE FROM services WHERE id = ?').bind(serviceId).run();
  }

  /**
   * Updates the active status of a service.
   * @param serviceId The ID of the service.
   * @param isActive The new active status (boolean).
   * @returns Promise<D1Result>
   */
  async updateServiceStatus(serviceId: number, isActive: boolean) {
    const db = await getDatabase();
    return db
      .prepare('UPDATE services SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?') // Tries to update 'is_active'
      .bind(isActive ? 1 : 0, serviceId)
      .run();
  }

  // --- Package Methods ---

  /**
   * Retrieves a list of active packages with optional filtering and pagination.
   * @param limit Max number of packages to return.
   * @param offset Number of packages to skip.
   * @param filters Optional filters for price, duration, maxPeople.
   * @returns Promise<D1Result<Package[]>>
   */
  async getAllActivePackages(limit = 10, offset = 0, filters: PackageFilters = {}) {
    const db = await getDatabase();
    let query = 'SELECT * FROM packages WHERE is_active = 1';
    const params: (string | number)[] = [];

    // Build WHERE clause dynamically based on filters
    const conditions: string[] = [];
    if (filters.minPrice !== undefined) {
      conditions.push(`base_price >= ?`);
      params.push(filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(`base_price <= ?`);
      params.push(filters.maxPrice);
    }
    if (filters.duration) {
      conditions.push(`duration = ?`);
      params.push(filters.duration);
    }
    if (filters.maxPeople !== undefined) {
      // Filter packages suitable FOR AT LEAST this many people
      conditions.push(`(max_people IS NULL OR max_people >= ?)`);
      params.push(filters.maxPeople);
    }

    if (conditions.length > 0) {
      query += ' AND (' + conditions.join(' AND ') + ')'; // Group filters
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Return the D1Result object directly
    return db.prepare(query).bind(...params).all<Package>();
  }

  /**
   * Retrieves a list of all packages (both active and inactive) with optional filtering and pagination.
   * Used primarily by admin interfaces.
   * @param limit Max number of packages to return.
   * @param offset Number of packages to skip.
   * @param filters Optional filters for price, duration, maxPeople, isActive.
   * @returns Promise<D1Result<Package[]>>
   */
  async getAllPackages(limit = 10, offset = 0, filters: PackageFilters = {}) {
    const db = await getDatabase();
    let query = 'SELECT * FROM packages';
    const params: (string | number | boolean)[] = [];

    // Build WHERE clause dynamically based on filters
    const conditions: string[] = [];
    if (filters.minPrice !== undefined) {
      conditions.push(`base_price >= ?`);
      params.push(filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(`base_price <= ?`);
      params.push(filters.maxPrice);
    }
    if (filters.duration) {
      conditions.push(`duration = ?`);
      params.push(filters.duration);
    }
    if (filters.maxPeople !== undefined) {
      // Filter packages suitable FOR AT LEAST this many people
      conditions.push(`(max_people IS NULL OR max_people >= ?)`);
      params.push(filters.maxPeople);
    }
    if (filters.isActive !== undefined) {
      conditions.push(`is_active = ?`);
      params.push(filters.isActive ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND '); // Group filters
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Return the D1Result object directly
    return db.prepare(query).bind(...params).all<Package>();
  }

  /**
   * Counts the total number of active packages, applying optional filters.
   * @param filters Optional filters for price, duration, maxPeople.
   * @returns Promise<{ total: number } | null>
   */
  async countAllActivePackages(filters: PackageFilters = {}) {
    const db = await getDatabase();
    let query = 'SELECT COUNT(*) AS total FROM packages WHERE is_active = 1';
    const params: (string | number)[] = [];

    // Build WHERE clause dynamically based on filters (same logic as getAllActivePackages)
    const conditions: string[] = [];
    if (filters.minPrice !== undefined) {
      conditions.push(`base_price >= ?`);
      params.push(filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(`base_price <= ?`);
      params.push(filters.maxPrice);
    }
    if (filters.duration) {
      conditions.push(`duration = ?`);
      params.push(filters.duration);
    }
    if (filters.maxPeople !== undefined) {
      conditions.push(`(max_people IS NULL OR max_people >= ?)`);
      params.push(filters.maxPeople);
    }

    if (conditions.length > 0) {
      query += ' AND (' + conditions.join(' AND ') + ')'; // Group filters
    }

    // Use .first() to get the count object
    return db.prepare(query).bind(...params).first<{ total: number }>(); // Returns { total: number } or null
  }

  /**
   * Counts the total number of all packages (both active and inactive), applying optional filters.
   * Used primarily by admin interfaces.
   * @param filters Optional filters for price, duration, maxPeople, isActive.
   * @returns Promise<{ total: number } | null>
   */
  async countAllPackages(filters: PackageFilters = {}) {
    const db = await getDatabase();
    let query = 'SELECT COUNT(*) AS total FROM packages';
    const params: (string | number | boolean)[] = [];

    // Build WHERE clause dynamically based on filters
    const conditions: string[] = [];
    if (filters.minPrice !== undefined) {
      conditions.push(`base_price >= ?`);
      params.push(filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(`base_price <= ?`);
      params.push(filters.maxPrice);
    }
    if (filters.duration) {
      conditions.push(`duration = ?`);
      params.push(filters.duration);
    }
    if (filters.maxPeople !== undefined) {
      conditions.push(`(max_people IS NULL OR max_people >= ?)`);
      params.push(filters.maxPeople);
    }
    if (filters.isActive !== undefined) {
      conditions.push(`is_active = ?`);
      params.push(filters.isActive ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND '); // Group filters
    }

    // Use .first() to get the count object
    return db.prepare(query).bind(...params).first<{ total: number }>();
  }

  /**
   * Retrieves a single active package by its ID.
   * @param id The ID of the package.
   * @returns Promise<Package | null>
   */
  async getPackageById(id: number) {
    const db = await getDatabase();
    return db
      .prepare('SELECT * FROM packages WHERE id = ? AND is_active = 1')
      .bind(id)
      .first<Package>(); // Returns the package object or null
  }

  /**
   * Retrieves all categories for a specific package.
   * @param packageId The ID of the package.
   * @returns Promise<D1Result<any[]>> - Categories for the package
   */
  async getPackageCategories(packageId: number) {
    const db = await getDatabase();
    return db
      .prepare(`
        SELECT id, package_id, category_name, price, hotel_details, 
               category_description, max_pax_included_in_price, images,
               activities, meals, accommodation, created_at, updated_at
        FROM package_categories
        WHERE package_id = ?
        ORDER BY price ASC
      `)
      .bind(packageId)
      .all();
  }

  /**
  * Creates a new package in the database.
  * @param packageData Data for the new package.
  * @returns Promise<D1Result>
  */
  async createPackage(packageData: CreatePackageDbPayload): Promise<
    (D1Result & { meta: { last_row_id: number } }) |
    (D1ResultWithError & { meta: { last_row_id: number } }) |
    { success: false; error: string; meta: D1Meta | {} }
  > {
    const db = await getDatabase();
    // Define emptyMeta with only known D1Meta properties
    const emptyMeta: D1Meta = {
      duration: 0,
      last_row_id: 0,
      changes: 0,
      rows_read: 0,
      rows_written: 0,
      size_after: 0,
      changed_db: false
    };

    const stringifyIfNeeded = (data: any, fieldName: string): string | null => {
      if (data === null || data === undefined) return null;
      if (typeof data === 'string') return data.trim() || null;
      if (typeof data === 'object') {
        try {
          return JSON.stringify(data);
        } catch (e) {
          console.warn(`Could not stringify ${fieldName}:`, e);
          return null;
        }
      }
      return String(data).trim() || null;
    };
    
    const itineraryStr = stringifyIfNeeded(packageData.itinerary, 'itinerary');
    const includedServicesStr = stringifyIfNeeded(packageData.included_services, 'included_services');
    const imagesStr = stringifyIfNeeded(packageData.images, 'images');

    const mainPackageInsertStmt = db.prepare(`
      INSERT INTO packages (
        name, description, duration, number_of_days, base_price, max_people, created_by,
        itinerary, included_services, images, cancellation_policy, is_active, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      packageData.name,
      packageData.description ?? null,
      packageData.duration,
      packageData.number_of_days ?? null,
      packageData.base_price,
      packageData.max_people ?? null,
      packageData.created_by,
      itineraryStr,
      includedServicesStr,
      imagesStr,
      packageData.cancellation_policy ?? null
    );

    if (!packageData.package_categories || packageData.package_categories.length === 0) {
      try {
        const result = await mainPackageInsertStmt.run();
        if (!result.success || !result.meta?.last_row_id) {
          const errorMsg = result.error || "Failed to create package or get last_row_id";
          console.error("D1 Error creating package (no categories):", errorMsg);
          return { success: false, error: errorMsg, meta: result.meta || emptyMeta };
        }
        // Explicitly cast to ensure last_row_id is seen by TS
        return result as (D1Result & { meta: { last_row_id: number } });
      } catch (e: any) {
        console.error("Error creating package (no categories):", e);
        return { success: false, error: e.message || "Unknown database error", meta: emptyMeta };
      }
    }

    try {
      const packageResult = await mainPackageInsertStmt.run();
      if (!packageResult.success || !packageResult.meta?.last_row_id) {
        const errorMsg = packageResult.error || "Failed to create main package or get last_row_id";
        console.error("D1 Error creating main package for categories:", errorMsg);
        return { success: false, error: errorMsg, meta: packageResult.meta || emptyMeta };
      }

      const packageId = packageResult.meta.last_row_id;
      const categoryStatements = packageData.package_categories.map(cat => {
        // Assuming cat.images is already a JSON string or null from the API layer
        // If it could be an array here, stringifyIfNeeded(cat.images, 'category_images') would be used.
        const categoryImagesStr = typeof cat.images === 'string' ? cat.images : (cat.images ? JSON.stringify(cat.images) : null);
        const categoryActivitiesStr = typeof cat.activities === 'string' ? cat.activities : (cat.activities ? JSON.stringify(cat.activities) : null);
        const categoryMealsStr = typeof cat.meals === 'string' ? cat.meals : (cat.meals ? JSON.stringify(cat.meals) : null);
        const categoryAccommodationStr = typeof cat.accommodation === 'string' ? cat.accommodation : (cat.accommodation ? JSON.stringify(cat.accommodation) : null);

        return db.prepare(`
          INSERT INTO package_categories (
            package_id, category_name, price, hotel_details, 
            category_description, max_pax_included_in_price, images, 
            activities, meals, accommodation, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
          packageId,
          cat.category_name,
          cat.price,
          cat.hotel_details ?? null,
          cat.category_description ?? null,
          cat.max_pax_included_in_price ?? null,
          categoryImagesStr, // Use the potentially stringified images string
          categoryActivitiesStr,
          categoryMealsStr,
          categoryAccommodationStr
        );
      });

      if (categoryStatements.length > 0) {
        const categoryResults = await db.batch(categoryStatements);
        const allCategoriesSuccessful = categoryResults.every((res: D1Result) => res.success);
        if (!allCategoriesSuccessful) {
          console.error("One or more package categories failed to insert for package ID:", packageId, categoryResults);
          // Return a result that indicates partial success - package created but categories failed
          // This is a custom type that extends D1Result with an error field
          return {
            success: true, // Package was created successfully
            meta: packageResult.meta, // Include the meta with last_row_id
            error: "Package created, but some categories failed to insert.",
            results: [] // D1Result expects a results array
          } as D1ResultWithError & { meta: { last_row_id: number } };
        }
      }
      return packageResult as (D1Result & { meta: { last_row_id: number } });

    } catch (e: any) {
      console.error("Error in createPackage with categories:", e);
      return { success: false, error: e.message || "Unknown database error during package/category creation", meta: emptyMeta };
    }
  }

  private async _updatePackageAndCategories(
    packageId: number,
    packageData: Omit<CreatePackageDbPayload, 'created_by'> & { is_active?: number }
  ): Promise<D1Result | D1ResultWithError | { success: false; error: string; meta: D1Meta | {} }> {
    const db = await getDatabase();
    const statements: D1PreparedStatement[] = [];
    const emptyMeta: D1Meta = {
      duration: 0,
      last_row_id: 0,
      changes: 0,
      rows_read: 0,
      rows_written: 0,
      size_after: 0,
      changed_db: false
    };

    const stringifyIfNeeded = (data: any, fieldName: string): string | null => {
      if (data === null || data === undefined) return null;
      if (typeof data === 'string') return data.trim() || null;
      if (typeof data === 'object') {
        try { return JSON.stringify(data); }
        catch (e) { console.warn(`Could not stringify ${fieldName}:`, e); return null; }
      }
      return String(data).trim() || null;
    };

    const itineraryStr = stringifyIfNeeded(packageData.itinerary, 'itinerary');
    const includedServicesStr = stringifyIfNeeded(packageData.included_services, 'included_services');
    const imagesStr = stringifyIfNeeded(packageData.images, 'images');

    // 1. Update the main package
    const packageUpdateStmt = db.prepare(`
      UPDATE packages SET
        name = ?, description = ?, duration = ?, number_of_days = ?, base_price = ?, max_people = ?,
        itinerary = ?, included_services = ?, images = ?, cancellation_policy = ?,
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      packageData.name,
      packageData.description ?? null,
      packageData.duration,
      packageData.number_of_days ?? null,
      packageData.base_price,
      packageData.max_people ?? null,
      itineraryStr,
      includedServicesStr,
      imagesStr,
      packageData.cancellation_policy ?? null,
      packageData.is_active === undefined ? 1 : packageData.is_active,
      packageId
    );
    statements.push(packageUpdateStmt);

    // 2. Handle package categories more carefully to avoid foreign key constraint violations
    if (packageData.package_categories && packageData.package_categories.length > 0) {
      try {
        // First, get existing categories to see which ones we can update vs. which need to be created
        const existingCategoriesResult = await db.prepare(`SELECT id, category_name FROM package_categories WHERE package_id = ?`).bind(packageId).all();
        const existingCategories = existingCategoriesResult.results || [];
        
        // Check if there are any bookings that reference existing categories
        const bookingsCheckResult = await db.prepare(`
          SELECT COUNT(*) as count FROM bookings 
          WHERE package_category_id IN (SELECT id FROM package_categories WHERE package_id = ?)
        `).bind(packageId).first();
        
        const hasBookings = (bookingsCheckResult as any)?.count > 0;
        
        if (hasBookings && existingCategories.length > 0) {
          // There are existing bookings, so we need to be careful about category updates
          // Update existing categories in place and add new ones as needed
          
          packageData.package_categories.forEach((cat, index) => {
            const categoryImagesStr = typeof cat.images === 'string' ? cat.images : (cat.images ? JSON.stringify(cat.images) : null);
            
            const categoryActivitiesStr = typeof cat.activities === 'string' ? cat.activities : (cat.activities ? JSON.stringify(cat.activities) : null);
            const categoryMealsStr = typeof cat.meals === 'string' ? cat.meals : (cat.meals ? JSON.stringify(cat.meals) : null);
            const categoryAccommodationStr = typeof cat.accommodation === 'string' ? cat.accommodation : (cat.accommodation ? JSON.stringify(cat.accommodation) : null);

            if (index < existingCategories.length) {
              // Update existing category
              const existingCategoryId = (existingCategories[index] as any).id;
              statements.push(
                db.prepare(`
                  UPDATE package_categories SET
                    category_name = ?, price = ?, hotel_details = ?, 
                    category_description = ?, max_pax_included_in_price = ?, images = ?,
                    activities = ?, meals = ?, accommodation = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?
                `).bind(
                  cat.category_name,
                  cat.price,
                  cat.hotel_details ?? null,
                  cat.category_description ?? null,
                  cat.max_pax_included_in_price ?? null,
                  categoryImagesStr,
                  categoryActivitiesStr,
                  categoryMealsStr,
                  categoryAccommodationStr,
                  existingCategoryId
                )
              );
            } else {
              // Insert new category
              statements.push(
                db.prepare(`
                  INSERT INTO package_categories (
                    package_id, category_name, price, hotel_details, 
                    category_description, max_pax_included_in_price, images,
                    activities, meals, accommodation, created_at, updated_at
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `).bind(
                  packageId,
                  cat.category_name,
                  cat.price,
                  cat.hotel_details ?? null,
                  cat.category_description ?? null,
                  cat.max_pax_included_in_price ?? null,
                  categoryImagesStr,
                  categoryActivitiesStr,
                  categoryMealsStr,
                  categoryAccommodationStr
                )
              );
            }
          });

          // If we have fewer new categories than existing ones, deactivate the extras
          // (Don't delete them due to foreign key constraints)
          if (packageData.package_categories.length < existingCategories.length) {
            for (let i = packageData.package_categories.length; i < existingCategories.length; i++) {
              const extraCategoryId = (existingCategories[i] as any).id;
              statements.push(
                db.prepare(`
                  UPDATE package_categories SET
                    category_name = '[REMOVED] ' || category_name, 
                    price = 0, 
                    updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?
                `).bind(extraCategoryId)
              );
            }
          }
        } else {
          // No existing bookings, safe to delete and recreate
          const deleteCategoriesStmt = db.prepare(`DELETE FROM package_categories WHERE package_id = ?`).bind(packageId);
          statements.push(deleteCategoriesStmt);
          
          packageData.package_categories.forEach(cat => {
            const categoryImagesStr = typeof cat.images === 'string' ? cat.images : (cat.images ? JSON.stringify(cat.images) : null);
            const categoryActivitiesStr = typeof cat.activities === 'string' ? cat.activities : (cat.activities ? JSON.stringify(cat.activities) : null);
            const categoryMealsStr = typeof cat.meals === 'string' ? cat.meals : (cat.meals ? JSON.stringify(cat.meals) : null);
            const categoryAccommodationStr = typeof cat.accommodation === 'string' ? cat.accommodation : (cat.accommodation ? JSON.stringify(cat.accommodation) : null);
            
            statements.push(
              db.prepare(`
                INSERT INTO package_categories (
                  package_id, category_name, price, hotel_details, 
                  category_description, max_pax_included_in_price, images,
                  activities, meals, accommodation, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              `).bind(
                packageId,
                cat.category_name,
                cat.price,
                cat.hotel_details ?? null,
                cat.category_description ?? null,
                cat.max_pax_included_in_price ?? null,
                categoryImagesStr,
                categoryActivitiesStr,
                categoryMealsStr,
                categoryAccommodationStr
              )
            );
          });
        }
      } catch (dbError: any) {
        console.error("Error checking existing categories and bookings:", dbError);
        return { success: false, error: "Failed to check existing data: " + (dbError.message || "Unknown error"), meta: emptyMeta };
      }
    }

    try {
      const results = await db.batch(statements);
      const allSuccessful = results.every((res: D1Result) => res.success);
      if (!allSuccessful) {
        console.error("Error during batch update of package and categories for package ID:", packageId, results);
        const firstErrorResult = results.find((res: D1Result) => !res.success);
        return { success: false, error: (firstErrorResult?.error as string) || "Batch update failed for package and categories", meta: firstErrorResult?.meta || emptyMeta };
      }
      // Assuming batch of updates/deletes/inserts returns D1Result for each, sum changes for a meaningful meta
      const totalChanges = results.reduce((acc: number, r: D1Result) => acc + (r.meta?.changes || 0), 0);
      // Find the meta from the first operation (package update) or use a generic success meta for batch
      const representativeMeta = results.length > 0 && results[0].meta ? results[0].meta : emptyMeta;
      return { success: true, meta: { ...representativeMeta, changes: totalChanges }, results: [] } as D1Result;
    } catch (e: any) {
      console.error("Error updating package and categories:", e);
      return { success: false, error: e.message || "Unknown database error during package/category update", meta: emptyMeta };
    }
  }
  
  async updatePackage(
    packageId: number,
    packageData: Omit<CreatePackageDbPayload, 'created_by'> & { is_active?: number }
  ): Promise<D1Result | D1ResultWithError | { success: false; error: string; meta: D1Meta | {} }> {
    return this._updatePackageAndCategories(packageId, packageData);
  }

  /**
   * Deletes a package and its associated categories from the database.
   * @param packageId The ID of the package to delete.
   * @returns Promise<{ success: boolean; error?: string }>
   */
  async deletePackage(packageId: number): Promise<{ success: boolean; error?: string }> {
    const db = await getDatabase();
    try {
      // Statement to delete package categories
      const deleteCategoriesStmt = db.prepare(
        'DELETE FROM package_categories WHERE package_id = ?'
      );

      // Statement to delete the package itself
      const deletePackageStmt = db.prepare('DELETE FROM packages WHERE id = ?');

      // Execute in batch (simulates a transaction for D1)
      // D1 batch operations are atomic: either all succeed or all fail.
      const results = await db.batch([
        deleteCategoriesStmt.bind(packageId),
        deletePackageStmt.bind(packageId),
      ]);

      // Check if all operations in the batch were successful
      // D1Result itself has a 'success' boolean. For batch, each result in the array has one.
      const allSuccessful = results.every((res: { success: any; }) => res.success);

      if (allSuccessful) {
        // Check if the package was actually deleted (optional, but good for confirmation)
        // The second result in the batch is for the packages table deletion.
        const packageDeletionMeta = results[1]?.meta;
        if (packageDeletionMeta && packageDeletionMeta.changes > 0) {
          return { success: true };
        } else if (packageDeletionMeta && packageDeletionMeta.changes === 0) {
          // This means the package_categories might have been deleted (or none existed),
          // but the package itself was not found.
          return { success: false, error: 'Package not found or already deleted.' };
        }
        // If meta is undefined for some reason but allSuccessful was true
        return { success: true };
      } else {
        // Find the first error
        const firstErrorResult = results.find((res: { success: any; }) => !res.success);
        const errorMessage = firstErrorResult?.error || 'One or more deletion operations failed.';
        console.error(`Error deleting package ${packageId}:`, results);
        return { success: false, error: errorMessage };
      }
    } catch (e: any) {
      console.error(`Exception during deletePackage for packageId ${packageId}:`, e);
      return { success: false, error: e.message || 'Unknown database error during package deletion.' };
    }
  }

  // --- Booking Methods ---
  async createBooking(bookingData: {
    user_id: number | null; // Nullable for guest bookings
    package_id?: number | null; // Optional package ID
    total_people: number;
    start_date: string; // Format: 'YYYY-MM-DD'
    end_date: string;   // Format: 'YYYY-MM-DD'
    total_amount: number;
    special_requests?: string | null;
    guest_name?: string | null;
    guest_email?: string | null;
    guest_phone?: string | null;
  }) {
    const db = await getDatabase();
    return db
      .prepare(
        `
        INSERT INTO bookings (
          user_id, package_id, total_people, start_date, end_date, total_amount,
          status, payment_status, special_requests, guest_name, guest_email,
          guest_phone, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )`
      )
      .bind(
        bookingData.user_id, // Can be null
        bookingData.package_id ?? null,
        bookingData.total_people,
        bookingData.start_date,
        bookingData.end_date,
        bookingData.total_amount,
        bookingData.special_requests ?? null,
        bookingData.guest_name ?? null,
        bookingData.guest_email ?? null,
        bookingData.guest_phone ?? null
      )
      .run(); // Returns Promise<D1Result>
  }

  async getBookingById(id: number) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
  }

  async getBookingsByUser(userId: number) {
    const db = await getDatabase();
    // Returns Promise<D1Result<Booking[]>>
    return db
      .prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY start_date DESC')
      .bind(userId)
      .all();
  }

  async updateBookingPaymentStatus(
    bookingId: number,
    paymentStatus: string, // e.g., 'paid', 'failed'
    paymentDetails: string | null // e.g., transaction ID, error message
  ) {
    const db = await getDatabase();
    return db
      .prepare(
        'UPDATE bookings SET payment_status = ?, payment_details = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      )
      .bind(paymentStatus, paymentDetails, bookingId)
      .run(); // Returns Promise<D1Result>
  }

  // --- Review Methods ---
  async createReview(reviewData: {
    user_id: number;
    service_id: number; // Assuming reviews are linked to specific services
    rating: number; // e.g., 1-5
    comment?: string | null;
    images?: string | null; // JSON array of image URLs?
  }) {
    const db = await getDatabase();
    return db
      .prepare(
        'INSERT INTO reviews (user_id, service_id, rating, comment, images, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      )
      .bind(
        reviewData.user_id,
        reviewData.service_id,
        reviewData.rating,
        reviewData.comment ?? null,
        reviewData.images ?? null // Ensure JSON is stringified if needed before calling
      )
      .run(); // Returns Promise<D1Result>
  }

  async getReviewsByService(serviceId: number) {
    const db = await getDatabase();
    // Join with users table to get reviewer's name
    // Returns Promise<D1Result<ReviewWithUser[]>>
    return db
      .prepare(`
        SELECT r.id, r.rating, r.comment, r.images, r.created_at, u.first_name, u.last_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.service_id = ?
        ORDER BY r.created_at DESC
      `)
      .bind(serviceId)
      .all();
  }

  // --- PhonePe Specific Booking Methods ---
  async createInitialPhonePeBooking(bookingData: {
    package_id: number | null;
    package_category_id: number | null;
    user_id: number | null;
    total_amount: number;
    guest_name: string | null;
    guest_email: string | null;
    guest_phone: string | null;
    start_date: string;
    end_date: string;
    total_people: number;
    special_requests: string | null;
  }) {
    const db = await getDatabase();
    return db
      .prepare(
        `INSERT INTO bookings (
          package_id, package_category_id, user_id, total_amount, 
          status, payment_status, 
          guest_name, guest_email, guest_phone, 
          start_date, end_date, total_people, special_requests,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'PENDING_PAYMENT', 'INITIATED', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .bind(
        bookingData.package_id,
        bookingData.package_category_id,
        bookingData.user_id,
        bookingData.total_amount,
        bookingData.guest_name,
        bookingData.guest_email,
        bookingData.guest_phone,
        bookingData.start_date,
        bookingData.end_date,
        bookingData.total_people,
        bookingData.special_requests
      )
      .run(); // Returns Promise<D1Result> which includes meta.last_row_id
  }

  async updateBookingStatusAndPaymentStatus(
    bookingId: string, // Assuming bookingId from D1 (last_row_id) will be a number, but API might pass string
    status: string,
    paymentStatus: string,
    providerReferenceId?: string | null // Optional: to store PhonePe's own transaction ID
  ) {
    const db = await getDatabase();
    let query = 'UPDATE bookings SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP';
    const params: (string | number | null)[] = [status, paymentStatus];

    if (providerReferenceId !== undefined) {
      query += ', provider_reference_id = ?';
      params.push(providerReferenceId);
    }
    
    query += ' WHERE id = ?';
    params.push(parseInt(bookingId, 10)); // Ensure bookingId is a number for the query

    return db
      .prepare(query)
      .bind(...params)
      .run();
  }
  // End PhonePe Specific Booking Methods
  
  /**
   * Retrieves reviews for all services belonging to a specific vendor (user).
   * @param userId The user ID of the vendor.
   * @param limit Max number of reviews to return.
   * @returns Promise<D1Result<ReviewWithUser[]>>
   */
  async getReviewsForVendor(userId: number, limit = 3) {
    const db = await getDatabase();
    // Join reviews -> services -> service_providers -> users
    // Assumes reviews are linked to services, and services to providers, and providers to users.
    return db
      .prepare(`
        SELECT r.id, r.rating, r.comment, r.images, r.created_at,
               u_reviewer.first_name AS customerName, -- User who wrote the review
               s.name AS serviceName
        FROM reviews r
        JOIN services s ON r.service_id = s.id
        JOIN service_providers sp ON s.provider_id = sp.id
        JOIN users u_reviewer ON r.user_id = u_reviewer.id
        WHERE sp.user_id = ?
        ORDER BY r.created_at DESC
        LIMIT ?
      `)
      .bind(userId, limit)
      .all(); // Adjust the expected return type if needed
  }


  // --- Ferry Methods ---
  async getFerrySchedules(
    originId: number,
    destinationId: number,
    date: string // Format: 'YYYY-MM-DD'
  ) {
    const db = await getDatabase();
    // Join with ferries table to get ferry name
    // Returns Promise<D1Result<FerrySchedule[]>>
    return db
      .prepare(`
        SELECT fs.id, fs.departure_time, fs.arrival_time, fs.availability, fs.price, f.name AS ferry_name
        FROM ferry_schedules fs
        JOIN ferries f ON fs.ferry_id = f.id
        WHERE fs.origin_id = ? AND fs.destination_id = ? AND DATE(fs.departure_time) = ?
        ORDER BY fs.departure_time
      `)
      .bind(originId, destinationId, date)
      .all();
  }

  // --- Service Provider Methods ---
  async getServiceProviderByUserId(userId: number) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM service_providers WHERE user_id = ?').bind(userId).first();
  }

  async getServiceProviderById(providerId: number) {
    const db = await getDatabase();
    return db.prepare('SELECT * FROM service_providers WHERE id = ?').bind(providerId).first();
  }

  async createServiceProvider(providerData: {
    user_id: number;
    business_name: string;
    type: string; // This parameter receives the businessType from the API
    license_no?: string | null;
    address?: string | null;
    verification_documents?: string | null;
    bank_details?: string | null;
  }) {
    const db = await getDatabase();
    return db
      .prepare(`
        INSERT INTO service_providers (
          user_id, business_name, type, license_no, address, verified,
          verification_documents, bank_details, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, 0, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )`
      ) // verified defaults to 0 (false)
      .bind(
        providerData.user_id,
        providerData.business_name,
        providerData.type, // The value passed here is inserted into the 'type' column
        providerData.license_no ?? null,
        providerData.address ?? null,
        providerData.verification_documents ?? null,
        providerData.bank_details ?? null
      )
      .run(); // Returns Promise<D1Result>
  }

  /**
   * Calculates statistics for a specific vendor.
   * @param userId The user ID of the vendor.
   * @returns Promise<{ totalServices: number; activeBookings: number; totalEarnings: number; reviewScore: number | null }>
   */
  async getVendorStats(userId: number) {
    const db = await getDatabase();

    // 1. Get Provider ID
    const provider = await this.getServiceProviderByUserId(userId);
    if (!provider) {
      throw new Error('Vendor not found');
    }
    const providerId = provider.id;

    // 2. Get Total Services
    const servicesCountResult = await db
      .prepare('SELECT COUNT(*) as count FROM services WHERE provider_id = ?')
      .bind(providerId)
      .first<{ count: number }>();
    const totalServices = servicesCountResult?.count ?? 0;

    // 3. Get Active Bookings (Requires joining through services/packages)
    // This query assumes bookings are linked via packages created by the user OR services linked to the provider
    // Adjust join logic based on your exact schema relationship (package vs service booking)
    // Using 'confirmed' or 'pending' as active statuses.
    const activeBookingsResult = await db
      .prepare(`
        SELECT COUNT(b.id) as count
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        LEFT JOIN booking_services bs ON b.id = bs.booking_id -- If bookings can contain individual services
        LEFT JOIN services s ON bs.service_id = s.id
        WHERE (p.created_by = ? OR s.provider_id = ?)
          AND b.status IN ('pending', 'confirmed')
      `)
      .bind(userId, providerId) // Check package creator OR service provider
      .first<{ count: number }>();
    const activeBookings = activeBookingsResult?.count ?? 0;


    // 4. Get Total Earnings (Sum net amount from completed/confirmed bookings)
    // Adjust status and amount field (total_amount vs net_amount) as needed
    const totalEarningsResult = await db
      .prepare(`
        SELECT SUM(b.total_amount) as total -- Use total_amount or a calculated net_amount if available
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        LEFT JOIN booking_services bs ON b.id = bs.booking_id
        LEFT JOIN services s ON bs.service_id = s.id
        WHERE (p.created_by = ? OR s.provider_id = ?)
          AND b.status IN ('completed', 'confirmed') -- Consider which statuses count towards earnings
          AND b.payment_status = 'paid' -- Ensure payment was successful
      `)
      .bind(userId, providerId)
      .first<{ total: number | null }>();
    const totalEarnings = totalEarningsResult?.total ?? 0;

    // 5. Get Average Review Score
    const reviewScoreResult = await db
      .prepare(`
        SELECT AVG(r.rating) as average
        FROM reviews r
        JOIN services s ON r.service_id = s.id
        WHERE s.provider_id = ?
      `)
      .bind(providerId)
      .first<{ average: number | null }>();
    const reviewScore = reviewScoreResult?.average ?? null;


    return {
      totalServices,
      activeBookings,
      totalEarnings,
      reviewScore,
    };
  }

  /**
   * Retrieves bookings associated with a vendor's services or packages.
   * @param userId The user ID of the vendor.
   * @param limit Max number of bookings to return.
   * @returns Promise<D1Result<any[]>> - Define a specific Booking type later
   */
  async getBookingsForVendor(userId: number, limit = 5) {
    const db = await getDatabase();
    // This query needs refinement based on how bookings relate to vendors.
    // Option A: Bookings for packages created by the vendor user.
    // Option B: Bookings containing services offered by the vendor provider.
    // This example combines both, adjust as needed.
    // It also tries to get customer name (if registered user) or guest name.
    return db
      .prepare(`
        SELECT
          b.id,
          COALESCE(p.name, s.name, 'Service/Package') AS serviceOrPackageName, -- Get name from package or service
          COALESCE(u.first_name || ' ' || u.last_name, b.guest_name, 'Guest') AS customerName,
          b.start_date,
          b.end_date,
          b.total_people,
          b.total_amount,
          b.total_amount AS net_amount, -- Placeholder for net amount, calculate if needed
          b.status
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id -- Join to get registered customer name
        LEFT JOIN packages p ON b.package_id = p.id AND p.created_by = ? -- Link via package creator
        LEFT JOIN booking_services bs ON b.id = bs.booking_id -- Link via booked services
        LEFT JOIN services s ON bs.service_id = s.id
        LEFT JOIN service_providers sp ON s.provider_id = sp.id AND sp.user_id = ? -- Link via service provider
        WHERE p.created_by = ? OR sp.user_id = ? -- Filter bookings linked to this vendor user
        ORDER BY b.created_at DESC
        LIMIT ?
      `)
      .bind(userId, userId, userId, userId, limit) // Bind userId multiple times as needed by the query
      .all();
  }


  // --- Admin Methods ---

  /**
   * Retrieves all service providers, optionally filtering by verification status.
   * @param verified Optional boolean to filter by verification status.
   * @returns Promise<D1Result<ServiceProvider[]>>
   */
  async getAllServiceProviders(verified?: boolean) {
    const db = await getDatabase();
    let query = 'SELECT id, user_id, business_name, type, address, verified FROM service_providers';
    const params: any[] = [];

    if (verified !== undefined) {
      query += ' WHERE verified = ?';
      params.push(verified ? 1 : 0); // Use 1 for true, 0 for false in SQLite/D1 boolean
    }

    query += ' ORDER BY business_name ASC';
    return db.prepare(query).bind(...params).all();
  }

  /**
   * Marks a service provider as verified.
   * @param providerId The ID of the service provider to verify.
   * @returns Promise<D1Result>
   */
  async verifyServiceProvider(providerId: number) {
    const db = await getDatabase();
    return db
      .prepare('UPDATE service_providers SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(providerId)
      .run();
  }

  // --- Hotel & Room Management Methods (CORRECTED) ---

  /**
   * Retrieves a single hotel's details by joining services and hotels tables.
   * @param serviceId The service ID of the hotel.
   * @returns Promise<any | null> - Define a specific HotelDetail interface later
   */
  async getHotelById(serviceId: number) {
    const db = await getDatabase();
    // Join services and hotels table
    const rawHotel = await db
      .prepare(
        `SELECT
          s.id, s.name, s.description, s.type, s.provider_id, s.island_id,
          s.price, s.availability, s.images, s.amenities AS service_amenities, s.cancellation_policy,
          s.is_active, s.created_at AS service_created_at, s.updated_at AS service_updated_at,
          h.star_rating, h.check_in_time, h.check_out_time, h.facilities, h.policies,
          h.extra_images AS hotel_extra_images, h.total_rooms, h.street_address, h.geo_lat, h.geo_lng,
          h.meal_plans, h.pets_allowed, h.children_allowed, h.accessibility,
          h.created_at AS hotel_created_at, h.updated_at AS hotel_updated_at
        FROM services s
        JOIN hotels h ON s.id = h.service_id
        WHERE s.id = ? AND s.type = 'hotel'`
      )
      .bind(serviceId)
      .first<any>(); // Get raw hotel data

    if (!rawHotel) {
      return null;
    }

    // Fetch and parse rooms for the hotel
    const roomsResult = await this.getRoomTypesByHotelServiceId(serviceId);
    const rooms = roomsResult.results || []; // getRoomTypesByHotelServiceId now returns parsed rooms

    // Parse main hotel fields
    const parsedHotel = {
      ...rawHotel,
      images: this._parseJsonString(rawHotel.images, []),
      amenities: this._parseJsonString(rawHotel.service_amenities, []),
      facilities: this._parseJsonString(rawHotel.facilities, []),
      meal_plans: this._parseJsonString(rawHotel.meal_plans, []),
      rating: rawHotel.star_rating,
      address: rawHotel.street_address,
      latitude: rawHotel.geo_lat,
      longitude: rawHotel.geo_lng,
      check_in_time: rawHotel.check_in_time,
      check_out_time: rawHotel.check_out_time,
      cancellation_policy: rawHotel.cancellation_policy,
      pets_allowed: rawHotel.pets_allowed,
      children_allowed: rawHotel.children_allowed,
      accessibility: rawHotel.accessibility,
      total_rooms: rawHotel.total_rooms,
      rooms: rooms,
    };

    // Clean up intermediate fields if necessary
    delete parsedHotel.service_amenities;

    return parsedHotel as Hotel; // Cast to the expected Hotel type
  }

  /**
   * Retrieves all hotels for a specific service provider.
   * @param providerId The ID of the service provider.
   * @returns Promise<D1Result<any[]>> - Define a specific HotelListItem interface later
   */
  async getHotelsByProvider(providerId: number) {
    const db = await getDatabase();
    // Join services and hotels table for the specific provider
    return db
      .prepare(`
        SELECT
          s.id AS service_id, s.name, s.island_id, s.price, s.is_active, s.images,
          h.star_rating, h.street_address
        FROM services s
        JOIN hotels h ON s.id = h.service_id
        WHERE s.provider_id = ? AND s.type = 'hotel'
        ORDER BY s.name ASC
      `)
      .bind(providerId)
      .all(); // Define a proper interface for the list item result
  }

  /**
   * Creates a new hotel (service entry + hotel entry).
   * Note: D1 doesn't have robust transactions like traditional SQL. This performs sequential inserts.
   * Consider using batch operations if atomicity is critical and supported for this case.
   * @param serviceData Data for the services table.
   * @param hotelData Data for the hotels table.
   * @returns Promise<{ success: boolean; serviceId?: number; error?: string }>
   */
  async createHotel(serviceData: any, hotelData: any) {
    const db = await getDatabase();
    try {
      // First, create the service entry
      const serviceResult = await db
        .prepare(`
          INSERT INTO services (
            name, description, type, provider_id, island_id, price,
            availability, images, amenities, cancellation_policy, is_active,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)
        .bind(
          serviceData.name,
          serviceData.description,
          serviceData.type,
          serviceData.provider_id,
          serviceData.island_id,
          serviceData.price,
          serviceData.availability,
          serviceData.images,
          serviceData.amenities,
          serviceData.cancellation_policy,
          serviceData.is_active === undefined ? 1 : (serviceData.is_active ? 1 : 0)
        )
        .run();

      if (!serviceResult.success || !serviceResult.meta?.last_row_id) {
        throw new Error("Failed to create service entry for hotel");
      }

      const serviceId = serviceResult.meta.last_row_id;

      // Now create the hotel entry with ALL required columns
      const hotelResult = await db
        .prepare(`
          INSERT INTO hotels (
            service_id, star_rating, room_types, check_in_time, check_out_time,
            facilities, policies, extra_images, total_rooms, street_address,
            geo_lat, geo_lng, meal_plans, pets_allowed, children_allowed,
            accessibility, is_admin_approved, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)
        .bind(
          serviceId,
          hotelData.star_rating,
          hotelData.room_types || null,        // Add missing room_types column
          hotelData.check_in_time,
          hotelData.check_out_time,
          hotelData.facilities,
          hotelData.policies,
          hotelData.extra_images,
          hotelData.total_rooms,
          hotelData.street_address,
          hotelData.geo_lat,
          hotelData.geo_lng,
          hotelData.meal_plans,
          hotelData.pets_allowed ? 1 : 0,
          hotelData.children_allowed ? 1 : 0,
          hotelData.accessibility,
          0,                                   // Add missing is_admin_approved (default to 0)
        )
        .run();

      if (!hotelResult.success) {
        throw new Error("Failed to create hotel entry");
      }

      return { success: true, serviceId };
    } catch (error) {
      console.error("Error in createHotel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error in hotel creation"
      };
    }
  }

  /**
   * Updates an existing hotel (service and hotel entries).
   * Note: Sequential updates without true transaction.
   * @param serviceId The service ID of the hotel to update.
   * @param serviceUpdateData Data to update in the services table.
   * @param hotelUpdateData Data to update in the hotels table.
   * @returns Promise<{ success: boolean; error?: string }>
   */
  async updateHotel(serviceId: number, serviceUpdateData: any, hotelUpdateData: any) {
    const db = await getDatabase();
    try {
      // 1. Update the service entry
      const serviceResult = await db
        .prepare(`
          UPDATE services SET
            name = ?, description = ?, island_id = ?, price = ?, images = ?,
            cancellation_policy = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND type = 'hotel'
        `)
        .bind(
          serviceUpdateData.name,
          serviceUpdateData.description,
          serviceUpdateData.island_id,
          serviceUpdateData.price,
          serviceUpdateData.images,
          serviceUpdateData.cancellation_policy,
          serviceId
        )
        .run();

      // Check if the service update affected any row (it might fail if ID doesn't exist or type isn't hotel)
      if (!serviceResult.success || serviceResult.meta.changes === 0) {
        // If changes is 0, it means the WHERE clause didn't match (likely wrong ID or type)
        const message = serviceResult.meta.changes === 0 ? 'Hotel service not found or type mismatch.' : (serviceResult.error || 'Failed to update service entry.');
        // Only throw error if there was a DB error, not just if no rows matched
        if (serviceResult.meta.changes === 0 && serviceResult.success) {
          console.warn(`UpdateHotel: Service with ID ${serviceId} not found or not a hotel.`);
          // Don't necessarily throw an error if service wasn't found, maybe hotel update is still valid?
          // Or maybe we should throw? Depends on desired behavior.
          // For now, let's proceed but log it.
        } else if (!serviceResult.success) {
          throw new Error(message);
        }
      }

      // 2. Update the hotel entry
      const hotelResult = await db
        .prepare(`
          UPDATE hotels SET
            star_rating = ?, check_in_time = ?, check_out_time = ?, facilities = ?, total_rooms = ?,
            street_address = ?, geo_lat = ?, geo_lng = ?, meal_plans = ?, pets_allowed = ?,
            children_allowed = ?, accessibility = ?, updated_at = CURRENT_TIMESTAMP
          WHERE service_id = ?
        `)
        .bind(
          hotelUpdateData.star_rating,
          hotelUpdateData.check_in_time,
          hotelUpdateData.check_out_time,
          hotelUpdateData.facilities, // Expects stringified JSON
          hotelUpdateData.total_rooms,
          hotelUpdateData.street_address,
          hotelUpdateData.geo_lat,
          hotelUpdateData.geo_lng,
          hotelUpdateData.meal_plans, // Expects stringified JSON
          hotelUpdateData.pets_allowed ? 1 : 0,
          hotelUpdateData.children_allowed ? 1 : 0,
          hotelUpdateData.accessibility, // Corrected field name
          serviceId
        )
        .run();

      // Check if hotel update succeeded (it might fail if service_id doesn't exist in hotels)
      if (!hotelResult.success) {
        // Rollback is difficult here. Log the error.
        console.error('Failed to update hotel entry after updating service. Service ID: ', serviceId);
        throw new Error('Failed to update hotel entry: ' + (hotelResult.error || 'Unknown error'));
      }
      // Check if either update made changes
      if (serviceResult.meta.changes === 0 && hotelResult.meta.changes === 0) {
        // If neither service nor hotel was updated, report no changes
        return { success: true, error: 'No changes detected or hotel not found.' }; // Changed to success: true, as no DB error occurred
      }

      return { success: true };

    } catch (error) {
      console.error('Error in updateHotel transaction simulation:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Deletes a hotel by deleting its service entry.
   * Relies on ON DELETE CASCADE constraint on hotels.service_id.
   * @param serviceId The service ID of the hotel to delete.
   * @returns Promise<D1Result>
   */
  async deleteHotel(serviceId: number) {
    const db = await getDatabase();
    // Deleting the service should cascade to the hotels table
    return db.prepare("DELETE FROM services WHERE id = ? AND type = 'hotel'").bind(serviceId).run();
  }

  // --- Room Type Methods ---

  /**
   * Retrieves a specific room type by its ID.
   * @param roomId The ID of the room type.
   * @returns Promise<any | null> - Define RoomType interface later
   */
  async getRoomTypeById(roomId: number) {
    const db = await getDatabase();
    // Renaming columns to match expected API structure (e.g., service_id -> hotel_service_id)
    // Note: Schema uses 'service_id', 'room_type', 'quantity', 'extra_images'
    return db
      .prepare(`
        SELECT
          id, service_id AS hotel_service_id, room_type AS room_type_name,
          base_price, max_guests, quantity AS quantity_available,
          amenities, extra_images AS images
        FROM hotel_room_types
        WHERE id = ?
      `)
      .bind(roomId)
      .first(); // Define a proper interface
  }

  /**
   * Retrieves all room types for a specific hotel service ID.
   * @param hotelServiceId The service ID of the parent hotel.
   * @returns Promise<D1Result<any[]>> - Define RoomType interface later
   */
  async getRoomTypesByHotelServiceId(hotelServiceId: number) {
    const db = await getDatabase();
    // Renaming columns to match expected API structure
    const result = await db
      .prepare(
        `SELECT
          id, service_id AS hotel_service_id, room_type AS room_type_name,
          base_price, max_guests, quantity AS quantity_available,
          amenities, extra_images AS images  -- extra_images from DB is aliased to 'images' for the Room type
        FROM hotel_room_types
        WHERE service_id = ?
        ORDER BY room_type ASC`
      )
      .bind(hotelServiceId)
      .all<any>();

    if (!result || !result.results) {
      return { ...result, results: [] }; // Return empty results if fetch failed or no rooms
    }

    const parsedRoomTypes = result.results.map((room: any) => ({
      ...room,
      images: this._parseJsonString(room.images, []),
      amenities: this._parseJsonString(room.amenities, []),
    }));

    return { ...result, results: parsedRoomTypes as Room[] };
  }

  /**
   * Creates a new room type for a hotel.
   * @param roomTypeData Data for the new room type.
   * @returns Promise<D1Result>
   */
  async createRoomType(roomTypeData: any) {
    const db = await getDatabase();

    // Prepare the SQL statement with correct table and column names
    const stmt = db.prepare(`
      INSERT INTO hotel_room_types (
        service_id,       -- Was: hotel_service_id
        room_type,        -- Was: room_type_name
        base_price,
        max_guests,
        quantity,         -- Was: quantity_available
        amenities,
        extra_images      -- Was: images
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `);

    try {
      // Logging the data before binding (as it was)
      console.log("[DB createRoomType] Binding service_id (from hotel_service_id):", roomTypeData.hotel_service_id, typeof roomTypeData.hotel_service_id);
      console.log("[DB createRoomType] Binding room_type (from room_type_name):", roomTypeData.room_type_name, typeof roomTypeData.room_type_name);
      console.log("[DB createRoomType] Binding base_price:", roomTypeData.base_price, typeof roomTypeData.base_price);
      console.log("[DB createRoomType] Binding max_guests:", roomTypeData.max_guests, typeof roomTypeData.max_guests);
      console.log("[DB createRoomType] Binding quantity (from quantity_available):", roomTypeData.quantity_available, typeof roomTypeData.quantity_available);
      console.log("[DB createRoomType] Binding amenities:", roomTypeData.amenities, typeof roomTypeData.amenities);
      console.log("[DB createRoomType] Binding extra_images (from images):", roomTypeData.images, typeof roomTypeData.images);

      const result = await stmt.bind(
        roomTypeData.hotel_service_id,    // Corresponds to service_id column
        roomTypeData.room_type_name,      // Corresponds to room_type column
        roomTypeData.base_price,          // Corresponds to base_price column
        roomTypeData.max_guests,          // Corresponds to max_guests column
        roomTypeData.quantity_available,  // Corresponds to quantity column
        roomTypeData.amenities,           // Corresponds to amenities column
        roomTypeData.images               // Corresponds to extra_images column
      ).run();

      if (!result.success) {
        console.error("DB Error creating room type:", result.error);
        return { success: false, error: result.error || "Database operation failed at run()" };
      }
      if (result.meta?.last_row_id === undefined || result.meta?.last_row_id === null) {
        console.warn("No last_row_id returned from D1 after room type insert. Result meta:", result.meta);
        return { success: true, meta: result.meta, error: "No last_row_id returned but insert may have succeeded." };
      }

      return { success: true, meta: result.meta };
    } catch (e: any) {
      console.error("Exception during stmt.bind() or .run() for createRoomType:", e);
      return { success: false, error: e.message || "Exception during database operation" };
    }
  }

  /**
   * Updates an existing room type.
   * @param roomId The ID of the room type to update.
   * @param roomTypeUpdateData Data to update.
   * @returns Promise<D1Result & { error?: string }>
   */
  async updateRoomType(roomId: number, roomTypeUpdateData: any): Promise<D1Result & { error?: string }> {
    const db = await getDatabase();
    // Map API names to schema names
    const result = await db
      .prepare(`
        UPDATE hotel_room_types SET
          room_type = ?, base_price = ?, max_guests = ?, quantity = ?,
          amenities = ?, extra_images = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(
        roomTypeUpdateData.room_type_name,
        roomTypeUpdateData.base_price,
        roomTypeUpdateData.max_guests,
        roomTypeUpdateData.quantity_available,
        roomTypeUpdateData.amenities, // Expects stringified JSON
        roomTypeUpdateData.images,
        roomId
      )
      .run();

    // D1Result doesn't directly expose error messages on failure sometimes.
    // We add a check for changes to detect 'not found' or 'no change'.
    if (result.success && result.meta.changes === 0) {
      // Check if the record actually exists
      const exists = await this.getRoomTypeById(roomId);
      if (!exists) {
        // If it doesn't exist, return a failure similar to a 404
        return { ...result, success: false, error: 'Room type not found.' };
      } else {
        // If it exists but no changes were made, return specific message
        return { ...result, success: true, error: 'No changes detected.' }; // Still success, but indicate no change
      }
    }
    return result; // Return original result if changes > 0 or if there was a DB error
  }

  /**
   * Deletes a room type.
   * @param roomId The ID of the room type to delete.
   * @returns Promise<D1Result>
   */
  async deleteRoomType(roomId: number) {
    const db = await getDatabase();
    return db.prepare('DELETE FROM hotel_room_types WHERE id = ?').bind(roomId).run();
  }

  /**
   * Retrieves a list of all hotels with optional filtering and pagination.
   * Joins services and hotels tables.
   * @param limit Max number of hotels to return.
   * @param offset Number of hotels to skip.
   * @param filters Optional filters for name, location, minRating.
   * @returns Promise<D1Result<any[]>> - Define a proper Hotel interface for the result
   */
  async getAllHotels(limit = 10, offset = 0, filters: HotelFilters = {}) {
    const db = await getDatabase();
    let query = `
      SELECT
        s.id, s.name, s.description, s.type, s.provider_id, s.island_id,
        s.price, s.availability, s.images, s.amenities AS service_amenities, s.cancellation_policy,
        s.is_active,
        h.star_rating, h.check_in_time, h.check_out_time, h.facilities, h.policies,
        h.extra_images AS hotel_extra_images, h.total_rooms, h.street_address, h.geo_lat, h.geo_lng,
        h.meal_plans, h.pets_allowed, h.children_allowed, h.accessibility,
        MIN(hrt.base_price) as min_room_price 
        -- Note: city and country are not directly in services or hotels table in this query
        -- They need to be sourced if required by the Hotel type for list items.
      FROM services s
      JOIN hotels h ON s.id = h.service_id
      LEFT JOIN hotel_room_types hrt ON s.id = hrt.service_id -- LEFT JOIN to include hotels with no rooms
      WHERE s.type = 'hotel' AND s.is_active = 1 AND s.is_admin_approved = 1
    `;
    const params: (string | number)[] = [];

    const conditions: string[] = [];
    if (filters.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.location) {
      // Assuming location filter searches street_address or a dedicated location field if available
      conditions.push('h.street_address LIKE ?'); // Or s.location if that exists
      params.push(`%${filters.location}%`);
    }
    if (filters.minRating !== undefined) {
      conditions.push('h.star_rating >= ?');
      params.push(filters.minRating);
    }
    if (filters.islandId !== undefined) {
      conditions.push('s.island_id = ?');
      params.push(filters.islandId);
    }

    if (conditions.length > 0) {
      query += ' AND (' + conditions.join(' AND ') + ')';
    }
    
    // Add GROUP BY for all non-aggregated columns
    query += `
      GROUP BY
        s.id, s.name, s.description, s.type, s.provider_id, s.island_id,
        s.price, s.availability, s.images, s.amenities, s.cancellation_policy,
        s.is_active,
        h.star_rating, h.check_in_time, h.check_out_time, h.facilities, h.policies,
        h.extra_images, h.total_rooms, h.street_address, h.geo_lat, h.geo_lng,
        h.meal_plans, h.pets_allowed, h.children_allowed, h.accessibility
    `;

    query += ' ORDER BY s.name ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await db.prepare(query).bind(...params).all<any>();

    if (!result || !result.results) {
      // console.error("Failed to fetch raw hotel data or no results in getAllHotels");
      // Return D1Result like structure with empty data for consistency
      return { results: [], success: result?.success || false, meta: result?.meta || {}, error: result?.error || "No data" };
    }

    const parsedHotels = result.results.map((hotel: any) => {
      const parsed = {
        ...hotel,
        images: this._parseJsonString(hotel.images, []),
        amenities: this._parseJsonString(hotel.service_amenities, []),
        // Map other fields for consistency with Hotel type, e.g.:
        rating: hotel.star_rating,
        address: hotel.street_address,
        // city, country would be undefined if not selected/available
        latitude: hotel.geo_lat,
        longitude: hotel.geo_lng,
      };
      delete parsed.service_amenities;
      delete parsed.star_rating;
      delete parsed.street_address;
      delete parsed.geo_lat;
      delete parsed.geo_lng;
      // hotel_extra_images, facilities, policies, meal_plans are not directly on Hotel type for list items usually
      return parsed;
    });
    
    return { ...result, results: parsedHotels as Hotel[] };
  }

  /**
   * Counts the total number of active hotels, applying optional filters.
   * @param filters Optional filters for name, location, minRating.
   * @returns Promise<{ total: number } | null>
   */
  async countAllHotels(filters: HotelFilters = {}) {
    const db = await getDatabase();
    let query = `
      SELECT COUNT(s.id) AS total
      FROM services s
      JOIN hotels h ON s.id = h.service_id
      WHERE s.type = 'hotel' AND s.is_active = 1 AND s.is_admin_approved = 1
    `;
    const params: (string | number)[] = [];

    const conditions: string[] = [];
    if (filters.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.location) {
      conditions.push('h.street_address LIKE ?');
      params.push(`%${filters.location}%`);
    }
    if (filters.minRating !== undefined) {
      conditions.push('h.star_rating >= ?');
      params.push(filters.minRating);
    }
    if (filters.islandId !== undefined) {
      conditions.push('s.island_id = ?');
      params.push(filters.islandId);
    }

    if (conditions.length > 0) {
      query += ' AND (' + conditions.join(' AND ') + ')';
    }

    return db.prepare(query).bind(...params).first<{ total: number }>();
  }

  // --- Admin Approval Methods ---
  async approveHotel(serviceId: number): Promise<D1Result> {
    const db = await getDatabase();
    return db
      .prepare('UPDATE services SET is_admin_approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type = \'hotel\'')
      .bind(serviceId)
      .run();
  }

  async approveHotelRoom(roomTypeId: number): Promise<D1Result> {
    const db = await getDatabase();
    return db
      .prepare('UPDATE hotel_room_types SET is_admin_approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(roomTypeId)
      .run();
  }

  async approveService(serviceId: number): Promise<D1Result> {
    const db = await getDatabase();
    // This should not approve hotels through this generic service approval method.
    // We ensure type is not 'hotel'. If it is, it should be approved via approveHotel.
    return db
      .prepare("UPDATE services SET is_admin_approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type != 'hotel'")
      .bind(serviceId)
      .run();
  }

  /**
   * Rejects a hotel by setting its is_admin_approved flag to 0.
   * @param serviceId The ID of the hotel service
   * @param rejectReason Optional reason for rejection that can be stored or communicated
   * @returns Promise<D1Result>
   */
  async rejectHotel(serviceId: number, rejectReason: string = ''): Promise<D1Result> {
    const db = await getDatabase();
    // admin_reject_reason column removed from query
    return db
      .prepare('UPDATE services SET is_admin_approved = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type = \'hotel\'')
      .bind(serviceId) // rejectReason removed from bind
      .run();
  }

  /**
   * Rejects a hotel room by setting its is_admin_approved flag to 0.
   * @param roomTypeId The ID of the room type
   * @param rejectReason Optional reason for rejection that can be stored or communicated
   * @returns Promise<D1Result>
   */
  async rejectHotelRoom(roomTypeId: number, rejectReason: string = ''): Promise<D1Result> {
    const db = await getDatabase();
    // admin_reject_reason column removed from query
    return db
      .prepare('UPDATE hotel_room_types SET is_admin_approved = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(roomTypeId) // rejectReason removed from bind
      .run();
  }

  /**
   * Rejects a service by setting its is_admin_approved flag to 0.
   * @param serviceId The ID of the service
   * @param rejectReason Optional reason for rejection that can be stored or communicated
   * @returns Promise<D1Result>
   */
  async rejectService(serviceId: number, rejectReason: string = ''): Promise<D1Result> {
    const db = await getDatabase();
    // This should not reject hotels through this generic service method.
    // admin_reject_reason column removed from query
    return db
      .prepare("UPDATE services SET is_admin_approved = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type != 'hotel'")
      .bind(serviceId) // rejectReason removed from bind
      .run();
  }

  // --- Methods to get unapproved items ---
  async getUnapprovedHotels(limit: number = 10, offset: number = 0): Promise<D1Result<any[]>> { // Define better type later
    const db = await getDatabase();
    return db
      .prepare(`
        SELECT s.id, s.name, s.provider_id, h.star_rating, s.created_at 
        FROM services s 
        JOIN hotels h ON s.id = h.service_id 
        WHERE s.type = 'hotel' AND (s.is_admin_approved = 0 OR s.is_admin_approved IS NULL)
        ORDER BY s.created_at DESC LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all();
  }

  async countUnapprovedHotels(): Promise<{ total: number } | null> {
    const db = await getDatabase();
    return db
      .prepare("SELECT COUNT(*) as total FROM services WHERE type = 'hotel' AND (is_admin_approved = 0 OR is_admin_approved IS NULL)")
      .first<{ total: number }>();
  }

  async getUnapprovedHotelRooms(limit: number = 10, offset: number = 0): Promise<D1Result<any[]>> { // Define better type later
    const db = await getDatabase();
    return db
      .prepare(`
        SELECT hr.id, hr.service_id as hotel_service_id, s.name as hotel_name, hr.room_type, hr.base_price as price_per_night, hr.created_at 
        FROM hotel_room_types hr
        JOIN services s ON hr.service_id = s.id
        WHERE (hr.is_admin_approved = 0 OR hr.is_admin_approved IS NULL)
        ORDER BY hr.created_at DESC LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all();
  }

  async countUnapprovedHotelRooms(): Promise<{ total: number } | null> {
    const db = await getDatabase();
    return db
      .prepare("SELECT COUNT(*) as total FROM hotel_room_types WHERE (is_admin_approved = 0 OR is_admin_approved IS NULL)")
      .first<{ total: number }>();
  }

  async getUnapprovedServices(limit: number = 10, offset: number = 0): Promise<D1Result<any[]>> { // Define better type later
    const db = await getDatabase();
    // Excludes hotels, as they are handled by getUnapprovedHotels
    return db
      .prepare(`
        SELECT id, name, type, provider_id, price, created_at 
        FROM services 
        WHERE type != 'hotel' AND (is_admin_approved = 0 OR is_admin_approved IS NULL)
        ORDER BY created_at DESC LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all();
  }

  async countUnapprovedServices(): Promise<{ total: number } | null> {
    const db = await getDatabase();
    // Excludes hotels
    return db
      .prepare("SELECT COUNT(*) as total FROM services WHERE type != 'hotel' AND (is_admin_approved = 0 OR is_admin_approved IS NULL)")
      .first<{ total: number }>();
  }

  async getBookingDetailsWithRelations(bookingId: number): Promise<any | null> {
    const db = await getDatabase();
    const query = `
      SELECT
        b.*,
        p.name AS packageName,
        pc.category_name AS packageCategoryName,
        u.first_name AS userFirstName,
        u.last_name AS userLastName,
        u.email AS userEmail
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN package_categories pc ON b.package_category_id = pc.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = ?;
    `;
    try {
      const stmt = db.prepare(query).bind(bookingId);
      const result = await stmt.first<any>(); // Expect a single object or null
      return result; // This will be the flat object with aliased names
    } catch (e: any) {
      console.error(`Error fetching booking with relations for ID ${bookingId}:`, e.message);
      return null; // Or throw, depending on desired error handling for the service layer
    }
  }

  // --- Admin Status Page Methods ---

  async getAllHotelsForAdminStatusPage(limit: number, offset: number): Promise<D1Result<any[]>> {
    const db = await getDatabase();
    return db
      .prepare(
        `SELECT
           s.id, s.name, s.type, s.created_at, s.is_admin_approved, s.price, s.is_active,
           h.star_rating
         FROM services s
         JOIN hotels h ON s.id = h.service_id
         WHERE s.type = 'hotel'
         ORDER BY s.created_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(limit, offset)
      .all();
  }

  async countAllHotelsForAdminStatusPage(): Promise<{ total: number } | null> {
    const db = await getDatabase();
    return db
      .prepare(
        `SELECT COUNT(*) as total
         FROM services s
         JOIN hotels h ON s.id = h.service_id
         WHERE s.type = 'hotel'`
      )
      .first<{ total: number }>();
  }

  async getAllHotelRoomsForAdminStatusPage(limit: number, offset: number): Promise<D1Result<any[]>> {
    const db = await getDatabase();
    return db
      .prepare(
        `SELECT
           hr.id, hr.room_type, hr.created_at, hr.is_admin_approved, hr.base_price as price_per_night,
           hr.service_id AS hotel_service_id, 
           s.name AS hotel_name
         FROM hotel_room_types hr
         LEFT JOIN services s ON hr.service_id = s.id 
         ORDER BY hr.created_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(limit, offset)
      .all();
  }

  async countAllHotelRoomsForAdminStatusPage(): Promise<{ total: number } | null> {
    const db = await getDatabase();
    return db
      .prepare(
        `SELECT COUNT(*) as total
         FROM hotel_room_types hr`
      )
      .first<{ total: number }>();
  }

  async getAllOtherServicesForAdminStatusPage(limit: number, offset: number): Promise<D1Result<any[]>> {
    const db = await getDatabase();
    return db
      .prepare(
        `SELECT
           s.id, s.name, s.type, s.created_at, s.is_admin_approved, s.price, s.is_active
         FROM services s
         WHERE s.type NOT IN ('hotel') 
         ORDER BY s.created_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(limit, offset)
      .all();
  }

  async countAllOtherServicesForAdminStatusPage(): Promise<{ total: number } | null> {
    const db = await getDatabase();
    const result = await db.prepare(`
      SELECT COUNT(*) as total 
      FROM services s 
      LEFT JOIN hotels h ON s.id = h.service_id 
      WHERE h.service_id IS NULL
    `).first<{ total: number }>();
    return result;
  }

  // --- Admin Booking Methods ---
  async getAllPackageBookingsForAdmin(limit = 50, offset = 0) {
    const db = await getDatabase();
    return db
      .prepare(`
        SELECT 
          b.id,
          b.status,
          b.payment_status,
          b.total_amount,
          b.total_people,
          b.start_date,
          b.end_date,
          b.created_at,
          b.guest_name,
          b.guest_email,
          b.guest_phone,
          b.special_requests,
          p.name as package_name,
          pc.category_name as package_category_name,
          COALESCE(u.first_name || ' ' || u.last_name, b.guest_name) as customer_name,
          u.email as customer_email,
          u.phone as customer_phone
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        LEFT JOIN package_categories pc ON b.package_category_id = pc.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.package_id IS NOT NULL
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all();
  }

  async countAllPackageBookingsForAdmin() {
    const db = await getDatabase();
    const result = await db.prepare(`
      SELECT COUNT(*) as total 
      FROM bookings 
      WHERE package_id IS NOT NULL
    `).first<{ total: number }>();
    return result;
  }

  async getAllServiceBookingsForAdmin(serviceType?: string, limit = 50, offset = 0) {
    const db = await getDatabase();
    let whereClause = `WHERE bs.service_id IS NOT NULL`;
    const params: any[] = [];
    
    if (serviceType) {
      if (serviceType === 'hotels') {
        whereClause += ` AND h.service_id IS NOT NULL`;
      } else if (serviceType === 'activities') {
        whereClause += ` AND s.type LIKE 'activity%'`;
      } else if (serviceType === 'rentals') {
        whereClause += ` AND s.type LIKE 'rental%'`;
      } else if (serviceType === 'transport') {
        whereClause += ` AND s.type LIKE 'transport%'`;
      } else {
        whereClause += ` AND s.type LIKE ?`;
        params.push(`${serviceType}%`);
      }
    }
    
    params.push(limit, offset);

    return db
      .prepare(`
        SELECT 
          b.id,
          b.status,
          b.payment_status,
          b.total_amount,
          b.total_people,
          b.start_date,
          b.end_date,
          b.created_at,
          b.guest_name,
          b.guest_email,
          b.guest_phone,
          b.special_requests,
          bs.quantity,
          bs.price as service_price,
          bs.date as service_date,
          s.name as service_name,
          s.type as service_type,
          hrt.room_type,
          COALESCE(u.first_name || ' ' || u.last_name, b.guest_name) as customer_name,
          u.email as customer_email,
          u.phone as customer_phone,
          sp.business_name as provider_name
        FROM bookings b
        INNER JOIN booking_services bs ON b.id = bs.booking_id
        INNER JOIN services s ON bs.service_id = s.id
        LEFT JOIN service_providers sp ON s.provider_id = sp.id
        LEFT JOIN hotels h ON s.id = h.service_id
        LEFT JOIN hotel_room_types hrt ON bs.hotel_room_type_id = hrt.id
        LEFT JOIN users u ON b.user_id = u.id
        ${whereClause}
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...params)
      .all();
  }

  async countAllServiceBookingsForAdmin(serviceType?: string) {
    const db = await getDatabase();
    let whereClause = `WHERE bs.service_id IS NOT NULL`;
    const params: any[] = [];
    
    if (serviceType) {
      if (serviceType === 'hotels') {
        whereClause += ` AND h.service_id IS NOT NULL`;
      } else if (serviceType === 'activities') {
        whereClause += ` AND s.type LIKE 'activity%'`;
      } else if (serviceType === 'rentals') {
        whereClause += ` AND s.type LIKE 'rental%'`;
      } else if (serviceType === 'transport') {
        whereClause += ` AND s.type LIKE 'transport%'`;
      } else {
        whereClause += ` AND s.type LIKE ?`;
        params.push(`${serviceType}%`);
      }
    }

    const result = await db.prepare(`
      SELECT COUNT(DISTINCT b.id) as total 
      FROM bookings b
      INNER JOIN booking_services bs ON b.id = bs.booking_id
      INNER JOIN services s ON bs.service_id = s.id
      LEFT JOIN hotels h ON s.id = h.service_id
      ${whereClause}
    `).bind(...params).first<{ total: number }>();
    
    return result;
  }

  // --- Additional method for hotel bookings ---
  async createInitialHotelBooking(bookingData: {
    service_id: number;
    hotel_room_type_id: number;
    user_id: number | null;
    total_amount: number;
    guest_name: string | null;
    guest_email: string | null;
    guest_phone: string | null;
    start_date: string;
    end_date: string;
    total_people: number;
    number_of_rooms: number;
    special_requests: string | null;
  }) {
    const db = await getDatabase();
    
    try {
      // Create the main booking record
      const bookingResult = await db.prepare(`
        INSERT INTO bookings (
          user_id, service_id, total_people, start_date, end_date,
          status, total_amount, payment_status, guest_name, 
          guest_email, guest_phone, special_requests, 
          number_of_rooms, booking_type
        ) VALUES (?, ?, ?, ?, ?, 'PENDING_PAYMENT', ?, 'INITIATED', ?, ?, ?, ?, ?, 'hotel')
      `).bind(
        bookingData.user_id,
        bookingData.service_id,
        bookingData.total_people,
        bookingData.start_date,
        bookingData.end_date,
        bookingData.total_amount,
        bookingData.guest_name,
        bookingData.guest_email,
        bookingData.guest_phone,
        bookingData.special_requests,
        bookingData.number_of_rooms
      ).run();

      if (!bookingResult.success) {
        throw new Error('Failed to create hotel booking record');
      }

      const bookingId = bookingResult.meta?.last_row_id;
      if (!bookingId) {
        throw new Error('Failed to get booking ID after creation');
      }

      // Create the booking service record
      await db.prepare(`
        INSERT INTO booking_services (
          booking_id, service_id, hotel_room_type_id, 
          quantity, price, date
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        bookingId,
        bookingData.service_id,
        bookingData.hotel_room_type_id,
        bookingData.number_of_rooms,
        bookingData.total_amount,
        bookingData.start_date
      ).run();

      return {
        success: true,
        meta: { last_row_id: bookingId },
        error: null
      };

    } catch (error) {
      console.error('Error creating hotel booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error creating hotel booking',
        meta: {}
      };
    }
  }
}