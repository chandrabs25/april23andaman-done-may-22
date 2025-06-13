// Path: src/app/destinations/baratang-island/page.tsx
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
    TreePine,
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

export default function BaratangIslandPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Baratang Island - captions shortened
    const galleryImages = [
        {
            src: "/images/baratang/limestone-caves.webp",
            alt: "Limestone Caves of Baratang",
            caption: "Limestone Caves"
        },
        {
            src: "/images/baratang/mud-volcano.webp",
            alt: "Mud Volcano, Baratang",
            caption: "Mud Volcano"
        },
        {
            src: "/images/baratang/mangrove-creek.webp",
            alt: "Mangrove Creek boat ride, Baratang",
            caption: "Mangrove Creek"
        },
        {
            src: "/images/baratang/parrot-island.webp",
            alt: "Parrot Island near Baratang at sunset",
            caption: "Parrot Island"
        },
        {
            src: "/images/baratang/baludera-beach.webp",
            alt: "Baludera Beach, Baratang",
            caption: "Baludera Beach"
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
                    src="/images/baratang/hero.webp"
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
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Discover Baratang <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Baratang Island
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Middle Andaman, ~100 km north of Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Limestone caves, mud volcanoes, mangrove boat rides, Jarawa Reserve passage</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Calendar className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Visit Type</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Primarily a day trip from Port Blair due to convoy timings</p>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Baratang Island offers a unique eco-tourism experience, famous for its natural wonders. The journey itself is an adventure, passing through the protected Jarawa Tribal Reserve. Key attractions include mesmerizing Limestone Caves, the rare geological phenomenon of Mud Volcanoes, and enchanting boat rides through dense mangrove creeks.</p>
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
                                            <div><span className={`font-medium ${primaryTextColor}`}>Road Convoy:</span><span className={secondaryTextColor}> Primarily reached by road from Port Blair via the Andaman Trunk Road (ATR), travelling in a mandatory vehicle convoy through the Jarawa reserve.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Vehicle Ferry:</span><span className={secondaryTextColor}> A short vehicle ferry crosses the creek to reach Baratang jetty.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`${neutralBg} p-2 rounded-full mr-3 mt-1 border ${neutralBorder}`}><Calendar className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Day Trip:</span><span className={secondaryTextColor}> Most commonly done as a long day trip (3 AM to afternoon) from Port Blair. Private cabs or bus tours available.</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Compass className={`mr-3 ${inactiveTextColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Limestone Caves</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Reached by a thrilling boat ride through mangroves and a short trek. Features stunning stalactite and stalagmite formations.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Mud Volcano</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>India's only active mud volcano. A short drive from the jetty to see bubbling mud craters.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><TreePine size={18} className={`mr-2 ${inactiveTextColor}`} /> Mangrove Safari</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>The boat journey to the caves is an attraction in itself, passing through a natural tunnel of dense mangrove forests.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${inactiveTextColor}`} /> Parrot Island</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A unique spectacle where thousands of parrots and parakeets return to roost at sunset. Requires an overnight stay.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1 space-y-8">
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <Shield className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Rules
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Interaction with the Jarawa tribe is strictly prohibited and illegal.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Do not stop, take photos/videos, or offer food in the tribal reserve.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Start early from Port Blair to catch the morning convoy.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Bed className={`mr-2 ${inactiveTextColor}`} size={20} /> Accommodation
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Very limited options available (a few private guesthouses and a forest guesthouse). Most tourists visit on a day trip.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food Highlights
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Basic eateries and small restaurants near the jetty offer simple Indian meals and seafood.</span></li>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Baratang Island, located in the Middle Andaman administrative district, is a destination for travellers seeking raw, natural wonders over pristine beaches. Situated about 100 kilometers north of Port Blair, Baratang serves as a bridge between Middle and South Andaman. Its main draw lies in its unique geological and biological attractions, offering a glimpse into the archipelago's rich ecological diversity.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The journey to Baratang is an integral part of the experience, involving a drive on the Andaman Trunk Road (ATR) that cuts through the protected Jarawa Tribal Reserve. This passage requires adherence to strict regulations to ensure the privacy and preservation of the indigenous Jarawa community. Once on the island, visitors are rewarded with fascinating sights like the natural-limestone caves, India's only active mud volcano, and a spectacular boat safari through a canopy of dense mangrove forests. Due to the logistics of the ATR convoy system, Baratang is most often experienced as a long and early-starting day trip from Port Blair.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Comprehensive Travel Guide
                                </h2>
                                <div className={`${cardBaseStyle} space-y-6`}>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Reaching Baratang Island:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>ATR Convoy (Primary Method):</strong> The journey involves a 3-4 hour road trip from Port Blair. The key part is passing through the Jarawa Tribal Reserve, which is done in scheduled, police-escorted convoys. There are typically four convoys per day in each direction, starting as early as 6 AM. It's crucial to start from Port Blair by 3-4 AM to catch the first or second convoy.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Vehicle Ferry:</strong> After the road journey, there's a short (15-minute) vehicle ferry crossing from Middle Strait to Baratang Jetty (Nilambur Jetty).</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Tour Options:</strong> Most visitors hire a private cab for the entire day. Alternatively, government and private bus tours are available, which are more economical but less flexible.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2`}>Getting Around Baratang:</h3>
                                        <ul className="space-y-3 pl-4 list-disc list-outside marker:text-gray-400">
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Fiber Boats:</strong> To reach the Limestone Caves, one must hire a fiber boat from the main jetty. This thrilling 30-minute ride winds through a dense mangrove creek.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Local Jeeps/Taxis:</strong> From the jetty, local jeeps or taxis can be hired to visit the Mud Volcano, which is a few kilometers away.</li>
                                            <li className={secondaryTextColor}><strong className={primaryTextColor}>Walking:</strong> A short, 1.5 km walk through a forest and village trail is required to reach the Limestone Caves after the boat ride ends.</li>
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
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Limestone Caves</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The highlight of Baratang. After a scenic boat ride through mangrove tunnels and a short trek, you arrive at these natural caves. Inside, you'll find impressive stalactite and stalagmite formations created over thousands of years by the deposition of limestone. The caves are dark inside, and a guide with a flashlight is essential to appreciate the various shapes and patterns.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Landmark size={18} className={`mr-2 ${inactiveTextColor}`} /> Mud Volcano</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A rare geological phenomenon, this is the only known active mud volcano in India. A short drive and a walk up a small flight of stairs lead to a clearing with several small, bubbling mud craters. Natural gases emitted from deep within the earth create these muddy pools. While not visually spectacular like a lava volcano, it's a unique natural wonder.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><TreePine size={18} className={`mr-2 ${inactiveTextColor}`} /> Mangrove Creek Safari</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The journey to the Limestone Caves is an attraction in itself. The fiber boat zips through a narrow, winding creek, surrounded on both sides by a dense canopy of mangrove trees, forming a natural tunnel. This provides a fascinating up-close look at the unique mangrove ecosystem, which serves as a critical coastal barrier and nursery for marine life.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Users size={18} className={`mr-2 ${inactiveTextColor}`} /> Parrot Island</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A small, uninhabited island that becomes the roosting ground for thousands of parrots and parakeets every evening. Witnessing the spectacle of countless birds returning to the island at sunset is a magical experience. This tour requires a separate boat trip in the late afternoon and typically necessitates an overnight stay in Baratang, which is less common for tourists.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1 space-y-8">
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Rules for Jarawa Reserve
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Interaction, photography, videography, or even attempting to establish contact with the Jarawa tribe members is strictly illegal and punishable by law.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Vehicles must travel in designated convoys with windows rolled up. Do not stop or get out of the vehicle within the reserve.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Do not offer any food or gifts. This practice, known as "human safaris," is banned and harmful to the tribe.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Respect their privacy and dignity. You are a visitor passing through their ancestral home.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Start your day trip from Port Blair by 3-4 AM to ensure you make the early convoys and have enough time.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry cash for boat tickets, guide fees, food, and other expenses. Digital payments are not common.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Wear comfortable walking shoes, light clothing, and carry a hat, sunscreen, and insect repellent.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Accommodation is very basic and limited. It is strongly recommended to plan Baratang as a day trip from Port Blair.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Journey to the Heart of Andaman</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Experience the natural wonders of Baratang. Book a tour to explore its unique caves, volcanoes, and mangroves.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=baratang" className={buttonPrimaryStyle}>
                            View Baratang Tours <ArrowRight className="ml-2" size={18} />
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