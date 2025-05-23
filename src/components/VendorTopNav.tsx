'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Package, Hotel, CalendarCheck, UserCircle, LogOut, ChevronDown, Briefcase, Star, User as UserIcon } from 'lucide-react';
import { useVendorAuth } from '@/hooks/useVendorAuth'; // Assuming this hook provides user and logout
import { toast } from '@/hooks/use-toast';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[]; // For dropdowns
  requiresAuth?: boolean;
  isPageSpecific?: boolean; // To differentiate from main nav items if needed
}

const VendorTopNav = () => {
  const { user, logout: vendorLogout, isAuthenticated } = useVendorAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await vendorLogout();
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login'); // Redirect to vendor login, assuming it's at /login within the vendor group
    } catch (error) {
      console.error('Logout failed:', error);
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log you out. Please try again.' });
    }
  };

  // Define navigation structure
  // Main items from old VendorNav + sub-items from dashboard page
  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      children: [
        { href: '/dashboard?tab=overview', label: 'Overview', icon: Briefcase, isPageSpecific: true }, // Assuming query params for tabs
        { href: '/dashboard?tab=profile', label: 'Profile', icon: UserIcon, isPageSpecific: true },
        { href: '/dashboard?tab=reviews', label: 'Reviews', icon: Star, isPageSpecific: true },
      ],
    },
    { href: '/my-services', label: 'Services', icon: Package },
    { href: '/my-hotels', label: 'Hotels', icon: Hotel }, // Consider conditional display based on vendor type if possible
    { href: '/manage-bookings', label: 'Bookings', icon: CalendarCheck },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const renderNavItem = (item: NavItem, isMobile: boolean) => {
    const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href || pathname.startsWith(child.href.split('?')[0] + '?tab=')));

    if (item.children) {
      return (
        <div className="relative" key={item.label}>
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`flex items-center px-3 py-2  text-sm font-medium ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors duration-150 w-full text-left md:w-auto`}
            style={{ borderRadius: '0.5rem' }}
          >
            <item.icon className={`h-5 w-5 mr-2 ${isMobile ? '' : 'md:mr-2'}`} />
            {item.label}
            <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform duration-150 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === item.label && (
            <div className={`${isMobile ? 'pl-4 static' : 'absolute left-0 mt-2 w-48  shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50'}`} style={{ borderRadius: '0.5rem' }}>
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => { if(isMobile) setIsMobileMenuOpen(false); setOpenDropdown(null); }}
                    className={`flex items-center px-4 py-2 text-sm ${pathname === child.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}  m-1`}
                    style={{ borderRadius: '0.5rem' }}
                    role="menuitem"
                  >
                    <child.icon className="h-4 w-4 mr-2" />
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => { if(isMobile) setIsMobileMenuOpen(false); setOpenDropdown(null); }}
        className={`flex items-center px-3 py-2 text-sm font-medium ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} transition-colors duration-150`}
        style={{ borderRadius: '0.5rem' }}
      >
        <item.icon className={`h-5 w-5 mr-2 ${isMobile ? '' : 'md:mr-2'}`} />
        {item.label}
      </Link>
    );
  };

  // Don't render nav if on login/register page (handled by VendorLayoutContent)
  // This component will be conditionally rendered by VendorLayoutContent

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 text-white text-xl font-semibold">
              Vendor Panel
            </Link>
            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => renderNavItem(item, false))}
              </div>
            </div>
          </div>

          {/* User actions - Hidden on mobile initially */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated && user && (
                <span className="text-gray-300 text-sm mr-3">Hi, {user.first_name || user.email}</span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm font-medium transition-colors duration-150"
                style={{ borderRadius: '0.5rem' }}
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              style={{ borderRadius: '0.5rem' }}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => renderNavItem(item, true))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isAuthenticated && user && (
                <div className="flex items-center px-5 mb-3">
                    <UserCircle className="h-8 w-8 text-gray-400 mr-2" />
                    <div>
                        <div className="text-base font-medium leading-none text-white">{user.first_name || 'Vendor'}</div>
                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                    </div>
                </div>
            )}
            <div className="px-2 space-y-1">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start bg-red-600 hover:bg-red-700 text-white px-3 py-2  text-base font-medium transition-colors duration-150"
                    style={{ borderRadius: '0.5rem' }}
              >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default VendorTopNav;

