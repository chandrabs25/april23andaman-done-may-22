// src/app/api/bookings/__tests__/route.test.ts
import { POST } from '../route'; // Adjust path based on actual file structure
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { dbQuery } from '@/lib/database';

// Mock next-auth
jest.mock('next-auth/next');
const mockGetServerSession = getServerSession;

// Mock database utility
jest.mock('@/lib/database');
const mockDbQuery = dbQuery;

// Mock authOptions (actual import might be different)
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

describe('POST /api/bookings', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockGetServerSession.mockReset();
    mockDbQuery.mockReset();
  });

  const mockValidBookingData = {
    packageId: 1,
    packageCategoryId: 1,
    total_people: 2,
    start_date: '2025-12-01',
    end_date: '2025-12-05',
    guest_name: 'Test User',
    guest_email: 'test@example.com',
    guest_phone: '1234567890',
    special_requests: 'None',
  };

  test('should create a booking successfully for a logged-in user', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-123' } });
    mockDbQuery
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // Package check
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, package_id: 1, price: '100.00' }] }) // Category check
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'booking-xyz' }] }); // Booking insert

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify(mockValidBookingData),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.message).toBe('Booking created successfully!');
    expect(responseBody.booking_id).toBe('booking-xyz');
    expect(mockDbQuery.mock.calls[2][1]).toContain('user-123'); // Check user_id in insert params
    expect(mockDbQuery.mock.calls[2][1]).toContain(200); // Check calculated total_amount (2 * 100.00)
  });

  test('should create a booking successfully for a guest user', async () => {
    mockGetServerSession.mockResolvedValue(null); // No session
    mockDbQuery
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // Package check
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, package_id: 1, price: '150.00' }] }) // Category check
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'booking-abc' }] }); // Booking insert

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...mockValidBookingData, total_people: 3 }),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.booking_id).toBe('booking-abc');
    expect(mockDbQuery.mock.calls[2][1]).toContain(null); // user_id should be null
    expect(mockDbQuery.mock.calls[2][1]).toContain(450); // 3 * 150.00
  });

  test('should reject with 400 if required fields are missing', async () => {
    mockGetServerSession.mockResolvedValue(null);
    const incompleteData = { ...mockValidBookingData, guest_name: '' }; // Missing guest_name

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify(incompleteData),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe('Guest name cannot be empty');
  });

  test('should reject with 404 if packageId is invalid', async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockDbQuery.mockResolvedValueOnce({ rowCount: 0 }); // Package not found

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...mockValidBookingData, packageId: 999 }),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe('Package not found or is not active');
  });

  test('should reject with 404 if packageCategoryId is invalid', async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockDbQuery
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // Package found
      .mockResolvedValueOnce({ rowCount: 0 }); // Category not found

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...mockValidBookingData, packageCategoryId: 888 }),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe('Package category not found');
  });

  test('should reject with 400 if category does not belong to package', async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockDbQuery
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // Package found
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, package_id: 2, price: '100.00' }] }); // Category found, but package_id mismatch

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify(mockValidBookingData),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe('Package category does not belong to the specified package');
  });

  test('should calculate total_amount server-side, ignoring client value', async () => {
    mockGetServerSession.mockResolvedValue(null);
    mockDbQuery
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, package_id: 1, price: '100.00' }] })
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'booking-def' }] });

    const request = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...mockValidBookingData, total_people: 2, total_amount: 5000 }), // Client sends wrong total_amount
    });

    await POST(request);
    // Check the arguments of the third dbQuery call (the INSERT statement)
    const insertArgs = mockDbQuery.mock.calls[2][1];
    // The total_amount should be at index 7 in bookingParams array in route.ts
    expect(insertArgs[7]).toBe(200); // 2 * 100.00, not 5000
  });

  test('should return 400 for invalid date format for start_date', async () => {
    const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ ...mockValidBookingData, start_date: 'invalid-date' }),
    });
    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toContain('Invalid start_date');
  });

  test('should return 400 if start_date is in the past', async () => {
    const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ ...mockValidBookingData, start_date: '2020-01-01' }),
    });
    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Start date cannot be in the past');
  });

  test('should return 400 if end_date is not after start_date', async () => {
    const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ ...mockValidBookingData, start_date: '2025-12-05', end_date: '2025-12-01' }),
    });
    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('End date must be after the start date');
  });

});
