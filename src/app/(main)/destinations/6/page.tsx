// Path: src/app/destinations/mayabundar/page.tsx
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
    Car,
    Turtle
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

export default function MayabundarPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Mayabundar - captions shortened
    const galleryImages = [
        {
            src: "/images/mayabundar/karmatang-beach.jpg",
            alt: "Karmatang Beach, Mayabundar",
            caption: "Karmatang Beach"
        },
        {
            src: "/images/mayabundar/german-jetty.jpg",
            alt: "German Jetty ruins, Mayabundar",
            caption: "German Jetty"
        },
        {
            src: "/images/mayabundar/avis-island.jpg",
            alt: "Avis Island near Mayabundar",
            caption: "Avis Island"
        },
        {
            src: "/images/mayabundar/karen-village.jpg",
            alt: "Karen Village (Webi) near Mayabundar",
            caption: "Karen Village"
        },
        {
            src: "/images/mayabundar/mangrove-creek.jpg",
            alt: "Mangrove creeks near Mayabundar",
            caption: "Mangrove Creeks"
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
                    src="/images/mayabundar/hero.jpg"
                    alt="Aerial view of Mayabundar's coastline and jetty"
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
                                    <span className="text-white font-medium">Mayabundar</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Mayabundar</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Discover North Andaman's cultural mosaic, turtle beaches, and offbeat natural beauty.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Explore Mayabundar <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Mayabundar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Northern Middle Andaman, ~240 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Karmatang Beach (Turtle Nesting), Karen Culture, German Jetty, Avis Island</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Users className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Vibe</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Offbeat, quiet, culturally diverse, gateway to North Andaman</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Mayabundar is an offbeat destination in the northern part of Middle Andaman, offering a unique blend of natural beauty and cultural diversity. It's a quieter town known for its eco-tourism attractions, including mangrove-lined creeks and the important turtle nesting site at Karmatang Beach. Mayabundar is also home to a community of Karen tribes (originally from Myanmar), adding a distinct cultural layer to the visitor experience.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Getting There
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Car className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Road (ATR):</span><span className={secondaryTextColor}> A long but scenic 8-10 hour bus or car journey from Port Blair via the Andaman Trunk Road.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Sea Ferry:</span><span className={secondaryTextColor}> Government ferries from Port Blair offer an alternative, taking over 10 hours.</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Calendar className={`mr-3 ${inactiveTextColor}`} size={24} /> Best Time to Visit
                                </h2>
                                <div className={cardBaseStyle}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`${infoBg} rounded-xl p-4 border ${infoBorder}`}>
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Oct–May</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Pleasant weather for exploring.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Dec–Feb</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Best for turtle nesting season.</p>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Turtle size={18} className={`mr-2 ${inactiveTextColor}`} /> Karmatang Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A beautiful, volcanic-sand beach known as a major nesting site for several species of sea turtles.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${inactiveTextColor}`} /> Karen Village</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Visit Webi to see the settlement of the Karen tribe, known for their unique traditions and handicrafts.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Avis Island</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A tiny, picturesque uninhabited island with a small beach and coconut plantations. Requires a boat trip.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> German Jetty</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>An old, dilapidated jetty offering panoramic sea views and a glimpse into the past.</p>
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
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Accommodation is basic, mainly government guesthouses (Hotel Anmol, Hotel Aashna) and a few private lodges. Advance booking is crucial.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Limited to small local restaurants and dhabas in the market area, serving Indian and local Andamanese food.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Mayabundar is best for seasoned travelers seeking offbeat experiences.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry cash and book accommodation well in advance.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>You may need to obtain a Forest Permit for Avis Island from the Mayabundar Forest Office.</span></li>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Mayabundar is a laid-back town located in the northern part of Middle Andaman, approximately 240 km from Port Blair. It is far removed from the main tourist trail, offering an authentic, untouristed experience for adventurous travelers. The town serves as an administrative headquarters and is characterized by a diverse cultural landscape, including settlements of Bengali, Tamil, and notably, Karen people—a tribe originally from Myanmar (formerly Burma) who were settled here by the British.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The appeal of Mayabundar lies not in luxury or bustling markets, but in its subtle, natural charm and cultural richness. Its main attractions include the mangrove-lined Karmatang Beach, a significant site for sea turtle nesting, and the opportunity to visit the unique Karen community. With its historic remnants like the German Jetty and access to serene, nearby islands like Avis Island, Mayabundar is a gateway for those looking to explore the more remote parts of the Andaman archipelago, including the journey further north to Diglipur.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Mayabundar:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Road:</strong> The most common method. Government and private buses run daily from Port Blair, a journey that takes 8-10 hours. Hiring a private car is a more comfortable but expensive option. The route follows the Andaman Trunk Road (ATR), passing through Rangat.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Sea:</strong> Government ferries connect Port Blair (Phoenix Bay Jetty) with Mayabundar. The journey can take 10-12 hours, offering a scenic but much slower alternative. Schedules are infrequent and should be verified locally.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around Mayabundar:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Local Buses:</strong> Connect the main town with surrounding areas and attractions like Karmatang Beach.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Auto-Rickshaws & Jeeps:</strong> Can be hired from the main market for local sightseeing.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Boat (Dunghi):</strong> A local boat, known as a 'dunghi', is needed to visit Avis Island from the main Mayabundar jetty.</li>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Turtle size={18} className={`mr-2 ${inactiveTextColor}`} /> Karmatang Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>About 13 km from Mayabundar town, this long, beautiful stretch of grey volcanic sand is a well-known nesting ground for several species of sea turtles, including the Olive Ridley. The Forest Department has established a hatchery here to protect the eggs. The beach itself is clean, has eco-friendly huts and watchtowers, and is ideal for walks and swimming.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${inactiveTextColor}`} /> Interview Island & Karen Village (Webi)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Interview Island is a large wildlife sanctuary, known for its population of wild elephants. Reaching it is difficult and requires special permits. A more accessible cultural experience is visiting the Karen village in Webi. The Karen are a distinct ethnic group with their own language, traditions, and Christian faith, known for their skilled craftsmanship, particularly in weaving.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Avis Island (Coconut Island)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A small, idyllic island just a 20-minute boat ride (dunghi) from Mayabundar jetty. It's an uninhabited island covered in coconut plantations with a small, beautiful beach. The island is perfect for a short, peaceful excursion. Note that a permit from the Forest Office in Mayabundar is required to visit.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> German Jetty & Forest Museum</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>German Jetty is the remnant of an old harbor structure, now a popular spot for its scenic beauty and sweeping views of the sea. Nearby, a small Forest Museum, managed by the Forest Department, displays local flora and fauna specimens, providing insights into the region's biodiversity.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1 space-y-8">
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Bed className={`mr-2 ${inactiveTextColor}`} size={20} /> Accommodation & Food
                                </h3>
                                <div className="space-y-4">
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Accommodation:</strong> Options in Mayabundar are basic and limited. The main choices are government-run guesthouses like APWD Guesthouse and private lodges like Hotel Anmol and Hotel Aashna. It is highly advisable to book rooms well in advance, especially during the tourist season, as options fill up quickly.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Food:</strong> The food scene is centered around the main market area, with small local restaurants (dhabas) serving simple North and South Indian dishes, as well as some local seafood preparations. Expect basic but fresh meals. There are no upscale dining options.</p>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Practicalities
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mayabundar is a safe town, but general travel precautions should be followed.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Medical facilities are basic. Carry a personal first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>ATMs are available but can be unreliable. It's best to carry sufficient cash.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mobile connectivity is limited, with BSNL having the most reliable network.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Best suited for travelers looking for an authentic, off-the-beaten-path experience.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Remember to obtain the necessary permit from the Forest Office before planning a trip to Avis Island.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>If visiting during turtle nesting season (Dec-Feb), be respectful of the environment and follow guidelines from the Forest Department.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Venture into the Unexplored Andamans</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Ready for an authentic journey? Explore our packages that include the cultural and natural sights of Mayabundar.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=mayabundar" className={buttonPrimaryStyle}>
                            View Mayabundar Packages <ArrowRight className="ml-2" size={18} />
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