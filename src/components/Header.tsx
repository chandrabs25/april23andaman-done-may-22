"use client"; // <-- Add this directive at the top

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import {
  Menu,
  X,
  User,
  ShoppingCart,
  LogOut,
  ChevronDown,
  MapPin,
  Package,
  Camera,
  Home,
  Info,
  Phone,
  Heart,
  Bell,
  Mail,
  LucideProps,
  Hotel
} from 'lucide-react';

// --- Interfaces ---
interface Destination {
  id: number; // Use ID for linking
  name: string;
}

interface Activity {
  id: number; // Use ID for linking
  name: string;
}

interface PackageData {
  id: number; // Use ID for linking
  name: string;
}

interface GetPackagesApiResponse {
  packages: PackageData[];
  pagination?: any;
  success?: boolean;
  message?: string;
}
// --- End Interfaces ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, logout } = useAuth();


  const [mobileDropdowns, setMobileDropdowns] = useState({
    destinations: false,
    activities: false,
    packages: false
  });
  const primaryColor = '#147192';
  const primaryColorDarker = '#0f5a7a';
  const primaryColorLighter = '#67a7c5';
  const primaryColorLightestBg = '#e8f1f5';
  const primaryColorLightBg = '#cfe3ec';

  // --- Handle scroll effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Fetch Data ---
  const { data: destinationsResponse } = useFetch<Destination[]>('/api/destinations');
  const destinationsData = destinationsResponse || [];
  const { data: activitiesResponse } = useFetch<Activity[]>('/api/activities');
  const activitiesData = activitiesResponse || [];
  const { data: packagesApiResponse } = useFetch<GetPackagesApiResponse>('/api/packages');
  const packagesData = packagesApiResponse?.packages || [];

  // --- Helper Functions ---
  // Removed generateSlug function
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    // setMobileDropdowns({ destinations: false, activities: false, packages: false }); // Removed this line
  };
  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // --- Nav Links Data ---
  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={16} /> },
    { name: 'Services', href: '/services', icon: <Home size={16} /> },
    { name: 'Hotels', href: '/hotels', icon: <Hotel size={16} /> },
    { name: 'About', href: '/about', icon: <Info size={16} /> },
    { name: 'Contact', href: '/contact', icon: <Phone size={16} /> },
  ];

  // --- Common Styles (Reverted to original definitions from initial Header code) ---
  const activeNavLinkStyle = `text-[${primaryColor}] font-medium relative after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[3px] after:bg-[${primaryColor}] after:rounded-t-full`;
  const inactiveNavLinkStyle = `text-gray-700 hover:text-[${primaryColor}] font-medium transition-colors duration-300`;
  const dropdownItemStyle = `block px-4 py-2 text-sm text-gray-700 hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}] rounded-lg transition-all duration-200`;
  const mobileNavItemStyle = "flex items-center w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200";
  const buttonPrimaryStyle = `text-sm font-medium bg-[${primaryColor}] hover:bg-[${primaryColorDarker}] text-black px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-black`; // Reverted: text-black, border-black
  const buttonSecondaryStyle = `text-sm font-medium text-[${primaryColor}] hover:text-[${primaryColorDarker}] px-4 py-2 rounded-full hover:bg-[${primaryColorLightestBg}] transition-colors duration-300 border border-[${primaryColorLighter}] hover:border-[${primaryColor}]`; // Reverted
  const iconHoverStyle = `text-gray-600 hover:text-[${primaryColor}] p-1.5 hover:bg-[${primaryColorLightestBg}] rounded-full transition-all duration-300 flex items-center justify-center`;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      
      

      {/* Main Header */}
      <div className="container mx-auto px-4 py-1.5">
        <div className="flex justify-between items-center">
          {/* Logo (Reverted to original src) */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block align-middle" onClick={closeMenu}>
              <div className="relative h-8 w-auto">
                <Image
                  src="/images/logoresized.webp" // Reverted src
                  alt="Reach Andaman Logo"
                  height={32}
                  width={0}
                  className="object-contain w-auto h-full"
                  priority
                  sizes="(max-width: 768px) 100px, 120px"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-sm ${pathname === "/" ? activeNavLinkStyle : inactiveNavLinkStyle}`}>Home</Link>

            {/* Destinations Dropdown */}
            <div className="relative group">
              <Link href="/destinations" className={`text-sm flex items-center group ${pathname.startsWith("/destinations") ? activeNavLinkStyle : inactiveNavLinkStyle}`}>
                <span className="flex items-center">Destinations<ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform duration-300" /></span>
              </Link>
              <div className="absolute left-0 mt-3 w-60 rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="p-1.5">
                  <div className="flex items-center px-3 py-1.5 border-b border-gray-100 mb-1"><MapPin size={15} className={`text-[${primaryColor}] mr-2`} /><span className="font-medium text-gray-800 text-sm">Popular Destinations</span></div>
                  {destinationsData.length > 0 ? destinationsData.slice(0, 5).map((dest) => (
                    <Link key={dest.id} href={`/destinations/${dest.id}`} className={dropdownItemStyle}>{dest.name}</Link>
                  )) : <div className="px-3 py-2 text-xs text-gray-400 flex items-center"><div className={`h-3 w-3 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin mr-2`}></div>Loading...</div>}
                  <Link href="/destinations" className={`block px-3 py-2 mt-1 text-xs font-medium text-[${primaryColor}] hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}] rounded-lg border-t border-gray-100 transition-all duration-200`}>View All <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></Link>
                </div>
              </div>
            </div>

            {/* Packages Dropdown */}
            <div className="relative group">
              <Link href="/packages" className={`text-sm flex items-center group ${pathname.startsWith("/packages") ? activeNavLinkStyle : inactiveNavLinkStyle}`}>
                <span className="flex items-center">Packages<ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform duration-300" /></span>
              </Link>
              <div className="absolute left-0 mt-3 w-60 rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="p-1.5">
                  <div className="flex items-center px-3 py-1.5 border-b border-gray-100 mb-1"><Package size={15} className={`text-[${primaryColor}] mr-2`} /><span className="font-medium text-gray-800 text-sm">Featured Packages</span></div>
                  {packagesData.length > 0 ? packagesData.slice(0, 5).map((pkg) => (
                    <Link key={pkg.id} href={`/packages/${pkg.id}`} className={dropdownItemStyle}>{pkg.name}</Link>
                  )) : <div className="px-3 py-2 text-xs text-gray-400 flex items-center"><div className={`h-3 w-3 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin mr-2`}></div>Loading...</div>}
                  <Link href="/packages" className={`block px-3 py-2 mt-1 text-xs font-medium text-[${primaryColor}] hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}] rounded-lg border-t border-gray-100 transition-all duration-200`}>View All <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></Link>
                </div>
              </div>
            </div>

            {/* Activities Dropdown */}
            <div className="relative group">
              <Link href="/activities" className={`text-sm flex items-center group ${pathname.startsWith("/activities") ? activeNavLinkStyle : inactiveNavLinkStyle}`}>
                <span className="flex items-center">Activities<ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform duration-300" /></span>
              </Link>
              <div className="absolute left-0 mt-3 w-60 rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="p-1.5">
                  <div className="flex items-center px-3 py-1.5 border-b border-gray-100 mb-1"><Camera size={15} className={`text-[${primaryColor}] mr-2`} /><span className="font-medium text-gray-800 text-sm">Popular Activities</span></div>
                  {activitiesData.length > 0 ? activitiesData.slice(0, 5).map((act) => (
                    <Link key={act.id} href={`/activities/${act.id}`} className={dropdownItemStyle}>{act.name}</Link>
                  )) : <div className="px-3 py-2 text-xs text-gray-400 flex items-center"><div className={`h-3 w-3 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin mr-2`}></div>Loading...</div>}
                  <Link href="/activities" className={`block px-3 py-2 mt-1 text-xs font-medium text-[${primaryColor}] hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}] rounded-lg border-t border-gray-100 transition-all duration-200`}>View All <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></Link>
                </div>
              </div>
            </div>

            {/* Other Links */}
            {navLinks.filter(link => link.name !== 'Home').map((link) => (<Link key={link.name} href={link.href} className={`text-sm ${pathname === link.href ? activeNavLinkStyle : inactiveNavLinkStyle}`}>{link.name}</Link>))}
          </nav>

          {/* User Actions & Mobile Toggle */}
          <div className="flex items-center space-x-2">
            <Link href="/wishlist" className={`hidden sm:flex relative ${iconHoverStyle}`} aria-label="Wishlist">
              <Heart size={18} />
              <span className={`absolute -top-0.5 -right-0.5 bg-[${primaryColor}] text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center`}>0</span>
            </Link>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoading ? <div className={`h-4 w-4 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin`}></div> : isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  {user?.role_id === 3 && <Link href="/vendor/dashboard" className={`text-xs text-gray-600 hover:text-[${primaryColor}] transition-colors`}>Vendor</Link>}
                  <div className="relative group">
                    <button className={iconHoverStyle} title="My Account"><User size={18} /><span className="sr-only">Profile</span></button>
                    <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right -translate-y-2 group-hover:translate-y-0">
                      <div className="p-1.5">
                        <div className="px-3 py-1.5 border-b border-gray-100 mb-1"><p className="font-medium text-gray-800 text-sm">Hi, {user?.first_name || 'User'}</p><p className="text-xs text-gray-500 truncate">{user?.email}</p></div>
                        <Link href="/user/dashboard" className={dropdownItemStyle}>Dashboard</Link>
                        <Link href="/user/bookings" className={dropdownItemStyle}>Bookings</Link>
                        <Link href="/user/profile" className={dropdownItemStyle}>Settings</Link>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mt-1 border-t border-gray-100 transition-all duration-200 flex items-center"><LogOut size={13} className="mr-1.5" />Logout</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Using reverted button styles */}
                  <Link href="/auth/signup" className={buttonSecondaryStyle}>Sign Up</Link>
                  <Link href="/auth/signin" className={buttonPrimaryStyle}>Sign In</Link>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden"><button onClick={toggleMenu} className={iconHoverStyle} aria-label="Toggle menu">{isMenuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-out" onClick={closeMenu}>
            <div
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm h-screen bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out transform translate-x-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 pt-6">
                <button onClick={closeMenu} className={`absolute top-4 right-4 ${iconHoverStyle}`} aria-label="Close menu"><X size={24} /></button>

                {/* User Info / Auth Links */}
                {isLoading ? <div className="flex justify-center py-4"><div className={`h-6 w-6 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin`}></div></div> : isAuthenticated ? (
                  <div className={`mb-6 p-4 bg-[${primaryColorLightestBg}] rounded-2xl`}>
                    <div className="flex items-center mb-3">
                      <div className={`w-12 h-12 bg-[${primaryColorLightBg}] rounded-full flex items-center justify-center mr-3`}><User className={`text-[${primaryColor}]`} size={24} /></div>
                      <div><p className="font-medium text-gray-800">{user?.first_name || 'User'}</p><p className="text-xs text-gray-500">{user?.email}</p></div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href="/user/dashboard" className={`flex-1 text-center text-xs bg-white text-[${primaryColor}] px-3 py-2 rounded-lg border border-[${primaryColorLighter}] hover:bg-gray-50`} onClick={closeMenu}>Dashboard</Link>
                      <button onClick={handleLogout} className="flex-1 text-center text-xs bg-white text-red-600 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50">Logout</button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 mt-8 flex flex-col space-y-3">
                    {/* Using reverted button styles */}
                    <Link href="/auth/signin" className={`w-full text-center ${buttonPrimaryStyle} px-5 py-2.5`} onClick={closeMenu}>Sign In</Link>
                    <Link href="/auth/signup" className={`w-full text-center ${buttonSecondaryStyle} px-5 py-2.5`} onClick={closeMenu}>Sign Up</Link>
                  </div>
                )}

                {/* Mobile Nav Links */}
                <nav className="space-y-2">
                  <Link href="/" className={`${mobileNavItemStyle} ${pathname === "/" ? `bg-[${primaryColorLightestBg}] text-[${primaryColorDarker}]` : 'text-gray-700 hover:bg-gray-100'}`} onClick={closeMenu}>
                    <Home size={18} className={`mr-3 ${pathname === "/" ? `text-[${primaryColor}]` : 'text-gray-500'}`} />Home
                  </Link>

                  {/* Destinations Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileDropdowns(prev => ({ ...prev, destinations: !prev.destinations, activities: false, packages: false }))}
                      className={`${mobileNavItemStyle} justify-between ${pathname.startsWith("/destinations") || mobileDropdowns.destinations ? `bg-[${primaryColorLightestBg}] text-[${primaryColorDarker}]` : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <span className="flex items-center"><MapPin size={18} className={`mr-3 ${pathname.startsWith("/destinations") || mobileDropdowns.destinations ? `text-[${primaryColor}]` : 'text-gray-500'}`} />Destinations</span>
                      <ChevronDown size={18} className={`transition-transform duration-300 ${mobileDropdowns.destinations ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDropdowns.destinations && <div className={`pl-10 pr-4 py-2 space-y-1 border-l-2 border-[${primaryColorLightBg}] ml-4`}>
                      <Link href="/destinations" className={`block py-2 px-3 rounded-lg text-sm font-medium text-[${primaryColor}] hover:bg-[${primaryColorLightestBg}]`} onClick={closeMenu}>All Destinations</Link>
                      {destinationsData.length > 0 ? destinationsData.slice(0, 5).map((dest) => (
                        <Link key={dest.id} href={`/destinations/${dest.id}`} className={`block py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}]`} onClick={closeMenu}>{dest.name}</Link>
                      )) : <div className="py-2 px-3 text-sm text-gray-400 flex items-center"><div className={`h-3 w-3 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin mr-2`}></div>Loading...</div>}
                    </div>}
                  </div>

                  {/* Packages Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileDropdowns(prev => ({ ...prev, packages: !prev.packages, destinations: false, activities: false }))}
                      className={`${mobileNavItemStyle} justify-between ${pathname.startsWith("/packages") || mobileDropdowns.packages ? `bg-[${primaryColorLightestBg}] text-[${primaryColorDarker}]` : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <span className="flex items-center"><Package size={18} className={`mr-3 ${pathname.startsWith("/packages") || mobileDropdowns.packages ? `text-[${primaryColor}]` : 'text-gray-500'}`} />Packages</span>
                      <ChevronDown size={18} className={`transition-transform duration-300 ${mobileDropdowns.packages ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDropdowns.packages && <div className={`pl-10 pr-4 py-2 space-y-1 border-l-2 border-[${primaryColorLightBg}] ml-4`}>
                      <Link href="/packages" className={`block py-2 px-3 rounded-lg text-sm font-medium text-[${primaryColor}] hover:bg-[${primaryColorLightestBg}]`} onClick={closeMenu}>All Packages</Link>
                      {packagesData.length > 0 ? packagesData.slice(0, 5).map((pkg) => (
                        <Link key={pkg.id} href={`/packages/${pkg.id}`} className={`block py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}]`} onClick={closeMenu}>{pkg.name}</Link>
                      )) : <div className="py-2 px-3 text-sm text-gray-400 flex items-center"><div className={`h-3 w-3 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin mr-2`}></div>Loading...</div>}
                    </div>}
                  </div>

                  {/* Activities Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileDropdowns(prev => ({ ...prev, activities: !prev.activities, destinations: false, packages: false }))}
                      className={`${mobileNavItemStyle} justify-between ${pathname.startsWith("/activities") || mobileDropdowns.activities ? `bg-[${primaryColorLightestBg}] text-[${primaryColorDarker}]` : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <span className="flex items-center"><Camera size={18} className={`mr-3 ${pathname.startsWith("/activities") || mobileDropdowns.activities ? `text-[${primaryColor}]` : 'text-gray-500'}`} />Activities</span>
                      <ChevronDown size={18} className={`transition-transform duration-300 ${mobileDropdowns.activities ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDropdowns.activities && <div className={`pl-10 pr-4 py-2 space-y-1 border-l-2 border-[${primaryColorLightBg}] ml-4`}>
                      <Link href="/activities" className={`block py-2 px-3 rounded-lg text-sm font-medium text-[${primaryColor}] hover:bg-[${primaryColorLightestBg}]`} onClick={closeMenu}>All Activities</Link>
                      {activitiesData.length > 0 ? activitiesData.slice(0, 5).map((act) => (
                        <Link key={act.id} href={`/activities/${act.id}`} className={`block py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-[${primaryColorLightestBg}] hover:text-[${primaryColorDarker}]`} onClick={closeMenu}>{act.name}</Link>
                      )) : <div className="py-2 px-3 text-sm text-gray-400 flex items-center"><div className={`h-3 w-3 rounded-full border-2 border-[${primaryColor}] border-t-transparent animate-spin mr-2`}></div>Loading...</div>}
                    </div>}
                  </div>

                  {/* Other Links */}
                  {navLinks.filter(link => link.name !== 'Home').map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`${mobileNavItemStyle} ${pathname === link.href ? `bg-[${primaryColorLightestBg}] text-[${primaryColorDarker}]` : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={closeMenu}
                    >
                      {link.icon && React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, {
                        className: `mr-3 ${pathname === link.href ? `text-[${primaryColor}]` : 'text-gray-500'}`
                      })}
                      {link.name}
                    </Link>
                  ))}
                  <Link href="/wishlist" className={`${mobileNavItemStyle} text-gray-700 hover:bg-gray-100`} onClick={closeMenu}>
                    <Heart size={18} className="mr-3 text-gray-500" />Wishlist
                  </Link>
                </nav>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                  {/* Using original contact details */}
                  <p className="flex items-center mb-2"><Phone size={14} className={`mr-2 text-[${primaryColor}]`} />+91 123-456-7890</p>
                  <p className="flex items-center"><Mail size={14} className={`mr-2 text-[${primaryColor}]`} />info@reachandaman.com</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;