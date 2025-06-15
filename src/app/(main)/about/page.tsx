// Path: ./src/app/about/page.tsx
'use client';

import Image from 'next/image';
import { BookOpen, Target, Check, Award, UserPlus, Leaf, Users, Map, ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Added Link back

// --- Color Theme ---
const primaryColor = '#F59E0B'; // Amber-600 (Example primary yellow/orange)
const primaryColorDarker = '#D97706'; // Amber-700
const primaryColorLighter = '#FCD34D'; // Amber-400
const primaryColorLightestBg = '#FFFBEB'; // Amber-50 (Very light yellow)
const primaryColorLightBg = '#FEF3C7';    // Amber-100 (Light yellow)
const primaryColorLighterBg = '#FDE68A';  // Amber-200
const iconColorYellow = '#FACC15';   // bright yellow  – yellow-400
const iconColorGreen = '#22C55E';   // bright green   – emerald-500
const iconColorPink = '#EC4899';   // bright pink    – pink-500
const iconColorOrange = '#F97316';   // bright orange  – orange-500

// Button Styles (Reduced padding compared to original source)
const buttonPrimaryStyle = `inline-flex items-center justify-center bg-[${primaryColor}] hover:bg-[${primaryColorDarker}] text-black font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 border border-black`;
const buttonSecondaryStyle = `inline-flex items-center justify-center bg-transparent text-white border-2 border-white hover:bg-white/10 font-semibold py-2.5 px-6 rounded-full transition-all duration-300`; // For dark backgrounds
const ctaPrimaryOnDarkStyle = `bg-white text-[${primaryColorDarker}] hover:bg-[${primaryColorLightestBg}] font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center`; // Primary action on dark bg
const ctaSecondaryOnDarkStyle = `bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center`; // Secondary action on dark bg
// --- End Color Theme ---

export default function AboutPage() {
  return (
    <>
      {/* Hero Section with enhanced styling */}
      {/* Updated background gradient */}
      <div className={`relative bg-gradient-to-r from-[${primaryColor}] to-[${primaryColorDarker}] h-72 md:h-96`}>
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

        {/* --- Image Container --- */}
        <div className="absolute inset-0 z-0 opacity-80"> {/* Added opacity */}
          {/* Desktop Image */}
          <Image
            src="/images/about-hero.jpg"
            alt="About Reach Andaman - Team meeting"
            fill
            className="object-cover hidden md:block"
            priority
          />
          {/* Mobile Image */}
          <Image
            src="/images/about-hero-mobile.jpg"
            alt="About Reach Andaman - Team"
            fill
            className="object-cover block md:hidden"
            priority
          />
        </div>
        {/* --- End Image Container --- */}

        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-3 md:mb-5 drop-shadow-lg">
            About <span className={`text-[${primaryColorLighter}]`}>Reach Andaman</span> {/* Highlighted text */}
          </h1>
          <p className="text-lg sm:text-xl text-white text-center max-w-2xl opacity-95 drop-shadow-md">
            Your trusted partner for unforgettable Andaman experiences
          </p>
          {/* Added CTA button with updated style */}
          <Link href="/contact" className={`mt-6 ${buttonSecondaryStyle}`}>
            Contact Us
          </Link>
        </div>

        {/* Added decorative wave element */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto">
            {/* Updated fill color to white */}
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* About Content with enhanced styling */}
      {/* Updated background if needed, keeping white */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Our Story with enhanced styling */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center justify-center md:justify-start mb-8">
                {/* Updated icon color */}
                <BookOpen className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Story</h2>
              </div>

              <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                {/* Updated background and border color */}
                <p className={`bg-[${primaryColorLightestBg}] p-6 rounded-2xl border-l-4 border-[${primaryColor}] shadow-sm`}>
                  Founded in 2018, Reach Andaman was born out of a passion for the breathtaking beauty of the Andaman Islands and a desire to share this hidden paradise with travelers from around the world. What began as a small team of local guides has grown into a comprehensive travel platform dedicated to providing authentic and memorable experiences.
                </p>
                <p>
                  Our journey started when our founder recognized the need for a reliable travel service that could showcase the islands' natural wonders while respecting their delicate ecosystems and supporting local communities. Today, we continue to uphold these values as we help travelers discover the magic of the Andamans.
                </p>

                {/* Added image */}
                <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg my-8">
                  <Image
                    src="/images/andaman-beach.jpg"
                    alt="Beautiful Andaman beach"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Our Mission with enhanced styling */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center justify-center md:justify-start mb-8">
                {/* Updated icon color */}
                <Target className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>

              <div className="text-gray-700 text-base md:text-lg leading-relaxed">
                <p className="mb-6">
                  At Reach Andaman, our mission is to provide exceptional travel experiences that connect visitors with the natural beauty, rich culture, and warm hospitality of the Andaman Islands. We are committed to:
                </p>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      {/* Updated check icon background and color */}
                      <div className={`bg-[${primaryColorLightBg}] rounded-full p-1 mr-3 mt-0.5`}>
                        <Check className={`h-4 w-4 text-[${primaryColorDarker}]`} />
                      </div>
                      <span>Promoting sustainable tourism that preserves the islands' pristine environments</span>
                    </li>
                    <li className="flex items-start">
                      {/* Updated check icon background and color */}
                      <div className={`bg-[${primaryColorLightBg}] rounded-full p-1 mr-3 mt-0.5`}>
                        <Check className={`h-4 w-4 text-[${primaryColorDarker}]`} />
                      </div>
                      <span>Supporting local communities through responsible travel practices</span>
                    </li>
                    <li className="flex items-start">
                      {/* Updated check icon background and color */}
                      <div className={`bg-[${primaryColorLightBg}] rounded-full p-1 mr-3 mt-0.5`}>
                        <Check className={`h-4 w-4 text-[${primaryColorDarker}]`} />
                      </div>
                      <span>Offering personalized services that cater to each traveler's unique preferences</span>
                    </li>
                    <li className="flex items-start">
                      {/* Updated check icon background and color */}
                      <div className={`bg-[${primaryColorLightBg}] rounded-full p-1 mr-3 mt-0.5`}>
                        <Check className={`h-4 w-4 text-[${primaryColorDarker}]`} />
                      </div>
                      <span>Ensuring safety, comfort, and satisfaction throughout your journey</span>
                    </li>
                    <li className="flex items-start">
                      {/* Updated check icon background and color */}
                      <div className={`bg-[${primaryColorLightBg}] rounded-full p-1 mr-3 mt-0.5`}>
                        <Check className={`h-4 w-4 text-[${primaryColorDarker}]`} />
                      </div>
                      <span>Creating unforgettable memories that last a lifetime</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why Choose Us with enhanced styling */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center justify-center mb-10">
                {/* Updated icon color */}
                <Award className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Why Choose Us</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Card 1 with enhanced styling */}
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Updated icon background and color */}
                  <div className={`w-16 h-16 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mx-auto mb-5`}>
                    <Map className={`h-8 w-8 text-[${primaryColorDarker}]`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Local Expertise</h3>
                  <p className="text-gray-600">
                    Our team consists of local experts ensuring authentic experiences and insider access to hidden gems.
                  </p>
                </div>

                {/* Card 2 with enhanced styling */}
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Updated icon background and color */}
                  <div className={`w-16 h-16 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mx-auto mb-5`}>
                    <UserPlus className={`h-8 w-8 text-[${primaryColorDarker}]`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Personalized Service</h3>
                  <p className="text-gray-600">
                    We tailor itineraries to match your interests, preferences, and travel style for a perfect vacation.
                  </p>
                </div>

                {/* Card 3 with enhanced styling */}
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Updated icon background and color */}
                  <div className={`w-16 h-16 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mx-auto mb-5`}>
                    <Leaf className={`h-8 w-8 text-[${primaryColorDarker}]`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Sustainable Practices</h3>
                  <p className="text-gray-600">
                    Committed to eco-friendly tourism that preserves the natural beauty of the Andamans for generations.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Team with enhanced styling */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-10">
                {/* Updated icon color */}
                <Users className={`text-[${primaryColorDarker}] mr-3 flex-shrink-0`} size={24} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Team</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Team Member 1 with enhanced styling */}
                <div className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-5 rounded-full overflow-hidden shadow-md border-4 border-white">
                    <Image src="/images/team-1.jpg" alt="Kanna - Founder & CEO" fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Kanna</h3>
                  {/* Updated job title color */}
                  <p className={`text-[${primaryColorDarker}] font-medium text-sm mb-3`}>Founder & CEO</p>
                  <div className="flex justify-center space-x-3">
                    {/* Updated social icon hover color */}
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" /></svg>
                    </a>
                  </div>
                </div>

                {/* Team Member 2 with enhanced styling */}
                <div className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-5 rounded-full overflow-hidden shadow-md border-4 border-white">
                    <Image src="/images/team-2.jpg" alt="Elon Musk - Head of Operations" fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Rajesh</h3>
                  {/* Updated job title color */}
                  <p className={`text-[${primaryColorDarker}] font-medium text-sm mb-3`}>Head of Operations</p>
                  <div className="flex justify-center space-x-3">
                    {/* Updated social icon hover color */}
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" /></svg>
                    </a>
                  </div>
                </div>

                {/* Team Member 3 with enhanced styling */}
                <div className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-5 rounded-full overflow-hidden shadow-md border-4 border-white">
                    <Image src="/images/team-3.jpg" alt="Mia Khalifa - Lead Tour Guide" fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Vijay</h3>
                  {/* Updated job title color */}
                  <p className={`text-[${primaryColorDarker}] font-medium text-sm mb-3`}>Lead Tour Guide</p>
                  <div className="flex justify-center space-x-3">
                    {/* Updated social icon hover color */}
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" /></svg>
                    </a>
                  </div>
                </div>

                {/* Team Member 4 with enhanced styling */}
                <div className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-5 rounded-full overflow-hidden shadow-md border-4 border-white">
                    <Image src="/images/team-4.jpg" alt="Sunny Leone - Customer Relations" fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Priya</h3>
                  {/* Updated job title color */}
                  <p className={`text-[${primaryColorDarker}] font-medium text-sm mb-3`}>Customer Relations</p>
                  <div className="flex justify-center space-x-3">
                    {/* Updated social icon hover color */}
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" /></svg>
                    </a>
                    <a href="#" className={`text-gray-400 hover:text-[${primaryColor}] transition-colors`}>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Added Call to Action section */}
            {/* Updated background gradient */}
            <div className={`bg-gradient-to-r from-[${primaryColor}] to-[${primaryColorDarker}] rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-lg mt-16 md:mt-20`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Ready to Explore Andaman?</h2>
                {/* Updated text color */}
                <p className={`text-[${primaryColorLightestBg}] mb-6 max-w-2xl mx-auto`}>
                  Contact our team today to start planning your dream vacation to the Andaman Islands.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Updated button styles */}
                  <Link href="/contact" className={ctaPrimaryOnDarkStyle}>
                    Contact Us
                  </Link>
                  <Link href="/packages" className={ctaPrimaryOnDarkStyle}>
                    View Packages <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}