'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { AdminAuthProvider } from '@/hooks/useAdminAuth'; // Corrected: Single import
import '@/styles/admin_globals.css'; // Import admin global styles
import { useRouter } from 'next/navigation';
import { HomeIcon, PackageIcon, CheckCircleIcon, UsersIcon, LogOutIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Authentication is now handled by middleware or individual page components
// using our custom JWT-based auth system from src/lib/auth.ts

interface AdminLayoutProps {
  children: ReactNode;
}

// Sidebar navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

// Type for the logout API response
interface LogoutApiResponse {
  success: boolean;
  message?: string;
}

// New SignOutButton client component
function SignOutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json() as LogoutApiResponse;

      if (response.ok && data.success) {
        toast.success(data.message || 'Signed out successfully!');
        // For JWT, client-side redirection is enough after cookie is cleared by API
        window.location.assign('/admin_login_page'); // Updated redirect for admin
      } else {
        toast.error(data.message || 'Sign out failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An unexpected error occurred during sign out.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="flex w-full items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-2 rounded-md transition-colors disabled:opacity-70"
    >
      {isLoggingOut ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <LogOutIcon className="h-5 w-5" />
      )}
      <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Authentication check is now handled at the API level or in middleware
  // Admin check: role_id === 1

  // Navigation items for the sidebar
  const navItems: NavItem[] = [
    {
      href: '/admin_dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="h-5 w-5" />
    },
    {
      href: '/admin_packages',
      label: 'Packages',
      icon: <PackageIcon className="h-5 w-5" />
    },
    {
      href: '/admin_approvals',
      label: 'Approvals',
      icon: <CheckCircleIcon className="h-5 w-5" />
    },
    {
      href: '/admin_users',
      label: 'Users',
      icon: <UsersIcon className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="px-4 py-2">
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-2 rounded-md transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="px-4 py-2 mt-8">
              <SignOutButton />
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <AdminAuthProvider>{children}</AdminAuthProvider> {/* Wrapped children */}
        </main>
      </div>
    </div>
  );
} 