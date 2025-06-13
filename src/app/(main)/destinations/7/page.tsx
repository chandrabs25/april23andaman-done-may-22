// Path: src/app/destinations/diglipur/page.tsx
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
    Turtle,
    Mountain
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

export default function DiglipurPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Diglipur - captions shortened
    const galleryImages = [
        {
            src: "/images/diglipur/ross-smith-island.jpg",
            alt: "Ross and Smith Islands connected by sandbar",
            caption: "Ross & Smith Islands"
        },
        {
            src: "/images/diglipur/saddle-peak-view.jpg",
            alt: "View from Saddle Peak, Diglipur",
            caption: "Saddle Peak View"
        },
        {
            src: "/images/diglipur/kalipur-beach-turtle.jpg",
            alt: "Turtle tracks on Kalipur Beach, Diglipur",
            caption: "Kalipur Beach"
        },
        {
            src: "/images/diglipur/alfred-caves.jpg",
            alt: "Entrance to Alfred Caves near Diglipur",
            caption: "Alfred Caves"
        },
        {
            src: "/images/diglipur/diglipur-landscape.jpg",
            alt: "Rural landscape near Diglipur town",
            caption: "Diglipur Landscape"
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
                    src="/images/diglipur/hero.webp"
                    alt="Scenic coastline near Diglipur, North Andaman"
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
                                    <span className="text-white font-medium">Diglipur</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Diglipur</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Discover North Andaman's adventure capital: Saddle Peak, Ross & Smith Islands, and pristine nature.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Explore Diglipur <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Diglipur
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>North Andaman Island, ~300 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Ross & Smith Islands, Saddle Peak, Turtle Nesting, Alfred Caves</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Mountain className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Vibe</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Offbeat, adventurous, gateway to North Andaman's natural wonders</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Diglipur is the northernmost town in the Andamans, an adventurer's paradise far from the usual tourist trail. It's renowned for its rich biodiversity, pristine natural beauty, and rugged landscapes. The region is home to Saddle Peak, the highest point in the Andaman & Nicobar archipelago, the stunning twin islands of Ross & Smith, and important turtle nesting sites. Diglipur offers an authentic, offbeat experience for travelers seeking trekking, nature, and raw beauty.</p>
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
                                            <div><span className={`font-medium ${primaryTextColor}`}>Road (ATR):</span><span className={secondaryTextColor}> The most common route is a long 10-12 hour drive from Port Blair via bus or private car, crossing the Andaman Trunk Road.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Sea Ferry:</span><span className={secondaryTextColor}> Government ferries from Port Blair offer an overnight journey, taking around 10-14 hours.</span></div>
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
                                            <p className={`text-sm ${secondaryTextColor}`}>Best for trekking and beach activities.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Dec–Mar</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Prime turtle nesting season.</p>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Ross & Smith Islands</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Twin islands connected by a natural sandbar, offering stunning turquoise waters and pristine beaches.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Mountain size={18} className={`mr-2 ${inactiveTextColor}`} /> Saddle Peak Trek</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Hike to the highest point in the Andamans (732m) for panoramic views of the archipelago.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Turtle size={18} className={`mr-2 ${inactiveTextColor}`} /> Kalipur & Ramnagar Beaches</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Key nesting sites for Olive Ridley, Hawksbill, Green, and Leatherback turtles.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Alfred Caves</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A network of limestone caves requiring a trek through the forest to explore. Best visited post-monsoon.</p>
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
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Primarily basic government guesthouses and a few private resorts like the Turtle Resort at Kalipur. Advance booking is essential.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Limited to small local eateries and hotel restaurants. Expect simple Indian cuisine and fresh seafood.</span></li>
                                </ul>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Diglipur is for travelers who are well-prepared and enjoy rugged, offbeat destinations.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Plan for at least 3-4 days to properly explore the main attractions due to travel times.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Pack appropriate gear for trekking: sturdy shoes, rain gear, insect repellent, and a first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Respect the fragile ecosystem and wildlife, especially at turtle nesting sites.</span></li>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Diglipur, located in the far north of the Andaman archipelago, is the ultimate destination for travelers seeking adventure and untouched nature. As the largest town in North Andaman, it serves as a base for exploring some of the most spectacular natural wonders the islands have to offer. The region is a mosaic of lush green paddy fields, dense tropical forests, and a rugged coastline, defined by its key attractions: the iconic twin islands of Ross and Smith, connected by a shimmering sandbar, and Saddle Peak, the highest point in the Andamans at 732 meters.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Unlike the more commercialized tourist spots, Diglipur retains a rustic, authentic charm. It is a land of exploration, attracting trekkers, nature lovers, and those looking to escape the crowds. The area is also ecologically significant, with Kalipur and Ramnagar beaches serving as major nesting grounds for four different species of sea turtles. With challenging treks to limestone caves and the peak, and serene boat trips to stunning islands, Diglipur promises a raw, rewarding, and unforgettable Andaman experience.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Diglipur:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Road:</strong> The most common route. It is a long and arduous 10-12 hour journey from Port Blair via the Andaman Trunk Road (ATR). Both government buses and private cars/taxis are available. The journey involves passing through the Jarawa Tribal Reserve.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Sea:</strong> Government ferries operate from Port Blair to Aerial Bay Jetty near Diglipur. The journey is typically overnight, taking 10-14 hours. It is a more comfortable but slower option. Tickets must be booked in advance.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Air (Future):</strong> A small airstrip is being developed, which may offer limited commercial flights in the future, significantly reducing travel time.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around Diglipur:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Auto-Rickshaws & Taxis:</strong> The best way to get around for sightseeing. You can hire them for point-to-point travel or for a full-day trip.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Local Buses:</strong> Connect Diglipur town with nearby villages and beaches like Kalipur.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Boat (Dunghi/Fibre Boat):</strong> A fibre boat is required to get to Ross & Smith Islands from Aerial Bay Jetty.</li>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Ross & Smith Islands</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The crown jewel of Diglipur. These two stunning islands are connected by a thin, white sandbar that is visible during low tide. Visitors can walk from one island to the other. The water is crystal clear and turquoise green, perfect for swimming and snorkeling. A permit is required from the Forest Office at Diglipur, which can be obtained on the spot at Aerial Bay Jetty.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Mountain size={18} className={`mr-2 ${inactiveTextColor}`} /> Saddle Peak National Park</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Trekking to Saddle Peak (732m), the highest point in the Andaman & Nicobar Islands, is a must-do for adventure enthusiasts. The 8 km trek is challenging and takes about 4-5 hours one way. The trail winds through lush evergreen forest, and the summit offers breathtaking panoramic views of the North Andaman coastline and nearby islands. A permit and a guide are required.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Turtle size={18} className={`mr-2 ${inactiveTextColor}`} /> Kalipur & Ramnagar Beaches</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>These beaches are famous as nesting grounds for four species of sea turtles: Olive Ridley, Hawksbill, Green Sea, and the giant Leatherback. The nesting season runs from December to March. Kalipur Beach, with its volcanic grey sand, is also safe for swimming. Ramnagar Beach is another beautiful, sandy stretch.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Alfred Caves (Mud Volcanoes of Diglipur)</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>This is a challenging adventure involving a trek through dense forest to reach a network of 41 limestone caves. The caves are home to Swiftlet birds, whose nests are edible. The trail can be difficult to navigate, and it's essential to hire a local guide. The best time to visit is from October to April, as the path becomes inaccessible during the monsoon.</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Accommodation:</strong> Diglipur's accommodation options are limited and cater more to budget travelers. The main options include the government-run Turtle Resort at Kalipur Beach, which offers a prime location, and several private lodges in Diglipur town and Kalipur like Pristine Beach Resort. Do not expect luxury; facilities are basic but functional. Booking well in advance is absolutely essential, especially from December to March.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Food:</strong> Dining is also basic, with a few local restaurants in Diglipur market serving Indian and Bengali cuisine. The hotel restaurants offer more variety. Fresh seafood is a highlight. It is advisable to carry snacks and water, especially for long treks and day trips.</p>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Practicalities
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Permits are required for Ross & Smith Islands and Saddle Peak. These can be obtained from the Forest Office in Diglipur.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>The trek to Alfred Caves is strenuous and requires a guide.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash. ATM services are limited and often unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mobile and internet connectivity is extremely poor. BSNL is the most likely operator to have a signal.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Diglipur is for travelers who are well-prepared and enjoy rugged, offbeat destinations.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Plan for at least 3-4 days to properly explore the main attractions due to travel times.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack appropriate gear for trekking: sturdy shoes, rain gear, insect repellent, and a first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Respect the fragile ecosystem and wildlife, especially at turtle nesting sites.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Answer the Call of the Wild North</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Ready for a true Andaman adventure? Explore our Diglipur itineraries and plan your trek to the top of the islands.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=diglipur" className={buttonPrimaryStyle}>
                            View Diglipur Adventures <ArrowRight className="ml-2" size={18} />
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