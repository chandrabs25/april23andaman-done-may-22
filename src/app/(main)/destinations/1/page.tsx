// Path: src/app/destinations/port-blair/page.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin,
    Check,
    Info,
    Calendar,
    // Clock, // Removed as less relevant than specific transport icons
    Bed,
    Utensils,
    Compass,    // Keep for general Exploration/Attractions section title
    Users,      // Keep for Anthropological museum context or general info
    Shield,     // Consistent Safety icon
    Leaf,
    ChevronRight,
    Star,
    Navigation, // Consistent Travel icon
    ArrowRight,
    MessageCircle,
    Camera,
    Plane,      // Specific to Port Blair (Airport)
    Ship,       // Specific to Port Blair (Ferries/Ships)
    Landmark,   // Specific to Port Blair (Historical Sites like Cellular Jail)
    Waves,      // Specific to Port Blair (Beaches like Corbyn's Cove)
    LifeBuoy    // Consistent Safety icon
} from 'lucide-react';

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

export default function PortBlairPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Port Blair
    const galleryImages = [
        {
            src: "/images/portblair/cellular-jail-day.jpg", // Use specific paths
            alt: "Cellular Jail National Memorial, Port Blair",
            caption: "The imposing structure of the Cellular Jail"
        },
        {
            src: "/images/portblair/ross-island-ruins.jpg", // Use specific paths
            alt: "Ruins on Ross Island (Netaji Subhas Chandra Bose Dweep)",
            caption: "Historical ruins reclaimed by nature on Ross Island"
        },
        {
            src: "/images/portblair/corbyns-cove.jpg", // Use specific paths
            alt: "Corbyn's Cove Beach",
            caption: "Palm-fringed Corbyn's Cove beach near Port Blair"
        },
        {
            src: "/images/portblair/harbor-view.jpg", // Use specific paths
            alt: "Port Blair Harbor View",
            caption: "A panoramic view of the busy Port Blair harbor"
        },
        {
            src: "/images/portblair/samudrika-museum.jpg", // Use specific paths
            alt: "Samudrika Naval Marine Museum",
            caption: "Exhibits inside the Samudrika Museum"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/portblair/hero.jpg" // Specific Port Blair hero image
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
                            <Link href="#overview" className={buttonPrimaryStyle}> {/* Link to an ID */}
                                Explore Port Blair <ArrowRight size={18} className="ml-2" />
                            </Link>
                            <button className={buttonSecondaryStyleHero} onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}> {/* Scroll to gallery */}
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
                        Quick Facts About Port Blair
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Capital city, located on South Andaman Island</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Cellular Jail, Museums, Ross Island, Corbyn's Cove, Ferry Hub</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Plane className={infoIconColor} size={18} /> {/* Using Plane icon */}
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Gateway</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Primary entry via Veer Savarkar Int'l Airport (IXZ)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Port Blair.</p>
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
                <div id="gallery" className="mb-16 scroll-mt-20"> {/* Added ID for scroll target */}
                    <div className={`relative h-[50vh] w-full rounded-2xl overflow-hidden shadow-lg mb-4 border ${neutralBorderLight}`}>
                        <Image src={galleryImages[activeImage].src} alt={galleryImages[activeImage].alt} fill style={{ objectFit: 'cover' }} quality={90} />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-white text-lg drop-shadow">{galleryImages[activeImage].caption}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className={`relative h-20 w-32 rounded-lg overflow-hidden cursor-pointer transition-all ${activeImage === index ? `ring-4 ring-offset-2 ${primaryButtonBg}` : 'opacity-70 hover:opacity-100'}`} // Added ring offset
                                onClick={() => setActiveImage(index)}
                            >
                                <Image src={image.src} alt={image.alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 128px" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Based on Toggle */}
                {!showComprehensive ? (
                    // Brief Guide Content - Neutral Theme with Contextual Colors
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-10">
                            <section id="overview"> {/* Added ID for scroll target */}
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${neutralIconColor}`} size={24} /> Overview
                                </h2>
                                <div className={cardBaseStyle}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Port Blair, the capital and entry point to the Andaman Islands, blends colonial history (Cellular Jail), diverse museums, and serves as the main hub for ferries to popular islands like Havelock and Neil. Explore nearby beaches, markets, and historical sites.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Getting There & Around
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Plane className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Air:</span><span className={neutralTextLight}> Veer Savarkar Int’l Airport (IXZ) connects major Indian cities.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Sea:</span><span className={neutralTextLight}> Long ferry journeys (~3 days) from Chennai/Kolkata (less common).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Local Transport:</span><span className={neutralTextLight}> Autos (₹50–150), taxis, local buses, scooter rentals (₹400–500/day).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Ferries:</span><span className={neutralTextLight}> To Havelock/Neil (Phoenix Bay), Ross/North Bay (Aberdeen Jetty).</span></div>
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
                                            <p className={`text-sm ${neutralTextLight}`}>Pleasant, dry, peak season.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Mar–May</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Hotter, good sea visibility.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Sep</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon, lush greenery, fewer crowds.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Landmark className={`mr-3 ${neutralIconColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Attraction Cards - Remain Neutral */}
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${neutralIconColor}`} /> Cellular Jail</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Historic prison, now a National Memorial. Don't miss the Light & Sound Show.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${neutralIconColor}`} /> Ross Island</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Former British HQ with scenic ruins, deer, peacocks. Short boat ride.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${neutralIconColor}`} /> Corbyn's Cove</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Popular city beach for swimming and light water sports.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${neutralIconColor}`} /> Museums</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Samudrika (Naval Marine) & Anthropological museums offer cultural insights.</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Wide range: Budget guesthouses to mid-range hotels (Sinclairs, Fortune) & limited luxury options.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Book first/last nights in advance.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Fresh seafood (New Lighthouse), diverse Indian cuisine (Annapurna, Icy Spicy), cafes & rooftop bars.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Generally safe; exercise basic caution.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use mosquito repellent. Drink bottled/filtered water.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Helmets mandatory on two-wheelers.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Avoid single-use plastics; carry reusable bottles.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect wildlife and marine life; no touching coral.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of waste responsibly.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                ) : (
                    // Comprehensive Guide Content - Neutral Theme with Contextual Colors
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-12">
                            <section id="overview-comprehensive"> {/* Added ID */}
                                <h2 className={sectionHeadingStyle}>
                                    <Info className={`mr-3 ${neutralIconColor}`} size={24} /> Detailed Overview
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Port Blair, the bustling capital of the Andaman and Nicobar Islands, serves as the primary entry point and administrative center for the archipelago. Far more than just a transit hub, it's a city with a complex past, vividly captured by the imposing Cellular Jail, a symbol of India's freedom struggle. The city offers a blend of urban amenities, diverse cultural influences from mainland settlers, and easy access to surrounding natural and historical attractions.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Visitors can explore poignant museums detailing the islands' unique ecology and tribal heritage, relax at Corbyn's Cove beach, wander through the lively Aberdeen Bazaar, or take short ferry trips to discover the ruins of Ross Island or the underwater wonders near North Bay. Port Blair provides essential infrastructure like hotels, restaurants, and transport links, making it the logical base for exploring the wider Andaman region while offering its own distinct points of interest.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Port Blair:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Air (Primary):</strong> Veer Savarkar International Airport (IXZ) is well-connected with direct flights from Chennai, Kolkata, Delhi, Bengaluru, Hyderabad, and other major Indian cities. The airport is located about 4-5 km south of the main city center (Aberdeen Bazaar). Pre-paid taxis and auto-rickshaws are available.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Sea:</strong> Government-run passenger ships operate from Chennai, Kolkata, and Visakhapatnam. The journey takes approximately 60-70 hours (3 days). This is a budget-friendly but time-consuming option, suitable for those seeking an adventurous sea voyage. Schedules are limited and booking well in advance is essential. Ships dock at Haddo Wharf.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Port Blair:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws:</strong> The most common mode for short to medium distances within the city. Fares are negotiable (typically ₹50-₹150 for most city rides). Agree on the price before starting the journey.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Taxis:</strong> Tourist taxis (usually cars/SUVs) can be hired for point-to-point transfers or full-day/half-day sightseeing tours (approx. ₹2000-₹3000 for a full day). Available at the airport, jetties, and major hotels.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Two-Wheeler Rentals:</strong> Scooters and motorcycles are available for rent (approx. ₹400-600 per day). Ideal for independent exploration but requires an Indian driving license and cautious driving on hilly roads. Helmets are mandatory.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Local Buses:</strong> State Transport Service (STS) buses connect various parts of the city and nearby areas like Wandoor, Chidiya Tapu, and Corbyn's Cove. Very economical but can be crowded. Main bus terminal is at Mohanpura.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Ferries/Boats:</strong> Essential for island hopping. Private ferries (Makruzz, Green Ocean, etc.) and government ferries operate from Phoenix Bay Jetty (Haddo Wharf) to Havelock (Swaraj Dweep) and Neil (Shaheed Dweep). Boats to Ross Island and North Bay depart from Aberdeen Jetty (Rajiv Gandhi Water Sports Complex).</li>
                                        </ul>
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${neutralIconColor}`} /> Cellular Jail National Memorial</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A must-visit historical site. Explore the grim cells, central tower, gallows, and museum documenting the lives of freedom fighters imprisoned here ('Kala Pani'). The poignant Light and Sound show held every evening narrates its history. Closed on Mondays and national holidays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${neutralIconColor}`} /> Ross Island (Netaji Subhas Chandra Bose Dweep)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>The former administrative headquarters of the British. Now features atmospheric ruins (church, bakery, commissioner's bungalow) entwined with massive tree roots. Home to friendly deer and peacocks. Accessible via a short boat ride from Aberdeen Jetty. Features a sound and light show in the evenings. Closed on Wednesdays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${neutralIconColor}`} /> Corbyn's Cove Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>The closest beach to Port Blair city (approx. 7 km). A crescent-shaped, coconut palm-fringed beach suitable for swimming and relaxing. Offers water sports like jet skiing and speed boat rides. Several snack bars and changing rooms are available. Can get crowded, especially on weekends.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Ship size={18} className={`mr-2 ${neutralIconColor}`} /> Samudrika Naval Marine Museum</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Managed by the Indian Navy, this museum provides an excellent overview of the Andaman's geography, marine life, tribal communities, and ecosystems. Includes displays of corals, shells, and a small aquarium. Located near the Teal House. Closed on Mondays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${neutralIconColor}`} /> Anthropological Museum</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Focuses on the indigenous tribes of the Andaman and Nicobar Islands, including the Jarawas, Sentinelese, Onges, and Nicobarese. Displays artifacts, tools, clothing, and models depicting their traditional way of life. Provides valuable insight into the islands' original inhabitants. Located in Phoenix Bay. Closed on Mondays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${neutralIconColor}`} /> Chatham Saw Mill</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>One of the oldest and largest sawmills in Asia, established by the British in 1883. Connected to Port Blair by a bridge. Visitors can take a guided tour to see the wood processing operations. A Forest Museum within the complex showcases local timber varieties and woodcrafts. Closed on Sundays.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Other Attractions</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Rajiv Gandhi Water Sports Complex (Aberdeen Jetty):</strong> Hub for boat trips to Ross/North Bay, offers some water activities. <strong>Marina Park and Aquarium:</strong> Adjacent to the water sports complex, features gardens, memorials, and a small aquarium (check operational status). <strong>Sagarika Government Emporium:</strong> For authentic local handicrafts, shell jewelry, and souvenirs. <strong>Mount Harriet National Park (Mount Manipur):</strong> Offers panoramic views (visible on the ₹20 note), trekking trails, and bird watching (requires a ferry and road journey). <strong>Chidiya Tapu (Sunset Point & Biological Park):</strong> Famous for sunsets, bird watching, and a small zoo (approx. 25 km south).</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Port Blair boasts the widest range of stays in the Andamans. Budget options (₹1000-3000) are concentrated around Aberdeen Bazaar and Phoenix Bay. Mid-range hotels (₹3000-8000) like Sinclairs Bayview, Peerless Sarovar Portico (at Corbyn's Cove), Fortune Resort Bay Island (Welcomhotel), and various TSG properties offer comfortable rooms, restaurants, and often pools or sea views. Luxury is limited but includes suites at Welcomhotel and boutique options like SeaShell Port Blair. Government guesthouses (APWD, Hornbill Nest) offer basic, affordable rooms (book in advance).</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Culinary options are diverse. Seafood is a highlight – try New Lighthouse Restaurant or Mandalay (at Fortune). For authentic South Indian/Vegetarian, Annapurna Cafeteria and Icy Spicy are popular. North Indian, Bengali, and local Andamanese dishes are available in various restaurants. Aberdeen Bazaar has numerous eateries and street food stalls. Cafes like Ripple Coffee offer modern ambiance. Rooftop bars like Amaya (SeaShell) and Nico Bar (Fortune) provide drinks with views.</p>
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
                                        <h4 className={`font-medium ${infoText} text-sm`}>Oct–May (Dry Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Best weather (esp. Nov-Feb). Ideal for all activities, island hopping. Peak tourist season.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Mar–May (Shoulder)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Hotter and more humid, but good for water activities due to visibility.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Jun–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Heavy rainfall, potential ferry disruptions. Lush scenery, fewer crowds, off-season rates. Focus on indoor attractions.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Port Blair is generally safe with low crime rates. Standard precautions apply.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Roads can be narrow and winding; drive/ride cautiously. Helmets compulsory.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drink only bottled or filtered water. Be mindful of street food hygiene.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use mosquito repellent, especially during dawn and dusk, to prevent Dengue.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Good medical facilities available (GB Pant Hospital, private clinics). Carry personal medications.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Adhere to safety guidelines during water sports and boat trips.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic use: Carry reusable water bottles and bags.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of litter properly. Do not leave waste at beaches or natural sites.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect marine life: Avoid touching corals or feeding fish during snorkeling/diving.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Conserve water and electricity in accommodations.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect local culture and traditions. Dress modestly when visiting non-beach areas.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do NOT attempt to interact with or photograph protected Jarawa tribe members.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support local economy by buying authentic handicrafts (Sagarika) and dining locally.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book flights and popular hotels (especially first/last nights) well in advance, particularly during peak season.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pre-book ferry tickets (private/govt) online if possible, especially for Havelock/Neil.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash; while ATMs are available, they can be unreliable or crowded. Many smaller shops/autos prefer cash.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Mobile connectivity can be patchy (BSNL often works best). Wi-Fi is often slow and limited. Inform family of your itinerary.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light cotton clothing, swimwear, sunscreen, hat, sunglasses, insect repellent, and a basic first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Allow buffer time for transfers, especially for connecting flights after ferry journeys.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Plan Your Port Blair Experience</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Ready to explore the historic capital of the Andamans? Browse our curated packages or get in touch for a customized itinerary.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=port-blair" className={buttonPrimaryStyle}>
                            View Port Blair Packages <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md`}> {/* Added shadow */}
                            Get Travel Assistance
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}