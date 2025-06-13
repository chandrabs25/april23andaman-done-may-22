Review of Vendor Portal (src/app/(vendor))

1. Introduction

Overview: The vendor portal, located within the src/app/(vendor) directory, serves as the dedicated interface for service providers (vendors) to manage their offerings, track performance, and interact with the booking platform. It is built using Next.js with the App Router paradigm.
General Structure: The portal utilizes a route group (vendor) to organize its specific routes and layout. Client-side rendering and data fetching appear to be common patterns, facilitated by custom hooks and components.
2. Overall Vendor Portal Structure

Main Layout (src/app/(vendor)/layout.tsx):
This file defines the foundational UI structure for the entire vendor section.
It incorporates VendorAuthProvider to manage authentication state and VendorLayoutContent which likely includes shared navigation elements (sidebar/top bar) and styling through vendor_globals.css.
Key Top-Level Directories:
dashboard/: Contains the vendor's main landing page after login, offering an overview and quick access to various functions.
login/: Handles vendor authentication.
register/: Manages new vendor registration.
my-hotels/: A comprehensive section for hotel-type vendors to manage their hotel listings, details, and individual room types.
my-services/: (Inferred structure) Likely mirrors my-hotels/ but for managing non-hotel services.
manage-bookings/: Allows vendors to view and potentially update the status of bookings related to their services.
3. Detailed Page and Route Analysis

Vendor Authentication

Route Path(s): /login, /register
Primary File(s): login/page.tsx, register/page.tsx
Purpose & Key UI Functionalities:
/login: Provides email/password fields for vendor sign-in. Includes error display and a link to register.
/register: A form for new vendors to sign up, collecting business details, owner information, contact details, and credentials. Requires agreement to terms.
Data Fetching/Mutation:
/login: POST to /api/vendor/auth/login. Redirects to /dashboard on success.
/register: POST to /api/vendor/register. Displays success message and redirects to /login.
Key Schema Interactions (via APIs):
users, roles: For creating vendor user accounts with the appropriate role and verifying credentials.
service_providers: For creating and storing detailed business profiles for vendors. Verification status (verified column) is initially set to false (0).
Vendor Dashboard (/dashboard)

Primary File(s): dashboard/page.tsx
Purpose & Key UI Functionalities:
Central hub for vendors. Displays a welcome message.
Shows key performance indicators (KPIs) like total services/hotels, active bookings, average rating, and total earnings.
Conditionally displays a "Verification Pending" notice.
Offers quick navigation links to add/manage services if verified.
Presents summaries of recent bookings and reviews.
Tabbed interface for "Overview," "Profile" (view business details), and "Reviews" (view all reviews - though this tab might list more detailed reviews than the overview snippet).
Data Fetching/Mutation:
Uses useAuth (likely useVendorAuth) for current vendor user data.
Multiple client-side useFetch calls to:
/api/vendors/profile?userId={id} (fetches service_providers data).
/api/vendors/stats?userId={id}.
/api/vendors/services?providerUserId={id}&limit=5.
/api/vendors/bookings?vendorUserId=${id}&limit=5.
/api/vendors/reviews?vendorUserId=${id}&limit=3.
Key Schema Interactions (via APIs):
service_providers: To get profile info, especially verified status and type.
services, hotels: For stats on total services.
bookings: For stats and recent bookings list.
reviews: For stats and recent reviews list.
Hotel Management

Route Path(s): /my-hotels, /my-hotels/add, /my-hotels/[serviceId]/edit
Primary File(s): my-hotels/page.tsx, my-hotels/add/page.tsx, my-hotels/[serviceId]/edit/page.tsx
Purpose & Key UI Functionalities:
/my-hotels: Lists all hotels managed by the vendor. Allows toggling active/inactive status, deleting hotels, and provides navigation to edit a hotel or manage its rooms. Includes an "Add New Hotel" button.
/my-hotels/add: A multi-step or comprehensive form to register a new hotel. Collects basic info (name, island, star rating), details (description, price, rooms), policies, facilities (checkboxes), meal plans (checkboxes), location (map picker), and images (uploader).
/my-hotels/[serviceId]/edit: Similar form to "add," but pre-filled with existing hotel data for modification. Includes a link to manage rooms for that specific hotel.
Data Fetching/Mutation:
All pages fetch vendor profile for verification and type checks.
/my-hotels: Fetches list from /api/vendor/my-hotels and islands from /api/islands. Handles status toggling via PUT to /api/vendor/services/${serviceId}/status and deletion via DELETE to /api/vendor/my-hotels/${serviceId}.
/my-hotels/add: Fetches islands. POST hotel data to /api/vendor/my-hotels. Image uploads likely go to a separate /api/upload (managed by ImageUploader) then URLs are associated with the hotel, potentially via a subsequent PUT if not part of the initial POST.
/my-hotels/[serviceId]/edit: Fetches specific hotel data from /api/vendor/my-hotels/${serviceId} and islands. PUT updated data to the same endpoint. Image management is similar to the add page.
Key Schema Interactions (via APIs):
services: Creating new records with type='hotel', updating existing ones (including is_active, images), deleting. Filtered by provider_id.
hotels: Storing/updating hotel-specific details linked to a services record. Fields include star_rating, facilities (JSON string), meal_plans (JSON string), geo-coordinates, etc.
islands: Used as a lookup.
Hotel Room Management

Route Path(s): /my-hotels/[serviceId]/rooms, /my-hotels/[serviceId]/rooms/add, /my-hotels/[serviceId]/rooms/[roomId]/edit
Primary File(s): my-hotels/[serviceId]/rooms/page.tsx, my-hotels/[serviceId]/rooms/add/page.tsx, my-hotels/[serviceId]/rooms/[roomId]/edit/page.tsx
Purpose & Key UI Functionalities:
.../rooms: Lists room types for a specific hotel. Allows deletion and navigation to add/edit rooms. Displays hotel name as a title.
.../rooms/add: Form to add a new room type to the parent hotel. Collects room name, price, max guests, quantity, amenities (checkboxes), and images (uploader).
.../rooms/[roomId]/edit: Similar form to "add room," pre-filled for editing an existing room type.
Data Fetching/Mutation:
All pages fetch vendor profile and parent hotel details (/api/vendor/my-hotels/${serviceId}).
.../rooms: Fetches room list from /api/vendor/my-hotels/${serviceId}/rooms. Handles deletion via DELETE to .../rooms/${roomId}.
.../rooms/add: POST new room data to /api/vendor/my-hotels/${serviceId}/rooms.
.../rooms/[roomId]/edit: Fetches specific room data from .../rooms/${roomId}. PUT updated data to the same endpoint.
Key Schema Interactions (via APIs):
hotel_room_types: CRUD operations. Records are linked to the parent hotel's services.id. Fields include room_type_name, base_price, amenities (JSON string), images (JSON string or comma-separated).
hotel_room_availability: While not directly managed field by field, changes to hotel_room_types.quantity (if such a direct field exists and is edited, or through quantity_available on the form) would ideally trigger updates or re-initialization in this table via backend logic/triggers.
Generic Service Management (/my-services/*) (Inferred)

Route Path(s): /my-services, /my-services/add, /my-services/[serviceId]/edit
Primary File(s): my-services/page.tsx, my-services/add/page.tsx, my-services/[serviceId]/edit/page.tsx (files not explicitly read but structure inferred).
Purpose & Key UI Functionalities: Expected to mirror my-hotels but for services where type is not 'hotel' (e.g., 'activity_provider', 'transport', 'rental'). Forms would be simpler, focusing on generic service fields.
Data Fetching/Mutation: API calls would target endpoints like /api/vendor/my-services and /api/vendor/my-services/${serviceId}.
Key Schema Interactions (via APIs):
services: CRUD operations, filtering by provider_id and type != 'hotel'.
Booking Management (/manage-bookings)

Primary File(s): manage-bookings/page.tsx
Purpose & Key UI Functionalities:
Provides vendors with a list of bookings associated with their services/packages.
Shows booking stats (pending, confirmed, etc.) and estimated revenue.
Tabs for filtering bookings by status.
Actions to view booking details (likely navigates to a more detailed page, though not explicitly listed in the files read) and update booking status (e.g., confirm a pending booking, mark as completed).
Data Fetching/Mutation:
Fetches bookings from an endpoint like /api/bookings?vendorId={vendor_identifier}.
Status updates would involve PUT requests to an API like /api/bookings/${bookingId}/status.
Key Schema Interactions (via APIs):
bookings: Primary table for fetching and updating booking statuses. Filtered by services linked to the vendor.
booking_services, users, packages, services: Joined by the API to provide comprehensive booking details (customer name, service/package name, dates, etc.).
4. Data Flow and Schema Interaction Summary

Frequently Accessed Tables: The vendor portal heavily interacts with users, roles, service_providers, services, hotels, hotel_room_types, and bookings. islands serves as important lookup data. reviews and payment-related tables are also accessed for dashboard summaries.
Common Data Patterns:
Vendor identification and verification is a prerequisite for most data access (via service_providers).
Listings (hotels, services, rooms, bookings) are typically filtered by the logged-in vendor's ID.
CRUD operations form the core of service and room management.
Complex data like amenities, facilities, and image URLs are often stored as JSON strings or comma-separated strings in the database and parsed/handled on the client or API layer.
API Reliance: All database interactions are intermediated by API routes defined under src/app/api/. The frontend does not directly query the database.
5. Key Components and Hooks Utilized

Authentication: VendorAuthProvider (in layout) and useAuth (likely a customized version for vendors, or the general one checking for vendor role) are central to managing user sessions and protecting routes.
Data Fetching: The custom useFetch hook is consistently used for client-side data retrieval from API endpoints.
UI Components:
Reusable presentational components like LoadingSpinner, InfoCard, VerificationPendingCard enhance UI consistency.
Specialized input components like CheckboxGroup (for multi-select options like facilities/amenities), ImageUploader (for handling image uploads and previews), and the dynamically imported MapPicker (for location selection) provide rich user interaction for forms.
lucide-react is used for iconography.
toast (from use-toast) for displaying notifications.
6. Observations and Potential Considerations

Client-Side Focus: A significant amount of data fetching, processing (e.g., stats calculation in manage-bookings), and conditional rendering logic resides on the client-side within the React components.
Structured Management: Clear distinction in routes and logic for managing hotels versus other services, and further for hotel rooms.
API Dependency: The robustness and efficiency of the backend API routes (under src/app/api/) are critical for the performance and reliability of the vendor portal.
Vendor Verification Workflow: The system clearly implements a verification gate (service_providers.verified flag) that restricts access to core service management functionalities until an admin approves the vendor.
Dynamic Routing: Next.js dynamic routes are used effectively for editing specific hotels, services, and rooms (e.g., [serviceId], [roomId]).
7. Conclusion

The src/app/(vendor) directory outlines a comprehensive and well-structured portal for service providers. It empowers vendors with functionalities to manage their service listings (with detailed support for hotels and their rooms), track bookings, and monitor basic analytics. The use of client-side data fetching with clear API interactions is a modern approach. The separation of concerns and the conditional logic based on vendor verification and type (hotel vs. other) demonstrate a good understanding of the business requirements. The overall design appears user-friendly for vendors, providing them with the necessary tools to operate within the platform.
This task is now complete. Let me know if there's anything else!