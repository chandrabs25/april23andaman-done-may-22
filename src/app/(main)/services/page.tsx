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
  // primaryButtonBg, // Keep for focus ring logic if not directly provided by theme button styles // This line was the duplicate, removing it. The first primaryButtonBg import is kept.
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
  buttonSecondaryStyleHero, // Using Hero for secondary actions like "Clear Filters"
  infoIconColor, // For section heading icons if desired
  infoText,      // For general info text
  successText, // For prices if they should be highlighted
  successIconColor,
} from "@/styles/26themeandstyle";
// --- End Common Styles Import ---

// --- Page-specific Category Colors (Retained for visual distinction) ---
const transportCategoryColor = "#3B82F6"; // Blue-500
const rentalCategoryColor = "#F59E0B";    // Amber-500
const activityCategoryColor = "#EC4899";  // Pink-500
// --- End Category Colors ---

// --- Helper Components (Styled with Imported Theme) ---
const LoadingSpinner = ({ text }: { text: string }) => (
  <div className={`flex flex-col justify-center items-center py-16 ${sectionPadding}`}>
    <Loader2 className={`h-12 w-12 animate-spin ${infoIconColor} mb-4`} />
    <span className={`text-lg font-medium ${infoText}`}>{text}</span>
  </div>
);

const ErrorDisplay = ({ message, onRetry }: { message?: string, onRetry?: () => void }) => (
  <div className={`flex flex-col justify-center items-center py-16 text-center p-6 rounded-2xl ${errorBg} border ${errorBorder} ${sectionPadding}`}>
    <AlertTriangle className={`h-12 w-12 ${errorIconColor} mb-4`} />
    <span className={`text-lg font-medium ${errorText}`}>Oops! Something went wrong.</span>
    <p className={`text-sm ${neutralTextLight} mt-2`}>{message || "Failed to load services."}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`mt-6 ${buttonSecondaryStyleHero} text-sm py-2 px-4 border-red-300 text-red-600 hover:bg-red-100`} // Error specific secondary button
      >
        Try Again
      </button>
    )}
  </div>
);

interface ServiceCardProps {
  service: CategorizedService;
  categoryColor: string; // Retained for the small tag, but card itself is themed
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, categoryColor }) => {
  const [imgError, setImgError] = useState(false);

  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder_service.jpg"; // Generic placeholder
    if (imgError || !url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    // Assuming images are in public/images or served from an external URL
    return url.startsWith("http") || url.startsWith("/") ? url : `/images/${url}`;
  };

  const imageUrl = normalizeImageUrl(service.images?.[0]);
  const rating = service.rating || null;

  const getSpecificsData = (svc: CategorizedService) => {
    if (svc.amenities && typeof svc.amenities === 'string') {
      try { return JSON.parse(svc.amenities)?.specifics || null; } 
      catch (e) { console.error("Failed to parse amenities JSON for specifics:", e); }
    } else if (typeof svc.amenities === 'object' && svc.amenities !== null) {
      return (svc.amenities as any).specifics || null;
    }
    return null;
  };

  const getPriceDisplay = (svc: CategorizedService) => {
    if (svc.price_details) return svc.price_details;
    const specifics = getSpecificsData(svc);
    if (svc.service_category === "transport") {
      const ts = specifics?.transport;
      if (ts?.price_per_trip) return `₹${Number(ts.price_per_trip).toLocaleString("en-IN")} per trip`;
      if (ts?.price_per_km) return `₹${Number(ts.price_per_km).toLocaleString("en-IN")} per km`;
    } else if (svc.service_category === "rental") {
      const rs = specifics?.rental;
      if (rs?.unit && svc.price_numeric) return `₹${svc.price_numeric.toLocaleString("en-IN")} ${rs.unit}`;
    }
    return svc.price_numeric ? `₹${svc.price_numeric.toLocaleString("en-IN")} (approx)` : "Price on request";
  };

  const priceDisplay = getPriceDisplay(service);

  const handleImageError = () => {
    if (!imgError) setImgError(true);
  };

  let detailPath = "";
  if (service.service_category === "transport") detailPath = `/services/transport/${service.id}`;
  else if (service.service_category === "rental") detailPath = `/services/rental/${service.id}`;
  else if (service.service_category === "activity") detailPath = `/activities/${service.id}`;

  const getAdditionalDetails = () => {
    const specifics = getSpecificsData(service);
    const iconClass = `mr-1.5 flex-shrink-0 ${neutralIconColor}`;
    const textClass = `text-xs ${neutralTextLight}`;

    if (service.service_category === "transport") {
      const ts = specifics?.transport;
      return (
        <div className={`flex flex-wrap items-center ${textClass} mb-2 gap-x-3 gap-y-1`}>
          {ts?.vehicle_type && <div className="flex items-center"><Car size={14} className={iconClass} /><span>{ts.vehicle_type}</span></div>}
          {ts?.capacity_passengers && <div className="flex items-center"><Users size={14} className={iconClass} /><span>{ts.capacity_passengers} passengers</span></div>}
        </div>
      );
    } else if (service.service_category === "rental") {
      const rs = specifics?.rental;
      return (
        <div className={`flex flex-wrap items-center ${textClass} mb-2 gap-x-3 gap-y-1`}>
          {service.item_type && <div className="flex items-center"><ShoppingBag size={14} className={iconClass} /><span>{service.item_type}</span></div>}
          {rs?.unit && <div className="flex items-center"><Clock size={14} className={iconClass} /><span>{rs.unit}</span></div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${cardBaseStyle} flex flex-col overflow-hidden group p-0 hover:shadow-xl transition-shadow duration-300`}> {/* p-0 from cardBaseStyle, apply padding internally */}
      <div className={`h-52 w-full relative flex-shrink-0 ${neutralBgLight}`}>
        <Image
          src={imageUrl}
          alt={service.name || "Service Image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={handleImageError}
        />
        {imageUrl === "/images/placeholder_service.jpg" && (
          <div className={`absolute inset-0 flex items-center justify-center ${neutralBgLight}/80 pointer-events-none`}>
            <ImageOff size={36} className={`${neutralIconColor} opacity-50`} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div style={{ backgroundColor: categoryColor }} className={`absolute top-3 right-3 text-white text-xs font-semibold py-1 px-2.5 rounded-md shadow-lg flex items-center`}>
          {service.service_category === "transport" ? <Car size={12} className="mr-1" /> : service.service_category === "rental" ? <ShoppingBag size={12} className="mr-1" /> : <Tag size={12} className="mr-1" />}
          {(service.type || service.service_category || "").replace(/^(transport_|rental_|activity_)/, '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <h3 className={`text-lg font-semibold leading-tight ${neutralText} line-clamp-2 mb-1.5 group-hover:${infoText} transition-colors`}>{service.name}</h3>

        <div className={`flex items-center text-xs ${neutralTextLight} mb-2`}>
          <MapPin size={14} className={`mr-1.5 flex-shrink-0 ${neutralIconColor}`} />
          <span className="truncate">{service.island_name}</span>
          {service.provider?.business_name && <span className={`mx-1.5 ${neutralBorderLight}`}>|</span>}
          {service.provider?.business_name && <span className={`truncate ${neutralTextLight}`}>By: {service.provider.business_name}</span>}
        </div>

        {getAdditionalDetails()}

        <p className={`${neutralTextLight} text-sm mb-3 line-clamp-3 flex-grow`}>
          {service.description || "Reliable service for your travel needs."}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className={`text-lg font-semibold ${successText}`}>
            <IndianRupee size={16} className={`mr-0.5 inline-block ${successIconColor}`} /> {priceDisplay}
          </div>
          {rating !== null && (
            <div className="flex items-center">
              <Star size={16} fill="currentColor" className="text-yellow-400" />
              <span className={`ml-1.5 font-medium ${neutralText}`}>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {detailPath && (
          <Link
            href={detailPath}
            className={`mt-auto block w-full text-center ${buttonPrimaryStyle} text-sm py-2.5`}
          >
            View Details <ArrowRight size={16} className="ml-1.5 inline-block" />
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
  // Define input styles using theme variables
  const focusRingClass = `focus:ring-${primaryButtonBg.split('-')[1] || 'gray'}-${primaryButtonBg.split('-')[2] || '500'}`;
  const focusBorderClass = `focus:border-${primaryButtonBg.split('-')[1] || 'gray'}-${primaryButtonBg.split('-')[2] || '500'}`;
  const inputBaseStyle = `w-full p-3 text-base ${neutralText} bg-white border ${neutralBorder} rounded-lg focus:outline-none focus:ring-2 ${focusRingClass} ${focusBorderClass} transition-shadow shadow-sm hover:border-gray-400`;
  const labelBaseStyle = `block text-sm font-medium ${neutralText} mb-1.5`;


  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [forceRefetch, setForceRefetch] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(handler);
  }, [filters]);

  const apiUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append("category", "transport,rental,activity"); // Fetch all categories
    if (debouncedFilters.search) params.append("search", debouncedFilters.search);
    if (debouncedFilters.islandId) params.append("islandId", debouncedFilters.islandId);
    return `/api/services-main?${params.toString()}${forceRefetch ? `&_cacheBust=${forceRefetch}` : ''}`;
  }, [debouncedFilters, forceRefetch]);

  const { data: apiResponse, error, status } = useFetch<PaginatedServicesResponse | CategorizedService[]>(apiUrl());

  const refetchData = useCallback(() => setForceRefetch(prev => prev + 1), []);

  let allServices: CategorizedService[] = [];
  if (apiResponse) {
    allServices = (Array.isArray(apiResponse) ? apiResponse : apiResponse.data || [])
      .map(service => { // Ensure service_category is present
        const svc = service as any;
        if (!svc.service_category) {
          if (svc.type?.startsWith('transport')) return { ...svc, service_category: 'transport' };
          if (svc.type?.startsWith('rental')) return { ...svc, service_category: 'rental' };
          if (svc.type?.startsWith('activity')) return { ...svc, service_category: 'activity' };
        }
        return svc;
      }) as CategorizedService[];
  }

  const isLoading = status === "loading";
  const fetchError = status === "error" ? error : null;

  // Filter after ensuring all services are categorized
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
    // Potentially fetch these from an API in the future
  ];

  const renderServiceSection = (title: string, services: CategorizedService[], icon: React.ElementType, color: string, sectionId: string) => (
    <section id={sectionId} className="mb-12 md:mb-16 scroll-mt-20"> {/* Added scroll-mt for sticky header */}
      <h2 className={`${sectionHeadingStyle} text-2xl md:text-3xl`}>
        {React.createElement(icon, { size: 26, className: `mr-3 ${infoIconColor}` })} {/* Using infoIconColor for section icons */}
        {title}
      </h2>
      {isLoading && services.length === 0 && <LoadingSpinner text={`Loading ${title.toLowerCase()}...`} />}
      {fetchError && !isLoading && services.length === 0 && (
        <ErrorDisplay message={`Could not load ${title.toLowerCase()}. ${fetchError.message}`} onRetry={refetchData} />
      )}
      {!isLoading && !fetchError && services.length === 0 && (
        <div className={`${neutralBg} rounded-xl p-8 text-center border ${neutralBorder}`}>
          <p className={`${neutralTextLight} text-lg`}>No {title.toLowerCase()} found matching your current filters.</p>
        </div>
      )}
      {!isLoading && !fetchError && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {services.map(service => (
            <ServiceCard key={`${service.service_category}-${service.id}`} service={service} categoryColor={color} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <>
      {/* Hero Section - Themed */}
      <div className={`${neutralBgLight} border-b ${neutralBorderLight}`}>
        <div className={`container mx-auto px-4 ${sectionPadding} text-center`}>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${neutralText} mb-4`}>
            Services & Activities
          </h1>
          <p className={`text-lg sm:text-xl ${neutralTextLight} max-w-3xl mx-auto`}>
            Discover reliable transport, convenient rentals, and exciting activities for your perfect Andaman adventure. Your seamless journey starts here.
          </p>
        </div>
      </div>

      {/* Main Content Area - Using neutralBgLight for the page, cards will be white */}
      <div className={`${neutralBgLight} ${sectionPadding}`}>
        <div className="container mx-auto px-4">
          {isLoading && allServices.length === 0 && (
            <div className="text-center mb-10"><LoadingSpinner text="Loading all services..." /></div>
          )}
          {fetchError && !isLoading && allServices.length === 0 && (
            <div className="mb-10"><ErrorDisplay message={`Failed to load services. ${fetchError.message}`} onRetry={refetchData}/></div>
          )}

          {/* Filters Section - Themed as a card */}
          <div className={`${cardBaseStyle} p-5 md:p-6 mb-10 md:mb-12 shadow-lg`}>
            <div className="flex items-center mb-5">
              <ListFilter size={22} className={`mr-2.5 ${infoIconColor}`} />
              <h3 className={`text-xl font-semibold ${neutralText}`}>Filter Services</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 items-end">
              <div>
                <label htmlFor="search" className={labelBaseStyle}>Search by Name or Type</label>
                <div className="relative mt-1">
                  <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={18} />
                  <input
                    type="text" id="search" name="search"
                    value={filters.search} onChange={handleFilterChange}
                    placeholder="e.g., Airport Cab, Scooter"
                    className={`${inputBaseStyle} pl-11`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="islandId" className={labelBaseStyle}>Filter by Island</label>
                <select
                  id="islandId" name="islandId"
                  value={filters.islandId} onChange={handleFilterChange}
                  className={`${inputBaseStyle} appearance-none bg-no-repeat`} // Basic select styling, can be enhanced
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  {islandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {!isLoading && !fetchError && allServices.length === 0 && filtersApplied(debouncedFilters) && (
            <div className={`${neutralBg} rounded-xl p-8 text-center border ${neutralBorder} shadow-md mb-10`}>
              <p className={`text-xl ${neutralText} mb-3`}>No Services Found</p>
              <p className={`${neutralTextLight} mb-5`}>No services matched your current filter criteria. Please try adjusting your search.</p>
              <button
                onClick={() => setFilters({ search: "", islandId: "" })}
                className={`${buttonSecondaryStyleHero} bg-white hover:bg-gray-100 text-gray-700 border-gray-300`}
              >
                Clear All Filters
              </button>
            </div>
          )}
          
          {(!isLoading || allServices.length > 0) && (
            <>
              {renderServiceSection("Transport Services", transportServices, Car, transportCategoryColor, "transport")}
              {renderServiceSection("Rental Services", rentalServices, ShoppingBag, rentalCategoryColor, "rental")}
              {renderServiceSection("Activity Services", activityServices, Tag, activityCategoryColor, "activity")}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const filtersApplied = (filters?: { search: string, islandId: string }) => {
  if (!filters) return false; // Should not happen if debouncedFilters is initialized
  return filters.search !== "" || filters.islandId !== "";
};


export default function ServicesMainPage() {
  return <ServicesMainPageContent />;
}
