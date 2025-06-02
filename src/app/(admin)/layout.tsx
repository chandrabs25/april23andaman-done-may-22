'use client';

import { ReactNode, useState, useEffect } from 'react'; // Added useEffect for potential client-side redirect
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeIcon, PackageIcon, CheckCircleIcon, UsersIcon, LogOutIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth'; // Added useAuth

interface AdminLayoutProps {
  children: ReactNode;
}

// Sidebar navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

// New SignOutButton client component - Updated to use useAuth
function SignOutButton() {
  const { logout: authLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout(); // This function from useAuth handles cookie clearing and redirection
      // toast.success('Signed out successfully!'); // useAuth might handle this or you can add it
    } catch (error) {
      // useAuth().logout should ideally handle its own errors and toasts
      // If not, or for additional logging:
      console.error('Sign out error from useAuth:', error);
      toast.error('Sign out failed. Please try again.');
    } finally {
      // setIsLoggingOut(false); // May not be reached if redirect is too fast
      // The component might unmount before this is set if redirection is immediate.
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

export default function AdminLayout({ children }: AdminLayoutProps) { // Removed async
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-3 text-lg">Loading Admin Panel...</p>
      </div>
    );
  }

  // This check runs after middleware.
  // Middleware should handle primary redirection for unauthenticated.
  // Middleware rewrites to /not-authorized for authenticated non-admins.
  // This client-side check is a safeguard.
  if (!isAuthenticated || user?.role_id !== 1) {
    // If we are on the client-side and this condition is met,
    // it implies middleware might not have run or some client-side routing bypassed it.
    // Or, the user's state changed post-load and pre-navigation.
    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/auth/signin');
      } else { // Authenticated but not admin
        router.replace('/not-authorized'); // Redirect to not-authorized page
      }
    }, [isAuthenticated, user, router]); // Dependencies for useEffect

    return (
       <div className="flex h-screen items-center justify-center bg-gray-100">
           <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
           <p className="ml-3 text-lg text-gray-600">Verifying credentials and redirecting...</p>
       </div>
    ); // Render minimal UI during redirect
  }

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
          {children}
        </main>
      </div>
    </div>
  );
} 