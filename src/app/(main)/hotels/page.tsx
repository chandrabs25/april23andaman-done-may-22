"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import type { Hotel, PaginatedHotelsResponse } from "@/types/hotel";
import {
  Loader2, AlertTriangle, MapPin, ChevronLeft, Users, IndianRupee, Search, Filter as FilterIcon, Building, ChevronRight, ImageOff, X,
  Heart, Star, ArrowRight, ChevronDown, Check, Info, Ban, Quote, Phone, MessageSquare, HelpCircle, RefreshCw
} from "lucide-react";

// --- Define Common Styles (Same as packages page) ---
const primaryButtonBg = 'bg-gray-800';
const primaryButtonHoverBg = 'hover:bg-gray-700';
const primaryButtonText = 'text-white';

const infoBg = 'bg-blue-50';
const infoBorder = 'border-blue-100';
const infoText = 'text-blue-800';
const infoIconColor = 'text-blue-600';

const successBg = 'bg-green-50';
const successBorder = 'border-green-100';
const successText = 'text-green-800';
const successIconColor = 'text-green-600';

const warningBg = 'bg-orange-50';
const warningBorder = 'border-orange-100';
const warningText = 'text-orange-800';
const warningIconColor = 'text-orange-600';

const errorBg = 'bg-red-50';
const errorBorder = 'border-red-100';
const errorText = 'text-red-800';
const errorIconColor = 'text-red-600';

const tipBg = 'bg-yellow-50';
const tipBorder = 'border-yellow-100';
const tipText = 'text-yellow-800';
const tipIconColor = 'text-yellow-700';

const neutralBgLight = 'bg-gray-50';
const neutralBorderLight = 'border-gray-100';
const neutralBg = 'bg-gray-100';
const neutralBorder = 'border-gray-200';
const neutralText = 'text-gray-800';
const neutralTextLight = 'text-gray-600';
const neutralIconColor = 'text-gray-600';

const sectionPadding = "py-16 md:py-24";
const sectionHeadingStyle = `text-2xl md:text-3xl font-bold ${neutralText}`;
const cardBaseStyle = `bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.03] border ${neutralBorderLight} h-full group`;
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`;
const cardLinkStyle = `inline-flex items-center ${neutralText} hover:text-gray-800 font-medium text-sm group mt-auto pt-2 border-t ${neutralBorderLight} px-1`;

const ITEMS_PER_PAGE = 9;

// --- LoadingSpinner Component ---
const LoadingSpinner = ({ message = "Loading Hotels..." }: { message?: string }) => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] text-center py-20">
    <div className="relative w-16 h-16">
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${neutralBorder} rounded-full`}></div>
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${primaryButtonBg} rounded-full border-t-transparent animate-spin`}></div>
    </div>
    <span className={`mt-4 text-lg ${neutralText} font-medium`}>{message}</span>
  </div>
);

// --- Filter Tag Component ---
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => (
  <div className={`inline-flex items-center ${tipBg} ${tipText} text-xs font-medium py-1 pl-3 pr-1.5 rounded-full mr-2 mb-2 border ${tipBorder}`}>
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

// --- Hotel Card Component ---
interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const [imgError, setImgError] = useState(false);
  
  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder.jpg";
    if (imgError || !url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    return url.startsWith("http") || url.startsWith("/") ? url : `/images/${url}`;
  };
  
  const imageUrl = normalizeImageUrl((hotel.images && hotel.images.length > 0) ? hotel.images[0] : null);
  const cardPrice = hotel.rooms?.[0]?.base_price;
  const formattedPrice = typeof cardPrice === 'number' ? cardPrice.toLocaleString("en-IN") : null;
  
  // Create hotel features similar to packages
  const hotelFeatures = [
    hotel.amenities?.length ? `${hotel.amenities.length} Amenities` : 'Modern Amenities',
    hotel.rooms?.length ? `${hotel.rooms.length} Room Types` : 'Multiple Room Options',
    'Prime Location'
  ].slice(0, 3);

  const handleImageError = () => {
    if (!imgError) setImgError(true);
  };

  return (
    <div className={cardBaseStyle}>
      <div className="h-52 w-full relative flex-shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          onError={handleImageError}
        />
        
        {imageUrl === "/images/placeholder.jpg" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 pointer-events-none">
            <Building size={36} className="text-gray-400 opacity-50" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {formattedPrice && (
          <div className={`absolute top-3 right-3 ${primaryButtonBg} ${primaryButtonText} text-sm font-bold py-1.5 px-3 rounded-full shadow-md flex items-center`}>
            <IndianRupee size={12} className="mr-0.5" />{formattedPrice}
          </div>
        )}
        
        <div className={`absolute bottom-3 left-3 bg-white/90 ${neutralText} text-xs font-medium py-1.5 px-3 rounded-full flex items-center backdrop-blur-sm border ${neutralBorderLight}`}>
          <MapPin size={12} className="mr-1.5" />
          {hotel.address || 'Prime Location'}
        </div>
        
        <button className={`absolute top-3 left-3 bg-white/90 ${neutralTextLight} hover:text-red-500 p-2 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300 border ${neutralBorderLight}`}>
          <Heart size={16} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-lg font-semibold leading-tight mb-2 ${neutralText} line-clamp-2`}>{hotel.name}</h3>
        <p className={`${neutralTextLight} text-sm mb-3 line-clamp-2 flex-grow`}>
          {hotel.description || 'Experience comfort and luxury with modern amenities and exceptional service in the heart of Andaman.'}
        </p>
        
        <div className="mb-3 space-y-1">
          {hotelFeatures.map((feature: string, index: number) => (
            <div key={index} className={`flex items-center ${neutralTextLight} text-xs`}>
              <div className={`w-3 h-3 rounded-full ${neutralBg} flex items-center justify-center mr-1.5 flex-shrink-0 border ${neutralBorder}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${primaryButtonBg}`}></div>
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className={`flex justify-between items-center mt-auto pt-3 border-t ${neutralBorderLight}`}>
          <span className={`${neutralTextLight} text-sm`}>
            From <span className={`font-semibold ${neutralText}`}>₹{formattedPrice || 'Contact'}</span>
            {formattedPrice && <span className="text-xs block">per night</span>}
          </span>
          <Link href={`/hotels/${hotel.id}`} className={cardLinkStyle}>
            View Details
            <ArrowRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
  </div>
);
};

const HotelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedLocationFilter, setDebouncedLocationFilter] = useState(locationFilter);
  const [retryHotelsToken, setRetryHotelsToken] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

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
  }, [debouncedSearchTerm, debouncedLocationFilter, priceRange]);

  useEffect(() => {
    setIsFilterApplied(
      searchTerm !== '' ||
      locationFilter !== '' ||
      priceRange !== ''
    );
  }, [searchTerm, locationFilter, priceRange]);

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
  } = useFetch<PaginatedHotelsResponse>(getHotelsListUrl());

  const isLoadingHotels = hotelsStatus === 'loading';
  const hotelsList = hotelsResponse?.data || [];
  const totalHotels = hotelsResponse?.total || 0;
  const totalPages = hotelsList.length > 0 ? Math.ceil(totalHotels / ITEMS_PER_PAGE) || 1 : 1;

  // Filter handlers
  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setPriceRange("");
  };

  const handleQuickLocationSelect = (location: string) => {
    setLocationFilter(location);
  };

  // Get active filter tags
  const activeFilterTags = [];
  if (searchTerm) activeFilterTags.push({ key: 'search', label: `Search: "${searchTerm}"` });
  if (locationFilter) activeFilterTags.push({ key: 'location', label: `Location: ${locationFilter}` });
  if (priceRange) {
    const range = priceRange.split('-');
    const label = range.length > 1 ? `Price: ₹${Number(range[0]).toLocaleString('en-IN')} - ₹${Number(range[1]).toLocaleString('en-IN')}` : `Price: ₹${Number(range[0].replace('+', '')).toLocaleString('en-IN')}+`;
    activeFilterTags.push({ key: 'price', label });
  }

  const handleRemoveFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'search': setSearchTerm(""); break;
      case 'location': setLocationFilter(""); break;
      case 'price': setPriceRange(""); break;
    }
  };

  return (
    <div className={`bg-white ${neutralText}`}>
      {/* Hero Section - Same as packages */}
      <div className="relative bg-gray-900 text-white py-20 md:py-32">
        <Image
          src="/images/hotels-hero.jpg"
          alt="Andaman Hotels"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-40"
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">Discover comfortable accommodations across the Andaman Islands. From luxury resorts to cozy guesthouses.</p>
        </div>
      </div>

      {/* Filter Section - Same as packages */}
      <section className={`sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm border-b ${neutralBorderLight} py-4`}>
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input */}
              <div className="relative flex-grow md:max-w-md">
                <input
                  type="text"
                placeholder="Search hotels (e.g., Resort, Beachfront)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border ${neutralBorder} rounded-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors text-sm`}
              />
              <Search size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${neutralIconColor}`} />
            </div>

            {/* Filter Controls - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              {/* Location Dropdown */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}
                >
                  <option value="">Location</option>
                  <option value="Port Blair">Port Blair</option>
                  <option value="Havelock">Havelock</option>
                  <option value="Neil Island">Neil Island</option>
                  <option value="Diglipur">Diglipur</option>
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
              </div>

              {/* Price Dropdown */}
                <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}
                >
                  <option value="">Price Range</option>
                  <option value="0-2000">Under ₹2,000</option>
                  <option value="2000-5000">₹2,000 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000+">₹10,000+</option>
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
                </div>

              {/* Clear Filters Button */}
              {isFilterApplied && (
                  <button
                  onClick={handleClearFilters}
                  className={`text-sm ${neutralTextLight} hover:text-red-600 transition-colors flex items-center ml-2`}
                    title="Clear all filters"
                  >
                    <X size={14} className="mr-1" /> Clear All
                  </button>
                )}
              </div>
            </div>

          {/* Quick Location Buttons - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex mt-3 flex-wrap gap-2">
            <span className={`text-xs font-medium ${neutralTextLight} mr-2 mt-1`}>Popular:</span>
            {['Port Blair', 'Havelock', 'Neil Island', 'Beachfront', 'Luxury'].map(location => (
              <button
                key={location}
                onClick={() => handleQuickLocationSelect(location)}
                className={`text-xs px-3 py-1 rounded-full border ${neutralBorder} ${locationFilter === location ? `${primaryButtonBg} ${primaryButtonText} border-transparent` : `bg-white ${neutralText} hover:bg-gray-50`} transition-colors`}
              >
                {location}
              </button>
            ))}
          </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className={`mt-3 pt-3 border-t ${neutralBorderLight}`}>
              {activeFilterTags.map(tag => (
                <FilterTag key={tag.key} label={tag.label} onRemove={() => handleRemoveFilter(tag.key)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {isLoadingHotels && <LoadingSpinner />}

          {/* Error State */}
          {hotelsError && !isLoadingHotels && (
            <div className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${errorBg} border ${errorBorder}`}>
              <AlertTriangle className={`w-16 h-16 ${errorIconColor} mb-6`} />
              <h3 className={`text-2xl font-semibold ${errorText} mb-3`}>Oops! Something went wrong.</h3>
              <p className={`${neutralTextLight} mb-6`}>We couldn't load the hotels right now. Please try again later.</p>
              <button onClick={() => setRetryHotelsToken(c => c + 1)} className={buttonPrimaryStyle}>
                <RefreshCw size={16} className="mr-2" /> Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {!isLoadingHotels && !hotelsError && (
            <>
              {hotelsList.length > 0 ? (
                <>
                  {/* Results Count - Hidden on mobile, visible on desktop */}
                  <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-8">
                    <p className={`${neutralTextLight} text-sm mb-4 md:mb-0`}>
                      Showing <span className={`font-semibold ${neutralText}`}>{hotelsList.length}</span> hotels
                    </p>
                    {/* Sorting Dropdown */}
                    <div className="relative">
                      <select className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}>
                        <option>Sort by: Relevance</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Rating: High to Low</option>
                      </select>
                      <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
                    </div>
                  </div>

                  {/* Hotels Grid */}
                  <div id="hotels-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {hotelsList.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
              </div>

                  {/* Pagination */}
              {totalPages > 1 && (
                    <nav className="mt-16 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full border ${neutralBorder} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : `hover:bg-gray-100`}`}
                        aria-label="Previous Page"
                      >
                        <ChevronLeft size={20} className={neutralIconColor} />
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-full text-sm font-medium border ${pageNum === currentPage ? `${primaryButtonBg} ${primaryButtonText} border-transparent shadow-sm` : `bg-white ${neutralText} ${neutralBorder} hover:bg-gray-100`} transition-colors`}
                            aria-current={pageNum === currentPage ? 'page' : undefined}
                          >
                            {pageNum}
                  </button>
                        );
                      })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full border ${neutralBorder} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : `hover:bg-gray-100`}`}
                        aria-label="Next Page"
                      >
                        <ChevronRight size={20} className={neutralIconColor} />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                /* No Results State */
                <div className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${tipBg} border ${tipBorder}`}>
                  <Building className={`w-16 h-16 ${tipIconColor} mb-6`} />
                  <h3 className={`text-2xl font-semibold ${tipText} mb-3`}>No Hotels Found</h3>
                  <p className={`${neutralTextLight} mb-6`}>Try adjusting your filters or search terms. We couldn't find hotels matching your current selection.</p>
                  <button onClick={handleClearFilters} className={buttonPrimaryStyle}>
                    <RefreshCw size={16} className="mr-2" /> Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FAQ Section - Same as packages */}
      <section className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border ${neutralBorderLight}`}>
              <HelpCircle className={neutralIconColor} size={24} />
            </div>
            <h2 className={`${sectionHeadingStyle} ${neutralText}`}>Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "What amenities are typically included?", a: "Most hotels include WiFi, air conditioning, room service, and complimentary breakfast. Luxury hotels may offer spa services, swimming pools, and beachfront access." },
              { q: "What is the cancellation policy?", a: "Cancellation policies vary by hotel. Most offer free cancellation up to 24-48 hours before check-in. Premium hotels may have different terms." },
              { q: "Are airport transfers included?", a: "Some hotels offer complimentary airport transfers, while others charge separately. Check individual hotel policies or contact us for assistance with arrangements." }
            ].map((faq, i) => (
              <details key={i} className={`bg-white p-5 rounded-xl shadow-md border ${neutralBorderLight} group transition-all duration-300 hover:shadow-lg`}>
                <summary className={`flex justify-between items-center font-semibold ${neutralText} cursor-pointer list-none text-lg`}>
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${neutralBorder} group-hover:bg-gray-100 transition-colors`}>
                    <ChevronDown size={20} className={`transition-transform duration-300 group-open:rotate-180 ${neutralIconColor}`} />
                  </div>
                </summary>
                <div className="overflow-hidden max-h-0 group-open:max-h-screen transition-all duration-500 ease-in-out">
                  <p className={`mt-4 text-sm ${neutralTextLight} leading-relaxed border-t ${neutralBorderLight} pt-4`}>
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Same as packages */}
      <section className={`${sectionPadding} bg-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div className={`w-12 h-12 ${neutralBg} rounded-full flex items-center justify-center mr-4 border ${neutralBorder}`}>
              <MessageSquare className={neutralIconColor} size={24} />
            </div>
            <h2 className={sectionHeadingStyle}>What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Exceptional service and beautiful beachfront location. The staff went above and beyond to make our stay memorable.", name: "Sarah & Mike" },
              { text: "Perfect base for exploring the islands. Clean rooms, great food, and amazing views. Highly recommend!", name: "Raj Patel" },
              { text: "Luxury and comfort combined with Andaman's natural beauty. Every detail was thoughtfully arranged.", name: "Emily Chen" }
            ].map((testimonial, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border ${neutralBorderLight} shadow-lg flex flex-col text-center items-center transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2`}>
                <Quote className={`w-10 h-10 ${neutralIconColor} opacity-30 mb-4`} />
                <p className={`text-base italic ${neutralTextLight} mb-6 flex-grow`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center flex-col mt-auto pt-4 border-t ${neutralBorderLight} w-full">
                  <Image src={`/images/avatar-${i + 1}.jpg`} alt={testimonial.name} width={56} height={56} className="rounded-full mb-3 border-2 border-white shadow-md" />
                  <p className={`font-semibold ${neutralText}`}>{testimonial.name}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, s) => <Star key={s} size={16} className={`fill-current text-yellow-400`} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Same as packages */}
      <section className={`${sectionPadding} ${infoBg}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border ${neutralBorderLight}`}>
              <Building className={infoIconColor} size={24} />
            </div>
            <h2 className={`${sectionHeadingStyle} ${infoText}`}>Need Help Finding the Perfect Hotel?</h2>
          </div>
          <p className={`${neutralTextLight} max-w-xl mx-auto mb-8`}>
            Our travel experts can help you find the ideal accommodation based on your preferences, budget, and travel dates.
          </p>
          <Link href="/contact" className={buttonPrimaryStyle}>
            Get Personal Assistance <Phone size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HotelsPage;