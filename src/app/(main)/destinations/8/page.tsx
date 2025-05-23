// Path: src/app/destinations/little-andaman/page.tsx
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
    Users,      // Keep for cultural/tribal context
    Shield,     // Consistent Safety icon
    Leaf,
    ChevronRight,
    Star,
    Navigation, // Consistent Travel icon
    ArrowRight,
    MessageCircle,
    Camera,
    Ship,       // Keep for Ferry access
    Bike,       // Keep for Scooter rental
    Waves,      // Specific for Surfing/Beaches
    Droplets,   // Representing Waterfalls
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

export default function LittleAndamanPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleToggle = () => {
        setShowComprehensive(!showComprehensive);
    };

    // Gallery images specific to Little Andaman
    const galleryImages = [
        {
            src: "/images/little-andaman/butler-bay-beach.jpg", // Use specific paths
            alt: "Butler Bay Beach, Little Andaman",
            caption: "The famous crescent-shaped Butler Bay Beach, known for surfing"
        },
        {
            src: "/images/little-andaman/white-surf-waterfall.jpg", // Use specific paths
            alt: "White Surf Waterfall, Little Andaman",
            caption: "The easily accessible and picturesque White Surf Waterfall"
        },
        {
            src: "/images/little-andaman/whisper-wave-waterfall.jpg", // Use specific paths
            alt: "Whisper Wave Waterfall trek, Little Andaman",
            caption: "Trekking through the jungle to reach Whisper Wave Waterfall"
        },
        {
            src: "/images/little-andaman/oil-palm-plantation.jpg", // Use specific paths
            alt: "Oil Palm Plantation, Little Andaman",
            caption: "Vast oil palm plantations are a unique feature of the island"
        },
        {
            src: "/images/little-andaman/hut-bay.jpg", // Use specific paths
            alt: "Hut Bay area, Little Andaman",
            caption: "View of the Hut Bay area, the main entry point"
        }
    ];

    return (
        <main className={`bg-white ${neutralText}`}>
            {/* Hero Section - Matches Baratang Structure */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src="/images/little-andaman/hero.webp" // Use specific Little Andaman hero image
                    alt="Scenic beach view of Little Andaman"
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
                                    <span className="text-white font-medium">Little Andaman</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Little Andaman</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mb-6 text-white/90">Explore India's surfing capital, pristine beaches, lush waterfalls, and offbeat adventures.</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className={buttonPrimaryStyle}>
                                Discover Little Andaman <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Little Andaman
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Location</h3>
                                <p className={`text-sm ${neutralTextLight}`}>South Andaman group, ~120 km south of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Known For</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Surfing (Butler Bay), Waterfalls (White Surf, Whisper Wave), Pristine Beaches</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Ship className={infoIconColor} size={18} /> {/* Main access */}
                            </div>
                            <div>
                                <h3 className={`font-medium ${neutralText}`}>Access</h3>
                                <p className={`text-sm ${neutralTextLight}`}>Mainly via Ferry (6-8 hrs) from Port Blair to Hut Bay</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch - Neutral Theme */}
                <div className="flex flex-col items-center mb-10">
                    <h2 className={`text-2xl font-bold ${neutralText} mb-4`}>Choose Your Guide Style</h2>
                    <p className={`${neutralTextLight} mb-6 text-center max-w-2xl`}>Select between a quick overview or an in-depth exploration of Little Andaman.</p>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Little Andaman, the southernmost accessible island, is India's surfing capital. Known for pristine beaches (Butler Bay), waterfalls (White Surf, Whisper Wave), and rainforests. Offers a remote, rustic, offbeat experience for adventurers and surfers seeking tranquility. Features Onge tribal reserve (restricted).</p>
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
                                            <div><span className={`font-medium ${neutralText}`}>Ferry:</span><span className={neutralTextLight}> Main access from Port Blair to Hut Bay (6-8 hrs). Day/overnight options. Book ahead.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Bike className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>On Island:</span><span className={neutralTextLight}> Scooter/bike rental (~₹400/day) recommended. Limited buses, autos, shared jeeps available.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Shield className={neutralIconColor} size={16} /></div>
                                            <div><span className={`font-medium ${neutralText}`}>Restricted Areas:</span><span className={neutralTextLight}> Onge Reserve (NW) and Nicobarese areas (South Bay) are off-limits.</span></div>
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
                                            <p className={`text-sm ${neutralTextLight}`}>Ideal weather, calm seas, good waterfall flow.</p>
                                        </div>
                                        <div className={`${warningBg} rounded-xl p-4 border ${warningBorder}`}>
                                            <h3 className={`font-semibold ${warningText} mb-2`}>Mar–May</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Hotter, best surf swells, sea generally calm.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Jun–Oct</h3>
                                            <p className={`text-sm ${neutralTextLight}`}>Monsoon/post-monsoon, travel difficult, best avoided.</p>
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Waves size={18} className="mr-2 text-blue-600" /> Butler Bay Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Famous crescent beach, ideal for surfing, swimming, and sunsets.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Droplets size={18} className="mr-2 text-cyan-600" /> White Surf Waterfall</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Picturesque cascade reached by a short, easy jungle trek. Refreshing pool.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Droplets size={18} className="mr-2 text-cyan-600" /> Whisper Wave Waterfall</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Larger, remote waterfall requiring a guided jungle trek (3-4 km).</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Hut Bay (Netaji Nagar) Beach</h3>
                                        <p className={`text-sm ${neutralTextLight}`}>Long, calm beach near the main town, good for walks and local life.</p>
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
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Basic options: Bamboo huts near Butler Bay, simple guesthouses in Hut Bay, Govt. guest houses. No luxury.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Expect power cuts, limited internet. Booking ahead advised for first night.</span></li>
                                </ul>
                            </div>
                            {/* Food Brief */}
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${neutralText} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${neutralIconColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Simple 'dhabas' in Hut Bay (Bengali/South Indian thalis, fish curry).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${neutralIconColor} flex-shrink-0`} size={16} /><span>Guesthouse kitchens offer cook-to-order meals (ask for fresh seafood). Limited options outside main areas.</span></li>
                                </ul>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Restricted Areas:** Onge and Nicobarese tribal reserves are strictly off-limits. Respect boundaries.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Be cautious swimming (currents). Avoid creek mouths (rare crocodile risk).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Ride scooters carefully. Carry first-aid, repellent. Basic health clinic exists.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Allow buffer days for ferry travel. Carry cash. Poor connectivity.</span></li>
                                </ul>
                            </div>

                            {/* Eco-Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Sustainability Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Pack out all trash; minimize plastic use.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect wildlife and tribal reserves. Stay on marked trails.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Conserve water/electricity. Support local businesses responsibly.</span></li>
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
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>Little Andaman, located about 120 km south of Port Blair across the Duncan Passage, is a sizable island (734 sq km) that feels worlds away from the main Andaman tourist circuit. Renowned primarily as India's premier surfing destination, particularly around Butler Bay, it offers much more than just waves. This island is a haven for nature lovers and adventurers seeking raw, unspoiled beauty. It features vast stretches of pristine beaches, dense tropical rainforests, captivating waterfalls like White Surf and Whisper Wave, and extensive red oil palm plantations.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}>The island's atmosphere is distinctly laid-back and rustic. Tourist infrastructure is minimal, contributing to its offbeat charm. Life revolves around the main settlement of Hut Bay and surrounding villages, populated mainly by Bengali and Tamil settlers. Little Andaman is also home to the indigenous Onge tribe, who reside in a protected reserve in the northwest (Dugong Creek), which is strictly off-limits to visitors. Similarly, the southern tip around South Bay, inhabited by Nicobarese communities, is also restricted. Visitors primarily explore the eastern coastline and accessible interior regions. The island bore significant impact from the 2004 tsunami, but has shown remarkable resilience. Visiting Little Andaman requires a sense of adventure, flexibility, and a willingness to embrace basic amenities in exchange for experiencing one of the Andaman's most serene and naturally rich environments.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${neutralIconColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Reaching Little Andaman:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>By Sea (Ferry):</strong> This is the standard and most reliable method. Government ferries operate regularly between Port Blair (Haddo Wharf or Phoenix Bay Jetty) and Hut Bay (Little Andaman's port).
                                                <ul className="list-['-_'] list-inside pl-4 mt-1 space-y-1">
                                                    <li><strong className="text-gray-700">Duration & Frequency:</strong> The journey takes 6-8 hours, depending on the vessel type (older ships are slower). Ferries usually run daily or several times a week. Check the latest DSS schedule.</li>
                                                    <li><strong className="text-gray-700">Booking:</strong> Tickets must be booked 1-2 days in advance at the DSS ticket counter in Port Blair. Online booking is sometimes available but can be unreliable.</li>
                                                    <li><strong className="text-gray-700">Classes:</strong> Options typically include deck seats (cheapest, open seating) and cabins (2-berth or 4-berth, recommended for overnight journeys or comfort).</li>
                                                    <li><strong className="text-gray-700">Conditions:</strong> The sea crossing can be rough, especially outside the peak dry season. Take seasickness precautions if needed. Basic canteen facilities are available onboard.</li>
                                                </ul>
                                            </li>
                                            <li className={neutralTextLight}><strong className={neutralText}>By Air (Helicopter):</strong> Pawan Hans operates limited helicopter services. Seats are scarce, expensive, and prioritize locals/officials/medical cases. Not a practical option for most tourist planning.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Getting Around Little Andaman:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={neutralTextLight}><strong className={neutralText}>Scooter/Motorbike Rental:</strong> Highly recommended for flexibility (~₹300-400 per day). Available widely in Hut Bay; arrange through guesthouses or local shops. Check bike condition and fuel up early (limited petrol pumps, early closing times).</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Public Buses:</strong> Connect Hut Bay with key villages and points near attractions like Butler Bay and White Surf Falls. Services are infrequent (3-4 times daily on main routes). Very economical.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Auto-Rickshaws & Shared Jeeps:</strong> Available in Hut Bay for local travel and trips to nearby beaches/waterfalls. Negotiate fares for private hire. Shared jeeps run on fixed routes, cheaper but less frequent.</li>
                                            <li className={neutralTextLight}><strong className={neutralText}>Walking/Cycling:</strong> Hut Bay town is walkable. Cycling is feasible for shorter distances (e.g., to White Surf Falls) but can be hot and humid. Bicycle rentals are uncommon.</li>
                                        </ul>
                                        {/* Warning Box for Restricted Areas */}
                                        <div className={`mt-6 p-4 ${warningBg} border-l-4 ${warningBorder} text-orange-800 rounded-r-lg shadow-sm`}>
                                            <h4 className={`font-semibold mb-2 ${warningText} flex items-center`}><Shield className="w-5 h-5 mr-2" /> Restricted Area Advisory</h4>
                                            <p className="text-sm md:text-base">
                                                Tourists are restricted from entering the Onge Tribal Reserve (Dugong Creek area) and the Nicobarese settlement areas near South Bay. Please respect these boundaries and do not attempt unauthorized entry.
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
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Waves size={18} className="mr-2 text-blue-600" /> Butler Bay Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Located about 14 km north of Hut Bay, Butler Bay is the island's most famous attraction. This stunning, long crescent-shaped beach features golden sands, clear waters, and is renowned for its excellent surfing conditions (especially from March to May). The southern end offers calmer waters suitable for swimming. Coconut plantations fringe the beach, providing shade. Basic huts and a small cafe sometimes operate seasonally. Ideal for surfing, swimming (check conditions), sunbathing, and watching sunsets.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Droplets size={18} className="mr-2 text-cyan-600" /> White Surf Waterfall</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Easily accessible, located about 6.5 km from Hut Bay. A short, pleasant walk (10-15 minutes) through the forest leads to this beautiful waterfall cascading into a clear pool. It's a popular spot for picnics and a refreshing dip in the natural pool. The flow is best during and just after the monsoon (October to February).</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2 flex items-center`}><Droplets size={18} className="mr-2 text-cyan-600" /> Whisper Wave Waterfall</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>A more adventurous destination, this larger waterfall requires a trek of about 3-4 km through dense rainforest, usually beyond White Surf falls area. The trail involves navigating jungle paths and possibly stream crossings. Hiring a local guide is essential. The reward is a secluded, powerful waterfall in a pristine setting. Allow ample time (4-5 hours round trip) and carry water/snacks.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Hut Bay (Netaji Nagar) Beach</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>This long stretch of beach runs adjacent to the main settlement area, starting near the jetty. It has calm, shallow waters, making it suitable for safe wading and evening strolls. Popular with locals. Offers views of fishing boats and the harbor.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Surfing</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Little Andaman is India's top surfing destination. Butler Bay offers consistent breaks suitable for various levels. Other breaks like Kumari Point and Jahaji Beach exist but are more remote and suited for experienced surfers, often requiring local guidance or boat access. Surf schools or board rentals are sometimes available seasonally near Butler Bay, primarily catering to visiting surfers.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Oil Palm Plantations</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Driving through the island reveals vast plantations of red oil palms, managed by the Andaman and Nicobar Islands Forest and Plantation Development Corporation (ANIFPDCL). It's a unique agricultural landscape to observe. A factory processing palm oil is also located on the island.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${neutralText} mb-2`}>Other Activities</h3>
                                        <p className={`text-base leading-relaxed ${neutralTextLight}`}>Possibilities include bird watching in the forests, exploring tide pools at low tide, arranging fishing trips with local fishermen, or simply enjoying the tranquility and stargazing due to minimal light pollution. Snorkeling opportunities exist but are less organized than in Havelock/Neil; finding good spots might require local advice or boat trips.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Bed className={`mr-3 ${neutralIconColor}`} size={24} /> Accommodation & Food
                                </h2>
                                <div className={`${cardBaseStyle} space-y-4`}>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Accommodation:</strong> Options are basic and limited, catering mainly to budget and mid-range travelers. Expect simple guesthouses in Hut Bay town (e.g., near the market/jetty) and bamboo/wooden huts near Butler Bay Beach. Popular choices often include family-run guesthouses providing rooms with attached baths (~₹1500-3000) or more basic huts (~₹500-1500). Government guesthouses (APWD, Tourism) exist but booking is difficult for tourists. There are no luxury resorts. Amenities like reliable electricity (generator timings), hot water (bucket), and Wi-Fi are scarce.</p>
                                    <p className={`text-base leading-relaxed ${neutralTextLight}`}><strong>Food:</strong> Dining is simple and localized. Hut Bay market has small eateries ('dhabas') serving affordable Bengali and South Indian thalis, fish curry, rice, roti, and basic breakfast items. Guesthouses often have kitchens preparing meals on order (inform in advance), typically simple Indian dishes and fresh seafood when available. Options are very limited outside Hut Bay and the immediate Butler Bay area. Carry snacks and water for day trips. Alcohol availability is restricted to one basic licensed bar in Hut Bay.</p>
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
                                        <h4 className={`font-medium ${infoText} text-sm`}>Nov–Feb (Peak Tourist)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Pleasant weather, calm seas, good waterfall flow. Ideal for general tourism.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>Mar–May (Surf Season)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Hotter but prime time for surfing swells. Sea generally calm until late May.</p>
                                    </div>
                                    <div className={`${errorBg} rounded-lg p-3 border ${errorBorder}`}>
                                        <h4 className={`font-medium ${errorText} text-sm`}>Jun–Oct (Monsoon/Off)</h4>
                                        <p className={`text-xs ${neutralTextLight}`}>Heavy rain, rough seas, ferry disruptions likely. Not recommended unless for expert surfing.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Rules - Warning Orange */}
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Tribal Reserves:** Onge (NW) and Nicobarese (S) areas are strictly off-limits. Do not attempt entry or interaction.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Ocean Safety:** Check local advice on swimming conditions/currents, especially at Butler Bay. Avoid creek mouths (crocodile risk, though low).</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Travel:** Allow buffer days for ferry travel due to potential delays/cancellations.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Health:** Carry comprehensive first-aid kit, insect repellent. Basic medical facilities in Hut Bay.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Connectivity & Cash:** Mobile network (BSNL best) and internet are very poor. Carry sufficient cash.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>**Jungle Treks:** Use guides for remote treks like Whisper Wave Falls. Wear appropriate gear.</span></li>
                                </ul>
                            </div>

                            {/* Responsible Tourism - Success Green */}
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Responsible Tourism
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect tribal reserves and local culture; dress modestly in villages.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Minimize environmental impact: Avoid plastic, pack out trash, don't disturb wildlife or corals.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Conserve resources like water and electricity, which are limited.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Support the local community by using local services (guesthouses, eateries, rentals) fairly.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Be mindful of the island's recovery from the 2004 tsunami.</span></li>
                                </ul>
                            </div>

                            {/* Traveler Tips - Tip Yellow */}
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book ferry tickets at least 1-2 days in advance. Check return schedule upon arrival.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Rent a scooter/bike upon arrival for maximum flexibility.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash; ATMs are unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Be prepared for basic amenities and limited connectivity. Download offline maps/entertainment.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Pack light clothing, swimwear, strong insect repellent, sunscreen, hat, basic first-aid, torch/headlamp.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Inform your guesthouse in advance if you require meals, especially dinner.</span></li>
                                    <li className={`flex items-start text-sm ${neutralTextLight}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Embrace the slow pace and enjoy the tranquility and natural beauty.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section - Contextual Color (Informational Blue) */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Ready for an Offbeat Adventure?</h2>
                    <p className={`${neutralTextLight} max-w-xl mx-auto mb-6`}>Plan your escape to the serene beaches, lush waterfalls, and surfing waves of Little Andaman. Contact us for tailored itineraries.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=little-andaman" className={buttonPrimaryStyle}>
                            Explore Little Andaman Tours <ArrowRight className="ml-2" size={18} />
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