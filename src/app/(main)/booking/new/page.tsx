// src/app/(main)/booking/new/page.tsx
// Changes:
// 1. Reduced padding on mobile for container and key sections.
// 2. Added scrollbar-hide to thumbnail gallery in ImageGallery.
// 3. Adjusted margins for headings/sections on mobile.
// 4. Corrected icon size props to remove TypeScript errors (removed invalid sm:size).

'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { Loader2, AlertTriangle, ArrowLeft, PackageIcon, TagIcon, UsersIcon, CreditCardIcon, InfoIcon, ImageIcon } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch'; // Assuming useFetch can be reused
import { PackageBookingForm } from '@/components/packages/PackageBookingForm'; // Import the form component

// --- Interfaces (mirroring or adapting from package detail page) ---
interface PackageCategory {
  id: number;
  category_name: string;
  price: number;
  hotel_details: string;
  category_description: string;
  max_pax_included_in_price: number;
  images: string[] | null; // Added images support
  // Add other relevant fields if necessary
}

interface PackageData {
  id: number;
  name: string;
  description?: string | null;
  number_of_days?: number | null; // Added field for number of days
  images_parsed?: string[]; // Added images support
  categories?: PackageCategory[];
  // Add other relevant fields like base_price, description, etc. if needed for display
}

// --- Theme Imports ---
import {
  neutralBgLight, neutralText, neutralTextLight, neutralBorder, neutralBorderLight, neutralBg,
  infoText, infoIconColor, infoBg, infoBorder,
  successText, successIconColor, successBg, successBorder, // For potential success messages
  errorText, errorIconColor, errorBg, errorBorder,
  buttonPrimaryStyle, buttonSecondaryStyleHero, // Using Hero for secondary for now
  cardBaseStyle, sectionPadding, sectionHeadingStyle,
  // inputBaseStyle and labelBaseStyle will be applied directly or via the form component
} from '@/styles/26themeandstyle';
// --- End Theme Imports ---


// --- Reusable Components (Themed) ---
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
      <Link href="/packages" className={`${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`}> {/* Error-specific button */}
        <ArrowLeft size={20} className="mr-2" /> Back to Packages
      </Link>
    )}
  </div>
);
// --- Image Display Components ---
const ImageGallery = ({ images, altText, className = "w-full h-48 object-cover rounded-lg" }: {
  images: string[] | null | undefined,
  altText: string,
  className?: string
}) => {
  if (!images || images.length === 0) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
        <ImageIcon size={32} className="text-gray-400" />
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
        // Added scrollbar-hide
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.slice(1, 5).map((img, idx) => ( // Show up to 4 thumbnails
            <Image
              key={idx}
              src={img}
              alt={`${altText} ${idx + 2}`}
              width={64} // Slightly smaller thumbnails
              height={48}
              className="w-16 h-12 object-cover rounded-md flex-shrink-0 border border-gray-200" // Added border
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
// --- End Reusable Components ---

function NewBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth(); // Use useAuth

  const packageId = searchParams.get('packageId');
  const categoryId = searchParams.get('categoryId');

  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch package details
  const packageApiUrl = packageId ? `/api/packages/${packageId}` : null;
  const { data: fetchedPackageData, error: fetchError, status: fetchStatus } = useFetch<PackageData>(packageApiUrl);

  useEffect(() => {
    // Do not proceed with data fetching if auth is still loading
    if (authIsLoading) {
      return;
    }

    if (!packageId || !categoryId) {
      setError("Package ID or Category ID is missing. Please select a package option again.");
      return;
    }

    if (fetchStatus === 'success' && fetchedPackageData) {
      setSelectedPackage(fetchedPackageData);
      const category = fetchedPackageData.categories?.find(cat => cat.id.toString() === categoryId);
      if (category) {
        setSelectedCategory(category);
        setError(null); // Clear previous errors
      } else {
        setError(`The selected category (ID: ${categoryId}) was not found for this package. It might be unavailable.`);
        setSelectedCategory(null); // Clear previous category
      }
    } else if (fetchStatus === 'error') {
      setError(fetchError?.message || `Failed to fetch package details for ID: ${packageId}.`);
      setSelectedPackage(null);
      setSelectedCategory(null);
    }
  }, [packageId, categoryId, fetchedPackageData, fetchStatus, fetchError, isAuthenticated, authIsLoading, router]);

  // Show loading spinner if auth is loading or data is fetching
  if (authIsLoading || (fetchStatus === 'loading' || fetchStatus === 'idle')) {
    return <LoadingSpinner message={authIsLoading ? "Authenticating..." : "Loading package details..."} />;
  }

  // If essential IDs are missing.
  if (!packageId || !categoryId) {
    // Error should have been set by useEffect, but this is a safeguard.
    return <ErrorDisplay message={error || "Package ID or Category ID is missing."} />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!selectedPackage || !selectedCategory) {
    return <ErrorDisplay message="Could not load the selected package or category details. Please try again." />;
  }

  return (
    // Reduced vertical padding on mobile for the whole page
    <div className={`${neutralBgLight} min-h-screen py-4 sm:py-8 md:py-12 lg:py-16 font-sans`}>
      {/* Reduced horizontal padding on mobile for the container */}
      <div className="container mx-auto px-2 sm:px-4">
        {/* Back to package link */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link
            href={packageId ? `/packages/${packageId}` : '/packages'}
            className={`${buttonPrimaryStyle} px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm bg-gray-50 hover:bg-gray-200 text-black-700 hover:text-black-900 border-gray-300 shadow-sm`}
          >
            <ArrowLeft size={16} className="mr-1 sm:mr-2" /> Back to Package Details
          </Link>
        </div>

        {/* Main content card - Reduced padding on mobile */}
        <div className={`${cardBaseStyle} p-3 sm:p-4 md:p-6 lg:p-10 shadow-xl`}>
          {/* Corrected Icon size prop - Use className for responsive size if needed */}
          <h1 className={`${sectionHeadingStyle} text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6 md:mb-8 flex items-center justify-center md:justify-start`}>
            <InfoIcon size={24} className={`mr-2 sm:mr-3 ${infoIconColor} w-5 h-5 sm:w-6 sm:h-6`} /> Confirm Your Booking
          </h1>

          {/* Package Summary Section - Reduced padding on mobile */}
          <section className={`mb-4 sm:mb-6 md:mb-10 p-3 sm:p-4 md:p-6 rounded-xl ${infoBg} border ${infoBorder} shadow-md`}>
            {/* Corrected Icon size prop */}
            <h2 className={`text-lg sm:text-xl font-semibold ${infoText} mb-3 sm:mb-4 md:mb-6 flex items-center`}>
              <PackageIcon size={20} className={`mr-2 sm:mr-3 ${infoIconColor} w-4 h-4 sm:w-5 sm:h-5`} /> Your Selection
            </h2>

            {/* Package Overview with Images */}
            <div className="space-y-4 sm:space-y-6">
              {/* Package Details and Main Image */}
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className={`text-base sm:text-lg font-medium ${neutralText} mb-1 sm:mb-1.5`}>{selectedPackage.name}</h3>
                    <p className={`text-xs ${neutralTextLight} mb-1 sm:mb-1.5`}>Package</p>
                    {selectedPackage.description && (
                      <p className={`text-xs ${neutralTextLight}`} style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{selectedPackage.description}</p>
                    )}
                  </div>

                  {/* Category details card - Reduced padding on mobile */}
                  <div className={`${cardBaseStyle} p-2 sm:p-3 md:p-4 bg-white`}>
                    {/* Corrected Icon size prop */}
                    <h4 className={`text-sm sm:text-base font-semibold ${neutralText} flex items-center mb-1 sm:mb-1.5`}>
                      <TagIcon size={16} className={`mr-1 sm:mr-2 ${infoIconColor} w-3.5 h-3.5 sm:w-4 sm:h-4`} /> {selectedCategory.category_name}
                    </h4>
                    <p className={`text-lg sm:text-xl font-bold ${successText} mb-1 sm:mb-1.5`}>
                      <span className="indian-rupee">₹</span>{selectedCategory.price.toLocaleString('en-IN')}
                      <span className={`text-xs font-normal ${neutralTextLight}`}> / person</span>
                    </p>
                    {selectedCategory.category_description && (
                      <p className={`text-xs ${neutralTextLight} mb-1 sm:mb-1.5`}>{selectedCategory.category_description}</p>
                    )}
                    {/* Corrected Icon size prop */}
                    <p className={`text-xs ${neutralTextLight} flex items-center mb-1 sm:mb-1.5`}>
                      <UsersIcon size={12} className={`mr-1 sm:mr-1.5 ${successIconColor} w-3 h-3`} />
                      Covers up to {selectedCategory.max_pax_included_in_price} person(s) at this price.
                    </p>
                    {selectedCategory.hotel_details && (
                      <p className={`text-xs ${neutralTextLight} border-t ${neutralBorderLight} pt-1 sm:pt-1.5`}>Hotel: {selectedCategory.hotel_details}</p>
                    )}
                  </div>
                </div>

                {/* Package Images */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    {/* Corrected Icon size prop */}
                    <h4 className={`text-xs sm:text-sm font-medium ${neutralText} mb-1 sm:mb-1.5 flex items-center`}>
                      <ImageIcon size={14} className={`mr-1 sm:mr-1.5 ${infoIconColor} w-3 h-3 sm:w-3.5 sm:h-3.5`} />
                      Package Gallery
                    </h4>
                    <ImageGallery
                      images={selectedPackage.images_parsed}
                      altText={selectedPackage.name}
                      // Adjusted height for mobile
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Category Images (if different from package images) */}
                  {selectedCategory.images && selectedCategory.images.length > 0 && (
                    <div>
                      {/* Corrected Icon size prop */}
                      <h4 className={`text-xs sm:text-sm font-medium ${neutralText} mb-1 sm:mb-1.5 flex items-center`}>
                        <TagIcon size={14} className={`mr-1 sm:mr-1.5 ${infoIconColor} w-3 h-3 sm:w-3.5 sm:h-3.5`} />
                        {selectedCategory.category_name} Images
                      </h4>
                      <ImageGallery
                        images={selectedCategory.images}
                        altText={selectedCategory.category_name}
                        // Adjusted height for mobile
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
            {/* Corrected Icon size prop */}
            <h2 className={`${sectionHeadingStyle} text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6 flex items-center`}>
              <CreditCardIcon size={20} className={`mr-2 sm:mr-3 ${successIconColor} w-4 h-4 sm:w-5 sm:h-5`} /> Guest & Payment Details
            </h2>
            {/* PackageBookingForm will need internal theming for labels, inputs, buttons */}
            <PackageBookingForm
              packageDetails={selectedPackage}
              categoryDetails={selectedCategory}
              user={user ? {
                id: user.id.toString(),
                name: user.first_name || undefined,
                email: user.email || undefined,
                phone: undefined
              } : null}
            // Theme prop removed, styling will be handled within PackageBookingForm
            />
          </section>

          {/* Authentication Status Section */}
          <section className={`text-xs ${neutralTextLight} border-t ${neutralBorder} pt-3 sm:pt-4 md:pt-6 mt-4 sm:mt-6 md:mt-8 text-center md:text-left`}> {/* Adjusted padding and margins */}
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

export default function NewBookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
      <NewBookingPageContent />
    </Suspense>
  );
}

