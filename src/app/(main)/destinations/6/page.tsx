// Path: src/app/destinations/mayabundar/page.tsx
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
    Compass,
    Users,      // Keep for cultural mix/Karen tribe
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
    Turtle,     // Keep for Karmatang Beach
    LifeBuoy    // Use LifeBuoy for Safety consistency
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

export default function MayabundarPage() { // Renamed function
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Mayabundar
    const galleryImages = [
        {
            src: "/images/mayabundar/karmatang-beach.jpg", // Use specific paths
            alt: "Karmatang Beach, Mayabundar",
            caption: "The serene Karmatang Beach, famous for turtle nesting"
        },
        {
            src: "/images/mayabundar/german-jetty.jpg", // Use specific paths
            alt: "German Jetty ruins, Mayabundar",
            caption: "Historic German Jetty offering scenic coastal views"
        },
        {
            src: "/images/mayabundar/avis-island.jpg", // Use specific paths
            alt: "Avis Island near Mayabundar",
            caption: "The picturesque coconut groves of Avis Island"
        },
        {
            src: "/images/mayabundar/karen-village.jpg", // Use specific paths
            alt: "Karen Village (Webi) near Mayabundar",
            caption: "Glimpse into the unique culture of the Karen community"
        },
        {
            src: "/images/mayabundar/mangrove-creek.jpg", // Use specific paths
            alt: "Mangrove creeks near Mayabundar",
            caption: "Exploring the mangrove ecosystems around Mayabundar"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Baratang Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/mayabundar/hero.jpg" // Use specific Mayabundar hero image
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
                            <button className={buttonPrimaryStyle}>
                                Explore Mayabundar <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Mayabundar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Northern Middle Andaman, ~240 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Karmatang Beach (Turtle Nesting), Karen Culture, German Jetty, Avis Island</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Users className={infoIconColor} size={18} /> {/* Highlighting cultural aspect */}
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Vibe</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Offbeat, quiet, culturally diverse, gateway to North Andaman</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Mayabundar.</p>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Mayabundar, in northern Middle Andaman, offers an offbeat experience with a unique cultural mix (Bengali settlers, Karen tribe). Known for Karmatang Beach (turtle nesting), mangrove creeks, and islands like Avis. Provides a quiet retreat with basic tourist infrastructure.</p>
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
                                            <div><span className={`font-medium ${neutralText}`}>Road (ATR):</span><span className={neutralTextLight}> 9-10 hrs from Port Blair via Govt/private bus or cab (Jarawa reserve passage rules apply).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Ferry:</span><span className={neutralTextLight}> Govt ferry from Port Blair (8-9 hrs, often overnight). Check schedule.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Local Transport:</span><span className={neutralTextLight}> Local bus, shared jeep, auto-rickshaw. Boat hire for islands. Limited scooter rental.</span></div>
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
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Nov–Feb</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Ideal weather, calm seas, peak turtle nesting.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Oct–Apr</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Generally good dry season for travel.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>May–Sep</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon, lush, travel disruptions possible.</p>
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" />Karmatang Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Famous turtle nesting site ("Turtle Paradise"). Long sandy beach.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>German Jetty</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Historic pier ruins with scenic rocky coastal views.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Avis Island</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Small coconut island near Mayabundar, good for picnics/snorkeling (permit needed).</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Users size={18} className="mr-2 text-blue-600" />Karen Village (Webi)</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Experience the unique culture of the Burmese Karen settlers.</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Limited: Basic budget lodges, mid-range hotels (Sea 'n' Sand, Blue Bird), Govt. guesthouses. No luxury options.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Booking ahead highly recommended.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Simple local eateries (dhabas) in market serving Bengali thalis and fresh seafood.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Hotel restaurants offer basic Indian/Chinese menus. Limited options outside town.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Follow Jarawa reserve rules strictly during road travel.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use mosquito repellent. Be cautious swimming in creeks (crocodiles).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Basic health facilities; carry first-aid kit. BSNL network best. Carry cash.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize waste, carry reusable items, pack out trash.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect turtle nesting sites and wildlife. Do not disturb.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support local businesses. Conserve resources. Obtain necessary permits.</span></li>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Mayabundar, situated approximately 240 km north of Port Blair by road, serves as the administrative hub for the North and Middle Andaman district. Despite its official status, it maintains a remarkably quiet, small-town atmosphere, far removed from the mainstream tourist trail. Its unique character stems from a fascinating blend of cultures, including descendants of Burmese Karen tribes brought by the British, Bengali settlers from former East Pakistan, and Tamils. This cultural mosaic is reflected in the local cuisine, languages spoken, and village life.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>The town itself is modest, centred around a marketplace and jetty overlooking mangrove-lined creeks. Mayabundar's appeal lies in its tranquil natural surroundings and offbeat attractions. It's particularly known for Karmatang Beach, a significant turtle nesting site. Other points of interest include the historic German Jetty ruins, quiet beaches like Rampur, nearby islands such as Avis (famous for coconuts) and Interview Island (a wildlife sanctuary with feral elephants, requiring permits), and opportunities for mangrove exploration. Mayabundar offers an authentic, uncommercialized Andaman experience for those seeking peace, cultural immersion, and nature away from the crowds.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Mayabundar:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Road (ATR):</strong> The primary route. The journey from Port Blair via the Andaman Trunk Road takes 9-10 hours.
                                                <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                                                    <li><strong className="text-gray-700">Buses:</strong> Government and private buses depart daily from Port Blair (early morning). Economical but long.</li>
                                                    <li><strong className="text-gray-700">Private Cab:</strong> More comfortable, allows stops. Higher cost.</li>
                                                    <li><strong className="text-gray-700">Route Details:</strong> Involves ferry crossings and mandatory convoy travel through the Jarawa Tribal Reserve (strict rules apply: no stopping, photos, interaction).</li>
                                                </ul>
                                            </li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Sea (Ferry):</strong> Government ferries connect Port Blair (Phoenix Bay Jetty) to Mayabundar (Aerial Bay Jetty), often as part of the Diglipur route. Journey takes 8-9 hours, potentially overnight. Schedules are infrequent (check DSS website/counter) and booking well in advance is necessary.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Mayabundar:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Walking:</strong> Suitable for the main market and jetty area.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws:</strong> Available for short trips; negotiate fares for longer distances (e.g., to Karmatang Beach).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Local Buses & Shared Jeeps:</strong> Connect the town with villages like Karmatang, Rampur, Webi. Infrequent but very cheap.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Boat Hire:</strong> Small boats ('dunghis') can be hired from the jetty for trips to Avis Island or Interview Island (permits required). Negotiate price and ensure safety gear.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Vehicle Hire:</strong> Arranging a car/jeep through your hotel is the best option for comfortable sightseeing covering multiple points. Scooter rentals are generally unavailable.</li>
                                        </ul>
                                        {/* Warning Box for Jarawa Reserve Rules - Repeated for emphasis */}
                                        <div className={`mt-6 p-4 ${warningBg} border-l-4 ${warningBorder} text-orange-800 rounded-r-lg shadow-sm`}>
                                            <h4 className={`font-semibold mb-2 ${warningText} flex items-center`}><Shield className="w-5 h-5 mr-2" /> Jarawa Reserve Travel Reminder</h4>
                                            <p className="text-sm md:text-base">
                                                When travelling by road (ATR), remember the strict regulations within the Jarawa Tribal Reserve: travel in designated convoys, NO stopping, NO photography/videography, and NO interaction with tribe members. Respect their space and the law.
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" /> Karmatang Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Known as "Turtle Paradise," this long stretch of greyish sand is a vital nesting site for Olive Ridley and Green Sea Turtles (Dec-Feb peak). Features a small park, watchtower, and eco-huts. Ideal for quiet walks, swimming in calm shallow waters, and observing turtle conservation efforts (seasonal hatchery). Located about 13 km from Mayabundar town.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>German Jetty</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A short drive from town, this site features the ruins of an old jetty against a backdrop of rocky coastline and crashing waves. Offers picturesque views and photo opportunities, especially during high tide or sunset. Named after German engineers involved pre-independence, not a German settlement.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Rampur Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A small, serene beach near Mayabundar town, accessible via a short walk through coconut groves. Known for its beautiful view of a mangrove-lined creek meeting the sea. Peaceful spot for relaxation and enjoying coastal scenery.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Avis Island (Coconut Island)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A beautiful, uninhabited island about a 20-minute boat ride from Mayabundar jetty. Covered in dense coconut plantations with a pristine white sand beach. Excellent for picnics, sunbathing, and snorkeling in clear shallow waters. Requires a permit from the Forest Department (usually arranged by boat operators).</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Interview Island</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A large island sanctuary west of Mayabundar, famous for its population of wild, feral elephants. Visiting requires permits from the Forest Department and involves a challenging boat journey (can be rough) and guided trekking through dense forest to spot elephants near water sources. An adventurous trip for wildlife enthusiasts.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Ray Hills</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>An eco-tourism initiative located about 15 km from Mayabundar. Offers activities like elephant rides (check current status), nature trails through plantations, rock climbing opportunities, and angling. Aims to showcase the region's biodiversity and promote sustainable practices.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Users size={18} className="mr-2 text-blue-600" /> Karen Village (Webi)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Visiting Webi village offers a unique cultural experience. Interact respectfully with the Karen community, originally from Burma, observe their distinct lifestyle, traditional wooden houses, and perhaps visit their church. A chance to learn about a lesser-known part of Andaman history.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Mangrove Creek Exploration</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>The waterways around Mayabundar are rich in mangrove ecosystems. Hiring a small boat ('dunghi') for a cruise through the creeks offers opportunities for birdwatching and experiencing the unique tidal forest environment.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Lodging in Mayabundar is basic and limited. Expect budget guesthouses and a few mid-range hotels rather than resorts. Popular choices include Sea 'n' Sand Hotel, Hotel Aashna, Blue Bird Resort (cottages), and government guesthouses like APWD Guest House (often prioritized for officials). Rooms are generally clean but simple, with AC available in some mid-range options. Booking ahead is crucial, especially during peak season (Dec-Jan), as availability is scarce. Don't expect Wi-Fi or extensive amenities.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Dining options primarily consist of small local eateries ('dhabas') in the market area and restaurants attached to the main hotels (like The Kadai at Sea 'n' Sand or Carlo Restaurant & Bar). Food is simple, home-style Indian cuisine, with Bengali and South Indian influences. Fresh seafood (fish curry, fried fish) is readily available and recommended. Vegetarian thalis and basic veg dishes are usually offered. Options outside the main town are minimal, so carry snacks/water for day trips.</p>
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
                                        <h4 className={`font-medium ${infoText} text-sm`}>Oct–Apr (Dry Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Ideal for travel, beach visits, boat trips. Pleasant weather.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Dec–Feb (Peak/Nesting)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Best weather, prime time for turtle nesting at Karmatang Beach.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>May–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Heavy rains, lush scenery, potential travel disruptions.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Important Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Jarawa Reserve:** Strict adherence to convoy rules (NO stopping, photos, interaction) is mandatory when travelling via ATR.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Permits:** Necessary for visiting certain islands like Avis and Interview Island. Arrange in advance.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Wildlife:** Maintain safe distance from wild elephants on Interview Island. Beware of crocodiles in mangrove creeks.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Health:** Carry mosquito repellent and basic first-aid. Drink safe water. Health facilities are basic.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Connectivity & Cash:** Expect poor mobile/internet signal. Carry sufficient cash as ATMs are unreliable.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect local cultures (Bengali, Karen etc.). Dress modestly in villages. Ask permission for photos.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic use; carry reusable items. Dispose of trash correctly.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Protect turtle nesting sites at Karmatang Beach. Avoid noise/lights during nesting season. Follow official guidelines.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not disturb wildlife or damage natural habitats (mangroves, coral).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support local economy through local eateries, guides, and handicraft purchases.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book accommodation and transport (ferries/cabs) well in advance due to limited options.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash; card payments and reliable ATMs are scarce.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Be prepared for long travel times and potentially basic amenities. Pack accordingly.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>BSNL SIM card offers the best chance of connectivity. Download offline maps.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack essentials: insect repellent, sunscreen, basic medicines, torch/flashlight, power bank.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Plan sightseeing trips in advance; consider hiring a vehicle for efficiency as attractions are spread out.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Engage with locals respectfully to learn about the unique culture (especially the Karen community).</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Discover Authentic Mayabundar</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Interested in exploring the cultural richness and natural wonders of Mayabundar? Contact us to craft your unique Andaman itinerary.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=mayabundar" className={buttonPrimaryStyle}>
                            View Mayabundar Options <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300`}>
                            Plan Your Trip
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}