'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'; // Using sonner for toasts as seen in admin layout
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
}

interface ServiceProvider {
  id: number;
  user_id: number;
  business_name: string;
  type: string; // Business Type
  verified: number; // 0 or 1
}

interface UserWithProviderDetails extends User {
  serviceProvider: ServiceProvider | null;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserWithProviderDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProviderDetails | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error fetching users: ${response.statusText}`);
        }
        const data: UserWithProviderDetails[] = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenPasswordModal = (user: UserWithProviderDetails) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setNewPassword('');
    setModalError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewPassword('');
    setModalError(null);
  };

  const handlePasswordSubmit = async () => {
    if (!selectedUser) return;
    if (!newPassword || newPassword.length < 8) {
      setModalError('Password must be at least 8 characters long.');
      return;
    }
    setModalError(null);
    setModalLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to change password.');
      }

      toast.success(result.message || 'Password changed successfully!');
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setModalError(errorMessage);
      toast.error(errorMessage);
      console.error('Failed to change password:', err);
    } finally {
      setModalLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-xl text-red-600">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'User';
      case 3: return 'Vendor';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin - User Management</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.first_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.last_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(user.role_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.serviceProvider ? user.serviceProvider.business_name : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.serviceProvider ? user.serviceProvider.type : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.serviceProvider ? (user.serviceProvider.verified ? 'Yes' : 'No') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="link"
                    onClick={() => handleOpenPasswordModal(user)}
                    className="text-indigo-600 hover:text-indigo-900 p-0"
                  >
                    Change Password
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && !loading && (
        <p className="text-center mt-4 text-gray-500">No users found.</p>
      )}

      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password for {selectedUser.email}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPasswordInput" className="text-right">
                  New Password
                </Label>
                <Input
                  id="newPasswordInput"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                  placeholder="Min. 8 characters"
                />
              </div>
              {modalError && (
                <p className="col-span-4 text-red-600 text-sm text-center">{modalError}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handlePasswordSubmit} disabled={modalLoading}>
                {modalLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminUsersPage;
