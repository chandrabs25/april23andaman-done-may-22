'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

// Define types for our data
interface Package {
  id: number;
  name: string;
  duration: string;
  base_price: number;
  is_active: number;
  created_at: string;
}

interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface GenericApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface PackageListResponse {
  success: boolean;
  message: string;
  data: {
    packages: Package[];
    pagination: PaginationInfo;
  };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'active', 'inactive'

  // Fetch packages data
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          page: pagination.currentPage.toString(),
          limit: pagination.pageSize.toString()
        });
        
        if (statusFilter !== 'all') {
          queryParams.append('status', statusFilter);
        }
        
        const response = await fetch(`/api/admin/packages?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data: PackageListResponse = await response.json();
        if (data.success) {
          setPackages(data.data.packages);
          setPagination(data.data.pagination);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to fetch packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [pagination.currentPage, pagination.pageSize, statusFilter]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle package deletion
  const handleDeletePackage = async (packageId: number) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // Try to parse error message from response body if possible
        let errorBody: { message?: string } | null = null;
        try {
          errorBody = await response.json();
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(errorBody?.message || `Error: ${response.status}`);
      }
      
      const data: GenericApiResponse = await response.json();
      if (data.success) {
        // Refresh the packages list
        setPackages(packages.filter(pkg => pkg.id !== packageId));
        alert('Package deleted successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete package');
      console.error('Failed to delete package:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Packages</h1>
        <Link 
          href="/admin_packages/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          New Package
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <label htmlFor="status-filter" className="font-medium">Status:</label>
        <select
          id="status-filter"
          className="border rounded-md px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2">Loading packages...</p>
        </div>
      ) : (
        <>
          {/* Packages table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Base Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                      No packages found
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{pkg.id}</td>
                      <td className="py-3 px-4">{pkg.name}</td>
                      <td className="py-3 px-4">{pkg.duration}</td>
                      <td className="py-3 px-4">${pkg.base_price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{formatDate(pkg.created_at)}</td>
                      <td className="py-3 px-4 flex space-x-2">
                        <Link
                          href={`/packages/${pkg.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin_packages/${pkg.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} packages
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                      pagination.currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 