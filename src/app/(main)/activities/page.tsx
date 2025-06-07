// Path: ./src/app/activities/page.tsx
// Redesign based on package list/details pages (Neutral Theme)
// Changes:
// 1. Applied neutral theme from 26themeandstyle.
// 2. Redesigned Hero Section.
// 3. Redesigned Filter Section (layout, input styles).
// 4. Redesigned ActivityCard to match PackageCard style.
// 5. Applied consistent padding and container usage.
// 6. Ensured responsiveness.
// 7. Kept all data fetching and filtering logic intact.
// 8. Fixed lint errors: replaced neutralIconColor, cardLinkStyle, and fixed Set iteration.

"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
  IndianRupee,
  ArrowRight,
  ImageOff,
  SlidersHorizontal,
  X,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Quote,
  Phone,
  Activity as ActivityIcon, // Renamed to avoid conflict
  Heart,
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";

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
  images: string | string[] | null; // Updated to handle both string and array
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

// --- Theme Imports (Using Neutral Theme from Package Pages) ---
import {
  neutralBgLight,
  neutralText,
  neutralTextLight,
  neutralBorder,
  neutralBorderLight,
  neutralBg,
  infoText,
  infoIconColor, // Use this for info-related icons
  infoBg,
  infoBorder,
  successText,
  successIconColor,
  successBg,
  successBorder,
  errorText,
  errorIconColor,
  errorBg,
  errorBorder,
  tipBg,
  tipBorder,
  tipText,
  tipIconColor,
  primaryButtonBg,
  primaryButtonHoverBg,
  primaryButtonText,
  buttonPrimaryStyle,
  cardBaseStyle,
  sectionPadding,
  sectionHeadingStyle,
  // cardLinkStyle, // Removed as it wasn't exported
} from "@/styles/26themeandstyle";
// --- End Theme Imports ---

// --- LoadingSpinner Component (Apply Neutral Theme) ---
const LoadingSpinner = ({ message = "Loading Activities..." }: { message?: string }) => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] text-center py-20">
    <div className="relative w-16 h-16">
      <div
        className={`absolute top-0 left-0 w-full h-full border-4 ${neutralBorder} rounded-full`}
      ></div>
      <div
        className={`absolute top-0 left-0 w-full h-full border-4 ${primaryButtonBg} rounded-full border-t-transparent animate-spin`}
      ></div>
    </div>
    <span className={`mt-4 text-lg ${neutralText} font-medium`}>{message}</span>
  </div>
);
// --- End LoadingSpinner ---

// --- Activity Card Component (Redesigned to match PackageCard) ---
interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const [imgError, setImgError] = useState(false);

  // Use the same image processing logic as the main page
  const getImageUrl = (images: string | string[] | null): string => {
    if (!images) return '/images/placeholder_service.jpg';

    let imageUrl: string | undefined;

    if (Array.isArray(images)) {
      // Handle array of images (for services and parsed package images)
      imageUrl = images[0]?.trim();
    } else if (typeof images === 'string') {
      // Handle string images (for destinations, activities - could be JSON string or comma-separated)
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          imageUrl = parsed[0]?.trim();
        } else if (typeof parsed === 'string') {
          imageUrl = parsed.trim();
        }
      } catch (e) {
        // Not JSON, treat as comma-separated or single URL
        imageUrl = images.split(',')[0]?.trim();
      }
    }

    if (!imageUrl || !(imageUrl.startsWith('/') || imageUrl.startsWith('http'))) {
      return '/images/placeholder_service.jpg';
    }
    return imageUrl;
  };

  const imageUrl = getImageUrl(activity.images);
  const durationDisplay = activity.duration || "Varies";
  const priceNum = parseFloat(activity.price);
  const rating = activity.rating || 4.5; // Default rating

  const handleImageError = () => {
    if (!imgError) setImgError(true);
  };

  // Home page card style constants
  const cardBaseStyle = "bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group";
  const cardImageContainerStyle = "w-full h-[180px] bg-cover rounded-t-2xl relative flex-shrink-0 overflow-hidden";
  const cardContentStyle = "p-3 sm:p-4 flex flex-col text-center";
  const cardTitleStyle = "text-[#111518] text-sm sm:text-base font-semibold leading-tight line-clamp-2 mb-1 h-[36px] flex items-center justify-center";
  const cardDescriptionStyle = "text-[#637988] text-xs font-normal leading-relaxed line-clamp-1 flex-1 mb-2 overflow-hidden";
  const cardBottomStyle = "mt-auto pt-1 flex flex-col items-center justify-center min-h-[32px]";

  return (
    <div className={cardBaseStyle}>
      <Link href={`/activities/${activity.id}`} className="block h-full">
        <div className={cardImageContainerStyle}>
          <img
            src={imgError ? '/images/placeholder_service.jpg' : imageUrl}
            alt={activity.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {activity.island_name && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#111518] border border-white/20 shadow-sm">
              <MapPin size={12} className="inline mr-1 -mt-0.5" />{activity.island_name}
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-gray-800 text-white text-sm font-bold py-1.5 px-3 rounded-full shadow-md flex items-center">
            <IndianRupee size={12} className="mr-0.5" />
            {!isNaN(priceNum) ? priceNum.toLocaleString('en-IN') : activity.price}
          </div>

          {(imgError || imageUrl === "/images/placeholder_service.jpg") && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 pointer-events-none">
              <ActivityIcon size={36} className="text-gray-400 opacity-50" />
            </div>
          )}
        </div>
        
        <div className={cardContentStyle}>
          <h3 className={cardTitleStyle}>{activity.name}</h3>
          <p className={cardDescriptionStyle}>{activity.description || 'Explore this exciting activity.'}</p>
          <div className={cardBottomStyle}>
            <span className="text-sm text-[#1A237E] font-medium group-hover:text-[#161D6F] transition-colors duration-300 flex items-center">
              Book Now
              <ArrowRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
// --- End Activity Card ---

// --- Filter Tag Component (Apply Contextual Tip Color) ---
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => (
  <div
    className={`inline-flex items-center ${tipBg} ${tipText} text-xs font-medium py-1 pl-3 pr-1.5 rounded-full mr-2 mb-2 border ${tipBorder}`}
  >
    {label}
    <button
      onClick={onRemove}
      className={`ml-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full p-0.5 transition-colors`}
      aria-label={`Remove ${label} filter`}
    >
      <X size={12} />
    </button>
  </div>
);
// --- End Filter Tag ---

// --- Main Component Logic (Data handling unchanged) ---
function ActivitiesContent() {
  console.log("🔍 [Activities Page] Component rendering");

  // Fetch data using the hook
  const { data: apiResponse, error, status } = useFetch<Activity[]>(
    "/api/activities"
  );

  // Log fetch state each render
  console.log("🔍 [Activities Page] useFetch state:", {
    status,
    hasError: !!error,
    errorMessage: error?.message,
    hasData: !!apiResponse,
    dataLength: apiResponse?.length || 0,
  });

  // State for activity filters
  const [filters, setFilters] = useState({
    search: "",
    island: "",
    priceRange: "",
    activityType: "",
  });

  // State for showing/hiding filters on mobile
  const [showFilters, setShowFilters] = useState(false);

  // Extract activities from the response, default to empty array
  const activities = apiResponse || [];

  // Log activities data when it changes
  useEffect(() => {
    if (apiResponse) {
      console.log(`🔍 [Activities Page] Received ${apiResponse.length} activities from API`);
      const logLimit = Math.min(apiResponse.length, 3);
      for (let i = 0; i < logLimit; i++) {
        const images = apiResponse[i].images;
        console.log(`🔍 [Activities Page] Activity ${i + 1}/${logLimit}:`, {
          id: apiResponse[i].id,
          name: apiResponse[i].name,
          island_name: apiResponse[i].island_name,
          price: apiResponse[i].price,
          images:
            typeof images === "string"
              ? (images as string).substring(0, 50)
              : Array.isArray(images)
                ? `[${images.length} images]`
                : "null",
        });
      }
      if (apiResponse.length === 0) {
        console.warn("⚠️ [Activities Page] API returned empty activities array");
      }
    } else if (status === "success") {
      console.warn("⚠️ [Activities Page] API request successful but no data received");
    }
  }, [apiResponse, status]);

  // Filter activities based on user selections (LOGIC UNCHANGED)
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (
        filters.search &&
        !activity.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !activity.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.island && activity.island_name !== filters.island) {
        return false;
      }
      if (filters.priceRange) {
        const price = parseFloat(activity.price);
        if (isNaN(price)) return false;
        if (filters.priceRange === "5000+") {
          if (price < 5000) return false;
        } else {
          const [min, max] = filters.priceRange.split("-").map((p) => parseInt(p));
          if (!isNaN(min) && !isNaN(max) && (price < min || price > max)) {
            return false;
          }
        }
      }
      if (filters.activityType && activity.type !== filters.activityType) {
        return false;
      }
      return true;
    });
  }, [activities, filters]);

  // Log filtered activities count
  console.log(
    `🔍 [Activities Page] After filtering: ${filteredActivities.length} activities`
  );

  // Handle filter changes (LOGIC UNCHANGED)
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all filters (LOGIC UNCHANGED)
  const handleClearFilters = () => {
    setFilters({
      search: "",
      island: "",
      priceRange: "",
      activityType: "",
    });
  };

  // Get active filter tags (LOGIC UNCHANGED)
  const activeFilterTags = useMemo(() => {
    const tags = [];
    if (filters.search) tags.push({ key: "search", label: `Search: "${filters.search}"` });
    if (filters.island) tags.push({ key: "island", label: `Island: ${filters.island}` });
    if (filters.activityType) tags.push({ key: "activityType", label: `Type: ${filters.activityType}` });
    if (filters.priceRange) {
      const range = filters.priceRange.split("-");
      const label = range.length > 1 ? `Price: ₹${Number(range[0]).toLocaleString("en-IN")} - ₹${Number(range[1]).toLocaleString("en-IN")}` : `Price: ₹${Number(range[0].replace("+", "")).toLocaleString("en-IN")}+`;
      tags.push({ key: "priceRange", label });
    }
    return tags;
  }, [filters]);

  // Add a log before returning the JSX to confirm we're reaching the render
  console.log("🔍 [Activities Page] Rendering JSX...");

  // --- Render Logic (UI Redesigned) ---
  return (
    <div className={`bg-white ${neutralText}`}>
      {/* Hero Section - Redesigned with Neutral Theme */}
      <div className="relative bg-gray-800 text-white py-20 md:py-32">
        <Image
          src="/images/activities-hero.jpg" // Replace with a suitable hero image
          alt="Andaman Activities"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Andaman Activities
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            From thrilling water sports to serene nature walks, find your next
            adventure.
          </p>
        </div>
      </div>

      {/* Filter Section - Redesigned with Neutral Theme */}
      <section
        className={`sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm border-b ${neutralBorderLight} py-4`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input - Styled like package list */}
            <div className="relative flex-grow md:max-w-xs lg:max-w-sm">
              <input
                type="text"
                name="search"
                placeholder="Search activities (e.g., Scuba, Kayaking)"
                value={filters.search}
                onChange={handleFilterChange}
                className={`w-full pl-10 pr-4 py-2.5 border ${neutralBorder} rounded-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors text-sm`}
              />
              {/* Replaced neutralIconColor with neutralTextLight */}
              <Search
                size={18}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${neutralTextLight}`}
              />
            </div>

            {/* Filter Controls - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              {/* Island Dropdown */}
              <div className="relative">
                <select
                  name="island"
                  value={filters.island}
                  onChange={handleFilterChange}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer min-w-[120px]`}
                >
                  <option value="">All Islands</option>
                  {/* Fixed Set iteration: Use Array.from() */}
                  {Array.from(new Set(activities.map((a) => a.island_name)))
                    .sort()
                    .map((island) => (
                      <option key={island} value={island}>
                        {island}
                      </option>
                    ))}
                </select>
                {/* Replaced neutralIconColor with neutralTextLight */}
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralTextLight} pointer-events-none`}
                />
              </div>

              {/* Activity Type Dropdown */}
              <div className="relative">
                <select
                  name="activityType"
                  value={filters.activityType}
                  onChange={handleFilterChange}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer min-w-[120px]`}
                >
                  <option value="">All Types</option>
                  {/* Fixed Set iteration: Use Array.from() */}
                  {Array.from(new Set(activities.map((a) => a.type)))
                    .sort()
                    .map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
                {/* Replaced neutralIconColor with neutralTextLight */}
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralTextLight} pointer-events-none`}
                />
              </div>

              {/* Price Dropdown */}
              <div className="relative">
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer min-w-[120px]`}
                >
                  <option value="">Price Range</option>
                  <option value="0-1000">Under ₹1,000</option>
                  <option value="1000-3000">₹1,000 - ₹3,000</option>
                  <option value="3000-5000">₹3,000 - ₹5,000</option>
                  <option value="5000+">₹5,000+</option>
                </select>
                {/* Replaced neutralIconColor with neutralTextLight */}
                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralTextLight} pointer-events-none`}
                />
              </div>

              {/* Clear Filters Button - Desktop only */}
              {Object.values(filters).some((v) => v !== "") && (
                <button
                  onClick={handleClearFilters}
                  className={`text-sm ${neutralTextLight} hover:text-red-600 transition-colors ml-2 flex items-center`}
                  title="Clear all filters"
                >
                  <X size={14} className="mr-1" /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Tags & Mobile Clear Button */}
          {activeFilterTags.length > 0 && (
            <div
              className={`mt-3 pt-3 border-t ${neutralBorderLight} flex flex-wrap items-center gap-y-1`}
            >
              {activeFilterTags.map((tag) => (
                <FilterTag
                  key={tag.key}
                  label={tag.label}
                  onRemove={() =>
                    setFilters((prev) => ({
                      ...prev,
                      [tag.key]: "",
                    }))
                  }
                />
              ))}
              {/* Clear All Button - Mobile only */}
              <button
                onClick={handleClearFilters}
                className={`md:hidden text-xs ${neutralTextLight} hover:text-red-600 transition-colors flex items-center ml-auto underline`}
                title="Clear all filters"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area - Neutral Light Background */}
      <div className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {status === "loading" && <LoadingSpinner />}

          {/* Error State - Contextual Error Red */}
          {status === "error" && (
            <div
              className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${errorBg} border ${errorBorder}`}
            >
              <AlertTriangle className={`w-16 h-16 ${errorIconColor} mb-6`} />
              <h3 className={`text-2xl font-semibold ${errorText} mb-3`}>
                Oops! Something went wrong.
              </h3>
              <p className={`${neutralTextLight} mb-6`}>
                We couldn't load the activities right now. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className={`${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
              >
                <RefreshCw size={16} className="mr-2" /> Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              {filteredActivities.length > 0 ? (
                <>
                  {/* Results Count - Simplified */}
                  <div className="mb-8 text-center md:text-left">
                    <p className={`${neutralTextLight} text-sm`}>
                      Showing{" "}
                      <span className={`font-semibold ${neutralText}`}>
                        {filteredActivities.length}
                      </span>{" "}
                      {filteredActivities.length === activities.length
                        ? ""
                        : `of ${activities.length}`}{" "}
                      activit{filteredActivities.length === 1 ? "y" : "ies"}
                      {activeFilterTags.length > 0 ? " matching your filters" : ""}
                    </p>
                  </div>

                  {/* Activities Grid */}
                  <div
                    id="activities-grid"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  >
                    {filteredActivities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>

                  {/* Pagination Placeholder - Add if needed */}
                  {/* <nav className="mt-16 flex justify-center">...</nav> */}
                </>
              ) : (
                /* No Results State - Contextual Tip Yellow */
                <div
                  className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${tipBg} border ${tipBorder}`}
                >
                  <Compass className={`w-16 h-16 ${tipIconColor} mb-6`} />
                  <h3 className={`text-2xl font-semibold ${tipText} mb-3`}>
                    No Activities Found
                  </h3>
                  <p className={`${neutralTextLight} mb-6`}>
                    Try adjusting your filters or search terms. We couldn't find
                    activities matching your current selection.
                  </p>
                  <button onClick={handleClearFilters} className={buttonPrimaryStyle}>
                    <RefreshCw size={16} className="mr-2" /> Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- FAQ Section (Styled like package list) --- */}
      <section className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div
              className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border ${neutralBorderLight}`}
            >
              {/* Replaced neutralIconColor with neutralTextLight */}
              <HelpCircle className={neutralTextLight} size={24} />
            </div>
            <h2 className={`${sectionHeadingStyle} ${neutralText}`}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <details
                key={i}
                className={`bg-white p-5 rounded-xl shadow-md border ${neutralBorderLight} group transition-all duration-300 hover:shadow-lg`}
              >
                <summary
                  className={`flex justify-between items-center font-semibold ${neutralText} cursor-pointer list-none text-lg`}
                >
                  <span>Question {i}: What should I bring for water sports?</span>
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border ${neutralBorder} group-hover:bg-gray-100 transition-colors`}
                  >
                    {/* Replaced neutralIconColor with neutralTextLight */}
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 group-open:rotate-180 ${neutralTextLight}`}
                    />
                  </div>
                </summary>
                <div className="overflow-hidden max-h-0 group-open:max-h-screen transition-all duration-500 ease-in-out">
                  <p
                    className={`mt-4 text-sm ${neutralTextLight} leading-relaxed border-t ${neutralBorderLight} pt-4`}
                  >
                    Answer {i}: We recommend bringing swimwear, a towel, sunscreen,
                    sunglasses, a hat, and a waterproof bag for your valuables.
                    Specific gear for the activity is usually provided.
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* --- END FAQ Section --- */}

      {/* --- Testimonials Section (Styled like package list) --- */}
      <section className={`${sectionPadding} bg-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div
              className={`w-12 h-12 ${neutralBg} rounded-full flex items-center justify-center mr-4 border ${neutralBorder}`}
            >
              {/* Replaced neutralIconColor with neutralTextLight */}
              <MessageSquare className={neutralTextLight} size={24} />
            </div>
            <h2 className={sectionHeadingStyle}>What Our Adventurers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 border ${neutralBorderLight} shadow-lg flex flex-col text-center items-center transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2`}
              >
                {/* Replaced neutralIconColor with neutralTextLight */}
                <Quote
                  className={`w-10 h-10 ${neutralTextLight} opacity-30 mb-4`}
                />
                <p className={`text-base italic ${neutralTextLight} mb-6 flex-grow`}>
                  "Testimonial {i}: The scuba diving was incredible! The instructors
                  were professional and made us feel safe. Saw amazing coral and
                  fish!"
                </p>
                <div
                  className={`flex items-center justify-center flex-col mt-auto pt-4 border-t ${neutralBorderLight} w-full`}
                >
                  <Image
                    src={`/images/avatar-${i}.jpg`}
                    alt={`Adventurer ${i}`}
                    width={56}
                    height={56}
                    className="rounded-full mb-3 border-2 border-white shadow-md"
                  />
                  <p className={`font-semibold ${neutralText}`}>Adventurer Name {i}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        size={16}
                        className={`fill-current text-yellow-400`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- END Testimonials Section --- */}

      {/* --- Call to Action Section (Styled like package list) --- */}
      <section className={`${sectionPadding} ${primaryButtonBg} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <ActivityIcon size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Andaman Adventure?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Book your activities today and create unforgettable memories.
          </p>
          {/* Button style adjusted for dark background */}
          <Link
            href="/contact"
            className={`inline-flex items-center justify-center bg-white ${neutralText} hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
          >
            Contact Us for Custom Plans
          </Link>
        </div>
      </section>
      {/* --- END Call to Action Section --- */}

      {/* Footer - Neutral Dark */}
      <footer className={`py-12 ${neutralBg} border-t ${neutralBorder}`}>
        <div
          className={`container mx-auto px-4 text-center ${neutralTextLight} text-sm`}
        >
          <p>
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
          <nav className="mt-4 space-x-4">
            <Link href="/privacy" className={`hover:${neutralText}`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`hover:${neutralText}`}>
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// --- Suspense Wrapper (Keep as is) ---
export default function ActivitiesPage() {
  // Add log to confirm top-level component render
  console.log("🔍 [Activities Page] Rendering ActivitiesPage (Suspense Wrapper)");
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ActivitiesContent />
    </Suspense>
  );
}

