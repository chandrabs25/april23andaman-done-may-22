'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../../../hooks/useAuth'; // Correct path from src/app/(main)/bookings/create/
import BookingForm from '../../../components/BookingForm'; // Correct path from src/app/(main)/bookings/create/
import Link from 'next/link';
import { ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

// Define interfaces for the expected data structures
interface PackageDetails {
  id: string; 
  name: string;
  primary_image?: string;
}

interface CategoryDetails {
  category_name: string; 
  price: number;
}

interface BookingContextResponse {
  success: boolean;
  packageDetails?: PackageDetails;
  categoryDetails?: CategoryDetails;
  message?: string;
}

const PageLoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
    <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-6" />
    <p className="text-xl text-gray-700">Loading Page...</p>
  </div>
);

function CreateBookingPageContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');
  const categoryNameParam = searchParams.get('categoryId'); 

  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading, token } = useAuth();

  useEffect(() => {
    if (!packageId || !categoryNameParam) {
      setError('Package or category information is missing in the URL.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/booking-context?packageId=${packageId}&categoryName=${encodeURIComponent(categoryNameParam)}`)
      .then(res => {
        if (!res.ok) {
          // Try to parse error response body if available for more specific message
          return res.json().then(errData => { // errData here is from error response
            throw new Error(errData.message || `Failed to fetch booking context (${res.status})`);
          }).catch(() => { // Fallback if error response isn't JSON or res.json() fails
            throw new Error(`Failed to fetch booking context (${res.status})`);
          });
        }
        return res.json(); // Type assertion can be done here: as Promise<BookingContextResponse>
      })
      .then((data: BookingContextResponse) => { // Or explicitly type data here (current approach)
        if (data.success && data.packageDetails && data.categoryDetails) {
          setPackageDetails(data.packageDetails);
          setCategoryDetails({ ...data.categoryDetails, category_name: data.categoryDetails.category_name || categoryNameParam });
        } else {
          setError(data.message || 'Could not retrieve complete booking details.');
        }
      })
      .catch((err: any) => { // Typed err here
        console.error("Fetch error for booking context:", err);
        setError(err.message || 'An unexpected error occurred while fetching booking details.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [packageId, categoryNameParam]);

  if (isLoading || authLoading) {
    return <PageLoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-red-700 mb-3">Booking Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
          <ArrowRight size={20} className="mr-2 inline-block transform rotate-180" />
          Browse Packages
        </Link>
      </div>
    );
  }

  if (!packageDetails || !categoryDetails) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-orange-600 mb-3">Information Incomplete</h1>
        <p className="text-gray-600 mb-6">Could not load all necessary details for the booking. Please ensure the link is correct or try selecting the package again.</p>
        <Link href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
           <ArrowRight size={18} className="mr-2 inline-block transform rotate-180" />
           Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/packages/${packageId}`} className="text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors group">
          <ArrowRight size={18} className="mr-2 transform rotate-180 transition-transform group-hover:-translate-x-1" />
          Back to Package Details
        </Link>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Confirm Your Booking</h1>
      
      <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6 md:p-8 mb-8">
        <div className="md:flex md:items-start">
          {packageDetails.primary_image && (
            <img 
              src={packageDetails.primary_image} 
              alt={`Image of ${packageDetails.name}`}
              className="w-full md:w-64 h-auto object-cover rounded-lg mb-6 md:mb-0 md:mr-8 border border-gray-200"
              onError={(e) => { if (e.currentTarget.src !== '/images/placeholder.jpg') e.currentTarget.src = '/images/placeholder.jpg'; }}
            />
          )}
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{packageDetails.name}</h2>
            <p className="text-lg text-blue-600 font-medium mb-1">
              Selected Option: <span className="font-semibold">{categoryDetails.category_name}</span>
            </p>
            <p className="text-2xl text-green-600 font-bold mb-4">
              Price: ₹{categoryDetails.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <BookingForm
        packageId={packageId as string}
        categoryId={categoryNameParam as string} 
        categoryDetails={categoryDetails}
        packageSummary={{ name: packageDetails.name, image: packageDetails.primary_image || '/images/placeholder.jpg' }}
        isUserLoggedIn={!!user}
        loggedInUserDetails={user}
        authToken={token}
      />
    </div>
  );
}

export default function CreateBookingPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <CreateBookingPageContent />
    </Suspense>
  );
}
