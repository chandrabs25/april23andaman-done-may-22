'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, Package, Building, Car, Plane, PlayCircle } from 'lucide-react';

interface Booking {
  id: number;
  status: string;
  payment_status: string;
  total_amount: number;
  total_people: number;
  start_date: string;
  end_date: string;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  special_requests?: string;
  
  // Package booking fields
  package_name?: string;
  package_category_name?: string;
  
  // Service booking fields
  service_name?: string;
  service_type?: string;
  room_type?: string;
  provider_name?: string;
  quantity?: number;
  service_price?: number;
  service_date?: string;
  
  // Common fields
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  
  // Classification
  booking_type?: 'package' | 'service';
}

interface BookingResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    pagination: {
      totalItems: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

type BookingTab = 'all' | 'packages' | 'services' | 'hotels' | 'activities' | 'rentals' | 'transport';

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 50,
    totalPages: 0
  });

  const fetchBookings = async (tab: BookingTab, page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/bookings?type=${tab}&page=${page}&limit=50`);
      const data: BookingResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.success === false ? 'Failed to fetch bookings' : 'Unknown error');
      }
      
      setBookings(data.data.bookings);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: BookingTab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    fetchBookings(activeTab, page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status: string, type: 'booking' | 'payment' = 'booking') => {
    const colorMap = {
      booking: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800',
        PENDING_PAYMENT: 'bg-orange-100 text-orange-800'
      },
      payment: {
        pending: 'bg-yellow-100 text-yellow-800',
        INITIATED: 'bg-blue-100 text-blue-800',
        SUCCESS: 'bg-green-100 text-green-800',
        FAILED: 'bg-red-100 text-red-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
    };

    const colorClass = colorMap[type][status as keyof typeof colorMap[typeof type]] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {status}
      </span>
    );
  };

  const getTabIcon = (tab: BookingTab) => {
    const iconMap = {
      all: <Package className="h-4 w-4" />,
      packages: <Package className="h-4 w-4" />,
      services: <Building className="h-4 w-4" />,
      hotels: <Building className="h-4 w-4" />,
      activities: <PlayCircle className="h-4 w-4" />,
      rentals: <Car className="h-4 w-4" />,
      transport: <Plane className="h-4 w-4" />
    };
    return iconMap[tab];
  };

  const tabs: { key: BookingTab; label: string }[] = [
    { key: 'all', label: 'All Bookings' },
    { key: 'packages', label: 'Package Bookings' },
    { key: 'services', label: 'All Services' },
    { key: 'hotels', label: 'Hotels' },
    { key: 'activities', label: 'Activities' },
    { key: 'rentals', label: 'Rentals' },
    { key: 'transport', label: 'Transport' }
  ];

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
        <div className="text-sm text-gray-500">
          Total: {pagination.totalItems} bookings
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              {getTabIcon(tab.key)}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No bookings match the current filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates & Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.package_name || booking.service_name || `Booking #${booking.id}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.booking_type === 'package' ? (
                              <span className="flex items-center">
                                <Package className="h-3 w-3 mr-1" />
                                Package - {booking.package_category_name}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                {getTabIcon(booking.service_type as BookingTab)}
                                <span className="ml-1">
                                  {booking.service_type} {booking.room_type && `- ${booking.room_type}`}
                                </span>
                              </span>
                            )}
                          </div>
                          {booking.provider_name && (
                            <div className="text-xs text-gray-400">
                              Provider: {booking.provider_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.customer_name || booking.guest_name || 'Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customer_email || booking.guest_email || 'No email'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customer_phone || booking.guest_phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</div>
                          <div className="flex items-center text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            {booking.total_people} guests
                            {booking.quantity && booking.quantity > 1 && (
                              <span className="ml-2">× {booking.quantity}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(booking.total_amount)}
                          </div>
                          {booking.service_price && (
                            <div className="text-xs text-gray-500">
                              Service: {formatCurrency(booking.service_price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(booking.status, 'booking')}
                        {getStatusBadge(booking.payment_status, 'payment')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
