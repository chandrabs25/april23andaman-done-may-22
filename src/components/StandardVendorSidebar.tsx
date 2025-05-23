"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Hotel, Calendar, Star, User as UserIconLucide, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface StandardVendorSidebarProps {
  isHotelVendor: boolean;
  isVerified: boolean;
  // Add other props if needed, e.g., businessName
}

const StandardVendorSidebar: React.FC<StandardVendorSidebarProps> = ({ isHotelVendor, isVerified }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout } = useAuth(); // Assuming useAuth provides the basic user and logout

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/vendor/login'); // Redirect to vendor login
    } catch (error) {
      console.error("Logout failed:", error);
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
    }
  };

  const sidebarNavItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: Home,
      href: '/vendor/dashboard',
      show: true,
    },
    {
      id: 'services',
      label: isHotelVendor ? 'Manage Hotels' : 'Manage Services',
      icon: isHotelVendor ? Hotel : Package,
      href: isHotelVendor ? '/vendor/hotels' : '/vendor/services',
      show: isVerified, // Only show if verified, as per dashboard logic
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      href: '/vendor/manage-bookings',
      show: isVerified, // Only show if verified
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      href: '/vendor/reviews',
      show: isVerified, // Only show if verified
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserIconLucide,
      href: '/vendor/profile',
      show: true, // Always show profile link
    },
  ];

  return (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col h-screen fixed top-0 left-0">
      <div className="mb-8">
        {/* Placeholder for Logo or Business Name, can be passed as prop or fetched */}
        <Link href="/vendor/dashboard" className="flex items-center space-x-2">
          <Briefcase size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Vendor Panel</h1>
        </Link>
        {authUser?.email && <p className="text-xs text-gray-500 mt-1 truncate">{authUser.email}</p>}
      </div>

      <nav className="flex-grow">
        {sidebarNavItems.filter(item => item.show).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${ 
              pathname === item.href || (item.href !== '/vendor/dashboard' && pathname.startsWith(item.href)) // More robust active check
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StandardVendorSidebar;

