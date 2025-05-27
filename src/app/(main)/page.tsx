'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Loader2,
  AlertTriangle,
  Check,
  Camera,
  Package as PackageIcon,
  IndianRupee,
  Clock,
  MessageSquare,
  Award,
  PhoneCall,
  ChevronRight,
  Star,
  Anchor,
  Compass,
  Users,
  ArrowRight,
  Mail,
  Calendar,
  Heart,
  DollarSign,
  ChevronDown, IndianRupeeIcon
} from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/navigation';

// --- Define Interfaces ---
interface GetDestinationsApiResponse {
  success: boolean;
  data: Destination[];
  message?: string;
}

interface Destination {
  id: number;
  name: string;
  description: string | null;
  images: string | null;
  slug?: string;
}

interface Activity {
  id: number;
  name: string;
  description: string | null;
  images: string | null;
  island_name?: string;
  slug?: string;
}

interface Package {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  base_price: number;
  max_people: number | null;
  images: string[] | null;
  slug?: string;
}

interface GetPackagesApiResponse {
  packages: Package[];
  pagination?: any;
  success?: boolean;
  message?: string;
}
// --- End Interfaces ---

export default function Home() {
  const router = useRouter();

  // State for featured destination carousel
  const [activeDestination, setActiveDestination] = useState(0);

  // State for testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // State for Homepage Search Filters
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // --- Define Common Styles (Neutral Theme with Contextual Colors) ---
  const primaryButtonBg = 'bg-gray-800';
  const primaryButtonHoverBg = 'bg-gray-900';
  const primaryButtonText = 'text-white';

  const secondaryButtonBg = 'bg-white/20 backdrop-blur-sm';
  const secondaryButtonHoverBg = 'bg-white/30';
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

  const sectionPadding = "py-8 md:py-12"; // Reduced padding
  const sectionHeadingStyle = `text-2xl sm:text-3xl md:text-4xl font-bold ${neutralText}`; // Adjusted mobile size
  const cardBaseStyle = `bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03] ${neutralBorderLight} flex flex-col h-full`;
  const cardImageContainerStyle = "h-48 sm:h-52 w-full relative flex-shrink-0";
  const cardContentStyle = "p-3 sm:p-4 flex flex-col flex-grow"; // Adjusted mobile padding
  const cardTitleStyle = `text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${neutralText} line-clamp-2`; // Adjusted mobile size & margin
  const cardLinkStyle = `inline-flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm group mt-auto pt-2 border-t ${neutralBorderLight}`; // Neutral link color
  const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`; // Increased padding for touch target
  const buttonSecondaryStyleHero = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} font-semibold py-2.5 px-6 rounded-full transition-all duration-300`;
  const loadingErrorBaseStyle = "text-center py-10 px-4 rounded-2xl shadow-md";
  const loadingIndicator = <div className={`flex justify-center items-center ${loadingErrorBaseStyle} bg-white`}><Loader2 className={`h-8 w-8 animate-spin ${neutralIconColor}`} /> <span className={`ml-3 ${neutralTextLight} font-medium`}>Loading...</span></div>;
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
      <p className={`${neutralTextLight} font-medium`}>No featured {itemType} available right now.</p>
      <p className="text-gray-500 text-sm mt-1">Please check back soon for updates.</p>
    </div>
  );
  // --- End Common Styles ---

  // --- Fetch Destinations ---
  const {
    data: destinationsResponse,
    error: destinationsError,
    status: destinationsStatus
  } = useFetch<Destination[]>('/api/destinations');
  const featuredDestinationsData = destinationsResponse || [];

  // --- Fetch Activities ---
  const {
    data: activitiesResponse,
    error: activitiesError,
    status: activitiesStatus
  } = useFetch<Activity[]>('/api/activities');
  const popularActivitiesData = activitiesResponse || [];

  // --- Fetch Packages ---
  const {
    data: packagesApiResponse,
    error: packagesError,
    status: packagesStatus
  } = useFetch<GetPackagesApiResponse>('/api/packages?limit=10');
  const featuredPackagesData = packagesApiResponse?.packages || [];
  // --- End Data Fetching ---

  // Helper to get the first image URL
  const getImageUrl = (images: string | string[] | null): string => {
    if (!images) return '/images/placeholder.jpg';

    let imageUrl: string | undefined;

    if (Array.isArray(images)) {
      imageUrl = images[0]?.trim();
    } else if (typeof images === 'string') {
      imageUrl = images.split(',')[0]?.trim();
    }

    return imageUrl && imageUrl.startsWith('/') ? imageUrl : '/images/placeholder.jpg';
  };

  // Helper to generate slugs
  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  // Placeholder data for scrolling ad banner
  const adCards = [
    {
      image: '/images/activities/scroll.webp',
      link: '/activities',
      alt: 'Activities in Andaman Islands'
    },
    {
      image: '/images/packages/scroll.webp',
      link: '/packages',
      alt: 'Reach Andaman Packages'
    },
    {
      image: '/images/hotels/scroll.webp',
      link: '/hotels',
      alt: 'Hotels in Andaman Islands'
    },
    {
      image: '/images/services/scroll.webp',
      link: '/services',
      alt: 'Romantic Sunset Cruise'
    },
    {
      image: '/images/destinations/scroll.webp',
      link: '/destinations',
      alt: 'Explore Andaman Islands'
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sharath Prabhu",
      location: "Mumbai, India",
      image: "/images/testimonials/sharath.webp",
      quote: "The snorkeling experience at Havelock Island was incredible! Flawless organization and friendly guides. Highly recommend Reach Andaman!",
      rating: 5,
      trip: "Havelock Island Adventure"
    },
    {
      name: "Sindhuja Ramaswamy",
      location: "Delhi, India",
      image: "/images/testimonials/sindhuja.webp",
      quote: "From booking to return, everything was perfectly organized. The team went above and beyond to make our family trip memorable.",
      rating: 5,
      trip: "Family Island Hopping"
    },
    {
      name: "Sushanth Shetty",
      location: "Bangalore, India",
      image: "/images/testimonials/sushanth.webp",
      quote: "The sunset cruise around Neil Island was the highlight. Stunning views and excellent service. Thank you for an unforgettable holiday!",
      rating: 5,
      trip: "Neil Island Explorer"
    }
  ];

  // Featured experiences data
  const featuredExperiences = [
    {
      title: "Scuba Diving",
      description: "Explore vibrant coral reefs and marine life with certified instructors",
      image: "/images/experiences/scuba.jpg",
      icon: <Anchor className="h-6 w-6" />
    },
    {
      title: "Island Hopping",
      description: "Visit multiple islands in one day with our curated boat tours",
      image: "/images/experiences/island-hopping.jpg",
      icon: <Compass className="h-6 w-6" />
    },
    {
      title: "Beach Camping",
      description: "Experience the magic of sleeping under the stars by pristine beaches",
      image: "/images/experiences/camping.jpg",
      icon: <Users className="h-6 w-6" />
    }
  ];

  // Handle navigation to Packages page with filters
  const handleFindPackagesClick = () => {
    const params = new URLSearchParams();
    if (selectedDuration) {
      params.set('duration', selectedDuration);
    }
    if (selectedPriceRange) {
      params.set('priceRange', selectedPriceRange);
    }
    const queryString = params.toString();
    const url = `/packages${queryString ? `?${queryString}` : ''}`;
    router.push(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* --- Global Styles for Animation --- */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        /* Default animation speed for mobile */
        .animate-infinite-scroll-mobile {
          animation: infinite-scroll 30s linear infinite; /* Faster for mobile */
        }
        /* Slower animation speed for desktop (medium screens and up) */
        @media (min-width: 768px) {
          .md\\:animate-infinite-scroll-desktop {
            animation-duration: 120s; /* Slower for desktop */
          }
        }
        .group:hover .animate-infinite-scroll-mobile,
        .group:hover .md\\:animate-infinite-scroll-desktop {
            animation-play-state: paused;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* --- Enhanced Hero Section (Remains Neutral) --- */}
      <section className="relative">
        <div className="relative h-[450px] sm:h-[500px] md:h-[600px] w-full">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-min.webp"
              alt="Andaman Islands paradise beaches"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-10"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20 pt-8 sm:pt-12"> {/* Reduced mobile top padding */}
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg"> {/* Adjusted mobile size & margin */}
                Discover Paradise in <span className="text-gray-200">Andaman</span> {/* Neutral highlight */}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mb-5 sm:mb-6 drop-shadow-md"> {/* Adjusted mobile size & margin */}
                Explore pristine beaches, vibrant coral reefs, and unforgettable experiences tailor-made for your perfect island getaway.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/packages" className={buttonSecondaryStyleHero}>
                  Explore Packages <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
                <Link href="/destinations" className={buttonSecondaryStyleHero}>
                  View Destinations
                </Link>
              </div>
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl"> {/* Adjusted mobile cols & gap, reduced top margin */}
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 ${secondaryButtonBorder}`}> {/* Adjusted padding for mobile */}
                  <p className="text-white text-xs">10+</p>
                  <p className="text-white text-xs">Islands to Explore</p>
                </div>
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 ${secondaryButtonBorder}`}> {/* Adjusted padding for mobile */}
                  <p className="text-white text-xs">50+</p>
                  <p className="text-white text-xs">Curated Packages</p>
                </div>
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 ${secondaryButtonBorder}`}> {/* Adjusted padding for mobile */}
                  <p className="text-white text-xs">1000+</p>
                  <p className="text-white text-xs">Happy Travelers</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- Enhanced Search Bar (Contextual Background) --- */}
      <section className={`py-6 ${neutralBgLight} relative z-30`}> {/* Light neutral background */}
        <div className="container mx-auto px-4">
          <div className={`bg-white rounded-2xl shadow-xl p-4 mt-6 md:-mt-16 ${neutralBorderLight}`}> {/* Adjusted margin for mobile */}
            <h2 className={`text-lg font-bold ${neutralText} mb-3 text-center`}>Find Your Perfect Andaman Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Duration Select */}
              <div className="relative">
                <label htmlFor="homeDuration" className={`block text-xs font-medium ${neutralTextLight} mb-1`}>Duration</label>
                <div className="relative">
                  <Clock className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={16} />
                  <select
                    id="homeDuration"
                    name="duration"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className={`w-full pl-8 pr-8 py-2.5 text-sm ${neutralTextLight} bg-white border ${neutralBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 appearance-none`}
                  >
                    <option value="">Any Duration</option>
                    <option value="1-3">1-3 Days</option>
                    <option value="4-6">4-6 Days</option>
                    <option value="7-10">7-10 Days</option>
                    <option value="10+">10+ Days</option>
                  </select>
                  <ChevronDown className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={16} />
                </div>
              </div>
              {/* Price Range Select */}
              <div className="relative">
                <label htmlFor="homePriceRange" className={`block text-xs font-medium ${neutralTextLight} mb-1`}>Price Range (per person)</label>
                <div className="relative">
                  <IndianRupee className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={16} />
                  <select
                    id="homePriceRange"
                    name="priceRange"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className={`w-full pl-8 pr-8 py-2.5 text-sm ${neutralTextLight} bg-white border ${neutralBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 appearance-none`}
                  >
                    <option value="">Any Price</option>
                    <option value="0-10000">₹0 - ₹10,000</option>
                    <option value="10001-20000">₹10,001 - ₹20,000</option>
                    <option value="20001-30000">₹20,001 - ₹30,000</option>
                    <option value="30001+">₹30,001+</option>
                  </select>
                  <ChevronDown className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 ${neutralIconColor} pointer-events-none`} size={16} />
                </div>
              </div>
              {/* Find Packages Button */}
              <div className="md:mt-[19px]"> {/* Align button with selects */}
                <button
                  onClick={handleFindPackagesClick}
                  className={`${buttonPrimaryStyle} w-full justify-center`}
                >
                  Find Packages <ArrowRight className="ml-1.5 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Auto-Scrolling cards --- */}
      <section className={sectionPadding}> {/* Changed from py-6 ${neutralBg} to match featured destinations */}
        <div className="container mx-auto px-4">


          {/* Outer container to hide overflow */}
          <div className="overflow-hidden relative group"> {/* Added group for hover pause */}
            {/* Inner container that scrolls */}
            {/* Apply responsive animation classes */}
            <div className="flex animate-infinite-scroll-mobile md:animate-infinite-scroll-desktop group-hover:pause-animation">
              {/* Render cards twice for seamless loop */}
              {[...adCards, ...adCards].map((card, index) => (
                <Link
                  key={`ad-${index}`}
                  href={card.link}
                  className={`flex-shrink-0 w-56 h-28 ${neutralBgLight} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 mx-2 hover:scale-105 cursor-pointer`}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    width={224} // w-56 = 14rem = 224px
                    height={112} // h-28 = 7rem = 112px
                    className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Link>
              ))}
            </div>
            {/* Optional: Add fade effect at edges */}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* --- Featured Destinations Section (Neutral Cards) --- */}
      <section className={sectionPadding}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Featured Destinations</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Discover the most popular islands and attractions in the Andaman archipelago.</p>
          </div>
          {destinationsStatus === 'loading' && loadingIndicator}
          {destinationsStatus === 'error' && errorIndicator(destinationsError?.message)}
          {destinationsStatus === 'success' && featuredDestinationsData.length === 0 && noDataIndicator('destinations')}
          {destinationsStatus === 'success' && featuredDestinationsData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDestinationsData.slice(0, 4).map((destination) => (
                <Link key={destination.id} href={`/destinations/${destination.id}`} className={cardBaseStyle}>
                  <div className={cardImageContainerStyle}>
                    <Image
                      src={getImageUrl(destination.images)}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className={cardContentStyle}>
                    <h3 className={cardTitleStyle}>{destination.name}</h3>
                    <p className={`text-sm ${neutralTextLight} mb-3 line-clamp-3 flex-grow`}>{destination.description || 'Explore this beautiful destination.'}</p>
                    <span className={cardLinkStyle}>
                      Explore <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Unforgettable Experiences Section (Neutral Cards) --- */}
      <section className={`${sectionPadding} ${neutralBgLight}`}> {/* Light neutral background */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Unforgettable Experiences</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Dive into adventure, relax on pristine beaches, or explore unique island cultures.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredExperiences.map((exp, index) => (
              <div key={index} className={cardBaseStyle}>
                <div className={cardImageContainerStyle}>
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm ${neutralIconColor}`}>
                    {exp.icon}
                  </div>
                </div>
                <div className={cardContentStyle}>
                  <h3 className={cardTitleStyle}>{exp.title}</h3>
                  <p className={`text-sm ${neutralTextLight} mb-3 line-clamp-2 flex-grow`}>{exp.description}</p>
                  <span className={cardLinkStyle}>
                    Learn More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why Choose Us Section (Contextual Background for Icons) --- */}
      <section className={sectionPadding}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Why Choose Reach Andaman?</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Your trusted partner for creating unforgettable Andaman memories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${infoBg} rounded-full flex items-center justify-center mx-auto mb-4 border ${infoBorder}`}> {/* Info Blue */}
                <Award className={`h-8 w-8 ${infoIconColor}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${neutralText}`}>Expert Planning</h3>
              <p className={neutralTextLight}>Tailor-made itineraries crafted by local Andaman experts.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${successBg} rounded-full flex items-center justify-center mx-auto mb-4 border ${successBorder}`}> {/* Success Green */}
                <Check className={`h-8 w-8 ${successIconColor}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${neutralText}`}>Verified Partners</h3>
              <p className={neutralTextLight}>Handpicked hotels, certified guides, and reliable transport.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${tipBg} rounded-full flex items-center justify-center mx-auto mb-4 border ${tipBorder}`}> {/* Tip Yellow */}
                <PhoneCall className={`h-8 w-8 ${tipIconColor}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${neutralText}`}>24/7 Support</h3>
              <p className={neutralTextLight}>Dedicated assistance throughout your Andaman journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Featured Packages Section (Neutral Cards) --- */}
      <section className={`${sectionPadding} ${neutralBgLight}`}> {/* Light neutral background */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>Popular Packages</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Explore our best-selling Andaman holiday packages.</p>
          </div>
          {packagesStatus === 'loading' && loadingIndicator}
          {packagesStatus === 'error' && errorIndicator(packagesError?.message)}
          {packagesStatus === 'success' && featuredPackagesData.length === 0 && noDataIndicator('packages')}
          {packagesStatus === 'success' && featuredPackagesData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPackagesData.slice(0, 3).map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.id}`} className={cardBaseStyle}>
                  <div className={cardImageContainerStyle}>
                    <Image
                      src={getImageUrl(pkg.images)}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium ${neutralBg} ${neutralText} border ${neutralBorder}`}>
                      <Clock size={12} className="inline mr-1" /> {pkg.duration}
                    </div>
                  </div>
                  <div className={cardContentStyle}>
                    <h3 className={cardTitleStyle}>{pkg.name}</h3>
                    <p className={`text-sm ${neutralTextLight} mb-3 line-clamp-2 flex-grow`}>{pkg.description || 'An amazing package awaits.'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-lg font-bold ${neutralText}`}><IndianRupee size={16} className="inline -mt-1" />{pkg.base_price.toLocaleString('en-IN')}</span>
                      <span className={`text-xs ${neutralTextLight}`}>per person</span>
                    </div>
                    <span className={`${cardLinkStyle} mt-3`}> {/* Adjusted margin */}
                      View Details <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/packages" className={buttonPrimaryStyle}>
              View All Packages <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section (Contextual Background for Quote) --- */}
      <section className={sectionPadding}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={sectionHeadingStyle}>What Our Travelers Say</h2>
            <p className={`mt-3 text-lg ${neutralTextLight} max-w-2xl mx-auto`}>Real stories from adventurers who explored Andaman with us.</p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 ease-in-out ${index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'}`}
              >
                <div className={`p-6 rounded-2xl shadow-lg border ${neutralBorderLight} ${tipBg}`}> {/* Tip Yellow background */}
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
                      <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-lg ${neutralText}`}>{testimonial.name}</h4>
                      <p className={`text-sm ${neutralTextLight}`}>{testimonial.location}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${tipIconColor} fill-current`} />
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 text-gray-300 fill-current`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className={`text-lg italic ${neutralTextLight} border-l-4 ${tipBorder} pl-4 mb-4`}> {/* Tip Yellow border */}
                    "{testimonial.quote}"
                  </blockquote>
                  <p className={`text-sm font-medium ${neutralText}`}>Trip Taken: <span className="font-normal">{testimonial.trip}</span></p>
                </div>
              </div>
            ))}
            {/* Carousel Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeTestimonial ? primaryButtonBg : neutralBg}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Call to Action / Newsletter Section (Contextual Background) --- */}
      <section className={`${sectionPadding} ${infoBg} border-t ${infoBorder}`}> {/* Info Blue background */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-3xl font-bold ${infoText} mb-3`}>Ready for Your Andaman Adventure?</h2>
              <p className={`${neutralTextLight} mb-6`}>Let our experts help you craft the perfect island getaway. Contact us today for a personalized quote or subscribe for exclusive deals!</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className={buttonPrimaryStyle}>
                  Get a Free Quote <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
                <Link href="/about" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-full transition-all duration-300`}>
                  Learn More About Us
                </Link>
              </div>
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${infoText} mb-3`}>Stay Updated</h3>
              <p className={`${neutralTextLight} mb-4 text-sm`}>Subscribe to our newsletter for the latest travel tips, special offers, and Andaman news.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className={`flex-grow px-4 py-2.5 text-sm ${neutralText} bg-white border ${neutralBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400`}
                />
                <button type="submit" className={`${buttonPrimaryStyle} justify-center sm:w-auto`}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
