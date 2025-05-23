'use client';

// Force dynamic rendering for this admin page
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckIcon, XIcon, EyeIcon, Loader2 } from 'lucide-react';

// Define types for our data
interface UnapprovedItem {
  id: number;
  name?: string;
  hotel_name?: string;
  type?: string;
  room_type?: string;
  provider_id?: number;
  star_rating?: number;
  price?: number;
  price_per_night?: number;
  created_at: string;
  hotel_service_id?: number; // For rooms
}

interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    items: UnapprovedItem[];
    pagination: PaginationInfo;
  };
  error?: string;
}

// Loading Spinner Component
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex justify-center items-center py-10">
    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
    <span>{text}</span>
  </div>
);

// Main Dashboard Content Component
function AdminApprovalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'all';
  
  const [items, setItems] = useState<UnapprovedItem[]>([]);
  const [loading, setLoading] = useState(false); // Default to not loading for SSR
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  });

  // Keep track of browser environment
  const [isBrowser, setIsBrowser] = useState(false);

  // Only run in browser, not during build/SSR
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Tabs for filtering by item type
  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'hotels', label: 'Hotels' },
    { value: 'rooms', label: 'Room Types' },
    { value: 'services', label: 'Services' }
  ];

  // Fetch pending approvals data
  useEffect(() => {
    // Skip data fetching during SSR/build
    if (!isBrowser) return;
    
    const fetchPendingApprovals = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        
        // Construct URL based on selected type
        let url = `/api/admin/approvals?page=${page}&limit=${limit}`;
        if (type !== 'all') {
          url += `&type=${type}`;
        }
        
        const response = await fetch(url);
        const data = await response.json() as ApiResponse;
        
        if (!response.ok) {
          throw new Error(data.message || data.error || `Error: ${response.status}`);
        }
        
        if (data.success) {
          setItems(data.data.items);
          setPagination(data.data.pagination);
        } else {
          throw new Error(data.message || 'Failed to fetch approvals');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to fetch approvals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [searchParams, type, isBrowser]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      // Update URL params to reflect page change
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`/admin_approvals?${params.toString()}`);
    }
  };

  // Handle tab change
  const handleTabChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newType === 'all') {
      params.delete('type');
    } else {
      params.set('type', newType);
    }
    params.delete('page'); // Reset to page 1 when changing type
    router.push(`/admin_approvals?${params.toString()}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle approve action
  const handleApprove = async (item: UnapprovedItem) => {
    if (actionInProgress[`${getApiTypeId(item)}_${item.id}`]) {
      return; // Don't allow multiple simultaneous actions on the same item
    }

    // Guard against SSR/build-time execution
    if (typeof window !== 'undefined') {
      if (!confirm(`Are you sure you want to approve this ${getItemType(item)}?`)) {
        return;
      }
    }

    setActionInProgress({ ...actionInProgress, [`${getApiTypeId(item)}_${item.id}`]: true });

    try {
      // Normalize type for API call
      const apiType = getApiTypeId(item);
      const itemId = apiType === 'room' ? item.id : (item.id || 0);
      
      const response = await fetch(`/api/admin/approvals/${apiType}/${itemId}`, {
        method: 'PUT',
      });
      
      const data = await response.json() as { 
        success: boolean; 
        message?: string;
        error?: string;
      };
      
      if (!response.ok) {
        throw new Error(data.message || data.error || `Error: ${response.status}`);
      }
      
      if (data.success) {
        // Remove the approved item from the list
        setItems(items.filter(i => !(i.id === item.id && getItemType(i) === getItemType(item))));
        // Update pagination
        setPagination(prev => ({ ...prev, totalItems: prev.totalItems - 1 }));
      } else {
        throw new Error(data.message || 'Failed to approve item');
      }
    } catch (err) {
      // Guard against SSR/build-time execution for alert
      if (typeof window !== 'undefined') {
        alert(err instanceof Error ? err.message : 'Failed to approve item');
      }
      console.error('Failed to approve:', err);
    } finally {
      const updatedActionInProgress = { ...actionInProgress };
      delete updatedActionInProgress[`${getApiTypeId(item)}_${item.id}`];
      setActionInProgress(updatedActionInProgress);
    }
  };

  // Handle reject action
  const handleReject = async (item: UnapprovedItem) => {
    if (actionInProgress[`${getApiTypeId(item)}_${item.id}`]) {
      return; // Don't allow multiple simultaneous actions on the same item
    }

    // Guard against SSR/build-time execution
    let reason = '';
    if (typeof window !== 'undefined') {
      // Optionally get rejection reason
      reason = prompt(`Please enter a reason for rejecting this ${getItemType(item)} (optional):`, '') || '';
      if (reason === null) {
        return; // User cancelled
      }
    }

    setActionInProgress({ ...actionInProgress, [`${getApiTypeId(item)}_${item.id}`]: true });

    try {
      // Normalize type for API call
      const apiType = getApiTypeId(item);
      const itemId = apiType === 'room' ? item.id : (item.id || 0);
      
      const response = await fetch(`/api/admin/approvals/${apiType}/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      const data = await response.json() as { 
        success: boolean; 
        message?: string;
        error?: string;
      };
      
      if (!response.ok) {
        throw new Error(data.message || data.error || `Error: ${response.status}`);
      }
      
      if (data.success) {
        // Remove the rejected item from the list
        setItems(items.filter(i => !(i.id === item.id && getItemType(i) === getItemType(item))));
        // Update pagination
        setPagination(prev => ({ ...prev, totalItems: prev.totalItems - 1 }));
      } else {
        throw new Error(data.message || 'Failed to reject item');
      }
    } catch (err) {
      // Guard against SSR/build-time execution for alert
      if (typeof window !== 'undefined') {
        alert(err instanceof Error ? err.message : 'Failed to reject item');
      }
      console.error('Failed to reject:', err);
    } finally {
      const updatedActionInProgress = { ...actionInProgress };
      delete updatedActionInProgress[`${getApiTypeId(item)}_${item.id}`];
      setActionInProgress(updatedActionInProgress);
    }
  };

  // Helper to get the view URL for a specific item
  const getViewUrl = (item: UnapprovedItem) => {
    if (item.type === 'hotel' || (item.hotel_service_id && !item.type)) {
      // For hotel or room
      return `/hotels/${item.id}`;
    }
    
    if (item.type) {
      // For services (transport, rental, etc.)
      return `/services/${item.type}/${item.id}`;
    }
    
    return '#'; // Fallback
  };

  // Helper to get the human-readable item type
  const getItemType = (item: UnapprovedItem): string => {
    if (item.room_type) {
      return 'room';
    }
    if (item.type === 'hotel') {
      return 'hotel';
    }
    if (item.type) {
      return item.type;
    }
    return 'item';
  };

  // Helper to get API type ID for the approval endpoint
  const getApiTypeId = (item: UnapprovedItem): string => {
    if (item.room_type) {
      return 'room';
    }
    if (item.type === 'hotel') {
      return 'hotel';
    }
    return 'service';
  };

  // Helper to get the name of the item
  const getItemName = (item: UnapprovedItem): string => {
    if (item.room_type) {
      return `${item.room_type} at ${item.hotel_name || 'Unknown Hotel'}`;
    }
    return item.name || 'Unnamed Item';
  };

  // Helper to get the price display
  const getPriceDisplay = (item: UnapprovedItem): string => {
    if (item.price_per_night) {
      return `₹${item.price_per_night}/night`;
    }
    if (item.price) {
      return `₹${item.price}`;
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Pending Approvals</h1>

      {/* Tabs for filtering */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                type === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={type === tab.value ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading state */}
      {!isBrowser || loading ? (
        <LoadingSpinner text="Loading pending approvals..." />
      ) : (
        <>
          {/* Items table */}
          {items.length === 0 ? (
            <div className="bg-white p-6 text-center rounded-lg shadow">
              <p className="text-gray-500">No pending approvals found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Submitted</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={`${getApiTypeId(item)}-${item.id}`} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{item.id}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{getItemType(item)}</span>
                      </td>
                      <td className="py-3 px-4">{getItemName(item)}</td>
                      <td className="py-3 px-4">{getPriceDisplay(item)}</td>
                      <td className="py-3 px-4">{formatDate(item.created_at)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {/* View button */}
                          <Link
                            href={getViewUrl(item)}
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>

                          {/* Approve button */}
                          <button
                            onClick={() => handleApprove(item)}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            disabled={!!actionInProgress[`${getApiTypeId(item)}_${item.id}`]}
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>

                          {/* Reject button */}
                          <button
                            onClick={() => handleReject(item)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            disabled={!!actionInProgress[`${getApiTypeId(item)}_${item.id}`]}
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} items
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

// Suspense Wrapper for the Page
export default function AdminApprovalsPage() {
  return (
    // Suspense boundary for client components that use useSearchParams
    <Suspense fallback={<LoadingSpinner text="Loading Approvals Page..." />}>
      <AdminApprovalsContent />
    </Suspense>
  );
} 