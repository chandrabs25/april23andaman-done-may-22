'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertTriangle, ArrowLeft, HotelIcon, Bed, CalendarDaysIcon, UsersIcon, CreditCardIcon, InfoIcon } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { HotelBookingForm } from '@/components/hotels/HotelBookingForm';

// --- Theme Imports ---
import {
  neutralBgLight, neutralText, neutralTextLight, neutralBorder, neutralBorderLight, neutralBg,
  infoText, infoIconColor, infoBg, infoBorder,
  successText, successIconColor, successBg, successBorder,
  errorText, errorIconColor, errorBg, errorBorder,
  buttonPrimaryStyle, buttonSecondaryStyleHero,
  cardBaseStyle, sectionPadding, sectionHeadingStyle,
} from '@/styles/26themeandstyle';

// --- Interfaces ---
interface HotelRoomType {
  id: number;
  room_type: string;
  base_price: number;
  capacity: number;
  amenities?: string[];
  description?: string;
  images?: string[];
  room_size?: string;
  bed_type?: string;
  special_features?: string;
}

interface HotelData {
  id: number;
  name: string;
  description?: string;
  star_rating?: number;
  images_parsed?: string[];
  amenities_parsed?: string[];
  address?: string;
  island_name?: string;
  room_types?: HotelRoomType[];
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string;
}

// --- Components ---
const LoadingSpinner = ({ message = "Loading booking details..." }: { message?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight} ${sectionPadding}`}>
    <Loader2 className={`h-16 w-16 animate-spin ${infoIconColor} mb-5`} />
    <span className={`text-xl ${infoText} font-semibold`}>{message}</span>
    <p className={`${neutralTextLight} mt-1`}>Please wait a moment.</p>
  </div>
);

const ErrorDisplay = ({ title = "Error", message, showBackButton = true }: { title?: string, message: string, showBackButton?: boolean }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${sectionPadding} ${errorBg} border ${errorBorder} rounded-2xl m-4 md:m-8`}>
    <AlertTriangle className={`h-20 w-20 ${errorIconColor} mb-6`} />
    <h2 className={`text-3xl font-semibold ${errorText} mb-4`}>{title}</h2>
    <p className={`${neutralTextLight} mb-8 max-w-md`}>{message}</p>
    {showBackButton && (
      <Link href="/hotels" className={`${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`}>
        <ArrowLeft size={20} className="mr-2" /> Back to Hotels
      </Link>
    )}
  </div>
);

const ImageGallery = ({ images, altText, className = "w-full h-48 object-cover rounded-lg" }: {
  images: string[] | null | undefined,
  altText: string,
  className?: string
}) => {
  if (!images || images.length === 0) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
        <HotelIcon size={32} className="text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">No image available</span>
      </div>
    );
  }

  const primaryImage = images[0];
  return (
    <div className="space-y-2">
      <div className="relative">
        <Image
          src={primaryImage}
          alt={altText}
          width={400}
          height={300}
          className={`${className} rounded-lg`}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.jpg';
          }}
        />
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            +{images.length - 1} more
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.slice(1, 5).map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${altText} ${idx + 2}`}
              width={64}
              height={48}
              className="w-16 h-12 object-cover rounded-md flex-shrink-0 border border-gray-200"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function HotelBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();

  const hotelId = searchParams.get('hotelId');
  const roomTypeId = searchParams.get('roomTypeId');

  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<HotelRoomType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch hotel details
  const hotelApiUrl = hotelId ? `/api/hotels/${hotelId}` : null;
  const { data: fetchedHotelData, error: fetchError, status: fetchStatus } = useFetch<HotelData>(hotelApiUrl);

  useEffect(() => {
    if (authIsLoading) {
      return;
    }

    if (!hotelId || !roomTypeId) {
      setError("Hotel ID or Room Type ID is missing. Please select a room again.");
      return;
    }

    if (fetchStatus === 'success' && fetchedHotelData) {
      setSelectedHotel(fetchedHotelData);
      const roomType = fetchedHotelData.room_types?.find(rt => rt.id.toString() === roomTypeId);
      if (roomType) {
        setSelectedRoomType(roomType);
        setError(null);
      } else {
        setError(`The selected room type (ID: ${roomTypeId}) was not found for this hotel. It might be unavailable.`);
        setSelectedRoomType(null);
      }
    } else if (fetchStatus === 'error') {
      setError(fetchError?.message || `Failed to fetch hotel details for ID: ${hotelId}.`);
      setSelectedHotel(null);
      setSelectedRoomType(null);
    }
  }, [hotelId, roomTypeId, fetchedHotelData, fetchStatus, fetchError, isAuthenticated, authIsLoading, router]);

  if (authIsLoading || (fetchStatus === 'loading' || fetchStatus === 'idle')) {
    return <LoadingSpinner message={authIsLoading ? "Authenticating..." : "Loading hotel details..."} />;
  }

  if (!hotelId || !roomTypeId) {
    return <ErrorDisplay message={error || "Hotel ID or Room Type ID is missing."} />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!selectedHotel || !selectedRoomType) {
    return <ErrorDisplay message="Could not load the selected hotel or room type details. Please try again." />;
  }

  return (
    <div className={`${neutralBgLight} min-h-screen py-4 sm:py-8 md:py-12 lg:py-16 font-sans`}>
      <div className="container mx-auto px-2 sm:px-4">
        {/* Back to hotel link */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link
            href={hotelId ? `/hotels/${hotelId}` : '/hotels'}
            className={`${buttonPrimaryStyle} px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm bg-gray-50 hover:bg-gray-200 text-black-700 hover:text-black-900 border-gray-300 shadow-sm`}
          >
            <ArrowLeft size={16} className="mr-1 sm:mr-2" /> Back to Hotel Details
          </Link>
        </div>

        {/* Main content card */}
        <div className={`${cardBaseStyle} p-3 sm:p-4 md:p-6 lg:p-10 shadow-xl`}>
          <h1 className={`${sectionHeadingStyle} text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6 md:mb-8 flex items-center justify-center md:justify-start`}>
            <InfoIcon size={24} className={`mr-2 sm:mr-3 ${infoIconColor} w-5 h-5 sm:w-6 sm:h-6`} /> Confirm Your Hotel Booking
          </h1>

          {/* Hotel Summary Section */}
          <section className={`mb-4 sm:mb-6 md:mb-10 p-3 sm:p-4 md:p-6 rounded-xl ${infoBg} border ${infoBorder} shadow-md`}>
            <h2 className={`text-lg sm:text-xl font-semibold ${infoText} mb-3 sm:mb-4 md:mb-6 flex items-center`}>
              <HotelIcon size={20} className={`mr-2 sm:mr-3 ${infoIconColor} w-4 h-4 sm:w-5 sm:h-5`} /> Your Selection
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Hotel Details */}
                  <div>
                    <h3 className={`text-base sm:text-lg font-medium ${neutralText} mb-1 sm:mb-1.5`}>{selectedHotel.name}</h3>
                    <p className={`text-xs ${neutralTextLight} mb-1 sm:mb-1.5`}>Hotel</p>
                    {selectedHotel.description && (
                      <p className={`text-xs ${neutralTextLight}`} style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{selectedHotel.description}</p>
                    )}
                  </div>

                  {/* Room details card */}
                  <div className={`${cardBaseStyle} p-2 sm:p-3 md:p-4 bg-white`}>
                    <h4 className={`text-sm sm:text-base font-semibold ${neutralText} flex items-center mb-1 sm:mb-1.5`}>
                      <Bed size={16} className={`mr-1 sm:mr-2 ${infoIconColor} w-3.5 h-3.5 sm:w-4 sm:h-4`} /> {selectedRoomType.room_type}
                    </h4>
                    <p className={`text-lg sm:text-xl font-bold ${successText} mb-1 sm:mb-1.5`}>
                      <span className="indian-rupee">₹</span>{selectedRoomType.base_price.toLocaleString('en-IN')}
                      <span className={`text-xs font-normal ${neutralTextLight}`}> / night</span>
                    </p>
                    {selectedRoomType.description && (
                      <p className={`text-xs ${neutralTextLight} mb-1 sm:mb-1.5`}>{selectedRoomType.description}</p>
                    )}
                    <p className={`text-xs ${neutralTextLight} flex items-center mb-1 sm:mb-1.5`}>
                      <UsersIcon size={12} className={`mr-1 sm:mr-1.5 ${successIconColor} w-3 h-3`} />
                      Up to {selectedRoomType.capacity} guests
                    </p>
                    {selectedRoomType.amenities && selectedRoomType.amenities.length > 0 && (
                      <div className={`text-xs ${neutralTextLight} border-t ${neutralBorderLight} pt-1 sm:pt-1.5`}>
                        <strong>Amenities:</strong> {selectedRoomType.amenities.slice(0, 3).join(', ')}
                        {selectedRoomType.amenities.length > 3 && '...'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hotel Images */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${neutralText} mb-1 sm:mb-1.5 flex items-center`}>
                      <HotelIcon size={14} className={`mr-1 sm:mr-1.5 ${infoIconColor} w-3 h-3 sm:w-3.5 sm:h-3.5`} />
                      Hotel Gallery
                    </h4>
                    <ImageGallery
                      images={selectedHotel.images_parsed}
                      altText={selectedHotel.name}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Room Images (if different from hotel images) */}
                  {selectedRoomType.images && selectedRoomType.images.length > 0 && (
                    <div>
                      <h4 className={`text-xs sm:text-sm font-medium ${neutralText} mb-1 sm:mb-1.5 flex items-center`}>
                        <Bed size={14} className={`mr-1 sm:mr-1.5 ${infoIconColor} w-3 h-3 sm:w-3.5 sm:h-3.5`} />
                        {selectedRoomType.room_type} Images
                      </h4>
                      <ImageGallery
                        images={selectedRoomType.images}
                        altText={selectedRoomType.room_type}
                        className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Booking Form Section */}
          <section className="mb-4 sm:mb-6 md:mb-10">
            <h2 className={`${sectionHeadingStyle} text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6 flex items-center`}>
              <CreditCardIcon size={20} className={`mr-2 sm:mr-3 ${successIconColor} w-4 h-4 sm:w-5 sm:h-5`} /> Booking & Payment Details
            </h2>
            <HotelBookingForm
              hotelDetails={selectedHotel}
              roomTypeDetails={selectedRoomType}
              user={user ? {
                id: user.id.toString(),
                name: user.first_name || undefined,
                email: user.email || undefined,
                phone: undefined
              } : null}
            />
          </section>

          {/* Authentication Status Section */}
          <section className={`text-xs ${neutralTextLight} border-t ${neutralBorder} pt-3 sm:pt-4 md:pt-6 mt-4 sm:mt-6 md:mt-8 text-center md:text-left`}>
            {isAuthenticated && user?.email ? (
              <p>Logged in as: <span className={`font-medium ${neutralText}`}>{user.email}</span>. Not you? <Link href="/auth/signout" className={`${infoText} hover:underline`}>Sign out</Link></p>
            ) : !authIsLoading && !isAuthenticated ? (
              <p>Please <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`} className={`${infoText} hover:underline font-medium`}>sign in</Link> to complete your booking or continue as guest.</p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function HotelBookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
      <HotelBookingPageContent />
    </Suspense>
  );
} 