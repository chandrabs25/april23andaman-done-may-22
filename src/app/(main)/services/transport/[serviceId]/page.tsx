"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation"; // Added useSearchParams
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

// --- Import Common Styles ---
import {
  primaryButtonBg, // Kept for focus ring or dynamic highlights if needed elsewhere
  infoBg, infoBorder, infoText, infoIconColor,
  successBg, successBorder, successText, successIconColor,
  warningBg, warningBorder, warningText, warningIconColor,
  errorBg, errorBorder, errorText, errorIconColor,
  neutralBgLight, neutralBorderLight, neutralBg, neutralBorder,
  neutralText, neutralTextLight, neutralIconColor,
  sectionPadding, cardBaseStyle, sectionHeadingStyle,
  buttonPrimaryStyle, buttonSecondaryStyleHero, // Use Hero for secondary as it's more prominent
  breadcrumbItemStyle, breadcrumbLinkStyle, breadcrumbSeparatorStyle,
  galleryMainImageContainerStyle, galleryCaptionOverlayStyle,
} from "@/styles/26themeandstyle";
// --- End Common Styles Import ---


// --- Helper Components (Styled with Imported Theme) ---
const LoadingState = () => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${neutralBgLight} ${sectionPadding}`}>
    <Loader2 className={`h-16 w-16 animate-spin ${infoIconColor} mb-5`} />
    <p className={`text-xl font-semibold ${infoText}`}>Loading Transport Service Details...</p>
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
  valueClassName?: string;
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
  id?: string;
}
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, className, id }) => (
  <div id={id} className={`py-6 md:py-8 border-b ${neutralBorderLight} last:border-b-0 ${className || ""} scroll-mt-20`}>
    <h2 className={`${sectionHeadingStyle} text-xl md:text-2xl`}>
      {Icon && <Icon size={22} className={`mr-3 ${infoIconColor}`} />}
      {title}
    </h2>
    <div className="space-y-2 mt-3 md:mt-4">
      {children}
    </div>
  </div>
);
// --- End Helper Components ---

const TransportServiceDetailPage = () => {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const searchParams = useSearchParams(); // Added
  const isAdminPreview = searchParams.get('isAdminPreview') === 'true'; // Added

  console.log("🔍 TransportServiceDetailPage: Loading service with ID:", serviceId);

  // Fetch data using the custom hook
  const apiUrl = isAdminPreview
    ? `/api/admin/service_preview/${serviceId}`
    : `/api/services-main/${serviceId}`;
  const { data: apiResponse, error, status } = useFetch<SingleServiceResponse>(serviceId ? apiUrl : null);

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
    <div className={`${neutralBgLight} min-h-screen`}>
      {isAdminPreview && (
        <div className="container mx-auto px-4 py-3 my-4 text-center bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow">
          <p className="font-semibold text-base">ADMIN PREVIEW MODE</p>
          <p className="text-sm">You are viewing this transport service as an administrator. Approval status is shown below.</p>
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
              {transportDetails.vehicle_type && <span className="flex items-center"><Car size={16} className="mr-1.5" /> {transportDetails.vehicle_type}</span>}
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
              <DetailSection id="overview" title="Service Overview" icon={Info}>
                <p className={`text-base leading-relaxed ${neutralTextLight}`}>{service.description || "Detailed description not available."}</p>
              </DetailSection>

              <DetailSection id="details" title="Transport Details" icon={Car}>
                <DetailItem label="Vehicle Type" value={transportDetails.vehicle_type} icon={Car} highlight valueClassName={infoText} />
                <DetailItem label="Capacity" value={transportDetails.capacity_passengers ? `${transportDetails.capacity_passengers} passengers` : null} icon={Users} />
                <DetailItem label="Route/Area" value={transportDetails.route_details} icon={RouteIcon} />
                <DetailItem label="Driver" value={transportDetails.driver_included === true ? "Included" : (transportDetails.driver_included === false ? "Not Included" : "N/A")} icon={UserCheck} />
              </DetailSection>

              <DetailSection id="pricing" title="Pricing Information" icon={IndianRupee}>
                {service.price_numeric ? (
                  <DetailItem label="Base Price" value={`₹${service.price_numeric.toLocaleString("en-IN")}`} highlight valueClassName={successText} />
                ) : (
                  <DetailItem label="Price" value={service.price_details || "Contact provider for pricing"} highlight valueClassName={infoText} />
                )}
                {transportDetails.price_per_km && <DetailItem label="Per KM" value={`₹${transportDetails.price_per_km.toLocaleString("en-IN")}`} valueClassName={successText} />}
                {transportDetails.price_per_trip && <DetailItem label="Per Trip" value={`₹${transportDetails.price_per_trip.toLocaleString("en-IN")}`} valueClassName={successText} />}
                {service.price_details && service.price_details !== String(service.price_numeric) && (
                  <DetailItem label="Additional Notes" value={service.price_details} icon={Info} />
                )}
              </DetailSection>

              {generalAmenities.length > 0 && (
                <DetailSection id="features" title="Features & Amenities" icon={CheckCircle}>
                  <ul className={`list-disc list-inside text-sm ${neutralTextLight} grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 marker:${successIconColor}`}>
                    {generalAmenities.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
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
              <h3 className={`text-xl font-semibold ${neutralText} mb-2`}>Service Price</h3>
              <p className={`text-3xl md:text-4xl font-bold ${successText} mb-1.5`}>
                <IndianRupee className={`inline h-6 md:h-7 w-6 md:w-7 mr-0.5 ${successIconColor}`} />
                {service.price_numeric ? service.price_numeric.toLocaleString("en-IN") : (service.price_details || "Contact")}
              </p>
              <p className={`text-xs ${neutralTextLight} mb-5`}>
                {service.price_numeric ? (transportDetails.price_per_km ? "(per km, indicative)" : (transportDetails.price_per_trip ? "(per trip, indicative)" : "(indicative base price)")) : "(contact for details)"}
              </p>

              <Link
                href={`/booking/new?serviceType=transport&serviceId=${service.id}`} // Example booking link
                className={`${buttonPrimaryStyle} w-full text-base py-3`}
              >
                Book Now / Enquire
              </Link>
              <p className={`text-xs ${neutralTextLight} mt-3 text-center`}>Contact us for custom quotes or questions!</p>

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

export default TransportServiceDetailPage;
