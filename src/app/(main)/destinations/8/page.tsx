// Path: src/app/destinations/little-andaman/page.tsx
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
    Plane, // Added for consistency
    Ship,
    Landmark, // Added for consistency
    Waves,
    LifeBuoy,
    Bike,
    Droplets
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

export default function LittleAndamanPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Little Andaman - captions shortened
    const galleryImages = [
        {
            src: "/images/little-andaman/butler-bay-beach.jpg",
            alt: "Butler Bay Beach, Little Andaman",
            caption: "Butler Bay Beach"
        },
        {
            src: "/images/little-andaman/white-surf-waterfall.jpg",
            alt: "White Surf Waterfall, Little Andaman",
            caption: "White Surf Waterfall"
        },
        {
            src: "/images/little-andaman/whisper-wave-waterfall.jpg",
            alt: "Whisper Wave Waterfall trek, Little Andaman",
            caption: "Whisper Wave Waterfall"
        },
        {
            src: "/images/little-andaman/oil-palm-plantation.jpg",
            alt: "Oil Palm Plantation, Little Andaman",
            caption: "Oil Palm Plantation"
        },
        {
            src: "/images/little-andaman/hut-bay.jpg",
            alt: "Hut Bay area, Little Andaman",
            caption: "Hut Bay Jetty"
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
                    src="/images/little-andaman/hero.webp"
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
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Discover Little Andaman <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Little Andaman
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>South Andaman group, ~120 km south of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Surfing (Butler Bay), Waterfalls (White Surf, Whisper Wave), Pristine Beaches</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Ship className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Access</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Mainly via Ferry (6-8 hrs) from Port Blair to Hut Bay</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Little Andaman, located south of Port Blair, is an off-the-beaten-path paradise renowned for its stunning beaches, waterfalls, and as India's premier surfing destination. The island offers a laid-back vibe with attractions like the crescent-shaped Butler Bay Beach, the easily accessible White Surf Waterfall, and the more secluded Whisper Wave Waterfall. It is an ideal destination for backpackers, surfers, and travelers seeking raw natural beauty away from the crowds.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Getting There & Around
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Sea Ferry:</span><span className={secondaryTextColor}> The primary mode of access. Government ferries run from Port Blair to Hut Bay, taking 6-8 hours.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Bike className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Getting Around:</span><span className={secondaryTextColor}> Scooter/motorbike rental is the best way to explore the island's spread-out attractions.</span></div>
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
                                            <h3 className={`font-semibold ${infoText} mb-2`}>Nov–Apr</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Dry season, ideal for beach-hopping and exploration.</p>
                                        </div>
                                        <div className={`${successBg} rounded-xl p-4 border ${successBorder}`}>
                                            <h3 className={`font-semibold ${successText} mb-2`}>Feb-Apr</h3>
                                            <p className={`text-sm ${secondaryTextColor}`}>Best season for surfing with good swells.</p>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Butler Bay Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A stunning crescent-shaped beach famous for its powerful waves, making it a hotspot for surfing.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Droplets size={18} className={`mr-2 ${inactiveTextColor}`} /> White Surf Waterfall</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A beautiful and easily accessible waterfall located amidst a lush evergreen forest.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Droplets size={18} className={`mr-2 ${inactiveTextColor}`} /> Whisper Wave Waterfall</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A more secluded waterfall requiring a 4 km trek through the jungle, offering a rewarding experience.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Oil Palm Plantation</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Vast, picturesque plantations that are a unique feature of Little Andaman's landscape.</p>
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
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Accommodation is basic, consisting of small guesthouses and simple resorts near Hut Bay and Butler Bay. No luxury options available.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Dining is limited to small local eateries serving fresh seafood and basic Indian dishes.</span></li>
                                </ul>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Ideal for backpackers and independent travelers.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Book ferry tickets and accommodation in advance.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry cash and a first-aid kit. Network connectivity is poor.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Be cautious of crocodiles in creeks and some coastal areas.</span></li>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Little Andaman, situated about 120 km south of Port Blair, is the fourth largest island in the archipelago and a true gem for offbeat travelers. Known as the 'vegetable bowl' of the islands due to its extensive red oil palm plantations and vegetable cultivation, the island offers a landscape quite distinct from its northern counterparts. It is renowned as India's surfing capital, with the magnificent crescent-shaped Butler Bay Beach attracting surfers from around the world with its impressive swells.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Beyond surfing, Little Andaman is a treasure trove of natural wonders. It boasts pristine white sandy beaches, crystal-clear blue waters, and two spectacular waterfalls—the easily accessible White Surf Waterfall and the more remote Whisper Wave Waterfall, which requires a jungle trek. The island's relaxed, laid-back atmosphere makes it a haven for backpackers and those seeking solitude and a deep connection with nature. With its unique attractions and limited tourist infrastructure, Little Andaman offers an authentic, adventurous, and unforgettable experience.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Little Andaman:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Sea:</strong> This is the primary and most reliable way to reach the island. Government ferries ply from Haddo Wharf in Port Blair to Hut Bay Jetty in Little Andaman. The journey takes about 6 to 8 hours, depending on the vessel and sea conditions. Both day and overnight ferries are available, but schedules are infrequent, so booking tickets well in advance is crucial.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>By Air:</strong> A small airstrip exists for helicopter services, but these are infrequent and generally reserved for official or emergency use, not for regular tourist travel.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around the Island:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Scooter/Motorbike Rental:</strong> The most popular and convenient way to explore. Scooters can be rented from Hut Bay for a reasonable daily rate, giving you the freedom to visit beaches and waterfalls at your own pace.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Buses & Jeeps:</strong> Local buses and shared jeeps connect Hut Bay with other parts of the island, but they run on fixed schedules and can be infrequent.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Auto-Rickshaws:</strong> Available for shorter distances around the main town area.</li>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Butler Bay Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Located 14 km from Hut Bay Jetty, this is the most famous beach in Little Andaman. It's a stunning, long, crescent-shaped beach with yellow sand and clear blue water. It's renowned for its excellent surfing breaks, attracting both beginners and experienced surfers. The beach is also great for sunbathing and swimming (be mindful of the strong currents). Elephant training and bathing used to be an attraction here but have since been discontinued.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Droplets size={18} className={`mr-2 ${inactiveTextColor}`} /> White Surf Waterfall</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A beautiful and easily accessible waterfall located about 6.5 km from Hut Bay. A short walk from the main road through lush forest leads you to this picturesque spot where you can take a refreshing dip in the natural pool at its base. It's a popular spot for picnics and relaxing in nature.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Droplets size={18} className={`mr-2 ${inactiveTextColor}`} /> Whisper Wave Waterfall</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>For the more adventurous, this waterfall requires a 4 km trek through the dense jungle. The trail can be challenging and involves crossing streams. The reward is a serene and secluded waterfall, offering a truly immersive natural experience. It's advisable to hire a local guide for this trek.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Oil Palm Plantations</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A unique feature of Little Andaman is the vast expanse of Red Oil Palm Plantations, managed by the Andaman and Nicobar Islands Forest and Plantation Development Corporation. Driving through these plantations offers a unique and scenic experience, showcasing the agricultural side of the island.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Netaji Nagar Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A long, sandy beach located about 11 km from Hut Bay. It's a quieter alternative to Butler Bay, ideal for long walks, sunbathing, and enjoying serene sunsets. The beach is fringed with coconut palms, adding to its picturesque beauty.</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Accommodation:</strong> Options are limited and very basic, catering primarily to backpackers. Expect simple guesthouses and small, family-run resorts with minimal amenities. There are no luxury or mid-range hotels. Most accommodation is located near Hut Bay or along the main road towards Butler Bay. Booking in advance is highly recommended.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}><strong>Food:</strong> Dining is also basic, with small local eateries and dhabas in Hut Bay serving simple Indian thalis, rice, dal, and fresh seafood. Don't expect a wide variety of cuisines. It's a good idea to carry some snacks and food items with you.</p>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Practicalities
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Be aware of crocodiles, which inhabit the creeks and have been sighted in some coastal areas. Heed local warnings.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Medical facilities are very basic. Carry a comprehensive first-aid kit.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash, as there are very few ATMs and they are often unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Mobile connectivity is extremely poor. Inform your family of your itinerary in advance.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>A permit (RAP) may be required for foreign nationals. Check the latest regulations before travel.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Best suited for adventurous, independent travelers and backpackers who are comfortable with basic facilities.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Book ferry tickets and accommodation well in advance, as options are limited.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Rent a scooter to have the freedom to explore the island thoroughly.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>If you plan to surf, you may need to bring your own board, though some basic boards might be available for rent.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Catch the Wave to Little Andaman</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Ready to explore India's surfing paradise? Plan your offbeat adventure to the pristine beaches and waterfalls of Little Andaman.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=little-andaman" className={buttonPrimaryStyle}>
                            View Little Andaman Tours <ArrowRight className="ml-2" size={18} />
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