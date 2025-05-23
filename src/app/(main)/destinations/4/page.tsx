// Path: src/app/destinations/baratang-island/page.tsx
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
    Users,      // Keep for cultural aspects if needed, or general info (Jarawa Reserve)
    Shield,     // Consistent Safety icon
    Leaf,       // Consistent Sustainability icon
    ChevronRight,
    Star,
    Navigation, // Consistent Travel icon
    ArrowRight,
    MessageCircle, // Consistent Tip icon
    Camera,     // Consistent Gallery icon
    Ship,       // Keep for Ferry access
    Car,        // Keep for Road access (ATR Convoy)
    TreePine,   // Specific for Mangroves
    Mountain,   // Using for geological features (Caves/Volcano) - generic nature icon
    LifeBuoy    // Consistent Safety icon
} from 'lucide-react';

// --- Define Common Styles (Copied from Diglipur Sample - Neutral Theme with Contextual Colors) ---
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

export default function BaratangIslandPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Baratang Island
    const galleryImages = [
        {
            src: "/images/baratang/limestone-caves.webp", // Use specific paths
            alt: "Limestone Caves of Baratang",
            caption: "The stunning limestone formations inside Baratang's caves"
        },
        {
            src: "/images/baratang/mud-volcano.webp", // Use specific paths
            alt: "Mud Volcano, Baratang",
            caption: "Unique bubbling mud volcanoes - a rare geological phenomenon"
        },
        {
            src: "/images/baratang/mangrove-creek.webp", // Use specific paths
            alt: "Mangrove Creek boat ride, Baratang",
            caption: "Serene boat ride through dense mangrove forests"
        },
        {
            src: "/images/baratang/parrot-island.webp", // Use specific paths
            alt: "Parrot Island near Baratang at sunset",
            caption: "Thousands of parrots return to roost at sunset"
        },
        {
            src: "/images/baratang/baludera-beach.webp", // Use specific paths
            alt: "Baludera Beach, Baratang",
            caption: "Pristine and secluded Baludera Beach"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/baratang/hero.webp" // Use specific Baratang hero image
                    alt="Mangrove creek landscape in Baratang Island"
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
                                    <span className="text-white font-medium">Baratang Island</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Baratang Island</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Explore limestone caves, mud volcanoes, and pristine mangroves in this unique Andaman destination.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className={buttonPrimaryStyle}>
                                Discover Baratang <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Baratang Island
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Middle Andaman, ~100 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Limestone caves, mud volcanoes, mangrove boat rides, Jarawa Reserve passage</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Calendar className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Visit Type</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Primarily a day trip from Port Blair due to convoy timings</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Baratang Island.</p>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Baratang Island offers a unique glimpse into Andaman's geological wonders and rich mangrove ecosystems. Famous for its natural Limestone Caves and bubbling Mud Volcanoes, the journey itself involves a scenic boat ride through mangrove creeks and passing through the Jarawa Tribal Reserve via road convoy.</p>
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
                                            <div><span className={`font-medium ${neutralText}`}>Road Convoy (ATR):</span><span className={neutralTextLight}> Primarily a day trip from Port Blair (3-4 hrs one way). Requires early start (4-6 AM) to join convoys (~6:30 AM, 9:30 AM) through Jarawa Reserve. Involves vehicle ferry.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Sea (Govt. Ferry):</span><span className={neutralTextLight}> Infrequent service from Port Blair (~2.5 hrs). Not suitable for same-day return.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Local Transport:</span><span className={neutralTextLight}> Speedboat required for Limestone Caves (part of tour). Hire jeep/car for Mud Volcano (~₹400-600). Limited local buses.</span></div>
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
                                            <p className={`text-sm ${neutralTextLight}`}>Ideal: Pleasant weather, dry trails for cave trek.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Mar–May</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Shoulder: Hotter, but generally dry and feasible.</p>
                                        </div>
                                        <div className={`${errorBg} rounded-xl p-4 border ${errorBorder}`}> {/* Use Error for monsoon due to potential closures */}
                                            <h3 className={`font-semibold ${errorText} mb-2`}>Jun–Oct</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon: Heavy rain, muddy trails, risk of cancellations.</p>
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Mountain size={18} className="mr-2 text-blue-600" />Limestone Caves</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Natural caves with stalactites/stalagmites. Reached via mangrove boat ride + 1.5km walk.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Mountain size={18} className="mr-2 text-orange-600" />Mud Volcano</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Unique geological feature with small bubbling mud craters. Short walk from road.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><TreePine size={18} className="mr-2 text-green-600" />Mangrove Creek Ride</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Scenic speedboat journey through dense mangrove forests, part of the cave trip.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Parrot Island</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Witness thousands of parrots at sunset (requires overnight stay/late return, difficult on day trip).</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Very limited & basic (Govt. guesthouses, few private lodges).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Most visitors do a day trip from Port Blair.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Basic local eateries (dhabas) near the jetty serving simple Indian meals.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Carry own water and snacks recommended.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Strictly follow Jarawa Reserve rules:** No stopping, photos, interaction. Use designated convoys.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Permits needed (usually handled by tour operators/checked at Jirkatang).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Wear comfortable shoes for walking/trekking. Carry torch for caves.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not litter, especially in mangroves and caves. Pack out trash.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Avoid touching cave formations. Respect the fragile environment.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic use; carry reusable water bottles.</span></li>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Baratang Island, situated roughly 100 kilometers north of Port Blair, serves as a bridge between South and Middle Andaman. It's renowned for offering a distinct experience focused on unique geological formations and rich biodiversity, particularly its dense mangrove ecosystems. The island's primary draws are the naturally formed Limestone Caves, the peculiar Mud Volcanoes (one of the few sites in India), and the captivating boat journey required to reach the caves, which winds through narrow mangrove creeks offering a tunnel-like effect in places.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Accessing Baratang is an adventure in itself, typically undertaken as a day trip from Port Blair. The journey involves traveling north on the Andaman Trunk Road (ATR), which passes through the Jarawa Tribal Reserve. Travel through this reserve is strictly regulated, requiring vehicles to move in scheduled convoys with restrictions on stopping, photography, and interaction, underscoring the need for sensitivity towards the indigenous Jarawa community. Due to the early start required for the convoy and the travel time involved, Baratang remains less commercialized than islands closer to Port Blair, offering a rawer, more adventurous feel. Limited infrastructure means accommodation and food options are basic, reinforcing its status as primarily a day-trip destination.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Baratang:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Road (ATR Convoy - Primary Method):</strong> This is the standard way for tourists. Depart Port Blair very early (4:00 AM - 5:30 AM) by private car or shared taxi/bus. Drive to Jirkatang check post (~1.5 hrs). Wait for the convoy (fixed timings, usually ~6:30 AM & 9:30 AM departures). Travel through the Jarawa Reserve (~1.5 hrs, NO stops/photos). Arrive at Middle Strait Jetty. Cross the strait via a vehicle ferry (~15-20 mins) to Nilambur Jetty on Baratang Island. Total one-way travel time: Approx. 3.5-4 hours. The return journey follows the same procedure with afternoon convoys (check timings).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Government Ferry:</strong> Ferries operate from Phoenix Bay Jetty (Port Blair) to Nilambur Jetty (Baratang). Journey time is approx. 2.5 hours. However, schedules are infrequent, unreliable, and often change. This option is generally not suitable for a day trip as return timings might not align. Check the latest DSS (Directorate of Shipping Services) schedule locally if considering this.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Baratang:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Speedboat (for Caves):</strong> Essential for reaching the Limestone Caves. Hired from Nilambur Jetty (usually included in tour packages). Takes approx. 25-30 minutes through mangrove creeks.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Jeep/Car Hire:</strong> Available at Nilambur Jetty to visit the Mud Volcano (a few kms away). Cost approx. ₹400-₹600 for a round trip. Can also be hired for Baludera Beach.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Walking/Trekking:</strong> A 1.5 km walk/trek is required from the boat drop-off point to the Limestone Caves entrance. A short walk is needed from the parking area to the Mud Volcano site.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Local Bus:</strong> Very limited government bus service connects the jetty with nearby villages and potentially the Mud Volcano road junction. Not practical for efficient sightseeing.</li>
                                        </ul>
                                        {/* Warning Box for Jarawa Reserve Rules - Repeated for emphasis */}
                                        <div className={`mt-6 p-4 ${warningBg} border-l-4 ${warningBorder} text-orange-800 rounded-r-lg shadow-sm`}>
                                            <h4 className={`font-semibold mb-2 ${warningText} flex items-center`}><Shield className="w-5 h-5 mr-2" /> Jarawa Reserve Travel Rules Reminder</h4>
                                            <p className="text-sm md:text-base">
                                                Travel via ATR through the Jarawa Tribal Reserve requires strict adherence to convoy timings and rules. Absolutely no stopping, photography, videography, or interaction (gestures, offering food) with the Jarawa people is permitted. Violations carry severe legal consequences. Respect their privacy and protected status.
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Mountain size={18} className="mr-2 text-blue-600" />Limestone Caves</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>The primary attraction. After the scenic speedboat ride through mangrove creeks, a well-maintained pathway (approx. 1.5 km) leads through tropical forest and paddy fields to the cave entrance. Inside, discover impressive natural formations of stalactites (hanging from the ceiling) and stalagmites (rising from the floor), formed over millennia by dripping water dissolving the limestone. The caves are dark inside; carrying a torchlight is essential for proper viewing. Local guides are often available near the entrance to explain the formations. The entire activity (boat ride + walk + cave exploration) takes about 2-3 hours.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Mountain size={18} className="mr-2 text-orange-600" />Mud Volcano</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located a few kilometers from Nilambur Jetty. It's one of the few places in India where you can witness this geological phenomenon. Natural gases emitted from deep underground escape to the surface, pushing up mud and water to create small, gently bubbling muddy craters. While not visually dramatic like a lava volcano, it's a unique natural curiosity. A short walk from the vehicle drop-off point leads to the site, which has basic boardwalks for viewing.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><TreePine size={18} className="mr-2 text-green-600" />Mangrove Creek Boat Ride</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>The journey to the Limestone Caves is an experience in itself. The speedboat navigates through narrow, winding creeks flanked by towering mangrove forests. The dense canopy often forms a natural tunnel overhead. This ride offers a fantastic opportunity to observe the unique mangrove ecosystem, which serves as a vital nursery for marine life and protects the coastline. Keep an eye out for birds and other wildlife inhabiting the mangroves.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Parrot Island</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A small, uninhabited island near Baratang Jetty, famous for being the roosting place for thousands of parrots and parakeets. Every evening around sunset, flocks of these birds return to the island, creating a mesmerizing spectacle. Visiting requires hiring a separate boat in the late afternoon and typically necessitates an overnight stay in Baratang due to the timing, making it difficult to include in a standard day trip from Port Blair.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Baludera Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A serene and less-visited beach located about 9 km from Nilambur Jetty. It features calm, shallow waters, making it suitable for swimming and relaxation. Its curved shoreline is fringed with coastal vegetation. Due to its relative isolation, it offers a peaceful escape but has very limited facilities. Often visited after the caves and mud volcano if time permits.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Baratang has very limited accommodation options, primarily geared towards officials or those needing an overnight halt rather than tourists seeking comfort. Options include the APWD Guesthouse (often requires prior booking/connections) and a couple of basic private lodges like Dew Dale Resorts (basic, located away from the jetty) or Folder's Inn. Facilities are minimal. The vast majority of tourists visit Baratang as a day trip from Port Blair, returning the same evening.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Food options are concentrated near Nilambur Jetty. Several small local eateries (dhabas) serve simple, fresh Indian food – typically thalis (rice, dal, vegetables, sometimes fish curry), roti, noodles, and tea/coffee. Choices are limited, but sufficient for a day trip meal. It's highly recommended to carry your own reusable water bottles and some snacks (like fruits, biscuits) for the journey and activities, especially considering the early start and travel time.</p>
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
                                        <h4 className={`font-medium ${infoText} text-sm`}>November to February (Dry/Cool)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Ideal conditions: Pleasant weather, minimal rain, comfortable for walking/trekking to caves.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>March to May (Dry/Hot)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Shoulder season: Weather gets progressively hotter and more humid, but still manageable for visits.</p>
                                    </div>
                                    <div className={`${errorBg} rounded-lg p-3 border ${errorBorder}`}>
                                        <h4 className={`font-medium ${errorText} text-sm`}>June to October (Monsoon)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Least advisable: Heavy rainfall makes trails muddy and slippery. Boat services might be disrupted. Convoys may face delays.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Important Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Jarawa Reserve Rules:** Reiteration - Absolutely NO interaction, photos, videos, or stopping within the reserve. Adhere strictly to convoy rules and timings. Penalties are severe.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Permits:** Foreign nationals need Restricted Area Permit (RAP usually granted on arrival at Port Blair airport). Indian nationals generally don't need a separate Baratang permit if traveling on ATR, but checks occur at Jirkatang. Tour operators usually handle formalities.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Cave Exploration:** Carry a good torchlight (headlamp recommended). Watch your step on uneven surfaces. Avoid touching formations.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Hydration & Footwear:** Carry sufficient water. Wear comfortable walking/trekking shoes with good grip.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Connectivity:** Mobile network coverage is extremely limited or non-existent in most parts of Baratang. Inform someone of your travel plans.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Respect Jarawa Tribe:** Utmost respect and adherence to rules concerning the Jarawa Reserve is non-negotiable. Their privacy and way of life must be protected.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Protect Fragile Ecosystems:** Do not litter in mangrove creeks, forests, or caves. Avoid touching cave formations as oils from hands can damage them. Do not disturb wildlife.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Minimize Waste:** Carry reusable water bottles and containers. Pack out all your trash. Refuse single-use plastics where possible.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Support Locals:** Use local boat operators, guides (where available), and eateries respectfully.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book your Baratang day trip (transport + boat) in advance from Port Blair, especially during peak season.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Start extremely early (4-5 AM) from Port Blair to ensure you make the morning convoy.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash as ATMs are unavailable or unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light clothing, comfortable shoes, sunscreen, hat, insect repellent, and a torchlight.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Be prepared for a long day with significant travel time.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Confirm return convoy timings to ensure you get back to Port Blair the same day.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Don't expect luxury; embrace the adventurous and basic nature of the trip.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Ready for a Unique Andaman Adventure?</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Experience the natural wonders of Baratang Island. Book a day tour or inquire about incorporating it into your Andaman itinerary.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=baratang" className={buttonPrimaryStyle}>
                            View Baratang Day Tours <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300`}>
                            Get Trip Assistance
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}