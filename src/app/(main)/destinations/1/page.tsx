'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Check,
    Info,
    Calendar,
    Bed,
    Utensils,
    Compass,
    Users,
    Shield,
    Leaf,
    ChevronRight,
    Star,
    Navigation,
    ArrowRight,
    MessageCircle,
    Camera,
    Plane,
    Ship,
    Landmark,
    Waves,
    LifeBuoy
} from 'lucide-react';

/* NOTE FOR FONT STYLING:
  For the font "Plus Jakarta Sans" to apply correctly, please add the following link to your root layout file (e.g., app/layout.tsx):
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?display=swap&family=Plus+Jakarta+Sans:wght@400;500;700;800"
  />
*/

// --- Define Common Styles (Copied from Baratang/Diglipur Sample - Neutral Theme with Contextual Colors) ---
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

// Unchanged Light Theme elements
const neutralBgLight = 'bg-gray-50';
const neutralBorderLight = 'border-gray-100';
const neutralBg = 'bg-gray-100';
const neutralBorder = 'border-gray-200';

// --- START: Updated Font Styles based on Inspiration ---
const primaryTextColor = 'text-[#0e151b]'; // Dark text color from inspiration
const secondaryTextColor = 'text-gray-600'; // Kept for consistency in detailed descriptions
const inactiveTextColor = 'text-[#4e7997]'; // Lighter, bluish text for inactive elements

// Updated section heading to match text-[22px] font-bold
const sectionHeadingStyle = `text-[22px] font-bold ${primaryTextColor} mb-6 flex items-center leading-tight tracking-[-0.015em]`;
// --- END: Updated Font Styles based on Inspiration ---

const cardBaseStyle = `bg-white rounded-2xl shadow-sm border ${neutralBorderLight} p-6 transition-shadow hover:shadow-md`;
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md`;
const buttonSecondaryStyleHero = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} px-6 py-3 rounded-full font-medium transition-all duration-300`;
// --- End Common Styles ---


export default function PortBlairPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    // State for the old gallery is no longer needed:
    // const [activeImage, setActiveImage] = useState(0);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    const galleryImages = [
        {
            src: "/images/portblair/cellular-jail-day.jpg",
            alt: "Cellular Jail National Memorial, Port Blair",
            caption: "Cellular Jail" // Shortened for new design
        },
        {
            src: "/images/portblair/ross-island-ruins.jpg",
            alt: "Ruins on Ross Island (Netaji Subhas Chandra Bose Dweep)",
            caption: "Ross Island" // Shortened for new design
        },
        {
            src: "/images/portblair/corbyns-cove.jpg",
            alt: "Corbyn's Cove Beach",
            caption: "Corbyn's Cove" // Shortened for new design
        },
        {
            src: "/images/portblair/harbor-view.jpg",
            alt: "Port Blair Harbor View",
            caption: "The Harbor" // Shortened for new design
        },
        {
            src: "/images/portblair/samudrika-museum.jpg",
            alt: "Samudrika Naval Marine Museum",
            caption: "Samudrika Museum" // Shortened for new design
        }
    ];

    return (
        <main
            className="bg-slate-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* Hero Section - Unchanged */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/portblair/hero.jpg"
                    alt="Aerial view of Port Blair harbor and Cellular Jail"
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                    <div className="container mx-auto">
                        <nav className="text-sm text-white/80 mb-2" aria-label="Breadcrumb">
                            <ol className="list-none p-0 inline-flex">
                                <li className="flex items-center">
                                    <Link href="/" className="hover:text-white">Home</Link>
                                    <ChevronRight size={14} className="mx-1" />
                                </li>
                                <li className="flex items-center">
                                    <Link href="/destinations" className="hover:text-white">Destinations</Link>
                                    <ChevronRight size={14} className="mx-1" />
                                </li>
                                <li className="flex items-center">
                                    <span className="text-white font-medium">Port Blair</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Port Blair</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">The vibrant capital and gateway to the Andaman Islands, rich in history and natural beauty.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Explore Port Blair <ArrowRight size={18} className="ml-2" />
                            </Link>
                            <button className={buttonSecondaryStyleHero} onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                                <Camera size={18} className="mr-2" /> View Gallery
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container - Unchanged Structure */}
            <div className="container mx-auto px-4 py-10 md:py-12">

                {/* Quick Facts Card - Unchanged Structure, inherits new font styles */}
                <div className={`${infoBg} rounded-2xl p-6 mb-12 shadow-sm border ${infoBorder}`}>
                    <h2 className={`text-xl font-semibold ${infoText} mb-4 flex items-center`}>
                        <Info className={`mr-2 ${infoIconColor}`} size={20} />
                        Quick Facts About Port Blair
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Capital city, located on South Andaman Island</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Cellular Jail, Museums, Ross Island, Corbyn's Cove, Ferry Hub</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Plane className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Gateway</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Primary entry via Veer Savarkar Int'l Airport (IXZ)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- START: Redesigned Image Gallery --- */}
                <div id="gallery" className="mb-10 scroll-mt-20">
                    <h2 className={`${sectionHeadingStyle} px-4`}>Gallery</h2>
                    <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex items-stretch p-4 gap-3">
                            {galleryImages.map((image, index) => (
                                <div key={index} className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-40">
                                    <div className="w-full aspect-square rounded-xl overflow-hidden">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={160}
                                            height={160}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className={`${primaryTextColor} text-base font-medium leading-normal`}>{image.caption}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* --- END: Redesigned Image Gallery --- */}

                {/* --- START: Redesigned Toggle/Tabbed Navigation --- */}
                <div className="flex px-4 py-3 mb-10">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#e7eef3] p-1">
                        <label
                            onClick={() => handleToggle(false)}
                            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all duration-300 ${!showComprehensive ? `bg-slate-50 shadow-[0_0_4px_rgba(0,0,0,0.1)] ${primaryTextColor}` : `${inactiveTextColor}`}`}
                        >
                            <span className="truncate">Brief Guide</span>
                            <input type="radio" name="guide-toggle" className="invisible w-0" value="Brief Guide" checked={!showComprehensive} readOnly />
                        </label>
                        <label
                            onClick={() => handleToggle(true)}
                            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all duration-300 ${showComprehensive ? `bg-slate-50 shadow-[0_0_4px_rgba(0,0,0,0.1)] ${primaryTextColor}` : `${inactiveTextColor}`}`}
                        >
                            <span className="truncate">Comprehensive Guide</span>
                            <input type="radio" name="guide-toggle" className="invisible w-0" value="Comprehensive Guide" checked={showComprehensive} readOnly />
                        </label>
                    </div>
                </div>
                {/* --- END: Redesigned Toggle/Tabbed Navigation --- */}

                {/* Content Based on Toggle - Unchanged, inherits new font styles */}
                {!showComprehensive ? (
                    // Brief Guide Content
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-10">
                            <section id="overview">
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${inactiveTextColor}`} size={24} /> Overview
                                </h2>
                                <div className={cardBaseStyle}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Port Blair, the capital and entry point to the Andaman Islands, blends colonial history (Cellular Jail), diverse museums, and serves as the main hub for ferries to popular islands like Havelock and Neil. Explore nearby beaches, markets, and historical sites.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Getting There & Around
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Plane className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Air:</span><span className={secondaryTextColor}> Veer Savarkar Int’l Airport (IXZ) connects major Indian cities.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Sea:</span><span className={secondaryTextColor}> Long ferry journeys (~3 days) from Chennai/Kolkata (less common).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Local Transport:</span><span className={secondaryTextColor}> Autos (₹50–150), taxis, local buses, scooter rentals (₹400–500/day).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Ferries:</span><span className={secondaryTextColor}> To Havelock/Neil (Phoenix Bay), Ross/North Bay (Aberdeen Jetty).</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Calendar className={`mr-3 ${inactiveTextColor}`} size={24} /> Best Time to Visit
                                </h2>
                                <div className={cardBaseStyle}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className={`${infoBg} rounded-xl p-4 border ${infoBorder}`}>
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Nov–Feb</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Pleasant, dry, peak season.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Mar–May</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Hotter, good sea visibility.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Sep</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Monsoon, lush greenery, fewer crowds.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Landmark className={`mr-3 ${inactiveTextColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Cellular Jail</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Historic prison, now a National Memorial. Don't miss the Light & Sound Show.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Ross Island</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Former British HQ with scenic ruins, deer, peacocks. Short boat ride.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Corbyn's Cove</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Popular city beach for swimming and light water sports.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${inactiveTextColor}`} /> Museums</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Samudrika (Naval Marine) & Anthropological museums offer cultural insights.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1 space-y-8">
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Bed className={`mr-2 ${inactiveTextColor}`} size={20} /> Accommodation
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Wide range: Budget guesthouses to mid-range hotels (Sinclairs, Fortune) & limited luxury options.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Book first/last nights in advance.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Fresh seafood (New Lighthouse), diverse Indian cuisine (Annapurna, Icy Spicy), cafes & rooftop bars.</span></li>
                                </ul>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Generally safe; exercise basic caution.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use mosquito repellent. Drink bottled/filtered water.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Helmets mandatory on two-wheelers.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Avoid single-use plastics; carry reusable bottles.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect wildlife and marine life; no touching coral.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of waste responsibly.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                ) : (
                    // Comprehensive Guide Content (Structure Unchanged)
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-12">
                            <section id="overview-comprehensive">
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${inactiveTextColor}`} size={24} /> Detailed Overview
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Port Blair, the bustling capital of the Andaman and Nicobar Islands, serves as the primary entry point and administrative center for the archipelago. Far more than just a transit hub, it's a city with a complex past, vividly captured by the imposing Cellular Jail, a symbol of India's freedom struggle. The city offers a blend of urban amenities, diverse cultural influences from mainland settlers, and easy access to surrounding natural and historical attractions.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Visitors can explore poignant museums detailing the islands' unique ecology and tribal heritage, relax at Corbyn's Cove beach, wander through the lively Aberdeen Bazaar, or take short ferry trips to discover the ruins of Ross Island or the underwater wonders near North Bay. Port Blair provides essential infrastructure like hotels, restaurants, and transport links, making it the logical base for exploring the wider Andaman region while offering its own distinct points of interest.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Port Blair:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Air (Primary):</strong> Veer Savarkar International Airport (IXZ) is well-connected with direct flights from Chennai, Kolkata, Delhi, Bengaluru, Hyderabad, and other major Indian cities. The airport is located about 4-5 km south of the main city center (Aberdeen Bazaar). Pre-paid taxis and auto-rickshaws are available.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Sea:</strong> Government-run passenger ships operate from Chennai, Kolkata, and Visakhapatnam. The journey takes approximately 60-70 hours (3 days). This is a budget-friendly but time-consuming option, suitable for those seeking an adventurous sea voyage. Schedules are limited and booking well in advance is essential. Ships dock at Haddo Wharf.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around Port Blair:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Auto-Rickshaws:</strong> The most common mode for short to medium distances within the city. Fares are negotiable (typically ₹50-₹150 for most city rides). Agree on the price before starting the journey.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Taxis:</strong> Tourist taxis (usually cars/SUVs) can be hired for point-to-point transfers or full-day/half-day sightseeing tours (approx. ₹2000-₹3000 for a full day). Available at the airport, jetties, and major hotels.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Two-Wheeler Rentals:</strong> Scooters and motorcycles are available for rent (approx. ₹400-600 per day). Ideal for independent exploration but requires an Indian driving license and cautious driving on hilly roads. Helmets are mandatory.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Local Buses:</strong> State Transport Service (STS) buses connect various parts of the city and nearby areas like Wandoor, Chidiya Tapu, and Corbyn's Cove. Very economical but can be crowded. Main bus terminal is at Mohanpura.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Ferries/Boats:</strong> Essential for island hopping. Private ferries (Makruzz, Green Ocean, etc.) and government ferries operate from Phoenix Bay Jetty (Haddo Wharf) to Havelock (Swaraj Dweep) and Neil (Shaheed Dweep). Boats to Ross Island and North Bay depart from Aberdeen Jetty (Rajiv Gandhi Water Sports Complex).</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Compass className={`mr-3 ${inactiveTextColor}`} size={24} /> Exploring Attractions & Activities
                                </h2>
                                <div className="space-y-6">
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Cellular Jail National Memorial</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A must-visit historical site. Explore the grim cells, central tower, gallows, and museum documenting the lives of freedom fighters imprisoned here ('Kala Pani'). The poignant Light and Sound show held every evening narrates its history. Closed on Mondays and national holidays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Ross Island (Netaji Subhas Chandra Bose Dweep)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The former administrative headquarters of the British. Now features atmospheric ruins (church, bakery, commissioner's bungalow) entwined with massive tree roots. Home to friendly deer and peacocks. Accessible via a short boat ride from Aberdeen Jetty. Features a sound and light show in the evenings. Closed on Wednesdays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Corbyn's Cove Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The closest beach to Port Blair city (approx. 7 km). A crescent-shaped, coconut palm-fringed beach suitable for swimming and relaxing. Offers water sports like jet skiing and speed boat rides. Several snack bars and changing rooms are available. Can get crowded, especially on weekends.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Ship size={18} className={`mr-2 ${inactiveTextColor}`} /> Samudrika Naval Marine Museum</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Managed by the Indian Navy, this museum provides an excellent overview of the Andaman's geography, marine life, tribal communities, and ecosystems. Includes displays of corals, shells, and a small aquarium. Located near the Teal House. Closed on Mondays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${inactiveTextColor}`} /> Anthropological Museum</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Focuses on the indigenous tribes of the Andaman and Nicobar Islands, including the Jarawas, Sentinelese, Onges, and Nicobarese. Displays artifacts, tools, clothing, and models depicting their traditional way of life. Provides valuable insight into the islands' original inhabitants. Located in Phoenix Bay. Closed on Mondays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Chatham Saw Mill</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>One of the oldest and largest sawmills in Asia, established by the British in 1883. Connected to Port Blair by a bridge. Visitors can take a guided tour to see the wood processing operations. A Forest Museum within the complex showcases local timber varieties and woodcrafts. Closed on Sundays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Other Attractions</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Rajiv Gandhi Water Sports Complex (Aberdeen Jetty):</strong> Hub for boat trips to Ross/North Bay, offers some water activities. <strong>Marina Park and Aquarium:</strong> Adjacent to the water sports complex, features gardens, memorials, and a small aquarium (check operational status). <strong>Sagarika Government Emporium:</strong> For authentic local handicrafts, shell jewelry, and souvenirs. <strong>Mount Harriet National Park (Mount Manipur):</strong> Offers panoramic views (visible on the ₹20 note), trekking trails, and bird watching (requires a ferry and road journey). <strong>Chidiya Tapu (Sunset Point & Biological Park):</strong> Famous for sunsets, bird watching, and a small zoo (approx. 25 km south).</p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${inactiveTextColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Accommodation:</strong> Port Blair boasts the widest range of stays in the Andamans. Budget options (₹1000-3000) are concentrated around Aberdeen Bazaar and Phoenix Bay. Mid-range hotels (₹3000-8000) like Sinclairs Bayview, Peerless Sarovar Portico (at Corbyn's Cove), Fortune Resort Bay Island (Welcomhotel), and various TSG properties offer comfortable rooms, restaurants, and often pools or sea views. Luxury is limited but includes suites at Welcomhotel and boutique options like SeaShell Port Blair. Government guesthouses (APWD, Hornbill Nest) offer basic, affordable rooms (book in advance).</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Food:</strong> Culinary options are diverse. Seafood is a highlight – try New Lighthouse Restaurant or Mandalay (at Fortune). For authentic South Indian/Vegetarian, Annapurna Cafeteria and Icy Spicy are popular. North Indian, Bengali, and local Andamanese dishes are available in various restaurants. Aberdeen Bazaar has numerous eateries and street food stalls. Cafes like Ripple Coffee offer modern ambiance. Rooftop bars like Amaya (SeaShell) and Nico Bar (Fortune) provide drinks with views.</p>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1 space-y-8">
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Calendar className={`mr-2 ${inactiveTextColor}`} size={20} /> Best Time to Visit
                                </h3>
                                <div className="space-y-3">
                                    <div className={`${infoBg} rounded-lg p-3 border ${infoBorder}`}>
                                        <h4 className={`font-medium ${infoText} text-sm`}>Oct–May (Dry Season)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Best weather (esp. Nov-Feb). Ideal for all activities, island hopping. Peak tourist season.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Mar–May (Shoulder)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Hotter and more humid, but good for water activities due to visibility.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Jun–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Heavy rainfall, potential ferry disruptions. Lush scenery, fewer crowds, off-season rates. Focus on indoor attractions.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Port Blair is generally safe with low crime rates. Standard precautions apply.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Roads can be narrow and winding; drive/ride cautiously. Helmets compulsory.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drink only bottled or filtered water. Be mindful of street food hygiene.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use mosquito repellent, especially during dawn and dusk, to prevent Dengue.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Good medical facilities available (GB Pant Hospital, private clinics). Carry personal medications.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Adhere to safety guidelines during water sports and boat trips.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic use: Carry reusable water bottles and bags.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of litter properly. Do not leave waste at beaches or natural sites.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect marine life: Avoid touching corals or feeding fish during snorkeling/diving.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Conserve water and electricity in accommodations.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect local culture and traditions. Dress modestly when visiting non-beach areas.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do NOT attempt to interact with or photograph protected Jarawa tribe members.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support local economy by buying authentic handicrafts (Sagarika) and dining locally.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book flights and popular hotels (especially first/last nights) well in advance, particularly during peak season.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pre-book ferry tickets (private/govt) online if possible, especially for Havelock/Neil.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash; while ATMs are available, they can be unreliable or crowded. Many smaller shops/autos prefer cash.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Mobile connectivity can be patchy (BSNL often works best). Wi-Fi is often slow and limited. Inform family of your itinerary.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light cotton clothing, swimwear, sunscreen, hat, sunglasses, insect repellent, and a basic first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Allow buffer time for transfers, especially for connecting flights after ferry journeys.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Unchanged */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Plan Your Port Blair Experience</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Ready to explore the historic capital of the Andamans? Browse our curated packages or get in touch for a customized itinerary.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=port-blair" className={buttonPrimaryStyle}>
                            View Port Blair Packages <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md`}>
                            Get Travel Assistance
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}
