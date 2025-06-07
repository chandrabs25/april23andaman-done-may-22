// Path: ./src/app/packages/page.tsx
// Theme: Neutral with Contextual Background Colors & Enhanced FAQ/Testimonials (FAQ bg changed to gray)

'use client';
export const dynamic = 'force-dynamic'
import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Filter,
  X,
  Loader2,
  AlertTriangle,
  Package as PackageIcon,
  SlidersHorizontal,
  DollarSign,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Search,
  Heart,
  Users,
  Anchor,
  Compass,
  ChevronDown,
  Check,
  IndianRupee,
  Info, // Added for info sections
  Ban, // Added for error/exclusions
  Quote, // Added for testimonials
  Phone // Added for CTA
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

// --- Define interfaces (Keep as is) ---
interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  starting_price: number | null; // Added
  max_people: number | null;
  created_by: number;
  is_active: number;
  itinerary_parsed: Record<string, any> | null; // From ProcessedPackage
  included_services_parsed: string[]; // From ProcessedPackage
  images_parsed: string[]; // From ProcessedPackage
  cancellation_policy: string | null;
  created_at: string;
  updated_at: string;
}

interface Island {
  id: number;
  name: string;
}

interface GetDestinationsApiResponse {
  success: boolean;
  data: Island[];
  message?: string;
}

interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface GetPackagesApiResponse {
  packages: Package[];
  pagination: PaginationInfo;
}

interface FiltersState {
  duration: string;
  priceRange: string;
  searchQuery: string;
}
// --- End Interfaces ---

// --- Define Common Styles (Neutral Theme with Contextual Colors) ---
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

const tipBg = 'bg-yellow-50'; // For active filters, no results
const tipBorder = 'border-yellow-100';
const tipText = 'text-yellow-800';
const tipIconColor = 'text-yellow-700';

const neutralBgLight = 'bg-gray-50'; // Used for FAQ section now
const neutralBorderLight = 'border-gray-100';
const neutralBg = 'bg-gray-100';
const neutralBorder = 'border-gray-200';
const neutralText = 'text-gray-800';
const neutralTextLight = 'text-gray-600';
const neutralIconColor = 'text-gray-600';

const sectionPadding = "py-16 md:py-24"; // Consistent padding
const sectionHeadingStyle = `text-2xl md:text-3xl font-bold ${neutralText}`;
const cardBaseStyle = `bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.03] border ${neutralBorderLight} h-full group`;
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`;
const cardLinkStyle = `inline-flex items-center ${neutralText} hover:text-gray-800 font-medium text-sm group mt-auto pt-2 border-t ${neutralBorderLight} px-1`; // Adjusted link style
// --- End Common Styles ---

// --- LoadingSpinner Component (Apply Neutral Theme) ---
const LoadingSpinner = ({ message = "Loading Packages..." }: { message?: string }) => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] text-center py-20">
    <div className="relative w-16 h-16">
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${neutralBorder} rounded-full`}></div>
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${primaryButtonBg} rounded-full border-t-transparent animate-spin`}></div>
    </div>
    <span className={`mt-4 text-lg ${neutralText} font-medium`}>{message}</span>
  </div>
);
// --- End LoadingSpinner ---

// --- Package Card Component (Apply Neutral Theme) ---
interface PackageCardProps {
  pkg: Package;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  // Add image error state management
  const [imgError, setImgError] = useState(false);
  
  // Robust image URL normalization
  const normalizeImageUrl = (url: string | null | undefined): string => {
    const placeholder = "/images/placeholder.jpg";
    if (imgError || !url || typeof url !== 'string' || url.trim() === "" || ["null", "undefined"].includes(url.toLowerCase())) {
      return placeholder;
    }
    // Handle both http URLs and relative paths
    return url.startsWith("http") || url.startsWith("/") ? url : `/images/${url}`;
  };
  
  const imageUrl = normalizeImageUrl((pkg.images_parsed && pkg.images_parsed.length > 0) ? pkg.images_parsed[0] : null);
  const includedServicesToDisplay = Array.isArray(pkg.included_services_parsed)
    ? pkg.included_services_parsed.slice(0, 3)
    : ['Hotel stays included', 'All transfers & sightseeing', 'Expert local guides'];

  // Image error handler
  const handleImageError = () => {
    if (!imgError) setImgError(true);
  };

  return (
    <div className={cardBaseStyle}> {/* Use cardBaseStyle */}
      <div className="h-52 w-full relative flex-shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          onError={handleImageError}
        />
        
        {/* Only show overlay when there's an actual error */}
        {imageUrl === "/images/placeholder.jpg" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 pointer-events-none">
            <PackageIcon size={36} className="text-gray-400 opacity-50" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {/* Price badge - Neutral dark */}
        <div className={`absolute top-3 right-3 ${primaryButtonBg} ${primaryButtonText} text-sm font-bold py-1.5 px-3 rounded-full shadow-md flex items-center`}>
          <IndianRupee size={12} className="mr-0.5" />{pkg.base_price.toLocaleString('en-IN')}
        </div>
        {/* Duration badge - Neutral light */}
        <div className={`absolute bottom-3 left-3 bg-white/90 ${neutralText} text-xs font-medium py-1.5 px-3 rounded-full flex items-center backdrop-blur-sm border ${neutralBorderLight}`}>
          <Clock size={12} className="mr-1.5" />
          {pkg.duration}
        </div>
        {/* Wishlist button - Neutral */}
        <button className={`absolute top-3 left-3 bg-white/90 ${neutralTextLight} hover:text-red-500 p-2 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300 border ${neutralBorderLight}`}>
          <Heart size={16} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow"> {/* Reduced padding */}
        <h3 className={`text-lg font-semibold leading-tight mb-2 ${neutralText} line-clamp-2`}>{pkg.name}</h3>
        <p className={`${neutralTextLight} text-sm mb-3 line-clamp-2 flex-grow`}>
          {pkg.description || 'Explore the beauty of the Andaman Islands with this package. Click View Details for the full itinerary.'}
        </p>
        {/* Features List - Neutral */}
        <div className="mb-3 space-y-1">
          {includedServicesToDisplay.map((service: string, index: number) => (
            <div key={index} className={`flex items-center ${neutralTextLight} text-xs`}>
              <div className={`w-3 h-3 rounded-full ${neutralBg} flex items-center justify-center mr-1.5 flex-shrink-0 border ${neutralBorder}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${primaryButtonBg}`}></div>
              </div>
              <span>{service}</span>
            </div>
          ))}
        </div>
        <div className={`flex justify-between items-center mt-auto pt-3 border-t ${neutralBorderLight}`}> {/* Reduced pt */}
          <span className={`${neutralTextLight} text-sm`}>
            From <span className={`font-semibold ${neutralText}`}>₹{pkg.base_price.toLocaleString('en-IN')}</span>
          </span>
          <Link href={`/packages/${pkg.id}`} className={cardLinkStyle}>
            View Details
            <ArrowRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
// --- End Package Card ---

// --- Filter Tag Component (Apply Contextual Tip Color) ---
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
// --- End Filter Tag ---

// --- Main Component Logic (Keep as is) ---
function PackagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersState>({
    duration: searchParams.get('duration') || '',
    priceRange: searchParams.get('priceRange') || '',
    searchQuery: searchParams.get('q') || ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [itemsPerPage] = useState(9);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  // Fetch destinations (keep logic, might be used elsewhere)
  const { data: destinationsResponse, status: destinationsStatus } =
    useFetch<GetDestinationsApiResponse>('/api/destinations');
  const [destinationsList, setDestinationsList] = useState<Island[]>([]);
  useEffect(() => {
    if (destinationsStatus === 'success' && destinationsResponse?.data) {
      setDestinationsList(destinationsResponse.data);
    }
  }, [destinationsStatus, destinationsResponse]);

  // Construct API URL based on filters and pagination
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());
    if (filters.searchQuery) {
      // The backend /api/packages/route.ts expects 'searchQuery' as the parameter name
      params.append('searchQuery', filters.searchQuery); 
    }
    if (filters.duration) {
      params.append('duration', filters.duration);
    }
    if (filters.priceRange) {
      params.append('priceRange', filters.priceRange);
    }
    return `/api/packages?${params.toString()}`;
  }, [currentPage, itemsPerPage, filters]);

  // Fetch packages
  const { data: packagesApiResponse, error: packagesError, status: packagesStatus } =
    useFetch<GetPackagesApiResponse>(apiUrl); // useFetch will re-fetch when apiUrl changes

  useEffect(() => {
    if (packagesStatus === 'success' && packagesApiResponse) {
      setPackages(packagesApiResponse.packages || []);
      setPaginationInfo(packagesApiResponse.pagination || null);
    } else if (packagesStatus === 'error') {
      setPackages([]);
      setPaginationInfo(null);
    }
  }, [packagesStatus, packagesApiResponse]);

  useEffect(() => {
    setIsFilterApplied(
      filters.duration !== '' ||
      filters.priceRange !== '' ||
      filters.searchQuery !== ''
    );
  }, [filters]);

  // Packages from API are now directly used, client-side filtering is removed.
  const filteredPackages = packages; // No more client-side filtering

  // --- Handlers (Keep logic as is, update URL params) ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    updateUrlParams({ ...filters, [name]: value });
    handlePageChange(1, true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ ...filters, searchQuery: value });
    // Debounce URL update if needed, or update immediately
    updateUrlParams({ ...filters, searchQuery: value });
    handlePageChange(1, true);
  };

  const handleQuickDestinationSelect = (destinationName: string) => {
    setFilters({ ...filters, searchQuery: destinationName });
    updateUrlParams({ ...filters, searchQuery: destinationName });
    handlePageChange(1, true);
  };

  const handleClearFilters = () => {
    setFilters({ duration: '', priceRange: '', searchQuery: '' });
    updateUrlParams({ duration: '', priceRange: '', searchQuery: '' });
    handlePageChange(1, true);
  };

  const handleRemoveFilter = (filterName: keyof FiltersState) => {
    const newFilters = { ...filters, [filterName]: '' };
    setFilters(newFilters);
    updateUrlParams(newFilters);
    handlePageChange(1, true);
  };

  const updateUrlParams = (currentFilters: FiltersState) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        // Ensure frontend URL parameter for search matches backend ('searchQuery')
        if (key === 'searchQuery') current.set('searchQuery', value);
        else current.set(key, value);
      } else {
        if (key === 'searchQuery') current.delete('searchQuery');
        else current.delete(key);
      }
    });
    if (currentPage > 1) current.set('page', currentPage.toString());
    else current.delete('page');
    router.push(`/packages?${current.toString()}`, { scroll: false });
  };

  const handlePageChange = useCallback((newPage: number, calledByFilter = false) => {
    if (newPage < 1 || (paginationInfo && newPage > paginationInfo.totalPages) || (newPage === currentPage && !calledByFilter)) return;
    setCurrentPage(newPage);
    if (newPage !== currentPage || calledByFilter) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newPage > 1) current.set('page', newPage.toString());
      else current.delete('page');
      router.push(`/packages?${current.toString()}`, { scroll: false });
      setTimeout(() => {
        const packagesGrid = document.getElementById('packages-grid');
        if (packagesGrid) packagesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [paginationInfo, currentPage, router, searchParams]);
  // --- End Handlers ---

  // Get active filter tags (Keep logic as is)
  const activeFilterTags = useMemo(() => {
    const tags = [];
    if (filters.searchQuery) tags.push({ key: 'searchQuery', label: `Search: "${filters.searchQuery}"` });
    if (filters.duration) tags.push({ key: 'duration', label: `Duration: ${filters.duration.replace('+', ' Days+')}` });
    if (filters.priceRange) {
      const range = filters.priceRange.split('-');
      const label = range.length > 1 ? `Price: ₹${Number(range[0]).toLocaleString('en-IN')} - ₹${Number(range[1]).toLocaleString('en-IN')}` : `Price: ₹${Number(range[0].replace('+', '')).toLocaleString('en-IN')}+`;
      tags.push({ key: 'priceRange', label });
    }
    return tags;
  }, [filters]);

  // --- Render Logic ---
  return (
    <div className={`bg-white ${neutralText}`}>
      {/* Hero Section - Neutral */}
      <div className="relative bg-gray-900 text-white py-20 md:py-32">
        <Image
          src="/images/packages-hero.jpg" // Replace with a suitable hero image
          alt="Andaman Packages"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-40"
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Andaman Package</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">Explore curated packages for every traveler. Adventure, relaxation, or romance - start your journey here.</p>
        </div>
      </div>

      {/* Filter Section - Neutral Background */}
      <section className={`sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm border-b ${neutralBorderLight} py-4`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow md:max-w-md">
              <input
                type="text"
                name="searchQuery"
                placeholder="Search packages (e.g., Honeymoon, Scuba, Havelock)"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className={`w-full pl-10 pr-4 py-2.5 border ${neutralBorder} rounded-full focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors text-sm`}
              />
              <Search size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${neutralIconColor}`} />
            </div>

            {/* Filter Controls - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              {/* Duration Dropdown */}
              <div className="relative">
                <select
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}
                >
                  <option value="">Duration</option>
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                  <option value="6">6 Days</option>
                  <option value="7+">7+ Days</option>
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
              </div>

              {/* Price Dropdown */}
              <div className="relative">
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}
                >
                  <option value="">Price Range</option>
                  <option value="0-15000">Under ₹15,000</option>
                  <option value="15000-25000">₹15,000 - ₹25,000</option>
                  <option value="25000-40000">₹25,000 - ₹40,000</option>
                  <option value="40000+">₹40,000+</option>
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

          {/* Quick Destination Buttons - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex mt-3 flex-wrap gap-2">
            <span className={`text-xs font-medium ${neutralTextLight} mr-2 mt-1`}>Popular:</span>
            {['Havelock', 'Neil Island', 'Port Blair', 'Honeymoon', 'Family'].map(dest => (
              <button
                key={dest}
                onClick={() => handleQuickDestinationSelect(dest)}
                className={`text-xs px-3 py-1 rounded-full border ${neutralBorder} ${filters.searchQuery === dest ? `${primaryButtonBg} ${primaryButtonText} border-transparent` : `bg-white ${neutralText} hover:bg-gray-50`} transition-colors`}
              >
                {dest}
              </button>
            ))}
          </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className="mt-3 pt-3 border-t ${neutralBorderLight}">
              {activeFilterTags.map(tag => (
                <FilterTag key={tag.key} label={tag.label} onRemove={() => handleRemoveFilter(tag.key as keyof FiltersState)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className={`${sectionPadding} ${neutralBgLight}`}>
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {packagesStatus === 'loading' && <LoadingSpinner />}

          {/* Error State - Contextual Error Red */}
          {packagesStatus === 'error' && (
            <div className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${errorBg} border ${errorBorder}`}>
              <AlertTriangle className={`w-16 h-16 ${errorIconColor} mb-6`} />
              <h3 className={`text-2xl font-semibold ${errorText} mb-3`}>Oops! Something went wrong.</h3>
              <p className={`${neutralTextLight} mb-6`}>We couldn't load the packages right now. Please try again later.</p>
              <button onClick={() => window.location.reload()} className={buttonPrimaryStyle}>
                <RefreshCw size={16} className="mr-2" /> Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {packagesStatus === 'success' && (
            <>
              {filteredPackages.length > 0 ? (
                <>
                  {/* Results Count and Sorting (UI only) - Hidden on mobile, visible on desktop */}
                  <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-8">
                    <p className={`${neutralTextLight} text-sm mb-4 md:mb-0`}>
                      Showing <span className={`font-semibold ${neutralText}`}>{filteredPackages.length}</span> of <span className={`font-semibold ${neutralText}`}>{paginationInfo?.totalItems || packages.length}</span> packages
                    </p>
                    {/* Sorting Dropdown - Neutral */}
                    <div className="relative">
                      <select className={`appearance-none bg-white border ${neutralBorder} rounded-full pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-colors cursor-pointer`}>
                        <option>Sort by: Relevance</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Duration: Short to Long</option>
                      </select>
                      <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${neutralIconColor} pointer-events-none`} />
                    </div>
                  </div>

                  {/* Packages Grid */}
                  <div id="packages-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPackages.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>

                  {/* Pagination - Neutral */}
                  {paginationInfo && paginationInfo.totalPages > 1 && (
                    <nav className="mt-16 flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full border ${neutralBorder} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : `hover:bg-gray-100`}`}
                        aria-label="Previous Page"
                      >
                        <ChevronLeft size={20} className={neutralIconColor} />
                      </button>
                      {[...Array(paginationInfo.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Logic to show limited page numbers (e.g., first, last, current +/- 2)
                        const showPage = pageNum === 1 || pageNum === paginationInfo.totalPages || Math.abs(pageNum - currentPage) <= 1 || (currentPage <= 3 && pageNum <= 3) || (currentPage >= paginationInfo.totalPages - 2 && pageNum >= paginationInfo.totalPages - 2);
                        const showEllipsis = Math.abs(pageNum - currentPage) === 2 && pageNum > 1 && pageNum < paginationInfo.totalPages && !(currentPage <= 3 && pageNum <= 3) && !(currentPage >= paginationInfo.totalPages - 2 && pageNum >= paginationInfo.totalPages - 2);

                        if (showEllipsis) {
                          return <span key={`ellipsis-${i}`} className={`px-2 ${neutralTextLight}`}>...</span>;
                        }
                        if (showPage) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-full text-sm font-medium border ${pageNum === currentPage ? `${primaryButtonBg} ${primaryButtonText} border-transparent shadow-sm` : `bg-white ${neutralText} ${neutralBorder} hover:bg-gray-100`} transition-colors`}
                              aria-current={pageNum === currentPage ? 'page' : undefined}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === paginationInfo.totalPages}
                        className={`p-2 rounded-full border ${neutralBorder} ${currentPage === paginationInfo.totalPages ? 'opacity-50 cursor-not-allowed' : `hover:bg-gray-100`}`}
                        aria-label="Next Page"
                      >
                        <ChevronRight size={20} className={neutralIconColor} />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                /* No Results State - Contextual Tip Yellow */
                <div className={`min-h-[40vh] flex flex-col justify-center items-center text-center p-8 rounded-2xl ${tipBg} border ${tipBorder}`}>
                  <Compass className={`w-16 h-16 ${tipIconColor} mb-6`} />
                  <h3 className={`text-2xl font-semibold ${tipText} mb-3`}>No Packages Found</h3>
                  <p className={`${neutralTextLight} mb-6`}>Try adjusting your filters or search terms. We couldn't find packages matching your current selection.</p>
                  <button onClick={handleClearFilters} className={buttonPrimaryStyle}>
                    <RefreshCw size={16} className="mr-2" /> Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- REDESIGNED FAQ Section - Neutral Light Background --- */}
      <section className={`${sectionPadding} ${neutralBgLight}`}> {/* Changed from tipBg to neutralBgLight */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border ${neutralBorderLight}`}>
              <HelpCircle className={neutralIconColor} size={24} /> {/* Changed icon color */}
            </div>
            <h2 className={`${sectionHeadingStyle} ${neutralText}`}>Frequently Asked Questions</h2> {/* Changed text color */}
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <details key={i} className={`bg-white p-5 rounded-xl shadow-md border ${neutralBorderLight} group transition-all duration-300 hover:shadow-lg`}>
                <summary className={`flex justify-between items-center font-semibold ${neutralText} cursor-pointer list-none text-lg`}>
                  <span>Question {i}: What is included in the package price?</span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${neutralBorder} group-hover:bg-gray-100 transition-colors`}>
                    <ChevronDown size={20} className={`transition-transform duration-300 group-open:rotate-180 ${neutralIconColor}`} />
                  </div>
                </summary>
                <div className="overflow-hidden max-h-0 group-open:max-h-screen transition-all duration-500 ease-in-out">
                  <p className={`mt-4 text-sm ${neutralTextLight} leading-relaxed border-t ${neutralBorderLight} pt-4`}>
                    Answer {i}: Typically includes accommodation, specified meals, transfers, sightseeing, permits, and ferry tickets. Exclusions like airfare, personal expenses, and optional activities are listed separately.
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* --- END REDESIGNED FAQ Section --- */}

      {/* --- REDESIGNED Testimonials Section - White Background --- */}
      <section className={`${sectionPadding} bg-white`}> {/* Changed from neutralBgLight to white */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <div className={`w-12 h-12 ${neutralBg} rounded-full flex items-center justify-center mr-4 border ${neutralBorder}`}>
              <MessageSquare className={neutralIconColor} size={24} />
            </div>
            <h2 className={sectionHeadingStyle}>What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border ${neutralBorderLight} shadow-lg flex flex-col text-center items-center transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2`}>
                <Quote className={`w-10 h-10 ${neutralIconColor} opacity-30 mb-4`} />
                <p className={`text-base italic ${neutralTextLight} mb-6 flex-grow`}>
                  "Testimonial {i}: An amazing experience! Everything was well-organized, and the islands are breathtaking. Highly recommend this package."
                </p>
                <div className="flex items-center justify-center flex-col mt-auto pt-4 border-t ${neutralBorderLight} w-full">
                  <Image src={`/images/avatar-${i}.jpg`} alt={`Traveler ${i}`} width={56} height={56} className="rounded-full mb-3 border-2 border-white shadow-md" />
                  <p className={`font-semibold ${neutralText}`}>Traveler Name {i}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, s) => <Star key={s} size={16} className={`fill-current text-yellow-400`} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- END REDESIGNED Testimonials Section --- */}

      {/* CTA Section - Contextual Info Blue */}
      <section className={`${sectionPadding} ${infoBg}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border ${neutralBorderLight}`}>
              <PackageIcon className={infoIconColor} size={24} />
            </div>
            <h2 className={`${sectionHeadingStyle} ${infoText}`}>Can't Find the Perfect Package?</h2>
          </div>
          <p className={`${neutralTextLight} max-w-xl mx-auto mb-8`}>
            Let us help you craft a custom itinerary tailored to your interests and budget. Contact our travel experts today!
          </p>
          <Link href="/contact" className={buttonPrimaryStyle}>
            Request Custom Tour <Phone size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// --- Main Export with Suspense ---
export default function PackagesPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading Page..." />}>
      <PackagesContent />
    </Suspense>
  );
}

