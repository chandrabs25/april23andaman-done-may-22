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
    Plane,      // Added for consistency
    Ship,
    Car,        // For road access
    TreePine,   // For Mangrove Walkway
    Turtle,     // For Turtle Nesting
    Landmark,
    Waves,
    LifeBuoy
} from 'lucide-react';

// --- Common Styles (adapted from Port Blair for consistency) ---
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

const neutralBgLight = 'bg-gray-50';
const neutralBorderLight = 'border-gray-100';

// Text colors from the new design
const primaryTextColor = 'text-[#0e151b]';
const secondaryTextColor = 'text-gray-600';
const inactiveTextColor = 'text-[#4e7997]';

const sectionHeadingStyle = `text-[22px] font-bold ${primaryTextColor} mb-6 flex items-center leading-tight tracking-[-0.015em]`;
const cardBaseStyle = `bg-white rounded-2xl shadow-sm border ${neutralBorderLight} p-6 transition-shadow hover:shadow-md`;
const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md`;
const buttonSecondaryStyleHero = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} px-6 py-3 rounded-full font-medium transition-all duration-300`;
// --- End Common Styles ---


export default function RangatDestinationPage() {
    const [showComprehensive, setShowComprehensive] = useState(false);

    const handleToggle = (isComprehensive: boolean) => {
        setShowComprehensive(isComprehensive);
    };

    // Gallery images specific to Rangat
    const galleryImages = [
        {
            src: "/images/rangat/dhani-nallah-walkway.jpg",
            alt: "Dhani Nallah Mangrove Walkway, Rangat",
            caption: "Dhani Nallah"
        },
        {
            src: "/images/rangat/amkunj-beach.jpg",
            alt: "Amkunj Beach Eco-Park, Rangat",
            caption: "Amkunj Beach"
        },
        {
            src: "/images/rangat/cuthbert-bay-beach.jpg",
            alt: "Cuthbert Bay Beach, a turtle nesting site",
            caption: "Cuthbert Bay"
        },
        {
            src: "/images/rangat/morrice-dera.jpg",
            alt: "Morrice Dera Beach and Viewpoint, Rangat",
            caption: "Morrice Dera"
        },
        {
            src: "/images/rangat/rangat-landscape.jpg",
            alt: "Rural landscape near Rangat",
            caption: "Rural Landscape"
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
                    src="/images/rangat/hero.jpg" // Specific Rangat hero image
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
                            <Link href="#overview" className={buttonPrimaryStyle}>
                                Discover Rangat <ArrowRight size={18} className="ml-2" />
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
                        Quick Facts About Rangat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <MapPin className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Location</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Middle Andaman Island, ~170 km from Port Blair</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Star className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Known For</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Dhani Nallah Walkway, Turtle Nesting, Amkunj Beach</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className={`bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`}>
                                <Car className={infoIconColor} size={18} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${primaryTextColor}`}>Access</h3>
                                <p className={`text-sm ${secondaryTextColor}`}>Primarily by road (ATR, 6-7 hrs), some ferries</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redesigned Image Gallery */}
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

                {/* Redesigned Toggle/Tabbed Navigation */}
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Rangat is a quiet, eco-tourism destination in Middle Andaman, valued for its natural beauty over commercial attractions. It's a stopover for travelers heading north and offers serene beaches, India's longest mangrove walkway, and vital turtle nesting grounds.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Navigation className={`mr-3 ${inactiveTextColor}`} size={24} /> Getting There
                                </h2>
                                <div className={cardBaseStyle}>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className={`bg-gray-100 p-2 rounded-full mr-3 mt-1 border border-gray-200`}><Car className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Road:</span><span className={secondaryTextColor}> Primary access via Andaman Trunk Road (ATR). 6-7 hours by bus/car from Port Blair.</span></div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className={`bg-gray-100 p-2 rounded-full mr-3 mt-1 border border-gray-200`}><Ship className={inactiveTextColor} size={16} /></div>
                                            <div><span className={`font-medium ${primaryTextColor}`}>Sea:</span><span className={secondaryTextColor}> Government ferries from Port Blair, Mayabunder, and Diglipur are available but less frequent.</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Landmark className={`mr-3 ${inactiveTextColor}`} size={24} /> Key Attractions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><TreePine size={18} className={`mr-2 ${inactiveTextColor}`} /> Dhani Nallah Mangrove Walkway</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A stunning 713m boardwalk through dense mangroves, leading to a beach.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Amkunj Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Known as the "eco-friendly beach," perfect for swimming and relaxing.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Turtle size={18} className={`mr-2 ${inactiveTextColor}`} /> Cuthbert Bay Beach</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>A critical nesting site for Olive Ridley turtles (Dec-Feb). Observation is key.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Compass size={18} className={`mr-2 ${inactiveTextColor}`} /> Morrice Dera & Panchavati</h3>
                                        <p className={`text-sm ${secondaryTextColor}`}>Offers a beautiful coastline viewpoint and a small waterfall surrounded by lush greenery.</p>
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
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Limited options, mainly government guesthouses (Hawksbill Nest) and a few private lodges.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Booking in advance is highly recommended, especially during peak season.</span></li>
                                </ul>
                            </div>
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Utensils className={`mr-2 ${inactiveTextColor}`} size={20} /> Food
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Basic eateries and local dhabas near the main market offer simple Indian and local cuisine.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${inactiveTextColor} flex-shrink-0`} size={16} /><span>Don't expect fine dining; it's about authentic, local flavors.</span></li>
                                </ul>
                            </div>
                            <div className={`${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`}>
                                <h3 className={`text-lg font-semibold ${tipText} mb-4 flex items-center`}>
                                    <MessageCircle className={`mr-2 ${tipIconColor}`} size={20} /> Traveler Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Ideal for nature lovers and those seeking peace. Not for party-goers.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Carry cash; ATMs are few and may not be reliable.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${tipIconColor} flex-shrink-0`} size={16} /><span>Mobile network is weak; BSNL has the best coverage.</span></li>
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
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Rangat is the administrative hub of Middle Andaman, but it retains a slow-paced, rural charm. Unlike the more tourist-centric Havelock or Neil, Rangat's appeal lies in its authentic, untouched natural landscapes. It is a town of sprawling agricultural fields, quiet villages, and a coastline marked by unique ecological features.</p>
                                    <p className={`text-base leading-relaxed ${secondaryTextColor}`}>The primary reason to visit Rangat is to experience its eco-tourism sites. It serves as a gateway to North Andaman and is an essential stop for travelers on the Andaman Trunk Road. Here, you can witness the delicate balance of mangrove ecosystems, observe marine turtles in their natural habitat, and enjoy serene beaches without the crowds, offering a glimpse into the quieter side of Andaman life.</p>
                                </div>
                            </section>

                            <section>
                                <h2 className={sectionHeadingStyle}>
                                    <Compass className={`mr-3 ${inactiveTextColor}`} size={24} /> Exploring Attractions & Activities
                                </h2>
                                <div className="space-y-6">
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><TreePine size={18} className={`mr-2 ${inactiveTextColor}`} /> Dhani Nallah Mangrove Walkway</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>This is Rangat's star attraction. A 713-meter-long wooden boardwalk meanders through a dense mangrove creek, offering an immersive experience into this unique ecosystem. It's a fantastic spot for bird watching and understanding the role of mangroves. The walkway ends at Dhani Nallah Beach, a nesting ground for sea turtles.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Turtle size={18} className={`mr-2 ${inactiveTextColor}`} /> Cuthbert Bay Wildlife Sanctuary</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A 6 km long sandy beach that is a globally important nesting site for Olive Ridley, Green Sea, and Hawksbill turtles. The nesting season is from December to February. A forest department-run turtle hatchery is also located here. Visitors can watch nesting at night but must maintain strict silence and use no lights to avoid disturbing the turtles.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Waves size={18} className={`mr-2 ${inactiveTextColor}`} /> Amkunj Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Located about 8 km from Rangat, this is a beautiful sandy beach ideal for swimming, sunbathing, and relaxation. It's known for its calm, blue waters and has been developed with eco-friendly infrastructure like log sofas and benches, making it a perfect picnic spot.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Compass size={18} className={`mr-2 ${inactiveTextColor}`} /> Morrice Dera Beach</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>Situated about 12 km from Rangat, this site features twin rock formations jutting out into the sea, creating a spectacular viewpoint. A walkway leads to the viewpoint, offering panoramic views of the coastline. It's an excellent spot for photography.</p>
                                    </div>
                                    <div className={cardBaseStyle}>
                                        <h3 className={`font-semibold ${primaryTextColor} mb-2 flex items-center`}><Leaf size={18} className={`mr-2 ${inactiveTextColor}`} /> Panchavati Hills & Waterfall</h3>
                                        <p className={`text-base leading-relaxed ${secondaryTextColor}`}>A small, gentle waterfall set amidst lush green paddy fields and areca nut plantations, managed by the local community. It's more of a refreshing stream than a large cascade, providing a peaceful retreat, especially just after the monsoon season.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1 space-y-8">
                            <div className={cardBaseStyle}>
                                <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4 flex items-center`}>
                                    <Calendar className={`mr-2 ${inactiveTextColor}`} size={20} /> Best Time to Visit
                                </h3>
                                <div className="space-y-3">
                                    <div className={`${infoBg} rounded-lg p-3 border ${infoBorder}`}>
                                        <h4 className={`font-medium ${infoText} text-sm`}>Dec–Feb (Turtle Season)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Best time to visit for turtle nesting at Cuthbert Bay and Dhani Nallah. Weather is pleasant.</p>
                                    </div>
                                    <div className={`${successBg} rounded-lg p-3 border ${successBorder}`}>
                                        <h4 className={`font-medium ${successText} text-sm`}>Oct–Mar (Pleasant Weather)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Dry and comfortable weather, ideal for sightseeing and beach visits.</p>
                                    </div>
                                    <div className={`${warningBg} rounded-lg p-3 border ${warningBorder}`}>
                                        <h4 className={`font-medium ${warningText} text-sm`}>May–Sep (Monsoon)</h4>
                                        <p className={`text-xs ${secondaryTextColor}`}>Heavy rainfall. Travel can be disrupted. Best to avoid unless you enjoy lush, green landscapes.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`}>
                                <h3 className={`text-lg font-semibold ${warningText} mb-4 flex items-center`}>
                                    <LifeBuoy className={`mr-2 ${warningIconColor}`} size={20} /> Safety & Practicalities
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Accommodation is limited; book well in advance, especially Hawksbill Nest at Cuthbert Bay.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Carry sufficient cash. ATM availability is limited and unreliable.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>BSNL is the most reliable mobile network; others have poor or no connectivity.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Basic medical facilities are available, but for serious issues, Port Blair is the nearest option.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${warningIconColor} flex-shrink-0`} size={16} /><span>Hire a local guide or vehicle for easier access to attractions, which are spread out.</span></li>
                                </ul>
                            </div>
                            <div className={`${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`}>
                                <h3 className={`text-lg font-semibold ${successText} mb-4 flex items-center`}>
                                    <Leaf className={`mr-2 ${successIconColor}`} size={20} /> Eco-Tourism Code
                                </h3>
                                <ul className="space-y-3">
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>When observing turtles, maintain absolute silence and do not use flashlights or flash photography.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not touch or disturb any wildlife, including nests and eggs.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Do not litter. Carry your waste back with you from beaches and walkways.</span></li>
                                    <li className={`flex items-start text-sm ${secondaryTextColor}`}><Check className={`mr-2 mt-1 ${successIconColor} flex-shrink-0`} size={16} /><span>Respect the local culture and communities.</span></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                )}

                {/* CTA Section */}
                <section className={`mt-16 ${infoBg} rounded-2xl p-8 border ${infoBorder} text-center`}>
                    <h2 className={`text-2xl font-bold ${infoText} mb-4`}>Ready for an Eco-Adventure in Rangat?</h2>
                    <p className={`${secondaryTextColor} max-w-xl mx-auto mb-6`}>Connect with nature in Rangat. Let us help you plan your trip to this serene part of the Andamans.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/packages?destination=rangat" className={buttonPrimaryStyle}>
                            View Rangat Packages <ArrowRight className="ml-2" size={18} />
                        </Link>
                        <Link href="/contact" className={`inline-flex items-center justify-center bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md`}>
                            Get Travel Assistance
                        </Link>
                    </div>
                </section>

            </div>
        </main>
    );
} 