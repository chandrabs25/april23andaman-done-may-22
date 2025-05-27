// src/app/(main)/booking/new/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { Loader2, AlertTriangle, ArrowLeft, PackageIcon, TagIcon, UsersIcon, CreditCardIcon, InfoIcon } from 'lucide-react';
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
  // Add other relevant fields if necessary
}

interface PackageData {
  id: number;
  name: string;
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
    <div className={`${neutralBgLight} min-h-screen ${sectionPadding} font-sans`}>
      <div className="container mx-auto px-4">
        {/* Back to package link - could be themed as a secondary button */}
        <div className="mb-6 md:mb-8">
          <Link 
            href={packageId ? `/packages/${packageId}` : '/packages'} 
            className={`${buttonSecondaryStyleHero} px-4 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm`} // Adjusted secondary button
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Package Details
          </Link>
        </div>

        {/* Main content card */}
        <div className={`${cardBaseStyle} p-6 md:p-8 lg:p-10 shadow-xl`}>
          <h1 className={`${sectionHeadingStyle} text-3xl md:text-4xl mb-8 justify-center md:justify-start`}>
            <InfoIcon size={28} className={`mr-3 ${infoIconColor}`} /> Confirm Your Booking
          </h1>
          
          {/* Package Summary Section - Themed as a contextual card */}
          <section className={`mb-8 md:mb-10 p-6 rounded-xl ${infoBg} border ${infoBorder} shadow-md`}>
            <h2 className={`text-2xl font-semibold ${infoText} mb-4 flex items-center`}>
              <PackageIcon size={24} className="mr-3" /> Your Selection
            </h2>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className={`text-lg font-medium ${neutralText}`}>{selectedPackage.name}</h3>
                <p className={`text-sm ${neutralTextLight}`}>Package</p>
              </div>
              {/* Category details card - nested card style */}
              <div className={`${cardBaseStyle} p-4 md:p-5 bg-white`}> {/* Override cardBaseStyle padding and bg */}
                <h4 className={`text-md font-semibold ${neutralText} flex items-center mb-1.5`}>
                  <TagIcon size={18} className={`mr-2 ${infoIconColor}`} /> {selectedCategory.category_name}
                </h4>
                <p className={`text-2xl font-bold ${successText} mb-2`}>
                  <span className="indian-rupee">₹</span>{selectedCategory.price.toLocaleString('en-IN')}
                  <span className={`text-sm font-normal ${neutralTextLight}`}> / person</span>
                </p>
                {selectedCategory.category_description && (
                  <p className={`text-xs ${neutralTextLight} mb-1.5`}>{selectedCategory.category_description}</p>
                )}
                <p className={`text-xs ${neutralTextLight} flex items-center`}>
                  <UsersIcon size={14} className={`mr-1.5 ${successIconColor}`} /> 
                  Covers up to {selectedCategory.max_pax_included_in_price} person(s) at this price.
                </p>
                 {selectedCategory.hotel_details && (
                    <p className={`text-xs ${neutralTextLight} mt-2 border-t ${neutralBorderLight} pt-2`}>Hotel: {selectedCategory.hotel_details}</p>
                )}
              </div>
            </div>
          </section>

          {/* Booking Form Section */}
          <section className="mb-8 md:mb-10">
            <h2 className={`${sectionHeadingStyle} text-2xl mb-6`}>
              <CreditCardIcon size={24} className={`mr-3 ${successIconColor}`} /> Guest & Payment Details
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
          <section className={`text-sm ${neutralTextLight} border-t ${neutralBorder} pt-6 mt-8 text-center md:text-left`}>
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
