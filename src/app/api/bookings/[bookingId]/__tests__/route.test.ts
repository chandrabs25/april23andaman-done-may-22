// src/app/api/bookings/[bookingId]/__tests__/route.test.ts
import { GET } from '../route'; // Adjust path based on actual file structure
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { dbQuery } from '@/lib/database';

// Mock next-auth
jest.mock('next-auth/next');
const mockGetServerSession = getServerSession;

// Mock database utility
jest.mock('@/lib/database');
const mockDbQuery = dbQuery;

// Mock authOptions
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

describe('GET /api/bookings/[bookingId]', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset();
    mockDbQuery.mockReset();
  });

  const mockBookingDetails = {
    booking_id: 1,
    package_id: 10,
    package_category_id: 2,
    user_id: 'user-owner-123',
    total_people: 2,
    start_date: '2025-11-10',
    end_date: '2025-11-15',
    booking_status: 'confirmed',
    total_amount: 400.00,
    payment_status: 'paid',
    guest_name: 'Owner User',
    guest_email: 'owner@example.com',
    guest_phone: '0000000000',
    special_requests: 'Room with a view',
    package_name: 'Luxury Andaman Escape',
    package_category_name: 'Deluxe Suite',
  };

  const mockGuestBookingDetails = {
    ...mockBookingDetails,
    booking_id: 2,
    user_id: null, // Guest booking
    guest_name: 'Guest User',
    guest_email: 'guest@example.com',
  };

  test('should retrieve booking details successfully for the booking owner', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-owner-123' } });
    mockDbQuery.mockResolvedValueOnce({ rowCount: 1, rows: [mockBookingDetails] });

    const request = new NextRequest('http://localhost/api/bookings/1');
    const response = await GET(request, { params: { bookingId: '1' } });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockBookingDetails);
    expect(mockDbQuery).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('should retrieve booking details successfully for a guest booking (no session required if user_id is null)', async () => {
    // This test assumes that if booking.user_id is null, any user (even unauthenticated) can view it,
    // or that the API allows access if no session.user.id is present for such bookings.
    // The current API logic implies this by only checking user_id if booking.user_id is not null.
    mockGetServerSession.mockResolvedValue(null); // No session or session without user.id
    mockDbQuery.mockResolvedValueOnce({ rowCount: 1, rows: [mockGuestBookingDetails] });

    const request = new NextRequest('http://localhost/api/bookings/2');
    const response = await GET(request, { params: { bookingId: '2' } });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockGuestBookingDetails);
  });

  test('should return 404 if a logged-in user tries to access a booking they do not own', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-another-456' } });
    // DB returns a booking owned by 'user-owner-123'
    mockDbQuery.mockResolvedValueOnce({ rowCount: 1, rows: [mockBookingDetails] }); 

    const request = new NextRequest('http://localhost/api/bookings/1');
    const response = await GET(request, { params: { bookingId: '1' } });
    const responseBody = await response.json();

    expect(response.status).toBe(404); // As per current implementation, returns 404 to avoid leaking info
    expect(responseBody.message).toBe('Booking not found or access denied.');
  });

  test('should return 404 if bookingId does not exist', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-any-789' } });
    mockDbQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // Booking not found

    const request = new NextRequest('http://localhost/api/bookings/999');
    const response = await GET(request, { params: { bookingId: '999' } });
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe('Booking not found.');
  });

  test('should return 400 if bookingId is not a valid number', async () => {
    const request = new NextRequest('http://localhost/api/bookings/invalid-id');
    const response = await GET(request, { params: { bookingId: 'invalid-id' } });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe('Invalid booking ID format.');
    expect(mockDbQuery).not.toHaveBeenCalled(); // DB query should not be made
  });

  test('should allow access to a user-specific booking if session matches, even if guest access is also possible for other bookings', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-owner-123' } });
    mockDbQuery.mockResolvedValueOnce({ rowCount: 1, rows: [mockBookingDetails] });

    const request = new NextRequest('http://localhost/api/bookings/1');
    const response = await GET(request, { params: { bookingId: '1' } });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.user_id).toBe('user-owner-123');
  });

});
