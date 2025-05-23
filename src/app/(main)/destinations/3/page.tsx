// Path: src/app/destinations/neil-island/page.tsx
// Theme: Neutral with Contextual Background Colors (Applied based on Baratang/Diglipur sample)

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Check,
    Info,
    Calendar,
    Bed,        // Consistent icon for Accommodation
    Utensils,
    Compass,    // Keep for general exploration/attractions heading if needed
    Users,      // Keep for cultural aspects if needed, or general info
    Shield,     // Consistent Safety icon
    Leaf,       // Consistent Sustainability icon
    ChevronRight,
    Star,
    Navigation, // Consistent icon for Travel
    ArrowRight,
    MessageCircle, // Consistent icon for Tips
    Camera,
    Ship,       // Relevant for Neil access
    Bike,       // Relevant for Neil transport
    Waves,      // Relevant for beaches/attractions heading
    Sun,        // Relevant for sunrise/sunset
    Sunset,     // Specific for Laxmanpur Beach (can be used within text)
    LifeBuoy    // Consistent icon for Safety
    // Recycle removed as Leaf is used for Sustainability/Responsible Tourism
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

export default function NeilIslandPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Neil Island
    const galleryImages = [
        {
            src: "/images/neil/bharatpur-beach-neil.jpg", // Use specific paths
            alt: "Bharatpur Beach lagoon, Neil Island",
            caption: "The calm, shallow waters of Bharatpur Beach, ideal for swimming"
        },
        {
            src: "/images/neil/natural-bridge-neil.jpg", // Use specific paths
            alt: "Natural Bridge rock formation at low tide, Neil Island",
            caption: "The iconic Natural Bridge, best viewed during low tide"
        },
        {
            src: "/images/neil/laxmanpur-beach-sunset.jpg", // Use specific paths
            alt: "Sunset over Laxmanpur Beach, Neil Island",
            caption: "Spectacular sunset views from Laxmanpur Beach"
        },
        {
            src: "/images/neil/sitapur-beach-sunrise.jpg", // Use specific paths
            alt: "Sunrise at Sitapur Beach, Neil Island",
            caption: "Catching the serene sunrise at Sitapur Beach"
        },
        {
            src: "/images/neil/neil-cycling.jpg", // Use specific paths
            alt: "Cycling through the green fields of Neil Island",
            caption: "Exploring the island's tranquil beauty by bicycle"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Diglipur Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/neil/hero.jpg" // Use specific Neil hero image
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
                            <button className={buttonPrimaryStyle}>
                                Explore Neil Island <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Neil Island
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>South Andaman, part of Ritchie's Archipelago, near Havelock</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Natural Bridge, Bharatpur/Laxmanpur/Sitapur Beaches, Cycling, Serenity</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Bike className={infoIconColor} size={18} /> {/* Highlighting cycling */}
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Vibe</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Quiet, relaxed, rural charm, ideal for unwinding</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Neil Island.</p>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Neil Island (Shaheed Dweep) offers a serene escape known as Andaman's "vegetable bowl." It's smaller and quieter than Havelock, perfect for relaxation, cycling through villages, exploring beautiful beaches like Bharatpur, Laxmanpur (sunset) & Sitapur (sunrise), and seeing the unique Natural Bridge rock formation.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Getting There & Around
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Ferries:</span><span className={neutralTextLight}> Daily private/govt ferries connect from Port Blair (~1.5-2 hrs) and Havelock (~1 hr). Pre-booking advised.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Bike className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>On Island:</span><span className={neutralTextLight}> Cycling (highly recommended, ~₹150/day), scooter rental (~₹400-500/day), autos for point-to-point or tours, and walking. Very compact island.</span></div>
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
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Oct–May</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Ideal weather, calm seas for activities, peak season Dec-Feb.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Mar–May</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Warmer, good visibility, lush farms, fewer crowds than peak.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Sep</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon, very quiet, intensely green, some closures/limited ferries.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Waves className={`mr-3 ${neutralIconColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Attraction Cards - Remain Neutral */}
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Bharatpur Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Near jetty. Calm lagoon for swimming, snorkeling, glass-bottom boats, water sports.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Natural Bridge</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Iconic coral rock arch near Laxmanpur Beach 2. Best seen at low tide. Great for photos.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Sunset size={18} className="mr-2 text-orange-500" />Laxmanpur Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Famous for its stunning sunset views and wide sandy stretch for walks.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Sun size={18} className="mr-2 text-yellow-500" />Sitapur Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Quiet beach on the eastern tip, known for beautiful sunrises. Peaceful atmosphere.</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Range from budget huts/homestays near market to mid-range resorts (Pearl Park, TSG Aura, Summer Sands) & some luxury (SeaShell Neil).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Fewer options than Havelock. Booking ahead strongly recommended.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Fresh local produce (the 'vegetable bowl'). Tasty seafood thalis at market dhabas. Resort dining offers multi-cuisine.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Enjoy abundant fresh coconuts and farm-fresh fruit.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Generally very safe island. Standard precautions apply.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use mosquito repellent (esp. dawn/dusk). Beware sandflies.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drink bottled/filtered water. Basic PHC available for minor issues.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Wear sturdy footwear for Natural Bridge (slippery rocks at low tide).</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic use; carry reusable bottles/bags.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Protect coral reefs: Don't touch/stand on/collect marine life. Use reef-safe sunscreen.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of waste properly. Support local farmers and businesses.</span></li>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Neil Island, officially renamed Shaheed Dweep in 2018, is the charmingly rustic counterpart to its bustling neighbour, Havelock Island (Swaraj Dweep). Located just south of Havelock within Ritchie's Archipelago in South Andaman, this small island (roughly 13.7 sq km) is affectionately known as the "vegetable bowl" of the Andamans due to its fertile land yielding abundant rice, fruits, and vegetables. Neil offers a significantly more tranquil and unhurried experience, making it ideal for travellers seeking relaxation, natural beauty without the crowds, and a glimpse into authentic, slow-paced island life.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Life here revolves around its stunning, uniquely charactered beaches – Bharatpur Beach near the jetty with its calm lagoon and water sports, Laxmanpur Beach famous for breathtaking sunsets and its 'Beach No. 2' counterpart hiding the iconic Natural Bridge rock formation, and Sitapur Beach offering serene sunrises. The island's interior is a patchwork of green paddy fields, banana plantations, and sleepy villages connected by flat, shaded roads, making cycling the preferred (and most rewarding) mode of transport. While lacking the extensive tourist infrastructure and nightlife of Havelock, Neil provides a good range of accommodation, simple yet delicious local food, beautiful coral reefs for snorkeling, and a genuine sense of peace that captivates many visitors looking to unwind and connect with nature.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Neil Island (Shaheed Dweep):</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Ferry (Only Option):</strong> Access to Neil Island is exclusively via sea ferries. Daily services operate from:
                                                <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                                                    <li><strong className="text-gray-700">Port Blair (Phoenix Bay Jetty or Haddo Wharf):</strong> Journey time is approximately 1.5 - 2 hours by private ferry (Makruzz, Nautika, Green Ocean, ITT Majestic) and 2.5 - 3 hours by the slower government ferry.</li>
                                                    <li><strong className="text-gray-700">Havelock Island (Swaraj Dweep Jetty):</strong> A popular and short connection, taking about 45 minutes to 1 hour by both private and government ferries. Many travellers combine visits to Havelock and Neil.</li>
                                                </ul>
                                            </li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Private Ferries (Highly Recommended):</strong> Offer faster, more comfortable, air-conditioned travel with better booking systems. Essential to book online well in advance (weeks or even months during peak season Dec-Jan) through their websites or authorized agents.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Government Ferries:</strong> More economical but slower, less frequent, and schedules can change. Tickets are primarily allocated to islanders, making advance booking very difficult for tourists (usually requires queuing at Directorate of Shipping Services - DSS counters in Port Blair a few days prior, with no guarantee).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Neil Jetty (Bharatpur Jetty):</strong> All ferries arrive and depart from the single jetty located at Bharatpur Beach (Beach No. 4).</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Neil Island:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Bicycle Rental:</strong> The quintessential Neil experience! The island is small, relatively flat, and has minimal traffic, making cycling (~₹150-200 per day) the perfect way to explore at a leisurely pace. Rentals are easily available near the jetty and in the main market (Neil Kendra). Ideal for reaching all beaches and soaking in the laid-back village atmosphere.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Scooter/Motorbike Rental:</strong> Also readily available (~₹400-500 per day plus fuel) for quicker travel between points. Roads are generally decent but can be narrow in places. An Indian driving license may be required.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws:</strong> Easily found near the jetty and market. Good for point-to-point trips (e.g., Jetty to Laxmanpur Sunset Point approx. ₹100-150) or for hiring for a half-day/full-day island tour covering the main beaches and Natural Bridge (~₹500-1000, depending on duration and negotiation). Fix the fare beforehand.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Walking:</strong> Perfectly feasible for exploring the area around your accommodation or the Neil Kendra market. Walking between beaches is possible but can take time (e.g., Bharatpur to Laxmanpur is ~4-5 km).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Taxis (Cars):</strong> Very limited availability, mostly associated with resorts for pre-booked transfers or tours at significantly higher rates than autos. Not the standard mode of transport here.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Local Bus:</strong> An infrequent local bus service connects the main villages and jetty, but timings are often unreliable and not suited for efficient tourist sightseeing.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Waves className={`mr-3 ${neutralIconColor}`} size={24} /> Exploring Attractions & Activities
                                </h2>
                                <div className="space-y-6">
                                    {/* Attraction Cards - Remain Neutral */}
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Bharatpur Beach (Beach No. 4)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Conveniently located adjacent to the arrival jetty, Bharatpur Beach is famous for its expansive stretch of white sand and a large, calm, shallow bay protected by reefs. The turquoise lagoon is ideal for safe swimming, wading, and relaxing, making it popular with families. This is the main hub for water sports activities like jet skiing, banana boat rides, and glass-bottom boat tours to view nearby corals. Snorkeling gear can be rented here, and the near-shore reefs offer decent marine life visibility. Can get crowded, especially near the activity centers.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Natural Bridge (Howrah Bridge)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Neil Island's most photographed natural wonder, situated at the far end of Laxmanpur Beach 2 (a separate access point from the main Laxmanpur sunset beach). This striking arch-like formation, naturally carved out of coral rock by millennia of wave action, is accessible only during low tide. Reaching it involves a walk across a platform of dead coral and rocks, which can be slippery – sturdy waterproof footwear (like reef shoes or sandals with straps) is essential. The surrounding area reveals fascinating tide pools teeming with small fish, crabs, sea cucumbers, and other marine creatures. Check tide timings locally before visiting.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Sunset size={18} className="mr-2 text-orange-500" /> Laxmanpur Beach (Beach No. 1 / Sunset Point)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located on the western side of the island, this stunningly beautiful, wide triangular beach is famed for offering spectacular sunset views over the ocean. The expansive white sands, fringed by trees, are perfect for long, peaceful strolls and soaking in the serene atmosphere as the sun dips below the horizon. While picturesque, the presence of dead coral makes swimming less comfortable than at Bharatpur. Several small shacks nearby sell snacks and refreshments. This is distinct from Laxmanpur Beach 2 where the Natural Bridge is found.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Sun size={18} className="mr-2 text-yellow-500" /> Sitapur Beach (Beach No. 5 / Sunrise Beach)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Situated at the easternmost tip of Neil Island, Sitapur Beach faces the open sea and is renowned for its breathtaking sunrises. It's a relatively secluded, crescent-shaped beach with golden sands, clear waters, and interesting limestone formations at one end. Due to its exposure, swimming can sometimes be affected by stronger currents, especially during high tide, but the tranquil setting makes it perfect for quiet contemplation, morning walks, and watching the dawn paint the sky. Fewer facilities here compared to other beaches.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Snorkeling & Scuba Diving</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Neil Island boasts easily accessible coral reefs teeming with colourful fish and marine life, making it great for snorkeling. Bharatpur Beach offers easy shore snorkeling, and boat trips can take you to slightly further reefs. Gear rental is widely available. Several reputable dive centers (like India Scuba Explorers, Dive India) operate on Neil, offering Discover Scuba Dives for beginners and fun dives for certified divers at sites like Junction, K-Rock, and Margherita's Mischief. Diving here is often considered more relaxed and less crowded than in Havelock, with occasional sightings of dugongs reported (though very rare).</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Cycling & Village Exploration</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>One of Neil's most defining and enjoyable activities is simply exploring its lush interior and charming villages by bicycle. The predominantly flat terrain, shaded roads, and minimal traffic make for delightful, easy riding. Cycle past vibrant green paddy fields, extensive banana plantations, coconut groves, and traditional houses. Stop at Neil Kendra (the main market area) for local snacks, tea, and observing daily life. It's the best way to experience the island's slow pace and agricultural heart.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Neil Island offers a range of lodging options, though fewer than Havelock, generally favouring rustic charm over high luxury. Budget travellers can find basic bamboo huts, guesthouses, and homestays clustered around Neil Kendra market and along some beach approaches (e.g., near Laxmanpur). Mid-range resorts like Pearl Park Beach Resort (near Laxmanpur), TSG Aura (near Sitapur), Coconhuts Beach Resort, Tango Beach Resort, and Summer Sands Beach Resort offer comfortable AC rooms or cottages, often with restaurants, pools, and better amenities. For a more upscale experience, SeaShell Neil (near Laxmanpur) provides stylish cottages, excellent service, and beachfront access. Booking accommodation well in advance is crucial, especially during the peak season (December to March).</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Dining on Neil Island revolves around fresh, local ingredients, reflecting its "vegetable bowl" status. Simple, delicious, and affordable Bengali-style fish thalis, vegetarian thalis, and basic Indian dishes are staples at the small eateries ('dhabas') in Neil Kendra market (popular spots include Ganesh Restaurant, Hungry Stone). Most resorts have their own multi-cuisine restaurants catering to tourist palates, often featuring good seafood options (e.g., Dugong restaurant at SeaShell, Organic Khaa restaurant at Summer Sands). Don't miss trying the abundant fresh tropical fruits like coconuts (available everywhere), bananas, papayas, and sapodillas, often sold by local vendors or directly from farm stalls.</p>
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
                                        <h4 className={`font-medium ${infoText} text-sm`}>October – May (Dry Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Pleasant weather, calm seas, ideal for all activities. Peak tourist season is December to February; book well ahead.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>March – May (Shoulder/Summer)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Gets warmer and more humid, but still good for water activities. Farms are lush. Fewer crowds than peak season.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>June – September (Monsoon)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Characterized by heavy rainfall, rougher seas. Ferry schedules may be disrupted. Island is very quiet and intensely green. Some businesses might close.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Neil Island is considered very safe with extremely low crime rates. Basic precautions are sufficient.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Natural Bridge:** Exercise extreme caution on the slippery rocks and dead coral when visiting, especially during low tide. Wear sturdy, non-slip footwear.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Insects:** Use mosquito repellent, particularly during dawn and dusk. Sandflies can be present on some beaches; applying coconut oil or repellent can help.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Water & Food:** Drink only bottled or properly purified/filtered water. Eat at reputable places.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Medical Facilities:** A Primary Health Centre (PHC) near the market provides basic medical assistance for minor ailments. Serious medical emergencies require evacuation to Port Blair (usually via ferry or helicopter). Carry a personal first-aid kit with essentials.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Connectivity:** Mobile network coverage is generally weak and unreliable, especially for data. BSNL and Airtel tend to have the best (though still patchy) voice connectivity. Wi-Fi in resorts can be slow and intermittent. Be prepared to be disconnected.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Reduce Plastic:** Strictly avoid single-use plastics. Carry reusable water bottles, coffee cups, and shopping bags. Refuse plastic straws.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Protect Marine Life:** Do NOT touch, stand on, or collect corals or shells (dead or alive) while swimming, snorkeling or walking on the beach/Natural Bridge. Admire from a distance.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Reef-Safe Practices:** Use reef-safe sunscreen if available. Avoid kicking up sand near corals. Choose responsible boat operators for snorkeling/diving trips.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Waste Management:** Dispose of all your waste properly in designated bins. If bins are full or unavailable, carry your trash back with you until you find one.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Respect Local Culture:** Dress modestly when visiting villages or the market area. Always ask permission before taking photographs of local people. Be polite and mindful in interactions.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Support Locals:** Eat at local eateries, buy fresh produce from farmers/vendors, hire local guides or auto drivers, and purchase authentic handicrafts (responsibly sourced).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>**Conserve Resources:** Be mindful of water and electricity usage in your accommodation, as these are precious resources on the island.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Book Everything in Advance:** Especially ferries (private ones) and accommodation, particularly if travelling between December and March.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Carry Sufficient Cash:** ATMs on Neil Island are notoriously unreliable and often out of cash. Card payments are accepted only at some larger resorts/dive centers.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Rent a Bicycle or Scooter:** Best way to explore independently and experience the island's charm.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Check Tide Timings:** Essential for visiting the Natural Bridge (low tide only) and planning swimming/snorkeling. Ask locals or check online tide charts.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Pack Smart:** Light cotton clothing, swimwear, sturdy sandals/reef shoes, comfortable walking/cycling shoes, sunscreen, hat, sunglasses, insect repellent, basic first-aid kit, power bank (due to patchy electricity).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Embrace the Pace:** Neil is about slowing down. Don't expect bustling nightlife, extensive shopping, or perfect connectivity. Relax and enjoy the tranquility.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Download Offline Maps:** Useful for navigation as mobile data is often unavailable.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>**Plan for 1-3 Days:** While small, spending 2-3 days allows for a relaxed exploration of all main spots and soaking in the atmosphere. A day trip from Havelock is possible but rushed.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Experience the Tranquil Charm of Neil Island</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Ready to unwind on serene beaches, cycle through lush fields, and discover the laid-back beauty of Shaheed Dweep? Plan your perfect escape today.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=neil-island" className={buttonPrimaryStyle}>
                            View Neil Island Packages <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300`}>
                            Customize Your Trip
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}