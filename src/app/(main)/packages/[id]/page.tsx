/*
UI Enhancement Plan:
1.  **Responsiveness:** Leverage Tailwind's responsive prefixes (sm:, md:, lg:) more effectively for spacing, typography, and layout adjustments.
2.  **Typography:** Improve hierarchy and readability. Use slightly larger base font sizes on larger screens. Ensure consistent font weights.
3.  **Spacing:** Increase whitespace slightly for a less cramped feel, especially on larger screens. Use consistent gap utilities.
4.  **Visual Polish:** Refine border colors, add subtle hover/focus states to interactive elements (buttons, tabs). Ensure image containers adapt well.
5.  **Consistency:** Standardize button styles and tab appearances.
6.  **Mobile:** Ensure tabs are easily scrollable and touch targets are adequate.
7.  **NEW:** Add scrollable image gallery at the top.
8.  **NEW:** Change currency to INR (₹).
9.  **NEW:** Format itinerary description sentences as points.
10. **NEW:** Add back link to /packages at the top.
11. **NEW:** Enhance prominence (bolder/darker) of specific labels and tab text.
12. **NEW:** Move package title and back link onto the hero image gallery with overlay for better visual appeal.
13. **NEW:** Contain the entire page content (including hero) within a max-width container on desktop views.
14. **NEW:** Round top corners of hero image gallery on desktop.
15. **NEW:** Change Back link color to dark blue and Select Option button to dark blue.
*/

// Path: ./src/app/packages/[id]/page.tsx
'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Using Next.js Image
import Head from 'next/head'; // For Google Fonts
import { AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
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

interface PackageCategory {
  id: number;
  category_name: string;
  price: number;
  hotel_details: string;
  category_description: string;
  max_pax_included_in_price: number;
  images: string[]; // Used for scrollable images
  activities: string[] | null; // Category-specific activities
  meals: string[] | null; // Category-specific meals
  accommodation: {
    hotel_name: string;
    room_type: string;
    amenities: string[];
    special_features: string;
  } | null; // Category-specific accommodation details
}

interface PackageDataFromApi {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  created_by: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  cancellation_policy: string | null;
  images_parsed: string[] | null;
  itinerary_parsed: {
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    days?: ItineraryDay[];
    notes?: string;
  } | null;
  included_services_parsed: string[] | null;
  categories?: PackageCategory[];
  bestTimeToVisit?: string;
  howToReach?: string;
}
// --- End Interfaces ---

// --- LoadingSpinner Component ---
const LoadingSpinner = () => (
  <div
    className="relative flex size-full min-h-screen flex-col bg-gray-50 justify-center items-center p-4"
    style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
  >
    {/* Replaced animated SVG spinner with loading.gif */}
    <Image
      src="/images/loading.gif"
      alt="Loading..."
      width={128}
      height={128}
      priority
      className="mb-4 sm:mb-5"
    />
    <span className="text-lg sm:text-xl text-gray-800 font-semibold">Loading package details...</span>
    <p className="text-gray-500 mt-1 text-sm sm:text-base">Please wait a moment.</p>
  </div>
);
// --- End LoadingSpinner ---

// --- Error/Not Found Component ---
const ErrorDisplay = ({ title, message, isError = true }: { title: string; message: string; isError?: boolean }) => {
  const router = useRouter();
  const buttonColor = isError ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600';
  const iconColor = isError ? 'text-red-500' : 'text-orange-500';
  const titleColor = isError ? 'text-red-700' : 'text-orange-700';

  return (
    // Apply container to error display as well for consistency on desktop
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 justify-center items-center p-4 text-center lg:max-w-7xl lg:mx-auto" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <AlertTriangle className={`h-16 w-16 sm:h-20 sm:w-20 ${iconColor} mb-5 sm:mb-6`} />
      <h2 className={`text-2xl sm:text-3xl font-semibold ${titleColor} mb-3 sm:mb-4`}>{title}</h2>
      <p className="text-gray-600 mb-6 sm:mb-8 max-w-md text-sm sm:text-base">{message}</p>
      {isError ? (
        <Link href="/packages" className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 sm:h-12 px-5 ${buttonColor} text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200`}>
          <ArrowLeft size={18} className="mr-2 inline-block" /> Back to Packages
        </Link>
      ) : (
        <button
          onClick={() => router.refresh()}
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 sm:h-12 px-5 ${buttonColor} text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200`}
        >
          Refresh Page
        </button>
      )}
    </div>
  );
};
// --- End Error/Not Found Component ---

// --- Helper Function to split text into sentences ---
const formatSentences = (text: string | null | undefined): string[] => {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]?\s*|[^.!?]+$/g);
  return sentences ? sentences.map(s => s.trim()).filter(s => s.length > 0) : [];
};

// --- Main Component Logic ---
function ItineraryPageContent() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedOptionTab, setSelectedOptionTab] = useState<number | null>(null);

  const apiUrl = packageId ? `/api/packages/${packageId}` : null;
  const { data: fetchedPackageData, error, status } = useFetch<PackageDataFromApi>(apiUrl);
  const [packageData, setPackageData] = useState<PackageDataFromApi | null>(null);

  useEffect(() => {
    if (status === 'success') {
      if (fetchedPackageData) {
        const processedData: PackageDataFromApi = {
          ...fetchedPackageData,
          images_parsed: fetchedPackageData.images_parsed || [],
          itinerary_parsed: fetchedPackageData.itinerary_parsed || { days: [], highlights: [], inclusions: [], exclusions: [] },
          included_services_parsed: fetchedPackageData.included_services_parsed || [],
          categories: fetchedPackageData.categories || [],
        };
        setPackageData(processedData);
        if (processedData.itinerary_parsed?.days && processedData.itinerary_parsed.days.length > 0) {
          setSelectedDay(processedData.itinerary_parsed.days[0].day);
        } else {
          setSelectedDay(1);
        }
        if (processedData.categories && processedData.categories.length > 0) {
          setSelectedOptionTab(processedData.categories[0].id);
        } else {
          setSelectedOptionTab(null);
        }
      } else {
        setPackageData(null);
      }
    } else if (status === 'error') {
      setPackageData(null);
    }
  }, [status, fetchedPackageData]);

  // Show loading while fetching OR while processing the successful response
  if (status === 'loading' || status === 'idle' || (status === 'success' && packageData === null && fetchedPackageData !== null)) {
    return <LoadingSpinner />;
  }

  if (status === 'error') {
    return <ErrorDisplay title="Error Loading Package" message={error?.message || 'Could not fetch package details.'} isError={true} />;
  }

  // Only show "not found" if API returned success but with no data (null or undefined)
  if (status === 'success' && !packageData && !fetchedPackageData) {
    return <ErrorDisplay title="Package Not Found" message={`The package (ID: ${packageId}) does not exist or is currently unavailable.`} isError={true} />;
  }

  if (!packageData) {
    return <ErrorDisplay title="Unexpected Error" message="There was an issue displaying the package details. Please try refreshing the page." isError={false} />;
  }

  const {
    name,
    description,
    base_price,
    images_parsed: images,
    itinerary_parsed: itinerary,
    cancellation_policy,
    categories: package_categories,
  } = packageData;

  const itineraryDays = itinerary?.days ?? [];
  const highlights = itinerary?.highlights ?? [];
  const inclusions = [...(packageData.included_services_parsed || []), ...(itinerary?.inclusions || [])];
  const exclusions = itinerary?.exclusions ?? [];

  const displayImages = images && images.length > 0 ? images : ['https://placehold.co/1200x800/e2e8f0/94a3b8?text=Tour+Image'];

  const selectedCategoryData = package_categories?.find(cat => cat.id === selectedOptionTab);
  const selectedDayData = itineraryDays.find(d => d.day === selectedDay);

  const formatList = (items: string[], defaultText: string, limit: number = 2) => {
    if (!items || items.length === 0) return defaultText;
    const displayedItems = items.slice(0, limit).join(', ');
    return items.length > limit ? `${displayedItems}...` : displayedItems;
  };

  return (
    <>
      <Head>
        <title>{name} - Package Details</title>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          rel="stylesheet"
          as="style"
          // @ts-ignore
          onLoad="this.rel='stylesheet'"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900&family=Plus+Jakarta+Sans%3Awght%40400%3B500%3B700%3B800"
        />
      </Head>
      {/* --- Overall Page Container for Desktop --- */}
      {/* Added lg:rounded-lg to round container corners on desktop */}
      <div className="lg:max-w-7xl lg:mx-auto lg:shadow-xl lg:overflow-hidden lg:rounded-lg">
        <div
          className="relative flex size-full min-h-screen flex-col bg-gray-50 justify-between group/design-root overflow-hidden"
          style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
        >
          <main className="flex-grow">
            {/* --- Hero Section (Now inside the container) --- */}
            {/* Added overflow-hidden and lg:rounded-t-lg to round top corners on desktop */}
            <section className="relative w-full bg-gray-800 lg:mb-0 overflow-hidden lg:rounded-t-lg">
              {/* Scrollable Image Container */}
              <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-72 sm:h-80 md:h-96 lg:h-[550px]">
                {displayImages.map((imgUrl, idx) => (
                  <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
                    <Image
                      src={imgUrl}
                      alt={`${name} image ${idx + 1}`}
                      layout="fill"
                      objectFit="cover"
                      priority={idx === 0}
                      className="bg-gray-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  </div>
                ))}
              </div>

              {/* Content Overlay: Back Link and Title */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                {/* Top: Back Link - Changed text color and background */}
                <div>
                  <Link href="/packages" className="inline-flex items-center text-sm font-medium text-blue-800 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full py-1.5 px-3 transition-colors duration-200 shadow-sm">
                    <ArrowLeft size={16} className="mr-1.5" />
                    Back to Packages
                  </Link>
                </div>

                {/* Bottom: Title */}
                <div>
                  <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-shadow-md">
                    {name}
                  </h1>
                </div>
              </div>

              {/* Image indicator dots */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center gap-2">
                  {displayImages.map((_, index) => (
                    <div
                      key={`dot-${index}`}
                      className={`size-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors duration-300 cursor-pointer`}
                    ></div>
                  ))}
                </div>
              )}
            </section>

            {/* --- Content Area --- */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">

              {/* Overview Section */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Overview</h2>
                {description ? (
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm sm:text-base italic">
                    No overview available for this package.
                  </p>
                )}
              </section>

              {/* Price, Inclusions, Exclusions Block */}
              <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Price */}
                  <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-6">
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">Price starts from</p>
                    <p className="text-gray-900 text-lg sm:text-xl font-bold">₹{base_price.toLocaleString('en-IN')}</p>
                  </div>
                  {/* Inclusions */}
                  <div className="border-b sm:border-b-0 sm:border-r border-gray-200 py-4 sm:py-0 sm:px-6">
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">Inclusions</p>
                    <p className="text-gray-700 text-sm sm:text-base leading-snug">
                      {formatList(inclusions, 'Accommodation, transportation, guided tours (default)')}
                    </p>
                  </div>
                  {/* Exclusions */}
                  <div className="pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">Exclusions</p>
                    <p className="text-gray-700 text-sm sm:text-base leading-snug">
                      {formatList(exclusions, 'Flights, meals, personal expenses (default)')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Itinerary Section */}
              {itineraryDays && itineraryDays.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">Itinerary</h2>
                  <div className="border-b border-gray-300 mb-4 sm:mb-5">
                    <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide">
                      {itineraryDays.map((day) => (
                        <button
                          key={day.day}
                          onClick={() => setSelectedDay(day.day)}
                          className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 text-sm sm:text-base transition-colors duration-200 ${selectedDay === day.day
                            ? 'border-blue-600 text-blue-700 font-semibold'
                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 font-medium'
                            }`}
                        >
                          Day {day.day}
                        </button>
                      ))}
                    </nav>
                  </div>
                  {selectedDayData && (
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                        Day {selectedDayData.day}: {selectedDayData.title}
                      </h3>
                      <div className="space-y-2">
                        {formatSentences(selectedDayData.description).map((sentence, index) => (
                          <p key={index} className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {sentence}
                          </p>
                        ))}
                        {formatSentences(selectedDayData.description).length === 0 && (
                          <p className="text-gray-500 text-sm sm:text-base italic">
                            Details for this day are not available.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Highlights Section */}
              {highlights && highlights.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Highlights</h2>
                  <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1 sm:space-y-1.5 pl-2">
                    {highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Available Options Section - Changed Button Color */}
              {package_categories && package_categories.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">Available Options</h2>
                  <div className="border-b border-gray-300 mb-4 sm:mb-5">
                    <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide">
                      {package_categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedOptionTab(category.id)}
                          className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 text-sm sm:text-base transition-colors duration-200 ${selectedOptionTab === category.id
                            ? 'border-blue-600 text-blue-700 font-semibold'
                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 font-medium'
                            }`}
                        >
                          {category.category_name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {selectedCategoryData && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                        {/* Image Gallery Column */}
                        <div className="md:col-span-2 h-64 md:h-auto bg-gray-100">
                          <div className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                            {(selectedCategoryData.images && selectedCategoryData.images.length > 0 ? selectedCategoryData.images : ['https://placehold.co/600x400/e2e8f0/94a3b8?text=Option+Image']).map((imgUrl, idx) => (
                              <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
                                <Image
                                  src={imgUrl}
                                  alt={`${selectedCategoryData.category_name} image ${idx + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="bg-gray-200"
                                />
                              </div>
                            ))
                            }
                          </div>
                        </div>

                        {/* Details Column */}
                        <div className="md:col-span-3 p-4 sm:p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">{selectedCategoryData.category_name}</h3>
                            <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">Max {selectedCategoryData.max_pax_included_in_price} people</p>
                            {selectedCategoryData.category_description && (
                              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-4">
                                {selectedCategoryData.category_description}
                              </p>
                            )}
                            
                            {/* Activities */}
                            {selectedCategoryData.activities && selectedCategoryData.activities.length > 0 && (
                              <div className="mb-3 sm:mb-4">
                                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Activities</p>
                                <ul className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                  {selectedCategoryData.activities.slice(0, 3).map((activity, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="text-blue-600 mr-2">•</span>
                                      <span>{activity}</span>
                                    </li>
                                  ))}
                                  {selectedCategoryData.activities.length > 3 && (
                                    <li className="text-gray-500 text-sm">+{selectedCategoryData.activities.length - 3} more activities</li>
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Meals */}
                            {selectedCategoryData.meals && selectedCategoryData.meals.length > 0 && (
                              <div className="mb-3 sm:mb-4">
                                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Meals</p>
                                <ul className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                  {selectedCategoryData.meals.slice(0, 3).map((meal, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="text-green-600 mr-2">•</span>
                                      <span>{meal}</span>
                                    </li>
                                  ))}
                                  {selectedCategoryData.meals.length > 3 && (
                                    <li className="text-gray-500 text-sm">+{selectedCategoryData.meals.length - 3} more meals</li>
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Accommodation */}
                            {selectedCategoryData.accommodation && (
                              <div className="mb-3 sm:mb-4">
                                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Accommodation</p>
                                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-1">
                                  {selectedCategoryData.accommodation.hotel_name && (
                                    <p><span className="font-medium">Hotel:</span> {selectedCategoryData.accommodation.hotel_name}</p>
                                  )}
                                  {selectedCategoryData.accommodation.room_type && (
                                    <p><span className="font-medium">Room:</span> {selectedCategoryData.accommodation.room_type}</p>
                                  )}
                                  {selectedCategoryData.accommodation.amenities && selectedCategoryData.accommodation.amenities.length > 0 && (
                                    <p><span className="font-medium">Amenities:</span> {selectedCategoryData.accommodation.amenities.join(', ')}</p>
                                  )}
                                  {selectedCategoryData.accommodation.special_features && (
                                    <p><span className="font-medium">Features:</span> {selectedCategoryData.accommodation.special_features}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {selectedCategoryData.hotel_details && (
                              <div className="mb-3 sm:mb-4">
                                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Hotel Details</p>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">{selectedCategoryData.hotel_details}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-auto pt-4 border-t border-gray-200">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">
                              ₹{selectedCategoryData.price.toLocaleString('en-IN')}
                              <span className="text-sm font-normal text-gray-500"> / option</span>
                            </p>
                            {/* Changed Button Color */}
                            <button
                              className="flex-shrink-0 min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 sm:h-11 px-4 sm:px-5 bg-blue-800 text-white text-sm sm:text-base font-medium leading-normal hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-colors duration-200"
                              onClick={() => router.push(`/booking/new?packageId=${packageId}&categoryId=${selectedCategoryData.id}`)}
                            >
                              Select Option
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Cancellation Policy Section */}
              {cancellation_policy && (
                <section className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Cancellation Policy</h2>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {cancellation_policy}
                  </p>
                </section>
              )}

            </div> {/* End Content Area Padding Wrapper */}
          </main>

          
        </div>
      </div> {/* --- End Overall Page Container --- */}

      {/* Utility class for text shadow */}
      <style jsx global>{`
        .text-shadow-md {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  );
}

// --- Suspense Wrapper ---
export default function PackagePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ItineraryPageContent />
    </Suspense>
  );
}

