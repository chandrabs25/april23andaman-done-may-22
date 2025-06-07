// Path: ./src/app/destinations/page.tsx
// Theme: DestinationCard restored to its original .tsx styling and animation. Other elements retain new theme.

'use client';
export const dynamic = 'force-dynamic'
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Restored for use in DestinationCard
import {
  Loader2,
  AlertTriangle,
  MapPin,     // Restored for DestinationCard
  Calendar,
  Plane,
  FileText,
  Wifi,
  ArrowRight,
  Search,
  Heart,      // Restored for DestinationCard
  Camera      // Restored for DestinationCard
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

// --- Define Interfaces ---
interface Destination {
  id: number;
  name: string;
  description: string | null;
  permit_required: number;
  permit_details: string | null;
  coordinates: string | null;
  attractions: string | null;
  activities: string | null;
  images: string | null;
  image_url?: string;
  location?: string;
  slug?: string;
}

interface GetDestinationsApiResponse {
  success: boolean;
  data: Destination[];
  message?: string;
}
// --- End Interfaces ---

// --- Style Guide for general page elements (from first HTML snippet) ---
const generalPageFont = '"Plus Jakarta Sans", "Noto Sans", sans-serif';
const generalBgColor = 'bg-white';
const generalUiElementBg = 'bg-[#f4f2f0]';
const generalPrimaryText = 'text-[#181411]';
const generalSecondaryText = 'text-[#897161]';

const loadingIndicator = (
  <div className="flex flex-col justify-center items-center py-20">
    <div className="relative w-12 h-12">
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${generalUiElementBg.replace('bg-', 'border-')} rounded-full`}></div>
      <div className={`absolute top-0 left-0 w-full h-full border-4 ${generalSecondaryText.replace('text-', 'border-')} rounded-full border-t-transparent animate-spin`}></div>
    </div>
    <span className={`mt-4 text-base ${generalSecondaryText} font-normal`}>Loading destinations...</span>
  </div>
);

const errorIndicator = (message: string | undefined) => (
  <div className={`text-center py-10 px-4 rounded-xl ${generalUiElementBg}`}>
    <AlertTriangle className={`h-10 w-10 ${generalSecondaryText} mx-auto mb-3`} />
    <p className={`${generalPrimaryText} font-medium`}>Could not load data.</p>
    <p className={`${generalSecondaryText} text-sm mt-1`}>{message || 'Please try again later.'}</p>
  </div>
);

const noDataIndicator = (itemType: string) => (
  <div className={`text-center py-10 px-4 rounded-xl ${generalUiElementBg} flex flex-col items-center`}>
    <Search className={`h-10 w-10 ${generalSecondaryText} mb-3`} />
    <p className={`${generalPrimaryText} font-medium`}>No {itemType} found.</p>
    <p className={`${generalSecondaryText} text-sm mt-1`}>Try adjusting your search or check back later.</p>
  </div>
);
// --- End Style Guide for general page elements ---

// --- Original Card Style Constants (from user's .tsx) ---
const cardNeutralText = 'text-gray-800'; // Corresponds to original neutralText
const cardNeutralTextLight = 'text-gray-600'; // Corresponds to original neutralTextLight
const cardNeutralBorderLight = 'border-gray-100'; // Corresponds to original neutralBorderLight
const cardNeutralIconColor = 'text-gray-600'; // Corresponds to original neutralIconColor

const cardBaseStyle = `bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${cardNeutralBorderLight} flex flex-col h-full group`;
const cardImageContainerStyle = "h-52 sm:h-60 w-full relative flex-shrink-0 overflow-hidden";
const cardContentStyle = "p-5 flex flex-col flex-grow";
const cardTitleStyle = `text-lg md:text-xl font-semibold mb-2 ${cardNeutralText}`;
const cardLinkStyle = `inline-flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm group/link mt-auto pt-4 border-t ${cardNeutralBorderLight}`;
// --- End Original Card Style Constants ---


// --- DestinationCard Component (Restored to original .tsx style) ---
interface DestinationCardProps {
  destination: Destination;
  isScrollableItem?: boolean;
}

const DestinationCard = ({ destination, isScrollableItem = false }: DestinationCardProps) => {
  const imageUrl = destination.images?.split(',')[0]?.trim() || '/images/placeholder.jpg';
  const locationDisplay = destination.location || "Andaman Islands"; // Using destination.location if available, fallback
  const attractionsCount = destination.attractions
    ? destination.attractions.split(',').length
    : Math.floor(Math.random() * 3) + 2; // Adjusted random attractions

  // Separate the base card style from the scrollable item constraints
  const baseCardClasses = `bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${cardNeutralBorderLight} flex flex-col group`;
  const scrollableItemClasses = isScrollableItem ? 'min-w-[280px] w-72 md:min-w-[300px] md:w-80 flex-shrink-0 h-[440px]' : 'h-full';
  
  // Apply classes separately to avoid interference
  const cardClassName = `${baseCardClasses} ${scrollableItemClasses}`;

  return (
    <div className={cardClassName}>
      <div className={cardImageContainerStyle}>
        <Image
          src={imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Example sizes, adjust as needed
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.jpg';
          }}
          priority={isScrollableItem} // Prioritize images in featured scroll
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute bottom-3 left-3 bg-white/90 ${cardNeutralText} text-xs font-medium py-1.5 px-3 rounded-full flex items-center backdrop-blur-sm`}>
          <MapPin size={12} className="mr-1.5" />
          {locationDisplay}
        </div>
        <button
          className="absolute top-3 right-3 bg-white/90 text-gray-700 hover:text-red-500 p-2 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300"
          aria-label="Add to favorites"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className={cardContentStyle}>
        <h2 className={cardTitleStyle}>{destination.name}</h2>
        <p className={`text-sm ${cardNeutralTextLight} mb-4 line-clamp-2 h-[2.5rem] overflow-hidden`}>
          {destination.description || 'Explore this beautiful destination.'}
        </p>
        <div className={`mt-auto pt-4 border-t ${cardNeutralBorderLight} flex justify-between items-center`}>
          <div className={`text-xs ${cardNeutralTextLight} flex items-center`}>
            <Camera size={14} className={`mr-1.5 ${cardNeutralIconColor}`} />
            {attractionsCount} Attraction{attractionsCount !== 1 ? 's' : ''}
          </div>
          <Link
            href={`/destinations/${destination.id}`}
            className={cardLinkStyle}
          >
            Explore More
            <ArrowRight size={16} className="ml-1.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
// --- End DestinationCard Component ---

// --- TravelTip Component (Keeps new theme) ---
interface TravelTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TravelTip = ({ icon, title, description }: TravelTipProps) => {
  return (
    <div className={`p-5 rounded-xl ${generalUiElementBg} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-center mb-3">
        <span className={`${generalSecondaryText} mr-3`}>{icon}</span>
        <h3 className={`${generalPrimaryText} text-base font-medium leading-normal`}>{title}</h3>
      </div>
      <p className={`${generalSecondaryText} text-sm font-normal leading-normal`}>{description}</p>
    </div>
  );
};
// --- End TravelTip Component ---

// --- Main Component Logic ---
function DestinationsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: apiResponse, error, status } = useFetch<Destination[]>('/api/destinations');

  const allDestinations = apiResponse || [];
  const featuredScrollDestinations = allDestinations.slice(0, 5);
  const filteredDestinationsForGrid = allDestinations.filter(destination =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (destination.description && destination.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const travelTips = [
    { icon: <Calendar size={20} />, title: "Best Time to Visit", description: "October to May for clear skies and calm seas." },
    { icon: <Plane size={20} />, title: "Getting There", description: "Direct flights to Port Blair. Book in advance." },
    { icon: <FileText size={20} />, title: "Permits Required", description: "Indian tourists need photo ID. Foreigners require RAP." },
    { icon: <Wifi size={20} />, title: "Connectivity", description: "Limited on remote islands. Download maps offline." }
  ];

  return (
    <div className={`${generalBgColor} min-h-screen`} style={{ fontFamily: generalPageFont }}>
      {/* --- Hero Section (Keeps new theme) --- */}
      <div className={`relative ${generalBgColor} text-center md:text-left pt-10 md:pt-0 md:h-[350px] flex flex-col justify-center items-center md:items-start`}>
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/images/destinations-hero.jpg"
            alt="Panoramic view of Andaman Islands - Desktop"
            fill
            className="object-cover opacity-20" // Opacity adjusted for generalBgColor
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-8 md:py-0">
          <h1 className={`${generalPrimaryText} text-3xl md:text-4xl font-bold leading-tight mb-3`}>
            Explore the Andaman Islands
          </h1>
          <p className={`${generalSecondaryText} text-base md:text-lg max-w-2xl mb-6 mx-auto md:mx-0`}>
            Discover breathtaking beaches, lush forests, and vibrant marine life across this stunning archipelago.
          </p>
          <Link
            href="/packages"
            className={`inline-flex items-center justify-center ${generalUiElementBg} ${generalPrimaryText} text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#e5e2e0] transition-colors`} // Assuming #e5e2e0 is a hover variant of generalUiElementBg
          >
            View All Packages <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* --- Search Bar Section (Keeps new theme) --- */}
      <div className={`px-4 py-5 sticky top-0 z-30 ${generalBgColor}/80 backdrop-blur-md border-b border-[${generalUiElementBg.replace('bg-', 'hsl(').replace(']', '/1)')}]`}> {/* Assuming border color derived from generalUiElementBg */}
        <label className="flex flex-col min-w-40 h-12 w-full max-w-2xl mx-auto">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className={`${generalSecondaryText} flex border-none ${generalUiElementBg} items-center justify-center pl-4 rounded-l-xl border-r-0`}>
              <Search size={20} />
            </div>
            <input
              placeholder="Where to? (e.g., Havelock, Neil Island, coral reefs)"
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl ${generalPrimaryText} focus:outline-0 focus:ring-0 border-none ${generalUiElementBg} h-full placeholder:${generalSecondaryText.replace('text-', 'placeholder-')} px-4 text-base font-normal leading-normal`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* --- Featured Destinations (Horizontally Scrollable, uses restored DestinationCard) --- */}
      {status === 'success' && featuredScrollDestinations.length > 0 && (
        <section className="pt-8 md:pt-12">
          {/* Heading uses general page theme */}
          <h2 className={`${generalPrimaryText} text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3`}>
            Featured Destinations
          </h2>
          <div className="overflow-x-auto pb-6 px-4 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch gap-6 py-2">
              {featuredScrollDestinations.map((destination) => (
                <DestinationCard key={`featured-${destination.id}`} destination={destination} isScrollableItem={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- All Destinations Grid (Uses restored DestinationCard) --- */}
      <section className="py-8 md:py-10 px-4">
        <h2 className={`${generalPrimaryText} text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5 pt-2 text-center md:text-left`}>
          {searchQuery ? `Results for "${searchQuery}"` : "All Destinations"}
        </h2>
        {status === 'loading' && loadingIndicator}
        {status === 'error' && errorIndicator(error?.message)}
        {status === 'success' && filteredDestinationsForGrid.length === 0 && noDataIndicator(searchQuery ? 'matching destinations' : 'destinations')}
        {status === 'success' && filteredDestinationsForGrid.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8"> {/* Adjusted grid cols & gap for original card style */}
            {filteredDestinationsForGrid.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      {/* --- Travel Tips Section (Keeps new theme) --- */}
      <section className={`py-8 md:py-12 px-4 ${generalUiElementBg}/50`}>
        <h2 className={`${generalPrimaryText} text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5 pt-2 text-center`}>
          Essential Travel Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {travelTips.map((tip, index) => (
            <TravelTip
              key={index}
              icon={tip.icon}
              title={tip.title}
              description={tip.description}
            />
          ))}
        </div>
      </section>

      {/* --- Call to Action Section (Keeps new theme) --- */}
      <section className={`py-12 md:py-16 px-4 text-center ${generalBgColor}`}>
        <h2 className={`${generalPrimaryText} text-2xl md:text-3xl font-bold mb-3`}>Ready to Explore Andaman?</h2>
        <p className={`${generalSecondaryText} max-w-xl mx-auto mb-8 text-base`}>
          Let us help you plan your dream vacation. Browse our packages or contact us for a custom itinerary.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/packages" // Primary CTA using general page theme but with distinct primary action style
            className={`inline-flex items-center justify-center ${generalPrimaryText.replace('text-', 'bg-')} ${generalBgColor.replace('bg-', 'text-')} text-sm font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity`}
          >
            Browse Packages <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/contact" // Secondary CTA using general page theme
            className={`inline-flex items-center justify-center ${generalUiElementBg} ${generalPrimaryText} text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#e5e2e0] transition-colors`}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

// Main component wrapper with Suspense
export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className={`${generalBgColor} min-h-screen flex items-center justify-center`} style={{ fontFamily: generalPageFont }}>{loadingIndicator}</div>}>
      <DestinationsContent />
    </Suspense>
  );
}