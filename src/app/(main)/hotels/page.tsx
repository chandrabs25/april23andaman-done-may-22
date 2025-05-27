"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import dynamic from 'next/dynamic';
// import Link from "next/link"; // Not used in this version
import { useFetch } from "@/hooks/useFetch";
import type { Hotel, Room } from "@/types/hotel"; // Assuming these types are correctly defined
import {
  Loader2, AlertTriangle, MapPin, ChevronLeft, Users, IndianRupee, ListChecks, Search, Filter as FilterIcon, BedDouble, Wifi, ParkingCircle, Utensils, Briefcase, Building, ChevronRight, XCircle, Heart, DollarSign, Calendar, Clock, ChevronDown, CreditCard, Info, ExternalLink, MessageSquare, Share2, ThumbsUp, ThumbsDown, Award, CheckCircle, X, Phone, Mail, Globe, ImageOff, Eye, ShieldCheck
} from "lucide-react"; // Removed Star from imports, Added ShieldCheck

// --- Import Common Styles from theme.ts ---
import {
  primaryButtonBg, // Keep for focus ring logic if not directly provided by theme button styles
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
  successBg, // Added for potential use, e.g. price display
  successBorder, // Added
  successText, // Added
  successIconColor, // Added
  warningBg, // Added for potential warnings or alerts
  warningBorder, // Added
  warningText, // Added
  warningIconColor, // Added
  listIconWrapperStyle, // For icons in lists
} from "@/styles/26themeandstyle";
// --- End Common Styles Import ---


const HotelDetailMap = dynamic(() => import('@/components/HotelDetailMap'), {
  ssr: false,
  loading: () => <div className={`h-80 md:h-96 w-full rounded-lg ${neutralBgLight} flex items-center justify-center border ${neutralBorderLight}`}><Loader2 className={`h-8 w-8 animate-spin ${neutralIconColor}`} /></div>,
});

const ITEMS_PER_PAGE = 9;

// --- Helper Components ---
const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight} p-8 md:p-12`}>
    <Loader2 className={`h-12 w-12 animate-spin ${infoIconColor} mx-auto mb-4`} /> {/* Changed to infoIconColor for thematic consistency */}
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
        className={`mt-6 ${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500`} // More prominent error retry button
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


interface DetailSectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  id?: string;
  titleClassName?: string; // Added for more control over title styling if needed
}
const DetailSection: React.FC<DetailSectionProps> = ({ id, title, icon: Icon, children, className, titleClassName }) => (
  <div id={id} className={`py-6 md:py-8 border-b ${neutralBorderLight} last:border-b-0 ${className || ""}`}>
    <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl ${titleClassName || ''}`}> {/* Adjusted size for detail sections */}
      {Icon && <Icon size={22} className={`mr-3 ${neutralIconColor}`} />} {/* Slightly larger icon */}
      {title}
    </h2>
    <div className={`text-sm md:text-base ${neutralTextLight} leading-relaxed space-y-3 mt-3 md:mt-4`}> {/* Increased spacing and base size */}
      {children}
    </div>
  </div>
);
// --- End Helper Components ---

const HotelsPage = () => {
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedLocationFilter, setDebouncedLocationFilter] = useState(locationFilter);

  const [retryHotelsToken, setRetryHotelsToken] = useState(0);
  const [retrySelectedHotelToken, setRetrySelectedHotelToken] = useState(0);

  // Construct focus ring classes based on the primaryButtonBg variable
  // This assumes primaryButtonBg is a string like "bg-blue-600" or "bg-gray-800"
  // And your buttonPrimaryStyle and buttonSecondaryStyle already include focus:ring-opacity-50 etc.
  const focusRingColorName = primaryButtonBg?.split('-')[1] || 'gray'; 
  const focusRingColorShade = primaryButtonBg?.split('-')[2] || '500'; 
  
  // The theme file should ideally provide these, or input styles directly
  const focusRingClass = `focus:ring-${focusRingColorName}-${focusRingColorShade}`;
  const focusBorderClass = `focus:border-${focusRingColorName}-${focusRingColorShade}`;

  // Define input styles using theme variables where possible - ideally these would be in the theme file
  const inputBaseStyle = `w-full p-3 text-base ${neutralText} bg-white border ${neutralBorder} rounded-lg focus:outline-none focus:ring-2 ${focusRingClass} ${focusBorderClass} transition-shadow shadow-sm hover:border-gray-400`; // Enhanced input style
  const labelBaseStyle = `block text-sm font-medium ${neutralText} mb-2`; // Bolder label


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


  const selectedHotelApiUrl = selectedHotelId ? `/api/hotels/${selectedHotelId}?_retry=${retrySelectedHotelToken}` : null;
  const {
    data: selectedHotelData,
    error: selectedHotelError,
    status: selectedHotelStatus,
  } = useFetch<Hotel>(selectedHotelApiUrl);

  const isLoadingSelectedHotel = selectedHotelStatus === 'loading';
  const selectedHotel = selectedHotelData && 'id' in selectedHotelData ? selectedHotelData : undefined;


  const handleSelectHotel = (hotelId: number) => {
    setRetrySelectedHotelToken(0);
    setSelectedHotelId(hotelId);
    window.scrollTo(0, 0);
  };
  const handleBackToList = () => {
    setSelectedHotelId(null);
    window.scrollTo(0, 0);
  };


  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "https://placehold.co/600x400/E2E8F0/AAAAAA?text=No+Image+Available";
    if (!url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (!url.startsWith("/")) return `/images/${url}`;
    return url;
  };


  const getAmenityIcon = (amenity: string, size = "h-4 w-4") => {
    const lowerAmenity = amenity.toLowerCase();
    const iconClass = `${size} mr-2 ${neutralIconColor} flex-shrink-0`;
    if (lowerAmenity.includes("wifi")) return <Wifi className={iconClass} />;
    if (lowerAmenity.includes("parking")) return <ParkingCircle className={iconClass} />;
    if (lowerAmenity.includes("restaurant") || lowerAmenity.includes("dining")) return <Utensils className={iconClass} />;
    if (lowerAmenity.includes("pool")) return <Award className={iconClass} />;
    if (lowerAmenity.includes("gym") || lowerAmenity.includes("fitness")) return <Briefcase className={iconClass} />;
    return <CheckCircle className={iconClass} />;
  };

  const handleBookRoom = (roomId: number, hotelName: string | undefined, roomTypeName: string) => {
    alert(`Booking room: ${roomTypeName} at ${hotelName || 'this hotel'} (Room ID: ${roomId}). Integration pending.`);
  };

  // --- Hotel Detail View ---
  if (selectedHotelId) {
    if (isLoadingSelectedHotel) return <LoadingState message="Loading Hotel Details..." />;
    if (selectedHotelError || !selectedHotel) return <ErrorState message={selectedHotelError?.message || "Hotel details could not be found."} onRetry={() => setRetrySelectedHotelToken(c => c + 1)} />;

    let calculatedMinPrice: number | null = null;
    if (selectedHotel.rooms && selectedHotel.rooms.length > 0) {
      calculatedMinPrice = selectedHotel.rooms.reduce((min, room) => {
        const price = Number(room.base_price);
        return !isNaN(price) && (min === null || price < min) ? price : min;
      }, null as number | null);
    }

    const mainPrice = calculatedMinPrice !== null ? calculatedMinPrice.toLocaleString("en-IN") : 'N/A';
    const mainImageUrl = normalizeImageUrl(selectedHotel.images?.[0]);
    const galleryImages = (selectedHotel.images ?? []).slice(1, 5).map(normalizeImageUrl);

    // Matches structure from Diglipur hero section
    return (
      <div className={`${neutralBgLight} min-h-screen`}>
        {/* Sticky Header for Back Button - Themed */}
        <div className={`bg-white shadow-md py-3 sticky top-0 z-40 border-b ${neutralBorderLight}`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <button onClick={handleBackToList} className={`${buttonSecondaryStyleHero} px-4 py-2 text-sm`}> {/* Using Hero style for visibility */}
              <ChevronLeft size={18} className="mr-1.5" /> Back to Results
            </button>
            {/* Potentially add hotel name or share button here later if needed */}
          </div>
        </div>
        
        {/* Adapted Hero-like section for Hotel Name and Main Image */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
            <Image
                src={mainImageUrl}
                alt={`Main image for ${selectedHotel.name}`}
                fill
                priority
                style={{ objectFit: 'cover' }}
                className={`${neutralBg}`}
                onError={(e) => { e.currentTarget.src = normalizeImageUrl(null); e.currentTarget.onerror = null; }}
                unoptimized={process.env.NODE_ENV === 'development'}
                sizes="100vw"
            />
            {mainImageUrl.includes('placehold.co') && (
              <div className={`absolute inset-0 flex items-center justify-center ${neutralBg}/80 pointer-events-none`}>
                <ImageOff size={64} className={`${neutralIconColor} opacity-50`} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <div className="container mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{selectedHotel.name}</h1>
                    <div className={`flex flex-wrap items-center text-sm md:text-base ${neutralTextLight} text-white/90 gap-x-4 gap-y-1 drop-shadow-sm`}>
                        <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {selectedHotel.address}</span>
                        {/* Add other quick info like star rating if available */}
                    </div>
                </div>
            </div>
        </div>


        <div className={`container mx-auto px-4 ${sectionPadding}`}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-10">
            <div className="lg:col-span-2">
              {/* Gallery moved up, styled similar to Diglipur gallery thumbs */}
              {galleryImages.length > 0 && (
                <div className={`mb-8 p-4 ${neutralBg} rounded-xl border ${neutralBorderLight}`}>
                  <h3 className={`text-lg font-semibold ${neutralText} mb-3`}>Photo Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {galleryImages.map((img, index) => (
                      <div key={index} className={`rounded-lg overflow-hidden shadow-sm aspect-square relative border ${neutralBorder} group cursor-pointer`}>
                        <Image
                          src={img} alt={`${selectedHotel.name} gallery image ${index + 1}`}
                          fill style={{ objectFit: 'cover' }} className={`${neutralBgLight} group-hover:scale-105 transition-transform duration-300`}
                          onError={(e) => { e.currentTarget.src = normalizeImageUrl(null); e.currentTarget.onerror = null; }}
                          unoptimized={process.env.NODE_ENV === 'development'}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                        />
                        {img.includes('placehold.co') && (
                          <div className={`absolute inset-0 flex items-center justify-center ${neutralBgLight}/80 pointer-events-none`}>
                            <ImageOff size={32} className={`${neutralIconColor} opacity-50`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tab Navigation - Themed */}
              <div className={`bg-white p-2 rounded-xl shadow-md mb-8 sticky top-[70px] z-30 border ${neutralBorderLight} overflow-x-auto whitespace-nowrap`}>
                <nav className="flex space-x-1 sm:space-x-2">
                  {['Overview', 'Rooms', 'Amenities', 'Location', 'Policies', 'Reviews'].map(tab => (
                    <a key={tab} href={`#hotel-${tab.toLowerCase()}`} 
                       className={`px-3.5 py-2.5 ${neutralTextLight} font-medium hover:${neutralBg} hover:${neutralText} rounded-lg transition-colors text-sm md:text-base focus:outline-none focus:ring-2 ${focusRingClass}`}>
                      {tab}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Main content sections wrapper with cardBaseStyle */}
              <div className={`${cardBaseStyle} divide-y ${neutralBorderLight}`}> {/* Added divide for consistent section separation */}
                <DetailSection id="hotel-overview" title="Overview" icon={Info}>
                  <p className="whitespace-pre-line">{selectedHotel.description || "Detailed description not available."}</p>
                  {selectedHotel.total_rooms && (
                    <p className="mt-3"><strong>Total Rooms:</strong> {selectedHotel.total_rooms}</p>
                  )}
                </DetailSection>

                <DetailSection id="hotel-rooms" title="Available Rooms" icon={BedDouble}>
                  {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                    <div className="space-y-6"> {/* Removed negative margins, padding handled by cardBaseStyle */}
                      {selectedHotel.rooms.map((room: Room) => {
                        const roomPrice = typeof room.base_price === 'number' ? room.base_price.toLocaleString("en-IN") : 'N/A';
                        const roomMainImage = normalizeImageUrl(room.images?.[0]);
                        return (
                          // Room Card - using elements of cardBaseStyle but nested
                          <div key={room.id} className={`border ${neutralBorder} rounded-xl overflow-hidden md:flex shadow-sm hover:shadow-lg transition-all duration-300 bg-white`}>
                            {room.images && room.images.length > 0 && (
                              <div className={`md:w-2/5 lg:w-1/3 relative h-52 md:h-auto flex-shrink-0 ${neutralBgLight}`}>
                                <Image
                                  src={roomMainImage}
                                  alt={room.room_type_name} layout="fill" objectFit="cover"
                                  className="group-hover:scale-105 transition-transform duration-300" // Added hover effect
                                  onError={(e: any) => { if (e.target.src !== normalizeImageUrl(null)) e.target.src = normalizeImageUrl(null); }}
                                />
                                {roomMainImage.includes('placehold.co') && (
                                  <div className={`absolute inset-0 flex items-center justify-center ${neutralBgLight}/80 pointer-events-none`}>
                                    <ImageOff size={36} className={`${neutralIconColor} opacity-60`} />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="p-4 md:p-5 flex-grow flex flex-col">
                              <h3 className={`text-lg md:text-xl font-semibold ${neutralText} mb-2`}>{room.room_type_name}</h3>
                              <div className={`grid grid-cols-2 gap-x-4 gap-y-2 text-sm ${neutralTextLight} mb-3`}>
                                <div className="flex items-center"><Users className={`h-4 w-4 mr-2 ${neutralIconColor}`} /> {room.capacity_adults} Adults{room.capacity_children ? `, ${room.capacity_children} Ch.` : ""}</div>
                                {typeof room.quantity_available === 'number' && (
                                  <div className="flex items-center"><BedDouble className={`h-4 w-4 mr-2 ${neutralIconColor}`} /> {room.quantity_available} left</div>
                                )}
                              </div>
                              {room.amenities && room.amenities.length > 0 && (
                                <div className="mb-4">
                                  <h4 className={`text-sm font-semibold ${neutralText} mb-1.5`}>Room Amenities:</h4>
                                  <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                                    {room.amenities.slice(0, 4).map(amenity => (
                                      <li key={amenity} className={`flex items-center text-xs md:text-sm ${neutralTextLight}`}>
                                        {getAmenityIcon(amenity, "h-3.5 w-3.5")}
                                        <span className="truncate" title={amenity}>{amenity}</span>
                                      </li>
                                    ))}
                                    {room.amenities.length > 4 && <li className={`text-xs md:text-sm ${neutralTextLight}`}>+ more</li>}
                                  </ul>
                                </div>
                              )}
                              <div className="mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between">
                                <div className="mb-3 sm:mb-0">
                                  <p className={`text-xl md:text-2xl font-bold ${successText}`}><IndianRupee className={`inline h-5 w-5 ${successIconColor}`} />{roomPrice}</p> {/* Price with success color */}
                                  <p className={`text-xs ${neutralTextLight}`}>per night + taxes</p>
                                </div>
                                <button
                                  onClick={() => handleBookRoom(room.id, selectedHotel.name, room.room_type_name)}
                                  className={`${buttonPrimaryStyle} py-2.5 px-5 w-full sm:w-auto text-sm md:text-base`}
                                >
                                  Book Room
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (<p className={`${neutralTextLight}`}>No specific room details available for this hotel at the moment.</p>)}
                </DetailSection>

                {selectedHotel.facilities && selectedHotel.facilities.length > 0 && (
                  <DetailSection id="hotel-amenities" title="Hotel Amenities" icon={ListChecks}>
                    <ul className={`list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2.5`}> {/* Adjusted gap */}
                      {selectedHotel.facilities.map((item, i) =>
                        <li key={i} className={`flex items-center ${neutralTextLight}`}>
                          <div className={`${listIconWrapperStyle} mr-2.5 p-1.5 border-0 ${neutralBgLight}`}> {/* Themed icon wrapper */}
                            {getAmenityIcon(item, "h-4 w-4")}
                          </div>
                          <span>{item}</span>
                        </li>)}
                    </ul>
                  </DetailSection>
                )}

                <DetailSection id="hotel-location" title="Location" icon={MapPin}>
                  <p className={`mb-3 ${neutralTextLight}`}>{selectedHotel.address}</p>
                  {selectedHotel.latitude && selectedHotel.longitude ? (
                    <div className={`h-72 md:h-80 rounded-xl overflow-hidden border ${neutralBorder} shadow-sm`}> {/* Themed border */}
                      <HotelDetailMap
                        latitude={selectedHotel.latitude}
                        longitude={selectedHotel.longitude}
                        name={selectedHotel.name}
                        themeNeutralBorderLight={neutralBorderLight} // Pass theme variable
                      />
                    </div>
                  ) : (
                    <div className={`h-72 md:h-80 ${neutralBgLight} rounded-xl flex flex-col items-center justify-center ${neutralTextLight} border ${neutralBorder} p-6 text-center`}>
                       <MapPin size={40} className={`${neutralIconColor} opacity-50 mb-3`} />
                      Map data not available.
                    </div>
                  )}
                  <p className={`mt-3 text-xs ${neutralTextLight}`}>Exact location may be provided after booking based on hotel policy.</p>
                </DetailSection>

                <DetailSection id="hotel-policies" title="Hotel Policies" icon={ShieldCheck} className="border-b-0 pb-0"> {/* Removed bottom border for last section */}
                  <div className={`space-y-2 ${neutralTextLight}`}> {/* Adjusted spacing */}
                    <p><strong className={neutralText}>Check-in:</strong> {selectedHotel.check_in_time || 'From 2:00 PM (14:00)'}</p>
                    <p><strong className={neutralText}>Check-out:</strong> {selectedHotel.check_out_time || 'Until 12:00 PM (12:00)'}</p>
                    <p><strong className={neutralText}>Cancellation:</strong> {typeof selectedHotel.cancellation_policy === 'string' ? selectedHotel.cancellation_policy : 'Policies vary. Please check during booking.'}</p>
                    <p><strong className={neutralText}>Children:</strong> {selectedHotel.children_allowed ? 'Children are welcome.' : 'Policy not specified.'}</p>
                    <p><strong className={neutralText}>Pets:</strong> {selectedHotel.pets_allowed ? 'Pets may be allowed on request. Charges may apply.' : 'Pets are generally not allowed.'}</p>
                    {selectedHotel.accessibility && (
                      <p><strong className={neutralText}>Accessibility:</strong> {selectedHotel.accessibility}</p>
                    )}
                  </div>
                  {selectedHotel.meal_plans && selectedHotel.meal_plans.length > 0 && (
                    <div className="mt-4">
                      <h4 className={`text-sm font-semibold ${neutralText} mb-1.5`}>Meal Plans:</h4>
                      <ul className={`list-disc list-inside space-y-1 ${neutralTextLight} marker:${neutralIconColor}`}>
                        {selectedHotel.meal_plans.map(plan => <li key={plan}>{plan}</li>)}
                      </ul>
                    </div>
                  )}
                </DetailSection>

                 {/* Guest Reviews Section - Themed as a contextual card (info) */}
                <DetailSection id="hotel-reviews" title="Guest Reviews" icon={MessageSquare}>
                    <div className={`${infoBg} p-5 rounded-xl border ${infoBorder}`}>
                        <div className="flex items-center mb-2">
                            <Info size={20} className={`${infoIconColor} mr-2`} />
                            <h4 className={`text-md font-semibold ${infoText}`}>Review Information</h4>
                        </div>
                        <p className={`${neutralTextLight} text-sm`}>Guest reviews are not yet available for this hotel. Be the first to share your experience!</p>
                        {/* Future: Add a "Write a Review" button here if functionality exists */}
                        {/* <button className={`mt-3 ${buttonSecondaryStyleHero} text-sm py-2 px-4`}>Write a review</button> */}
                    </div>
                </DetailSection>
              </div>
            </div>

            {/* Sticky Price Callout - Themed */}
            <div className="lg:col-span-1 mt-10 lg:mt-0"> {/* Increased top margin for non-lg screens */}
              <div className={`${cardBaseStyle} sticky top-24 shadow-xl p-5 md:p-6`}>
                <h3 className={`text-lg font-semibold ${neutralText} mb-1.5`}>Price Starts From</h3>
                <p className={`text-3xl md:text-4xl font-bold ${successText} mb-1`}> {/* Price with success color */}
                  <IndianRupee className={`inline h-6 w-6 md:h-7 md:w-7 mr-0.5 ${successIconColor}`} />
                  {mainPrice}
                </p>
                <p className={`text-xs ${neutralTextLight} mb-5`}>
                  per night (approx, excl. taxes & fees)
                </p>
                <button
                  type="button"
                  className={`${buttonPrimaryStyle} w-full text-base py-3`}
                  onClick={() => document.getElementById('hotel-rooms')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Eye size={20} className="mr-2" /> View Available Rooms
                </button>
                <p className={`text-xs ${neutralTextLight} mt-3 text-center`}>Check room options for best deals!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Page View (List of Hotels) ---
  return (
    <div className={`container mx-auto px-4 ${sectionPadding}`}> {/* Uses sectionPadding */}
      {/* Page Header - Themed */}
      <div className="text-center mb-10 md:mb-12">
        <h1 className={`text-3xl md:text-5xl font-bold ${neutralText} mb-3`}>Explore Our Hotels</h1>
        <p className={`mt-2 text-base md:text-lg ${neutralTextLight} max-w-2xl mx-auto`}>
          Find the perfect stay for your next adventure from our curated selection of hotels.
        </p>
      </div>

      {/* Filter Section - Themed with cardBaseStyle */}
      <div className={`${cardBaseStyle} mb-10 md:mb-12 p-5 md:p-6`}> {/* Uses cardBaseStyle */}
        <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl mb-5 justify-center sm:justify-start`}>
          <FilterIcon size={22} className={`mr-3 ${neutralIconColor}`} />
          Filter Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-end">
          <div className="relative">
            <label htmlFor="searchTerm" className={labelBaseStyle}>Search by Hotel Name</label>
            <div className="relative mt-1">
              <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={20} />
              <input type="text" id="searchTerm" placeholder="e.g., Sunset Paradise" className={`${inputBaseStyle} pl-12`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="locationFilter" className={labelBaseStyle}>Filter by Location</label>
            <div className="relative mt-1">
              <MapPin className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={20} />
              <input type="text" id="locationFilter" placeholder="e.g., Port Blair" className={`${inputBaseStyle} pl-12`} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

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
                // Hotel Card - Applying cardBaseStyle and thematic structure
                <div key={hotel.id} className={`${cardBaseStyle} flex flex-col group cursor-pointer p-0 overflow-hidden`} onClick={() => handleSelectHotel(hotel.id)}> {/* cardBaseStyle modified for no internal padding */}
                  <div className={`h-56 sm:h-60 w-full relative rounded-t-2xl overflow-hidden flex-shrink-0 ${neutralBgLight}`}> {/* neutralBgLight for placeholder */}
                    <Image
                      src={hotelMainImage}
                      alt={hotel.name} layout="fill" objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      onError={(e: any) => { if (e.target.src !== normalizeImageUrl(null)) e.target.src = normalizeImageUrl(null); }}
                      priority={index < 3} // Prioritize loading images for first few cards
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {hotelMainImage.includes('placehold.co') && (
                      <div className={`absolute inset-0 flex items-center justify-center ${neutralBgLight}/80 pointer-events-none`}>
                        <ImageOff size={40} className={`${neutralIconColor} opacity-60`} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-grow"> {/* Padding applied here */}
                    <h2 className={`text-lg md:text-xl font-semibold mb-1.5 ${neutralText} line-clamp-2 group-hover:${infoText}`}>{hotel.name}</h2> {/* infoText on hover */}
                    <div className={`flex items-center text-xs md:text-sm ${neutralTextLight} mb-2`}>
                      <MapPin className={`h-4 w-4 mr-1.5 ${neutralIconColor}`} /> <span className="truncate">{hotel.address}</span>
                    </div>
                    {hotel.description && <p className={`text-sm ${neutralTextLight} mt-1 mb-3 line-clamp-3`}>{hotel.description}</p>}

                    {cardPrice ? (
                      <div className={`text-xl font-semibold ${successText} mb-4`}> {/* successText for price */}
                        <IndianRupee className={`inline h-5 w-5 mr-0.5 ${successIconColor}`} />
                        {cardPrice} <span className={`text-xs ${neutralTextLight} font-normal`}>/ night (from)</span>
                      </div>
                    ) : (<p className={`text-sm ${neutralTextLight} mb-4 italic`}>Check availability for prices</p>)}

                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectHotel(hotel.id); }}
                      className={`${buttonPrimaryStyle} w-full text-sm py-2.5 mt-auto`} // Already uses buttonPrimaryStyle
                    >
                      View Details <ChevronRight className="ml-1.5 h-4 w-4" />
                    </button>
                  </div>
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
  );
};

export default HotelsPage;
