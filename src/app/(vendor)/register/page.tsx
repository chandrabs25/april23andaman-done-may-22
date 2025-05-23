// Path: .\src\app\vendor\register\page.tsx
'use client';

import React, { useState } from 'react'; // Import React
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Define interface for form data state
interface VendorFormData {
  businessName: string;
  firstName: string; // Added
  lastName: string; // Added
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessType: string; // Can refine with specific types later if needed
  address: string;
}

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState<VendorFormData>({ // Type the state
    businessName: '',
    firstName: '', // Added
    lastName: '', // Added
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: 'hotel', // Correct: Matches the value of the first <option>
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false); // State for terms checkbox
  const router = useRouter();

  // --- FIX: Add type annotation for event 'e' ---
  // Handle changes for input, textarea, and select elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  // --- End FIX ---
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Updates businessType when you select 'Activity Provider', etc.
    }));
    if (error) setError(''); // Clear error on input change
  };

  // Specific handler for checkbox
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAgreed(e.target.checked);
     if (error) setError(''); // Clear error on input change
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Type the submit event
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return; // Stop submission
    }
    if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return; // Stop submission
    }
    if (!termsAgreed) {
        setError('You must agree to the Terms and Conditions to register.');
        return; // Stop submission
    }
    // Add validation for firstName and lastName if needed
    if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required.');
        return;
    }

    setLoading(true); // Set loading state

    try {
      // Actual API call
      console.log('Submitting Vendor Registration:', formData);
      const response = await fetch('/api/vendor/register', { // Example endpoint
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            // Send all necessary fields from formData
            email: formData.email,
            password: formData.password, // Hashing happens server-side
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            businessName: formData.businessName,
            businessType: formData.businessType,
            address: formData.address,
         })
      });

      // Check if the request was successful
      if (!response.ok) {
        // Try to parse the error message from the response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (typeof errorData === 'object' && errorData !== null && 'message' in errorData && typeof (errorData as any).message === 'string') {
            errorMessage = (errorData as { message: string }).message || errorMessage; // Use message from API if available
          }
        } catch (jsonError) {
          // If parsing JSON fails, use the default HTTP error message
          console.error("Failed to parse error JSON:", jsonError);
        }
        throw new Error(errorMessage); // Throw an error to be caught below
      }

      // Handle successful response (optional: parse success message)
      // const result = await response.json();
      // console.log("Vendor registration successful:", result); // Debug log

      console.log("Vendor registration API call successful."); // Debug log
      setSuccess(true); // Show success message

      // Redirect after a delay
      setTimeout(() => {
        router.push('/login'); // FIX: Changed redirect URL to /login
      }, 3000);

    } catch (err) {
      console.error('Vendor registration error:', err);
      // Set the error state with the message from the caught error
      setError(err instanceof Error ? err.message : 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  // Success Message Component
  if (success) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
           <div className="mb-4"> {/* Checkmark Icon or similar */} </div>
           <h2 className="text-xl font-bold text-green-600 mb-2">Registration Submitted!</h2>
           <p className="text-gray-600 mb-4">Your application has been received. We will review it and get back to you soon. Redirecting to login...</p>
           <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" /> {/* Loading spinner */}
        </div>
      </div>
    );
  }

  // Registration Form Component
  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Register as a Vendor</h1>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Fields */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div> <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1"> Business Name </label> <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
                 {/* Changed Owner Name to First Name and Last Name */}
                 <div> <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1"> Owner's First Name </label> <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div> <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1"> Owner's Last Name </label> <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
                 <div> <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"> Email Address </label> <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@company.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div> <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1"> Phone Number </label> <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
                 <div> <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1"> Password </label> <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div> <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1"> Confirm Password </label> <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
                 <div> <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1"> Business Type </label> <select id="businessType" name="businessType" value={formData.businessType} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">  <option value="hotel">Hotel / Resort</option> <option value="activity_provider">Activity Provider</option> <option value="transport">Transportation Service</option> <option value="rental">Rental Service</option>  </select> </div>
               </div>
               <div> <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1"> Business Address </label> <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
              {/* Terms Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAgreed}
                  onChange={handleTermsChange} // Use specific handler
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">Privacy Policy</Link> for vendors.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Submitting Registration...
                    </>
                ) : (
                  'Register as Vendor'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have a vendor account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in Here
                </Link>
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}