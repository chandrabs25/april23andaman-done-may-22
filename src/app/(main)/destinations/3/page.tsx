// Path: src/app/destinations/neil-island/page.tsx
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
    LifeBuoy,
    Bike,
    Sun,
    Sunset,
} from 'lucide-react';

/* NOTE FOR FONT STYLING:
  For the font "Plus Jakarta Sans" to apply correctly, please add the following link to your root layout file (e.g., app/layout.tsx):
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?display=swap&family=Plus+Jakarta+Sans:wght@400;500;700;800"
  />
*/

// --- Define Common Styles (Copied from Port Blair Sample) ---
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

export default function NeilIslandPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Neil Island - captions shortened
    const galleryImages = [
        {
            src: "/images/neil/bharatpur-beach-neil.jpg",
            alt: "Bharatpur Beach lagoon, Neil Island",
            caption: "Bharatpur Beach"
        },
        {
            src: "/images/neil/natural-bridge-neil.jpg",
            alt: "Natural Bridge rock formation at low tide, Neil Island",
            caption: "Natural Bridge"
        },
        {
            src: "/images/neil/laxmanpur-beach-sunset.jpg",
            alt: "Sunset over Laxmanpur Beach, Neil Island",
            caption: "Laxmanpur Beach"
        },
        {
            src: "/images/neil/sitapur-beach-sunrise.jpg",
            alt: "Sunrise at Sitapur Beach, Neil Island",
            caption: "Sitapur Beach"
        },
        {
            src: "/images/neil/neil-cycling.jpg",
            alt: "Cycling through the green fields of Neil Island",
            caption: "Island Cycling"
        }
    ];

    return (
        <main
            className="bg-slate-50"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/neil/hero.jpg"
                    alt="Panoramic view of Neil Island's coastline and greenery"
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
                                    <span className="text-white font-medium">Neil Island (Shaheed Dweep)</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Neil Island (Shaheed Dweep)</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Experience the tranquil charm of Andaman's 'vegetable bowl' with pristine beaches and an unhurried pace.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Explore Neil Island <ArrowRight size={18} className="ml-2" />
                            </Link>
                            <button className={buttonSecondaryStyleHero} onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                                <Camera size={18} className="mr-2" /> View Gallery
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-10 md:py-12">

                {/* Quick Facts Card */}
                <div className={`${infoBg} rounded-2xl p-6 mb-12 shadow-sm border ${infoBorder}`}>
                    <h2 className={`text-xl font-semibold ${infoText} mb-4 flex items-center`}>
                        <Info className={`mr-2 ${infoIconColor}`} size={20} />
                        Quick Facts About Neil Island
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>South Andaman, part of Ritchie's Archipelago, near Havelock</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Natural Bridge, Bharatpur/Laxmanpur/Sitapur Beaches, Cycling, Serenity</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Bike className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Vibe</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Quiet, relaxed, rural charm, ideal for unwinding</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Neil Island (Shaheed Dweep) is Havelock's quieter, more laid-back sibling. Known as the 'vegetable bowl' of the Andamans, it's characterized by lush paddy fields, quaint villages, and a handful of stunning, uncrowded beaches. It's the perfect destination to unwind, cycle around, and enjoy a slower pace of life.</p>
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
                                            <div><span className={`font-medium ${primaryTextColor}`}>Ferries:</span><span className={secondaryTextColor}> Private & Govt. ferries connect from Port Blair (~2 hrs) and Havelock (~1 hr).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Bike className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Local Transport:</span><span className={secondaryTextColor}> Ideal for cycling. Scooter/bike rentals (~₹500/day) and auto-rickshaws are available.</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Calendar className={`mr-3 ${inactiveTextColor}`} size={24} /> Best Time to Visit
                                </h2>
                                <div className={cardBaseStyle}>
                                    <p className={`mb-4 ${secondaryTextColor}`}>Similar to Havelock, the best time to visit Neil Island is during the dry season for ideal beach weather and calm seas.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`${infoBg} rounded-xl p-4 border ${infoBorder}`}>
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Oct–May</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Dry season, best for all activities.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Sep</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Monsoon, lush greenery, very quiet.</p>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Natural Bridge</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A stunning natural rock formation, best visited during low tide to see marine life in rock pools.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Bharatpur Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Known for its calm, shallow waters, coral reefs, and glass-bottom boat rides.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sunset size={18} className={`mr-2 ${inactiveTextColor}`} /> Laxmanpur Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A broad, white sand beach famous for its spectacular sunset views.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sun size={18} className={`mr-2 ${inactiveTextColor}`} /> Sitapur Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Located at the island's tip, it is renowned for its breathtaking sunrises.</p>
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
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Mainly budget-friendly guesthouses and mid-range resorts (SeaShell, Summer Sands). Fewer luxury options than Havelock.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Relaxed cafes, local eateries serving fresh seafood and Indian dishes. Less variety than Havelock but authentic.</span></li>
                                </ul>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Very safe. Limited medical facilities (PHC only).</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry cash as ATMs are unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mobile network is patchy; BSNL works best.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Embrace the slow pace; cycle or walk.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect the fragile marine ecosystem around the Natural Bridge.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support local farmers and businesses.</span></li>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Neil Island, officially renamed Shaheed Dweep, is the quieter, more serene counterpart to its bustling neighbour, Havelock. Spanning a small area that can be traversed by bicycle in a couple of hours, Neil is known for its exceptionally relaxed atmosphere and rural charm. Dubbed the 'vegetable bowl' of the Andamans, its landscape is dotted with lush green paddy fields, banana plantations, and tropical trees, offering a different flavour of island life.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The island is framed by three stunning beaches named after characters from the Ramayana: the tranquil Bharatpur Beach, the sunset-perfect Laxmanpur Beach, and the sunrise-viewing Sitapur Beach. Its main attraction is the magnificent Natural Bridge, a unique geological formation best explored at low tide. Neil Island is the ideal destination for travelers looking to disconnect, unwind, and enjoy nature's beauty at an unhurried pace.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Neil Island:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>From Port Blair:</strong> Both private ferries (Makruzz, Green Ocean etc.) and government ferries operate daily. The journey takes approximately 90 minutes to 2 hours.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>From Havelock Island:</strong> Neil is well-connected to Havelock with multiple daily ferries. It's a short journey of about 60 minutes, making it easy to include both islands in an itinerary.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Booking:</strong> It is essential to book ferry tickets in advance, especially during peak season, as they sell out quickly.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around Neil Island:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Scooter/Bicycle Rental:</strong> The best way to explore. The island is small and flat, making it perfect for cycling (~₹150/day) or riding a scooter (~₹500/day). Rentals are available near the jetty.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Auto-Rickshaws:</strong> Available for point-to-point travel. You can also hire one for a complete island tour covering all major spots (approx. ₹1000-1200).</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Taxis:</strong> A few taxis are available, suitable for families or those with luggage, but are more expensive.</li>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Natural Bridge (Howrah Bridge)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>This is Neil Island's most iconic landmark. A natural, bridge-like rock formation accessible during low tide. The walk to the bridge is over a rocky beach full of fascinating tide pools where you can spot small fish, sea cucumbers, and colourful coral. A guide is recommended to help spot marine life and navigate the sharp rocks. Check tide timings before you go.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Bharatpur Beach (Beach No. 2)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Located right next to the jetty, this is a picture-perfect beach with calm, shallow, and clear turquoise water, making it the best swimming spot on the island. It's also the hub for water sports, offering glass-bottom boat rides, snorkeling, and jet skiing. The large bay has a rich coral reef further from the shore.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sunset size={18} className={`mr-2 ${inactiveTextColor}`} /> Laxmanpur Beach (Beach No. 1)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A vast, serene white sand beach triangular in shape, offering spectacular, unobstructed sunset views. The beach is perfect for long, peaceful walks. At the far end, there's another natural rock bridge (less famous than the main one). The water isn't ideal for swimming due to corals and rocks near the shore.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Sun size={18} className={`mr-2 ${inactiveTextColor}`} /> Sitapur Beach (Beach No. 5)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Located at the easternmost tip of the island, this beach is the designated sunrise point. It features a beautiful curved bay with two small caves and is exposed to the open sea, resulting in higher tides and stronger currents than other beaches. Swimming should be done with caution. It is often a quiet and secluded spot.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Bike size={18} className={`mr-2 ${inactiveTextColor}`} /> Cycling through Villages</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>One of the most charming activities on Neil is to simply rent a bicycle and explore the island's flat, well-paved roads. Ride through lush green paddy fields, tranquil villages, and past local markets to get a true sense of the island's unhurried lifestyle.</p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${inactiveTextColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Accommodation:</strong> Neil Island offers a more limited but charming range of stays compared to Havelock. Options are primarily budget guesthouses and mid-range eco-resorts located near Bharatpur, Laxmanpur, and Sitapur beaches. Popular choices include SeaShell Neil, Summer Sands Beach Resort, and Pearl Park Beach Resort. Booking well in advance is crucial as the number of rooms on the island is limited.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Food:</strong> The island's food scene is simple and authentic. Many small, family-run restaurants in the main market area serve delicious Indian thalis and fresh seafood at reasonable prices. Beachside shacks and resort restaurants offer multi-cuisine options. The vibe is very relaxed; don't be in a hurry, as service can be slow, matching the island's pace.</p>
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
                                        <p className={`text-xs ${secondaryTextColor}`}>Perfect weather for beaches, cycling, and water activities. Peak tourist period.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Jun–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Lush green landscapes, fewer tourists. Ferry services may be disrupted.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>The island is extremely safe with a friendly local population.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Medical facilities are basic (a single Primary Health Centre). For emergencies, evacuation to Port Blair is necessary.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash. There are only a couple of ATMs which can be unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mobile connectivity is poor. BSNL has the best coverage, but data is very slow. Consider it a digital detox.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic waste. Carry a reusable water bottle.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>When visiting the Natural Bridge, do not step on, touch, or take any coral or marine life.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support the local economy by eating at local restaurants and buying local produce.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book accommodation and ferries well in advance, especially for Dec-Feb.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack a flashlight, as street lighting is minimal.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Check tide timings for visiting Natural Bridge and Laxmanpur Beach.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Embrace the slow pace. Neil Island is about relaxing, not rushing.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Discover the Charm of Neil Island</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Ready to unwind? Browse our packages that capture the serene beauty of Neil Island, or let us help you plan your perfect quiet getaway.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=neil" className={buttonPrimaryStyle}>
                            View Neil Island Packages <ArrowRight className="ml-2" size={18} />
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