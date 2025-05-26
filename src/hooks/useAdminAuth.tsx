// src/hooks/useAdminAuth.tsx
"use client"; // <-- MUST be at the top

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

// Define the User interface based on your API/DB schema
interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  role_id?: number; // Should be 1 for admin
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
// RegisterApiResponse removed as register function is removed

// Define the shape of the context value
interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

// Create the context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// AdminAuthProvider Component
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial check
  const router = useRouter();

  // Function to check auth status (e.g., on page load/refresh)
  const checkAuthState = useCallback(async () => {
    try {
      console.log("Checking admin auth state via /api/admin/auth/me...");
      // Fetch user profile from API based session cookie
      const response = await fetch('/api/admin/auth/me', { // Admin-specific endpoint
         method: 'GET',
         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
         credentials: 'include', // Important to send cookies
      });

      const data: MeApiResponse = await response.json();

      if (response.ok && data.success && data.data) {
        console.log("Admin auth check successful, user found:", data.data);
        setUser(data.data); // Ensure structure matches User interface
      } else {
        console.log("Admin auth check failed or no user session found.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking admin auth state:", error);
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
      console.log("Attempting admin login with:", email);
      const response = await fetch('/api/admin/auth/login', { // Admin-specific endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for setting cookies
      });

      const data: LoginApiResponse = await response.json();

      if (response.ok && data.success && data.data) {
         console.log("Admin login successful:", data.data);
         setUser(data.data);
         setIsLoading(false);
         return true; // Indicate success
      } else {
         console.error("Admin login API failed:", data.message);
         setUser(null); // Clear user on failed login
         setIsLoading(false);
         return false; // Indicate failure
      }
    } catch (error) {
       console.error("Admin login fetch error:", error);
       setUser(null);
       setIsLoading(false);
       return false; // Indicate failure
    }
  }, []); // Dependencies

  // Register function removed for Admin Auth

  // Logout function
  const logout = useCallback(async () => {
     try {
        console.log("Logging out admin...");
        await fetch('/api/auth/logout', { // Using generic logout endpoint as per instruction
          method: 'POST',
          credentials: 'include' // Send cookies to invalidate session server-side
        });
     } catch (error) {
        console.error("Admin logout API call failed:", error);
     } finally {
        setUser(null); // Clear user state immediately
        console.log("Redirecting to admin login page after logout.");
        router.push('/admin_login_page'); // Redirect to admin login page
     }
  }, [router]); // Add router dependency

  const contextValue: AdminAuthContextType = {
    user,
    isAuthenticated: !!user, // Boolean conversion
    isLoading,
    login,
    logout,
    checkAuthState,
  };

  // Provide the context value to children components
  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}; // End of AdminAuthProvider

// Custom hook to use the AdminAuthContext
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    // This error means useAdminAuth was called outside of an AdminAuthProvider
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
