// Path: src/app/destinations/rangat/page.tsx
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
    Compass,    // Keep for Attractions
    Users,
    Shield,     // Use Shield instead of ShieldCheck
    Leaf,
    ChevronRight,
    Star,
    Navigation, // Use Navigation for Travel
    ArrowRight,
    MessageCircle,
    Camera,
    Ship,       // Keep for Ferry access
    Car,        // Keep for Road access
    TreePine,   // Keep for Mangrove Walkway
    Turtle      // Keep for Turtle Nesting
    // Removed Sun, Moon, Mountain - covered by Calendar/Compass/Waves
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

export default function RangatDestinationPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Rangat
    const galleryImages = [
        {
            src: "/images/rangat/dhani-nallah-walkway.jpg", // Use specific paths
            alt: "Dhani Nallah Mangrove Walkway, Rangat",
            caption: "India's longest mangrove boardwalk at Dhani Nallah"
        },
        {
            src: "/images/rangat/amkunj-beach.jpg", // Use specific paths
            alt: "Amkunj Beach Eco-Park, Rangat",
            caption: "The serene and eco-friendly Amkunj Beach"
        },
        {
            src: "/images/rangat/cuthbert-bay-beach.jpg", // Use specific paths
            alt: "Cuthbert Bay Beach, Rangat",
            caption: "Pristine Cuthbert Bay, a key turtle nesting site"
        },
        {
            src: "/images/rangat/morrice-dera.jpg", // Use specific paths
            alt: "Morrice Dera Beach and Viewpoint, Rangat",
            caption: "Scenic coastal views at Morrice Dera"
        },
        {
            src: "/images/rangat/rangat-landscape.jpg", // Use specific paths
            alt: "Rural landscape near Rangat",
            caption: "Lush green fields showcasing Rangat's agricultural side"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Baratang Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/rangat/hero.jpg" // Use specific Rangat hero image
                    alt="Coastal view of Rangat, Middle Andaman"
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
                                    <span className="text-white font-medium">Rangat</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Rangat</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Explore Middle Andaman's tranquil eco-tourism hub, known for mangroves, beaches, and turtle nesting.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className={buttonPrimaryStyle}>
                                Discover Rangat <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Rangat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Middle Andaman Island, ~170 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Dhani Nallah Mangrove Walkway, Turtle Nesting (Cuthbert Bay), Amkunj Beach</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Car className={infoIconColor} size={18} /> {/* Highlighting road access */}
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Access</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Primarily by road (ATR, 8-10 hrs) or infrequent ferry from Port Blair</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Rangat.</p>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Rangat, a large town in Middle Andaman, offers an offbeat eco-tourism experience. It's known for its mangrove forests (Dhani Nallah Walkway), diverse beaches (some volcanic), turtle nesting sites (Cuthbert Bay), and a tranquil atmosphere away from major tourist crowds.</p>
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
                                            <div><span className={`font-medium ${neutralText}`}>Road (ATR):</span><span className={neutralTextLight}> 8-10 hrs from Port Blair via bus/car, involves ferry crossings & Jarawa reserve passage (convoy rules apply).</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Ferry:</span><span className={neutralTextLight}> Infrequent govt ferries (5-6 hrs) from Port Blair via Neil/Havelock. Check schedules.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Check className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Local Transport:</span><span className={neutralTextLight}> Limited buses. Autos, shared jeeps available. Hire car/scooter via hotel. Town walkable.</span></div>
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
                                            <p className={`text-sm ${neutralTextLight}`}>Ideal weather, calm seas, peak turtle nesting.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Oct–Apr</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Generally good dry season.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>May–Sep</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon, lush, limited activities/travel.</p>
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><TreePine size={18} className="mr-2 text-green-600" />Dhani Nallah Walkway</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>India's longest mangrove boardwalk leading to a turtle nesting beach.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Amkunj Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Quiet rocky-sandy beach with an eco-park, good for picnics.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" />Cuthbert Bay Sanctuary</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Important turtle nesting site (Dec-Feb). Secluded beach.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Morrice Dera</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Scenic viewpoint with twin rocks and coastal walkway.</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Modest options: Govt. guesthouses (Hawksbill Nest), private lodges (Hotel Avis, Hotel Ross & Smith), budget hotels. No luxury resorts.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Booking ahead advised, especially in peak season.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Simple local eateries (dhabas) in Rangat Bazaar serving Bengali/South Indian food.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Fresh seafood (fish curry, grills) is common and recommended. Affordable thalis available.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Strictly follow convoy rules & NO interaction/photos in Jarawa reserve.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drive carefully on ATR. Beware of crocodiles near creeks.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry first-aid, mosquito repellent. Drink safe water. Basic medical facilities exist.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Avoid plastics; carry reusable items. Pack out trash.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect wildlife, especially nesting turtles (no lights/disturbance).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Stay on trails. Support local businesses. Conserve resources.</span></li>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Rangat serves as the administrative headquarters for the Middle Andaman region and is the second-largest town in the islands after Port Blair. Situated roughly 170 km north of the capital by road, Rangat offers a distinct contrast to the more tourist-centric islands like Havelock or Neil. It presents a quieter, more authentic glimpse into the life of islanders, with its economy rooted in agriculture and fishing. The landscape is characterized by lush greenery, paddy fields, plantations, and extensive mangrove ecosystems along its coastlines.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>While often used as a transit point for travellers heading further north to Mayabunder or Diglipur, Rangat holds significant appeal for eco-tourists and those seeking offbeat experiences. Its primary draws are natural attractions: the unique Dhani Nallah mangrove boardwalk, the important turtle nesting grounds at Cuthbert Bay, serene beaches like Amkunj, and scenic viewpoints such as Morrice Dera. Rangat provides a peaceful retreat for nature lovers willing to explore beyond the main tourist circuit.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Rangat:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Road (Andaman Trunk Road - ATR):</strong> This is the most common method. The journey from Port Blair takes 8-10 hours.
                                                <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                                                    <li><strong className="text-gray-700">Government Buses:</strong> Daily departures from Port Blair (early morning, ~4-6 AM). Budget-friendly but can be long and tiring.</li>
                                                    <li><strong className="text-gray-700">Private Cars/Taxis:</strong> Offer more comfort and flexibility. Can be hired for one-way or round trips.</li>
                                                    <li><strong className="text-gray-700">Journey Details:</strong> The route involves crossing creeks via vehicle ferries (Bamboo Flat to Chatham, Middle Strait to Baratang). Crucially, it passes through the Jarawa Tribal Reserve between Jirkatang and Middle Strait. Travel here is restricted to scheduled convoys with police escort. No stopping, photography, or interaction with the Jarawa tribe is permitted.</li>
                                                </ul>
                                            </li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Sea (Ferry):</strong> Government ferries operate from Port Blair (Phoenix Bay Jetty) to Rangat (Yerrata Jetty) a few times a week, often routing via Neil and Havelock islands. The sea journey takes approximately 5-6 hours. Schedules are infrequent and subject to change; booking tickets well in advance (at DSS counters) is necessary. Less common than road travel.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Rangat:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Walking:</strong> The main Rangat Bazaar area is walkable.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws & Shared Jeeps:</strong> Available for short distances within the town and to nearby villages. Negotiate fares.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Local Buses:</strong> Connect Rangat town with outlying villages and attractions (e.g., Dhani Nallah, Cuthbert Bay), but services are infrequent. Check timings locally.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Hired Vehicles:</strong> Cars or jeeps can be arranged through hotels/lodges for sightseeing tours covering multiple attractions. This is often the most practical way to see dispersed sites like Cuthbert Bay or Panchavati.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Scooter Rental:</strong> Limited availability compared to Havelock/Neil. Enquire at your accommodation; formal rental shops are scarce.</li>
                                        </ul>
                                        {/* Warning Box for Jarawa Reserve Rules */}
                                        <div className={`mt-6 p-4 ${warningBg} border-l-4 ${warningBorder} text-orange-800 rounded-r-lg shadow-sm`}>
                                            <h4 className={`font-semibold mb-2 ${warningText} flex items-center`}><Shield className="w-5 h-5 mr-2" /> Jarawa Reserve Travel Advisory</h4>
                                            <p className="text-sm md:text-base">
                                                Travel through the Jarawa Tribal Reserve on the ATR is strictly regulated. Vehicles move in fixed-time convoys only. **Absolutely NO stopping, photography, videography, or any interaction (including offering food) with the Jarawa tribe members is permitted.** Violations carry severe legal penalties. Respect their privacy and the protected status of the reserve.
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><TreePine size={18} className="mr-2 text-green-600" /> Dhani Nallah Mangrove Walkway & Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located about 20 km from Rangat town, this is a flagship eco-tourism site. A 713-meter long wooden boardwalk (often cited as India's longest) meanders through a dense, well-preserved mangrove ecosystem. Informative signs explain the different mangrove species and their importance. The walk culminates at Dhani Nallah Beach, a long, sandy stretch known as a nesting ground for Olive Ridley and Green Sea Turtles (primarily Dec-Feb). A small hatchery managed by the Forest Department may be present during nesting season. Ideal for nature walks and bird watching.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Amkunj Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Around 8 km from Rangat towards Mayabunder, Amkunj Beach is easily accessible from the ATR. Developed as an eco-park, it features pleasant landscaping with log sofas, eco-huts, and changing rooms. The beach itself is a mix of grey sand and rocks, offering calm waters suitable for swimming and picnics. It's known for beautiful sunrise views and a generally tranquil atmosphere.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Turtle size={18} className="mr-2 text-green-600" /> Cuthbert Bay Wildlife Sanctuary</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Situated about 12 km from Rangat, Cuthbert Bay is a pristine, secluded beach primarily significant as a major nesting site for sea turtles (Olive Ridley, Green Sea, Hawksbill, and occasionally Leatherback) between December and February. Visits during nesting season (best late evening or pre-dawn, often requiring permission/guide) offer a chance to witness nesting or hatching. The beach itself is beautiful but remote; be mindful of sandflies and currents if visiting during the day.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Morrice Dera Beach & Viewpoint</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located near Betapur, about 12 km before Rangat when coming from Port Blair. This scenic spot features unique twin rock formations offshore. A well-maintained walkway leads to a viewpoint offering panoramic sea views, particularly beautiful during sunset. A freshwater stream meets the sea nearby, adding to the picturesque setting.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Panchavati Hills & Waterfall</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Inland from Rangat (approx. 15 km), this area showcases the region's agricultural landscape. A short trek (can be slippery, especially post-monsoon) leads to a modest but pretty waterfall cascading over rocks into a small pool. The water flow is best during and just after the monsoon season (June-November). Offers a refreshing break and a glimpse into rural Andaman life.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Yerrata Mangrove Park</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located near Yerrata Jetty (approx. 8 km from Rangat), this park features a Mangrove Interpretation Centre and a 13-meter high watchtower. The tower provides excellent vantage points for observing the surrounding mangrove creeks and forests, ideal for birdwatching. Informative displays educate visitors about the mangrove ecosystem.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Long Island Day Trip</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Boats can be hired from Yerrata Jetty for a day trip to nearby Long Island (approx. 1-1.5 hrs). Long Island offers pristine beaches like Lalaji Bay (requiring a short trek or boat ride from the jetty) and Merk Bay (often needing a separate charter), known for excellent snorkeling and untouched beauty. Requires advance planning and negotiation with boat operators.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Rangat primarily offers budget to mid-range lodging. Options include government guesthouses like Hawksbill Nest (popular, book ahead) and private hotels such as Hotel Avis, Hotel Ross & Smith, Hotel UK Nest, and Hotel Priya International in the main town. These provide basic to standard rooms (AC/non-AC) suitable for overnight stays. Eco-huts at Amkunj Beach offer a unique, close-to-nature experience. Facilities are generally modest; don't expect luxury amenities. Verify booking confirmations and check room conditions upon arrival.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Dining in Rangat is centered around local eateries ('dhabas') and small restaurants primarily in the Rangat Bazaar area. They serve simple, affordable Indian meals, with Bengali and South Indian cuisine being common. Fresh seafood is a highlight – look for fish curry, fried fish, or crab dishes depending on availability. Vegetarian options (veg thali, dal, sabzi) are usually available. Restaurants attached to hotels like Hawksbill Nest offer standard multi-cuisine menus. Options outside the main town are very limited, so carry snacks and water when exploring remote beaches or attractions.</p>
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
                                        <h4 className={`font-medium ${infoText} text-sm`}>Dec–Mar (Peak Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Pleasant weather (23-30°C), dry, calm seas, peak turtle nesting season.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Oct–Apr (Dry Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Good travel conditions, warm days.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>May–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Heavy rains, travel disruptions possible. Lush landscapes, fewer tourists.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Important Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Jarawa Reserve:** Absolutely NO stopping, photos, videos, or interaction within the reserve on the ATR. Travel only in official convoys. Severe penalties apply.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Crocodiles:** Be cautious near mangrove creeks and river mouths; avoid swimming in these areas.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Road Travel:** Drive carefully on the ATR; roads can be narrow/winding. Avoid driving after dark.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Health:** Carry a first-aid kit, insect repellent, and any personal medications. Drink sealed bottled water. Basic medical facilities are available in Rangat town.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Connectivity:** Mobile network and internet access are often poor or unavailable outside the main town. Inform others of your plans.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect local culture and communities. Dress modestly in villages. Ask permission before taking photos of people.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize plastic waste. Carry reusable water bottles and bags. Do not litter; pack out your trash.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Protect wildlife, especially nesting turtles at Cuthbert Bay and Dhani Nallah. Avoid using white lights, making noise, or getting too close during nesting/hatching. Follow guide instructions.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not collect corals, shells, or any marine life.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Stay on marked trails and boardwalks to protect fragile ecosystems.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support local economy by using local guides, eateries, and buying authentic (non-prohibited) handicrafts.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book accommodation and transport (especially ferries or private cars) in advance, particularly during peak season.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash; ATMs are available but may not always be reliable. Card acceptance is limited.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Be prepared for long travel times, especially by road. Carry snacks, water, and entertainment.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light clothing, comfortable walking shoes, swimwear, sunscreen, hat, insect repellent, and a basic first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Download offline maps and essential information due to poor connectivity.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Plan sightseeing; attractions are spread out. Hiring a vehicle for a day might be efficient.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>If interested in turtle nesting, plan your visit between December and February and inquire locally about guided night visits.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Plan Your Rangat Eco-Adventure</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Ready to explore the serene mangroves, beaches, and turtle havens of Rangat? Let us help you plan your offbeat Andaman journey.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=rangat" className={buttonPrimaryStyle}>
                            View Rangat Itineraries <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300`}>
                            Contact Us For Details
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}