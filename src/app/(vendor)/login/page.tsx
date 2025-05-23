// Path: .\src\app\vendor\login\page.tsx
'use client';

import React, { useState } from 'react'; // Import React
import Image from 'next/image'; // Keep if used in the right-side info potentially
import Link from 'next/link';
import { Briefcase, Calendar, Clock, User, MapPin, Phone, Mail, Shield, Loader2 } from 'lucide-react'; // Added Loader2

export default function VendorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Attempting vendor login via API:", { email }); // Debug log

      // --- Call the actual API endpoint ---
      const response = await fetch('/api/vendor/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        // No 'credentials: include' needed here as we are not reading cookies,
        // the browser will automatically send cookies set by the server on subsequent requests.
      });

      // --- FIX: Define expected API response structure ---
      interface ApiResponse {
        success: boolean; // Expect success boolean
        message?: string;
        user?: object; // User object is optional in response now
        // No token expected in body anymore
      }

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) { // Check both response status and success flag
        // Use the message from the API response if available, otherwise provide a default
        const errorMessage = data?.message || `Login failed with status: ${response.status}`;
        console.log("Vendor login failed:", errorMessage); // Debug log
        throw new Error(errorMessage);
      }

      // --- Handle successful login ---
      console.log("Vendor login successful (API):", data); // Debug log

      // --- REMOVED localStorage handling ---
      // No need to store token manually, HttpOnly cookie is set by the server.
      // if (data.token) {
      //   localStorage.setItem('vendorAuthToken', data.token); // Example: using localStorage
      //   // Optionally store user info as well
      //   if (data.user) {
      //       localStorage.setItem('vendorUserInfo', JSON.stringify(data.user));
      //   }
      // } else {
      //     console.warn("No token received in successful login response.");
      // }
      // --- End REMOVED localStorage handling ---


      // Redirect to the vendor dashboard
      // Use Next.js router if available, otherwise fallback to window.location
      // Note: Using window.location.href forces a full page reload, which helps ensure
      // the new cookie state is picked up correctly by subsequent requests like /api/auth/me.
      // --- FIX: Redirect to /dashboard, not /vendor/dashboard ---
      window.location.href = '/dashboard';

    } catch (err) {
      console.error("Vendor login error:", err); // Debug log
      // Set the error state with the message from the caught error
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
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white" style={{ borderRadius: '0.5rem' }}> {/* Added bg-white */}
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Login</h1>
              <p className="text-gray-600">Access your vendor dashboard</p>
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
                  {/* Consider implementing password reset */}
                  {/* <Link href="/vendor/forgot-password" className="text-sm text-blue-600 hover:text-blue-800"> Forgot password? </Link> */}
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

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have a vendor account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 xl:p-16 items-center justify-center"> {/* Updated style */}
           <div className="max-w-md">
             <h2 className="text-3xl font-bold mb-6">Vendor Portal</h2>
             <p className="text-lg text-blue-100 mb-8 opacity-90"> Join our network of service providers and grow your business in the beautiful Andaman Islands. </p>
             <div className="space-y-5">
               <div className="flex items-start"> <div className="bg-white/20 p-2 rounded-full mr-4 flex-shrink-0"> <Briefcase className="h-5 w-5" /> </div> <div> <h3 className="font-semibold">Manage Services</h3> <p className="text-sm text-blue-200 opacity-80">Easily add, update, and showcase your offerings.</p> </div> </div>
               <div className="flex items-start"> <div className="bg-white/20 p-2 rounded-full mr-4 flex-shrink-0"> <Calendar className="h-5 w-5" /> </div> <div> <h3 className="font-semibold">Track Bookings</h3> <p className="text-sm text-blue-200 opacity-80">View and manage customer bookings in real-time.</p> </div> </div>
               <div className="flex items-start"> <div className="bg-white/20 p-2 rounded-full mr-4 flex-shrink-0"> <User className="h-5 w-5" /> </div> <div> <h3 className="font-semibold">Grow Your Reach</h3> <p className="text-sm text-blue-200 opacity-80">Connect with travelers looking for Andaman experiences.</p> </div> </div>
             </div>
             <div className="mt-10 border-t border-blue-500/50 pt-6 text-sm text-blue-200 opacity-80">
                 Need Help? Contact us at <a href="mailto:vendors@reachandaman.com" className="font-medium hover:underline">vendors@reachandaman.com</a>
             </div>
           </div>
         </div>

      </div>
    </>
  );
}