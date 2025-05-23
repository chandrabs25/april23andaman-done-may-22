// src/types/hotel.d.ts

export interface Room {
  id: number; // Or string if using UUIDs
  hotel_id: number; // Or string, Foreign key to Hotel
  room_type_name: string; // e.g., "Deluxe King", "Standard Twin"
  description?: string;
  capacity_adults: number;
  capacity_children?: number; // Optional, defaults to 0
  base_price: number;
  amenities: string[]; // JSON array of strings in DB, parsed in application
  images: string[]; // JSON array of strings (URLs) in DB, parsed in application
  quantity_available: number;
  created_at?: string; // ISO 8601 date string
  updated_at?: string; // ISO 8601 date string
}

export interface Hotel {
  id: number; // Or string if using UUIDs
  provider_id: number; // Foreign key to the service provider (user with provider role or a dedicated providers table)
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  rating?: number; // e.g., 1-5, allows for unrated hotels
  amenities: string[]; // JSON array of strings in DB, parsed in application
  images: string[]; // JSON array of strings (URLs) in DB, parsed in application
  rooms?: Room[]; // Optional: To be populated when fetching hotel details
  created_at?: string; // ISO 8601 date string
  updated_at?: string; // ISO 8601 date string
  
  // Adding fields from the hotels table
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string; // From policies JSON or separate field
  pets_allowed?: boolean;
  children_allowed?: boolean;
  accessibility?: string;
  facilities?: string[];
  meal_plans?: string[];
  street_address?: string;
  total_rooms?: number;
}

// For API responses, especially for lists with pagination
export interface PaginatedHotelsResponse {
  data: Hotel[];
  total: number;
  page: number;
  limit: number;
}

// Interface for hotel filtering options - ADDING EXPORT
export interface HotelFilters {
  name?: string;
  location?: string; // Could be city or country
  minRating?: number;
  islandId?: number; // Added islandId filter
  // Potentially add more filters like amenities, price range for rooms etc.
}

