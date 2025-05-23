import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Hotel, CalendarCheck, LogOut } from 'lucide-react'; // Removed Menu, not implementing toggle for now
import { useVendorAuth } from '@/hooks/useVendorAuth';
import { toast } from '@/hooks/use-toast';

const VendorNav = () => {
    const { logout } = useVendorAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
        } catch (error) {
            console.error("Logout failed:", error);
            toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
        }
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/my-services', label: 'Services', icon: Package },
        { href: '/my-hotels', label: 'Hotels', icon: Hotel },
        { href: '/manage-bookings', label: 'Bookings', icon: CalendarCheck },
    ];

    return (
        <aside className="w-20 md:w-64 bg-gray-800 text-white h-screen fixed top-0 left-0 flex flex-col shadow-lg z-50 transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-700 flex items-center justify-center md:justify-start">
                <LayoutDashboard className="h-6 w-6 text-white md:hidden" /> 
                <h2 className="text-xl font-semibold hidden md:block ml-2">Vendor Panel</h2>
            </div>
            <nav className="flex-grow p-2 md:p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-center md:justify-start px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                        style={{ borderRadius: '0.5rem' }}
                        title={item.label}
                    >
                        <item.icon className="h-5 w-5 md:mr-3" />
                        <span className="hidden md:inline">{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-2 md:p-4 border-t border-gray-700 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-3 py-2  text-gray-300 bg-red-600 hover:bg-red-700 hover:text-white transition-colors duration-150"
                    title="Logout"
                    style={{ borderRadius: '0.5rem' }}
                >
                    <LogOut className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default VendorNav;

