// src/app/(main)/booking/confirmation/[bookingId]/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// Button, Card, etc. would be imported from '@/components/ui/...' if using shadcn/ui
// For this example, basic HTML and inline styles will represent structure
import {
  Loader2, AlertTriangle, ArrowLeft, CheckCircle, XCircle, PackageIcon, TagIcon, CalendarDaysIcon,
  UsersIcon, UserCircle2Icon, MailIcon, PhoneIcon, CreditCardIcon, FileTextIcon, ShoppingCartIcon, LandmarkIcon, InfoIcon,
  ListOrdered,
  HomeIcon
} from 'lucide-react';

// --- Updated Interface ---
// This interface should match the data structure returned by the (hypothetical) /api/bookings/[bookingId] endpoint
interface BookingData {
  id: string; // merchantTransactionId
  status: string; // e.g., CONFIRMED, FAILED, PENDING_PAYMENT
  paymentStatus: string; // e.g., PAID, FAILED, INITIATED, PENDING
  totalAmount: number | null; // In Paise
  phonepeTransactionId?: string | null;
  createdAt: string; // ISO string
  startDate?: string;
  endDate?: string;
  totalPeople?: number;
  guestName?: string | null;
  guestEmail?: string | null;
  guestMobile?: string | null;
  specialRequests?: string | null;

  // Assuming relational data is included by the API:
  package?: {
    name: string;
  };
  packageCategory?: {
    name: string;
    // pricePerPerson?: number; // If needed
  };
  user?: { // If a user was logged in
    name?: string | null;
    email?: string | null;
  };
}


// --- Reusable Components (Keep or move as needed) ---
const LoadingSpinner = ({ message = "Loading booking confirmation..." }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <span className="text-lg text-gray-700 text-center">{message}</span>
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
  const bookingId = params.bookingId as string; // This is the merchantTransactionId

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement booking download as PDF functionality
  // TODO: Implement sending booking details mail to the user functionality
  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      console.log("INFO: An API endpoint at /api/bookings/[bookingId] is required to fetch booking details for this client component.");
      try {
        // This API endpoint needs to be created.
        // It should fetch booking by ID (which is merchantTransactionId) and include package, packageCategory, user details.
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`;
          try {
            const errorData = await response.json() as { message?: string };
            errorMessage = errorData?.message || errorMessage;
          } catch (e) { /* response not JSON */ }
          throw new Error(errorMessage);
        }
        const data: BookingData = await response.json();
        setBooking(data);
      } catch (err: any) {
        console.error("Fetch booking error:", err);
        setError(err.message || "An unexpected error occurred while fetching booking details.");
        setBooking(null); // Ensure no stale data is shown
      }
      setLoading(false);
    };

    fetchBookingDetails();
  }, [bookingId]);


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay title="Booking Retrieval Failed" message={error} backHref="/user/bookings" />;
  }

  if (!booking) {
    return <ErrorDisplay title="Booking Not Found" message={`We could not find a booking with the ID: ${bookingId}. Please check the ID or contact support.`} backHref="/user/bookings" />;
  }
  
  const formattedDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const totalAmountDisplay = booking.totalAmount ? (booking.totalAmount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'N/A';

  // Conditional Rendering Logic
  let title = "Booking Status";
  let messagePreamble = "";
  let icon = <InfoIcon size={30} className="mr-3 text-blue-600" />;
  let cardClass = "bg-white rounded-xl shadow-xl overflow-hidden"; // Default card
  let actions = (
    <>
      <Link href="/user/bookings" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center mr-2">
        <ListOrdered size={20} className="mr-2" /> My Bookings
      </Link>
      <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
        <HomeIcon size={20} className="mr-2" /> Homepage
      </Link>
    </>
  );

  if (booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID') {
    title = "Booking Confirmed!";
    messagePreamble = "Thank you! Your payment was successful and your booking is confirmed.";
    icon = <CheckCircle size={30} className="mr-3 text-green-600" />;
    cardClass = "bg-green-50 rounded-xl shadow-xl overflow-hidden border border-green-200";
    actions = (
      <>
        <Link href="/user/bookings" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center mr-2">
          <ListOrdered size={20} className="mr-2" /> View My Bookings
        </Link>
        <Link href="/" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center">
         <HomeIcon size={20} className="mr-2" /> Go to Homepage
        </Link>
      </>
    );
  } else if (booking.status === 'FAILED' || booking.paymentStatus === 'FAILED') {
    title = booking.paymentStatus === 'FAILED' ? "Payment Failed" : "Booking Failed";
    messagePreamble = `Unfortunately, we could not complete your booking (ID: ${booking.id}). `;
    if (booking.paymentStatus === 'FAILED') messagePreamble += "The payment could not be processed. ";
    messagePreamble += "Please try booking again or contact our support team if the issue persists.";
    icon = <XCircle size={30} className="mr-3 text-red-600" />;
    cardClass = "bg-red-50 rounded-xl shadow-xl overflow-hidden border border-red-200";
    actions = (
      <>
        <Link href="/packages" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center mr-2">
          Try Booking Again
        </Link>
        <Link href="/contact" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center">
          Contact Support
        </Link>
      </>
    );
  } else if (booking.status === 'PENDING_PAYMENT' || booking.paymentStatus === 'INITIATED' || booking.paymentStatus === 'PENDING') {
    title = "Booking Payment Pending";
    messagePreamble = `Your payment for booking ID ${booking.id} is still being processed or is pending confirmation. Please check back shortly. We will also notify you once the status is updated. If you have already completed the payment and this status persists, please contact support.`;
    icon = <AlertTriangle size={30} className="mr-3 text-yellow-600" />;
    cardClass = "bg-yellow-50 rounded-xl shadow-xl overflow-hidden border border-yellow-200";
     actions = (
      <>
        <Link href="/user/bookings" className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors inline-flex items-center mr-2">
          <ListOrdered size={20} className="mr-2" /> Check My Bookings
        </Link>
        <Link href="/contact" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center">
          Contact Support
        </Link>
      </>
    );
  } else { // Other statuses
     messagePreamble = `Current status for booking ID ${booking.id}: Booking Status - ${booking.status}, Payment Status - ${booking.paymentStatus}. If you have any questions, please contact support.`;
  }


  return (
    <div className="bg-gray-100 min-h-screen py-8 md:py-12 font-sans">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/user/bookings" className="text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors group">
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to My Bookings
          </Link>
        </div>

        {/* Using Card-like structure with Tailwind classes */}
        <div className={cardClass}>
          <div className="p-6 md:p-8"> {/* CardHeader equivalent */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-2 sm:mb-0">
                {icon} {title}
              </h1>
              <p className="text-sm text-gray-500">Booking ID: <span className="font-semibold text-gray-700">#{booking.id}</span></p>
            </div>
            
            {/* CardContent equivalent */}
            <div className="space-y-4">
                <p className="text-gray-700">{messagePreamble}</p>

                {/* Package & Category Info */}
                <section className="pt-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><PackageIcon size={20} className="mr-2 text-blue-500"/>Package Details</h3>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium text-gray-700">{booking.package?.name || 'Package Name Not Available'}</p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <TagIcon size={15} className="mr-1.5 text-blue-400" /> {booking.packageCategory?.name || 'Category Not Available'}
                    </p>
                  </div>
                </section>

                {/* Key Details Grid */}
                <section className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div className="flex items-center"><CalendarDaysIcon size={17} className="mr-2 text-gray-500"/><strong>Travel Dates:</strong><span className="ml-1.5">{formattedDate(booking.startDate)} - {formattedDate(booking.endDate)}</span></div>
                  <div className="flex items-center"><UsersIcon size={17} className="mr-2 text-gray-500"/><strong>Travelers:</strong><span className="ml-1.5">{booking.totalPeople || 'N/A'}</span></div>
                  <div className="flex items-center"><LandmarkIcon size={17} className="mr-2 text-gray-500"/><strong>Total Amount:</strong><span className="ml-1.5 font-semibold">{totalAmountDisplay}</span></div>
                  <div className="flex items-center"><CreditCardIcon size={17} className="mr-2 text-gray-500"/><strong>Payment Status:</strong><span className={`ml-1.5 font-semibold ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>{booking.paymentStatus || 'N/A'}</span></div>
                  {booking.phonepeTransactionId && <div className="flex items-center sm:col-span-2"><FileTextIcon size={17} className="mr-2 text-gray-500"/><strong>Payment ID:</strong><span className="ml-1.5">{booking.phonepeTransactionId}</span></div>}
                  <div className="sm:col-span-2 flex items-center"><ShoppingCartIcon size={17} className="mr-2 text-gray-500"/><strong>Booking Status:</strong><span className="ml-1.5">{booking.status || 'N/A'}</span></div>
                </section>

                {/* Guest Information */}
                <section className="pt-3 border-t">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><UserCircle2Icon size={20} className="mr-2 text-blue-500"/>Guest Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {booking.user?.name || booking.guestName || 'N/A'}</p>
                    <p><strong>Email:</strong> {booking.user?.email || booking.guestEmail || 'N/A'}</p>
                    <p><strong>Phone:</strong> {booking.guestMobile || 'N/A'}</p>
                  </div>
                </section>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <section className="pt-3 border-t">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FileTextIcon size={18} className="mr-2 text-blue-500"/>Special Requests</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border whitespace-pre-line">{booking.specialRequests}</p>
                  </section>
                )}
            </div>
            
            {/* CardFooter equivalent */}
            <div className="mt-8 pt-6 border-t text-center">
                {actions}
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center border-t pt-3">
              Booked on: {new Date(booking.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Initializing booking confirmation..." />}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
