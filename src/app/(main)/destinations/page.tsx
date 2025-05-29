// Path: ./src/app/destinations/page.tsx
// Theme: Neutral with Contextual Background Colors

'use client';
export const dynamic = 'force-dynamic'
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Loader2,
  AlertTriangle,
  MapPin,
  Package,
  Clock,
  Star,
  Info,
  Calendar,
  Plane,
  FileText,
  Wifi,
  Camera,
  ArrowRight,
  ChevronRight,
  Heart,
  Users,
  Compass,
  Anchor,
  IndianRupee
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';

// --- Define Interfaces (consistent with API response) ---
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

// --- Define Common Styles (Neutral Theme with Contextual Colors) ---
const primaryButtonBg = 'bg-gray-800';
const primaryButtonHoverBg = 'hover:bg-gray-900';
const primaryButtonText = 'text-white';

const secondaryButtonBg = 'bg-white/20 backdrop-blur-sm';
const secondaryButtonHoverBg = 'hover:bg-white/30';
const secondaryButtonText = 'text-white';
const secondaryButtonBorder = 'border border-white/40';

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

const tipBg = 'bg-yellow-50';
const tipBorder = 'border-yellow-100';
const tipText = 'text-yellow-800';
const tipIconColor = 'text-yellow-700';

const errorBg = 'bg-red-50';
const errorBorder = 'border-red-200';
const errorText = 'text-red-700';
const errorIconColor = 'text-red-500';

const neutralBgLight = 'bg-gray-50';
const neutralBorderLight = 'border-gray-100';
const neutralBg = 'bg-gray-100';
const neutralBorder = 'border-gray-200';
const neutralText = 'text-gray-800';
const neutralTextLight = 'text-gray-600';
const neutralIconColor = 'text-gray-600';

const sectionPadding = "py-12 md:py-16";
const sectionHeadingStyle = `text-3xl md:text-4xl font-bold ${neutralText}`;
const cardBaseStyle = `bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${neutralBorderLight} flex flex-col h-full group`;
const cardImageContainerStyle = "h-52 sm:h-60 w-full relative flex-shrink-0 overflow-hidden";
const cardContentStyle = "p-5 flex flex-col flex-grow";
const cardTitleStyle = `text-lg md:text-xl font-semibold mb-2 ${neutralText}`;
const cardLinkStyle = `inline-flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm group/link mt-auto pt-4 border-t ${neutralBorderLight}`; // Neutral link color
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`;
const buttonSecondaryStyleHero = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} font-semibold py-3 px-8 rounded-full transition-all duration-300`;
const loadingErrorBaseStyle = "text-center py-10 px-4 rounded-2xl shadow-md";
const loadingIndicator = <div className={`flex flex-col justify-center items-center py-20`}><div className="relative w-16 h-16"><div className={`absolute top-0 left-0 w-full h-full border-4 ${neutralBorder} rounded-full`}></div><div className={`absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full border-t-transparent animate-spin`}></div></div><span className={`mt-4 text-lg ${neutralTextLight} font-medium`}>Loading destinations...</span></div>;
const errorIndicator = (message: string | undefined) => (
  <div className={`${loadingErrorBaseStyle} ${errorBg} ${errorBorder}`}>
    <AlertTriangle className={`h-8 w-8 ${errorIconColor} mx-auto mb-2`} />
    <p className={`${errorText} font-semibold`}>Could not load data.</p>
    <p className={`${errorText} text-sm mt-1`}>{message || 'Please try again later.'}</p>
    <button className={`mt-3 px-4 py-1.5 bg-red-100 ${errorText} rounded-lg hover:bg-red-200 transition-colors font-medium text-sm`}>
      Try Again
    </button>
  </div>
);
const noDataIndicator = (itemType: string) => (
  <div className={`${loadingErrorBaseStyle} bg-white text-gray-500 flex flex-col items-center`}>
    <div className={`w-16 h-16 ${neutralBg} rounded-full flex items-center justify-center mb-3`}>
      <AlertTriangle className="h-8 w-8 text-gray-400" />
    </div>
    <p className={`${neutralTextLight} font-medium`}>No {itemType} available right now.</p>
    <p className="text-gray-500 text-sm mt-1">Please check back soon for updates.</p>
  </div>
);
// --- End Common Styles ---

// --- LoadingSpinner Component (Already defined in common styles) ---
const LoadingSpinner = () => loadingIndicator;

// --- DestinationCard Component ---
interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const imageUrl = destination.images?.split(',')[0]?.trim() || '/images/placeholder.jpg';
  const locationDisplay = "Andaman Islands";
  const attractionsCount = destination.attractions
    ? destination.attractions.split(',').length
    : Math.floor(Math.random() * 6) + 3;

  return (
    <div className={cardBaseStyle}>
      <div className={cardImageContainerStyle}>
        <Image
          src={imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute bottom-3 left-3 bg-white/90 ${neutralText} text-xs font-medium py-1.5 px-3 rounded-full flex items-center backdrop-blur-sm`}>
          <MapPin size={12} className="mr-1.5" />
          {locationDisplay}
        </div>
        <button className="absolute top-3 right-3 bg-white/90 text-gray-700 hover:text-red-500 p-2 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300">
          <Heart size={16} />
        </button>
      </div>
      <div className={cardContentStyle}>
        <h2 className={cardTitleStyle}>{destination.name}</h2>
        <p className={`text-sm ${neutralTextLight} mb-4 line-clamp-3 flex-grow`}>
          {destination.description || 'Explore this beautiful destination.'}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className={`text-xs ${neutralTextLight} flex items-center`}>
            <Camera size={14} className={`mr-1.5 ${neutralIconColor}`} /> {/* Neutral icon color */}
            {attractionsCount} Attractions
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

// --- Featured Destination Component ---
interface FeaturedDestinationProps {
  destination: Destination;
  index: number;
}

const FeaturedDestination = ({ destination, index }: FeaturedDestinationProps) => {
  const imageUrl = destination.images?.split(',')[0]?.trim() || '/images/placeholder.jpg';

  return (
    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
      <Image
        src={imageUrl}
        alt={destination.name}
        fill
        className="object-cover"
        priority={index === 0}
        onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="flex items-center text-white/80 text-sm mb-3">
          <MapPin size={14} className="mr-1.5" /> Andaman Islands
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{destination.name}</h3>
        <p className="text-white/90 mb-6 max-w-2xl line-clamp-2">
          {destination.description || 'Discover the unique charm and beauty of this destination.'}
        </p>
        <Link
          href={`/destinations/${destination.id}`}
          className={buttonSecondaryStyleHero}
        >
          Explore {destination.name} <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};
// --- End Featured Destination Component ---

// --- Package Card Component ---
interface PackageCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  rating: number;
  reviews: number;
  slug: string;
}

const PackageCard = ({ title, description, price, duration, image, rating, reviews, slug }: PackageCardProps) => {
  return (
    <div className={cardBaseStyle}>
      <div className={cardImageContainerStyle}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute top-3 right-3 ${primaryButtonBg} ${primaryButtonText} text-sm font-bold py-1.5 px-3 rounded-full shadow-md flex items-center`}>
          <IndianRupee size={12} className="mr-0.5" /> {price.replace('₹', '')}
        </div>
        <div className={`absolute bottom-3 left-3 bg-white/90 ${neutralText} text-xs font-medium py-1.5 px-3 rounded-full flex items-center backdrop-blur-sm`}>
          <Clock size={12} className="mr-1.5" />
          {duration}
        </div>
      </div>
      <div className={cardContentStyle}>
        <h3 className={cardTitleStyle}>{title}</h3>
        <p className={`text-sm ${neutralTextLight} mb-4 line-clamp-2`}>
          {description}
        </p>
        <div className="mb-4">
          <div className={`flex items-center ${neutralTextLight} text-xs mb-1`}>
            <div className={`w-3 h-3 rounded-full ${neutralBg} flex items-center justify-center mr-1.5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${primaryButtonBg}`}></div>
            </div>
            <span>Hotel stays included</span>
          </div>
          <div className={`flex items-center ${neutralTextLight} text-xs mb-1`}>
            <div className={`w-3 h-3 rounded-full ${neutralBg} flex items-center justify-center mr-1.5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${primaryButtonBg}`}></div>
            </div>
            <span>All transfers & sightseeing</span>
          </div>
          <div className={`flex items-center ${neutralTextLight} text-xs`}>
            <div className={`w-3 h-3 rounded-full ${neutralBg} flex items-center justify-center mr-1.5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${primaryButtonBg}`}></div>
            </div>
            <span>Expert local guides</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-yellow-500"> {/* Keep stars yellow for rating */}
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${i < rating ? 'fill-current' : 'fill-current opacity-30'}`}
              />
            ))}
            <span className={`ml-1.5 text-xs ${neutralTextLight}`}>({reviews} reviews)</span>
          </div>
          <Link
            href={`/packages/${slug}`}
            className={cardLinkStyle}
          >
            View Details
            <ArrowRight size={16} className="ml-1.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
// --- End Package Card Component ---

// --- Travel Tip Card Component ---
interface TravelTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColorClass: string; // e.g., 'bg-blue-50'
  borderColorClass: string; // e.g., 'border-blue-100'
  iconColorClass: string; // e.g., 'text-blue-600'
}

const TravelTip = ({ icon, title, description, bgColorClass, borderColorClass, iconColorClass }: TravelTipProps) => {
  return (
    <div className={`p-6 rounded-2xl shadow-md border ${borderColorClass} ${bgColorClass} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className={`w-14 h-14 bg-white rounded-full flex items-center justify-center mb-5 border ${borderColorClass}`}>
        <div className={iconColorClass}>
          {icon}
        </div>
      </div>
      <h3 className={`text-lg font-semibold mb-3 ${neutralText}`}>{title}</h3>
      <p className={`${neutralTextLight} text-sm`}>{description}</p>
    </div>
  );
};
// --- End Travel Tip Card Component ---

// --- Main Component Logic ---
function DestinationsContent() {
  const [activeDestination, setActiveDestination] = useState(0);
  const { data: apiResponse, error, status } = useFetch<Destination[]>('/api/destinations');
  const destinations = apiResponse || [];
  const featuredDestinations = destinations.slice(0, Math.min(3, destinations.length));

  // Hardcoded package data for example
  const featuredPackages = [
    {
      id: 1,
      title: "Havelock Honeymoon Special",
      description: "Romantic getaway with beach dinners and couple's spa.",
      price: "25,000",
      duration: "4 Days",
      image: "/images/packages/package1.jpg",
      rating: 5,
      reviews: 120,
      slug: "havelock-honeymoon-special"
    },
    {
      id: 2,
      title: "Neil Island Family Fun",
      description: "Kid-friendly activities, comfortable stays, and island hopping.",
      price: "18,000",
      duration: "5 Days",
      image: "/images/packages/package2.jpg",
      rating: 4,
      reviews: 85,
      slug: "neil-island-family-fun"
    },
    {
      id: 3,
      title: "Andaman Adventure Seeker",
      description: "Scuba diving, trekking, and exploring hidden gems.",
      price: "30,000",
      duration: "6 Days",
      image: "/images/packages/package3.jpg",
      rating: 5,
      reviews: 98,
      slug: "andaman-adventure-seeker"
    }
  ];

  // Travel tips data with contextual color classes
  const travelTips = [
    {
      icon: <Calendar size={24} />,
      title: "Best Time to Visit",
      description: "October to May is ideal with clear skies and calm seas, perfect for water activities and island exploration.",
      bgColorClass: infoBg,
      borderColorClass: infoBorder,
      iconColorClass: infoIconColor
    },
    {
      icon: <Plane size={24} />,
      title: "Getting There",
      description: "Direct flights available from major Indian cities to Port Blair. Book in advance for better rates.",
      bgColorClass: infoBg,
      borderColorClass: infoBorder,
      iconColorClass: infoIconColor
    },
    {
      icon: <FileText size={24} />,
      title: "Permits Required",
      description: "Indian tourists need a photo ID. Foreign tourists require a Restricted Area Permit (RAP) issued on arrival.",
      bgColorClass: warningBg, // Warning color for permits
      borderColorClass: warningBorder,
      iconColorClass: warningIconColor
    },
    {
      icon: <Wifi size={24} />,
      title: "Connectivity",
      description: "Internet connectivity can be limited on remote islands. Download maps and essential information beforehand.",
      bgColorClass: tipBg, // Tip color for connectivity advice
      borderColorClass: tipBorder,
      iconColorClass: tipIconColor
    }
  ];

  // Popular activities data
  const popularActivities = [
    {
      icon: <Anchor size={24} />,
      title: "Scuba Diving",
      description: "Explore vibrant coral reefs.",
      bgColorClass: infoBg,
      borderColorClass: infoBorder,
      iconColorClass: infoIconColor
    },
    {
      icon: <Compass size={24} />,
      title: "Island Hopping",
      description: "Visit multiple islands easily.",
      bgColorClass: infoBg,
      borderColorClass: infoBorder,
      iconColorClass: infoIconColor
    },
    {
      icon: <Users size={24} />,
      title: "Beach Camping",
      description: "Sleep under the stars.",
      bgColorClass: tipBg,
      borderColorClass: tipBorder,
      iconColorClass: tipIconColor
    },
    {
      icon: <Camera size={24} />,
      title: "Photography Tours",
      description: "Capture stunning landscapes.",
      bgColorClass: tipBg,
      borderColorClass: tipBorder,
      iconColorClass: tipIconColor
    }
  ];

  return (
    <>
      {/* --- Hero Section (Neutral Theme) --- */}
      <div className="relative h-[400px] md:h-[500px] bg-gray-800"> {/* Dark neutral background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/destinations-hero.jpg"
            alt="Panoramic view of Andaman Islands - Desktop"
            fill
            className="object-cover opacity-40" /* Adjusted opacity */
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
          <nav className="text-sm text-white/80 mb-2" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight size={14} className="mx-1" />
              </li>
              <li className="flex items-center">
                <span className="text-white font-medium">Destinations</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            Explore the Andaman Islands
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 drop-shadow-md">
            Discover breathtaking beaches, lush forests, and vibrant marine life across this stunning archipelago.
          </p>
          <Link href="/packages" className={buttonSecondaryStyleHero}>
            View All Packages <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* --- Featured Destinations Carousel (Neutral) --- */}
      {status === 'success' && featuredDestinations.length > 0 && (
        <section className={`${sectionPadding} ${neutralBgLight}`}> {/* Light neutral background */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className={sectionHeadingStyle}>Top Destinations</h2>
              <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Start your journey by exploring these must-visit islands.</p>
            </div>
            <div className="relative">
              {featuredDestinations.map((dest, index) => (
                <div
                  key={dest.id}
                  className={`transition-opacity duration-500 ease-in-out ${index === activeDestination ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'}`}
                >
                  <FeaturedDestination destination={dest} index={index} />
                </div>
              ))}
              {/* Carousel Controls */}
              <div className="flex justify-center mt-6 space-x-2">
                {featuredDestinations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDestination(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeDestination ? primaryButtonBg : neutralBg}`}
                    aria-label={`Go to featured destination ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- All Destinations Grid (Neutral) --- */}
      <section className={sectionPadding}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>All Destinations</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Browse through all the beautiful locations Andaman has to offer.</p>
          </div>
          {status === 'loading' && <LoadingSpinner />}
          {status === 'error' && errorIndicator(error?.message)}
          {status === 'success' && destinations.length === 0 && noDataIndicator('destinations')}
          {status === 'success' && destinations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Popular Activities Section (Contextual Backgrounds) --- */}
      <section className={`${sectionPadding} ${neutralBgLight}`}> {/* Light neutral background */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Popular Activities</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Experience the best adventures Andaman has to offer.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularActivities.map((tip, index) => (
              <TravelTip
                key={index}
                icon={tip.icon}
                title={tip.title}
                description={tip.description}
                bgColorClass={tip.bgColorClass}
                borderColorClass={tip.borderColorClass}
                iconColorClass={tip.iconColorClass}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured Packages Section (Neutral) --- */}
      <section className={sectionPadding}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Featured Packages</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Handpicked packages for an unforgettable Andaman experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                title={pkg.title}
                description={pkg.description}
                price={pkg.price}
                duration={pkg.duration}
                image={pkg.image}
                rating={pkg.rating}
                reviews={pkg.reviews}
                slug={pkg.slug}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/packages" className={buttonPrimaryStyle}>
              Explore All Packages <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Travel Tips Section (Contextual Backgrounds) --- */}
      <section className={`${sectionPadding} ${neutralBgLight}`}> {/* Light neutral background */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Essential Travel Tips</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Plan your trip smoothly with these helpful insights.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map((tip, index) => (
              <TravelTip
                key={index}
                icon={tip.icon}
                title={tip.title}
                description={tip.description}
                bgColorClass={tip.bgColorClass}
                borderColorClass={tip.borderColorClass}
                iconColorClass={tip.iconColorClass}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Call to Action Section (Contextual Background) --- */}
      <section className={`${sectionPadding} ${infoBg} border-t ${infoBorder}`}> {/* Info Blue background */}
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold ${infoText} mb-4`}>Ready to Explore Andaman?</h2>
          <p className={`${neutralTextLight} max-w-xl mx-auto mb-8`}>Let us help you plan your dream vacation. Browse our packages or contact us for a custom itinerary.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/packages" className={buttonPrimaryStyle}>
              Browse Packages <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold py-3 px-8 rounded-full transition-all duration-300`}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Main component wrapper with Suspense
export default function DestinationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DestinationsContent />
    </Suspense>
  );
}
