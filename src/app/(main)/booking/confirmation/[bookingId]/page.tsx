// src/app/(main)/booking/confirmation/[bookingId]/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle, ArrowLeft, CheckCircle, XCircle, PackageIcon, TagIcon, CalendarDaysIcon,
  UsersIcon, UserCircle2Icon, MailIcon, PhoneIcon, CreditCardIcon, FileTextIcon, ShoppingCartIcon, LandmarkIcon, InfoIcon,
  ListOrdered, HomeIcon, ExternalLinkIcon, PrinterIcon
} from 'lucide-react';
import Image from 'next/image';

// --- Theme Imports ---
// Assuming these variables are correctly defined in the imported file
// e.g., export const neutralBgLight = "bg-gray-50";
import {
  neutralBgLight, neutralText, neutralTextLight, neutralBorder, neutralBorderLight, neutralBg,
  infoText, infoIconColor, infoBg, infoBorder,
  successText, successIconColor, successBg, successBorder,
  errorText, errorIconColor, errorBg, errorBorder,
  warningText, warningIconColor, warningBg, warningBorder,
  buttonPrimaryStyle, buttonSecondaryStyleHero,
  cardBaseStyle, sectionPadding, sectionHeadingStyle,
} from '@/styles/26themeandstyle';
// --- End Theme Imports ---

interface BookingData {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number | null;
  phonepeTransactionId?: string | null;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  totalPeople?: number;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  specialRequests?: string | null;
  package?: {
    name: string;
  };
  packageCategory?: {
    name: string;
  };
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

const LoadingSpinner = ({ message = "Loading booking details..." }: { message?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight} ${sectionPadding}`}>
    <Image
      src="/images/loading.gif"
      alt="Loading..."
      width={128}
      height={128}
      priority
      className="mb-5"
    />
    <span className={`text-xl ${infoText} font-semibold`}>{message}</span>
    <p className={`${neutralTextLight} mt-1`}>Please wait a moment.</p>
  </div>
);

const ErrorDisplay = ({ title = "Error", message, showBackButton = true, backHref = "/packages" }: { title?: string, message: string, showBackButton?: boolean, backHref?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${sectionPadding} ${errorBg} border ${errorBorder} rounded-2xl m-4 md:m-8`}>
    <AlertTriangle className={`h-20 w-20 ${errorIconColor} mb-6`} />
    <h2 className={`text-3xl font-semibold ${errorText} mb-4`}>{title}</h2>
    <p className={`${neutralTextLight} mb-8 max-w-md`}>{message}</p>
    {showBackButton && (
      <Link href={backHref} className={`${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`}>
        <ArrowLeft size={20} className="mr-2" /> Back
      </Link>
    )}
  </div>
);

function BookingConfirmationContent() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is missing from the URL.");
      setLoading(false);
      return;
    }
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Corrected fetch URL: removed backslash before closing backtick
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
        setBooking(null);
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

  let title = "Booking Status";
  let messagePreamble = "";
  let IconComponent = InfoIcon;
  let iconColorClass = infoIconColor;
  let titleColorClass = infoText;
  let cardBgClass = infoBg;
  let cardBorderClass = infoBorder;

  if (booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID') {
    title = "Booking Confirmed!";
    messagePreamble = "Thank you! Your payment was successful and your booking is confirmed. A confirmation email with all details has been sent to your registered email address.";
    IconComponent = CheckCircle;
    iconColorClass = successIconColor;
    titleColorClass = successText;
    cardBgClass = successBg;
    cardBorderClass = successBorder;
  } else if (booking.status === 'FAILED' || booking.paymentStatus === 'FAILED') {
    title = booking.paymentStatus === 'FAILED' ? "Payment Failed" : "Booking Failed";
    messagePreamble = `Unfortunately, we could not complete your booking (ID: ${booking.id}). `;
    if (booking.paymentStatus === 'FAILED') messagePreamble += "The payment could not be processed. ";
    messagePreamble += "Please try booking again or contact our support team if the issue persists.";
    IconComponent = XCircle;
    iconColorClass = errorIconColor;
    titleColorClass = errorText;
    cardBgClass = errorBg;
    cardBorderClass = errorBorder;
  } else if (booking.status === 'PENDING_PAYMENT' || booking.paymentStatus === 'INITIATED' || booking.paymentStatus === 'PENDING') {
    title = "Booking Payment Pending";
    messagePreamble = `Your payment for booking ID ${booking.id} is still being processed or is pending confirmation. Please check back shortly. We will also notify you once the status is updated. If you have already completed the payment and this status persists, please contact support.`;
    IconComponent = AlertTriangle;
    iconColorClass = warningIconColor;
    titleColorClass = warningText;
    cardBgClass = warningBg;
    cardBorderClass = warningBorder;
  } else {
    messagePreamble = `Current status for booking ID ${booking.id}: Booking Status - ${booking.status}, Payment Status - ${booking.paymentStatus}. If you have any questions, please contact support.`;
  }

  return (
    <div className={`${neutralBgLight} min-h-screen ${sectionPadding}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        {/* IMPORTANT: For readability, ensure your card has an opaque background 
      if your main background image is busy.
      The existing `${cardBgClass}` should ideally provide this.
      If not, you might need to ensure it's something like 'bg-white' or 'bg-gray-800'
      depending on your theme, possibly with some opacity if desired (e.g., bg-white/90).
    */}
        <div className={`${cardBaseStyle} ${cardBgClass} border-2 ${cardBorderClass} p-0 shadow-xl`}>
          <div className="p-6 md:p-8 text-center">
            <IconComponent size={72} className={`mb-5 mx-auto ${iconColorClass}`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${titleColorClass} mb-4`}>
              {title}
            </h1>
            <p className={`${neutralText} text-base md:text-lg mb-6`}>{messagePreamble}</p>
          </div>
          <div className={`bg-white p-6 md:p-8 border-t-2 ${cardBorderClass} space-y-6`}>
            {/* Corrected className to use template literal properly */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b ${neutralBorderLight}`}>
              <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl mb-0 sm:mb-0`}>Booking Summary</h2>
              <p className={`${neutralTextLight} text-sm`}>ID: <span className={`font-semibold ${neutralText}`}>#{booking.id}</span></p>
            </div>
            <section>
              <h3 className={`text-lg font-semibold ${neutralText} mb-2 flex items-center`}>
                <PackageIcon size={20} className={`mr-2 ${infoIconColor}`} />Package Details
              </h3>
              <div className={`${neutralBg} p-4 rounded-lg border ${neutralBorder} text-sm`}>
                <p className={`font-medium ${neutralText}`}>{booking.package?.name || 'Package Name Not Available'}</p>
                <p className={`${neutralTextLight} flex items-center mt-1`}>
                  <TagIcon size={16} className={`mr-1.5 ${infoIconColor}`} /> {booking.packageCategory?.name || 'Category Not Available'}
                </p>
              </div>
            </section>

            {/* Key Details Grid - Replaced undefined 'neutralIconColor' with 'infoIconColor' */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-base">
              <div className="flex items-start">
                <CalendarDaysIcon size={18} className={`mr-2.5 mt-0.5 ${infoIconColor}`} /> {/* Was neutralIconColor */}
                <strong className={`${neutralText}`}>Travel Dates:</strong>
                <span className={`ml-1.5 ${neutralTextLight}`}>{formattedDate(booking.startDate)} - {formattedDate(booking.endDate)}</span>
              </div>
              <div className="flex items-start">
                <UsersIcon size={18} className={`mr-2.5 mt-0.5 ${infoIconColor}`} /> {/* Was neutralIconColor */}
                <strong className={`${neutralText}`}>Travelers:</strong>
                <span className={`ml-1.5 ${neutralTextLight}`}>{booking.totalPeople || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                <LandmarkIcon size={18} className={`mr-2.5 mt-0.5 ${infoIconColor}`} /> {/* Was neutralIconColor */}
                <strong className={`${neutralText}`}>Total Amount:</strong>
                <span className={`ml-1.5 font-semibold ${successText}`}>{totalAmountDisplay}</span>
              </div>
              <div className="flex items-start">
                <CreditCardIcon size={18} className={`mr-2.5 mt-0.5 ${infoIconColor}`} /> {/* Was neutralIconColor */}
                <strong className={`${neutralText}`}>Payment Status:</strong>
                <span className={`ml-1.5 font-semibold ${booking.paymentStatus === 'PAID' ? successText : warningText}`}>
                  {booking.paymentStatus || 'N/A'}
                </span>
              </div>
              {booking.phonepeTransactionId && (
                <div className="sm:col-span-2 flex items-start">
                  <FileTextIcon size={18} className={`mr-2.5 mt-0.5 ${infoIconColor}`} /> {/* Was neutralIconColor */}
                  <strong className={`${neutralText}`}>Payment ID:</strong>
                  <span className={`ml-1.5 ${neutralTextLight}`}>{booking.phonepeTransactionId}</span>
                </div>
              )}
              <div className="sm:col-span-2 flex items-start">
                <ShoppingCartIcon size={18} className={`mr-2.5 mt-0.5 ${infoIconColor}`} /> {/* Was neutralIconColor */}
                <strong className={`${neutralText}`}>Booking Status:</strong>
                <span className={`ml-1.5 font-semibold ${booking.status === 'CONFIRMED' ? successText : warningText}`}>
                  {booking.status || 'N/A'}
                </span>
              </div>
            </section>

            <section className={`pt-4 border-t ${neutralBorderLight}`}>
              <h3 className={`text-lg font-semibold ${neutralText} mb-2 flex items-center`}>
                <UserCircle2Icon size={20} className={`mr-2 ${infoIconColor}`} />Guest Information
              </h3>
              <div className={`space-y-1 text-sm ${neutralTextLight}`}>
                <p><strong className={`${neutralText}`}>Name:</strong> {booking.user?.name || booking.guestName || 'N/A'}</p>
                <p><strong className={`${neutralText}`}>Email:</strong> {booking.user?.email || booking.guestEmail || 'N/A'}</p>
                <p><strong className={`${neutralText}`}>Phone:</strong> {booking.guestPhone || 'N/A'}</p>
              </div>
            </section>
            {booking.specialRequests && (
              <section className={`pt-4 border-t ${neutralBorderLight}`}>
                <h3 className={`text-lg font-semibold ${neutralText} mb-2 flex items-center`}>
                  <InfoIcon size={18} className={`mr-2 ${infoIconColor}`} />Special Requests
                </h3>
                <p className={`text-sm ${neutralTextLight} ${neutralBg} p-3 rounded-md border ${neutralBorder} whitespace-pre-line`}>{booking.specialRequests}</p>
              </section>
            )}

            <div className={`mt-6 text-xs ${neutralTextLight} text-center border-t ${neutralBorderLight} pt-4`}>
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
    <div className={`${neutralBgLight} min-h-screen`}>
      <Suspense fallback={<LoadingSpinner message="Initializing booking confirmation..." />}>
        <BookingConfirmationContent />
      </Suspense>
    </div>
  );
}
