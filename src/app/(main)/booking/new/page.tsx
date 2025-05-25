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

// --- Reusable Components (Simplified for brevity, consider placing in a components folder) ---
const LoadingSpinner = ({ message = "Loading booking details..." }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <span className="text-lg text-gray-700">{message}</span>
  </div>
);

const ErrorDisplay = ({ title = "Error", message, showBackButton = true }: { title?: string, message: string, showBackButton?: boolean }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50">
    <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-600 mb-8 max-w-md">{message}</p>
    {showBackButton && (
      <Link href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center">
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
    // Redirect if not authenticated and auth loading is complete
    if (!authIsLoading && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
      return;
    }

    // Do not proceed with data fetching if auth is still loading or not authenticated
    if (authIsLoading || !isAuthenticated) {
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
  if (authIsLoading || (isAuthenticated && (fetchStatus === 'loading' || fetchStatus === 'idle'))) {
    return <LoadingSpinner message={authIsLoading ? "Authenticating..." : "Loading package details..."} />;
  }
  
  // If not authenticated after loading, it implies redirection is or should be happening.
  // Or, if essential IDs are missing.
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
    <div className="bg-gray-100 min-h-screen py-8 md:py-12 font-sans">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors group"
          >
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Confirm Your Booking</h1>
          
          <section className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
              <PackageIcon size={24} className="mr-3" /> Your Selection
            </h2>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">{selectedPackage.name}</h3>
                <p className="text-sm text-gray-500">Package</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border">
                <h4 className="text-md font-semibold text-gray-800 flex items-center mb-1">
                  <TagIcon size={18} className="mr-2 text-blue-600" /> {selectedCategory.category_name}
                </h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ₹{selectedCategory.price.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-500"> / person</span>
                </p>
                {selectedCategory.category_description && (
                  <p className="text-xs text-gray-600 mb-1">{selectedCategory.category_description}</p>
                )}
                <p className="text-xs text-gray-600 flex items-center">
                  <UsersIcon size={14} className="mr-1.5 text-green-500" /> 
                  Covers up to {selectedCategory.max_pax_included_in_price} person(s) at this price.
                </p>
                 {selectedCategory.hotel_details && (
                    <p className="text-xs text-gray-500 mt-1 border-t pt-1">Hotel: {selectedCategory.hotel_details}</p>
                )}
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCardIcon size={24} className="mr-3 text-green-600" /> Booking Details
            </h2>
            <PackageBookingForm
              packageDetails={selectedPackage}
              categoryDetails={selectedCategory}
              user={user} // Pass user from useAuth
            />
          </section>
          
          <section className="text-sm text-gray-500 border-t pt-4">
            {isAuthenticated && user?.email ? (
              <p>Logged in as: <span className="font-medium text-gray-700">{user.email}</span>. Not you? <Link href="/auth/signout" className="text-blue-600 hover:underline">Sign out</Link></p>
            ) : !authIsLoading && !isAuthenticated ? (
              <p>Please <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`} className="text-blue-600 hover:underline">sign in</Link> to complete your booking.</p>
            ) : null} 
            {/* Removed "Checking authentication status..." as loading spinner covers this */}
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
