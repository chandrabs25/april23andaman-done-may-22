# Hotel Booking System Extension

## Overview

The hotel booking system extends the existing package booking infrastructure to support hotel reservations while reusing the proven PhonePe payment integration and booking workflow.

## Architecture Integration

### Existing Package Booking Flow
```
Package Selection → Booking Form → Payment Initiation → PhonePe Payment → Status Verification → Confirmation
```

### Extended Hotel Booking Flow
```
Hotel Selection → Room Selection → Booking Form → Payment Initiation → PhonePe Payment → Status Verification → Confirmation
```

## Key Components Added

### 1. Frontend Components

#### Hotel Detail Page
- **File**: `src/app/(main)/hotels/[id]/page.tsx`
- **Purpose**: Display hotel information, amenities, and available room types
- **Features**:
  - Image gallery with room photos
  - Star rating and hotel amenities
  - Room type cards with pricing
  - Direct booking navigation

#### Hotel Booking Page
- **File**: `src/app/(main)/booking/new/hotel/page.tsx`
- **Purpose**: Hotel-specific booking form
- **Features**:
  - Date range selection (check-in/check-out)
  - Room and guest count selection
  - Real-time price calculation
  - Hotel policies display

#### Hotel Booking Form Component
- **File**: `src/components/hotels/HotelBookingForm.tsx`
- **Purpose**: Reusable form component for hotel bookings
- **Features**:
  - Date validation (no past dates, checkout after checkin)
  - Dynamic pricing calculation
  - Guest capacity validation
  - Integration with PhonePe payment flow

### 2. Backend APIs

#### Hotel Details API
- **File**: `src/app/api/hotels/[id]/route.ts`
- **Purpose**: Fetch hotel and room type information
- **Response Structure**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Hotel Name",
    "description": "Hotel description",
    "star_rating": 4,
    "images_parsed": ["url1", "url2"],
    "amenities_parsed": ["WiFi", "Pool"],
    "room_types": [
      {
        "id": 1,
        "room_type": "Deluxe Room",
        "base_price": 3500,
        "capacity": 2,
        "amenities": ["AC", "TV"],
        "images": ["room_url1"]
      }
    ],
    "check_in_time": "3:00 PM",
    "check_out_time": "11:00 AM",
    "cancellation_policy": "Policy text"
  }
}
```

#### Hotel Payment Initiation API
- **File**: `src/app/api/bookings/initiate-payment/hotel/route.ts`
- **Purpose**: Initialize PhonePe payment for hotel bookings
- **Request Structure**:
```json
{
  "hotelId": "1",
  "roomTypeId": "1",
  "userId": "123",
  "guestDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "9876543210"
  },
  "dates": {
    "checkInDate": "2024-01-15",
    "checkOutDate": "2024-01-17"
  },
  "numberOfRooms": 1,
  "numberOfGuests": 2,
  "specialRequests": "Early check-in preferred"
}
```

### 3. Database Extensions

#### Hotel Booking Method
- **File**: `src/lib/database.ts`
- **Method**: `createInitialHotelBooking()`
- **Purpose**: Create hotel booking records in database
- **Features**:
  - Creates main booking record with hotel-specific fields
  - Links booking to room type via booking_services table
  - Supports both authenticated users and guests
  - Calculates total amount based on nights and rooms

### 4. Shared Infrastructure

The hotel booking system reuses the following components from the package booking system:

#### Payment Processing
- **PhonePe Integration**: Same payment gateway setup
- **Callback Handling**: Reuses existing S2S callback endpoint
- **Status Checking**: Same payment verification flow
- **Redirect Logic**: Same payment status display page

#### Database Tables
- **bookings**: Extended to support hotel bookings with `booking_type` field
- **booking_services**: Links bookings to specific room types
- **Enhanced booking system**: Utilizes existing availability tracking

#### UI Components
- **Payment Status Display**: Reuses existing payment status page
- **Booking Confirmation**: Same confirmation page structure
- **Theme System**: Consistent styling across all booking types

## Data Flow Comparison

### Package Booking Data Flow
```
1. User selects package + category
2. Form collects guest details + travel dates
3. Server calculates: category_price × people = total
4. Creates booking with package_id + package_category_id
5. Initiates PhonePe payment
6. Payment status updates booking
```

### Hotel Booking Data Flow
```
1. User selects hotel + room type
2. Form collects guest details + stay dates + room count
3. Server calculates: room_price × rooms × nights = total
4. Creates booking with service_id + hotel_room_type_id
5. Initiates PhonePe payment
6. Payment status updates booking (same flow)
```

## Configuration Requirements

### Environment Variables
The hotel booking system uses the same PhonePe configuration:
- `PHONEPE_MERCHANT_ID`
- `PHONEPE_SALT_KEY`
- `PHONEPE_SALT_INDEX`
- `PHONEPE_PAY_API_URL`
- `PHONEPE_STATUS_API_URL_PREFIX`
- `NGROK_PUBLIC_URL` or `SITE_URL`

### Database Schema
Requires existing enhanced booking system tables:
- `bookings` (extended)
- `booking_services`
- `services`
- `hotels`
- `hotel_room_types`
- `hotel_room_availability` (from enhanced system)
- `booking_holds` (shopping cart functionality)

## Key Differences from Package Booking

| Aspect | Package Booking | Hotel Booking |
|--------|-----------------|---------------|
| **Selection Unit** | Package Category | Room Type |
| **Date Logic** | Travel dates (start/end) | Check-in/Check-out dates |
| **Quantity** | Number of people | Number of rooms + guests |
| **Pricing** | Price per person | Price per room per night |
| **Database Link** | package_id + package_category_id | service_id + hotel_room_type_id |
| **Calculation** | category_price × people | room_price × rooms × nights |

## Benefits of This Architecture

### 1. Code Reusability
- 90% of payment infrastructure reused
- Consistent UI/UX across booking types
- Shared database methods for booking management

### 2. Maintainability
- Single PhonePe integration point
- Consistent error handling patterns
- Unified booking status management

### 3. Scalability
- Easy to add more booking types (activities, transport)
- Modular component structure
- Shared enhanced booking system features

### 4. User Experience
- Familiar booking flow for users
- Consistent payment experience
- Same confirmation and tracking system

## Future Extensions

This architecture supports easy addition of:
- **Activity Bookings**: Following same pattern with activity-specific forms
- **Transport Bookings**: Ferry/taxi reservations
- **Package + Hotel Combos**: Mixed booking types
- **Multi-night Package Stays**: Extended package bookings

## Testing the System

### Manual Testing Flow
1. **Hotel Selection**: Visit `/hotels/[id]` to view hotel details
2. **Room Selection**: Click "Book Now" on desired room type
3. **Booking Form**: Fill out hotel booking form at `/booking/new/hotel`
4. **Payment**: Complete PhonePe payment flow
5. **Confirmation**: View booking confirmation

### Integration Points to Verify
- [ ] Hotel details API returns proper data structure
- [ ] Room type pricing calculations are correct
- [ ] PhonePe payment initiation works
- [ ] Booking records are created properly
- [ ] Payment callbacks update booking status
- [ ] Confirmation page displays hotel booking details

## Conclusion

The hotel booking system successfully extends the existing package booking infrastructure while maintaining consistency and reusability. The modular design allows for easy maintenance and future expansion while providing users with a familiar and reliable booking experience. 