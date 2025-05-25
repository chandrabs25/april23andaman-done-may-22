// src/app/(main)/booking/confirmation/[bookingId]/page.tsx
'use client';
export const dynamic = 'force-dynamic'; // Ensure dynamic rendering for session/data fetching

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation'; // Removed useRouter
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import {
  Loader2, AlertTriangle, ArrowLeft, CheckCircle, PackageIcon, TagIcon, CalendarDaysIcon,
  UsersIcon, UserCircle2Icon, MailIcon, PhoneIcon, CreditCardIcon, FileTextIcon, ShoppingCartIcon, LandmarkIcon
} from 'lucide-react';

// --- Interfaces ---
interface BookingDetails {
  booking_id: number;
  package_id: number;
  package_category_id: number;
  user_id: number | null;
  total_people: number;
  start_date: string; // Assuming YYYY-MM-DD
  end_date: string;   // Assuming YYYY-MM-DD
  booking_status: string;
  total_amount: number;
  payment_status: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests: string | null;
  booking_created_at: string; // Assuming ISO string
  package_name: string;
  package_category_name: string;
  category_price_per_person: number;
}

// --- Reusable Components (Consider moving to a shared components folder) ---
const LoadingSpinner = ({ message = "Loading booking confirmation..." }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <span className="text-lg text-gray-700">{message}</span>
  </div>
);

const ErrorDisplay = ({ title = "Error", message, showBackButton = true, backHref = "/packages" }: { title?: string, message: string, showBackButton?: boolean, backHref?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50">
    <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-600 mb-8 max-w-md">{message}</p>
    {showBackButton && (
      <Link href={backHref} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center">
        <ArrowLeft size={20} className="mr-2" /> Back
      </Link>
    )}
  </div>
);
// --- End Reusable Components ---

function BookingConfirmationContent() {
  const params = useParams();
  // const router = useRouter(); // Unused
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth(); // Use useAuth
  const bookingId = params.bookingId as string;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to be determined before fetching if user context is strictly needed for the fetch call,
    // or if the fetch should only proceed for authenticated users.
    // Given the API itself protects the data, we might not need to block fetching on authIsLoading,
    // but it's good practice if the page shouldn't be shown at all to unauthenticated users.
    // For this page, the API does the heavy lifting of auth for data access.
    // We'll keep a check for authIsLoading primarily for the UI loading state.

    if (!bookingId) {
      setError("Booking ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        // Assume 'data' can be of BookingDetails type on success, or { message: string } on error
        const data = await response.json() as BookingDetails | { message?: string };

        if (!response.ok) {
          // Type guard to check if 'message' exists on data
          const errorMessage = (data as { message?: string })?.message || `Failed to fetch booking (Status: ${response.status})`;
          throw new Error(errorMessage);
        }
        setBookingDetails(data as BookingDetails); // Assert to BookingDetails after ok check
      } catch (err: any) {
        // console.error("Fetch booking error:", err);
        setError(err.message || "An unexpected error occurred while fetching booking details.");
      }
      setLoading(false);
    };

    fetchBookingDetails();
  }, [bookingId]); // Removed authStatus from dependencies as API handles auth for data access

  const handlePayNow = () => {
    alert(`Pay Now clicked for booking ID: ${bookingId}. Payment integration is pending.`);
    // console.log(`Pay Now clicked for booking ID: ${bookingId}`);
    // Future: router.push(`/payment?bookingId=${bookingId}`);
  };

  if (loading || authIsLoading) { // Check authIsLoading as well
    return <LoadingSpinner message={authIsLoading ? "Verifying session..." : "Loading booking confirmation..."} />;
  }

  if (error) {
    return <ErrorDisplay title="Booking Not Found" message={error} backHref="/user/dashboard" />;
  }

  if (!bookingDetails) {
    // This case should ideally be covered by error state, but as a safeguard:
    return <ErrorDisplay title="Booking Details Unavailable" message="Could not retrieve booking details at this time." backHref="/user/dashboard"/>;
  }
  
  const formattedDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gray-100 min-h-screen py-8 md:py-12 font-sans">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/user/dashboard" className="text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors group">
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b">
              <h1 className="text-2xl md:text-3xl font-bold text-green-600 flex items-center mb-2 sm:mb-0">
                <CheckCircle size={30} className="mr-3" /> Booking Confirmed!
              </h1>
              <p className="text-sm text-gray-500">Booking ID: <span className="font-semibold text-gray-700">#{bookingDetails.booking_id}</span></p>
            </div>

            {/* Package & Category Info */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><PackageIcon size={22} className="mr-2 text-blue-600"/>Package Details</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-lg font-medium text-gray-700">{bookingDetails.package_name}</p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <TagIcon size={16} className="mr-1.5 text-blue-500" /> {bookingDetails.package_category_name}
                </p>
              </div>
            </section>

            {/* Key Details Grid */}
            <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="flex items-center">
                <CalendarDaysIcon size={18} className="mr-2.5 text-gray-500"/>
                <span className="font-medium text-gray-700">Travel Dates:</span>
                <span className="ml-1.5 text-gray-600">{formattedDate(bookingDetails.start_date)} - {formattedDate(bookingDetails.end_date)}</span>
              </div>
              <div className="flex items-center">
                <UsersIcon size={18} className="mr-2.5 text-gray-500"/>
                <span className="font-medium text-gray-700">Travelers:</span>
                <span className="ml-1.5 text-gray-600">{bookingDetails.total_people}</span>
              </div>
               <div className="flex items-center">
                <LandmarkIcon size={18} className="mr-2.5 text-gray-500"/>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <span className="ml-1.5 text-gray-600 font-semibold">₹{bookingDetails.total_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center">
                <CreditCardIcon size={18} className="mr-2.5 text-gray-500"/>
                <span className="font-medium text-gray-700">Payment Status:</span>
                <span className={`ml-1.5 text-gray-600 font-semibold ${bookingDetails.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{bookingDetails.payment_status}</span>
              </div>
              <div className="sm:col-span-2 flex items-center">
                <ShoppingCartIcon size={18} className="mr-2.5 text-gray-500"/>
                <span className="font-medium text-gray-700">Booking Status:</span>
                <span className="ml-1.5 text-gray-600">{bookingDetails.booking_status}</span>
              </div>
            </section>

            {/* Guest Information */}
            <section className="mb-6 pt-4 border-t">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><UserCircle2Icon size={22} className="mr-2 text-blue-600"/>Guest Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong className="font-medium text-gray-700 w-24 inline-block">Name:</strong> {bookingDetails.guest_name}</p>
                <p><strong className="font-medium text-gray-700 w-24 inline-block">Email:</strong> {bookingDetails.guest_email}</p>
                <p><strong className="font-medium text-gray-700 w-24 inline-block">Phone:</strong> {bookingDetails.guest_phone}</p>
              </div>
            </section>

            {/* Special Requests */}
            {bookingDetails.special_requests && (
              <section className="mb-8 pt-4 border-t">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><FileTextIcon size={20} className="mr-2 text-blue-600"/>Special Requests</h2>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border whitespace-pre-line">{bookingDetails.special_requests}</p>
              </section>
            )}

            {/* Pay Now Button & Message */}
            {bookingDetails.payment_status !== 'paid' && (
              <section className="mt-8 pt-6 border-t text-center">
                <p className="text-gray-700 mb-4">
                  Your booking is confirmed. To finalize your reservation, please proceed with the payment.
                </p>
                <button 
                  onClick={handlePayNow}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-10 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Pay Now (₹{bookingDetails.total_amount.toLocaleString('en-IN')})
                </button>
                <p className="text-xs text-gray-500 mt-3">You will be redirected to our secure payment gateway (simulation).</p>
              </section>
            )}
            {bookingDetails.payment_status === 'paid' && (
                 <section className="mt-8 pt-6 border-t text-center">
                    <p className="text-green-600 font-semibold text-lg flex items-center justify-center"><CheckCircle size={24} className="mr-2"/> Payment successfully completed for this booking.</p>
                    <p className="text-sm text-gray-600 mt-2">Thank you for choosing us! Your travel documents will be sent to you shortly.</p>
                 </section>
            )}

            <div className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
              Booked on: {new Date(bookingDetails.booking_created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams and other client hooks
export default function BookingConfirmationPage() {
  return (
    // Suspense is good for client components that suspend (e.g. useSearchParams, useSession)
    // However, primary data fetching is handled by useEffect here.
    // A top-level Suspense can be useful if parts of the page use useSearchParams directly for rendering.
    <Suspense fallback={<LoadingSpinner message="Initializing page..." />}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
