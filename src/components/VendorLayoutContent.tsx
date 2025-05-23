"use client";

import React, { useEffect } from "react";
import VendorTopNav from "@/components/VendorTopNav"; // Changed from VendorNav to VendorTopNav
import { usePathname, useRouter } from "next/navigation";
import { useVendorAuth } from "@/hooks/useVendorAuth";
import { Loader2 } from "lucide-react";

export default function VendorLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useVendorAuth();

  const isAuthPage = pathname?.endsWith("/login") || pathname?.endsWith("/register");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
        <span>Loading Vendor Area...</span>
      </div>
    );
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      console.log("VendorLayoutContent: Not authenticated, redirecting to /login");
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isAuthPage, router]);

  if (!isAuthenticated && !isAuthPage) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
        <span>Redirecting to login...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!isAuthPage && <VendorTopNav />}
      {/* Removed ml-20 md:ml-64 and transition classes, padding adjusted for top nav */}
      <main className={`flex-grow p-4 md:p-6 w-full`}>
        {children}
      </main>
    </div>
  );
}

