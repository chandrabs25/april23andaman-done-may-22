"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import type { Hotel } from "@/types/hotel";
import {
  Loader2, AlertTriangle, MapPin, ChevronLeft, Users, IndianRupee, Search, Filter as FilterIcon, Building, ChevronRight, ImageOff, X
} from "lucide-react";

// --- Import Common Styles from theme.ts ---
import {
  primaryButtonBg,
  errorBg,
  errorBorder,
  errorText,
  errorIconColor,
  neutralBgLight,
  neutralBorderLight,
  neutralBg,
  neutralBorder,
  neutralText,
  neutralTextLight,
  neutralIconColor,
  sectionPadding,
  cardBaseStyle,
  sectionHeadingStyle,
  buttonPrimaryStyle,
  buttonSecondaryStyleHero,
  infoBg,
  infoBorder,
  infoText,
  infoIconColor,
  successBg,
  successBorder,
  successText,
  successIconColor,
  warningBg,
  warningBorder,
  warningText,
  warningIconColor,
  listIconWrapperStyle,
  tipBg,
  tipText,
  tipBorder,
} from "@/styles/26themeandstyle";
// --- End Common Styles Import ---

const ITEMS_PER_PAGE = 9;

// --- Helper Components ---
const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight} p-8 md:p-12`}>
    <Loader2 className={`h-12 w-12 animate-spin ${infoIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${infoText}`}>{message}</p>
    <p className={`${neutralTextLight}`}>Please wait a moment.</p>
  </div>
);

const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${errorBg} rounded-2xl border ${errorBorder} p-8 md:p-12`}>
    <AlertTriangle className={`h-12 w-12 ${errorIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${errorText}`}>Could Not Load Data</p>
    <p className={`${neutralTextLight}`}>{message || "An unexpected error occurred. Please try again."}</p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className={`mt-6 ${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
      >
        Try Again
      </button>
    )}
  </div>
);

const NoDataState = ({ itemType, message }: { itemType: string; message?: string }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight} p-8 md:p-12`}>
    <Building className={`h-12 w-12 ${neutralIconColor} mx-auto mb-4 opacity-70`} />
    <p className={`text-xl font-semibold ${neutralText}`}>No {itemType} Found</p>
    <p className={`${neutralTextLight}`}>{message || 'Please check back soon or try different filters.'}</p>
  </div>
);
// --- End Helper Components ---

const HotelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedLocationFilter, setDebouncedLocationFilter] = useState(locationFilter);
  const [retryHotelsToken, setRetryHotelsToken] = useState(0);

  // Construct focus ring classes based on the primaryButtonBg variable
  const focusRingColorName = primaryButtonBg?.split('-')[1] || 'gray'; 
  const focusRingColorShade = primaryButtonBg?.split('-')[2] || '500'; 
  const focusRingClass = `focus:ring-${focusRingColorName}-${focusRingColorShade}`;
  const focusBorderClass = `focus:border-${focusRingColorName}-${focusRingColorShade}`;

  // Define input styles using theme variables where possible
  const inputBaseStyle = `w-full p-3 text-base ${neutralText} bg-white border ${neutralBorder} rounded-lg focus:outline-none focus:ring-2 ${focusRingClass} ${focusBorderClass} transition-shadow shadow-sm hover:border-gray-400`;
  const labelBaseStyle = `block text-sm font-medium ${neutralText} mb-2`;

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedLocationFilter(locationFilter), 500);
    return () => clearTimeout(timerId);
  }, [locationFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, debouncedLocationFilter]);

  const getHotelsListUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", ITEMS_PER_PAGE.toString());
    if (debouncedSearchTerm) params.append("name", debouncedSearchTerm);
    if (debouncedLocationFilter) params.append("location", debouncedLocationFilter);
    params.append("_retry", retryHotelsToken.toString());
    return `/api/hotels?${params.toString()}`;
  }, [currentPage, debouncedSearchTerm, debouncedLocationFilter, retryHotelsToken]);

  const {
    data: hotelsResponse,
    error: hotelsError,
    status: hotelsStatus,
  } = useFetch<Hotel[]>(getHotelsListUrl());

  useEffect(() => {
    if (hotelsStatus === 'success' && hotelsResponse) {
      console.log("Hotels Response Received on Frontend:", JSON.stringify(hotelsResponse, null, 2));
    }
  }, [hotelsResponse, hotelsStatus]);

  const isLoadingHotels = hotelsStatus === 'loading';
  const hotelsList = hotelsResponse || [];
  const totalHotels = hotelsResponse?.length || 0;
  const totalPages = Math.ceil(totalHotels / ITEMS_PER_PAGE) || 1;

  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "https://placehold.co/600x400/E2E8F0/AAAAAA?text=No+Image+Available";
    if (!url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (!url.startsWith("/")) return `/images/${url}`;
    return url;
  };

  return (
    <div className={`bg-white ${neutralText}`}>
      {/* Hero Section - Neutral */}
      <div className={`${neutralBgLight} border-b ${neutralBorderLight} py-20 md:py-32`}>
        <div className="container mx-auto px-4">
          {/* Page Header - Themed */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className={`text-4xl md:text-6xl font-bold ${neutralText} mb-4`}>Explore Our Hotels</h1>
            <p className={`text-xl md:text-2xl ${neutralTextLight} max-w-3xl mx-auto`}>
              Find the perfect stay for your next adventure from our curated selection of hotels.
            </p>
          </div>

          {/* Filter Section - Themed with cardBaseStyle */}
          <div className={`${cardBaseStyle} mb-10 md:mb-12 p-5 md:p-6`}>
            <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl mb-5 flex items-center`}>
              <FilterIcon size={22} className={`mr-3 ${neutralIconColor}`} />
              Filter Options
            </h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Input - Prominent on mobile, similar to packages page */}
              <div className="relative flex-grow md:max-w-md">
                <input 
                  type="text" 
                  id="searchTerm" 
                  placeholder="Search hotels (e.g., Sunset Paradise)" 
                  className={`w-full pl-10 pr-4 py-2.5 border ${neutralBorder} rounded-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors text-sm`}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={18} />
              </div>

              {/* Location Filter - Hidden on mobile, visible on desktop */}
              <div className="hidden md:flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    id="locationFilter" 
                    placeholder="Filter by location (e.g., Port Blair)" 
                    className={`pl-10 pr-4 py-2.5 border ${neutralBorder} rounded-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors text-sm min-w-[200px]`}
                    value={locationFilter} 
                    onChange={(e) => setLocationFilter(e.target.value)} 
                  />
                  <MapPin className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={18} />
                </div>

                {/* Clear Filters Button - Desktop only */}
                {(searchTerm || locationFilter) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("");
                    }}
                    className={`text-sm ${neutralTextLight} hover:text-red-600 transition-colors flex items-center ml-2`}
                    title="Clear all filters"
                  >
                    <X size={14} className="mr-1" /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Tags - Similar to packages page */}
            {(searchTerm || locationFilter) && (
              <div className={`mt-3 pt-3 border-t ${neutralBorderLight} flex flex-wrap items-center gap-y-1`}>
                {searchTerm && (
                  <div className={`inline-flex items-center ${tipBg} ${tipText} text-xs font-medium py-1 pl-3 pr-1.5 rounded-full mr-2 mb-2 border ${tipBorder}`}>
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`ml-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full p-0.5 transition-colors`}
                      aria-label="Remove search filter"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                {locationFilter && (
                  <div className={`inline-flex items-center ${tipBg} ${tipText} text-xs font-medium py-1 pl-3 pr-1.5 rounded-full mr-2 mb-2 border ${tipBorder}`}>
                    Location: "{locationFilter}"
                    <button
                      onClick={() => setLocationFilter("")}
                      className={`ml-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full p-0.5 transition-colors`}
                      aria-label="Remove location filter"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                {/* Clear All Button - Mobile only */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                  }}
                  className={`md:hidden text-xs ${neutralTextLight} hover:text-red-600 transition-colors flex items-center ml-auto underline`}
                  title="Clear all filters"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          {isLoadingHotels && <LoadingState message="Searching for Hotels..." />}
          {hotelsError && !isLoadingHotels && <ErrorState message={hotelsError.message} onRetry={() => setRetryHotelsToken(c => c + 1)} />}
          {!isLoadingHotels && !hotelsError && (!hotelsList || hotelsList.length === 0) && (
            <NoDataState itemType="Hotels" message="No hotels found matching your criteria. Try adjusting your filters." />
          )}

          {!isLoadingHotels && !hotelsError && hotelsList && hotelsList.length > 0 && (
            <>
              {/* Hotel List Grid - Using cardBaseStyle for each hotel card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {hotelsList.map((hotel, index) => {
                  const cardPrice = hotel.rooms && hotel.rooms.length > 0 && typeof hotel.rooms[0].base_price === 'number'
                    ? hotel.rooms[0].base_price.toLocaleString("en-IN")
                    : null;
                  const hotelMainImage = normalizeImageUrl(hotel.images?.[0]);

                  return (
                    <div key={hotel.id} className={`${cardBaseStyle} flex flex-col group cursor-pointer p-0 overflow-hidden`}>
                      <Link href={`/hotels/${hotel.id}`} className="contents">
                        <div className={`h-56 sm:h-60 w-full relative rounded-t-2xl overflow-hidden flex-shrink-0 ${neutralBgLight}`}>
                          <Image
                            src={hotelMainImage}
                            alt={hotel.name} layout="fill" objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                            onError={(e: any) => { if (e.target.src !== normalizeImageUrl(null)) e.target.src = normalizeImageUrl(null); }}
                            priority={index < 3}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {hotelMainImage.includes('placehold.co') && (
                            <div className={`absolute inset-0 flex items-center justify-center ${neutralBgLight}/80 pointer-events-none`}>
                              <ImageOff size={40} className={`${neutralIconColor} opacity-60`} />
                            </div>
                          )}
                        </div>
                        <div className="p-5 md:p-6 flex flex-col flex-grow">
                          <h2 className={`text-lg md:text-xl font-semibold mb-1.5 ${neutralText} line-clamp-2 group-hover:${infoText}`}>{hotel.name}</h2>
                          <div className={`flex items-center text-xs md:text-sm ${neutralTextLight} mb-2`}>
                            <MapPin className={`h-4 w-4 mr-1.5 ${neutralIconColor}`} /> <span className="truncate">{hotel.address}</span>
                          </div>
                          {hotel.description && <p className={`text-sm ${neutralTextLight} mt-1 mb-3 line-clamp-3`}>{hotel.description}</p>}

                          {cardPrice ? (
                            <div className={`text-xl font-semibold ${successText} mb-4`}>
                              <IndianRupee className={`inline h-5 w-5 mr-0.5 ${successIconColor}`} />
                              {cardPrice} <span className={`text-xs ${neutralTextLight} font-normal`}>/ night (from)</span>
                            </div>
                          ) : (<p className={`text-sm ${neutralTextLight} mb-4 italic`}>Check availability for prices</p>)}

                          <div className={`${buttonPrimaryStyle} w-full text-sm py-2.5 mt-auto text-center inline-flex items-center justify-center`}>
                            View Details <ChevronRight className="ml-1.5 h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination - Themed buttons */}
              {totalPages > 1 && (
                <div className="mt-10 md:mt-16 flex justify-center items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoadingHotels}
                    className={`${buttonSecondaryStyleHero} px-3 py-2 sm:px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline ml-1.5">Previous</span>
                  </button>
                  <span className={`px-3 py-2 text-sm font-medium ${neutralText} bg-white border ${neutralBorder} rounded-md shadow-sm`}>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoadingHotels || hotelsList.length < ITEMS_PER_PAGE}
                    className={`${buttonSecondaryStyleHero} px-3 py-2 sm:px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="hidden sm:inline mr-1.5">Next</span>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
