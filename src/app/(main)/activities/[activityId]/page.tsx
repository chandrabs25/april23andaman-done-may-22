"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation"; // Added useSearchParams
import Link from "next/link";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
// Assuming Activity type might be different or more specific than ActivityService
// import type { Activity } from "@/types/activity"; 
import type { ActivityService, SingleServiceResponse } from "@/types/transport_rental";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Star,
  IndianRupee,
  Users,
  CalendarDays,
  ShieldCheck,
  Info,
  Sparkles, // Specific to activities
  CheckCircle,
  XCircle,
  ChevronLeft,
  Navigation, // Specific to activities
  Sun, // Specific to activities
  // Wind, // Not used, but keep for lucide-react imports
  // Waves, // Not used, but keep for lucide-react imports
  BarChart3, // For difficulty
  UserPlus, // For guide
  HardHat, // For safety
  LifeBuoy, // For equipment
  Building, // For Provider (added for consistency)
  ImageOff // For image error placeholder
} from "lucide-react";

// --- Import Common Styles (from the shared theme.ts file) ---
import {
  primaryButtonBg, // For focus rings on inputs etc.
  errorBg,
  errorBorder,
  errorText,
  errorIconColor,
  neutralBgLight,
  neutralBorderLight,
  // neutralBg, // For image placeholders etc.
  neutralBorder,
  neutralText,
  neutralTextLight,
  neutralIconColor,
  sectionPadding,
  cardBaseStyle,
  sectionHeadingStyle, // Replaces local DetailSection title style
  buttonPrimaryStyle,
  buttonSecondaryStyle,
} from "@/styles/theme";
// --- End Common Styles Import ---

// Extended interface to handle additional fields that might be in serviceData
interface ExtendedActivityService extends ActivityService {
  location_details?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  what_to_bring?: string[] | null;
  included_services?: string[] | null;
  not_included_services?: string[] | null;
  // Ensure all fields from ActivityService are here if not using Omit/Pick
  guide_required?: boolean;
  equipment_provided?: string[];
  safety_requirements?: string;
}


// --- Helper Components (Styled with Imported Theme) ---
const LoadingSpinner = ({ message = "Loading activity details..." }: { message?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight} ${sectionPadding}`}>
    <Image
      src="/images/loading.gif"
      alt="Loading..."
      width={128}
      height={128}
      priority
      className="mb-4"
    />
    <span className={`text-lg ${neutralText} font-semibold text-center`}>{message}</span>
    <p className={`${neutralTextLight} mt-1 text-center`}>Please wait a moment.</p>
  </div>
);

const ErrorState = ({ message }: { message?: string }) => (
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${errorBg} rounded-2xl border ${errorBorder}`}>
    <AlertTriangle className={`h-12 w-12 ${errorIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${errorText}`}>Could Not Load Activity</p>
    <p className={`${neutralTextLight}`}>{message || "The activity details could not be retrieved. It might be unavailable or the link may be incorrect."}</p>
    <Link href="/activities" className={`mt-6 ${buttonSecondaryStyle}`}>
      <ChevronLeft size={18} className="mr-2" /> Back to Activities
    </Link>
  </div>
);

interface DetailSectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, className }) => (
  <div className={`py-5 border-b ${neutralBorderLight} last:border-b-0 ${className || ""}`}>
    <h2 className={sectionHeadingStyle}> {/* Using imported sectionHeadingStyle */}
      {Icon && <Icon size={20} className={`mr-2.5 ${neutralIconColor}`} />} {/* Icon color to neutral */}
      {title}
    </h2>
    {/* Removed prose for more direct control with Tailwind text colors */}
    <div className={`text-sm ${neutralTextLight} leading-relaxed space-y-2`}>
      {children}
    </div>
  </div>
);
// --- End Helper Components ---

const ActivityDetailsPage = () => {
  const params = useParams();
  const activityId = params.activityId as string;
  const searchParams = useSearchParams(); // Added
  const isAdminPreview = searchParams.get('isAdminPreview') === 'true'; // Added
  
  // Add state for image loading
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryImageErrors, setGalleryImageErrors] = useState<Record<number, boolean>>({});

  console.log("🔍 ActivityDetailPage: Loading activity with ID:", activityId);

  const apiUrl = isAdminPreview
    ? `/api/admin/service_preview/${activityId}`
    : `/api/services-main/${activityId}`;
  const { data: apiResponse, error, status } = useFetch<SingleServiceResponse>(activityId ? apiUrl : null);

  const isLoading = status === "loading";
  const fetchError = status === "error" ? error : null;

  console.log("🔍 ActivityDetailPage: API Response:", JSON.stringify(apiResponse));

  let serviceData: any = null;
  if (apiResponse) {
    if ('data' in apiResponse && apiResponse.data) serviceData = apiResponse.data;
    else if (('name' in apiResponse) || ('type' in apiResponse && apiResponse.type)) serviceData = apiResponse;
  }

  console.log("🔍 ActivityDetailPage: Service Data:", JSON.stringify(serviceData));

  let activity: ExtendedActivityService | undefined = undefined;
  if (serviceData) {
    if (serviceData.service_category === "activity" ||
      (serviceData.type && typeof serviceData.type === 'string' && serviceData.type.startsWith("activity"))) {
      activity = serviceData as ExtendedActivityService;
    }
  }

  console.log("🔍 ActivityDetailPage: Processed Activity:", activity ? "Valid" : "Invalid or non-activity service");

  if (isLoading) return <LoadingSpinner message="Loading activity details..." />;
  if (fetchError || !activity) return <ErrorState message={fetchError?.message || (apiResponse as any)?.message || "Activity not found or invalid type."} />;

  const getGeneralAmenities = (currentActivity: ExtendedActivityService): string[] => {
    if (!currentActivity.amenities) return [];
    if (typeof currentActivity.amenities === 'string') {
      try {
        const amenitiesData = JSON.parse(currentActivity.amenities);
        if (amenitiesData && typeof amenitiesData === 'object' && 'general_amenities' in amenitiesData && Array.isArray(amenitiesData.general_amenities)) {
          return amenitiesData.general_amenities.map(String);
        }
        if (Array.isArray(amenitiesData)) return amenitiesData.map(String);
        return (currentActivity.amenities as string).split(',').map(item => item.trim()).filter(Boolean);
      } catch (e) {
        return (currentActivity.amenities as string).split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    if (Array.isArray(currentActivity.amenities)) return currentActivity.amenities.map(String);
    return [];
  };

  const generalAmenities = getGeneralAmenities(activity);

  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder_service.jpg";
    if (!url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (!url.startsWith("/")) return `/images/${url}`;
    return url;
  };

  const mainImageUrl = normalizeImageUrl(activity.images?.[0]);
  const validGalleryImages = (activity.images ?? []).slice(1).map(normalizeImageUrl).filter(img => img !== "/images/placeholder_service.jpg");

  const formattedDuration = activity.duration && activity.duration_unit
    ? `${activity.duration} ${activity.duration_unit}`
    : activity.duration ? `${activity.duration} hours` : null;

  const handleMainImageError = () => {
    setMainImageError(true);
  };

  const handleGalleryImageError = (index: number) => {
    setGalleryImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="bg-white min-h-screen"> {/* Base background to white */}
      {isAdminPreview && (
        <div className="container mx-auto px-4 py-3 my-4 text-center bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow">
          <p className="font-semibold text-base">ADMIN PREVIEW MODE</p>
          <p className="text-sm">You are viewing this activity as an administrator. Approval status is shown below.</p>
        </div>
      )}
      {/* Sticky Header */}
      <div className={`bg-white shadow-sm py-3 sticky top-0 z-40 border-b ${neutralBorderLight}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/activities" className={buttonSecondaryStyle}> {/* Using shared button style */}
            <ChevronLeft size={18} className="mr-1.5" />
            Back to Activities
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto px-4 ${sectionPadding}`}>
        {/* Service Title and Meta */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${neutralText} mb-2`}>
            {activity.name}
            {isAdminPreview && activity.is_admin_approved !== undefined && (
              <span className={`ml-3 text-sm align-middle font-medium px-2.5 py-0.5 rounded-full ${activity.is_admin_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Status: {activity.is_admin_approved ? 'Approved' : 'Pending Approval'}
              </span>
            )}
          </h1>
          <div className={`flex flex-wrap items-center text-sm ${neutralTextLight} gap-x-4 gap-y-1.5`}>
            {activity.island_name && <span className="flex items-center"><MapPin size={15} className={`mr-1.5 ${neutralIconColor}`} /> {activity.island_name}</span>}
            {formattedDuration && <span className="flex items-center"><Clock size={15} className={`mr-1.5 ${neutralIconColor}`} /> {formattedDuration}</span>}
            {activity.rating !== null && typeof activity.rating === 'number' && (
              <span className="flex items-center">
                <Star size={15} className="mr-1 text-yellow-400 fill-current" /> {activity.rating.toFixed(1)}/5.0
              </span>
            )}
            {activity.difficulty_level && (
              <span className="flex items-center">
                <BarChart3 size={15} className={`mr-1.5 ${neutralIconColor}`} />
                {activity.difficulty_level.charAt(0).toUpperCase() + activity.difficulty_level.slice(1)} Difficulty
              </span>
            )}
          </div>
          {activity.provider?.business_name && (
            <p className={`text-sm ${neutralTextLight} mt-2`}>
              Offered by: <span className={`font-medium ${neutralText}`}>{activity.provider.business_name}</span>
            </p>
          )}
        </div>

        {/* Layout: Main Content & Sidebar */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* --- Left Column (Images & Details) --- */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className={`mb-6 rounded-2xl overflow-hidden shadow-lg relative aspect-[16/10] border ${neutralBorderLight}`}>
              <Image
                src={mainImageUrl}
                alt={`Main image for ${activity.name}`}
                fill style={{ objectFit: 'cover' }}
                className="bg-gray-100"
                onError={(e) => { 
                  e.currentTarget.src = "/images/placeholder_service.jpg"; 
                  e.currentTarget.onerror = null;
                  handleMainImageError();
                }}
                priority unoptimized={true} sizes="(max-width: 1024px) 100vw, 66vw" loading="eager"
              />
              {/* Only show ImageOff overlay when there's an actual error */}
              {mainImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 pointer-events-none">
                  <ImageOff size={48} className={`${neutralIconColor} opacity-50`} />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            {validGalleryImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {validGalleryImages.map((img, index) => (
                  <div key={index} className={`rounded-xl overflow-hidden shadow-md aspect-square relative border ${neutralBorderLight}`}>
                    <Image
                      src={img} alt={`${activity.name} gallery image ${index + 1}`}
                      fill style={{ objectFit: 'cover' }} className="bg-gray-100"
                      onError={(e) => { 
                        e.currentTarget.src = "/images/placeholder_service.jpg"; 
                        e.currentTarget.onerror = null;
                        handleGalleryImageError(index);
                      }}
                      unoptimized={true} sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" loading="lazy"
                    />
                    {/* Only show ImageOff overlay when there's an actual error */}
                    {galleryImageErrors[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 pointer-events-none">
                        <ImageOff size={32} className={`${neutralIconColor} opacity-50`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Details Card */}
            <div className={cardBaseStyle}>
              <DetailSection title="About this Activity" icon={Info}>
                <p>{activity.description || "Detailed description not available."}</p>
              </DetailSection>

              <DetailSection title="Activity Highlights" icon={Sparkles}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {formattedDuration && (
                    <div className="flex items-start"><Clock size={18} className={`mr-2 ${neutralIconColor} mt-0.5 flex-shrink-0`} /><div><h4 className={`font-medium ${neutralText}`}>Duration</h4><p>{formattedDuration}</p></div></div>
                  )}
                  {(activity.group_size_min || activity.group_size_max) && (
                    <div className="flex items-start"><Users size={18} className={`mr-2 ${neutralIconColor} mt-0.5 flex-shrink-0`} /><div><h4 className={`font-medium ${neutralText}`}>Group Size</h4><p>{activity.group_size_min && activity.group_size_max ? `${activity.group_size_min} to ${activity.group_size_max}` : activity.group_size_min ? `Min ${activity.group_size_min}` : `Max ${activity.group_size_max}`} people</p></div></div>
                  )}
                  {activity.difficulty_level && (
                    <div className="flex items-start"><BarChart3 size={18} className={`mr-2 ${neutralIconColor} mt-0.5 flex-shrink-0`} /><div><h4 className={`font-medium ${neutralText}`}>Difficulty</h4><p>{activity.difficulty_level.charAt(0).toUpperCase() + activity.difficulty_level.slice(1)}</p></div></div>
                  )}
                  {activity.guide_required && (
                    <div className="flex items-start"><UserPlus size={18} className={`mr-2 ${neutralIconColor} mt-0.5 flex-shrink-0`} /><div><h4 className={`font-medium ${neutralText}`}>Guide</h4><p>Professional guide included</p></div></div>
                  )}
                </div>
              </DetailSection>

              {activity.equipment_provided && activity.equipment_provided.length > 0 && (
                <DetailSection title="Equipment Provided" icon={LifeBuoy}>
                  <ul className={`list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 marker:${neutralIconColor}`}>{activity.equipment_provided.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </DetailSection>
              )}
              {activity.safety_requirements && (
                <DetailSection title="Safety First" icon={HardHat}><p>{activity.safety_requirements}</p></DetailSection>
              )}
              {generalAmenities.length > 0 && (
                <DetailSection title="General Amenities" icon={Sparkles}>
                  <ul className={`list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 marker:${neutralIconColor}`}>{generalAmenities.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </DetailSection>
              )}
              {activity.location_details && (
                <DetailSection title="Location & Meeting Point" icon={Navigation}>
                  <p>{activity.location_details}</p>
                  {activity.latitude && activity.longitude && (
                    <a href={`https://maps.google.com/?q=${activity.latitude},${activity.longitude}`} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-flex items-center text-sm ${primaryButtonBg} text-white hover:opacity-90 font-medium px-3 py-1.5 rounded-md`}>
                      View on Map <MapPin size={14} className="ml-1.5" />
                    </a>
                  )}
                </DetailSection>
              )}
              {activity.what_to_bring && activity.what_to_bring.length > 0 && (
                <DetailSection title="What to Bring" icon={Sun}>
                  <ul className={`list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 marker:${neutralIconColor}`}>{activity.what_to_bring.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </DetailSection>
              )}
              {activity.included_services && activity.included_services.length > 0 && (
                <DetailSection title="What's Included" icon={CheckCircle}>
                  <ul className={`list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 marker:${neutralIconColor}`}>{activity.included_services.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </DetailSection>
              )}
              {activity.not_included_services && activity.not_included_services.length > 0 && (
                <DetailSection title="What's Not Included" icon={XCircle}>
                  <ul className={`list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 marker:${neutralIconColor}`}>{activity.not_included_services.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </DetailSection>
              )}
              {activity.availability_summary && (typeof activity.availability_summary === 'string') && ( // Ensure it's a string
                <DetailSection title="Availability Notes" icon={CalendarDays}>
                  {(() => {
                    try {
                      const availabilityData = JSON.parse(activity.availability_summary);
                      if (availabilityData && typeof availabilityData === 'object') {
                        const availableDays = Array.isArray(availabilityData.days) ? availabilityData.days.join(', ') : null;
                        const notes = typeof availabilityData.notes === 'string' ? availabilityData.notes : null;

                        if (availableDays || notes) {
                          return (
                            <>
                              {availableDays && <p className={`font-medium ${neutralText} mb-1`}>Available on: {availableDays}</p>}
                              {notes && <p>{notes}</p>}
                            </>
                          );
                        }
                      }
                    } catch (e) {
                      // Not a valid JSON or unexpected structure, render as plain text
                      console.warn("Failed to parse availability_summary JSON:", e);
                    }
                    // Fallback to rendering the original string if parsing fails or structure is not as expected
                    return <p>{activity.availability_summary}</p>;
                  })()}
                </DetailSection>
              )}
              <DetailSection title="Cancellation Policy" icon={ShieldCheck} className="border-b-0 pb-0">
                <p>{activity.cancellation_policy || "Contact provider for cancellation details."}</p>
              </DetailSection>
            </div>
          </div>

          {/* --- Right Column (Booking/Provider Sidebar) --- */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className={`${cardBaseStyle} sticky top-24 shadow-xl`}> {/* Increased shadow for emphasis */}
              <h3 className={`text-xl font-semibold ${neutralText} mb-1.5`}>Price</h3>
              <p className={`text-3xl font-bold ${neutralText} mb-0.5`}>
                {activity.price_numeric ? `₹${activity.price_numeric.toLocaleString("en-IN")}` : (activity.price_details || "Contact")}
              </p>
              <p className={`text-xs ${neutralTextLight} mb-4`}>
                {activity.price_numeric ? "per person (approx)" : "(contact for details)"}
              </p>

              <div className="my-4 space-y-3">
                <div>
                  <label htmlFor="activity-date" className={`block text-xs font-medium ${neutralTextLight} mb-1`}>Select Date</label>
                  <input type="date" id="activity-date" name="activity-date" className={`mt-1 block w-full py-2 px-3 border ${neutralBorder} bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${primaryButtonBg}] focus:border-[${primaryButtonBg}] text-sm ${neutralText}`} />
                </div>
                <div>
                  <label htmlFor="activity-guests" className={`block text-xs font-medium ${neutralTextLight} mb-1`}>Number of Guests</label>
                  <input type="number" id="activity-guests" name="activity-guests" defaultValue="1" min="1" className={`mt-1 block w-full py-2 px-3 border ${neutralBorder} bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${primaryButtonBg}] focus:border-[${primaryButtonBg}] text-sm ${neutralText}`} />
                </div>
              </div>

              <button
                type="button"
                className={`${buttonPrimaryStyle} w-full`} // Ensure full width
                onClick={() => alert("Booking functionality to be implemented!")}
              >
                Book This Activity
              </button>
              <p className={`text-xs ${neutralTextLight} mt-2.5 text-center`}>Secure your spot! This activity is popular.</p>

              {activity.provider && (
                <div className={`mt-6 pt-6 border-t ${neutralBorderLight}`}>
                  <h4 className={`text-md font-semibold ${neutralText} mb-2 flex items-center`}>
                    <Building size={18} className={`mr-2 ${neutralIconColor}`} />
                    Service Provider
                  </h4>
                  <p className={`text-sm font-medium ${neutralText}`}>{activity.provider.business_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsPage;
