/**
 * @jest/globals
 */
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { GET as getAdminUsers } from '../src/app/api/admin/users/route';
import { POST as changePasswordAdmin } from '../src/app/api/admin/users/[userId]/change-password/route';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock('../src/lib/auth', () => ({
  requireAuth: jest.fn(),
}));
jest.mock('../src/lib/database', () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    getUsers: jest.fn(),
    getServiceProviders: jest.fn(),
    updateUserPassword: jest.fn(),
  })),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

// Helper to create a mock NextRequest
const mockNextRequest = (method, body = null, params = {}, searchParams = {}) => {
  const url = new URL(`http://localhost/api/admin/users${params.userId ? `/${params.userId}/change-password` : ''}`);
  Object.entries(searchParams).forEach(([key, value]) => url.searchParams.set(key, value));

  return {
    method,
    url: url.toString(),
    cookies: {
      get: jest.fn(), // Mock any cookie usage if necessary
    },
    json: async () => body,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    // Add other properties if your handlers use them
  };
};


describe('Admin API Endpoints', () => {
  let mockDbInstance;
  const { requireAuth } = require('../src/lib/auth');
  const { DatabaseService } = require('../src/lib/database');
  const bcrypt = require('bcryptjs');

  beforeEach(() => {
    jest.clearAllMocks();
    // Re-initialize mockDbInstance before each test to ensure fresh mocks
    mockDbInstance = new DatabaseService();
    // Ensure DatabaseService constructor mock returns this instance
    DatabaseService.mockImplementation(() => mockDbInstance);
  });

  describe('GET /api/admin/users', () => {
    test('Test Case 1: Admin Access - should return combined user data', async () => {
      requireAuth.mockResolvedValue(null); // Admin is authenticated

      const mockUsers = [{ id: 1, email: 'admin@example.com', role_id: 1, first_name: 'Admin', last_name: 'User' }];
      const mockProviders = [{ user_id: 1, business_name: 'Admin Corp', type: 'Tech', verified: 1 }];
      mockDbInstance.getUsers.mockResolvedValue({ success: true, results: mockUsers });
      mockDbInstance.getServiceProviders.mockResolvedValue({ success: true, results: mockProviders });

      const request = mockNextRequest('GET');
      const response = await getAdminUsers(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual([{
        ...mockUsers[0],
        serviceProvider: mockProviders[0],
      }]);
      expect(requireAuth).toHaveBeenCalledWith(request, [1]);
      expect(mockDbInstance.getUsers).toHaveBeenCalled();
      expect(mockDbInstance.getServiceProviders).toHaveBeenCalled();
    });

    test('Test Case 2: Non-Admin Access Denied - should return 403', async () => {
      const forbiddenResponse = NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 });
      requireAuth.mockResolvedValue(forbiddenResponse); // Non-admin

      const request = mockNextRequest('GET');
      const response = await getAdminUsers(request);
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.message).toBe('Insufficient permissions');
      expect(requireAuth).toHaveBeenCalledWith(request, [1]);
      expect(mockDbInstance.getUsers).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/admin/users/[userId]/change-password', () => {
    const userId = 123;
    const newPassword = 'newSecurePassword123';
    const mockPasswordHash = 'hashedNewPassword';

    test('Test Case 1: Admin Changes Password Successfully', async () => {
      requireAuth.mockResolvedValue(null); // Admin authenticated
      bcrypt.hash.mockResolvedValue(mockPasswordHash);
      mockDbInstance.updateUserPassword.mockResolvedValue({ success: true, meta: { changes: 1 } });

      const request = mockNextRequest('POST', { newPassword }, { userId: userId.toString() });
      const response = await changePasswordAdmin(request, { params: { userId: userId.toString() } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('Password updated successfully.');
      expect(requireAuth).toHaveBeenCalledWith(request, [1]);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockDbInstance.updateUserPassword).toHaveBeenCalledWith(userId, mockPasswordHash);
    });

    test('Test Case 2: Non-Admin Access Denied', async () => {
      const unauthorizedResponse = NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      requireAuth.mockResolvedValue(unauthorizedResponse); // Non-admin or unauthenticated

      const request = mockNextRequest('POST', { newPassword }, { userId: userId.toString() });
      const response = await changePasswordAdmin(request, { params: { userId: userId.toString() } });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.message).toBe('Authentication required');
      expect(requireAuth).toHaveBeenCalledWith(request, [1]);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockDbInstance.updateUserPassword).not.toHaveBeenCalled();
    });

    test('Test Case 3: Invalid Input (short password)', async () => {
      requireAuth.mockResolvedValue(null); // Admin authenticated
      const shortPassword = 'short';

      const request = mockNextRequest('POST', { newPassword: shortPassword }, { userId: userId.toString() });
      const response = await changePasswordAdmin(request, { params: { userId: userId.toString() } });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe('New password must be a string and at least 8 characters long.');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockDbInstance.updateUserPassword).not.toHaveBeenCalled();
    });

    test('Test Case 4: User Not Found', async () => {
      requireAuth.mockResolvedValue(null); // Admin authenticated
      bcrypt.hash.mockResolvedValue(mockPasswordHash);
      // Mocking DatabaseService.updateUserPassword to simulate user not found by returning 0 changes
      mockDbInstance.updateUserPassword.mockResolvedValue({ success: true, meta: { changes: 0 } });

      const request = mockNextRequest('POST', { newPassword }, { userId: userId.toString() });
      const response = await changePasswordAdmin(request, { params: { userId: userId.toString() } });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe(`User with ID ${userId} not found or password already matches.`);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockDbInstance.updateUserPassword).toHaveBeenCalledWith(userId, mockPasswordHash);
    });

     test('Test Case 5: Database error on password update', async () => {
      requireAuth.mockResolvedValue(null); // Admin authenticated
      bcrypt.hash.mockResolvedValue(mockPasswordHash);
      mockDbInstance.updateUserPassword.mockResolvedValue({ success: false, error: 'Simulated DB Error' });

      const request = mockNextRequest('POST', { newPassword }, { userId: userId.toString() });
      const response = await changePasswordAdmin(request, { params: { userId: userId.toString() } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe('Failed to update password.');
      expect(body.error).toBe('Simulated DB Error');
    });

    test('Test Case 6: Invalid User ID format', async () => {
        requireAuth.mockResolvedValue(null); // Admin authenticated

        const request = mockNextRequest('POST', { newPassword }, { userId: 'invalid-id' });
        const response = await changePasswordAdmin(request, { params: { userId: 'invalid-id' } });
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.message).toBe('Invalid user ID format.');
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(mockDbInstance.updateUserPassword).not.toHaveBeenCalled();
      });
  });
});
