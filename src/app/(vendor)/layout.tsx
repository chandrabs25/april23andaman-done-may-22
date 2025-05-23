import React from "react";
import { VendorAuthProvider } from "@/hooks/useVendorAuth";
import VendorLayoutContent from "@/components/VendorLayoutContent";
import "@/styles/vendor_globals.css"; // Import the global CSS file

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VendorAuthProvider>
      <VendorLayoutContent>{children}</VendorLayoutContent>
    </VendorAuthProvider>
  );
}

