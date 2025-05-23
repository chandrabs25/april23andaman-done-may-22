"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  AlertTriangle,
  MapPin,
  Clock,
  Star,
  // Filter, // Replaced by ListFilter
  Search,
  Car,
  // Bike, // Not used in this specific version, but kept for lucide-react imports
  // Ship, // Not used in this specific version, but kept for lucide-react imports
  ShoppingBag,
  IndianRupee,
  ArrowRight,
  Users,
  ListFilter, // Using this for filter icon
  // ShieldCheck, // Not used in this specific version, but kept for lucide-react imports
  Tag,
  ImageOff // For image error placeholder
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import type {
  CategorizedService,
  TransportService,
  RentalService,
  ActivityService,
  PaginatedServicesResponse,
  // SingleServiceResponse // Not used directly here
} from "@/types/transport_rental";

// --- Import Common Styles (from the shared theme.ts file) ---
import {
  primaryButtonBg, // For focus rings and potentially some highlights
  // primaryButtonHoverBg, // Included in buttonPrimaryStyle
  // primaryButtonText, // Included in buttonPrimaryStyle
  // secondaryButtonBg, // Included in buttonSecondaryStyle
  // secondaryButtonHoverBg, // Included in buttonSecondaryStyle
  // secondaryButtonText, // Included in buttonSecondaryStyle
  // secondaryButtonBorder, // Included in buttonSecondaryStyle
  errorBg,
  errorBorder,
  errorText,
  errorIconColor,
  neutralBgLight,
  neutralBorderLight,
  neutralBg, // For image placeholders etc.
  neutralBorder,
  neutralText,
  neutralTextLight,
  neutralIconColor,
  sectionPadding, // For consistency if needed, though this page has its own structure
  cardBaseStyle, // For filter section and potentially individual cards
  sectionHeadingStyle, // For section titles
  buttonPrimaryStyle, // For main call-to-action buttons
  buttonSecondaryStyle, // For secondary actions like "Clear Filters"
} from "@/styles/theme";
// --- End Common Styles Import ---

// --- Page-specific Category Colors (Retained for visual distinction) ---
const transportCategoryColor = "#3B82F6"; // Blue-500
const rentalCategoryColor = "#F59E0B";    // Amber-500
const activityCategoryColor = "#EC4899";  // Pink-500
// --- End Category Colors ---

// --- Helper Components (Styled with Imported Theme) ---
const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex flex-col justify-center items-center py-16">
    <Loader2 className={`h-10 w-10 animate-spin ${neutralIconColor} mb-4`} />
    <span className={`text-lg font-medium ${neutralText}`}>{text}</span>
  </div>
);

const ErrorDisplay = ({ message, onRetry }: { message?: string, onRetry?: () => void }) => (
  <div className={`flex flex-col justify-center items-center py-16 text-center p-6 rounded-2xl ${errorBg} border ${errorBorder}`}>
    <AlertTriangle className={`h-10 w-10 ${errorIconColor} mb-4`} />
    <span className={`text-lg font-medium ${errorText}`}>Oops! Something went wrong.</span>
    <p className={`text-sm ${neutralTextLight} mt-2`}>{message || "Failed to load services."}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`mt-4 ${buttonSecondaryStyle}`} // Using shared button style
      >
        Try Again
      </button>
    )}
  </div>
);

interface ServiceCardProps {
  service: CategorizedService;
  categoryColor: string; // Keep for tag and potentially icon accents
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, categoryColor }) => {
  const [imgError, setImgError] = useState(false);

  // Normalize image URL and provide a fallback
  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder_service.jpg";
    if (imgError || !url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
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

  const imageUrl = normalizeImageUrl(service.images?.[0]);
  const rating = service.rating || null;

  const getSpecificsData = (service: CategorizedService) => {
    if (service.amenities && typeof service.amenities === 'string') {
      try {
        const amenitiesData = JSON.parse(service.amenities);
        return amenitiesData?.specifics || null;
      } catch (e) {
        console.error("Failed to parse amenities JSON for specifics:", e);
      }
    } else if (typeof service.amenities === 'object' && service.amenities !== null) {
      return (service.amenities as any).specifics || null;
    }
    return null;
  };

  const getPriceDisplay = (service: CategorizedService) => {
    if (service.price_details) return service.price_details;
    const specifics = getSpecificsData(service);

    if (service.service_category === "transport") {
      const ts = specifics?.transport;
      if (ts?.price_per_trip) return `₹${Number(ts.price_per_trip).toLocaleString("en-IN")} per trip`;
      if (ts?.price_per_km) return `₹${Number(ts.price_per_km).toLocaleString("en-IN")} per km`;
    } else if (service.service_category === "rental") {
      const rs = specifics?.rental;
      if (rs?.unit && service.price_numeric) return `₹${service.price_numeric.toLocaleString("en-IN")} ${rs.unit}`;
    }
    return service.price_numeric ? `₹${service.price_numeric.toLocaleString("en-IN")} (approx)` : "Price on request";
  };

  const priceDisplay = getPriceDisplay(service);

  const handleImageError = () => {
    if (!imgError) { // Prevent infinite loops if placeholder also fails, though unlikely
      console.log("Image failed to load, attempting placeholder:", service.images?.[0]);
      setImgError(true);
    }
  };

  let detailPath = "";
  if (service.service_category === "transport") detailPath = `/services/transport/${service.id}`;
  else if (service.service_category === "rental") detailPath = `/services/rental/${service.id}`;
  else if (service.service_category === "activity") detailPath = `/activities/${service.id}`; // Assuming this path

  const getAdditionalDetails = () => {
    const specifics = getSpecificsData(service);
    const iconClass = `mr-1 flex-shrink-0 ${neutralIconColor}`; // Using neutralIconColor

    if (service.service_category === "transport") {
      const ts = specifics?.transport;
      return (
        <div className={`flex items-center text-xs ${neutralTextLight} mb-2 gap-x-3`}>
          {ts?.vehicle_type && (
            <div className="flex items-center">
              <Car size={12} className={iconClass} /> <span>{ts.vehicle_type}</span>
            </div>
          )}
          {ts?.capacity_passengers && (
            <div className="flex items-center">
              <Users size={12} className={iconClass} /> <span>{ts.capacity_passengers} passengers</span>
            </div>
          )}
        </div>
      );
    } else if (service.service_category === "rental") {
      const rs = specifics?.rental;
      return (
        <div className={`flex items-center text-xs ${neutralTextLight} mb-2 gap-x-3`}>
          {service.item_type && ( // item_type is often directly on service for rentals
            <div className="flex items-center">
              <ShoppingBag size={12} className={iconClass} /> <span>{service.item_type}</span>
            </div>
          )}
          {rs?.unit && (
            <div className="flex items-center">
              <Clock size={12} className={iconClass} /> <span>{rs.unit}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Using cardBaseStyle for the card itself for consistency
  return (
    <div className={`${cardBaseStyle} flex flex-col overflow-hidden p-0`}> {/* Remove padding from base style for custom internal padding */}
      <div className="h-48 w-full relative flex-shrink-0">
        <Image
          src={imageUrl}
          alt={service.name || "Service Image"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={handleImageError}
          priority={false} // Non-priority for cards
        />
        {imageUrl === "/images/placeholder_service.jpg" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 pointer-events-none">
            <ImageOff size={32} className={`${neutralIconColor} opacity-60`} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div> {/* Subtle gradient for text readability */}
        <div style={{ backgroundColor: categoryColor }} className={`absolute top-3 right-3 text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-md flex items-center`}>
          {service.service_category === "transport" ? <Car size={12} className="mr-1" /> : service.service_category === "rental" ? <ShoppingBag size={12} className="mr-1" /> : <Tag size={12} className="mr-1" />}
          {(service.type || "").replace(/^(transport_|rental_|activity_)/, '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow"> {/* Re-apply padding here */}
        <h3 className={`text-md font-semibold leading-tight ${neutralText} line-clamp-2 mb-1`}>{service.name}</h3>

        <div className={`flex items-center text-xs ${neutralTextLight} mb-2`}>
          <MapPin size={12} className={`mr-1 flex-shrink-0 ${neutralIconColor}`} />
          <span>{service.island_name}</span>
          {service.provider?.business_name && <span className="mx-1.5 text-gray-300">|</span>}
          {service.provider?.business_name && <span className={`line-clamp-1 ${neutralTextLight}`}>By: {service.provider.business_name}</span>}
        </div>

        {getAdditionalDetails()}

        <p className={`${neutralTextLight} text-xs mb-3 line-clamp-2 flex-grow`}>
          {service.description || "Reliable service for your travel needs."}
        </p>

        <div className="flex justify-between items-center mb-3 text-xs">
          <div className={`flex items-center font-semibold ${neutralText}`}> {/* Price color changed to neutralText */}
            <IndianRupee size={14} className="mr-0.5" /> {priceDisplay}
          </div>
          {rating !== null && (
            <div className="flex items-center text-yellow-500"> {/* Standard yellow for ratings */}
              <Star size={14} fill="currentColor" className="text-yellow-400" />
              <span className={`ml-1 font-medium ${neutralText}`}>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {detailPath && (
          <Link
            href={detailPath}
            className={`mt-auto block w-full text-center ${buttonPrimaryStyle} text-sm py-2.5`} // Using shared primary button style
          >
            View Details <ArrowRight size={14} className="ml-1 inline-block" />
          </Link>
        )}
      </div>
    </div>
  );
};
// --- End Helper Components ---


// --- Main Component Logic ---
function ServicesMainPageContent() {
  const [filters, setFilters] = useState({ search: "", islandId: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [forceRefetch, setForceRefetch] = useState(0); // For manual refetch

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(handler);
  }, [filters]);

  const apiUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append("category", "transport,rental,activity");
    if (debouncedFilters.search) params.append("search", debouncedFilters.search);
    if (debouncedFilters.islandId) params.append("islandId", debouncedFilters.islandId);
    // Add forceRefetch to cache-bust if needed
    return `/api/services-main?${params.toString()}${forceRefetch ? `&_cacheBust=${forceRefetch}` : ''}`;
  }, [debouncedFilters, forceRefetch]);

  const { data: apiResponse, error, status } = useFetch<PaginatedServicesResponse | CategorizedService[]>(apiUrl());

  console.log("🔍 ServicesMainPage: Raw API response:", apiResponse);

  const refetchData = useCallback(() => {
    setForceRefetch(prev => prev + 1);
  }, []);

  let allServices: CategorizedService[] = [];
  if (apiResponse) {
    allServices = (Array.isArray(apiResponse) ? apiResponse : apiResponse.data || [])
      .map(service => {
        const svc = service as any;
        if (!svc.service_category) {
          if (svc.type?.startsWith('transport')) return { ...svc, service_category: 'transport' };
          if (svc.type?.startsWith('rental')) return { ...svc, service_category: 'rental' };
          if (svc.type?.startsWith('activity')) return { ...svc, service_category: 'activity' };
        }
        return svc;
      }) as CategorizedService[];
  }

  console.log(`🔍 ServicesMainPage: Processed ${allServices.length} services.`);

  const isLoading = status === "loading";
  const fetchError = status === "error" ? error : null;

  const transportServices = allServices.filter(s => s?.service_category === "transport") as TransportService[];
  const rentalServices = allServices.filter(s => s?.service_category === "rental") as RentalService[];
  const activityServices = allServices.filter(s => s?.service_category === "activity") as ActivityService[];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const islandOptions = [
    { value: "", label: "All Islands" },
    { value: "1", label: "Havelock Island (Swaraj Dweep)" },
    { value: "2", label: "Neil Island (Shaheed Dweep)" },
    { value: "3", label: "Port Blair" },
  ];

  const renderServiceSection = (title: string, services: CategorizedService[], icon: React.ElementType, color: string) => (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        {React.createElement(icon, { size: 28, className: `mr-3 ${neutralIconColor}` })} {/* Icon color to neutral */}
        <h2 className={`text-2xl font-bold ${neutralText}`}>{title}</h2> {/* Title text to neutral */}
      </div>
      {isLoading && services.length === 0 && <LoadingSpinner text={`Loading ${title.toLowerCase()}...`} />} {/* Show spinner only if this section has no data yet and still loading */}
      {fetchError && !isLoading && services.length === 0 && (
        <ErrorDisplay
          message={`Could not load ${title.toLowerCase()}. ${fetchError.message}`}
          onRetry={refetchData}
        />
      )}
      {!isLoading && !fetchError && services.length === 0 && (
        <div className={`bg-white rounded-lg p-8 text-center shadow-sm border ${neutralBorderLight}`}>
          <p className={`${neutralTextLight}`}>No {title.toLowerCase()} found matching your criteria.</p>
        </div>
      )}
      {!isLoading && !fetchError && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map(service => (
            <ServiceCard key={`${service.service_category}-${service.id}`} service={service} categoryColor={color} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <>
      {/* Hero Section - Using neutral theme */}
      <div className={`${neutralBgLight} border-b ${neutralBorderLight}`}>
        <div className={`container mx-auto px-4 py-16 md:py-24 text-center`}>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${neutralText} mb-4`}>
            Services & Activities
          </h1>
          <p className={`text-lg sm:text-xl ${neutralTextLight} max-w-2xl mx-auto`}>
            Discover reliable transport, convenient rentals, and exciting activities for your perfect Andaman adventure.
          </p>
        </div>
      </div>

      {/* Main Content Area - Using white background */}
      <div className={`bg-white py-10 md:py-12`}>
        <div className="container mx-auto px-4">
          {/* Overall status indicator for initial load */}
          {isLoading && allServices.length === 0 && (
            <div className="text-center mb-8">
              <LoadingSpinner text="Loading all services..." />
            </div>
          )}

          {fetchError && !isLoading && allServices.length === 0 && (
            <div className="mb-8">
              <ErrorDisplay
                message={`Failed to load services. ${fetchError.message}`}
                onRetry={refetchData}
              />
            </div>
          )}

          {/* Filters Section - Styled as a card */}
          <div className={`${cardBaseStyle} p-5 md:p-6 mb-10`}>
            <div className="flex items-center mb-4">
              <ListFilter size={20} className={`mr-2 ${neutralIconColor}`} />
              <h3 className={`text-lg font-semibold ${neutralText}`}>Filter Services</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="search" className={`block text-xs font-medium ${neutralTextLight} mb-1`}>Search by Name</label>
                <div className="relative">
                  <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 ${neutralIconColor} opacity-70`} />
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="e.g., Airport Cab, Scooter Rental"
                    className={`w-full pl-8 pr-3 py-2 border ${neutralBorder} rounded-md shadow-sm focus:ring-2 focus:ring-[${primaryButtonBg}] focus:border-[${primaryButtonBg}] text-sm ${neutralText} placeholder-${neutralTextLight}`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="islandId" className={`block text-xs font-medium ${neutralTextLight} mb-1`}>Island</label>
                <select
                  id="islandId"
                  name="islandId"
                  value={filters.islandId}
                  onChange={handleFilterChange}
                  className={`w-full py-2 px-3 border ${neutralBorder} bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${primaryButtonBg}] focus:border-[${primaryButtonBg}] text-sm ${neutralText}`}
                >
                  {islandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {!isLoading && !fetchError && allServices.length === 0 && filtersApplied() && (
            <div className={`text-center py-10 bg-white rounded-xl shadow-md border ${neutralBorderLight} mb-8`}>
              <p className={`text-lg ${neutralText}`}>No services found matching your search criteria.</p>
              <button
                onClick={() => setFilters({ search: "", islandId: "" })}
                className={`mt-4 ${buttonSecondaryStyle}`}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Conditional rendering to prevent sections from showing "no services" if global loading is active and no services are yet fetched */}
          {(!isLoading || allServices.length > 0) && (
            <>
              {renderServiceSection("Transport Services", transportServices, Car, transportCategoryColor)}
              {renderServiceSection("Rental Services", rentalServices, ShoppingBag, rentalCategoryColor)}
              {renderServiceSection("Activity Services", activityServices, Tag, activityCategoryColor)}
            </>
          )}
        </div>
      </div>
    </>
  );
}
// Helper to check if any filters are active
const filtersApplied = (filters?: { search: string, islandId: string }) => {
  if (!filters) return false;
  return filters.search !== "" || filters.islandId !== "";
};


export default function ServicesMainPage() {
  return <ServicesMainPageContent />;
}
