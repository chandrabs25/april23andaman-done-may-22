"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch"; // Assuming this hook exists
import type { TransportService, SingleServiceResponse } from "@/types/transport_rental"; // Assuming these types exist
import {
  Loader2,
  AlertTriangle,
  MapPin,
  Clock,
  Star,
  IndianRupee,
  Users,
  CalendarDays,
  ShieldCheck,
  Info,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Car,
  Route as RouteIcon,
  DollarSign,
  UserCheck,
  Building,
  ImageOff
} from "lucide-react";

// --- Import Common Styles (from the shared theme.ts file) ---
import {
  primaryButtonBg, // This was already used, now imported
  // primaryButtonHoverBg, // Included in buttonPrimaryStyle
  // primaryButtonText, // Included in buttonPrimaryStyle
  // secondaryButtonBg, // Included in buttonSecondaryStyle
  // secondaryButtonHoverBg, // Included in buttonSecondaryStyle
  // secondaryButtonText, // Included in buttonSecondaryStyle
  // secondaryButtonBorder, // Included in buttonSecondaryStyle
  // infoBg, // Used in helper components if they were local, now they use imported styles
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
  errorBg, // Used in ErrorState
  errorBorder, // Used in ErrorState
  errorText, // Used in ErrorState
  errorIconColor, // Used in ErrorState
  neutralBgLight, // Used in LoadingState and various elements
  neutralBorderLight, // Used in various elements
  // neutralBg, // Used for image placeholder, now imported
  // neutralBorder, // Used in various elements, now imported
  neutralText, // Used in various text elements
  neutralTextLight, // Used in various text elements
  neutralIconColor, // Used for icons
  sectionPadding, // Used for page and section padding
  cardBaseStyle, // Used for main content cards
  sectionHeadingStyle, // Used for section titles
  buttonPrimaryStyle, // Used for the main action button
  buttonSecondaryStyle, // Used for the back button
} from "@/styles/theme"; // Adjust path if your theme file is located elsewhere
// --- End Common Styles Import ---


// --- Helper Components (Styled with Imported Theme) ---
const LoadingState = () => (
  // Use neutral colors for loading state from imported theme
  <div className={`container mx-auto px-4 ${sectionPadding} text-center ${neutralBgLight} rounded-2xl border ${neutralBorderLight}`}>
    <Loader2 className={`h-12 w-12 animate-spin ${neutralIconColor} mx-auto mb-4`} />
    <p className={`text-xl font-semibold ${neutralText}`}>Loading Transport Service Details...</p>
    <p className={`${neutralTextLight}`}>Please wait a moment.</p>
  </div>
);

const ErrorState = ({ message }: { message?: string }) => (
  // Use error colors for error state from imported theme
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
  highlight?: boolean;
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon: Icon, className, highlight }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={`flex items-start py-2 ${className || ""}`}>
      {/* Use neutralIconColor for icons, potentially primaryButtonBg for highlighted icons (primaryButtonBg is available from import) */}
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
  className?: string;
}
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, className }) => (
  // Add padding and border consistent with card sections using imported styles
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

const TransportServiceDetailPage = () => {
  const params = useParams();
  const serviceId = params.serviceId as string;

  console.log("🔍 TransportServiceDetailPage: Loading service with ID:", serviceId);

  // Fetch data using the custom hook
  const { data: apiResponse, error, status } = useFetch<SingleServiceResponse>(serviceId ? `/api/services-main/${serviceId}` : null);

  const isLoading = status === "loading";
  const fetchError = status === "error" ? error : null;

  console.log("🔍 TransportServiceDetailPage: API Response:", JSON.stringify(apiResponse));
  console.log("🔍 TransportServiceDetailPage: Status:", status);
  console.log("🔍 TransportServiceDetailPage: Error:", fetchError);

  // --- Data Parsing Logic ---
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

  console.log("🔍 TransportServiceDetailPage: Service Data:", JSON.stringify(serviceData));

  // Extract and validate the service data
  let service: TransportService | undefined = undefined;
  if (serviceData) {
    if (serviceData.service_category === "transport") {
      service = serviceData as TransportService;
    } else if (serviceData.type && typeof serviceData.type === "string" && serviceData.type.startsWith("transport")) {
      service = {
        ...serviceData,
        service_category: "transport"
      } as TransportService;
    }
  }

  console.log("🔍 TransportServiceDetailPage: Processed Service:", service ? "Valid transport service" : "Invalid or non-transport service");

  // Handle Loading and Error States
  if (isLoading) return <LoadingState />;
  if (fetchError || !service) {
    return <ErrorState message={fetchError?.message || (apiResponse as any)?.message || "Transport service not found or invalid type."} />;
  }

  // --- Amenity Parsing Function ---
  const parseAmenities = (service: TransportService) => {
    let transportSpecifics: any = null;
    if (service.amenities && typeof service.amenities === 'string') {
      try {
        const amenitiesData = JSON.parse(service.amenities);
        if (amenitiesData?.specifics?.transport) {
          transportSpecifics = amenitiesData.specifics.transport;
        }
      } catch (e) {
        console.error("Failed to parse amenities JSON:", e);
      }
    } else if (typeof service.amenities === 'object' && service.amenities !== null) {
      if ((service.amenities as any)?.specifics?.transport) {
        transportSpecifics = (service.amenities as any).specifics.transport;
      }
    }
    return {
      vehicle_type: transportSpecifics?.vehicle_type || service.vehicle_type,
      capacity_passengers: transportSpecifics?.capacity_passengers || service.capacity_passengers,
      route_details: transportSpecifics?.route_details || service.route_details,
      price_per_km: transportSpecifics?.price_per_km || service.price_per_km,
      price_per_trip: transportSpecifics?.price_per_trip || service.price_per_trip,
      driver_included: transportSpecifics?.driver_included !== undefined
        ? transportSpecifics.driver_included
        : service.driver_included,
      price_details: service.price_details,
      price_numeric: service.price_numeric
    };
  };

  const transportDetails = parseAmenities(service);

  // --- Image URL Normalization and Fallback ---
  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder_service.jpg";
    if (!url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (!url.startsWith("/")) {
      return `/images/${url}`;
    }
    return url;
  };

  const mainImageUrl = normalizeImageUrl(service.images?.[0]);

  const validGalleryImages = (service.images ?? [])
    .slice(1)
    .map(img => normalizeImageUrl(img))
    .filter(img => img !== "/images/placeholder_service.jpg");


  // --- General Amenities Parsing ---
  const getGeneralAmenities = (service: TransportService): string[] => {
    if (Array.isArray(service.amenities)) {
      return service.amenities.map(String);
    }
    if (typeof service.amenities === 'string') {
      try {
        const amenitiesData = JSON.parse(service.amenities);
        if (amenitiesData && Array.isArray(amenitiesData.general)) {
          return amenitiesData.general.map(String);
        }
      } catch (e) {
        console.error("Failed to parse amenities JSON for general amenities:", e);
      }
    } else if (typeof service.amenities === 'object' && service.amenities !== null) {
      if (Array.isArray((service.amenities as any)?.general)) {
        return (service.amenities as any).general.map(String);
      }
    }
    return [];
  };

  const generalAmenities = getGeneralAmenities(service);

  // --- Availability Parsing ---
  const parseAvailability = (summary: string | null | undefined | object) => {
    let days: string[] = [];
    let notes: string | null = null;
    if (!summary) {
      return { days, notes: "Not specified" };
    }
    let availabilityData: { days?: any[]; notes?: string } | null = null;
    if (typeof summary === 'string') {
      try {
        let cleanedString = summary;
        if (cleanedString.startsWith('"') && cleanedString.endsWith('"')) {
          cleanedString = cleanedString.slice(1, -1);
        }
        cleanedString = cleanedString.replace(/\\"/g, '"');
        availabilityData = JSON.parse(cleanedString);
      } catch (e) {
        console.error("Failed to parse availability_summary JSON:", e);
        notes = summary;
      }
    } else if (typeof summary === 'object' && summary !== null) {
      availabilityData = summary as { days?: any[]; notes?: string };
    }

    if (availabilityData) {
      if (Array.isArray(availabilityData.days)) {
        days = availabilityData.days.map(day => String(day));
      }
      if (typeof availabilityData.notes === 'string') {
        notes = availabilityData.notes;
      }
    }
    if (days.length === 0 && notes === null) {
      notes = "Availability details not specified.";
    }
    return { days, notes };
  };

  const { days: availableDays, notes: availabilityNotes } = parseAvailability(service.availability_summary);

  // --- JSX Structure using the imported theme ---
  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Header */}
      <div className={`bg-white shadow-sm py-3 sticky top-0 z-40 border-b ${neutralBorderLight}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/services" className={buttonSecondaryStyle}>
            <ChevronLeft size={18} className="mr-1.5" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto px-4 ${sectionPadding}`}>
        {/* Service Title and Meta */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${neutralText} mb-2`}>{service.name}</h1>
          <div className={`flex flex-wrap items-center text-sm ${neutralTextLight} gap-x-4 gap-y-1.5`}>
            {service.island_name && <span className="flex items-center"><MapPin size={15} className={`mr-1.5 ${neutralIconColor}`} /> {service.island_name}</span>}
            {transportDetails.vehicle_type && <span className="flex items-center"><Car size={15} className={`mr-1.5 ${neutralIconColor}`} /> {transportDetails.vehicle_type}</span>}
            {service.rating !== null && typeof service.rating === 'number' && (
              <span className="flex items-center">
                <Star size={15} className="mr-1 text-yellow-400 fill-current" /> {service.rating.toFixed(1)}/5.0
              </span>
            )}
          </div>
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
                fill
                style={{ objectFit: 'cover' }}
                className="bg-gray-100" // Uses neutralBg from theme implicitly
                onError={(e) => {
                  console.log("Main image error, using placeholder");
                  e.currentTarget.src = "/images/placeholder_service.jpg";
                  e.currentTarget.onerror = null;
                }}
                priority
                unoptimized={true}
                sizes="(max-width: 1024px) 100vw, 66vw"
                loading="eager"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 pointer-events-none"> {/* Uses neutralBg from theme implicitly */}
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
                      className="bg-gray-100" // Uses neutralBg from theme implicitly
                      onError={(e) => {
                        console.log("Gallery image error, using placeholder");
                        e.currentTarget.src = "/images/placeholder_service.jpg";
                        e.currentTarget.onerror = null;
                      }}
                      unoptimized={true}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 pointer-events-none"> {/* Uses neutralBg from theme implicitly */}
                      <ImageOff size={32} className={`${neutralIconColor} opacity-50`} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Details Card */}
            <div className={cardBaseStyle}>
              <DetailSection title="Service Overview" icon={Info}>
                <p className={`text-base leading-relaxed ${neutralTextLight}`}>{service.description || "Detailed description not available."}</p>
              </DetailSection>

              <DetailSection title="Transport Details" icon={Car}>
                <DetailItem label="Vehicle Type" value={transportDetails.vehicle_type} icon={Car} highlight />
                <DetailItem label="Capacity" value={transportDetails.capacity_passengers ? `${transportDetails.capacity_passengers} passengers` : null} icon={Users} />
                <DetailItem label="Route/Area" value={transportDetails.route_details} icon={RouteIcon} />
                <DetailItem label="Driver" value={transportDetails.driver_included === true ? "Included" : (transportDetails.driver_included === false ? "Not Included" : "N/A")} icon={UserCheck} />
              </DetailSection>

              <DetailSection title="Pricing" icon={IndianRupee}>
                {service.price_numeric ? (
                  <DetailItem label="Base Price" value={`₹${service.price_numeric.toLocaleString("en-IN")}`} highlight />
                ) : (
                  <DetailItem label="Price" value={service.price_details || "Contact provider"} highlight />
                )}
                {transportDetails.price_per_km && <DetailItem label="Per KM" value={`₹${transportDetails.price_per_km.toLocaleString("en-IN")}`} />}
                {transportDetails.price_per_trip && <DetailItem label="Per Trip" value={`₹${transportDetails.price_per_trip.toLocaleString("en-IN")}`} />}
                {service.price_details && service.price_details !== String(service.price_numeric) && (
                  <DetailItem label="Notes" value={service.price_details} />
                )}
              </DetailSection>

              {generalAmenities.length > 0 && (
                <DetailSection title="Features & Amenities" icon={CheckCircle}>
                  <ul className={`list-disc list-inside text-sm ${neutralTextLight} grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 marker:${neutralIconColor}`}>
                    {generalAmenities.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </DetailSection>
              )}

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
            <div className={`${cardBaseStyle} sticky top-24 shadow-xl`}>
              <h3 className={`text-xl font-semibold ${neutralText} mb-1.5`}>Price</h3>
              <p className={`text-3xl font-bold ${neutralText} mb-1`}> {/* Price color updated to neutralText */}
                {service.price_numeric ? `₹${service.price_numeric.toLocaleString("en-IN")}` : "Contact"}
              </p>
              <p className={`text-xs ${neutralTextLight} mb-4`}>
                {service.price_numeric ? "(indicative price)" : "(contact for details)"}
              </p>


              <button
                type="button"
                className={`${buttonPrimaryStyle} w-full`} // Ensure buttonPrimaryStyle is applied and is full width
              // onClick={() => { /* Handle booking/enquiry */ }}
              >
                Book Now / Enquire
              </button>

              {service.provider && (
                <div className={`mt-6 pt-6 border-t ${neutralBorderLight}`}>
                  <h4 className={`text-md font-semibold ${neutralText} mb-2 flex items-center`}>
                    <Building size={18} className={`mr-2 ${neutralIconColor}`} />
                    Service Provider
                  </h4>
                  <p className={`text-sm font-medium ${neutralText}`}>{service.provider.business_name}</p>
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

export default TransportServiceDetailPage;
