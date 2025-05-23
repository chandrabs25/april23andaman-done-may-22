// src/app/providers.tsx
"use client"; // <-- Mark this component as a Client Component

import React, { ReactNode } from 'react'; // Import React
import { AuthProvider } from '@/hooks/useAuth'; // Import the AuthProvider
import { Toaster } from "@/components/ui/sonner"; // Import Sonner Toaster for notifications

// This component wraps children with client-side providers
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children} {/* Page content */}
      <Toaster position="top-right" richColors /> {/* Add Toaster for notifications */}
    </AuthProvider>
  );
}