"use client";

import React, { useState } from "react";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useParams, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { useFetch } from "@/hooks/useFetch";
import type { Hotel, Room } from "@/types/hotel";
import {
  Loader2, AlertTriangle, MapPin, ChevronLeft, Users, IndianRupee, ListChecks, BedDouble, Wifi, ParkingCircle, Utensils, Briefcase, Building, Award, CheckCircle, Info, ImageOff, Eye, ShieldCheck
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
} from "@/styles/26themeandstyle";
// --- End Common Styles Import ---

const HotelDetailMap = dynamic(() => import('@/components/HotelDetailMap'), {
  ssr: false,
  loading: () => <div className={`h-80 md:h-96 w-full rounded-lg ${neutralBgLight} flex items-center justify-center border ${neutralBorderLight}`}><Loader2 className={`h-8 w-8 animate-spin ${neutralIconColor}`} /></div>,
});

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

interface DetailSectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  id?: string;
  titleClassName?: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({ id, title, icon: Icon, children, className, titleClassName }) => (
  <div id={id} className={`py-6 md:py-8 border-b ${neutralBorderLight} last:border-b-0 ${className || ""}`}>
    <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl ${titleClassName || ''}`}>
      {Icon && <Icon size={22} className={`mr-3 ${neutralIconColor}`} />}
      {title}
    </h2>
    <div className={`text-sm md:text-base ${neutralTextLight} leading-relaxed space-y-3 mt-3 md:mt-4`}>
      {children}
    </div>
  </div>
);
// --- End Helper Components ---

const HotelDetailPage = () => {
  const params = useParams();
  const hotelId = Array.isArray(params.id) ? params.id[0] : params.id;
  const searchParams = useSearchParams(); // Added
  const isAdminPreview = searchParams.get('isAdminPreview') === 'true'; // Added
  const [retryToken, setRetryToken] = useState(0);

  // Construct focus ring classes based on the primaryButtonBg variable
  const focusRingColorName = primaryButtonBg?.split('-')[1] || 'gray'; 
  const focusRingColorShade = primaryButtonBg?.split('-')[2] || '500'; 
  const focusRingClass = `focus:ring-${focusRingColorName}-${focusRingColorShade}`;

  const apiUrl = isAdminPreview
    ? `/api/admin/hotel_preview/${hotelId}?_retry=${retryToken}`
    : `/api/hotels/${hotelId}?_retry=${retryToken}`;

  const {
    data: rawHotelData, // Renamed to rawHotelData
    error: selectedHotelError,
    status: selectedHotelStatus,
  } = useFetch<any>(apiUrl); // Use <any> for now, will type check 'data' property later

  const isLoadingSelectedHotel = selectedHotelStatus === 'loading';

  const selectedHotel: Hotel | undefined = isAdminPreview
    ? (rawHotelData?.success ? rawHotelData.data : undefined)
    : (rawHotelData && 'id' in rawHotelData ? rawHotelData : undefined);

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

  if (isLoadingSelectedHotel) return <LoadingState message="Loading Hotel Details..." />;

  // Updated Error Handling
  if (selectedHotelError || (isAdminPreview && !rawHotelData?.success) || (!isAdminPreview && !selectedHotel && rawHotelData)) {
    // If it's admin preview and success is false, or if it's not admin and selectedHotel is not derived (but rawHotelData might exist with error)
    // This also covers cases where rawHotelData itself might be an error object from useFetch if the request failed fundamentally.
    const message = selectedHotelError?.message ||
                    (isAdminPreview && rawHotelData?.message) ||
                    (!isAdminPreview && rawHotelData && !rawHotelData.id ? "Hotel data is not in expected format." : "Hotel details could not be found.");
    return <ErrorState message={message} onRetry={() => setRetryToken(c => c + 1)} />;
  }
  // Final check if selectedHotel is truly undefined after all logic.
  if (!selectedHotel) return <ErrorState message={"Hotel details could not be loaded or processed."} onRetry={() => setRetryToken(c => c + 1)} />;

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

  return (
    <div className={`${neutralBgLight} min-h-screen`}>
      {isAdminPreview && (
        <div className="container mx-auto px-4 py-3 my-4 text-center bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow">
          <p className="font-semibold text-base">ADMIN PREVIEW MODE</p>
          <p className="text-sm">You are viewing this page as an administrator. Approval statuses are shown below.</p>
        </div>
      )}
      {/* Sticky Header for Back Button - Themed */}
      <div className={`bg-white shadow-md py-3 sticky top-0 z-40 border-b ${neutralBorderLight}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/hotels" className={`${buttonSecondaryStyleHero} px-4 py-2 text-sm`}>
            <ChevronLeft size={18} className="mr-1.5" /> Back to Hotels
          </Link>
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
                  <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                    {selectedHotel.name}
                    {isAdminPreview && typeof selectedHotel.is_admin_approved === 'number' && (
                      <span className={`ml-3 text-base align-middle font-medium px-3 py-1 rounded-full ${selectedHotel.is_admin_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Status: {selectedHotel.is_admin_approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    )}
                  </h1>
                  <div className={`flex flex-wrap items-center text-sm md:text-base ${neutralTextLight} text-white/90 gap-x-4 gap-y-1 drop-shadow-sm`}>
                      <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {selectedHotel.address}</span>
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
            <div className={`${cardBaseStyle} divide-y ${neutralBorderLight}`}>
              <DetailSection id="hotel-overview" title="Overview" icon={Info}>
                <p className="whitespace-pre-line">{selectedHotel.description || "Detailed description not available."}</p>
                {selectedHotel.total_rooms && (
                  <p className="mt-3"><strong>Total Rooms:</strong> {selectedHotel.total_rooms}</p>
                )}
              </DetailSection>

              <DetailSection id="hotel-rooms" title="Available Rooms" icon={BedDouble}>
                {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                  <div className="space-y-6">
                    {selectedHotel.rooms.map((room: Room) => {
                      const roomPrice = typeof room.base_price === 'number' ? room.base_price.toLocaleString("en-IN") : 'N/A';
                      const roomMainImage = normalizeImageUrl(room.images?.[0]);
                      return (
                        <div key={room.id} className={`border ${neutralBorder} rounded-xl overflow-hidden md:flex shadow-sm hover:shadow-lg transition-all duration-300 bg-white`}>
                          {room.images && room.images.length > 0 && (
                            <div className={`md:w-2/5 lg:w-1/3 relative h-52 md:h-auto flex-shrink-0 ${neutralBgLight}`}>
                              <Image
                                src={roomMainImage}
                                alt={room.room_type_name} layout="fill" objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-300"
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
                            <h3 className={`text-lg md:text-xl font-semibold ${neutralText} mb-2`}>
                              {room.room_type_name}
                              {isAdminPreview && typeof room.is_admin_approved === 'number' && (
                                <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${room.is_admin_approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {room.is_admin_approved ? 'Approved' : 'Pending'}
                                </span>
                              )}
                            </h3>
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
                                <p className={`text-xl md:text-2xl font-bold ${successText}`}><IndianRupee className={`inline h-5 w-5 ${successIconColor}`} />{roomPrice}</p>
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
                  <ul className={`list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2.5`}>
                    {selectedHotel.facilities.map((item, i) =>
                      <li key={i} className={`flex items-center ${neutralTextLight}`}>
                        <div className={`${listIconWrapperStyle} mr-2.5 p-1.5 border-0 ${neutralBgLight}`}>
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
                  <div className={`h-72 md:h-80 rounded-xl overflow-hidden border ${neutralBorder} shadow-sm`}>
                    <HotelDetailMap
                      latitude={selectedHotel.latitude}
                      longitude={selectedHotel.longitude}
                      name={selectedHotel.name}
                      themeNeutralBorderLight={neutralBorderLight}
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

              <DetailSection id="hotel-policies" title="Hotel Policies" icon={ShieldCheck} className="border-b-0 pb-0">
                <div className={`space-y-2 ${neutralTextLight}`}>
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
              <DetailSection id="hotel-reviews" title="Guest Reviews" icon={Info}>
                  <div className={`${infoBg} p-5 rounded-xl border ${infoBorder}`}>
                      <div className="flex items-center mb-2">
                          <Info size={20} className={`${infoIconColor} mr-2`} />
                          <h4 className={`text-md font-semibold ${infoText}`}>Review Information</h4>
                      </div>
                      <p className={`${neutralTextLight} text-sm`}>Guest reviews are not yet available for this hotel. Be the first to share your experience!</p>
                  </div>
              </DetailSection>
            </div>
          </div>

          {/* Sticky Price Callout - Themed */}
          <div className="lg:col-span-1 mt-10 lg:mt-0">
            <div className={`${cardBaseStyle} sticky top-24 shadow-xl p-5 md:p-6`}>
              <h3 className={`text-lg font-semibold ${neutralText} mb-1.5`}>Price Starts From</h3>
              <p className={`text-3xl md:text-4xl font-bold ${successText} mb-1`}>
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
};

export default HotelDetailPage; 