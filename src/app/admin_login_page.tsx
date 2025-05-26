// Path: src/app/(admin)/admin_login/page.tsx
'use client';

import React, { useState } from 'react'; // Import React
// import Image from 'next/image'; // Removed as not used in admin version
// import Link from 'next/link'; // Removed as not used
import { UserCircle, Settings, Package, ShieldCheck, Loader2 } from 'lucide-react'; // Updated icons for admin

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Attempting admin login via API:", { email }); // Debug log

      // --- Call the actual API endpoint ---
      const response = await fetch('/api/admin/auth/login', { // Updated API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      interface ApiResponse {
        success: boolean;
        message?: string;
        user?: object;
      }

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data?.message || `Login failed with status: ${response.status}`;
        console.log("Admin login failed:", errorMessage); // Debug log
        throw new Error(errorMessage);
      }

      // --- Handle successful login ---
      console.log("Admin login successful (API):", data); // Debug log

      // Redirect to the admin dashboard
      window.location.href = '/admin_dashboard'; // Updated redirect path

    } catch (err) {
      console.error("Admin login error:", err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX remains largely the same ---
  return (
    <>
      <div className="flex min-h-screen" style={{ borderRadius: '0.5rem' }}>
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white" style={{ borderRadius: '0.5rem' }}>
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">Access the Admin Control Panel</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"> Email Address </label>
                <input
                  id="email" type="email" value={email} required autoComplete="email"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Password </label>
                  {/* Removed "Forgot password?" link for admin */}
                </div>
                <input
                  id="password" type="password" value={password} required autoComplete="current-password"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center" // Added flex utils
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Removed registration link section for admin */}
          </div>
        </div>

        {/* Right side - Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-12 xl:p-16 items-center justify-center"> {/* Updated style for Admin */}
           <div className="max-w-md text-center"> {/* Centered text */}
             <ShieldCheck className="h-16 w-16 text-blue-500 mx-auto mb-6" /> {/* Admin Icon */}
             <h2 className="text-3xl font-bold mb-4">Admin Control Panel</h2>
             <p className="text-lg text-gray-300 mb-8 opacity-90">
               Manage users, oversee platform settings, and ensure smooth operations.
             </p>
             <div className="space-y-4 text-left"> {/* Align items to start for list */}
               <div className="flex items-start">
                 <div className="bg-blue-500/20 p-2 rounded-full mr-3 flex-shrink-0"> <UserCircle className="h-5 w-5 text-blue-400" /> </div>
                 <div> <h3 className="font-semibold">User Management</h3> <p className="text-sm text-gray-400 opacity-80">Oversee all user accounts and roles.</p> </div>
               </div>
               <div className="flex items-start">
                 <div className="bg-blue-500/20 p-2 rounded-full mr-3 flex-shrink-0"> <Package className="h-5 w-5 text-blue-400" /> </div>
                 <div> <h3 className="font-semibold">Content Moderation</h3> <p className="text-sm text-gray-400 opacity-80">Review and manage platform content.</p> </div>
               </div>
               <div className="flex items-start">
                 <div className="bg-blue-500/20 p-2 rounded-full mr-3 flex-shrink-0"> <Settings className="h-5 w-5 text-blue-400" /> </div>
                 <div> <h3 className="font-semibold">System Settings</h3> <p className="text-sm text-gray-400 opacity-80">Configure and maintain platform parameters.</p> </div>
               </div>
             </div>
             <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-gray-400 opacity-80">
                 For administrative support, contact the technical team.
             </div>
           </div>
         </div>

      </div>
    </>
  );
}
