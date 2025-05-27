// Path: .\src\app\packages\[id]\page.tsx
'use client';
export const dynamic = 'force-dynamic'
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Clock, Users, Check, Info, ArrowRight, Loader2, AlertTriangle, Utensils, BedDouble, ListChecks, ShieldX, PackageIcon, TagIcon, HotelIcon, UserCheckIcon, FileTextIcon, IndianRupee } from 'lucide-react';
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
  id: number; // Added categoryId
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

// --- End Interfaces ---

// --- Import Theme Styles ---
import {
  neutralBgLight, neutralText, neutralTextLight, neutralBorder, neutralBorderLight, neutralBg, neutralIconColor,
  infoText, infoIconColor, infoBg, infoBorder,
  successText, successIconColor, successBg, successBorder,
  errorText, errorIconColor, errorBg, errorBorder,
  warningText, warningIconColor, warningBg, warningBorder, // Added warning for exclusions
  primaryButtonBg, primaryButtonText, buttonPrimaryStyle, buttonSecondaryStyleHero,
  cardBaseStyle, sectionPadding, sectionHeadingStyle,
  breadcrumbItemStyle, breadcrumbLinkStyle, breadcrumbSeparatorStyle,
  galleryMainImageContainerStyle, galleryCaptionOverlayStyle, // For potential gallery use
  listIconWrapperStyle, // For icons in lists
} from '@/styles/26themeandstyle';
// --- End Theme Styles Import ---

// --- LoadingSpinner Component (Themed) ---
const LoadingSpinner = () => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight}`}>
    <Loader2 className={`h-16 w-16 animate-spin ${infoIconColor} mb-5`} />
    <span className={`text-xl ${infoText} font-semibold`}>Loading package details...</span>
    <p className={`${neutralTextLight} mt-1`}>Please wait a moment.</p>
  </div>
);
// --- End LoadingSpinner ---

// --- Main Component Logic ---
function ItineraryPageContent() {
  const params = useParams();
  const router = useRouter();
  const { ChevronRight: ChevronRightIcon } = { ChevronRight: ArrowRight }; // Alias for breadcrumbs if needed, or use specific ChevronRight from lucide
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
        // console.warn(`[Page ${packageId}] API call successful but no data was returned from useFetch.`);
        setPackageData(null); // No valid data to display
      }
    } else if (status === 'error') {
      // console.error(`[Page ${packageId}] Fetch error from useFetch:`, error);
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
      <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 ${errorBg} border ${errorBorder} rounded-2xl m-4 md:m-8`}>
        <AlertTriangle className={`h-20 w-20 ${errorIconColor} mb-6`} />
        <h2 className={`text-3xl font-semibold ${errorText} mb-4`}>{title}</h2>
        <p className={`${neutralTextLight} mb-8 max-w-md`}>{message}</p>
        <Link href="/packages" className={`${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`}> {/* Matched error button style from Hotels */}
          <ArrowRight size={20} className="mr-2 inline-block transform rotate-180" /> Back to Packages
        </Link>
      </div>
    );
  }

  // Explicit check for packageData after loading/error states for TypeScript
  if (!packageData) {
    // This should ideally not be reached if the logic above is correct, but acts as a safeguard.
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 py-10 ${warningBg} border ${warningBorder} rounded-2xl m-4 md:m-8`}>
        <AlertTriangle className={`h-20 w-20 ${warningIconColor} mb-6`} />
        <h2 className={`text-3xl font-semibold ${warningText} mb-4`}>Unexpected Error</h2>
        <p className={`${neutralTextLight} mb-8 max-w-md`}>There was an issue displaying the package details. Please try refreshing the page.</p>
        <button onClick={() => router.refresh()} className={`${buttonPrimaryStyle} ${primaryButtonBg} hover:${primaryButtonBg.replace('800', '900')} focus:ring-orange-500`}>
          Refresh Page
        </button>
      </div>
    );
  }

  // At this point, packageData is guaranteed to be non-null.
  const { 
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

  // Placeholder for actual image if available, otherwise a themed placeholder
  const heroImageUrl = images && images.length > 0 ? images[0] : `https://placehold.co/1200x600/${neutralBg.replace('bg-', '')}/${neutralIconColor.replace('text-', '')}?text=Package+Image`;

  return (
    <div className={`${neutralBgLight} min-h-screen font-sans`}>
      {/* --- Hero Section (Themed) --- */}
      {/* Uses galleryMainImageContainerStyle for base, but with overrides for rounded corners, shadow, and border */}
      <div className={`relative h-[60vh] md:h-[70vh] w-full ${galleryMainImageContainerStyle.replace('rounded-2xl shadow-lg border', 'rounded-none shadow-none border-none')}`}>
        <Image
          src={heroImageUrl}
          alt={`${name} hero image`}
          fill
          priority
          style={{ objectFit: 'cover' }}
          className={`${neutralBg}`} // Background for image loading
          onError={(e) => { if (e.currentTarget.src !== heroImageUrl && heroImageUrl.startsWith('https://placehold.co')) e.currentTarget.src = heroImageUrl; else e.currentTarget.src = '/images/placeholder.jpg'; }}
        />
        {/* Uses galleryCaptionOverlayStyle for base, but removes padding to allow container to manage it */}
        <div className={`absolute inset-0 ${galleryCaptionOverlayStyle.replace('p-6', 'p-0')} bg-gradient-to-t from-black/70 via-black/40 to-transparent`}></div>
        <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white`}>
          <div className="container mx-auto"> {/* Standard container for content within hero overlay */}
            <nav className={`text-sm text-white/80 mb-3 ${breadcrumbItemStyle}`} aria-label="Breadcrumb">
              <ol className="list-none p-0 inline-flex flex-wrap"> {/* Added flex-wrap for long breadcrumbs */}
                <li className={breadcrumbItemStyle}>
                  <Link href="/" className={breadcrumbLinkStyle}>Home</Link>
                  <ChevronRightIcon size={14} className={`${breadcrumbSeparatorStyle} text-white/70`} />
                </li>
                <li className={breadcrumbItemStyle}>
                  <Link href="/packages" className={breadcrumbLinkStyle}>Packages</Link>
                  <ChevronRightIcon size={14} className={`${breadcrumbSeparatorStyle} text-white/70`} />
                </li>
                <li className={`${breadcrumbItemStyle} ${neutralTextLight.replace('text-gray-600', 'text-white/90')}`}> {/* Ensure current page is visible */}
                  <span className="font-medium line-clamp-1">{name}</span>
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-xl">{name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 text-base md:text-lg mb-6">
              <div className="flex items-center"><Clock size={18} className="mr-2" /><span>{duration}</span></div>
              <div className="flex items-center"><MapPin size={18} className="mr-2" /><span>Andaman Islands</span></div>
              {max_people && (<div className="flex items-center"><Users size={18} className="mr-2" /><span>Up to {max_people} people</span></div>)}
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
                <Link 
                href={package_categories && package_categories.length > 0 ? `/booking/new?packageId=${packageId}&categoryId=${package_categories[0].id}` : `/contact-us?package=${name}`} 
                className={`${buttonPrimaryStyle} py-3 px-6 md:px-8 text-base md:text-lg`}
                >
                Book Now / Enquire <ArrowRight size={20} className="ml-2" />
                </Link>
                {/* Optional: Add a secondary button for gallery or other actions if needed later */}
                {/* <button className={`${buttonSecondaryStyleHero} py-3 px-6 md:px-8 text-base md:text-lg`}>View Photos</button> */}
            </div>
          </div>
        </div>
      </div>
      
      {/* --- Main Content Area --- */}
      <div className={`container mx-auto px-4 ${sectionPadding}`}>
        {/* Main content wrapper: Using cardBaseStyle for the overall container of package details */}
        <div className={`${cardBaseStyle} p-0 md:p-0 shadow-xl`}> {/* Removed padding here, sections will manage their own */}
          <div className="p-6 md:p-8 lg:p-10"> {/* Inner padding for general content sections */}
            
            {/* Package Overview Section */}
            {description && (
              <section id="overview" className="mb-10 md:mb-12 scroll-mt-20">
                <h2 className={`${sectionHeadingStyle} text-2xl md:text-3xl`}>
                  <Info size={24} className={`mr-3 ${infoIconColor}`} /> Package Overview
                </h2>
                <p className={`${neutralTextLight} text-base md:text-lg leading-relaxed whitespace-pre-line`}>{description}</p>
              </section>
            )}

            {/* Quick Info Bar (Price, Inclusions, Exclusions) - Themed */}
            <section id="quick-info" className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-12 ${neutralBgLight} p-6 md:p-8 rounded-xl border ${neutralBorder} shadow-sm`}>
              <div>
                <h3 className={`text-sm font-semibold ${neutralTextLight} uppercase tracking-wider mb-1.5`}>Starting From</h3>
                <p className={`text-3xl md:text-4xl font-bold ${successText}`}><IndianRupee className={`inline h-6 md:h-7 w-6 md:w-7 mr-0.5 ${successIconColor}`} />{base_price.toLocaleString('en-IN')}</p>
                <p className={`text-xs ${neutralTextLight}`}>per person (base price)</p>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${neutralTextLight} uppercase tracking-wider mb-2.5 flex items-center`}>
                  <Check size={18} className={`mr-2 ${successIconColor}`}/> Package Inclusions
                </h3>
                {inclusions.length > 0 ? (
                  <ul className="space-y-1.5">
                    {inclusions.slice(0,3).map((item, i) => <li key={`inc-${i}`} className={`text-sm ${neutralText} flex items-start`}><Check size={16} className={`mr-2 mt-0.5 ${successIconColor} flex-shrink-0`}/>{item}</li>)}
                    {inclusions.length > 3 && <li className={`text-sm ${infoText} mt-1.5 hover:underline cursor-pointer`}>+ {inclusions.length - 3} more</li>}
                  </ul>
                ) : <p className={`text-sm ${neutralTextLight} italic`}>Details available on request.</p>}
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${neutralTextLight} uppercase tracking-wider mb-2.5 flex items-center`}>
                  <ShieldX size={18} className={`mr-2 ${warningIconColor}`}/> Key Exclusions
                </h3>
                {exclusions.length > 0 ? (
                  <ul className="space-y-1.5">
                    {exclusions.slice(0,3).map((item, i) => <li key={`exc-${i}`} className={`text-sm ${neutralText} flex items-start`}><Info size={16} className={`mr-2 mt-0.5 ${warningIconColor} flex-shrink-0`}/>{item}</li>)}
                    {exclusions.length > 3 && <li className={`text-sm ${infoText} mt-1.5 hover:underline cursor-pointer`}>+ {exclusions.length - 3} more</li>}
                  </ul>
                ) : <p className={`text-sm ${neutralTextLight} italic`}>Flights, personal expenses.</p>}
              </div>
            </section>

            {/* Package Categories Section - Themed */}
            {package_categories && package_categories.length > 0 && (
              <section id="options" className="mb-10 md:mb-12 scroll-mt-20">
                <h2 className={`${sectionHeadingStyle} text-2xl md:text-3xl`}>
                  <PackageIcon size={24} className={`mr-3 ${infoIconColor}`} /> Available Package Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {package_categories.map((category) => (
                    <div key={category.id} className={`${cardBaseStyle} flex flex-col hover:shadow-xl transition-shadow duration-300 group`}>
                      <div className="flex-grow">
                        {category.images && category.images.length > 0 && (
                          <div className={`relative w-full h-56 mb-5 rounded-lg overflow-hidden ${neutralBg} border ${neutralBorderLight}`}>
                            <Image
                              src={category.images[0]}
                              alt={`${category.category_name} image`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => { if (e.currentTarget.src !== '/images/placeholder.jpg') e.currentTarget.src = '/images/placeholder.jpg'; }}
                            />
                          </div>
                        )}
                        <h3 className={`text-xl md:text-2xl font-semibold ${neutralText} mb-2 flex items-center group-hover:${infoText} transition-colors`}>
                          <TagIcon size={20} className={`mr-2.5 ${infoIconColor}`} /> {category.category_name}
                        </h3>
                        <p className={`text-2xl md:text-3xl font-bold ${successText} mb-4`}>
                          <IndianRupee className={`inline h-5 md:h-6 w-5 md:w-6 mr-0.5 ${successIconColor}`} />{category.price.toLocaleString('en-IN')}
                        </p>
                        {category.category_description && (
                          <p className={`text-sm ${neutralTextLight} mb-3 leading-relaxed flex items-start`}>
                            <FileTextIcon size={16} className={`mr-2 mt-0.5 ${neutralIconColor} flex-shrink-0`} /> {category.category_description}
                          </p>
                        )}
                        {category.hotel_details && (
                          <div className="mb-3">
                             <h4 className={`text-sm font-semibold ${neutralText} mb-1 flex items-center`}><HotelIcon size={16} className={`mr-2 ${neutralIconColor}`}/>Hotel Details:</h4>
                             <p className={`text-sm ${neutralTextLight} pl-1 whitespace-pre-line`}>{category.hotel_details}</p>
                          </div>
                        )}
                         <p className={`text-sm ${neutralTextLight} flex items-center`}>
                          <UserCheckIcon size={16} className={`mr-2 ${successIconColor}`} /> Max Pax Included: {category.max_pax_included_in_price}
                        </p>
                      </div>
                      <div className="mt-auto pt-6">
                        <Link
                          href={`/booking/new?packageId=${packageId}&categoryId=${category.id}`}
                          className={`${buttonPrimaryStyle} w-full text-base py-3`}
                        >
                          Book This Option <ArrowRight size={18} className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {package_categories && package_categories.length === 0 && (
                 <section id="options-unavailable" className={`mb-10 md:mb-12 py-10 text-center ${neutralTextLight} italic ${neutralBg} rounded-xl border ${neutralBorder} scroll-mt-20`}>
                    No specific category options are currently available for this package.
                 </section>
            )}

            {/* Detailed Itinerary Section - Themed */}
            {itineraryDays.length > 0 ? (
              <section id="itinerary" className="mb-10 md:mb-12 scroll-mt-20">
                <h2 className={`${sectionHeadingStyle} text-2xl md:text-3xl`}>
                    <Calendar size={24} className={`mr-3 ${infoIconColor}`} /> Daily Itinerary
                </h2>
                <div className={`flex border-b ${neutralBorder} mb-6 md:mb-8 space-x-1 overflow-x-auto no-scrollbar`}>
                  {itineraryDays.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day.day)}
                      className={`px-4 md:px-5 py-3 whitespace-nowrap text-sm md:text-base font-medium transition-all duration-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${primaryButtonBg.replace('bg-', 'focus:ring-')}
                        ${selectedDay === day.day 
                          ? `border-b-2 ${primaryButtonBg.replace('bg-','border-')} ${primaryButtonText.replace('text-white', infoText)} ${infoBg}`
                          : `${neutralTextLight} hover:${infoText} hover:${infoBg.replace('50', '100')}`
                        }`}
                    >
                      Day {day.day}: {day.title}
                    </button>
                  ))}
                </div>

                {itineraryDays.map((day) => (
                  <div key={`day-content-${day.day}`} className={`${selectedDay === day.day ? 'block animate-fadeIn' : 'hidden'}`}>
                    <div className={`${neutralBgLight} p-6 md:p-8 rounded-xl border ${neutralBorder} shadow-sm`}>
                      <h3 className={`text-xl md:text-2xl font-semibold ${neutralText} mb-2`}>{day.title}</h3>
                      <p className={`${neutralTextLight} text-sm md:text-base mb-5 leading-relaxed`}>{day.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <h4 className={`text-md font-semibold ${neutralText} mb-2.5 flex items-center`}><Clock size={18} className={`mr-2 ${infoIconColor}`}/>Activities</h4>
                          {day.activities && day.activities.length > 0 ? (
                            <ul className="space-y-2 pl-1">
                              {day.activities.map((activity, index) => (
                                <li key={`act-${index}`} className={`text-sm ${neutralTextLight}`}>
                                  <strong className={neutralText}>{activity.time && `${activity.time}: `}</strong>{activity.name}
                                  {activity.duration && <span className={`text-xs ${neutralTextLight} ml-1.5`}>({activity.duration})</span>}
                                </li>
                              ))}
                            </ul>
                          ) : <p className={`text-sm ${neutralTextLight} italic`}>Details for today will be provided.</p>}
                        </div>
                        <div>
                          <h4 className={`text-md font-semibold ${neutralText} mb-2.5 flex items-center`}><Utensils size={18} className={`mr-2 ${successIconColor}`}/>Meals</h4>
                          {day.meals && day.meals.length > 0 ? (
                            <ul className="space-y-1.5 pl-1">
                              {day.meals.map((meal, index) => <li key={`meal-${index}`} className={`text-sm ${neutralTextLight} flex items-center`}><Check size={16} className={`mr-2 ${successIconColor}`}/>{meal}</li>)}
                            </ul>
                          ) : <p className={`text-sm ${neutralTextLight} italic`}>As per plan.</p>}
                        </div>
                        {day.accommodation && day.accommodation !== 'N/A' && (
                            <div className="md:col-span-2">
                                <h4 className={`text-md font-semibold ${neutralText} mb-2.5 flex items-center`}><BedDouble size={18} className={`mr-2 ${neutralIconColor}`}/>Accommodation</h4>
                                <p className={`text-sm ${neutralTextLight} pl-1`}>{day.accommodation}</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <div id="itinerary-unavailable" className={`text-center py-10 ${neutralTextLight} italic ${neutralBg} rounded-xl border ${neutralBorder} scroll-mt-20`}>
                Detailed day-wise itinerary is not available for this package online. Please contact us for more details.
              </div>
            )}

            {/* Highlights Section - Themed */}
            {highlights.length > 0 && (
                <section id="highlights" className="mb-10 md:mb-12 scroll-mt-20">
                    <h2 className={`${sectionHeadingStyle} text-2xl md:text-3xl`}>
                        <ListChecks size={24} className={`mr-3 ${successIconColor}`} /> Package Highlights
                    </h2>
                    <ul className={`list-disc list-inside space-y-2 pl-5 ${neutralTextLight} marker:${successIconColor}`}>
                        {highlights.map((item, i) => <li key={`hl-detail-${i}`} className="text-base md:text-lg">{item}</li>)}
                    </ul>
                </section>
            )}
            
            {/* Important Notes & Policies Section - Themed as a contextual card */}
            <section id="notes-policies" className={`${cardBaseStyle} p-6 md:p-8 bg-opacity-50 ${warningBg} border ${warningBorder} scroll-mt-20`}>
              <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl text-opacity-90 ${warningText}`}>
                <Info size={22} className={`mr-3 ${warningIconColor}`} /> Important Notes & Policies
              </h2>
              {cancellation_policy && (
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${neutralText} mb-2`}>Cancellation Policy</h3>
                  <p className={`text-sm ${neutralTextLight} whitespace-pre-line`}>{cancellation_policy}</p>
                </div>
              )}
              {itineraryNotes && (
                <div>
                  <h3 className={`text-lg font-semibold ${neutralText} mb-2`}>Itinerary Notes</h3>
                  <p className={`text-sm ${neutralTextLight} whitespace-pre-line`}>{itineraryNotes}</p>
                </div>
              )}
              {!cancellation_policy && !itineraryNotes && (
                <p className={`text-sm ${neutralTextLight} italic`}>Standard terms and conditions apply. Please contact us for specific details.</p>
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
