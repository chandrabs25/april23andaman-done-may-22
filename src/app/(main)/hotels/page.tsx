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
  primaryButtonBg,
  // primaryButtonHoverBg, // Assuming this might be part of buttonPrimaryStyle or handled by hover: in it
  // primaryButtonText, // Assuming this is part of buttonPrimaryStyle
  // secondaryButtonBg, // Assuming this is part of buttonSecondaryStyle
  // secondaryButtonHoverBg, // Assuming this is part of buttonSecondaryStyle
  // secondaryButtonText, // Assuming this is part of buttonSecondaryStyle
  // secondaryButtonBorder, // Assuming this is part of buttonSecondaryStyle
  // infoBg, // Will be used if needed for specific alert/info boxes
  // infoBorder,
  // infoText,
  // infoIconColor,
  // successBg,
  // successBorder,
  // successText,
  // successIconColor,
  // warningBg,
  // warningBorder,
  // warningText,
  // warningIconColor,
  // tipBg,
  // tipBorder,
  // tipText,
  // tipIconColor,
  errorBg,
  errorBorder,
  errorText,
  errorIconColor,
  neutralBgLight,
  neutralBorderLight,
  neutralBg, // Used for placeholders if needed
  neutralBorder,
  neutralText,
  neutralTextLight,
  neutralIconColor,
  sectionPadding,
  cardBaseStyle,
  sectionHeadingStyle, // This should be a string of Tailwind classes
  buttonPrimaryStyle,   // This should be a string of Tailwind classes
  buttonSecondaryStyle, // This should be a string of Tailwind classes
} from "@/styles/theme";
// --- End Common Styles Import ---


const HotelDetailMap = dynamic(() => import('@/components/HotelDetailMap'), {
  ssr: false,
  loading: () => <div className={`h-80 md:h-96 w-full rounded-lg ${neutralBgLight} flex items-center justify-center border ${neutralBorderLight}`}><Loader2 className={`h-8 w-8 animate-spin ${neutralIconColor}`} /></div>,
});

const ITEMS_PER_PAGE = 9;

// --- Helper Components ---
const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight}`}>
    <Loader2 className={`h-12 w-12 animate-spin ${neutralIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${neutralText}`}>{message}</p>
    <p className={`${neutralTextLight}`}>Please wait a moment.</p>
  </div>
);

const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${errorBg} rounded-2xl border ${errorBorder}`}>
    <AlertTriangle className={`h-12 w-12 ${errorIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${errorText}`}>Could Not Load Data</p>
    <p className={`${neutralTextLight}`}>{message || "An unexpected error occurred. Please try again."}</p>
    {onRetry && (
      // Assuming buttonSecondaryStyle includes base button styling.
      // Additional specific error button styling can be added here or in the theme file.
      <button onClick={onRetry} className={`mt-6 ${buttonSecondaryStyle} border-red-400 text-red-600 hover:bg-red-100 focus:ring-red-300`}>
        Try Again
      </button>
    )}
  </div>
);

const NoDataState = ({ itemType, message }: { itemType: string; message?: string }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight}`}>
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
}
const DetailSection: React.FC<DetailSectionProps> = ({ id, title, icon: Icon, children, className }) => (
  <div id={id} className={`py-5 border-b ${neutralBorderLight} last:border-b-0 ${className || ""}`}>
    <h2 className={sectionHeadingStyle}> {/* Using imported sectionHeadingStyle */}
      {Icon && <Icon size={20} className={`mr-2.5 ${neutralIconColor}`} />}
      {title}
    </h2>
    <div className={`text-sm ${neutralTextLight} leading-relaxed space-y-2`}>
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
  const focusRingColorName = primaryButtonBg?.split('-')[1] || 'gray'; // Default to gray
  const focusRingColorShade = primaryButtonBg?.split('-')[2] || '500'; // Default to 500
  const focusRingClass = `focus:ring-${focusRingColorName}-${focusRingColorShade}`;
  const focusBorderClass = `focus:border-${focusRingColorName}-${focusRingColorShade}`;


  const inputBaseStyle = `w-full p-2.5 text-sm ${neutralText} bg-white border ${neutralBorder} rounded-md focus:outline-none focus:ring-2 ${focusRingClass} ${focusBorderClass} transition-shadow`;
  const labelBaseStyle = `block text-xs font-medium ${neutralTextLight} mb-1.5`;


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

    // Calculate the actual minimum room price for the selected hotel
    let calculatedMinPrice: number | null = null;
    if (selectedHotel.rooms && selectedHotel.rooms.length > 0) {
      calculatedMinPrice = selectedHotel.rooms.reduce((min, room) => {
        const price = Number(room.base_price);
        if (!isNaN(price) && (min === null || price < min)) {
          return price;
        }
        return min;
      }, null as number | null);
    }

    const mainPrice = calculatedMinPrice !== null
      ? calculatedMinPrice.toLocaleString("en-IN")
      : 'N/A';

    const mainImageUrl = normalizeImageUrl(selectedHotel.images?.[0]);
    const galleryImages = (selectedHotel.images ?? []).slice(1, 5).map(normalizeImageUrl);

    return (
      <div className={`${neutralBgLight} min-h-screen`}>
        <div className={`bg-white shadow-sm py-3 sticky top-0 z-40 border-b ${neutralBorderLight}`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <button onClick={handleBackToList} className={buttonSecondaryStyle}>
              <ChevronLeft size={18} className="mr-1.5" /> Back to Results
            </button>
          </div>
        </div>

        <div className={`container mx-auto px-4 ${sectionPadding}`}>
          <div className="mb-6 md:mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold ${neutralText} mb-2`}>{selectedHotel.name}</h1>
            <div className={`flex flex-wrap items-center text-sm ${neutralTextLight} gap-x-4 gap-y-1.5`}>
              <span className="flex items-center"><MapPin size={15} className={`mr-1.5 ${neutralIconColor}`} /> {selectedHotel.address}</span>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <div className={`mb-6 rounded-2xl overflow-hidden shadow-lg relative aspect-[16/10] border ${neutralBorderLight}`}>
                <Image
                  src={mainImageUrl}
                  alt={`Main image for ${selectedHotel.name}`}
                  fill style={{ objectFit: 'cover' }}
                  className="bg-gray-100" // Use neutralBg or similar if defined for placeholders
                  onError={(e) => { e.currentTarget.src = normalizeImageUrl(null); e.currentTarget.onerror = null; }}
                  priority unoptimized={process.env.NODE_ENV === 'development'}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {mainImageUrl.includes('placehold.co') && (
                  <div className={`absolute inset-0 flex items-center justify-center ${neutralBg || 'bg-gray-100'}/50 pointer-events-none`}>
                    <ImageOff size={48} className={`${neutralIconColor} opacity-50`} />
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                  {galleryImages.map((img, index) => (
                    <div key={index} className={`rounded-xl overflow-hidden shadow-md aspect-square relative border ${neutralBorderLight}`}>
                      <Image
                        src={img} alt={`${selectedHotel.name} gallery image ${index + 1}`}
                        fill style={{ objectFit: 'cover' }} className="bg-gray-100" // Use neutralBg or similar
                        onError={(e) => { e.currentTarget.src = normalizeImageUrl(null); e.currentTarget.onerror = null; }}
                        unoptimized={process.env.NODE_ENV === 'development'}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        loading="lazy"
                      />
                      {img.includes('placehold.co') && (
                        <div className={`absolute inset-0 flex items-center justify-center ${neutralBg || 'bg-gray-100'}/50 pointer-events-none`}>
                          <ImageOff size={32} className={`${neutralIconColor} opacity-50`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className={`bg-white p-2 rounded-lg shadow-md mb-6 sticky top-[70px] z-30 border ${neutralBorderLight} overflow-x-auto whitespace-nowrap`}>
                <nav className="flex space-x-1 sm:space-x-2">
                  {['Overview', 'Rooms', 'Amenities', 'Location', 'Policies', 'Reviews'].map(tab => (
                    <a key={tab} href={`#hotel-${tab.toLowerCase()}`} className={`px-3 py-2 ${neutralTextLight} font-medium hover:bg-gray-100 hover:text-${focusRingColorName}-${focusRingColorShade} rounded-md transition-colors text-sm`}>
                      {tab}
                    </a>
                  ))}
                </nav>
              </div>

              <div className={cardBaseStyle}>
                <DetailSection id="hotel-overview" title="Overview" icon={Info}>
                  <p className="whitespace-pre-line">{selectedHotel.description || "Detailed description not available."}</p>
                  {selectedHotel.total_rooms && (
                    <p className="mt-3"><strong>Total Rooms:</strong> {selectedHotel.total_rooms}</p>
                  )}
                </DetailSection>

                <DetailSection id="hotel-rooms" title="Available Rooms" icon={BedDouble}>
                  {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                    <div className="space-y-6 -mx-5 md:-mx-6 px-5 md:px-6">
                      {selectedHotel.rooms.map((room: Room) => {
                        const roomPrice = typeof room.base_price === 'number' ? room.base_price.toLocaleString("en-IN") : 'N/A';
                        const roomMainImage = normalizeImageUrl(room.images?.[0]);
                        return (
                          <div key={room.id} className={`border ${neutralBorder} rounded-lg overflow-hidden md:flex hover:shadow-md transition-shadow`}>
                            {room.images && room.images.length > 0 && (
                              <div className={`md:w-1/3 lg:w-1/4 relative h-48 md:h-auto flex-shrink-0 ${neutralBg || 'bg-gray-100'}`}>
                                <Image
                                  src={roomMainImage}
                                  alt={room.room_type_name} layout="fill" objectFit="cover"
                                  onError={(e: any) => { if (e.target.src !== normalizeImageUrl(null)) e.target.src = normalizeImageUrl(null); }}
                                />
                                {roomMainImage.includes('placehold.co') && (
                                  <div className={`absolute inset-0 flex items-center justify-center ${neutralBg || 'bg-gray-100'}/80 pointer-events-none`}>
                                    <ImageOff size={32} className={`${neutralIconColor} opacity-60`} />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="p-4 md:p-5 flex-grow flex flex-col">
                              <h3 className={`text-lg font-semibold ${neutralText} mb-1.5`}>{room.room_type_name}</h3>
                              <div className={`grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs ${neutralTextLight} mb-3`}>
                                <div className="flex items-center"><Users className={`h-3.5 w-3.5 mr-1.5 ${neutralIconColor}`} /> {room.capacity_adults} Adults{room.capacity_children ? `, ${room.capacity_children} Ch.` : ""}</div>
                                {typeof room.quantity_available === 'number' && (
                                  <div className="flex items-center"><BedDouble className={`h-3.5 w-3.5 mr-1.5 ${neutralIconColor}`} /> {room.quantity_available} left</div>
                                )}
                              </div>
                              {room.amenities && room.amenities.length > 0 && (
                                <div className="mb-3">
                                  <h4 className={`text-xs font-semibold ${neutralText} mb-1`}>Room Amenities:</h4>
                                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                                    {room.amenities.slice(0, 4).map(amenity => (
                                      <li key={amenity} className={`flex items-center text-xs ${neutralTextLight}`}>
                                        {getAmenityIcon(amenity, "h-3 w-3")}
                                        <span className="truncate" title={amenity}>{amenity}</span>
                                      </li>
                                    ))}
                                    {room.amenities.length > 4 && <li className={`text-xs ${neutralTextLight}`}>+ more</li>}
                                  </ul>
                                </div>
                              )}
                              <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-3 sm:mb-0">
                                  <p className={`text-xl font-bold ${neutralText}`}><IndianRupee className="inline h-4.5 w-4.5" />{roomPrice}</p>
                                  <p className={`text-xs ${neutralTextLight}`}>per night + taxes</p>
                                </div>
                                <button
                                  onClick={() => handleBookRoom(room.id, selectedHotel.name, room.room_type_name)}
                                  className={`${buttonPrimaryStyle} py-2 px-4 w-full sm:w-auto`}
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
                    <ul className={`list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2`}>
                      {selectedHotel.facilities.map((item, i) =>
                        <li key={i} className={`flex items-center ${neutralTextLight}`}>
                          {getAmenityIcon(item, "h-4 w-4")}
                          <span>{item}</span>
                        </li>)}
                    </ul>
                  </DetailSection>
                )}

                <DetailSection id="hotel-location" title="Location" icon={MapPin}>
                  <p className={`mb-3 ${neutralTextLight}`}>{selectedHotel.address}</p>
                  {selectedHotel.latitude && selectedHotel.longitude ? (
                    <div className={`h-64 md:h-80 rounded-lg overflow-hidden border ${neutralBorderLight} shadow-sm`}>
                      <HotelDetailMap
                        latitude={selectedHotel.latitude}
                        longitude={selectedHotel.longitude}
                        name={selectedHotel.name}
                        themeNeutralBorderLight={neutralBorderLight}
                      />
                    </div>
                  ) : (
                    <div className={`h-64 ${neutralBgLight} rounded-lg flex items-center justify-center ${neutralTextLight} border ${neutralBorderLight}`}>
                      Map data not available.
                    </div>
                  )}
                  <p className={`mt-2 text-xs ${neutralTextLight}`}>Exact location may be provided after booking based on hotel policy.</p>
                </DetailSection>

                <DetailSection id="hotel-policies" title="Hotel Policies" icon={ShieldCheck} className="border-b-0 pb-0">
                  <div className={`space-y-1.5 ${neutralTextLight}`}>
                    <p><strong>Check-in:</strong> {selectedHotel.check_in_time || 'From 2:00 PM (14:00)'}</p>
                    <p><strong>Check-out:</strong> {selectedHotel.check_out_time || 'Until 12:00 PM (12:00)'}</p>
                    <p><strong>Cancellation:</strong> {typeof selectedHotel.cancellation_policy === 'string' ? selectedHotel.cancellation_policy : 'Policies vary. Please check during booking.'}</p>
                    <p><strong>Children:</strong> {selectedHotel.children_allowed ? 'Children are welcome.' : 'Policy not specified.'}</p>
                    <p><strong>Pets:</strong> {selectedHotel.pets_allowed ? 'Pets may be allowed on request. Charges may apply.' : 'Pets are generally not allowed.'}</p>
                    {selectedHotel.accessibility && (
                      <p><strong>Accessibility:</strong> {selectedHotel.accessibility}</p>
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

                <DetailSection id="hotel-reviews" title="Guest Reviews" icon={MessageSquare}>
                  <p className={`${neutralTextLight}`}>Guest reviews are not yet available for this hotel. Be the first to review!</p>
                </DetailSection>

              </div>
            </div>

            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className={`${cardBaseStyle} sticky top-24 shadow-xl`}>
                <h3 className={`text-lg font-semibold ${neutralText} mb-1`}>Price Starts From</h3>
                <p className={`text-3xl font-bold ${neutralText} mb-0.5`}>
                  <IndianRupee className="inline h-6 w-6 mr-0.5" />
                  {mainPrice}
                </p>
                <p className={`text-xs ${neutralTextLight} mb-4`}>
                  per night (approx, excl. taxes & fees)
                </p>

                <button
                  type="button"
                  className={`${buttonPrimaryStyle} w-full text-base py-3`}
                  onClick={() => document.getElementById('hotel-rooms')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Eye size={18} className="mr-2" /> View Available Rooms
                </button>
                <p className={`text-xs ${neutralTextLight} mt-2.5 text-center`}>Check room options for best deals!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Page View (List of Hotels) ---
  return (
    <div className={`container mx-auto px-4 ${sectionPadding}`}>
      <div className="text-center mb-8 md:mb-10">
        <h1 className={`text-3xl md:text-4xl font-bold ${neutralText}`}>Explore Our Hotels</h1>
        <p className={`mt-2 text-base md:text-lg ${neutralTextLight} max-w-2xl mx-auto`}>
          Find the perfect stay for your next adventure from our curated selection of hotels.
        </p>
      </div>

      <div className={`${cardBaseStyle} mb-8 md:mb-10 p-4 sm:p-6`}>
        <h2 className={`${sectionHeadingStyle} text-xl mb-4 justify-center sm:justify-start`}>
          <FilterIcon size={20} className={`mr-2.5 ${neutralIconColor}`} />
          Filter Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="relative">
            <label htmlFor="searchTerm" className={labelBaseStyle}>Search by Name</label>
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 mt-3 sm:mt-2.5 ${neutralIconColor} pointer-events-none`} size={18} />
            <input type="text" id="searchTerm" placeholder="e.g., Sunset Paradise" className={`${inputBaseStyle} pl-10`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative">
            <label htmlFor="locationFilter" className={labelBaseStyle}>Filter by Location</label>
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 mt-3 sm:mt-2.5 ${neutralIconColor} pointer-events-none`} size={18} />
            <input type="text" id="locationFilter" placeholder="e.g., Port Blair" className={`${inputBaseStyle} pl-10`} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelsList.map((hotel, index) => {
              const cardPrice = hotel.rooms && hotel.rooms.length > 0 && typeof hotel.rooms[0].base_price === 'number'
                ? hotel.rooms[0].base_price.toLocaleString("en-IN")
                : null;
              const hotelMainImage = normalizeImageUrl(hotel.images?.[0]);

              return (
                <div key={hotel.id} className={`${cardBaseStyle} flex flex-col group cursor-pointer hover:shadow-xl transition-shadow duration-300`} onClick={() => handleSelectHotel(hotel.id)}>
                  <div className="h-48 sm:h-56 w-full relative rounded-lg overflow-hidden mb-4 flex-shrink-0">
                    <Image
                      src={hotelMainImage}
                      alt={hotel.name} layout="fill" objectFit="cover"
                      className={`transition-transform duration-300 group-hover:scale-105 ${neutralBg || 'bg-gray-100'}`}
                      onError={(e: any) => { if (e.target.src !== normalizeImageUrl(null)) e.target.src = normalizeImageUrl(null); }}
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {hotelMainImage.includes('placehold.co') && (
                      <div className={`absolute inset-0 flex items-center justify-center ${neutralBg || 'bg-gray-100'}/80 pointer-events-none`}>
                        <ImageOff size={32} className={`${neutralIconColor} opacity-60`} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h2 className={`text-lg font-semibold mb-1 ${neutralText} line-clamp-2 group-hover:text-${focusRingColorName}-${focusRingColorShade}`}>{hotel.name}</h2>
                    <div className={`flex items-center text-xs ${neutralTextLight} mb-1.5`}>
                      <MapPin className={`h-3.5 w-3.5 mr-1 ${neutralIconColor}`} /> <span className="truncate">{hotel.address}</span>
                    </div>
                    {hotel.description && <p className={`text-xs ${neutralTextLight} mt-1 mb-3 line-clamp-2`}>{hotel.description}</p>}

                    {cardPrice ? (
                      <div className={`text-lg font-semibold text-green-600 mb-3`}>
                        <IndianRupee className={`inline h-4.5 w-4.5 mr-0.5 text-green-500`} />
                        {cardPrice} <span className={`text-xs ${neutralTextLight} font-normal`}>/ night (from)</span>
                      </div>
                    ) : (<p className={`text-xs ${neutralTextLight} mb-3`}>Check availability for prices</p>)}

                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectHotel(hotel.id); }}
                      className={`${buttonPrimaryStyle} w-full text-sm py-2.5 mt-auto`}
                    >
                      View Details <ChevronRight className="ml-1.5 h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 md:mt-12 flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoadingHotels}
                className={`${buttonSecondaryStyle} px-3 py-2 sm:px-4 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </button>
              <span className={`px-3 py-2 text-sm ${neutralTextLight}`}>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoadingHotels || hotelsList.length < ITEMS_PER_PAGE}
                className={`${buttonSecondaryStyle} px-3 py-2 sm:px-4 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <span className="hidden sm:inline mr-1">Next</span>
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
