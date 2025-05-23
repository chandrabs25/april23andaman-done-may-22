// src/types/activity.d.ts

export interface ActivityProviderDetails {
  id: number;
  business_name: string;
  // Add other provider fields if they are relevant for display on activity cards/details
  // e.g., profile_image_url?: string | null;
}

export interface Activity {
  id: number;
  name: string;
  description: string | null;
  type: string; // Should predominantly be 'activity' or a specific subtype if used
  provider_id: number;
  provider?: ActivityProviderDetails; // To store joined provider information
  island_id: number;
  island_name: string;
  price: number; // Ensure this is consistently a number
  availability: string | null; // e.g., "Daily", "Mon-Fri", specific dates. Consider structured type later if needed.
  images: string[]; // Parsed from comma-separated string or JSON array string
  amenities: string[]; // Parsed from comma-separated string or JSON array string
  cancellation_policy: string | null;
  duration: string | null; // e.g., "2 hours", "Full Day"
  rating: number | null; // Average rating, e.g., 4.5
  is_active: boolean;
  // Optional detailed fields for activity details page:
  location_details?: string | null; // Specific meeting point, address for the activity
  what_to_bring?: string[] | null;
  included_services?: string[] | null; // Renamed from 'included' to avoid conflict if 'included' is a keyword
  not_included_services?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface PaginatedActivitiesResponse {
  data: Activity[];
  total?: number; // Optional if not always available or needed for simple list
  page?: number;
  limit?: number;
  message?: string;
  success: boolean;
}

