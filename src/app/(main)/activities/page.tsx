// Path: .\src\app\activities\page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Loader2,
  AlertTriangle,
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  Compass,
  Camera,
  Anchor,
  Umbrella,
  Award,
  MessageSquare,
  HelpCircle,
  IndianRupee, // Added for potential use in price
  ArrowRight // Added for potential use in buttons
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

// --- Define interfaces (consistent with API response) ---
interface Activity {
  id: number;
  name: string;
  description: string | null;
  type: string;
  provider_id: number;
  island_id: number;
  price: string;
  availability: string | null;
  images: string | null;
  amenities: string | null;
  cancellation_policy: string | null;
  island_name: string;
  image_url?: string;
  duration?: string;
  rating?: number;
}

interface GetActivitiesApiResponse {
  success: boolean;
  data: Activity[];
  message?: string;
}
// --- End Interfaces ---

// --- Color Theme ---
const primaryColor = '#F59E0B'; // Amber-600 (Example primary yellow/orange)
const primaryColorDarker = '#D97706'; // Amber-700
const primaryColorLighter = '#FCD34D'; // Amber-400
const primaryColorLightestBg = '#FFFBEB'; // Amber-50 (Very light yellow)
const primaryColorLightBg = '#FEF3C7';    // Amber-100 (Light yellow)
const primaryColorLighterBg = '#FDE68A';  // Amber-200
const primaryColorHoverLighterBg = '#FCD34D'; // Amber-400 (used for hover)
const iconColorYellow = '#FACC15';   // bright yellow  – yellow-400
const iconColorGreen = '#22C55E';   // bright green   – emerald-500
const iconColorPink = '#EC4899';   // bright pink    – pink-500
const iconColorOrange = '#F97316';   // bright orange  – orange-500

// Button Styles (Reduced padding compared to original source)
const buttonPrimaryStyle = `inline-flex items-center justify-center bg-[${primaryColor}] hover:bg-[${primaryColorDarker}] text-black font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 border border-black`;
const buttonSecondaryStyle = `inline-flex items-center justify-center bg-transparent text-white border-2 border-white hover:bg-white/10 font-semibold py-2.5 px-6 rounded-full transition-all duration-300`; // For dark backgrounds
const ctaPrimaryOnDarkStyle = `bg-white text-[${primaryColorDarker}] hover:bg-[${primaryColorLightestBg}] font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center`; // Primary action on dark bg
const ctaSecondaryOnDarkStyle = `bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center`; // Secondary action on dark bg
const cardLinkStyle = `inline-flex items-center text-[${primaryColor}] hover:text-[${primaryColorDarker}] font-medium text-sm group mt-auto pt-2 border-t border-gray-100`;
// --- End Color Theme ---

// --- LoadingSpinner Component with enhanced styling ---
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-20">
    {/* Updated color */}
    <Loader2 className={`h-10 w-10 animate-spin text-[${primaryColor}] mb-4`} />
    {/* Updated text color */}
    <span className={`text-lg font-medium text-[${primaryColorDarker}]`}>Loading exciting activities...</span>
    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
  </div>
);
// --- End LoadingSpinner ---

// --- ActivityCard Component with enhanced styling ---
interface ActivityCardProps {
  activity: Activity;
}
const ActivityCard = ({ activity }: ActivityCardProps) => {
  // --- Process data for display ---
  const imageUrl = activity.images?.split(',')[0]?.trim() || '/images/placeholder.jpg';
  const durationDisplay = activity.duration || 'Approx. 2-3 hours';
  const priceNum = parseFloat(activity.price);
  const rating = activity.rating || 4.5; // Default rating if not available

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.03] border border-gray-100"> {/* Reduced hover scale */}
      {/* Image with overlay gradient and price badge */}
      <div className="h-52 w-full relative flex-shrink-0">
        <Image
          src={imageUrl}
          alt={activity.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
        />
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Price badge - using primaryColor */}
        <div className={`absolute top-3 right-3 bg-[${primaryColor}] text-white text-sm font-bold py-1.5 px-3 rounded-full shadow-md flex items-center`}>
          <IndianRupee size={12} className="mr-0.5" /> {!isNaN(priceNum) ? `${priceNum.toLocaleString('en-IN')}` : activity.price}
        </div>

        {/* Duration badge - using primaryColorDarker text */}
        <div className={`absolute bottom-3 left-3 bg-white/90 text-[${primaryColorDarker}] text-xs font-medium py-1 px-2 rounded-full flex items-center backdrop-blur-sm`}>
          <Clock size={12} className="mr-1" />
          {durationDisplay}
        </div>
      </div>

      {/* Content with enhanced styling */}
      <div className="p-4 flex flex-col flex-grow"> {/* Reduced padding */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold leading-tight flex-1 mr-2 text-gray-800 line-clamp-2">{activity.name}</h2> {/* Added line-clamp */}
          {/* Keeping star color yellow */}
          <div className="flex items-center text-yellow-400 flex-shrink-0">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-start mb-3 text-sm text-gray-600">
          {/* Updated icon color */}
          <MapPin size={14} className={`mr-1 mt-0.5 flex-shrink-0 text-[${primaryColor}]`} />
          <span>{activity.island_name}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow"> {/* Reduced mb, line-clamp */}
          {activity.description || 'No description available.'}
        </p>

        {/* Amenities tags - assuming amenities is a comma-separated string */}
        {activity.amenities && (
          <div className="flex flex-wrap gap-1.5 mb-3"> {/* Reduced gap, mb */}
            {activity.amenities.split(',').slice(0, 3).map((amenity, index) => (
              <span key={index} className={`bg-[${primaryColorLightestBg}] text-[${primaryColorDarker}] text-xs px-2 py-0.5 rounded-full flex items-center`}> {/* Reduced py */}
                {/* Using primary color for icon */}
                <Camera size={10} className={`mr-1 text-[${primaryColor}]`} />
                {amenity.trim()}
              </span>
            ))}
            {activity.amenities.split(',').length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"> {/* Reduced py */}
                +{activity.amenities.split(',').length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100"> {/* Reduced pt */}
          <Link
            href={`/activities/${activity.id}`} // Assuming link goes to specific activity page
            // Using primary button style
            className={`${buttonPrimaryStyle} w-full block text-center`}
          >
            Learn More & Book
          </Link>
        </div>
      </div>
    </div>
  );
};
// --- End ActivityCard Component ---


// --- Main Component Logic ---
function ActivitiesContent() {
  console.log('🔍 [Activities Page] Component rendering');
  
  // Fetch data using the hook
  const { data: apiResponse, error, status } = useFetch<Activity[]>('/api/activities');
  
  // Log fetch state each render
  console.log('🔍 [Activities Page] useFetch state:', { 
    status, 
    hasError: !!error, 
    errorMessage: error?.message,
    hasData: !!apiResponse,
    dataLength: apiResponse?.length || 0
  });

  // State for activity filters
  const [filters, setFilters] = useState({
    search: '',
    island: '',
    priceRange: '',
    activityType: ''
  });

  // State for showing/hiding filters on mobile
  const [showFilters, setShowFilters] = useState(false);

  // Extract activities from the response, default to empty array
  const activities = apiResponse || [];
  
  // Log activities data when it changes
  useEffect(() => {
    if (apiResponse) {
      console.log(`🔍 [Activities Page] Received ${apiResponse.length} activities from API`);
      
      // Log first 3 activities for debugging (if they exist)
      const logLimit = Math.min(apiResponse.length, 3);
      for (let i = 0; i < logLimit; i++) {
        console.log(`🔍 [Activities Page] Activity ${i+1}/${logLimit}:`, {
          id: apiResponse[i].id,
          name: apiResponse[i].name,
          island_name: apiResponse[i].island_name,
          price: apiResponse[i].price,
          images: apiResponse[i].images?.substring(0, 50) // Just show start of images string
        });
      }
      
      if (apiResponse.length === 0) {
        console.warn('⚠️ [Activities Page] API returned empty activities array');
      }
    } else if (status === 'success') {
      console.warn('⚠️ [Activities Page] API request successful but no data received');
    }
  }, [apiResponse, status]);

  // Filter activities based on user selections
  const filteredActivities = activities.filter(activity => {
    // Search filter
    if (filters.search && !activity.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !activity.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Island filter
    if (filters.island && activity.island_name !== filters.island) {
      return false;
    }

    // Price range filter - Adjust logic to handle 5000+
    if (filters.priceRange) {
      const price = parseFloat(activity.price);
      if (isNaN(price)) return false; // Exclude if price is not a number

      if (filters.priceRange === '5000+') {
        if (price < 5000) return false;
      } else {
        const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
        if (!isNaN(min) && !isNaN(max) && (price < min || price > max)) {
          return false;
        }
        // Handle cases like "0-1000" where max is defined
        else if (!isNaN(min) && isNaN(max) && price < min) {
          return false;
        }
        // Handle cases where only min is defined (might not be used with current options)
        // else if (!isNaN(min) && isNaN(max) && price < min) return false;
      }
    }


    // Activity type filter (assuming activity.type contains this info)
    if (filters.activityType && activity.type !== filters.activityType) {
      return false;
    }

    return true;
  });
  
  // Log filtered activities count
  console.log(`🔍 [Activities Page] After filtering: ${filteredActivities.length} activities`);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      island: '',
      priceRange: '',
      activityType: ''
    });
  };

  // Add a log before returning the JSX to confirm we're reaching the render
  console.log('🔍 [Activities Page] Rendering component with filtered activities:', filteredActivities.length);

  return (
    <>
      {/* --- Hero Section with enhanced styling --- */}
      {/* Updated background gradient */}
      <div className={`relative bg-gradient-to-r from-[${primaryColor}] to-[${primaryColorDarker}] h-72 md:h-96`}>
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

        {/* Added opacity */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Image src="/images/activities-hero.jpg" alt="Andaman Activities - Desktop" fill className="object-cover hidden md:block" priority />
          <Image src="/images/activities-hero-mobile.jpg" alt="Andaman Activities - Mobile" fill className="object-cover block md:hidden" priority />
        </div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-3 md:mb-5 drop-shadow-lg">
            Exciting <span className={`text-[${primaryColorLighter}]`}>Andaman</span> Activities {/* Highlight */}
          </h1>
          <p className="text-lg sm:text-xl text-white text-center max-w-2xl opacity-95 drop-shadow-md">
            Experience thrilling adventures and create unforgettable memories
          </p>
          {/* Added CTA button - Using secondary style */}
          <Link href="#activities-grid" className={`mt-6 ${buttonSecondaryStyle}`}>
            Explore Activities
          </Link>
        </div>

        {/* Added decorative wave element - using lightest background color */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto">
            <path fill={primaryColorLightestBg} fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* --- Activities Content with enhanced styling --- */}
      {/* Updated background color */}
      <div id="activities-grid" className={`bg-[${primaryColorLightestBg}] py-12 md:py-20`}>
        <div className="container mx-auto px-4">
          {/* Added section header with icon */}
          <div className="flex items-center justify-center mb-10 md:mb-14">
            {/* Updated icon color */}
            <Compass className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
            {/* Updated heading color */}
            <h2 className={`text-2xl md:text-3xl font-bold text-[${primaryColorDarker}]`}>Find Your Perfect Activity</h2>
          </div>

          {/* Added filters section */}
          <div className="mb-10">
            {/* Mobile filter toggle */}
            <div className="md:hidden mb-6 text-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                // Updated button styles
                className={`inline-flex items-center px-5 py-2.5 border border-[${primaryColorLighter}] rounded-full shadow-sm text-sm font-medium text-[${primaryColorDarker}] bg-white hover:bg-[${primaryColorLightestBg}] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${primaryColor}] transition-all duration-300`}
              >
                <Filter size={16} className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filters */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 ${showFilters ? 'block' : 'hidden'} md:block`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                  {/* Updated icon color */}
                  <Filter className={`text-[${primaryColorDarker}] mr-2`} size={20} />
                  Filter Activities
                </h3>
                <button
                  onClick={() => handleClearFilters()}
                  // Updated hover text color
                  className={`text-sm text-gray-600 hover:text-[${primaryColorDarker}] flex items-center transition-colors`}
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Search filter */}
                <div className="md:col-span-4">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Search Activities
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      // Updated focus styles
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[${primaryColor}] focus:border-[${primaryColor}] text-base`}
                      placeholder="Search by activity name or description"
                    />
                  </div>
                </div>

                {/* Island filter */}
                <div>
                  <label htmlFor="island" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Island
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="island"
                      name="island"
                      value={filters.island}
                      onChange={handleFilterChange}
                      // Updated focus styles
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[${primaryColor}] focus:border-[${primaryColor}] text-base appearance-none`}
                    >
                      <option value="">All Islands</option>
                      {/* Dynamically load islands if needed, otherwise hardcode */}
                      <option value="Havelock Island">Havelock Island</option>
                      <option value="Neil Island">Neil Island</option>
                      <option value="Port Blair">Port Blair</option>
                      <option value="Baratang Island">Baratang Island</option>
                    </select>
                  </div>
                </div>

                {/* Price range filter */}
                <div>
                  <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price Range
                  </label>
                  <div className="relative">
                    <select
                      id="priceRange"
                      name="priceRange"
                      value={filters.priceRange}
                      onChange={handleFilterChange}
                      // Updated focus styles
                      className={`w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[${primaryColor}] focus:border-[${primaryColor}] text-base appearance-none`}
                    >
                      <option value="">Any Price</option>
                      <option value="0-1000">Under ₹1,000</option>
                      <option value="1000-3000">₹1,000 - ₹3,000</option>
                      <option value="3000-5000">₹3,000 - ₹5,000</option>
                      <option value="5000+">₹5,000+</option> {/* Match filter logic */}
                    </select>
                  </div>
                </div>

                {/* Activity type filter */}
                <div>
                  <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Activity Type
                  </label>
                  <div className="relative">
                    <select
                      id="activityType"
                      name="activityType"
                      value={filters.activityType}
                      onChange={handleFilterChange}
                      // Updated focus styles
                      className={`w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[${primaryColor}] focus:border-[${primaryColor}] text-base appearance-none`}
                    >
                      <option value="">All Types</option>
                      <option value="water">Water Activities</option>
                      <option value="adventure">Adventure</option>
                      <option value="nature">Nature & Wildlife</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add a debugging panel - can be removed in production */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">API Status:</span> {status}</p>
                <p><span className="font-medium">Error:</span> {error ? error.message : 'None'}</p>
                <p><span className="font-medium">API Data:</span> {apiResponse ? `${apiResponse.length} items` : 'None'}</p>
              </div>
              <div>
                <p><span className="font-medium">Filters:</span></p>
                <ul className="ml-4 list-disc">
                  <li>Search: {filters.search || 'None'}</li>
                  <li>Island: {filters.island || 'None'}</li>
                  <li>Price Range: {filters.priceRange || 'None'}</li>
                  <li>Activity Type: {filters.activityType || 'None'}</li>
                </ul>
              </div>
            </div>
            <div className="mt-2">
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => console.log('API Data:', apiResponse)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-xs ml-2"
              >
                Log Data to Console
              </button>
            </div>
          </div>

          {/* Activities list with enhanced states */}
          {status === 'loading' ? (
            <LoadingSpinner />
          ) : status === 'error' ? (
            // Keep error style red
            <div className="text-center py-12 px-6 bg-red-50 border border-red-200 rounded-2xl shadow-md">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium">Could not load activities.</p>
              <p className="text-red-600 text-sm mt-1">{error?.message || "An unknown error occurred."}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-5 py-2 bg-white text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <Image
                  src="/images/no-results.svg"
                  alt="No activities found"
                  width={150}
                  height={150}
                  className="mx-auto mb-6 opacity-80"
                />
                <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">No Activities Found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new activities.</p>
                <button
                  onClick={() => handleClearFilters()}
                  // Use primary button style
                  className={buttonPrimaryStyle}
                >
                  Clear All Filters
                </button>
              </div>
            )
          )}

          {/* Add a debug message if no activities are found */}
          {status === 'success' && filteredActivities.length === 0 && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative my-6">
              <strong className="font-bold">No activities found!</strong>
              <p>Debug info: API status: {status}, Error: {error?.message || 'none'}, Data received: {activities.length}</p>
              <p>Try clearing your filters or refreshing the page.</p>
            </div>
          )}

          {/* Added Featured Activities section */}
          <div className="mt-16 md:mt-20">
            <div className="flex items-center justify-center mb-10">
              {/* Updated icon color */}
              <Award className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
              {/* Updated heading color */}
              <h2 className={`text-2xl md:text-3xl font-bold text-[${primaryColorDarker}]`}>Popular Activities</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Featured Activity 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                {/* Updated icon background and color */}
                <div className={`w-16 h-16 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <Anchor className={`h-8 w-8 text-[${primaryColorDarker}]`} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Scuba Diving</h3>
                <p className="text-gray-600 mb-5">
                  Explore vibrant coral reefs and encounter exotic marine life in the crystal-clear waters of the Andaman Sea.
                </p>
                <Link href="/activities/scuba-diving" className={`text-[${primaryColor}] hover:text-[${primaryColorDarker}] font-medium inline-flex items-center`}>
                  Learn More
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* Featured Activity 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                {/* Updated icon background and color */}
                <div className={`w-16 h-16 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <Umbrella className={`h-8 w-8 text-[${primaryColorDarker}]`} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Beach Hopping</h3>
                <p className="text-gray-600 mb-5">
                  Visit the most beautiful beaches in Andaman, from the famous Radhanagar Beach to hidden gems only locals know about.
                </p>
                <Link href="/activities/beach-hopping" className={`text-[${primaryColor}] hover:text-[${primaryColorDarker}] font-medium inline-flex items-center`}>
                  Learn More
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* Featured Activity 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                {/* Updated icon background and color */}
                <div className={`w-16 h-16 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <Camera className={`h-8 w-8 text-[${primaryColorDarker}]`} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Island Tours</h3>
                <p className="text-gray-600 mb-5">
                  Discover the unique culture, history, and natural wonders of the Andaman Islands with guided tours led by local experts.
                </p>
                <Link href="/activities/island-tours" className={`text-[${primaryColor}] hover:text-[${primaryColorDarker}] font-medium inline-flex items-center`}>
                  Learn More
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Added Testimonials section */}
          <div className="mt-16 md:mt-20">
            <div className="flex items-center justify-center mb-10">
              {/* Updated icon color */}
              <MessageSquare className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
              {/* Updated heading color */}
              <h2 className={`text-2xl md:text-3xl font-bold text-[${primaryColorDarker}]`}>What Travelers Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  {/* Updated avatar placeholder style */}
                  <div className={`h-12 w-12 rounded-full bg-[${primaryColorLightBg}] flex items-center justify-center mr-4`}>
                    <span className={`text-[${primaryColorDarker}] font-bold`}>AK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Amit Kumar</h4>
                    {/* Keeping star color yellow */}
                    <div className="flex text-yellow-400">
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The scuba diving experience was incredible! The instructors were professional and made me feel safe throughout the dive. Saw amazing coral and colorful fish!"</p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  {/* Updated avatar placeholder style */}
                  <div className={`h-12 w-12 rounded-full bg-[${primaryColorLightBg}] flex items-center justify-center mr-4`}>
                    <span className={`text-[${primaryColorDarker}] font-bold`}>PG</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Priya Gupta</h4>
                    {/* Keeping star color yellow */}
                    <div className="flex text-yellow-400">
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current opacity-30" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The sea walking activity was a unique experience. It's perfect for those who want to explore underwater without diving certification. The guides were very helpful."</p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  {/* Updated avatar placeholder style */}
                  <div className={`h-12 w-12 rounded-full bg-[${primaryColorLightBg}] flex items-center justify-center mr-4`}>
                    <span className={`text-[${primaryColorDarker}] font-bold`}>RS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Rahul Singh</h4>
                    {/* Keeping star color yellow */}
                    <div className="flex text-yellow-400">
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                      <Star size={16} className="fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The island tour was well organized and our guide was knowledgeable about the history and culture. We visited places we wouldn't have found on our own."</p>
              </div>
            </div>
          </div>

          {/* Added FAQ section */}
          <div className="mt-16 md:mt-20">
            <div className="flex items-center justify-center mb-10">
              {/* Updated icon color */}
              <HelpCircle className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
              {/* Updated heading color */}
              <h2 className={`text-2xl md:text-3xl font-bold text-[${primaryColorDarker}]`}>Frequently Asked Questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FAQ Item 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Do I need to know swimming for water activities?</h3>
                <p className="text-gray-600">For activities like scuba diving and snorkeling, basic swimming skills are recommended. However, for sea walking and glass-bottom boat rides, swimming knowledge is not required.</p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">What should I bring for activities?</h3>
                <p className="text-gray-600">For most activities, bring comfortable clothing, sunscreen, a hat, and a water bottle. For water activities, bring a change of clothes and a towel. Specific requirements will be provided upon booking.</p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Can children participate in these activities?</h3>
                <p className="text-gray-600">Many activities have age restrictions. Scuba diving typically requires participants to be at least 10 years old, while activities like glass-bottom boat rides are suitable for all ages.</p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">What is the cancellation policy?</h3>
                <p className="text-gray-600">Cancellation policies vary by activity. Generally, full refunds are available if cancelled 24-48 hours before the scheduled time. Please check the specific policy for each activity.</p>
              </div>
            </div>
          </div>

          {/* Added Call to Action section */}
          {/* Updated gradient */}
          <div className={`mt-16 md:mt-20 bg-gradient-to-r from-[${primaryColor}] to-[${primaryColorDarker}] rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-lg`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
            </div>

            <div className="relative z-10">
              <h2 className={`text-2xl md:text-3xl font-bold text-[${primaryColorDarker}]`}>Ready for an Adventure?</h2>
              {/* Updated text color */}
              <p className={`text-[${primaryColorLightestBg}] mb-6 max-w-2xl mx-auto`}>
                Book your activities now and create unforgettable memories in the beautiful Andaman Islands.
                Our team is ready to help you plan the perfect experience!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Use CTA styles */}
                <Link href="/packages" /* Or specific booking link */ className={ctaPrimaryOnDarkStyle}>
                  Book an Activity
                </Link>
                <Link href="/contact" className={ctaSecondaryOnDarkStyle}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Wrap the main content component with Suspense
export default function ActivitiesPage() {
  console.log('🔍 [Activities Page] Main page component rendering');
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ActivitiesContent />
    </Suspense>
  );
}