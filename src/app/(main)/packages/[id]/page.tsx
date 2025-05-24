// Path: .\src\app\packages\[id]\page.tsx
'use client';
export const dynamic = 'force-dynamic'
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Clock, Users, Check, Info, ArrowRight, Loader2, AlertTriangle, Utensils, BedDouble, ListChecks, ShieldX, PackageIcon, TagIcon, HotelIcon, UserCheckIcon, FileTextIcon } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

// --- Interfaces (Assume these are correct and match API/DB) ---
interface ItineraryActivity {
  name: string;
  time: string;
  duration: string;
}
interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: ItineraryActivity[];
  meals: string[];
  accommodation: string;
}

// Define PackageCategory interface locally for use in PackageDataFromApi
interface PackageCategory {
  category_name: string;
  price: number;
  hotel_details: string;
  category_description: string;
  max_pax_included_in_price: number;
  images: string[];
}

// Updated PackageData interface
interface PackageDataFromApi {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  created_by: number; // Assuming this is still relevant
  is_active: number;  // Assuming this is still relevant
  created_at: string;
  updated_at: string;
  cancellation_policy: string | null;
  
  // Fields assumed to be pre-parsed by the backend
  images_parsed: string[] | null; 
  itinerary_parsed: {
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    days?: ItineraryDay[];
    notes?: string; // Added optional notes field
  } | null;
  included_services_parsed: string[] | null;
  categories?: PackageCategory[]; // CHANGED: from package_categories to categories to match API

  // Placeholders for potential future use or other data
  bestTimeToVisit?: string;
  howToReach?: string;
  // Removed original string fields that are now parsed: itinerary, included_services, images
  // Removed client-side parsedItinerary field
}

// Interface for the API response that wraps PackageDataFromApi
interface GetSinglePackageApiResponse {
  success: boolean; 
  data: PackageDataFromApi | null; 
  message?: string;
}
// --- End Interfaces ---


// --- LoadingSpinner Component ---
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <span className="text-lg text-gray-700">Loading package details...</span>
  </div>
);
// --- End LoadingSpinner ---

// --- Main Component Logic ---
function ItineraryPageContent() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string; // packageId is available here
  const [selectedDay, setSelectedDay] = useState(1);

  const apiUrl = packageId ? `/api/packages/${packageId}` : null;

  // Based on logs, useFetch directly returns PackageDataFromApi or null on success/error
  const { data: fetchedPackageData, error, status } = useFetch<PackageDataFromApi>(apiUrl); 

  const [packageData, setPackageData] = useState<PackageDataFromApi | null>(null);

  useEffect(() => {
    if (status === 'success') {
      if (fetchedPackageData) { // fetchedPackageData is PackageDataFromApi itself
        const processedData: PackageDataFromApi = {
          ...fetchedPackageData,
          images_parsed: fetchedPackageData.images_parsed || [],
          itinerary_parsed: fetchedPackageData.itinerary_parsed || { days: [], highlights: [], inclusions: [], exclusions: [] },
          included_services_parsed: fetchedPackageData.included_services_parsed || [],
          categories: fetchedPackageData.categories || [], // CHANGED: use .categories and ensure it's an array
        };
        setPackageData(processedData);
        setSelectedDay(1); 
      } else {
        // This case means status is 'success' but fetchedPackageData is null/undefined
        console.warn(`[Page ${packageId}] API call successful but no data was returned from useFetch.`);
        setPackageData(null); // No valid data to display
      }
    } else if (status === 'error') {
      console.error(`[Page ${packageId}] Fetch error from useFetch:`, error);
      setPackageData(null);
    }
  }, [status, fetchedPackageData, error, packageId]); // Depend on fetchedPackageData directly


  if (status === 'loading' || status === 'idle') {
    return <LoadingSpinner />;
  }

  if (status === 'error' || (status === 'success' && !packageData)) {
    const message = status === 'error' 
      ? (error?.message || 'Could not fetch package details.') 
      : `The package (ID: ${packageId}) does not exist or is currently unavailable.`;
    const title = status === 'error' ? 'Error Loading Package' : 'Package Not Found';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8 max-w-md">{message}</p>
        <Link href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
          <ArrowRight size={20} className="mr-2 inline-block transform rotate-180" /> Back to Packages
        </Link>
      </div>
    );
  }

  // Explicit check for packageData after loading/error states for TypeScript
  if (!packageData) {
    // This should ideally not be reached if the logic above is correct, but acts as a safeguard.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50">
        <AlertTriangle className="h-16 w-16 text-orange-400 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Unexpected Error</h2>
        <p className="text-gray-600 mb-8 max-w-md">There was an issue displaying the package details. Please try refreshing the page.</p>
        <button onClick={() => router.refresh()} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium">
          Refresh Page
        </button>
      </div>
    );
  }

  // At this point, packageData is guaranteed to be non-null.
  const {
    // id: currentPackageId, // Removed as packageId from params is used directly
    name, description, duration, base_price, max_people,
    images_parsed: images,
    itinerary_parsed: itinerary,
    included_services_parsed: includedServices,
    cancellation_policy,
    categories: package_categories // Destructure 'categories' and alias to 'package_categories'
  } = packageData;

  const itineraryDays = itinerary?.days ?? [];
  const highlights = itinerary?.highlights ?? [];
  const inclusions = itinerary?.inclusions ?? [];
  const exclusions = itinerary?.exclusions ?? [];
  const itineraryNotes = itinerary?.notes;

  // Updated function signature and implementation as per subtask
  const handleBookCategoryClick = (pkgId: string, catName: string) => {
    router.push(`/bookings/create?packageId=${pkgId}&categoryId=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 md:py-12 font-sans">
      <div className="container mx-auto px-4">
        {/* --- Back Button --- */}
        <div className="mb-6">
          <Link href="/packages" className="text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors group">
            <ArrowRight size={18} className="mr-2 transform rotate-180 transition-transform group-hover:-translate-x-1" />
            Back to All Packages
          </Link>
        </div>

        {/* --- Main Package Card --- */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Image Gallery Teaser (simplified) */} 
          {images && images.length > 0 && (
            <div className="relative w-full h-72 md:h-96 bg-gray-200">
              <Image
                src={images[0]} // Display first image
                alt={`${name} primary image`}
                fill
                className="object-cover"
                priority
                onError={(e) => { if (e.currentTarget.src !== '/images/placeholder.jpg') e.currentTarget.src = '/images/placeholder.jpg'; }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-md backdrop-blur-sm">
                  + {images.length -1} more photos
                </div>
              )}
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header: Name, Duration, etc. */} 
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mb-6 text-sm">
              <div className="flex items-center"><Clock size={16} className="mr-1.5" /><span>{duration}</span></div>
              <div className="flex items-center"><MapPin size={16} className="mr-1.5" /><span>Andaman Islands</span></div>
              {max_people && (<div className="flex items-center"><Users size={16} className="mr-1.5" /><span>Up to {max_people} people</span></div>)}
            </div>

            {/* Description */} 
            {description && <p className="text-gray-700 mb-8 leading-relaxed">{description}</p>}

            {/* Quick Info Bar (Price, Highlights, Inclusions) */} 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="text-center md:text-left">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Starting From</h3>
                <p className="text-3xl font-bold text-blue-600">₹{base_price.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">per person (base price)</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <ListChecks size={16} className="mr-2 text-green-500"/> Package Inclusions
                </h3>
                {inclusions.length > 0 ? (
                  <ul className="space-y-1">
                    {inclusions.slice(0,3).map((item, i) => <li key={`inc-${i}`} className="text-xs text-gray-700 flex items-start"><Check size={12} className="mr-1.5 mt-0.5 text-green-500 flex-shrink-0"/>{item}</li>)}
                    {inclusions.length > 3 && <li className="text-xs text-blue-600 mt-1">+ {inclusions.length - 3} more</li>}
                  </ul>
                ) : <p className="text-xs text-gray-500 italic">Details available on request.</p>}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <ShieldX size={16} className="mr-2 text-red-500"/> Key Exclusions
                </h3>
                {exclusions.length > 0 ? (
                  <ul className="space-y-1">
                    {exclusions.slice(0,3).map((item, i) => <li key={`exc-${i}`} className="text-xs text-gray-700 flex items-start"><Info size={12} className="mr-1.5 mt-0.5 text-red-500 flex-shrink-0"/>{item}</li>)}
                    {exclusions.length > 3 && <li className="text-xs text-blue-600 mt-1">+ {exclusions.length - 3} more</li>}
                  </ul>
                ) : <p className="text-xs text-gray-500 italic">Flights, personal expenses.</p>}
              </div>
            </div>
            
            {/* General Booking Buttons REMOVED */}

            {/* Package Categories Section */}
            {package_categories && package_categories.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                  <PackageIcon size={24} className="mr-3 text-blue-600" /> Available Package Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {package_categories.map((category, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                      <div className="flex-grow"> {/* Wrapper for content to allow button to push to bottom */}
                        {category.images && category.images.length > 0 && (
                          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-gray-200">
                            <Image
                              src={category.images[0]}
                              alt={`${category.category_name} image`}
                              fill
                              className="object-cover"
                              onError={(e) => { if (e.currentTarget.src !== '/images/placeholder.jpg') e.currentTarget.src = '/images/placeholder.jpg'; }}
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                          <TagIcon size={20} className="mr-2 text-blue-500" /> {category.category_name}
                        </h3>
                        <p className="text-2xl font-bold text-blue-600 mb-3">
                          ₹{category.price.toLocaleString('en-IN')}
                        </p>
                        {category.category_description && (
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed flex items-start">
                            <FileTextIcon size={15} className="mr-2 mt-1 text-gray-500 flex-shrink-0" /> {category.category_description}
                          </p>
                        )}
                        {category.hotel_details && (
                          <div className="mb-3">
                             <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center"><HotelIcon size={16} className="mr-2 text-purple-500"/>Hotel Details:</h4>
                             <p className="text-sm text-gray-600 pl-1 whitespace-pre-line">{category.hotel_details}</p>
                          </div>
                        )}
                         <p className="text-sm text-gray-600 flex items-center">
                          <UserCheckIcon size={16} className="mr-2 text-green-500" /> Max Pax Included: {category.max_pax_included_in_price}
                        </p>
                      </div>
                      <div className="mt-auto pt-4"> {/* Button container */}
                        <button
                          onClick={() => handleBookCategoryClick(packageId, category.category_name)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition duration-300 font-semibold text-lg flex items-center justify-center"
                        >
                          Book This Option <ArrowRight size={20} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {package_categories && package_categories.length === 0 && (
                 <section className="mb-10 py-10 text-center text-gray-500 italic bg-gray-50 rounded-lg border border-gray-200">
                    No specific category options are currently available for this package.
                 </section>
            )}


            {/* Detailed Itinerary Section */} 
            {itineraryDays.length > 0 ? (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Daily Itinerary</h2>
                {/* Day Selector Tabs */} 
                <div className="flex border-b border-gray-200 mb-6 space-x-1 overflow-x-auto no-scrollbar">
                  {itineraryDays.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day.day)}
                      className={`px-4 py-3 whitespace-nowrap text-sm font-medium transition-all duration-200 rounded-t-md focus:outline-none 
                        ${selectedDay === day.day 
                          ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                          : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                        }`}
                    >
                      Day {day.day}: {day.title}
                    </button>
                  ))}
                </div>

                {/* Selected Day Details */} 
                {itineraryDays.map((day) => (
                  <div key={`day-content-${day.day}`} className={`${selectedDay === day.day ? 'block animate-fadeIn' : 'hidden'}`}>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{day.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{day.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center"><Clock size={16} className="mr-2 text-blue-500"/>Activities</h4>
                          {day.activities && day.activities.length > 0 ? (
                            <ul className="space-y-2 pl-1">
                              {day.activities.map((activity, index) => (
                                <li key={`act-${index}`} className="text-sm text-gray-600">
                                  <strong className="text-gray-700">{activity.time && `${activity.time}: `}</strong>{activity.name}
                                  {activity.duration && <span className="text-xs text-gray-500 ml-1">({activity.duration})</span>}
                                </li>
                              ))}
                            </ul>
                          ) : <p className="text-sm text-gray-500 italic">Details for today will be provided.</p>}
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center"><Utensils size={16} className="mr-2 text-green-500"/>Meals</h4>
                          {day.meals && day.meals.length > 0 ? (
                            <ul className="space-y-1 pl-1">
                              {day.meals.map((meal, index) => <li key={`meal-${index}`} className="text-sm text-gray-600 flex items-center"><Check size={14} className="mr-1.5 text-green-500"/>{meal}</li>)}
                            </ul>
                          ) : <p className="text-sm text-gray-500 italic">As per plan.</p>}
                        </div>
                        {day.accommodation && day.accommodation !== 'N/A' && (
                            <div className="md:col-span-2">
                                <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center"><BedDouble size={16} className="mr-2 text-purple-500"/>Accommodation</h4>
                                <p className="text-sm text-gray-600 pl-1">{day.accommodation}</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <div className="text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg border border-gray-200">
                Detailed day-wise itinerary is not available for this package online. Please contact us for more details.
              </div>
            )}

            {/* Highlights (if not already shown or for more detail) */} 
            {highlights.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Package Highlights</h2>
                    <ul className="list-disc list-inside space-y-2 pl-5 text-gray-700">
                        {highlights.map((item, i) => <li key={`hl-detail-${i}`}>{item}</li>)}
                    </ul>
                </section>
            )}
            
            {/* Cancellation Policy & Notes */} 
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Important Notes</h2>
              {cancellation_policy && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Cancellation Policy</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{cancellation_policy}</p>
                </div>
              )}
              {itineraryNotes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Itinerary Notes</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{itineraryNotes}</p>
                </div>
              )}
              {!cancellation_policy && !itineraryNotes && (
                <p className="text-sm text-gray-500 italic">Standard terms and conditions apply. Please contact us for specific details.</p>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense
export default function PackageDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ItineraryPageContent />
    </Suspense>
  );
}
