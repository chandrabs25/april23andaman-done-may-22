import React from 'react';
import { AuthProvider } from '../../hooks/useAuth'; // Ensure this import is present
// --- TEST: Use corrected relative path ---
import Header from '../../components/Header'; // Corrected relative path
import Footer from '../../components/Footer'; // Assuming Footer is also in src/components/
// --- END TEST ---

// This layout applies to all routes within the (main) group.
// It includes the standard site header and footer.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider> {/* Wrap with AuthProvider */}
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Add padding-top if Header is fixed and overlaps content, adjust value as needed */}
        {/* Example: <main className="flex-grow pt-16"> */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
