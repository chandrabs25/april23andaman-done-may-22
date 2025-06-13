// Path: .\src\app\vendor\bookings\page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign,
  Filter,
  Search,
  MoreHorizontal,
  Check,
  X,
  Clock,
  AlertTriangle,
  Package,
  Hotel
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';

export const dynamic = 'force-dynamic';

// Types
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
type PaymentStatus = 'PENDING_PAYMENT' | 'PAID' | 'FAILED';

interface VendorBooking {
  id: number;
  serviceOrPackageName: string;
  customerName: string;
  start_date: string;
  end_date: string;
  total_people: number;
  total_amount: number;
  net_amount: number;
  status: string;
  // Additional details that might be available
  guest_email?: string;
  guest_phone?: string;
  payment_status?: string;
  booking_type?: 'package' | 'service';
  service_type?: string;
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}

// Components
const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const StatusBadge = ({ status, type = 'booking' }: { status: string; type?: 'booking' | 'payment' }) => {
  const getStatusConfig = (status: string, type: string) => {
    if (type === 'payment') {
      switch (status?.toUpperCase()) {
        case 'PAID':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'PENDING_PAYMENT':
        case 'PENDING':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'FAILED':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    // Booking status
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const config = getStatusConfig(status, type);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config}`}>
      {status?.toUpperCase()}
    </span>
  );
};

const BookingCard = ({ 
  booking, 
  onStatusUpdate, 
  onViewDetails,
  isUpdating 
}: { 
  booking: VendorBooking;
  onStatusUpdate: (bookingId: number, newStatus: string) => void;
  onViewDetails: (bookingId: number) => void;
  isUpdating: boolean;
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const canTransitionTo = (currentStatus: string, newStatus: string) => {
    const transitions: Record<string, string[]> = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [], // Final state
      'CANCELLED': [] // Final state
    };
    return transitions[currentStatus?.toUpperCase()]?.includes(newStatus.toUpperCase()) || false;
  };

  const getActionButtons = (status: string) => {
    const buttons = [];
    
    if (canTransitionTo(status, 'CONFIRMED')) {
      buttons.push(
        <button
          key="confirm"
          onClick={() => onStatusUpdate(booking.id, 'CONFIRMED')}
          disabled={isUpdating}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 disabled:opacity-50"
        >
          <Check className="h-3 w-3 mr-1" />
          Confirm
        </button>
      );
    }
    
    if (canTransitionTo(status, 'COMPLETED')) {
      buttons.push(
        <button
          key="complete"
          onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
          disabled={isUpdating}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          <Check className="h-3 w-3 mr-1" />
          Complete
        </button>
      );
    }
    
    if (canTransitionTo(status, 'CANCELLED')) {
      buttons.push(
        <button
          key="cancel"
          onClick={() => onStatusUpdate(booking.id, 'CANCELLED')}
          disabled={isUpdating}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
        >
          <X className="h-3 w-3 mr-1" />
          Cancel
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {booking.serviceOrPackageName?.includes('Hotel') ? (
                <Hotel className="h-4 w-4 text-blue-600" />
              ) : (
                <Package className="h-4 w-4 text-green-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {booking.serviceOrPackageName}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} type="booking" />
            {booking.payment_status && (
              <StatusBadge status={booking.payment_status} type="payment" />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>{booking.total_people} guests</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>₹{booking.total_amount?.toLocaleString('en-IN')}</span>
          </div>
          {booking.guest_phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{booking.guest_phone}</span>
            </div>
          )}
          {booking.guest_email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="truncate">{booking.guest_email}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewDetails(booking.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          
          <div className="flex items-center gap-2">
            {getActionButtons(booking.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ManageBookingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [localBookings, setLocalBookings] = useState<VendorBooking[]>([]);
  
  // Fetch bookings
  const { 
    data: bookingsData, 
    error: bookingsError, 
    status: bookingsStatus
  } = useFetch<VendorBooking[]>(
    user?.id ? `/api/vendors/bookings?vendorUserId=${user.id}&limit=100` : null
  );

  // Status update
  const { submit: updateStatus, isLoading: isUpdating } = useSubmit();

  // Calculate stats
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  // Update local bookings when API data changes
  useEffect(() => {
    if (bookingsData) {
      setLocalBookings(bookingsData);
    }
  }, [bookingsData]);

  useEffect(() => {
    if (localBookings.length > 0) {
      const calculatedStats = localBookings.reduce((acc, booking) => {
        acc.total++;
        
        const status = booking.status?.toUpperCase();
        switch (status) {
          case 'PENDING':
            acc.pending++;
            break;
          case 'CONFIRMED':
            acc.confirmed++;
            break;
          case 'COMPLETED':
            acc.completed++;
            if (booking.payment_status?.toUpperCase() === 'PAID') {
              acc.totalRevenue += booking.total_amount || 0;
            }
            break;
          case 'CANCELLED':
            acc.cancelled++;
            break;
        }
        
        return acc;
      }, {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0
      });
      
      setStats(calculatedStats);
    }
  }, [localBookings]);

  // Filter bookings
  const filteredBookings = localBookings?.filter(booking => {
    // Status filter
    if (activeTab !== 'all' && booking.status?.toUpperCase() !== activeTab.toUpperCase()) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.serviceOrPackageName?.toLowerCase().includes(searchLower) ||
        booking.customerName?.toLowerCase().includes(searchLower) ||
        booking.guest_email?.toLowerCase().includes(searchLower) ||
        booking.guest_phone?.includes(searchTerm)
      );
    }
    
    // Date filter (if implemented)
    // Add date filtering logic here if needed
    
    return true;
  }) || [];

  // Handlers
  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      const result = await updateStatus(`/api/vendor/bookings/${bookingId}/status`, 'PUT', {
        status: newStatus
      });
      
      if (result.success) {
        // Update local bookings state optimistically
        setLocalBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus.toUpperCase() }
              : booking
          )
        );
        // Show success message (you could add a toast notification here)
        console.log(`Booking ${bookingId} status updated to ${newStatus}`);
      } else {
        alert(result.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleViewDetails = (bookingId: number) => {
    router.push(`/manage-bookings/${bookingId}`);
  };

  // Loading states
  if (authLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!user?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Authentication required</p>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'cancelled', label: 'Cancelled', count: stats.cancelled },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Bookings</h1>
        <p className="text-gray-600">View and manage all your bookings from one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <Check className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div>
        {bookingsStatus === 'loading' && <LoadingSpinner message="Loading bookings..." />}
        
        {bookingsStatus === 'error' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Failed to load bookings: {bookingsError?.message || 'Unknown error'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {bookingsStatus === 'success' && (
          <>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No bookings match the current filter.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onStatusUpdate={handleStatusUpdate}
                    onViewDetails={handleViewDetails}
                    isUpdating={isUpdating}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}