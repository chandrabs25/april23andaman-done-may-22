// Path: src/app/destinations/havelock-island/page.tsx // Renamed for clarity (or swaraj-dweep)
// Theme: Neutral with Contextual Background Colors (Applied based on Baratang/Diglipur samples)

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
    Plane, // Added for consistency even if not used, for easier copy-paste
    Ship,
    Landmark, // Added for consistency
    Waves,
    LifeBuoy,
    Bike,       // Kept for Havelock transport
    Sun,        // Kept for Havelock weather
    Sparkles    // Kept for Bioluminescence
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


export default function HavelockIslandPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    // State for the old gallery is no longer needed:
    // const [activeImage, setActiveImage] = useState(0);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Havelock Island - Captions shortened for new design
    const galleryImages = [
        {
            src: "/images/havelock/radhanagar-beach-day.jpg",
            alt: "Radhanagar Beach (Beach No. 7), Havelock Island",
            caption: "Radhanagar Beach"
        },
        {
            src: "/images/havelock/elephant-beach-snorkeling.jpg",
            alt: "Snorkeling at Elephant Beach, Havelock Island",
            caption: "Elephant Beach"
        },
        {
            src: "/images/havelock/havelock-diving.jpg",
            alt: "Scuba diving scene near Havelock Island",
            caption: "Scuba Diving"
        },
        {
            src: "/images/havelock/kalapathar-beach.jpg",
            alt: "Kalapathar Beach with its distinctive black rocks",
            caption: "Kalapathar Beach"
        },
        {
            src: "/images/havelock/resort-view.jpg",
            alt: "Beachfront resort view on Havelock Island",
            caption: "Beach Resorts"
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
                    src="/images/havelock/hero.webp" // Use specific Havelock hero image
                    alt="Stunning aerial view of Havelock Island (Swaraj Dweep) coastline"
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
                                    <span className="text-white font-medium">Havelock Island (Swaraj Dweep)</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Havelock Island (Swaraj Dweep)</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Discover pristine beaches, vibrant coral reefs, and world-class diving in the Andamans' jewel.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Explore Havelock <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Havelock
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Part of Ritchie's Archipelago, ~70 km NE of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Radhanagar Beach, Elephant Beach, Scuba Diving, Coral Reefs</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Ship className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Access</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Primarily via Ferry (1.5-3 hrs) from Port Blair / Neil Island</p>
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


                {/* Content Based on Toggle */}
                {!showComprehensive ? (
                    // Brief Guide Content
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-10">
                            <section id="overview">
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${inactiveTextColor}`} size={24} /> Overview
                                </h2>
                                <div className={cardBaseStyle}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Havelock Island, officially Swaraj Dweep, is the crown jewel of the Andamans. Famous for its pristine white-sand beaches like Radhanagar, vibrant coral reefs perfect for diving and snorkeling, and lush green forests, it offers a perfect blend of relaxation and adventure.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Getting There & Around
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Ferries:</span><span className={secondaryTextColor}> Private (Makruzz, Green Ocean) & Govt. ferries from Port Blair (1.5-2.5 hrs) and Neil Island (1 hr).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Bike className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Local Transport:</span><span className={secondaryTextColor}> Scooter/bike rentals (₹400-600/day) are the best way to explore. Taxis & auto-rickshaws available.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Pro Tip:</span><span className={secondaryTextColor}> Book ferry tickets and scooters in advance during peak season to avoid disappointment.</span></div>
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
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Oct–May</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Best weather for beaches and water sports.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Dec–Feb</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Peak season, pleasant but crowded.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Sep</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Monsoon season, lush landscapes, fewer tourists.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Compass className={`mr-3 ${inactiveTextColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sun size={18} className={`mr-2 ${inactiveTextColor}`} /> Radhanagar Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Award-winning beach, famous for its stunning sunsets and pristine white sand.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Elephant Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Known for its vibrant coral reefs. Ideal for snorkeling and water sports.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Compass size={18} className={`mr-2 ${inactiveTextColor}`} /> Scuba Diving</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Havelock is a major diving hub with numerous sites for beginners and experts.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Kalapathar Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Scenic beach known for its black rocks and beautiful sunrises.</p>
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
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Ranges from bamboo huts to luxury resorts (Taj, Barefoot, SeaShell).</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Booking in advance is highly recommended, especially for popular resorts.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Beachside cafes, multi-cuisine restaurants. Try Full Moon Cafe, Something Different, Anju Coco.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Fresh seafood is a must-try.</span></li>
                                </ul>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Generally very safe for tourists.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry mosquito repellent. Limited medical facilities; serious cases require evacuation to Port Blair.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>ATMs can be unreliable; carry sufficient cash.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Avoid single-use plastics. Many places offer water refills.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not touch or stand on coral reefs.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect the local culture and environment.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                ) : (
                    // Comprehensive Guide Content
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-12">
                            <section id="overview-comprehensive">
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${inactiveTextColor}`} size={24} /> Detailed Overview
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Havelock Island (Swaraj Dweep) is the most visited island in the Andaman archipelago, and for good reason. It embodies the quintessential tropical paradise: turquoise waters, powdery white-sand beaches fringed by ancient rainforests, and some of the best scuba diving and snorkeling in South Asia. Unlike the administrative hub of Port Blair, Havelock is purely tourism-focused, offering a relaxed, laid-back atmosphere.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The island is a mosaic of stunning beaches, each with its unique character—from the world-famous Radhanagar Beach (Beach No. 7) for sunsets to the coral-rich Elephant Beach for water activities, and the serene Kalapathar Beach for picturesque sunrises. It's an adventurer's playground and a sanctuary for those seeking tranquility, making it an essential stop on any Andaman itinerary.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Havelock:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Private Ferries:</strong> The fastest and most comfortable way. Operators like Makruzz, Green Ocean, Nautika, and ITT Majestic connect Port Blair (Haddo Wharf) to Havelock Jetty in about 90-120 minutes. They also connect Havelock with Neil Island (approx. 60 mins). Booking online in advance is highly recommended.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Government Ferries:</strong> A more economical but slower option. Takes around 2.5-3 hours from Port Blair. Tickets can be booked at the Directorate of Shipping Services (DSS) counter in Port Blair. Schedules are less frequent and can be subject to change.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Helicopter Service:</strong> Limited service is available, primarily for locals, medical emergencies, or during monsoons when ferries are cancelled. It is not a standard tourist transport option.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around Havelock:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Scooter/Motorbike Rental:</strong> The most popular and convenient way to explore the island's limited road network. Rentals are available near the jetty and in major village areas (approx. ₹400-600 per day plus fuel). An Indian driving license is required.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Auto-Rickshaws:</strong> Readily available for short trips between beaches and resorts. Fixed-price charts are often available, but it's wise to confirm the fare before starting.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Taxis (Cars/Vans):</strong> Can be hired for airport transfers, full-day sightseeing, or for families and larger groups. More expensive than autos or scooters.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Bicycles:</strong> Can be rented for a leisurely exploration of nearby areas, but the island's terrain can be hilly in places.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Local Buses:</strong> A very cheap but infrequent service connects the main jetty with Radhanagar Beach and other villages.</li>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sun size={18} className={`mr-2 ${inactiveTextColor}`} /> Radhanagar Beach (Beach No. 7)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Consistently ranked among the best beaches in Asia, Radhanagar is famed for its vast expanse of fine white sand, crystal-clear turquoise water, and stunning sunsets. It's well-maintained with changing rooms, lockers, and food stalls. Ideal for swimming and long walks.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Elephant Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Accessible via a short boat ride or a 1.8 km forest trek. This beach is the hub for water sports. Its main draw is the shallow-water coral reef, perfect for snorkeling (even for beginners). Other activities include sea walking, glass-bottom boat rides, and jet skiing. Note: The beach was affected by the 2004 tsunami, but the reef remains vibrant.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Kalapathar Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Located on the eastern coast, this beach is known for the black rocks (from which it gets its name) that line the shoreline. It's a long, picturesque stretch of sand ideal for a peaceful morning walk and watching the sunrise. Swimming is not always recommended due to the rocky seabed.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Compass size={18} className={`mr-2 ${inactiveTextColor}`} /> Scuba Diving & Snorkeling</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Havelock is the epicentre of diving in the Andamans. Numerous PADI/SSI certified dive shops offer everything from 'Discover Scuba Dives' for absolute beginners to advanced certification courses. Popular dive sites include The Wall, Johnny's Gorge, and Dixon's Pinnacle, teeming with diverse marine life like Humphead parrotfish, turtles, and rays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sparkles size={18} className={`mr-2 ${inactiveTextColor}`} /> Kayaking & Bioluminescence</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Guided kayaking tours through the mangrove creeks offer a unique way to experience the island's ecosystem. On moonless nights, some operators conduct night kayaking tours to witness the magical phenomenon of bioluminescent phytoplankton lighting up the water.</p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${inactiveTextColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Accommodation:</strong> Havelock caters to all budgets. Backpackers can find basic beach huts and guesthouses around Village No. 3 and 5. The mid-range (₹4000-10000) is well-represented with comfortable resorts like SeaShell, Havelock Island Beach Resort, and The Flying Elephant. For luxury, options include the Taj Exotica Resort & Spa, Barefoot at Radhanagar, and Jalakara, which offer premium villas, private pools, and world-class service.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Food:</strong> The culinary scene is surprisingly diverse. Beachside cafes and restaurants are plentiful. Full Moon Cafe is famous for its relaxed vibe and seafood. Something Different - A Beachside Cafe offers unique dining experiences (including a free shuttle service). Anju Coco, Shakahaar (pure veg), and Bonova Cafe are other popular spots. Most restaurants offer a mix of Indian, Continental, and fresh seafood preparations.</p>
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
                                        <p className={`text-xs ${secondaryTextColor}`}>Ideal for all activities, clear skies, calm seas. Peak season from December to February.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Jun–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Heavy rains and rough seas. Diving is mostly closed. Good for budget travelers seeking lush greenery and solitude.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Primary medical care is available at the Community Health Centre (CHC), but serious issues require evacuation to Port Blair. Carry a first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>ATMs are available but often run out of cash. Carry a sufficient amount of currency. Digital payments are accepted at larger establishments.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mobile network coverage is improving (Airtel & BSNL are best), but data speeds can be slow. Don't rely on it for critical work.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Beware of sandflies on some beaches, especially during sunrise/sunset. Use repellent.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Always book diving and water sports with certified and reputable operators.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Say NO to single-use plastic. Carry a reusable water bottle.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not touch, stand on, or collect corals (dead or alive). They are protected marine species.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of all waste responsibly. Don't litter on beaches or in the forest.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect local customs. Dress modestly when away from the beach.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book everything (flights, ferries, hotels) far in advance, especially for travel between December and March.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light cottons, swimwear, sunscreen (reef-safe if possible), hat, sunglasses, and a waterproof bag.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Inform your bank about your travel to avoid blocked cards.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Keep a buffer day in your itinerary for potential ferry delays or cancellations, especially during shoulder seasons.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Ready for Your Havelock Adventure?</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>From serene beaches to thrilling underwater worlds, Havelock has it all. Explore our packages or customize your dream trip.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=havelock" className={buttonPrimaryStyle}>
                            View Havelock Packages <ArrowRight className="ml-2" size={18} />
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