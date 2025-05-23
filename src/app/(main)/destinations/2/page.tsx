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
    Bed,        // Use Bed instead of Home for Accommodation consistency
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
    Ship,       // Relevant for Havelock access
    Bike,       // Relevant for Havelock transport
    Waves,      // Relevant for beaches/diving
    Sun,        // Relevant for beaches/weather
    LifeBuoy,   // Consistent Safety icon
    Sparkles    // Could use for Bioluminescence or special experiences
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

export default function HavelockIslandPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Havelock Island
    const galleryImages = [
        {
            src: "/images/havelock/radhanagar-beach-day.jpg", // Use specific paths
            alt: "Radhanagar Beach (Beach No. 7), Havelock Island",
            caption: "The world-renowned Radhanagar Beach with its white sands"
        },
        {
            src: "/images/havelock/elephant-beach-snorkeling.jpg", // Use specific paths
            alt: "Snorkeling at Elephant Beach, Havelock Island",
            caption: "Vibrant coral reefs accessible via snorkeling at Elephant Beach"
        },
        {
            src: "/images/havelock/havelock-diving.jpg", // Use specific paths
            alt: "Scuba diving scene near Havelock Island",
            caption: "Exploring the rich underwater world through scuba diving"
        },
        {
            src: "/images/havelock/kalapathar-beach.jpg", // Use specific paths
            alt: "Kalapathar Beach with its distinctive black rocks",
            caption: "Scenic Kalapathar Beach, known for beautiful sunrises"
        },
        {
            src: "/images/havelock/resort-view.jpg", // Use a representative resort image path
            alt: "Beachfront resort view on Havelock Island",
            caption: "Relaxing ambiance at one of Havelock's many resorts"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Diglipur Structure */}
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
                            <button className={buttonPrimaryStyle}>
                                Discover Havelock <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Havelock
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Part of Ritchie's Archipelago, ~70 km NE of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Radhanagar Beach, Elephant Beach, Scuba Diving, Coral Reefs</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Ship className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Access</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Primarily via Ferry (1.5-3 hrs) from Port Blair / Neil Island</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Havelock Island.</p>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Havelock (Swaraj Dweep) is the most popular Andaman island, celebrated for stunning white-sand beaches like Radhanagar, vibrant coral reefs perfect for snorkeling and diving, and a relaxed tropical vibe catering to all budgets.</p>
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
                                            <div><span className={`font-medium ${neutralText}`}>Ferries:</span><span className={neutralTextLight}> Daily private (1.5-2.5 hrs) & government (2.5-3 hrs) ferries from Port Blair & Neil Island. Book ahead.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Bike className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>On Island:</span><span className={neutralTextLight}> Scooter rental (~₹500/day) is popular. Autos, taxis, shared jeeps, and bicycles also available.</span></div>
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
                                            <p className={`text-sm ${neutralTextLight}`}>Peak season, best weather, calm seas.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Mar–May</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Warmer, excellent water visibility.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Sep</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon, fewer activities, lush scenery.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Waves className={`mr-3 ${neutralIconColor}`} size={24} /> Key Attractions & Activities
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Attraction Cards - Remain Neutral */}
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Radhanagar Beach (No. 7)</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>World-famous white sand beach, ideal for swimming and sunsets.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Elephant Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Accessible by boat/trek. Known for coral reefs, snorkeling, and water sports.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Scuba Diving</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Numerous dive sites for beginners and certified divers. Many PADI centers.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Kalapathar Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Scenic beach with black rocks, perfect for sunrise views and photography.</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Widest range: Budget beach huts, mid-range resorts (Symphony Palms, Dolphin), luxury stays (Taj, Barefoot).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Book well in advance for peak season.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Fresh seafood, local thalis, popular cafes (Full Moon, Anju Coco), international options, resort dining.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use reef-safe sunscreen, stay hydrated. Observe beach flags.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Wear water shoes on rocky shores. Basic PHC available.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drive scooters carefully, especially at night.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Avoid single-use plastics; use reusable bottles.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not touch or stand on coral. Use reef-safe sunscreen.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of waste responsibly; participate in clean-ups if possible.</span></li>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Havelock Island, officially Swaraj Dweep since 2018, is the undeniable star of the Andaman archipelago. Renowned globally for its breathtaking beaches, particularly the award-winning Radhanagar Beach, Havelock offers a quintessential tropical paradise experience. Its crystal-clear turquoise waters lap onto powdery white sands, fringed by lush green forests. Beyond the stunning coastline, the island boasts vibrant coral reefs teeming with marine life, establishing it as a premier destination for scuba diving and snorkeling in India.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Despite its popularity, Havelock maintains a relaxed, laid-back atmosphere. It caters to a wide spectrum of travelers, offering everything from basic bamboo beach huts favoured by backpackers to opulent luxury resorts perfect for honeymooners and families. The island provides a perfect balance of natural beauty, adventure activities, comfortable amenities, and diverse dining options, making it an unforgettable destination for anyone visiting the Andamans.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Havelock Island:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Ferry (Standard):</strong> This is the primary mode. Regular ferry services connect Havelock (Havelock Jetty) with Port Blair (Phoenix Bay Jetty) and Neil Island (Bharatpur Jetty).
                                                <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                                                    <li><strong className="text-gray-700">Private Ferries:</strong> Companies like Makruzz, Nautika (formerly Green Ocean), ITT Majestic offer faster (1.5-2.5 hrs from Port Blair), air-conditioned catamaran services. Book online well in advance, especially during peak season. More expensive but comfortable.</li>
                                                    <li><strong className="text-gray-700">Government Ferries:</strong> Slower (2.5-3 hrs+ from Port Blair), more basic, and significantly cheaper. Tickets are harder to book online (often requires visiting the DSS counter in Port Blair). Prioritizes locals; tourists get remaining seats. Offers an open deck experience.</li>
                                                </ul>
                                            </li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Helicopter/Seaplane:</strong> Seaplane services are currently non-operational (as of recent updates). Helicopter services (Pawan Hans) exist but have very limited seats, are expensive, weather-dependent, and primarily reserved for islanders or medical emergencies. Not a reliable option for tourist travel planning.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Havelock:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Scooter/Motorbike Rental:</strong> The most popular and convenient way to explore (~₹400-600 per day plus fuel). Rental shops are near the jetty and along the main road. Requires a valid driving license. Drive cautiously, roads can be narrow, and lighting is minimal at night. Petrol pump has limited hours.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws:</strong> Readily available for point-to-point travel. Fares are somewhat fixed but always confirm before starting (e.g., Jetty to Radhanagar approx. ₹500-700, shorter trips ₹50-150).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Taxis (Cars/Vans):</strong> Available for hire, especially for families or groups. Can be hired for full-day or half-day tours (~₹2000-3000) or point-to-point transfers. Arrange through your hotel or at the jetty.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Bicycle Rental:</strong> Eco-friendly option for exploring nearby areas (Beaches 1-5). Available at some guesthouses. Suitable for shorter distances due to heat and humidity.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Public Bus / Shared Jeeps:</strong> Limited government bus service runs along the main road. Shared jeeps are used by locals and offer a very cheap way to travel, though timings and routes might be unclear to tourists.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Walking:</strong> Possible around specific beach areas (e.g., along Beach No. 5) but distances between main attractions (Jetty, Radhanagar, Kalapathar) are significant.</li>
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
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Radhanagar Beach (Beach No. 7)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Consistently ranked among Asia's best beaches. Features a vast expanse of fine white sand, calm turquoise waters ideal for swimming, and a backdrop of lush forest. Famous for spectacular sunsets. Basic facilities like changing rooms, lockers, and snack stalls available. The nearby Neil's Cove offers a short trail to a serene lagoon (check tide timings). A must-visit.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Elephant Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Accessible via a 20-minute speedboat ride or a ~40-minute guided jungle trek. Renowned for its shallow-water coral reef, making it excellent for snorkeling (equipment rentable). Hub for various water sports like Sea Walk, Jet Ski, Banana Boat rides. Can get crowded; try visiting early morning. The beach itself was partially damaged by the 2004 tsunami but the reef remains vibrant.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Kalapathar Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located on the eastern coast, this beach is characterized by the black rocks (kala pathar) scattered along the shoreline and contrasting emerald waters. It's a picturesque spot, especially popular for watching the sunrise. Less suitable for swimming due to rocks but perfect for photography and peaceful walks. Limited stalls sell refreshments.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Vijaynagar Beach (Beach No. 5) & Govind Nagar Beach (Beach No. 3)</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>These beaches form a long stretch on the east coast where many resorts are located. Waters are calm and shallow, suitable for swimming, especially during high tide. Great for long walks, sunrises, and spotting marine life in tide pools during low tide (wear reef shoes). Kayaking is popular here.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Scuba Diving</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Havelock is arguably the best place for scuba diving in India. Numerous PADI/SSI certified dive centers offer 'Discover Scuba Dives' (for non-certified beginners) and courses (Open Water, Advanced, etc.). Popular dive sites include The Wall, Aquarium, Dixon's Pinnacle, Johnny's Gorge, and Jackson's Bar, offering diverse marine life from colourful fish and turtles to rays and occasionally reef sharks. Visibility is best from Feb to Apr.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Other Activities</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Snorkeling:</strong> Easily done at Elephant Beach, Neil's Cove, or via boat trips to nearby reefs. <strong>Kayaking:</strong> Explore the coastline or mangrove creeks (daytime or night bioluminescence tours). <strong>Game Fishing:</strong> Charters available for deep-sea fishing enthusiasts. <strong>Trekking:</strong> Guided treks through the forest, including the path to Elephant Beach. <strong>Bird Watching:</strong> Possible in forested areas.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Havelock caters to all budgets. Backpackers find affordable bamboo huts and dorms mainly near Govind Nagar (Beach 3) and Vijay Nagar (Beach 5). Mid-range options include comfortable resorts with AC, pools, and restaurants scattered along the east coast (e.g., Symphony Palms, Havelock Island Beach Resort, TSG Blue, Dolphin Resort). For luxury, Taj Exotica offers pool villas near Radhanagar, Barefoot at Havelock provides eco-luxury jungle cottages, SeaShell Havelock boasts stunning sea views and an infinity pool, and Jalakara offers exclusive boutique villas inland.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Dining is diverse. Fresh seafood is abundant – try grilled fish, lobster, or crab at beach shacks or restaurants like Anju Coco or New Lighthouse. Popular multi-cuisine cafes include Full Moon Café, Something Different, and Nemo Café (at Havelock Island Beach Resort). Vegetarian options are plentiful at places like Annapurna and Icy Spicy. High-end resorts offer fine dining experiences (e.g., Turtle House at Taj, B3 at Barefoot). Many dive centers have attached cafes serving good breakfasts and coffee.</p>
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
                                        <p className={`text-xs ${neutralTextLight}`}>Ideal conditions. Peak tourism Nov-Feb. Best visibility Feb-Apr.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Feb-Apr (Shoulder)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Often considered best for diving/snorkeling due to calm seas & clarity.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Jun–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Rainy, activities limited, ferry disruptions possible. Lower prices, lush.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Health - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Health
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Use high SPF reef-safe sunscreen and stay hydrated.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Observe beach safety flags and lifeguard instructions. Avoid swimming alone or after dark.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Be cautious of sharp corals/rocks; wear water shoes in shallow reef areas.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Choose reputable operators for diving and water sports; check safety standards.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drive scooters carefully; wear helmets. Roads are unlit at night.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Basic medical facilities (PHC) and pharmacies exist. Serious issues require transfer to Port Blair.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Drink bottled/filtered water. Use insect repellent, especially evenings.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Say NO to single-use plastic. Carry reusable bottles/bags. Refill water.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Protect coral reefs: Do NOT touch, stand on, or collect coral/shells.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Use reef-safe sunscreen (check ingredients like oxybenzone).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dispose of all waste properly. Participate in or support beach clean-ups.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect wildlife: Observe marine life and birds from a distance. Do not feed animals.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Conserve water and electricity. Support eco-conscious businesses.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Dress modestly when away from the beach. Ask permission before taking photos of locals.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book accommodation and ferry tickets (especially private ones) far in advance, particularly for Dec-Jan.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash. ATMs exist but can be unreliable or run out of money.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Mobile connectivity is limited (BSNL/Airtel generally best). Data speeds are slow. Download offline maps.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Wi-Fi is available at many cafes/resorts but is often slow and chargeable. Don't rely on it for heavy usage.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light clothing, swimwear, sunglasses, hat, insect repellent, basic first-aid, and any personal medications.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Allow buffer time for travel, especially ferry schedules which can change due to weather.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Power cuts can occur; carry a power bank.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Ready for Havelock Paradise?</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Plan your dream escape to Havelock Island. Explore packages including ferry transfers, stays, and activities like diving and snorkeling.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=havelock" className={buttonPrimaryStyle}>
                            View Havelock Packages <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border ${neutralBorder} hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300`}>
                            Enquire Now
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
}