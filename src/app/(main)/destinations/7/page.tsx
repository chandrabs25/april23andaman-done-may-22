// Path: src/app/destinations/diglipur/page.tsx
// Theme: Neutral with Contextual Background Colors (Applied based on Baratang sample)

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
    Compass,    // Use for Attractions/Exploration
    Users,      // Keep for cultural aspects if needed, or general info
    Shield,     // Consistent Safety icon
    Leaf,
    ChevronRight,
    Star,
    Navigation, // Consistent Travel icon
    ArrowRight,
    MessageCircle,
    Camera,
    Ship,       // Keep for Ferry access
    Car,        // Keep for Road access
    Turtle,     // Keep for Turtle Nesting
    Mountain,   // Specific for Saddle Peak
    LifeBuoy    // Consistent Safety icon
} from 'lucide-react';

// --- Define Common Styles (Copied from Baratang Sample - Neutral Theme with Contextual Colors) ---
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

const sectionPadding = "py-10 md:py-12"; // Consistent padding
const sectionHeadingStyle = `text-2xl font-bold ${neutralText} mb-6 flex items-center`;
const cardBaseStyle = `bg-white rounded-2xl shadow-sm border ${neutralBorderLight} p-6 transition-shadow hover:shadow-md`;
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md`;
const buttonSecondaryStyleHero = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} px-6 py-3 rounded-full font-medium transition-all duration-300`;
// --- End Common Styles ---

export default function DiglipurPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Diglipur
    const galleryImages = [
        {
            src: "/images/diglipur/ross-smith-island.jpg", // Use specific paths
            alt: "Ross and Smith Islands connected by sandbar",
            caption: "The stunning twin islands of Ross & Smith, joined by a natural sandbar"
        },
        {
            src: "/images/diglipur/saddle-peak-view.jpg", // Use specific paths
            alt: "View from Saddle Peak, Diglipur",
            caption: "Panoramic vistas from Saddle Peak, the highest point in the Andamans"
        },
        {
            src: "/images/diglipur/kalipur-beach-turtle.jpg", // Use specific paths
            alt: "Turtle tracks on Kalipur Beach, Diglipur",
            caption: "Kalipur Beach, a vital nesting ground for sea turtles"
        },
        {
            src: "/images/diglipur/alfred-caves.jpg", // Use specific paths
            alt: "Entrance to Alfred Caves near Diglipur",
            caption: "Exploring the limestone formations of Alfred Caves"
        },
        {
            src: "/images/diglipur/diglipur-landscape.jpg", // Use specific paths
            alt: "Rural landscape near Diglipur town",
            caption: "Lush green scenery typical of the Diglipur region"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Baratang Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/diglipur/hero.webp" // Use specific Diglipur hero image
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
                            <button className={buttonPrimaryStyle}>
                                Explore Diglipur <ArrowRight size={18} className="ml-2" />
                            </button>
                            <button className={buttonSecondaryStyleHero}>
                                <Camera size={18} className="mr-2" /> View Gallery
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className={`container mx-auto px-4 ${sectionPadding}`}>

                {/* Quick Facts Card - Contextual Color (Informational Blue) */}
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
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>North Andaman Island, ~300 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Ross & Smith Islands, Saddle Peak, Turtle Nesting, Alfred Caves</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Mountain className={infoIconColor} size={18} /> {/* Highlighting adventure */}
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Vibe</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Offbeat, adventurous, gateway to North Andaman's natural wonders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Diglipur.</p>
                    <div className={`${neutralBg} p-1 rounded-full inline-flex border ${neutralBorder}`}>
                        <button
                            onClick={() => setShowComprehensive(false)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${!showComprehensive ? `${primaryButtonBg} ${primaryButtonText} shadow-sm` : `bg-transparent text-gray-700 hover:${neutralBg}`}`}
                        >
                            Brief Guide
                        </button>
                        <button
                            onClick={() => setShowComprehensive(true)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${showComprehensive ? `${primaryButtonBg} ${primaryButtonText} shadow-sm` : `bg-transparent text-gray-700 hover:${neutralBg}`}`}
                        >
                            Comprehensive Guide
                        </button>
                    </div>
                </div>

                {/* Image Gallery - Neutral Theme */}
                <div className="mb-16">
                    <div className={`relative h-[50vh] w-full rounded-2xl overflow-hidden shadow-lg mb-4 border ${neutralBorderLight}`}>
                        <Image src={galleryImages[activeImage].src} alt={galleryImages[activeImage].alt} fill style={{ objectFit: 'cover' }} />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-white text-lg drop-shadow">{galleryImages[activeImage].caption}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className={`relative h-20 w-32 rounded-lg overflow-hidden cursor-pointer transition-all ${activeImage === index ? `ring-4 ${primaryButtonBg}` : 'opacity-70 hover:opacity-100'}`}
                                onClick={() => setActiveImage(index)}
                            >
                                <Image src={image.src} alt={image.alt} fill style={{ objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Based on Toggle */}
                {!showComprehensive ? (
                    // Brief Guide Content - Neutral Theme with Contextual Colors
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-10">
                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${neutralIconColor}`} size={24} /> Overview
                                </h2>
                                <div className={cardBaseStyle}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Diglipur, the largest town in North Andaman, is an adventure hub known for Saddle Peak (Andamans' highest point), the stunning Ross & Smith twin islands connected by a sandbar, turtle nesting beaches (Kalipur), limestone caves (Alfred Caves), and mud volcanoes. Offers an offbeat, nature-focused experience.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Getting There & Around
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Car className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Road (ATR):</span><span className={neutralTextLight}> 12-14 hrs from Port Blair via bus/taxi (long, scenic, involves ferries & Jarawa reserve passage).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Sea:</span><span className={neutralTextLight}> Govt. ferry from Port Blair (10+ hrs, often overnight, 3-4 times/week). Book ahead.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Local Transport:</span><span className={neutralTextLight}> Best option is scooter/motorbike rental (~₹500/day) or hired car (~₹2500+/day). Limited buses/jeeps. Autos for town rides.</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Calendar className={`mr-3 ${neutralIconColor}`} size={24} /> Best Time to Visit
                                </h2>
                                <div className={cardBaseStyle}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Contextual seasonal cards */}
                                        <div className={`${infoBg} rounded-xl p-4 border ${infoBorder}`}>
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Dec–Mar</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Ideal weather, peak turtle nesting, best for treks/beaches.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Nov & Apr</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Good shoulder season months, pleasant weather.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Oct</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon/post-monsoon, travel difficult, activities limited.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Compass className={`mr-3 ${neutralIconColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Attraction Cards - Remain Neutral */}
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Ross & Smith Islands</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Iconic twin islands joined by a sandbar (low tide). Stunning beach, clear water. Permit/boat needed.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Mountain size={18} className="mr-2 text-green-600" />Saddle Peak</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Highest peak (732m). Challenging 8km trek through national park for panoramic views.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" />Kalipur Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Famous turtle nesting site (Dec-Apr). Grey sand, Forest Dept. hatchery.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Alfred Caves</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Limestone caves near Ramnagar, home to swiftlets. Requires forest trek and guide.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar - Contextual Colors */}
                        <aside className="lg:col-span-1 space-y-8">
                            {/* Accommodation Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Bed className={`mr-2 ${neutralIconColor}`} size={20} /> Accommodation
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Limited options. Budget lodges in town. Best value: Pristine Beach Resort or Turtle Nest Resort (Govt.) near Kalipur Beach.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>No luxury resorts. Booking ahead essential in peak season.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Simple town eateries (dhabas) serving Bengali/Tamil thalis, fish curry.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Pristine Beach Resort restaurant offers the most variety (multi-cuisine, seafood focus).</span></li>
                                </ul>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Adhere strictly to Jarawa reserve convoy rules on ATR.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Trek Saddle Peak safely (guide, water, start early). Swim cautiously (check currents).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry cash, first-aid kit, repellent. Basic medical facilities. Poor connectivity.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Pack out all trash. Avoid single-use plastics.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect turtle nesting sites (follow guidelines, no lights/noise).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not collect corals/shells. Support local businesses.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                ) : (
                    // Comprehensive Guide Content - Neutral Theme with Contextual Colors
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${neutralIconColor}`} size={24} /> Detailed Overview
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Diglipur, situated at the northernmost tip of the Andaman Islands (approximately 300 km from Port Blair), is the administrative center and largest town of North Andaman. Often considered the final frontier for tourism in the archipelago, it offers a raw, adventurous, and less commercialized experience compared to the southern islands. Diglipur serves as the gateway to some of the most spectacular natural wonders of the Andamans, including the archipelago's highest point, Saddle Peak (732m), the breathtaking twin islands of Ross and Smith connected by a natural sandbar, and crucial turtle nesting beaches like Kalipur and Ramnagar.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>The town itself is relatively small and primarily functional, catering to the local population engaged in agriculture (rice, coconuts, areca nuts) and fishing. However, the surrounding region is a paradise for nature enthusiasts and adventure seekers. Visitors can explore dense tropical rainforests within Saddle Peak National Park, discover hidden limestone caves like Alfred Caves, witness the unique phenomenon of mud volcanoes, and enjoy pristine, often deserted beaches. The remoteness of Diglipur contributes to its untouched beauty and makes it an ideal destination for those looking to escape the crowds and immerse themselves in nature.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Diglipur:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Road (ATR):</strong> The most common route, though long (12-14 hours). Daily government and private buses operate from Port Blair, typically starting very early (4-6 AM). Private taxis offer more comfort but are expensive. The journey involves crossing three vehicle ferries and passing through the Jarawa Tribal Reserve under strict convoy rules (no stopping, photos, or interaction).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Sea (Ferry):</strong> Government ferries run from Port Blair (Phoenix Bay Jetty) to Diglipur (Aerial Bay Jetty) about 3-4 times a week. The journey takes 10+ hours, often overnight. Offers a more relaxed travel experience compared to the road journey. Booking tickets well in advance at DSS counters is essential.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Air (Helicopter):</strong> Infrequent Pawan Hans helicopter service exists, primarily for official/medical use. Tourist seats are limited, expensive, and booking is difficult. Not a reliable option for planning.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Diglipur:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Scooter/Motorbike Rental:</strong> The best option for flexibility (~₹500 per day). Available in Diglipur town; ask hotels or locals. Essential for reaching spread-out attractions independently. Ensure fuel availability.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Hired Car/Jeep:</strong> Can be arranged through hotels for sightseeing (~₹2500-3500 per day). Suitable for families or groups covering multiple sites like Ross & Smith jetty, Saddle Peak base, etc.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws:</strong> Available for short distances within Diglipur town and nearby areas. Negotiate fares.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Local Buses/Shared Jeeps:</strong> Connect the town with villages but are infrequent and follow fixed routes. Not ideal for efficient sightseeing.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Boat Hire:</strong> Necessary for Ross & Smith Islands (from Aerial Bay Jetty) and potentially for accessing remote beaches or snorkeling spots. Negotiate prices directly with boatmen.</li>
                                        </ul>
                                        {/* Warning Box for Jarawa Reserve Rules - Repeated for emphasis */}
                                        <div className={`mt-6 p-4 ${warningBg} border-l-4 ${warningBorder} text-orange-800 rounded-r-lg shadow-sm`}>
                                            <h4 className={`font-semibold mb-2 ${warningText} flex items-center`}><Shield className="w-5 h-5 mr-2" /> Jarawa Reserve Travel Rules</h4>
                                            <p className="text-sm md:text-base">
                                                Reminder: Travel via ATR requires adherence to strict convoy timings and rules within the Jarawa Tribal Reserve. No stopping, photography, or interaction permitted. Violations lead to serious penalties.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Compass className={`mr-3 ${neutralIconColor}`} size={24} /> Exploring Attractions & Activities
                                </h2>
                                <div className="space-y-6">
                                    {/* Attraction Cards - Remain Neutral */}
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Ross and Smith Islands</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Undoubtedly Diglipur's star attraction. These picturesque twin islands are connected by a narrow, dazzling white sandbar that emerges during low tide, allowing you to walk between them. Surrounded by clear turquoise waters and lush forest, they offer fantastic swimming, sunbathing, and snorkeling opportunities (bring your own gear or rent basic sets). Requires a Forest Department permit (obtained easily at Aerial Bay Jetty) and a 20-30 minute boat ride from Aerial Bay Jetty (approx. ₹5000-6000 per boat for a few hours). Limited facilities on Smith Island (eco-huts, changing rooms). Check tide timings before going.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Mountain size={18} className="mr-2 text-green-600" /> Saddle Peak National Park & Trek</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Home to Saddle Peak (732m), the highest point in the Andaman & Nicobar archipelago. The 8 km trek (one way, ~4-5 hours round trip) to the summit starts from Lamiya Bay, about 10 km from Diglipur town. The trail winds through dense tropical rainforest, offering chances to spot endemic birds and wildlife. The climb is moderately challenging with some steep sections. Clear weather provides breathtaking panoramic views of the North Andaman coastline and surrounding islands from the top. Start early (6-7 AM), carry plenty of water and snacks, wear good trekking shoes, and consider hiring a local guide. Entry permit required from the Forest Check Post at the trailhead.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" /> Kalipur Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located about 18 km from Diglipur town, Kalipur is famous as a nesting ground for four species of sea turtles (Olive Ridley, Green, Hawksbill, Leatherback), primarily between December and April. The beach has grey volcanic sand and calm waters, suitable for swimming. A Forest Department hatchery often operates during nesting season to protect eggs. Witnessing nesting (at night) or hatchling releases (early morning) requires patience and adherence to guidelines (no white lights, noise). Pristine Beach Resort and Turtle Nest Resort are located here.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" /> Ramnagar Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Another significant turtle nesting beach, located about 35 km south of Diglipur near the village of Ramnagar. It's generally quieter than Kalipur. Offers a long stretch of sandy shore suitable for walks and picnics. The nearby village provides a glimpse into local life. Can be combined with a visit to Alfred Caves.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Alfred Caves (Pathi Level Caves)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A network of limestone caves situated near Ramnagar village. Reaching the caves involves a trek (approx. 1 hour) through dense forest, making it an adventurous outing. The caves are known for their stalactite formations and as a habitat for edible-nest swiftlets. Exploring the dark, narrow caves requires a torch, sturdy footwear, and preferably a local guide familiar with the route. Best visited during the dry season (post-monsoon trails can be very difficult).</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Mud Volcanoes of Shyamnagar</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located near Shyamnagar village, about 40 km south of Diglipur (closer to the ATR route). Similar to the mud volcano near Baratang but smaller and less visited. Features several small craters emitting natural gas and bubbling mud. A short walk from the road leads to the site. An interesting geological phenomenon, though visually understated.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Lamiya Bay Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located at the foothills of Saddle Peak (start point for the trek). This beach is known for its smooth, polished pebbles and rocks rather than sand. Offers scenic views of the coastline and Saddle Peak. Good spot for a brief stop and photography.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Diglipur offers primarily budget to mid-range lodging, with no luxury resorts. The most popular options are near Kalipur Beach: Pristine Beach Resort (offers various cottage types, ~₹800-₹3000) and the government-run Turtle Nest Resort (basic but well-located, ~₹1000-₹2000, book early). In Diglipur town, find budget lodges like Hotel Laxmi Lodge or slightly better options like Hotel Landfall (~₹1500). Government guesthouses (APWD) exist but tourist availability is limited. Book accommodation well in advance, especially during peak season (Dec-Mar).</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Dining options are simple. In Diglipur town market, find local eateries ('dhabas') serving affordable Bengali or South Indian thalis, fish curry, and basic Indian dishes (e.g., New Hira Family Restaurant). The restaurant at Pristine Beach Resort offers the widest menu (Indian, basic Chinese/Continental, focus on seafood) and is open to non-guests, though pricier. Pack snacks and water for day trips, as options near attractions like Saddle Peak or Alfred Caves are non-existent.</p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar - Contextual Colors */}
                        <aside className="lg:col-span-1 space-y-8">
                            {/* Best Time to Visit - Contextual */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Calendar className={`mr-2 ${neutralIconColor}`} size={20} /> Best Time to Visit
                                </h3>
                                <div className="space-y-3">
                                    <div className={`${infoBg} rounded-lg p-3 border ${infoBorder}`}>
                                        <h4 className={`font-medium ${infoText} text-sm`}>Nov–Apr (Dry Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Best period for pleasant weather, trekking, beaches, and boat trips.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Dec–Mar (Peak & Nesting)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Ideal conditions; prime time for turtle nesting observation at Kalipur/Ramnagar.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Jun–Oct (Monsoon/Post)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Heavy rains, travel challenges. October sees improving conditions.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Important Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Jarawa Reserve:** Mandatory adherence to convoy rules and NO interaction/photography on the ATR.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Trekking:** Use a guide for Saddle Peak & Alfred Caves. Carry water, first-aid, inform someone of your plans. Start treks early.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Water Safety:** Be cautious of currents at beaches. Avoid swimming near mangrove creeks. Use life jackets on boats.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Permits:** Required for Ross & Smith Islands (obtain at Aerial Bay) and potentially for Saddle Peak trek (check at entry).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Health & Essentials:** Carry sufficient cash, basic medicines, insect repellent. Medical facilities are basic. Poor connectivity (BSNL best).</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Turtle Nesting:** Follow guidelines strictly – use red light filters, maintain distance, avoid noise/flash photography. Never disturb nests or hatchlings.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Waste Management:** Minimize plastic use. Pack out all your garbage, especially from remote areas like beaches and trek trails.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Respect Nature:** Do not collect corals, shells, or plants. Stay on marked paths. Do not feed wildlife.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Support Locals:** Hire local guides, use local transport options, eat at local eateries, buy local products (responsibly).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Conserve Resources:** Use water and electricity sparingly in accommodations.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book accommodation and onward transport (ferries/buses) well in advance.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry enough cash; ATMs are unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Rent a scooter/motorbike for maximum flexibility in exploring spread-out attractions.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack for adventure: good trekking shoes, torch, rain gear (even in dry season), swimwear, first-aid kit, power bank.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Be prepared for long travel times and basic facilities. Embrace the offbeat nature of Diglipur.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Check tide timings for visiting Ross & Smith Islands sandbar.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Hire local guides for treks like Saddle Peak and Alfred Caves for safety and insights.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Embark on Your Diglipur Adventure</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Ready to trek the highest peak, walk between islands, and witness nature's wonders in Diglipur? Plan your North Andaman expedition today.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=diglipur" className={buttonPrimaryStyle}>
                            View Diglipur Packages <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300`}>
                            Get Travel Assistance
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}