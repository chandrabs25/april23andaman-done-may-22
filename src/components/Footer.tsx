'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // --- Define Color Theme Variables (only needed for accent potentially) ---
  const primaryColorLighter = '#67a7c5'; // Keep for icon accents if desired

  // --- Define Footer Text/Link Styles for Black Background ---
  const footerHeadingStyle = `text-lg font-semibold mb-4 text-white`; // White headings
  const footerTextStyle = `text-gray-200 mb-4 text-sm`; // Light gray for paragraph text (slightly less bright than pure white)
  const footerLinkStyle = `text-gray-200 hover:text-[${primaryColorLighter}] text-sm transition-colors duration-200`; // Light gray links, hover primary accent
  const footerIconLinkStyle = `text-gray-200 hover:text-[${primaryColorLighter}] transition-colors duration-200`; // Icon link style
  const footerBottomTextStyle = `text-gray-400 text-xs`; // Dimmer text for copyright
  const footerBottomLinkStyle = `hover:text-[${primaryColorLighter}] text-xs transition-colors duration-200`; // Dimmer links, hover primary accent

  return (
    // Apply black background
    <footer className={`bg-black text-white`}>
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* About Section */}
          <div>
            <h3 className={footerHeadingStyle}>Reach Andaman</h3>
            <p className={footerTextStyle}>
              Your ultimate guide to exploring the beautiful Andaman Islands. We provide comprehensive travel information, booking services, and curated experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={footerIconLinkStyle} aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className={footerIconLinkStyle} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className={footerIconLinkStyle} aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={footerHeadingStyle}>Quick Links</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/destinations" className={footerLinkStyle}>
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className={footerLinkStyle}>
                  Travel Packages
                </Link>
              </li>
              <li>
                <Link href="/activities" className={footerLinkStyle}>
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/about" className={footerLinkStyle}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLinkStyle}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/register" className={footerLinkStyle}>
                  Vendor Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className={footerLinkStyle}>
                  Vendor Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h3 className={footerHeadingStyle}>Help & Policies</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy-policy" className={footerLinkStyle}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className={footerLinkStyle}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className={footerLinkStyle}>
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className={footerLinkStyle}>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={footerHeadingStyle}>Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                {/* Using lighter primary color for accent on icons */}
                <Phone size={16} className={`mr-2 mt-0.5 text-[${primaryColorLighter}] flex-shrink-0`} />
                <span className={footerTextStyle.replace(' mb-4', '')}>+91 123-456-7890</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className={`mr-2 mt-0.5 text-[${primaryColorLighter}] flex-shrink-0`} />
                <a href="mailto:info@reachandaman.com" className={footerLinkStyle}>
                  info@reachandaman.com
                </a>
              </li>
              <li className={`${footerTextStyle.replace(' mb-4', '')} mt-2 pl-8`}>
                Port Blair, Andaman and Nicobar Islands, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Use dark gray border for contrast */}
        <div className={`border-t border-gray-700 mt-8 pt-6 text-center ${footerBottomTextStyle}`}> {/* Changed border color */}
          <p>© {currentYear} Reach Andaman. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;