// src/types/transport_rental.d.ts

// Common interface for provider details, can be shared or imported if already defined elsewhere
export interface ServiceProviderBasicInfo {
  id: number;
  business_name: string;
  // Potentially other common fields like contact_email, phone, etc.
}

// Base interface for common service properties
export interface BaseService {
  id: number;
  name: string;
  description: string | null;
  type: string; // e.g., "transport_car", "transport_ferry", "rental_scooter", "rental_kayak"
  provider_id: number;
  provider?: ServiceProviderBasicInfo; // Joined provider information
  island_id: number;
  island_name: string; // Joined island name
  images: string[]; // Parsed from comma-separated string or JSON array string
  price_details: string | null; // General field for price, can be structured text like "$50/day", "$20/trip"
  price_numeric?: number | null; // A representative numeric price if available for sorting/filtering
  availability_summary: string | null; // e.g., "Daily 9 AM - 6 PM", "Seasonal"
  rating: number | null;
  is_active: boolean;
  is_admin_approved?: number; // Added for admin preview
  // Common specific fields that might be in the services table or a JSON details column
  cancellation_policy?: string | null;
  amenities?: string[] | null; // General amenities or features
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Specific interface for Transport Services
export interface TransportService extends BaseService {
  service_category: "transport";
  vehicle_type?: string | null; // e.g., "Sedan", "SUV", "Minibus", "Ferry", "Scooter with Driver"
  capacity_passengers?: number | null;
  route_details?: string | null; // e.g., "Airport to Hotel Zone", "Island hopping circuit"
  price_per_km?: number | null;
  price_per_trip?: number | null;
  driver_included?: boolean;
}

// Specific interface for Rental Services
export interface RentalService extends BaseService {
  service_category: "rental";
  item_type?: string | null; // e.g., "Scooter", "Bicycle", "Kayak", "Snorkeling Gear"
  rental_duration_options?: string[]; // e.g., ["1 hour", "4 hours", "1 day", "1 week"]
  price_per_hour?: number | null;
  price_per_day?: number | null;
  deposit_amount?: number | null;
  pickup_location_options?: string[] | null;
  // specific terms for rentals
  rental_terms?: string | null; 
}

// Specific interface for Activity Services
export interface ActivityService extends BaseService {
  service_category: "activity";
  duration?: number | null;
  duration_unit?: string | null;
  group_size_min?: number | null;
  group_size_max?: number | null;
  difficulty_level?: string | null;
  equipment_provided?: string[] | null;
  safety_requirements?: string | null;
  guide_required?: boolean;
}

// Union type for API responses that might return mixed or specific types
export type CategorizedService = TransportService | RentalService | ActivityService;

// For API response for a list of services
export interface PaginatedServicesResponse {
  data: CategorizedService[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  success: boolean;
}

// For API response for a single service detail
export interface SingleServiceResponse {
  data: CategorizedService | null;
  message?: string;
  success: boolean;
}

