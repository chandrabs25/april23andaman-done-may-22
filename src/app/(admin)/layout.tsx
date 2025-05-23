import { ReactNode } from 'react';
import Link from 'next/link';
import { HomeIcon, PackageIcon, CheckCircleIcon, UsersIcon, LogOutIcon } from 'lucide-react';

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
              <Link
                href="/api/auth/logout"
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-2 rounded-md transition-colors"
              >
                <LogOutIcon className="h-5 w-5" />
                <span>Sign Out</span>
              </Link>
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