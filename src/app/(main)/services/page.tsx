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
  Search,
  Car,
  ShoppingBag,
  IndianRupee,
  ArrowRight,
  Users,
  ListFilter,
  Tag,
  ImageOff,
  ChevronDown,
  X,
  Heart,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Quote,
  Phone,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import type {
  CategorizedService,
  TransportService,
  RentalService,
  PaginatedServicesResponse,
} from "@/types/transport_rental";

// --- Define Common Styles (Same as packages page) ---
const primaryButtonBg = 'bg-gray-800';
const primaryButtonHoverBg = 'hover:bg-gray-700';
const primaryButtonText = 'text-white';

const infoBg = 'bg-blue-50';
const infoBorder = 'border-blue-100';
const infoText = 'text-blue-800';
const infoIconColor = 'text-blue-600';

const successBg = 'bg-green-50';
const successBorder = 'border-green-100';
const successText = 'text-green-800';
const successIconColor = 'text-green-600';

const warningBg = 'bg-orange-50';
const warningBorder = 'border-orange-100';
const warningText = 'text-orange-800';
const warningIconColor = 'text-orange-600';

const errorBg = 'bg-red-50';
const errorBorder = 'border-red-100';
const errorText = 'text-red-800';
const errorIconColor = 'text-red-600';

const tipBg = 'bg-yellow-50';
const tipBorder = 'border-yellow-100';
const tipText = 'text-yellow-800';
const tipIconColor = 'text-yellow-700';

const neutralBgLight = 'bg-gray-50';
const neutralBorderLight = 'border-gray-100';
const neutralBg = 'bg-gray-100';
const neutralBorder = 'border-gray-200';
const neutralText = 'text-gray-800';
const neutralTextLight = 'text-gray-600';
const neutralIconColor = 'text-gray-600';

const sectionPadding = "py-16 md:py-24";
const sectionHeadingStyle = `text-2xl md:text-3xl font-bold ${neutralText}`;
const cardBaseStyle = `bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.03] border ${neutralBorderLight} h-full group`;
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`;
const cardLinkStyle = `inline-flex items-center ${neutralText} hover:text-gray-800 font-medium text-sm group mt-auto pt-2 border-t ${neutralBorderLight} px-1`;

// --- Page-specific Category Colors ---
const transportCategoryColor = "#3B82F6"; // Blue-500
const rentalCategoryColor = "#F59E0B";    // Amber-500

// --- LoadingSpinner Component ---
const LoadingSpinner = ({ message = "Loading Services..." }: { message?: string }) => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] text-center py-20">
    <div className="relative w-16 h-16">
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${neutralBorder} rounded-full`}></div>
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${primaryButtonBg} rounded-full border-t-transparent animate-spin`}></div>
    </div>
    <span className={`mt-4 text-lg ${neutralText} font-medium`}>{message}</span>
  </div>
);

// --- Filter Tag Component ---
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => (
  <div className={`inline-flex items-center ${tipBg} ${tipText} text-xs font-medium py-1 pl-3 pr-1.5 rounded-full mr-2 mb-2 border ${tipBorder}`}>
    {label}
      <button
      onClick={onRemove}
      className={`ml-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full p-0.5 transition-colors`}
      aria-label={`Remove ${label} filter`}
      >
      <X size={12} />
      </button>
  </div>
);

// --- Service Card Component ---
interface ServiceCardProps {
  service: CategorizedService;
  categoryColor: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, categoryColor }) => {
  const [imgError, setImgError] = useState(false);

  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder.jpg";
    if (imgError || !url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    return url.startsWith("http") || url.startsWith("/") ? url : `/images/${url}`;
  };

  const imageUrl = normalizeImageUrl(service.images?.[0]);

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
    return svc.price_numeric ? `₹${svc.price_numeric.toLocaleString("en-IN")}` : "Price on request";
  };

  const priceDisplay = getPriceDisplay(service);
  const handleImageError = () => { if (!imgError) setImgError(true); };

  let detailPath = "";
  if (service.service_category === "transport") detailPath = `/services/transport/${service.id}`;
  else if (service.service_category === "rental") detailPath = `/services/rental/${service.id}`;

  // Create service features similar to packages
  const serviceFeatures = [
    service.service_category === "transport" ? "Transport Service" : "Rental Service",
    service.island_name || "Available Island-wide",
    "Professional Service"
  ].slice(0, 3);

  return (
    <div className={cardBaseStyle}>
      <div className="h-52 w-full relative flex-shrink-0 overflow-hidden">
        <Image
            src={imageUrl}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
            onError={handleImageError}
          />
        
        {imageUrl === "/images/placeholder.jpg" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 pointer-events-none">
            {service.service_category === "transport" ? <Car size={36} className="text-gray-400 opacity-50" /> :
             service.service_category === "rental" ? <ShoppingBag size={36} className="text-gray-400 opacity-50" /> :
             <Tag size={36} className="text-gray-400 opacity-50" />}
            </div>
          )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className={`absolute top-3 right-3 ${primaryButtonBg} ${primaryButtonText} text-sm font-bold py-1.5 px-3 rounded-full shadow-md flex items-center`}>
          <IndianRupee size={12} className="mr-0.5" />
          {service.price_numeric ? service.price_numeric.toLocaleString("en-IN") : "Contact"}
            </div>
        
        <div className={`absolute bottom-3 left-3 bg-white/90 ${neutralText} text-xs font-medium py-1.5 px-3 rounded-full flex items-center backdrop-blur-sm border ${neutralBorderLight}`}>
          <MapPin size={12} className="mr-1.5" />
          {service.island_name || 'Multiple Locations'}
        </div>

        <button className={`absolute top-3 left-3 bg-white/90 ${neutralTextLight} hover:text-red-500 p-2 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300 border ${neutralBorderLight}`}>
          <Heart size={16} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-lg font-semibold leading-tight mb-2 ${neutralText} line-clamp-2`}>{service.name}</h3>
        <p className={`${neutralTextLight} text-sm mb-3 line-clamp-2 flex-grow`}>
          {service.description || 'Professional service with quality equipment and experienced staff for your Andaman adventure.'}
        </p>
        
        <div className="mb-3 space-y-1">
          {serviceFeatures.map((feature: string, index: number) => (
            <div key={index} className={`flex items-center ${neutralTextLight} text-xs`}>
              <div className={`w-3 h-3 rounded-full ${neutralBg} flex items-center justify-center mr-1.5 flex-shrink-0 border ${neutralBorder}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${primaryButtonBg}`}></div>
              </div>
              <span>{feature}</span>
            </div>
          ))}
          </div>
        
        <div className={`flex justify-between items-center mt-auto pt-3 border-t ${neutralBorderLight}`}>
          <span className={`${neutralTextLight} text-sm`}>
            From <span className={`font-semibold ${neutralText}`}>{priceDisplay}</span>
          </span>
          <Link href={detailPath} className={cardLinkStyle}>
            View Details
            <ArrowRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

function ServicesMainPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIsland, setSelectedIsland] = useState("");
  const [retryToken, setRetryToken] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const {
    data: servicesResponse,
    error: servicesError,
    status: servicesStatus,
  } = useFetch<PaginatedServicesResponse>(`/api/services-main?page=1&limit=50&search=${searchTerm}&category=${selectedCategory}&island=${selectedIsland}&_retry=${retryToken}`);

  const servicesList = servicesResponse?.data || [];

  useEffect(() => {
    setIsFilterApplied(
      searchTerm !== '' ||
      selectedCategory !== '' ||
      selectedIsland !== ''
    );
  }, [searchTerm, selectedCategory, selectedIsland]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedIsland("");
  };

  const handleQuickCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Get active filter tags
  const activeFilterTags = [];
  if (searchTerm) activeFilterTags.push({ key: 'search', label: `Search: "${searchTerm}"` });
  if (selectedCategory) activeFilterTags.push({ key: 'category', label: `Category: ${selectedCategory}` });
  if (selectedIsland) activeFilterTags.push({ key: 'island', label: `Island: ${selectedIsland}` });

  const handleRemoveFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'search': setSearchTerm(""); break;
      case 'category': setSelectedCategory(""); break;
      case 'island': setSelectedIsland(""); break;
    }
  };

  // Group services by category
  const transportServices = servicesList.filter(s => s.service_category === "transport");
  const rentalServices = servicesList.filter(s => s.service_category === "rental");

  return (
    <div className={`bg-white ${neutralText}`}>
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-20 md:py-32">
        <Image
          src="/images/services-hero.jpg"
          alt="Andaman Services"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-40"
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Our Services</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">Transport and rental services to make your Andaman journey seamless and convenient.</p>
        </div>
      </div>

      {/* Filter Section */}
      <section className={`sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm border-b ${neutralBorderLight} py-4`}>
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input */}
              <div className="relative flex-grow md:max-w-md">
                <input
                  type="text" 
                placeholder="Search services (e.g., Car rental, Boat transport)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border ${neutralBorder} rounded-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors text-sm`}
                />
              <Search size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${neutralIconColor}`} />
            </div>

            {/* Filter Controls - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}
                >
                  <option value="">All Categories</option>
                  <option value="transport">Transport</option>
                  <option value="rental">Rentals</option>
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
              </div>

              {/* Island Dropdown */}
                <div className="relative">
                  <select
                  value={selectedIsland}
                  onChange={(e) => setSelectedIsland(e.target.value)}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}
                >
                  <option value="">All Islands</option>
                  <option value="Port Blair">Port Blair</option>
                  <option value="Havelock">Havelock</option>
                  <option value="Neil Island">Neil Island</option>
                  <option value="Ross Island">Ross Island</option>
                  </select>
                  <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
                </div>

              {/* Clear Filters Button */}
              {isFilterApplied && (
                  <button
                  onClick={handleClearFilters}
                    className={`text-sm ${neutralTextLight} hover:text-red-600 transition-colors flex items-center ml-2`}
                    title="Clear all filters"
                  >
                    <X size={14} className="mr-1" /> Clear All
                  </button>
                )}
              </div>
            </div>

          {/* Quick Category Buttons - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex mt-3 flex-wrap gap-2">
            <span className={`text-xs font-medium ${neutralTextLight} mr-2 mt-1`}>Popular:</span>
            {['transport', 'rental'].map(category => (
                    <button
                key={category}
                onClick={() => handleQuickCategorySelect(category)}
                className={`text-xs px-3 py-1 rounded-full border ${neutralBorder} ${selectedCategory === category ? `${primaryButtonBg} ${primaryButtonText} border-transparent` : `bg-white ${neutralText} hover:bg-gray-50`} transition-colors capitalize`}
              >
                {category}
                    </button>
            ))}
                  </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className={`mt-3 pt-3 border-t ${neutralBorderLight}`}>
              {activeFilterTags.map(tag => (
                <FilterTag key={tag.key} label={tag.label} onRemove={() => handleRemoveFilter(tag.key)} />
              ))}
              </div>
            )}
          </div>
      </section>

      {/* Main Content Area */}
      <div className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {servicesStatus === 'loading' && <LoadingSpinner />}

          {/* Error State */}
          {servicesError && servicesStatus !== 'loading' && (
            <div className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${errorBg} border ${errorBorder}`}>
              <AlertTriangle className={`w-16 h-16 ${errorIconColor} mb-6`} />
              <h3 className={`text-2xl font-semibold ${errorText} mb-3`}>Oops! Something went wrong.</h3>
              <p className={`${neutralTextLight} mb-6`}>We couldn't load the services right now. Please try again later.</p>
              <button onClick={() => setRetryToken(c => c + 1)} className={buttonPrimaryStyle}>
                <RefreshCw size={16} className="mr-2" /> Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {servicesStatus === 'success' && (
            <>
              {servicesList.length > 0 ? (
                <>
                  {/* Transport Services Section */}
                  {transportServices.length > 0 && (
                    <section className="mb-16">
                      <h2 className={`${sectionHeadingStyle} mb-8 flex items-center`}>
                        <Car className={`mr-3 ${neutralIconColor}`} size={28} />
                        Transport Services
                        <span className={`ml-3 text-sm font-normal ${neutralTextLight} bg-blue-100 text-blue-800 px-3 py-1 rounded-full`}>
                          {transportServices.length} services
                        </span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {transportServices.map((service) => (
                          <ServiceCard key={service.id} service={service} categoryColor={transportCategoryColor} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Rental Services Section */}
                  {rentalServices.length > 0 && (
                    <section className="mb-16">
                      <h2 className={`${sectionHeadingStyle} mb-8 flex items-center`}>
                        <ShoppingBag className={`mr-3 ${neutralIconColor}`} size={28} />
                        Rental Services
                        <span className={`ml-3 text-sm font-normal ${neutralTextLight} bg-amber-100 text-amber-800 px-3 py-1 rounded-full`}>
                          {rentalServices.length} services
                        </span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {rentalServices.map((service) => (
                          <ServiceCard key={service.id} service={service} categoryColor={rentalCategoryColor} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                /* No Results State */
                <div className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${tipBg} border ${tipBorder}`}>
                  <ListFilter className={`w-16 h-16 ${tipIconColor} mb-6`} />
                  <h3 className={`text-2xl font-semibold ${tipText} mb-3`}>No Services Found</h3>
                  <p className={`${neutralTextLight} mb-6`}>Try adjusting your filters or search terms. We couldn't find services matching your current selection.</p>
                  <button onClick={handleClearFilters} className={buttonPrimaryStyle}>
                    <RefreshCw size={16} className="mr-2" /> Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <section className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border ${neutralBorderLight}`}>
              <HelpCircle className={neutralIconColor} size={24} />
            </div>
            <h2 className={`${sectionHeadingStyle} ${neutralText}`}>Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "How do I book a service?", a: "Simply browse our services, select what you need, and follow the booking process. You can contact the service provider directly or book through our platform." },
              { q: "Are prices negotiable?", a: "Many service providers offer flexible pricing, especially for group bookings or extended rentals. Contact them directly to discuss your requirements." },
              { q: "What's included in the service price?", a: "Each service listing clearly mentions what's included. Generally, transportation services include fuel and driver, while rentals include basic equipment and instructions." }
            ].map((faq, i) => (
              <details key={i} className={`bg-white p-5 rounded-xl shadow-md border ${neutralBorderLight} group transition-all duration-300 hover:shadow-lg`}>
                <summary className={`flex justify-between items-center font-semibold ${neutralText} cursor-pointer list-none text-lg`}>
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${neutralBorder} group-hover:bg-gray-100 transition-colors`}>
                    <ChevronDown size={20} className={`transition-transform duration-300 group-open:rotate-180 ${neutralIconColor}`} />
                  </div>
                </summary>
                <div className="overflow-hidden max-h-0 group-open:max-h-screen transition-all duration-500 ease-in-out">
                  <p className={`mt-4 text-sm ${neutralTextLight} leading-relaxed border-t ${neutralBorderLight} pt-4`}>
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`${sectionPadding} bg-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div className={`w-12 h-12 ${neutralBg} rounded-full flex items-center justify-center mr-4 border ${neutralBorder}`}>
              <MessageSquare className={neutralIconColor} size={24} />
            </div>
            <h2 className={sectionHeadingStyle}>What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Excellent transport service! The driver was punctual and knew all the best spots. Made our island hopping so much easier.", name: "Priya Sharma" },
              { text: "Rented scuba gear for our group. Everything was in perfect condition and the staff was very helpful with instructions.", name: "David Wilson" },
              { text: "Amazing snorkeling trip! Professional guides and top-notch equipment. An unforgettable experience in crystal clear waters.", name: "Anita Das" }
            ].map((testimonial, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border ${neutralBorderLight} shadow-lg flex flex-col text-center items-center transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2`}>
                <Quote className={`w-10 h-10 ${neutralIconColor} opacity-30 mb-4`} />
                <p className={`text-base italic ${neutralTextLight} mb-6 flex-grow`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center flex-col mt-auto pt-4 border-t ${neutralBorderLight} w-full">
                  <Image src={`/images/avatar-${i + 1}.jpg`} alt={testimonial.name} width={40} height={40} className="rounded-full" />
                  <span className={`text-base font-semibold ${neutralText}`}>{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ServicesMainPage() {
  return <ServicesMainPageContent />;
}