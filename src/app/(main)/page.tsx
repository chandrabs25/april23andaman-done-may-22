'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Loader2,
  AlertTriangle,
  Check,
  IndianRupee,
  Clock,
  Award,
  PhoneCall,
  ChevronRight,
  Star,
  ArrowRight,
  ChevronDown,
  Search,
  List,
  Briefcase,
  BedDouble,
  Zap,
  Globe,
  Menu,
  Car, // Added for Transportation
  ShoppingBag, // Added for Rentals
  Users, // For passenger capacity
  Tag, // Fallback icon for services
  ImageOff, // For image error placeholder
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch'; // Assuming this custom hook exists
import { useRouter } from 'next/navigation';

// --- Define Interfaces ---
interface Destination {
  id: number;
  name: string;
  description: string | null;
  images: string | null; // Destinations API returns images as string
  slug?: string;
}

interface Activity {
  id: number;
  name: string;
  description: string | null;
  images: string | null; // Activities API returns images as string
  island_name?: string;
  slug?: string;
  price: string;
}

interface ActivityCardProps {
  activity: Activity;
}

interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  images_parsed: string[] | null; // Changed from images to images_parsed to match API response
  slug?: string;
}

interface GetPackagesApiResponse {
  packages: Package[];
  pagination?: any;
  success?: boolean;
  message?: string;
}

interface HomePageHotel {
  id: number;
  name: string;
  images: string[] | null;
  address: string;
  rooms: Array<{ base_price: number }>;
}

interface GetHotelsApiResponse {
  success: boolean;
  data: HomePageHotel[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// --- Interfaces for Rental and Transport Services (from provided example) ---
interface ProviderInfo {
  id?: number;
  user_id?: string;
  business_name?: string;
  // ... other provider fields if needed
}

interface SpecificsTransport {
  vehicle_type?: string;
  capacity_passengers?: number;
  price_per_km?: string | number;
  price_per_trip?: string | number;
  // ... other transport specifics
}

interface SpecificsRental {
  unit?: string; // e.g., 'per day', 'per hour'
  // ... other rental specifics
}

interface ServiceAmenityDetails {
  specifics?: {
    transport?: SpecificsTransport;
    rental?: SpecificsRental;
  };
  // ... other amenity details
}


interface CategorizedService {
  id: number;
  name: string;
  description: string | null;
  images: string[]; // Services API returns images as parsed string array
  slug?: string;
  island_name?: string;
  service_category: 'transport' | 'rental' | 'activity'; // Added 'activity' for completeness
  type?: string; // e.g., "transport_cab", "rental_scooter"
  item_type?: string; // For rentals, e.g., "Scooter", "Bike"
  price_numeric?: number | null;
  price_details?: string | null; // e.g., "per day", "per km"
  rating?: number | null;
  provider?: ProviderInfo | null;
  amenities?: string | ServiceAmenityDetails | null; // Can be JSON string or object
}

// Assuming TransportService and RentalService are specific types of CategorizedService
type TransportService = CategorizedService & { service_category: 'transport' };
type RentalService = CategorizedService & { service_category: 'rental' };


interface PaginatedServicesResponse {
  data: CategorizedService[];
  total: number;
  page: number;
  limit: number;
  success?: boolean;
  message?: string;
}


interface RentalTransportServiceCardProps {
  service: CategorizedService; // Use the broader type
}


interface HotelCardProps {
  hotel: HomePageHotel;
}

interface PackageCardProps {
  pkg: Package;
}

interface DestinationCardProps {
  destination: Destination;
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Packages');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // --- Common Styles ---
  const sectionPadding = "py-6 md:py-8";
  const cardBaseStyle = "flex flex-col bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg min-w-[300px] sm:min-w-[340px] h-[340px]";
  const cardImageContainerStyle = "w-full h-[180px] bg-cover rounded-t-xl relative flex-shrink-0 overflow-hidden";
  const cardContentStyle = "p-3 sm:p-4 flex flex-col h-[160px] text-center";
  const cardTitleStyle = "text-[#111518] text-base sm:text-lg font-medium leading-tight line-clamp-2 mb-2 h-[48px] flex items-center justify-center";
  const cardDescriptionStyle = "text-[#637988] text-sm font-normal leading-relaxed line-clamp-2 flex-1 mb-3 overflow-hidden";
  const cardPriceStyle = "text-[#111518] text-lg font-bold";
  const cardLinkStyle = "text-sm font-medium text-[#1A237E] hover:text-[#161D6F] mt-auto pt-2 inline-flex items-center group";
  const cardBottomStyle = "mt-auto pt-2 flex flex-col items-center justify-center min-h-[40px]";

  // Loading indicator component
  const loadingIndicator = (
    <div className="flex justify-center items-center py-10 text-center w-full">
      <Loader2 className="h-8 w-8 animate-spin text-[#637988]" />
      <span className="ml-3 text-[#637988] font-medium">Loading...</span>
    </div>
  );
  // Error indicator component
  const errorIndicator = (message: string | undefined) => (
    <div className="text-center py-10 px-4 rounded-xl shadow-md bg-red-50 border border-red-200 w-full">
      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-semibold">Could not load data.</p>
      <p className="text-red-600 text-sm mt-1">{message || 'Please try again later.'}</p>
    </div>
  );
  // No data indicator component
  const noDataIndicator = (itemType: string) => (
    <div className="text-center py-10 px-4 rounded-xl shadow-md bg-gray-50 border border-gray-200 w-full">
      <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-700 font-medium">No {itemType} available right now.</p>
      <p className="text-gray-500 text-sm mt-1">Please check back soon for updates.</p>
    </div>
  );

  // --- Fetch Data ---
  const {
    data: destinationsResponse,
    error: destinationsError,
    status: destinationsStatus
  } = useFetch<Destination[]>('/api/destinations');
  const featuredDestinationsData = destinationsResponse || [];

  const {
    data: activitiesResponse,
    error: activitiesError,
    status: activitiesStatus
  } = useFetch<Activity[]>('/api/activities');
  const popularActivitiesData = activitiesResponse || [];

  const {
    data: packagesApiResponse,
    error: packagesError,
    status: packagesStatus
  } = useFetch<GetPackagesApiResponse>('/api/packages?limit=10');
  const featuredPackagesData = packagesApiResponse?.packages || [];

  const {
    data: hotelsResponse,
    error: hotelsError,
    status: hotelsStatus
  } = useFetch<GetHotelsApiResponse>('/api/hotels?limit=4');
  const featuredHotelsData = hotelsResponse?.data || [];

  // Fetch Rental Services
  const {
    data: rentalServicesResponse,
    error: rentalServicesError,
    status: rentalServicesStatus,
  } = useFetch<PaginatedServicesResponse>(`/api/services-main?category=rental&limit=5`); // Limit for homepage
  const featuredRentalServicesData = rentalServicesResponse?.data || [];

  // Fetch Transport Services
  const {
    data: transportServicesResponse,
    error: transportServicesError,
    status: transportServicesStatus,
  } = useFetch<PaginatedServicesResponse>(`/api/services-main?category=transport&limit=5`); // Limit for homepage
  const featuredTransportServicesData = transportServicesResponse?.data || [];


  // Utility function to get image URL or a placeholder
  const getImageUrl = (images: string | string[] | null): string => {
    if (!images) return 'https://placehold.co/600x400/f0f3f4/637988?text=No+Image';

    let imageUrl: string | undefined;

    if (Array.isArray(images)) {
      // Handle array of images (for services and parsed package images)
      imageUrl = images[0]?.trim();
    } else if (typeof images === 'string') {
      // Handle string images (for destinations, activities - could be JSON string or comma-separated)
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          imageUrl = parsed[0]?.trim();
        } else if (typeof parsed === 'string') {
          imageUrl = parsed.trim();
        }
      } catch (e) {
        // Not JSON, treat as comma-separated or single URL
        imageUrl = images.split(',')[0]?.trim();
      }
    }

    if (!imageUrl || !(imageUrl.startsWith('/') || imageUrl.startsWith('http'))) {
      return 'https://placehold.co/600x400/f0f3f4/637988?text=No+Image';
    }
    return imageUrl;
  };

  // Handles image loading errors
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'https://placehold.co/600x400/f0f3f4/637988?text=Image+Error';
    event.currentTarget.srcset = '';
  };

  // Navigates to packages page
  const handleFindPackagesClick = () => {
    const params = new URLSearchParams();
    if (selectedDuration) params.set('duration', selectedDuration);
    if (selectedPriceRange) params.set('priceRange', selectedPriceRange);
    const queryString = params.toString();
    router.push(`/packages${queryString ? `?${queryString}` : ''}`);
  };

  // Generates slug for URLs
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  // --- Card Components ---
  const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => (
    <Link href={`/destinations/${destination.slug || destination.id || generateSlug(destination.name)}`} className={cardBaseStyle}>
      <div className={cardImageContainerStyle}>
        <img src={getImageUrl(destination.images)} alt={destination.name} className="w-full h-full object-cover" onError={handleImageError} />
      </div>
      <div className={cardContentStyle}>
        <h3 className={cardTitleStyle}>{destination.name}</h3>
        <p className={cardDescriptionStyle}>{destination.description || 'Explore this beautiful destination.'}</p>
        <div className={cardBottomStyle}>
          <span className="text-sm text-[#1A237E] font-medium">Explore Destination</span>
        </div>
      </div>
    </Link>
  );

  const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
    const price = hotel.rooms?.[0]?.base_price;
    return (
      <Link href={`/hotels/${hotel.id}`} className={cardBaseStyle}>
        <div className={cardImageContainerStyle}>
          <img src={getImageUrl(hotel.images)} alt={hotel.name} className="w-full h-full object-cover" onError={handleImageError} />
        </div>
        <div className={cardContentStyle}>
          <h3 className={cardTitleStyle}>{hotel.name}</h3>
          <p className={cardDescriptionStyle}>{hotel.address}</p>
          <div className={cardBottomStyle}>
            {price !== undefined ? (
              <div className="flex flex-col items-center">
                <span className={cardPriceStyle}><IndianRupee size={16} className="inline -mt-1" />{price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[#637988]">per night</span>
              </div>
            ) : (
              <span className="text-sm text-[#1A237E] font-medium">View Details</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => (
    <Link href={`/packages/${pkg.slug || pkg.id}`} className={cardBaseStyle}>
      <div className={cardImageContainerStyle}>
        <img src={getImageUrl(pkg.images_parsed)} alt={pkg.name} className="w-full h-full object-cover" onError={handleImageError} />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#111518] border border-slate-200 shadow-sm">
          <Clock size={12} className="inline mr-1 -mt-0.5" /> {pkg.duration}
        </div>
      </div>
      <div className={cardContentStyle}>
        <h3 className={cardTitleStyle}>{pkg.name}</h3>
        <p className={cardDescriptionStyle}>{pkg.description || 'An amazing package awaits.'}</p>
        <div className={cardBottomStyle}>
          <div className="flex flex-col items-center">
            <span className={cardPriceStyle}><IndianRupee size={16} className="inline -mt-1" />{pkg.base_price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-[#637988]">per person</span>
          </div>
        </div>
      </div>
    </Link>
  );

  const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => (
    <Link href={`/activities/${activity.slug || activity.id}`} className={cardBaseStyle}>
      <div className={cardImageContainerStyle}>
        <img src={getImageUrl(activity.images)} alt={activity.name} className="w-full h-full object-cover" onError={handleImageError} />
        {activity.island_name && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#111518] border border-slate-200 shadow-sm">
            <MapPin size={12} className="inline mr-1 -mt-0.5" />{activity.island_name}
          </div>
        )}
      </div>
      <div className={cardContentStyle}>
        <h3 className={cardTitleStyle}>{activity.name}</h3>
        <p className={cardDescriptionStyle}>{activity.description || 'Explore this exciting activity.'}</p>
        <div className={cardBottomStyle}>
          <div className="flex flex-col items-center">
            <span className={cardPriceStyle}><IndianRupee size={16} className="inline -mt-1" />{isNaN(Number(activity.price)) ? activity.price : Number(activity.price).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  // --- New Card for Rental and Transport Services ---
  const RentalTransportServiceCard: React.FC<RentalTransportServiceCardProps> = ({ service }) => {
    const getSpecificsData = (svc: CategorizedService): ServiceAmenityDetails['specifics'] | null => {
      if (svc.amenities && typeof svc.amenities === 'string') {
        try { return JSON.parse(svc.amenities)?.specifics || null; }
        catch (e) { console.error("Failed to parse amenities JSON for specifics:", e); return null; }
      } else if (typeof svc.amenities === 'object' && svc.amenities !== null) {
        return (svc.amenities as ServiceAmenityDetails).specifics || null;
      }
      return null;
    };

    const specifics = getSpecificsData(service);
    let detailText = service.item_type || ""; // For rentals
    if (service.service_category === 'transport' && specifics?.transport?.vehicle_type) {
      detailText = specifics.transport.vehicle_type;
    }

    const priceDisplay = service.price_details || (service.price_numeric ? `₹${service.price_numeric.toLocaleString('en-IN')}` : "On request");
    let detailPath = `/services/${service.service_category}/${service.id}`;
    if (service.service_category === "activity") detailPath = `/activities/${service.id}`; // Should not happen here but for safety

    // Format price for consistent display
    let formattedPrice = priceDisplay;
    let priceUnit = "";
    
    if (service.service_category === 'rental' && specifics?.rental?.unit) {
      priceUnit = specifics.rental.unit;
    } else if (service.service_category === 'transport' && specifics?.transport?.price_per_km && !service.price_details) {
      priceUnit = "per km";
    } else if (service.service_category === 'transport' && specifics?.transport?.price_per_trip && !service.price_details) {
      priceUnit = "per trip";
    }

    return (
      <Link href={detailPath} className={cardBaseStyle}>
        <div className={cardImageContainerStyle}>
          <img src={getImageUrl(service.images)} alt={service.name} className="w-full h-full object-cover" onError={handleImageError} />
          {detailText && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#111518] border border-slate-200 shadow-sm flex items-center">
              {service.service_category === 'transport' ? <Car size={12} className="mr-1.5 -mt-0.5" /> : <ShoppingBag size={12} className="mr-1.5 -mt-0.5" />}
              {detailText}
            </div>
          )}
        </div>
        <div className={cardContentStyle}>
          <h3 className={cardTitleStyle}>{service.name}</h3>
          <p className={cardDescriptionStyle}>{service.description || 'Check out this service.'}</p>
          <div className={cardBottomStyle}>
            <div className="flex flex-col items-center">
              <span className={cardPriceStyle}>{formattedPrice}</span>
              {priceUnit && <span className="text-xs text-[#637988]">{priceUnit}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  };


  // Tab configuration
  const tabs = [
    { name: 'Packages', icon: <Briefcase size={18} className="hidden sm:inline" />, data: featuredPackagesData, CardComponent: PackageCard, status: packagesStatus, error: packagesError, type: 'packages' },
    { name: 'Destinations', icon: <Globe size={18} className="hidden sm:inline" />, data: featuredDestinationsData, CardComponent: DestinationCard, status: destinationsStatus, error: destinationsError, type: 'destinations' },
    { name: 'Hotels', icon: <BedDouble size={18} className="hidden sm:inline" />, data: featuredHotelsData, CardComponent: HotelCard, status: hotelsStatus, error: hotelsError, type: 'hotels' },
    { name: 'Rentals', icon: <ShoppingBag size={18} className="hidden sm:inline" />, data: featuredRentalServicesData, CardComponent: RentalTransportServiceCard, status: rentalServicesStatus, error: rentalServicesError, type: 'rentals' },
    { name: 'Transportation', icon: <Car size={18} className="hidden sm:inline" />, data: featuredTransportServicesData, CardComponent: RentalTransportServiceCard, status: transportServicesStatus, error: transportServicesError, type: 'transportation' },
    { name: 'Activities', icon: <Zap size={18} className="hidden sm:inline" />, data: popularActivitiesData, CardComponent: ActivityCard, status: activitiesStatus, error: activitiesError, type: 'activities' },
  ];
  const currentTabData = tabs.find(tab => tab.name === activeTab);

  // "Why Choose Us" items
  const whyChooseUsItems = [
    { icon: <MapPin size={24} className="text-[#1A237E]" />, title: "Expert Travel Planning", description: "Our experienced team crafts personalized itineraries." },
    { icon: <IndianRupee size={24} className="text-green-500" />, title: "Best Value Guaranteed", description: "We offer competitive deals and transparent pricing." },
    { icon: <PhoneCall size={24} className="text-orange-500" />, title: "24/7 Support", description: "Assistance is available anytime during your trip." },
  ];

  // Testimonial data
  const testimonials = [
    { name: "Sharath P.", image: "https://placehold.co/128x128/e2e8f0/4a5568?text=SP", quote: "The trip of a lifetime! Everything was perfect in Andaman.", rating: 5, trip: "Havelock Island Adventure" },
    { name: "Sindhuja R.", image: "https://placehold.co/128x128/e2e8f0/4a5568?text=SR", quote: "Incredible value and seamless planning for our family. Highly recommend!", rating: 5, trip: "Family Island Hopping" },
    { name: "Sushanth S.", image: "https://placehold.co/128x128/e2e8f0/4a5568?text=SS", quote: "Felt supported every step of the way. The sunset cruise was amazing.", rating: 5, trip: "Neil Island Explorer" },
    { name: "Priya K.", image: "https://placehold.co/128x128/e2e8f0/4a5568?text=PK", quote: "Amazing experience! The scuba diving was unforgettable.", rating: 5, trip: "Scuba Diving Special" }
  ];

  // Hero images
  const heroImageMobile = "/images/hero_mobile.webp";
  const heroImageDesktop = "/images/hero-min.webp";


  return (
    <div className="flex flex-col min-h-screen bg-slate-50" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;700&display=swap');
      `}</style>

      {/* Hero Section */}
      <section className="relative w-full h-[380px] sm:h-[420px] md:h-[480px] lg:h-[550px]">
        <Image
          src={heroImageMobile}
          alt="Scenic travel destination hero image for mobile"
          layout="fill"
          objectFit="cover"
          priority
          className="z-0 block sm:hidden"
          onError={handleImageError}
        />
        <Image
          src={heroImageDesktop}
          alt="Scenic travel destination hero image for desktop"
          layout="fill"
          objectFit="cover"
          priority
          className="z-0 hidden sm:block"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none pb-28 sm:pb-28 md:pb-0">
          <img
            src="/images/brand-name.webp"
            alt="Brand name logo"
            className="w-[350px] sm:w-[450px] md:w-[500px] lg:w-[750px] h-auto opacity-90"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-30">
          <div className="max-w-4xl mx-auto backdrop-blur-sm sm:bg-white/80 sm:backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-2xl border border-white sm:border-none">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-2/3">
                <div className="flex-1">
                  <label htmlFor="homeDuration" className="sr-only">Duration</label>
                  <div className="relative flex items-center bg-[#f0f3f4] hover:bg-white rounded-lg group h-full transition-colors duration-200">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#637988] group-focus-within:text-[#1A237E]" size={18} />
                    <select
                      id="homeDuration"
                      name="duration"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full h-full pl-10 pr-8 py-2.5 text-sm text-[#111518] bg-transparent border border-transparent group-hover:border-slate-300 focus:border-[#1A237E] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A237E]/50 appearance-none"
                    >
                      <option value="">Any Duration</option>
                      <option value="1-3">1-3 Days</option>
                      <option value="4-6">4-6 Days</option>
                      <option value="7-10">7-10 Days</option>
                      <option value="10+">10+ Days</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#637988] pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="homePriceRange" className="sr-only">Price Range</label>
                  <div className="relative flex items-center bg-[#f0f3f4] hover:bg-white rounded-lg group h-full transition-colors duration-200">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#637988] group-focus-within:text-[#1A237E]" size={18} />
                    <select
                      id="homePriceRange"
                      name="priceRange"
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full h-full pl-10 pr-8 py-2.5 text-sm text-[#111518] bg-transparent border border-transparent group-hover:border-slate-300 focus:border-[#1A237E] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A237E]/50 appearance-none"
                    >
                      <option value="">Any Price</option>
                      <option value="0-10000">₹0 - ₹10,000</option>
                      <option value="10001-20000">₹10,001 - ₹20,000</option>
                      <option value="20001-30000">₹20,001 - ₹30,000</option>
                      <option value="30001+">₹30,001+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#637988] pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <button
                  onClick={handleFindPackagesClick}
                  className="w-full bg-[#1A237E] hover:bg-[#161D6F] text-white font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center text-sm h-[42px]"
                >
                  <Search size={18} className="mr-2" />
                  <span>Find Packages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pt-0">
        <section className="pb-3 pt-6 md:pt-8">
          <div className="w-full border-b border-[#dce1e5]">
            <div className="container mx-auto flex justify-center overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-2 pb-[13px] pt-3 px-4 text-sm font-bold leading-normal tracking-[0.015em] whitespace-nowrap transition-colors duration-200
                    ${activeTab === tab.name ? 'border-b-[3px] border-b-[#111518] text-[#111518]' : 'border-b-[3px] border-b-transparent text-[#637988] hover:text-[#111518]'}`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionPadding}>
          <div className="container mx-auto">
            {currentTabData && (
              <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 text-center">
                Featured {currentTabData.name}
              </h2>
            )}
          </div>

          {currentTabData && currentTabData.status === 'loading' && (<div className="container mx-auto px-4">{loadingIndicator}</div>)}
          {currentTabData && currentTabData.status === 'error' && (<div className="container mx-auto px-4">{errorIndicator(currentTabData.error?.message)}</div>)}
          {currentTabData && currentTabData.status === 'success' && (!currentTabData.data || currentTabData.data.length === 0) && (<div className="container mx-auto px-4">{noDataIndicator(currentTabData.type)}</div>)}

          {currentTabData && currentTabData.status === 'success' && currentTabData.data && currentTabData.data.length > 0 && (
            <>
              <div className="w-full overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2">
                <div className="flex flex-nowrap items-stretch gap-3 sm:gap-4 px-4">
                  {(currentTabData.data as any[]).map((item: any, index: number) => {
                    const key = item.id || index;
                    if (currentTabData.type === 'packages') {
                      const PackageComponent = currentTabData.CardComponent as React.ComponentType<PackageCardProps>;
                      return <PackageComponent key={key} pkg={item} />;
                    } else if (currentTabData.type === 'destinations') {
                      const DestinationComponent = currentTabData.CardComponent as React.ComponentType<DestinationCardProps>;
                      return <DestinationComponent key={key} destination={item} />;
                    } else if (currentTabData.type === 'hotels') {
                      const HotelComponent = currentTabData.CardComponent as React.ComponentType<HotelCardProps>;
                      return <HotelComponent key={key} hotel={item} />;
                    } else if (currentTabData.type === 'activities') {
                      const ActivityComponent = currentTabData.CardComponent as React.ComponentType<ActivityCardProps>;
                      return <ActivityComponent key={key} activity={item} />;
                    } else if (currentTabData.type === 'rentals' || currentTabData.type === 'transportation') {
                      const ServiceComponent = currentTabData.CardComponent as React.ComponentType<RentalTransportServiceCardProps>;
                      return <ServiceComponent key={key} service={item as CategorizedService} />;
                    }
                    return null;
                  })}
                </div>
              </div>
              <div className="container mx-auto px-4 pt-4">
                <div className="flex justify-center">
                  <Link 
                    href={
                      currentTabData.type === 'packages' ? '/packages' :
                      currentTabData.type === 'destinations' ? '/destinations' :
                      currentTabData.type === 'hotels' ? '/hotels' :
                      currentTabData.type === 'activities' ? '/activities' :
                      currentTabData.type === 'rentals' || currentTabData.type === 'transportation' ? '/services' :
                      '#'
                    }
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#1A237E] hover:bg-[#161D6F] text-white font-medium text-sm rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
                  >
                    <List size={16} className="mr-2" />
                    View All {currentTabData.name}
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>

        <section className={`${sectionPadding} bg-slate-100`}>
          <div className="container mx-auto px-4">
            <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pb-5 pt-2">Why Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyChooseUsItems.map(item => (
                <div key={item.title} className="flex flex-col items-center gap-3 rounded-lg border border-[#dce1e5] bg-white p-4 text-center hover:shadow-md transition-shadow">
                  <div className="flex justify-center text-[#111518]">
                    {React.cloneElement(item.icon, { className: `${item.icon.props.className || ''}` })}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[#111518] text-base font-bold leading-tight">{item.title}</h3>
                    <p className="text-[#637988] text-sm font-normal leading-normal">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionPadding}>
          <div className="container mx-auto px-4">
            <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pb-3 pt-2">
              What Our Travelers Say
            </h2>
          </div>
          <div className="w-full overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch p-4 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col gap-4 text-center rounded-lg min-w-[180px] sm:min-w-[200px] md:min-w-[220px] pt-4"
                >
                  <div className="w-24 h-24 rounded-full self-center overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div>
                    <p className="text-[#111518] text-base font-medium leading-normal">{testimonial.name}</p>
                    <p className="text-[#637988] text-sm font-normal leading-normal mt-1 px-2">"{testimonial.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
