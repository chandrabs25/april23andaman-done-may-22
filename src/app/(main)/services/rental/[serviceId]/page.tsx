// src/app/(main)/services/rental/[serviceId]/page.tsx
"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation"; // Added useSearchParams
import Link from "next/link";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch"; // Assuming this hook exists
import type { RentalService, SingleServiceResponse } from "@/types/transport_rental"; // Assuming these types exist
import {
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
  ImageOff, // Added for image error placeholder
  FileTextIcon
} from "lucide-react";

// --- Import Common Styles ---
import {
  primaryButtonBg, // Kept for focus ring or dynamic highlights if needed elsewhere
  // primaryButtonHoverBg, (already in buttonPrimaryStyle)
  // primaryButtonText, (already in buttonPrimaryStyle)
  // secondaryButtonBg, (already in buttonSecondaryStyleHero)
  // secondaryButtonHoverBg, (already in buttonSecondaryStyleHero)
  // secondaryButtonText, (already in buttonSecondaryStyleHero)
  // secondaryButtonBorder, (already in buttonSecondaryStyleHero)
  infoBg, infoBorder, infoText, infoIconColor,
  successBg, successBorder, successText, successIconColor,
  warningBg, warningBorder, warningText, warningIconColor,
  // tipBg, tipBorder, tipText, tipIconColor, (not used here but good to list if available)
  errorBg, errorBorder, errorText, errorIconColor,
  neutralBgLight, neutralBorderLight, neutralBg, neutralBorder,
  neutralText, neutralTextLight, neutralIconColor,
  sectionPadding, cardBaseStyle, sectionHeadingStyle,
  buttonPrimaryStyle, buttonSecondaryStyleHero, // Use Hero for secondary as it's more prominent
  breadcrumbItemStyle, breadcrumbLinkStyle, breadcrumbSeparatorStyle, // For Hero breadcrumbs
  galleryMainImageContainerStyle, galleryCaptionOverlayStyle, // For Hero image
} from "@/styles/26themeandstyle";
// --- End Common Styles ---


// --- Helper Components (Styled with Imported Theme) ---
const LoadingSpinner = ({ message = "Loading service details..." }: { message?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight} ${sectionPadding}`}>
    <Image
      src="/images/loading.gif"
      alt="Loading..."
      width={128}
      height={128}
      priority
      className="mb-5"
    />
    <span className={`text-xl ${infoText} font-semibold`}>{message}</span>
    <p className={`${neutralTextLight} mt-1`}>Please wait a moment.</p>
  </div>
);

const ErrorState = ({ message }: { message?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${sectionPadding} ${errorBg} border ${errorBorder} rounded-2xl m-4 md:m-8`}>
    <AlertTriangle className={`h-20 w-20 ${errorIconColor} mb-6`} />
    <p className={`text-2xl md:text-3xl font-semibold ${errorText} mb-3`}>Could Not Load Service</p>
    <p className={`${neutralTextLight} mb-8 max-w-md`}>{message || "The service details could not be retrieved at this time."}</p>
    <Link href="/services" className={`${buttonPrimaryStyle} bg-red-600 hover:bg-red-700 focus:ring-red-500 text-base py-2.5 px-6`}>
      <ChevronLeft size={18} className="mr-2" /> Back to Services
    </Link>
  </div>
);

interface DetailItemProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  highlight?: boolean;
  valueClassName?: string; // Added for specific value styling
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon: Icon, className, highlight, valueClassName }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={`flex items-start py-2.5 ${className || ""}`}>
      {Icon && <Icon size={18} className={`mr-3 mt-0.5 flex-shrink-0 ${highlight ? infoIconColor : neutralIconColor}`} />}
      <span className={`text-sm ${highlight ? `font-semibold ${neutralText}` : `font-medium ${neutralText}`} w-36 md:w-44 flex-shrink-0`}>{label}:</span>
      <span className={`text-sm ${neutralTextLight} flex-grow break-words ${valueClassName || ''}`}>{value}</span>
    </div>
  );
};

interface DetailSectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  id?: string; // Added for anchor links
}
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, className, id }) => (
  <div id={id} className={`py-6 md:py-8 border-b ${neutralBorderLight} last:border-b-0 ${className || ""} scroll-mt-20`}>
    <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl`}>
      {Icon && <Icon size={22} className={`mr-3 ${infoIconColor}`} />} {/* Using infoIconColor for section icons */}
      {title}
    </h2>
    <div className="space-y-2 mt-3 md:mt-4">
      {children}
    </div>
  </div>
);
// --- End Helper Components ---

const RentalServiceDetailPage = () => {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const searchParams = useSearchParams(); // Added
  const isAdminPreview = searchParams.get('isAdminPreview') === 'true'; // Added

  console.log("🔍 RentalServiceDetailPage: Loading service with ID:", serviceId);

  // Fetch data using the custom hook
  const apiUrl = isAdminPreview
    ? `/api/admin/service_preview/${serviceId}`
    : `/api/services-main/${serviceId}`;
  const { data: apiResponse, error, status } = useFetch<SingleServiceResponse>(serviceId ? apiUrl : null);

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
  if (isLoading) return <LoadingSpinner message="Loading Rental Service Details..." />;
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
    <div className={`${neutralBgLight} min-h-screen`}>
      {isAdminPreview && (
        <div className="container mx-auto px-4 py-3 my-4 text-center bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow">
          <p className="font-semibold text-base">ADMIN PREVIEW MODE</p>
          <p className="text-sm">You are viewing this rental service as an administrator. Approval status is shown below.</p>
        </div>
      )}
      {/* Hero Section */}
      <div className={`relative h-[50vh] md:h-[60vh] w-full ${galleryMainImageContainerStyle.replace('rounded-2xl shadow-lg border', 'rounded-none shadow-none border-none')}`}>
        <Image
          src={mainImageUrl}
          alt={`${service.name} main image`}
          fill
          priority
          style={{ objectFit: 'cover' }}
          className={`${neutralBg}`}
          onError={(e) => { e.currentTarget.src = "/images/placeholder_service.jpg"; e.currentTarget.onerror = null; }}
        />
        {mainImageUrl === "/images/placeholder_service.jpg" && (
          <div className={`absolute inset-0 flex items-center justify-center ${neutralBg}/80 pointer-events-none`}>
            <ImageOff size={64} className={`${neutralIconColor} opacity-50`} />
          </div>
        )}
        <div className={`absolute inset-0 ${galleryCaptionOverlayStyle.replace('p-6', 'p-0')} bg-gradient-to-t from-black/70 via-black/30 to-transparent`}></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="container mx-auto">
            <nav className={`text-sm text-white/80 mb-2 ${breadcrumbItemStyle}`} aria-label="Breadcrumb">
              <ol className="list-none p-0 inline-flex flex-wrap">
                <li className={breadcrumbItemStyle}><Link href="/" className={breadcrumbLinkStyle}>Home</Link><ChevronLeft size={14} className={`${breadcrumbSeparatorStyle} text-white/70 rotate-180`} /></li>
                <li className={breadcrumbItemStyle}><Link href="/services" className={breadcrumbLinkStyle}>Services</Link><ChevronLeft size={14} className={`${breadcrumbSeparatorStyle} text-white/70 rotate-180`} /></li>
                <li className={`${breadcrumbItemStyle} ${neutralTextLight.replace('text-gray-600', 'text-white/90')}`}><span className="font-medium line-clamp-1">{service.name}</span></li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              {service.name}
              {isAdminPreview && service.is_admin_approved !== undefined && (
                <span className={`ml-3 text-base align-middle font-medium px-3 py-1 rounded-full ${service.is_admin_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Status: {service.is_admin_approved ? 'Approved' : 'Pending Approval'}
                </span>
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90 text-sm md:text-base">
              {service.island_name && <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {service.island_name}</span>}
              {rentalDetails.item_type && <span className="flex items-center"><ShoppingBag size={16} className="mr-1.5" /> {rentalDetails.item_type}</span>}
              {service.rating !== null && typeof service.rating === 'number' && (
                <span className="flex items-center"><Star size={16} className="mr-1 text-yellow-400 fill-current" /> {service.rating.toFixed(1)}/5.0</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto px-4 ${sectionPadding}`}>
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {/* Left Column (Images & Details) */}
          <div className="lg:col-span-2">
            {/* Gallery Images - Themed */}
            {validGalleryImages.length > 0 && (
              <div className={`mb-8 p-4 ${neutralBg} rounded-xl border ${neutralBorderLight}`}>
                <h3 className={`text-xl font-semibold ${neutralText} mb-4`}>Photo Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {validGalleryImages.map((img, index) => (
                    <div key={index} className={`rounded-lg overflow-hidden shadow-sm aspect-square relative border ${neutralBorder} group cursor-pointer`}>
                      <Image
                        src={img} alt={`${service.name} gallery image ${index + 1}`}
                        fill style={{ objectFit: 'cover' }} className={`${neutralBgLight} group-hover:scale-105 transition-transform duration-300`}
                        onError={(e) => { e.currentTarget.src = "/images/placeholder_service.jpg"; e.currentTarget.onerror = null; }}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" loading="lazy"
                      />
                      {img === "/images/placeholder_service.jpg" && (
                        <div className={`absolute inset-0 flex items-center justify-center ${neutralBgLight}/80 pointer-events-none`}>
                          <ImageOff size={32} className={`${neutralIconColor} opacity-50`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Card - Themed */}
            <div className={`${cardBaseStyle} divide-y ${neutralBorderLight}`}>
              <DetailSection id="overview" title="Rental Overview" icon={Info}>
                <p className={`text-base leading-relaxed ${neutralTextLight}`}>{service.description || "Detailed description not available."}</p>
              </DetailSection>

              <DetailSection id="details" title="Rental Details" icon={ShoppingBag}>
                <DetailItem label="Item Type" value={rentalDetails.item_type} icon={Tag} highlight valueClassName={infoText} />
                {rentalDetails.rental_duration_options && rentalDetails.rental_duration_options.length > 0 && (
                  <DetailItem label="Duration Options" value={rentalDetails.rental_duration_options.join(", ")} icon={Clock} />
                )}
                {rentalDetails.pickup_location_options && rentalDetails.pickup_location_options.length > 0 && (
                  <DetailItem label="Pickup Locations" value={rentalDetails.pickup_location_options.join(", ")} icon={MapPin} />
                )}
                {rentalDetails.unit && <DetailItem label="Billing Unit" value={rentalDetails.unit} icon={Repeat} />}
              </DetailSection>

              <DetailSection id="pricing" title="Pricing Information" icon={IndianRupee}>
                {service.price_numeric ? (
                  <DetailItem label="Base Price" value={`₹${service.price_numeric.toLocaleString("en-IN")}`} highlight valueClassName={successText} />
                ) : (
                  <DetailItem label="Price" value={service.price_details || "Contact provider for pricing"} highlight valueClassName={infoText} />
                )}
                {rentalDetails.price_per_hour && <DetailItem label="Per Hour" value={`₹${rentalDetails.price_per_hour.toLocaleString("en-IN")}`} valueClassName={successText} />}
                {rentalDetails.price_per_day && <DetailItem label="Per Day" value={`₹${rentalDetails.price_per_day.toLocaleString("en-IN")}`} valueClassName={successText} />}
                {rentalDetails.deposit_amount && <DetailItem label="Security Deposit" value={`₹${rentalDetails.deposit_amount.toLocaleString("en-IN")}`} icon={Archive} valueClassName={warningText} />}
                {service.price_details && service.price_details !== String(service.price_numeric) && (
                  <DetailItem label="Additional Notes" value={service.price_details} icon={Info} />
                )}
              </DetailSection>

              {generalAmenities.length > 0 && (
                <DetailSection id="features" title="Features / Included" icon={CheckCircle}>
                  <ul className={`list-disc list-inside text-sm ${neutralTextLight} grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 marker:${successIconColor}`}>
                    {generalAmenities.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </DetailSection>
              )}

              {rentalDetails.rental_terms && (
                <DetailSection id="terms" title="Rental Terms & Conditions" icon={FileTextIcon}>
                  <p className={`text-sm ${neutralTextLight} whitespace-pre-line`}>{rentalDetails.rental_terms}</p>
                </DetailSection>
              )}

              <DetailSection id="availability" title="Availability & Policies" icon={CalendarDays} className="border-b-0 pb-0">
                {availableDays.length > 0 && (
                  <DetailItem label="Available Days" value={availableDays.join(", ")} />
                )}
                {availabilityNotes && (
                  <DetailItem label="Availability Notes" value={availabilityNotes} icon={Info} />
                )}
                <DetailItem label="Cancellation Policy" value={service.cancellation_policy || "Not specified"} icon={XCircle} valueClassName={warningText} />
              </DetailSection>
            </div>
          </div>

          {/* Right Column (Booking/Provider Sidebar) - Themed */}
          <div className="lg:col-span-1 mt-10 lg:mt-0">
            <div className={`${cardBaseStyle} sticky top-24 shadow-xl p-5 md:p-6`}>
              <h3 className={`text-xl font-semibold ${neutralText} mb-2`}>Rental Price</h3>
              <p className={`text-3xl md:text-4xl font-bold ${successText} mb-1.5`}>
                <IndianRupee className={`inline h-6 md:h-7 w-6 md:w-7 mr-0.5 ${successIconColor}`} />
                {service.price_numeric ? service.price_numeric.toLocaleString("en-IN") : (service.price_details || "Contact")}
              </p>
              <p className={`text-xs ${neutralTextLight} mb-5`}>
                {rentalDetails.price_per_day ? "per day" : (rentalDetails.price_per_hour ? "per hour" : (service.price_numeric ? "(indicative price)" : "(contact for details)"))}
              </p>

              <Link
                href={`/booking/new?serviceType=rental&serviceId=${service.id}`} // Example booking link
                className={`${buttonPrimaryStyle} w-full text-base py-3`}
              >
                Book Now / Enquire
              </Link>
              <p className={`text-xs ${neutralTextLight} mt-3 text-center`}>Secure your rental today!</p>

              {service.provider && (
                <div className={`mt-6 pt-6 border-t ${neutralBorderLight}`}>
                  <h4 className={`text-md font-semibold ${neutralText} mb-2.5 flex items-center`}>
                    <Building size={18} className={`mr-2.5 ${neutralIconColor}`} />
                    Service Provider
                  </h4>
                  <p className={`text-sm font-medium ${neutralText}`}>{service.provider.business_name}</p>
                  {/* Example: <Link href={`/vendors/${service.provider.id}`} className={`text-sm ${infoText} hover:underline mt-1 inline-block`}>View Profile</Link> */}
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
