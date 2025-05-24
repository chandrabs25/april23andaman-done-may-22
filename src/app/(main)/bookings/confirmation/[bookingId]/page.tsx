'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../hooks/useAuth'; // Verified path
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertTriangle, CheckCircle2, ExternalLink, HomeIcon, CreditCard } from 'lucide-react'; // Added CreditCard for Pay Now
import { format } from 'date-fns';

// Define BookingDetailsType Interface
interface BookingDetailsType {
  id: number | string;
  package_name: string;
  category_name: string;
  start_date: string;
  end_date: string;
  total_people: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  total_amount: number;
  status: string; 
  payment_status: string;
  primary_package_image?: string;
}

interface ApiResponse {
    success: boolean;
    booking?: BookingDetailsType;
    message?: string;
}

// Loading Spinner for Suspense
const PageLoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
    <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-6" />
    <p className="text-xl text-gray-700">Loading Booking Confirmation...</p>
  </div>
);

// Booking Confirmation Page Content Component
function BookingConfirmationPageContent() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const router = useRouter();

  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is missing from the URL.");
      setIsLoading(false);
      return;
    }

    if (authLoading) { // Wait for authentication to settle
      setIsLoading(true); // Keep loading true while auth is loading
      return;
    }
    
    // Proceed to fetch if auth is done (token might be null for guests, API handles auth)
    setIsLoading(true);
    setError(null);

    fetch(`/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), 
        },
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(errData => {
                throw new Error(errData.message || `Error: ${res.status}`);
            });
        }
        return res.json();
    })
    .then((data: ApiResponse) => {
        if (data.success && data.booking) {
        setBookingDetails(data.booking);
        } else {
        setError(data.message || "Could not retrieve booking details.");
        }
    })
    .catch(err => {
        console.error("Fetch error for booking details:", err);
        setError(err.message || "An unexpected error occurred.");
    })
    .finally(() => {
        setIsLoading(false);
    });
  }, [bookingId, token, authLoading]);

  if (isLoading || authLoading) { // Show spinner if fetching data OR if auth state is still loading
    return <PageLoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-semibold text-red-700 mb-4">Error Loading Booking</h1>
        <p className="text-gray-600 mb-8 text-lg">{error}</p>
        <div className="flex justify-center space-x-4">
            <Link href="/user/bookings" passHref>
                <Button variant="outline" size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" /> View My Bookings
                </Button>
            </Link>
            <Link href="/" passHref>
                <Button size="lg">
                    <HomeIcon className="mr-2 h-5 w-5" /> Back to Home
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-orange-400 mx-auto mb-6" />
        <h1 className="text-3xl font-semibold text-orange-600 mb-4">Booking Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">The requested booking could not be found. Please check the ID or contact support.</p>
         <div className="flex justify-center space-x-4">
            <Link href="/user/bookings" passHref>
                <Button variant="outline" size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" /> View My Bookings
                </Button>
            </Link>
            <Link href="/" passHref>
                <Button size="lg">
                    <HomeIcon className="mr-2 h-5 w-5" /> Back to Home
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  const isPaymentPending = bookingDetails.payment_status?.toLowerCase() === 'pending' && 
                           bookingDetails.status?.toLowerCase() !== 'cancelled' &&
                           bookingDetails.status?.toLowerCase() !== 'failed'; // Added more checks for clarity

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 max-w-3xl mx-auto border border-gray-200">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {bookingDetails.status === 'pending_payment' ? "Booking Pending Payment" : "Booking Confirmed!"}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Thank you for booking with us, {bookingDetails.guest_name}.
          </p>
          <p className="text-md text-gray-500 mt-1">Booking ID: <span className="font-semibold text-gray-700">{bookingDetails.id}</span></p>
        </div>

        {bookingDetails.primary_package_image && (
            <div className="my-6 rounded-lg overflow-hidden aspect-video max-h-64 mx-auto bg-gray-100">
                <img 
                    src={bookingDetails.primary_package_image} 
                    alt={`Image of ${bookingDetails.package_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { if (e.currentTarget.src !== '/images/placeholder.jpg') e.currentTarget.src = '/images/placeholder.jpg'; }}
                />
            </div>
        )}

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Package Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong>Package:</strong> {bookingDetails.package_name}</p>
              <p><strong>Category:</strong> {bookingDetails.category_name}</p>
              <p><strong>Travel Dates:</strong> {format(new Date(bookingDetails.start_date), 'PPP')} - {format(new Date(bookingDetails.end_date), 'PPP')}</p>
              <p><strong>Guests:</strong> {bookingDetails.total_people}</p>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Guest Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong>Name:</strong> {bookingDetails.guest_name}</p>
              <p><strong>Email:</strong> {bookingDetails.guest_email}</p>
              <p><strong>Phone:</strong> {bookingDetails.guest_phone}</p>
              {bookingDetails.special_requests && <p className="sm:col-span-2"><strong>Special Requests:</strong> {bookingDetails.special_requests}</p>}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Payment Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p><strong>Total Amount:</strong> <span className="font-bold text-lg text-blue-600">₹{bookingDetails.total_amount.toLocaleString('en-IN')}</span></p>
                <p><strong>Booking Status:</strong> <span className="font-semibold">{bookingDetails.status}</span></p>
                <p><strong>Payment Status:</strong> <span className="font-semibold">{bookingDetails.payment_status}</span></p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center space-y-4">
          {isPaymentPending && (
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={() => router.push(`/bookings/payment/${bookingId}`)}
            >
              <CreditCard className="mr-2 h-5 w-5" /> Pay Now
            </Button>
          )}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/user/bookings" passHref>
                <Button variant="outline" className="w-full sm:w-auto">
                    <ExternalLink className="mr-2 h-4 w-4" /> View My Bookings
                </Button>
            </Link>
            <Link href="/" passHref>
                <Button variant="ghost" className="w-full sm:w-auto">
                    <HomeIcon className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Exported Component
export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <BookingConfirmationPageContent />
    </Suspense>
  );
}
