// src/hooks/useVendorAuth.tsx
"use client"; // <-- MUST be at the top

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

// Define the User interface based on your API/DB schema
interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  role_id?: number; // Match your DB schema
  providerId?: number; // Vendor-specific field
  businessName?: string; // Vendor-specific field
}

// Define API response structures (adjust based on your actual API)
interface ApiResponseBase {
    success: boolean;
    message?: string;
}
interface MeApiResponse extends ApiResponseBase {
    data: User | null; // User data or null
}
interface LoginApiResponse extends ApiResponseBase {
    data: User | null; // User data or null
}
interface RegisterApiResponse extends ApiResponseBase {
   data?: { id: number | string };
}

// Define the shape of the context value
interface VendorAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

// Create the context
const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

// VendorAuthProvider Component
export const VendorAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial check
  const router = useRouter();

  // Function to check auth status (e.g., on page load/refresh)
  const checkAuthState = useCallback(async () => {
    try {
      console.log("Checking vendor auth state via /api/vendor/auth/me...");
      // Fetch user profile from API based session cookie
      const response = await fetch('/api/vendor/auth/me', { // Vendor-specific endpoint
         method: 'GET',
         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
         credentials: 'include', // Important to send cookies
      });

      const data: MeApiResponse = await response.json();

      if (response.ok && data.success && data.data) {
        console.log("Vendor auth check successful, user found:", data.data);
        setUser(data.data); // Ensure structure matches User interface
      } else {
        console.log("Vendor auth check failed or no user session found.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking vendor auth state:", error);
      setUser(null); // Ensure user is null on error
    } finally {
      setIsLoading(false); // Stop loading once check is complete
    }
  }, []); // Dependencies: empty means it runs once on mount and refs don't change

  // Run the check on initial mount
  useEffect(() => {
    setIsLoading(true); // Set loading true for the *initial* check
    checkAuthState();
  }, [checkAuthState]); // Depend on the memoized checkAuthState

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting vendor login with:", email);
      const response = await fetch('/api/vendor/auth/login', { // Vendor-specific endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for setting cookies
      });

      const data: LoginApiResponse = await response.json();

      if (response.ok && data.success && data.data) {
         console.log("Vendor login successful:", data.data);
         setUser(data.data);
         setIsLoading(false);
         return true; // Indicate success
      } else {
         console.error("Vendor login API failed:", data.message);
         setUser(null); // Clear user on failed login
         setIsLoading(false);
         return false; // Indicate failure
      }
    } catch (error) {
       console.error("Vendor login fetch error:", error);
       setUser(null);
       setIsLoading(false);
       return false; // Indicate failure
    }
  }, []); // Dependencies

  // Register function
  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
     setIsLoading(true);
     try {
        console.log("Attempting vendor registration for:", email);
        const response = await fetch('/api/vendor/register', { // Vendor-specific endpoint
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ name, email, password }),
        });

        const data: RegisterApiResponse = await response.json();

        if (response.ok && data.success) {
           console.log("Vendor registration successful", data.message);
           setIsLoading(false);
           return { success: true, message: data.message || "Registration successful!" };
        } else {
           console.error("Vendor registration API failed:", data.message);
           setIsLoading(false);
           return { success: false, message: data.message || "Registration failed." };
        }
     } catch (error) {
        console.error("Vendor registration fetch error:", error);
        setIsLoading(false);
        return { success: false, message: "An unexpected error occurred." };
     }
  }, []); // Dependencies

  // Logout function
  const logout = useCallback(async () => {
     try {
        console.log("Logging out vendor...");
        await fetch('/api/vendor/auth/logout', { // Vendor-specific endpoint
          method: 'POST',
          credentials: 'include' // Send cookies to invalidate session server-side
        });
     } catch (error) {
        console.error("Vendor logout API call failed:", error);
     } finally {
        setUser(null); // Clear user state immediately
        console.log("Redirecting to vendor login page after logout.");
        router.push('/login'); // Redirect to vendor login page
     }
  }, [router]); // Add router dependency

  const contextValue: VendorAuthContextType = {
    user,
    isAuthenticated: !!user, // Boolean conversion
    isLoading,
    login,
    register,
    logout,
    checkAuthState,
  };

  // Provide the context value to children components
  return (
    <VendorAuthContext.Provider value={contextValue}>
      {children}
    </VendorAuthContext.Provider>
  );
}; // End of VendorAuthProvider

// Custom hook to use the VendorAuthContext
export const useVendorAuth = (): VendorAuthContextType => {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    // This error means useVendorAuth was called outside of a VendorAuthProvider
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};
