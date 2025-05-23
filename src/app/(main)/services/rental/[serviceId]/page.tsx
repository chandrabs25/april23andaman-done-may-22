// src/app/(main)/services/rental/[serviceId]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch"; // Assuming this hook exists
import type { RentalService, SingleServiceResponse } from "@/types/transport_rental"; // Assuming these types exist
import {
  Loader2,
  AlertTriangle,
  MapPin,
  Clock, // Keep for potential future use if needed
  Star,
  IndianRupee,
  CalendarDays,
  ShieldCheck, // Keep for potential future use
  Info,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ShoppingBag, // Rental specific
  Tag, // Rental specific
  Repeat, // Keep for potential future use
  Archive, // For deposit
  Building, // Added for Provider
  ImageOff // Added for image error placeholder
} from "lucide-react";

// --- Import Common Styles (Assume these are defined in a shared file like src/styles/theme.ts) ---
import {
  primaryButtonBg,
  primaryButtonHoverBg,
  primaryButtonText,
  secondaryButtonBg,
  secondaryButtonHoverBg,
  secondaryButtonText,
  secondaryButtonBorder,
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
  tipBg,
  tipBorder,
  tipText,
  tipIconColor,
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
  buttonSecondaryStyle,
} from "@/styles/theme"; // Adjust path as needed
// --- End Common Styles ---


// --- Helper Components (Styled with Imported Theme) ---
const LoadingState = () => (
  // Use neutral colors for loading state
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight}`}>
    <Loader2 className={`h-12 w-12 animate-spin ${neutralIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${neutralText}`}>Loading Rental Service Details...</p>
    <p className={`${neutralTextLight}`}>Please wait a moment.</p>
  </div>
);

const ErrorState = ({ message }: { message?: string }) => (
  // Use error colors for error state
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${errorBg} rounded-2xl border ${errorBorder}`}>
    <AlertTriangle className={`h-12 w-12 ${errorIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${errorText}`}>Could Not Load Service</p>
    <p className={`${neutralTextLight}`}>{message || "The service details could not be retrieved."}</p>
    <Link href="/services" className={`mt-6 ${buttonSecondaryStyle}`}>
      <ChevronLeft size={18} className="mr-2" /> Back to Services
    </Link>
  </div>
);

interface DetailItemProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  highlight?: boolean; // Keep highlight for potential emphasis
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon: Icon, className, highlight }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={`flex items-start py-2 ${className || ""}`}>
      {/* Use neutralIconColor for icons, potentially primaryButtonBg for highlighted icons */}
      {Icon && <Icon size={16} className={`mr-3 mt-1 flex-shrink-0 ${highlight ? primaryButtonBg : neutralIconColor}`} />}
      {/* Use neutralText for labels, potentially bolder if highlighted */}
      <span className={`text-sm ${highlight ? `font-semibold ${neutralText}` : `font-medium ${neutralTextLight}`} w-36 md:w-40 flex-shrink-0`}>{label}:</span>
      {/* Use neutralTextLight for values */}
      <span className={`text-sm ${neutralTextLight} flex-grow break-words`}>{value}</span>
    </div>
  );
};

interface DetailSectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string; // Keep className for flexibility
}
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, className }) => (
  // Add padding and border consistent with card sections
  <div className={`py-5 border-b ${neutralBorderLight} last:border-b-0 ${className || ""}`}>
    {/* Use sectionHeadingStyle for consistency */}
    <h2 className={sectionHeadingStyle}>
      {/* Icon color matches neutral theme */}
      {Icon && <Icon size={20} className={`mr-2.5 ${neutralIconColor}`} />}
      {title}
    </h2>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);
// --- End Helper Components ---

const RentalServiceDetailPage = () => {
  const params = useParams();
  const serviceId = params.serviceId as string;

  console.log("🔍 RentalServiceDetailPage: Loading service with ID:", serviceId);

  // Fetch data using the custom hook
  const { data: apiResponse, error, status } = useFetch<SingleServiceResponse>(serviceId ? `/api/services-main/${serviceId}` : null);

  const isLoading = status === "loading";
  const fetchError = status === "error" ? error : null;

  console.log("🔍 RentalServiceDetailPage: API Response:", JSON.stringify(apiResponse));
  console.log("🔍 RentalServiceDetailPage: Status:", status);
  console.log("🔍 RentalServiceDetailPage: Error:", fetchError);

  // --- Data Parsing Logic (Simplified - assuming similar structure) ---
  let serviceData: any = null;
  if (apiResponse) {
    if ("data" in apiResponse && apiResponse.data) {
      serviceData = apiResponse.data;
    } else if (
      ("service_category" in apiResponse && apiResponse.service_category) ||
      ("type" in apiResponse && apiResponse.type)
    ) {
      serviceData = apiResponse;
    }
  }

  console.log("🔍 RentalServiceDetailPage: Service Data:", JSON.stringify(serviceData));

  // Extract and validate the service data
  let service: RentalService | undefined = undefined;
  if (serviceData) {
    // Check if it's explicitly rental or has a type starting with rental
    if (serviceData.service_category === "rental") {
      service = serviceData as RentalService;
    } else if (serviceData.type && typeof serviceData.type === "string" && serviceData.type.startsWith("rental")) {
      // Adapt structure if needed, assuming core fields exist
      service = {
        ...serviceData,
        service_category: "rental" // Ensure category is set
      } as RentalService;
    }
  }

  console.log("🔍 RentalServiceDetailPage: Processed Service:", service ? "Valid rental service" : "Invalid or non-rental service");

  // Handle Loading and Error States
  if (isLoading) return <LoadingState />;
  if (fetchError || !service) {
    return <ErrorState message={fetchError?.message || (apiResponse as any)?.message || "Rental service not found or invalid type."} />;
  }

  // --- Amenity Parsing Function ---
  const parseAmenities = (service: RentalService) => {
    let rentalSpecifics: any = null; // Use 'any' or a more specific type if available

    // Safely parse JSON amenities string
    if (service.amenities && typeof service.amenities === 'string') {
      try {
        const amenitiesData = JSON.parse(service.amenities);
        if (amenitiesData?.specifics?.rental) {
          rentalSpecifics = amenitiesData.specifics.rental;
        }
      } catch (e) {
        console.error("Failed to parse amenities JSON:", e);
        // Potentially handle malformed JSON string, maybe log it or use fallback
      }
    } else if (typeof service.amenities === 'object' && service.amenities !== null) {
      // Handle case where amenities might already be an object
      if ((service.amenities as any)?.specifics?.rental) {
        rentalSpecifics = (service.amenities as any).specifics.rental;
      }
    }

    // Return combined details, prioritizing parsed specifics over root-level properties
    return {
      item_type: rentalSpecifics?.item_type || service.item_type,
      rental_duration_options: Array.isArray(rentalSpecifics?.rental_duration_options)
        ? rentalSpecifics.rental_duration_options
        : (Array.isArray(service.rental_duration_options) ? service.rental_duration_options : []),
      price_per_hour: rentalSpecifics?.price_per_hour || service.price_per_hour,
      price_per_day: rentalSpecifics?.price_per_day || service.price_per_day,
      deposit_amount: rentalSpecifics?.deposit?.amount || service.deposit_amount,
      pickup_location_options: Array.isArray(rentalSpecifics?.pickup_location_options)
        ? rentalSpecifics.pickup_location_options
        : (Array.isArray(service.pickup_location_options) ? service.pickup_location_options : []),
      rental_terms: rentalSpecifics?.requirements?.details || service.rental_terms,
      unit: rentalSpecifics?.unit || null, // Keep unit if available
      // Keep root price details as they might be the primary source
      price_details: service.price_details,
      price_numeric: service.price_numeric
    };
  };

  const rentalDetails = parseAmenities(service);

  // --- Image URL Normalization and Fallback (Copied from Transport Page) ---
  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder_service.jpg"; // Define placeholder URL
    if (!url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    // Check if it's already a full URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Assume it's a relative path needing the /images/ prefix
    if (!url.startsWith("/")) {
      return `/images/${url}`;
    }
    // If it starts with '/', assume it's correct relative to public folder
    return url;
  };

  const mainImageUrl = normalizeImageUrl(service.images?.[0]);

  // Filter and normalize gallery images safely
  const validGalleryImages = (service.images ?? [])
    .slice(1) // Skip the first image (main image)
    .map(img => normalizeImageUrl(img)) // Normalize each URL
    .filter(img => img !== "/images/placeholder_service.jpg"); // Filter out placeholders if normalization resulted in one


  // --- General Amenities Parsing (Copied from Transport Page) ---
  const getGeneralAmenities = (service: RentalService): string[] => {
    if (Array.isArray(service.amenities)) {
      // If amenities itself is an array (less likely based on parsing logic, but safe check)
      return service.amenities.map(String);
    }
    if (typeof service.amenities === 'string') {
      try {
        const amenitiesData = JSON.parse(service.amenities);
        if (amenitiesData && Array.isArray(amenitiesData.general)) {
          return amenitiesData.general.map(String); // Ensure items are strings
        }
      } catch (e) {
        console.error("Failed to parse amenities JSON for general amenities:", e);
      }
    } else if (typeof service.amenities === 'object' && service.amenities !== null) {
      // Handle case where amenities might already be an object
      if (Array.isArray((service.amenities as any)?.general)) {
        return (service.amenities as any).general.map(String);
      }
    }
    return []; // Return empty array if no general amenities found
  };

  const generalAmenities = getGeneralAmenities(service);

  // --- Availability Parsing (Copied from Transport Page) ---
  const parseAvailability = (summary: string | null | undefined | object) => {
    let days: string[] = [];
    let notes: string | null = null;

    if (!summary) {
      return { days, notes: "Not specified" };
    }

    let availabilityData: { days?: any[]; notes?: string } | null = null;

    if (typeof summary === 'string') {
      try {
        // Clean potential extra quotes and escaped quotes
        let cleanedString = summary;
        if (cleanedString.startsWith('"') && cleanedString.endsWith('"')) {
          cleanedString = cleanedString.slice(1, -1);
        }
        cleanedString = cleanedString.replace(/\\"/g, '"');
        availabilityData = JSON.parse(cleanedString);
      } catch (e) {
        console.error("Failed to parse availability_summary JSON:", e);
        notes = summary; // Fallback to the raw string if parsing fails
      }
    } else if (typeof summary === 'object' && summary !== null) {
      availabilityData = summary as { days?: any[]; notes?: string };
    }


    if (availabilityData) {
      if (Array.isArray(availabilityData.days)) {
        days = availabilityData.days.map(day => String(day)); // Ensure days are strings
      }
      if (typeof availabilityData.notes === 'string') {
        notes = availabilityData.notes;
      }
    }

    // Provide default text if nothing was parsed
    if (days.length === 0 && notes === null) {
      notes = "Availability details not specified.";
    } else if (days.length > 0 && notes === null) {
      // If only days are present, no need for extra notes unless specified
    }

    return { days, notes };
  };

  const { days: availableDays, notes: availabilityNotes } = parseAvailability(service.availability_summary);


  // --- JSX Structure using the imported theme ---
  return (
    // Use bg-white as the base page background
    <div className="bg-white min-h-screen">
      {/* Sticky Header */}
      <div className={`bg-white shadow-sm py-3 sticky top-0 z-40 border-b ${neutralBorderLight}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/services" className={buttonSecondaryStyle}>
            <ChevronLeft size={18} className="mr-1.5" />
            Back to Services
          </Link>
          {/* Optional: Add other header elements here if needed */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto px-4 ${sectionPadding}`}>
        {/* Service Title and Meta */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${neutralText} mb-2`}>{service.name}</h1>
          <div className={`flex flex-wrap items-center text-sm ${neutralTextLight} gap-x-4 gap-y-1.5`}>
            {service.island_name && <span className="flex items-center"><MapPin size={15} className={`mr-1.5 ${neutralIconColor}`} /> {service.island_name}</span>}
            {rentalDetails.item_type && <span className="flex items-center"><ShoppingBag size={15} className={`mr-1.5 ${neutralIconColor}`} /> {rentalDetails.item_type}</span>}
            {service.rating !== null && typeof service.rating === 'number' && (
              <span className="flex items-center">
                <Star size={15} className="mr-1 text-yellow-400 fill-current" /> {service.rating.toFixed(1)}/5.0
              </span>
            )}
          </div>
          {/* Provider Info */}
          {service.provider?.business_name && (
            <p className={`text-sm ${neutralTextLight} mt-2`}>
              Provided by: <span className={`font-medium ${neutralText}`}>{service.provider.business_name}</span>
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
                alt={`Main image for ${service.name}`}
                fill // Use fill for responsive aspect ratio
                style={{ objectFit: 'cover' }} // Ensure image covers the area
                className="bg-gray-100" // Add a subtle background for loading/error
                onError={(e) => {
                  console.log("Main image error, using placeholder");
                  e.currentTarget.src = "/images/placeholder_service.jpg";
                  e.currentTarget.onerror = null; // Prevent infinite loop
                }}
                priority // Load main image first
                unoptimized={true} // If images are not optimized via Next.js Image Optimization
                sizes="(max-width: 1024px) 100vw, 66vw" // Define sizes for optimization
                loading="eager"
              />
              {/* Fallback Icon if image fails catastrophically */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 pointer-events-none">
                <ImageOff size={48} className={`${neutralIconColor} opacity-50`} />
              </div>
            </div>

            {/* Gallery Images */}
            {validGalleryImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {validGalleryImages.map((img, index) => (
                  <div key={index} className={`rounded-xl overflow-hidden shadow-md aspect-square relative border ${neutralBorderLight}`}>
                    <Image
                      src={img}
                      alt={`${service.name} gallery image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="bg-gray-100"
                      onError={(e) => {
                        console.log("Gallery image error, using placeholder");
                        e.currentTarget.src = "/images/placeholder_service.jpg";
                        e.currentTarget.onerror = null;
                      }}
                      unoptimized={true}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      loading="lazy" // Lazy load gallery images
                    />
                    {/* Fallback Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 pointer-events-none">
                      <ImageOff size={32} className={`${neutralIconColor} opacity-50`} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Details Card */}
            {/* Apply cardBaseStyle here */}
            <div className={cardBaseStyle}>
              <DetailSection title="Rental Overview" icon={Info}>
                <p className={`text-base leading-relaxed ${neutralTextLight}`}>{service.description || "Detailed description not available."}</p>
              </DetailSection>

              <DetailSection title="Rental Details" icon={ShoppingBag}>
                <DetailItem label="Item Type" value={rentalDetails.item_type} icon={Tag} highlight />
                {rentalDetails.rental_duration_options && rentalDetails.rental_duration_options.length > 0 && (
                  <DetailItem label="Duration Options" value={rentalDetails.rental_duration_options.join(", ")} icon={Clock} />
                )}
                {rentalDetails.pickup_location_options && rentalDetails.pickup_location_options.length > 0 && (
                  <DetailItem label="Pickup Locations" value={rentalDetails.pickup_location_options.join(", ")} icon={MapPin} />
                )}
                {rentalDetails.unit && <DetailItem label="Unit" value={rentalDetails.unit} />}
              </DetailSection>

              <DetailSection title="Pricing" icon={IndianRupee}>
                {/* Display numeric price prominently if available */}
                {service.price_numeric ? (
                  <DetailItem label="Base Price" value={`₹${service.price_numeric.toLocaleString("en-IN")}`} highlight />
                ) : (
                  <DetailItem label="Price" value={service.price_details || "Contact provider"} highlight />
                )}
                {/* Show per hour/day only if they exist */}
                {rentalDetails.price_per_hour && <DetailItem label="Per Hour" value={`₹${rentalDetails.price_per_hour.toLocaleString("en-IN")}`} />}
                {rentalDetails.price_per_day && <DetailItem label="Per Day" value={`₹${rentalDetails.price_per_day.toLocaleString("en-IN")}`} />}
                {rentalDetails.deposit_amount && <DetailItem label="Security Deposit" value={`₹${rentalDetails.deposit_amount.toLocaleString("en-IN")}`} icon={Archive} />}
                {/* Add general price details if it differs from numeric or provides context */}
                {service.price_details && service.price_details !== String(service.price_numeric) && (
                  <DetailItem label="Notes" value={service.price_details} />
                )}
              </DetailSection>

              {generalAmenities.length > 0 && (
                <DetailSection title="Features / Included" icon={CheckCircle}>
                  <ul className={`list-disc list-inside text-sm ${neutralTextLight} grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 marker:${neutralIconColor}`}>
                    {generalAmenities.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </DetailSection>
              )}

              {rentalDetails.rental_terms && (
                <DetailSection title="Rental Terms" icon={ShieldCheck}>
                  <p className={`text-sm ${neutralTextLight} whitespace-pre-line`}>{rentalDetails.rental_terms}</p>
                </DetailSection>
              )}

              {/* Remove bottom border from the last section */}
              <DetailSection title="Availability & Policy" icon={CalendarDays} className="border-b-0 pb-0">
                {availableDays.length > 0 && (
                  <DetailItem label="Available Days" value={availableDays.join(", ")} />
                )}
                {availabilityNotes && (
                  <DetailItem label="Notes" value={availabilityNotes} />
                )}
                <DetailItem label="Cancellation" value={service.cancellation_policy || "Not specified"} icon={XCircle} />
              </DetailSection>
            </div>
          </div>

          {/* --- Right Column (Booking/Provider Sidebar) --- */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Use cardBaseStyle for the sticky sidebar card, adjust shadow/border if needed */}
            <div className={`${cardBaseStyle} sticky top-24 shadow-xl`}> {/* Increased shadow for emphasis */}
              <h3 className={`text-xl font-semibold ${neutralText} mb-1.5`}>Price</h3>
              <p className={`text-3xl font-bold ${neutralText} mb-1`}> {/* Use neutral text for price */}
                {service.price_numeric ? `₹${service.price_numeric.toLocaleString("en-IN")}` : (service.price_details || "Contact")}
              </p>
              <p className={`text-xs ${neutralTextLight} mb-4`}>
                {/* Add context based on pricing type */}
                {rentalDetails.price_per_day ? "per day" : (rentalDetails.price_per_hour ? "per hour" : (service.price_numeric ? "(indicative price)" : "(contact for details)"))}
              </p>

              {/* Use buttonPrimaryStyle for the main action */}
              <button
                type="button"
                className={`${buttonPrimaryStyle} w-full`} // Ensure full width
                // Add onClick handler for booking/enquiry action
                onClick={() => alert("Booking functionality to be implemented!")}
              >
                Book Now / Enquire
              </button>
              <p className={`text-xs ${neutralTextLight} mt-2.5 text-center`}>Check availability and book now!</p>

              {/* Provider Information */}
              {service.provider && (
                <div className={`mt-6 pt-6 border-t ${neutralBorderLight}`}>
                  <h4 className={`text-md font-semibold ${neutralText} mb-2 flex items-center`}>
                    <Building size={18} className={`mr-2 ${neutralIconColor}`} />
                    Service Provider
                  </h4>
                  <p className={`text-sm font-medium ${neutralText}`}>{service.provider.business_name}</p>
                  {/* Optional: Add provider contact/link if available */}
                  {/* <p className={`text-sm ${neutralTextLight} mt-1`}>{service.provider.contact_email}</p> */}
                  {/* <Link href={`/providers/${service.provider.id}`} className={`text-sm ${infoText} hover:underline mt-1 inline-block`}>View Provider Profile</Link> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalServiceDetailPage;
