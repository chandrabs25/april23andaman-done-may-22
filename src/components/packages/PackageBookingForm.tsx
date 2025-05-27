// src/components/packages/PackageBookingForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Input } from '@/components/ui/input'; // Assuming these are shadcn/ui components
import { Button } from '@/components/ui/button'; // Assuming these are shadcn/ui components
import { Label } from '@/components/ui/label';   // Assuming these are shadcn/ui components
import { Textarea } from '@/components/ui/textarea'; // Assuming these are shadcn/ui components
import { UserIcon, MailIcon, PhoneIcon, UsersIcon, CalendarIcon, DollarSignIcon, InfoIcon, Loader2 } from 'lucide-react';

// --- Theme Imports ---
import {
  neutralText, neutralTextLight, neutralBorder, neutralBg,
  infoIconColor, // For general icons within the form
  errorText, errorBg, errorBorder,
  successText, successIconColor, // For price display
  buttonPrimaryStyle,
  // Define inputBaseStyle and labelBaseStyle based on theme if not directly using shadcn's base
  // For this example, we'll assume shadcn inputs are mostly themed globally,
  // but we'll apply specific text/icon colors and margins from our theme.
} from '@/styles/26themeandstyle';

// Define a local label style based on theme for consistency if not using a global one from shadcn setup
const labelStyle = `flex items-center mb-1.5 text-sm font-medium ${neutralText}`;
const inputStyle = `w-full mt-1`; // Base style for shadcn inputs, they handle most of their styling
const errorTextStyle = `text-xs ${errorText} mt-1.5`;
// --- End Theme Imports ---


// --- Interfaces ---
interface PackageCategory {
  id: number;
  category_name: string;
  price: number;
  // Add other relevant fields from your actual data structure
}

interface PackageDetails {
  id: number;
  name: string;
  // Add other relevant fields
}

interface User {
  id?: string; // Added id to User interface
  name?: string | null;
  email?: string | null;
  phone?: string | null; // Assuming phone might be available
}

interface PackageBookingFormProps {
  packageDetails: PackageDetails;
  categoryDetails: PackageCategory;
  user?: User | null;
}

interface FormErrors {
  total_people?: string;
  start_date?: string;
  end_date?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  general?: string;
}

interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  message?: string;
}

export function PackageBookingForm({ packageDetails, categoryDetails, user }: PackageBookingFormProps) {
  const [formData, setFormData] = useState({
    total_people: 1,
    start_date: '',
    end_date: '',
    guest_name: user?.name || '',
    guest_email: user?.email || '',
    guest_phone: user?.phone || '',
    special_requests: '',
  });

  const [totalPrice, setTotalPrice] = useState(categoryDetails.price * formData.total_people);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    setTotalPrice(categoryDetails.price * formData.total_people);
  }, [formData.total_people, categoryDetails.price]);

  // Pre-fill form when user prop changes (e.g., after session load)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        guest_name: prev.guest_name || user.name || '',
        guest_email: prev.guest_email || user.email || '',
        guest_phone: prev.guest_phone || user.phone || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    if (name === 'total_people') {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue) || processedValue < 1) {
        processedValue = 1;
      }
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (formData.total_people < 1) newErrors.total_people = "Number of travelers must be at least 1.";
    if (!formData.start_date) newErrors.start_date = "Start date is required.";
    if (!formData.end_date) newErrors.end_date = "End date is required.";
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = "End date must be after the start date.";
    }
    if (!formData.guest_name.trim()) newErrors.guest_name = "Guest name is required.";
    if (!formData.guest_email.trim()) newErrors.guest_email = "Guest email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.guest_email)) newErrors.guest_email = "Email is invalid.";
    if (!formData.guest_phone.trim()) newErrors.guest_phone = "Guest phone number is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, general: undefined })); // Clear previous general errors

    if (!validateForm()) {
      // console.log("Client-side validation failed:", errors);
      return;
    }

    setIsSubmitting(true);

    // Prepare payload for /api/bookings/initiate-payment
    const paymentPayload = {
      packageId: packageDetails.id.toString(), // Ensure string
      categoryId: categoryDetails.id.toString(), // Ensure string
      userId: user?.id || null, // Send null if user or user.id is not available
      guestDetails: {
        name: formData.guest_name,
        email: formData.guest_email,
        mobileNumber: formData.guest_phone,
      },
      dates: {
        startDate: formData.start_date,
        endDate: formData.end_date,
      },
      totalPeople: formData.total_people,
      // special_requests from formData.special_requests is not part of BookingDetails for payment
    };

    try {
      const response = await fetch('/api/bookings/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });

      const responseData = await response.json() as PaymentResponse;

      if (response.ok && responseData.success && responseData.redirectUrl) {
        // Successfully initiated payment, redirect to PhonePe
        window.location.href = responseData.redirectUrl;
        // No need to setIsSubmitting(false) here as page will change
        return; 
      } else {
        // Handle API errors
        setErrors(prev => ({ ...prev, general: responseData.message || `Failed to initiate payment. Please try again. (Status: ${response.status})` }));
        console.error('Payment initiation failed:', responseData);
      }
    } catch (err) {
      console.error('Error submitting booking form for payment:', err);
      setErrors(prev => ({ ...prev, general: 'An unexpected error occurred while initiating payment. Please try again later.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {errors.general && (
        <div className={`p-4 rounded-md ${errorBg} border ${errorBorder}`}>
          <p className={`${errorText} text-sm`}>{errors.general}</p>
        </div>
      )}

      {/* Number of Travelers */}
      <div>
        <Label htmlFor="total_people" className={labelStyle}>
          <UsersIcon size={16} className={`mr-2 ${infoIconColor}`} /> Number of Travelers
        </Label>
        <Input
          type="number"
          id="total_people"
          name="total_people"
          value={formData.total_people}
          onChange={handleInputChange}
          min="1"
          className={inputStyle} // Assumes shadcn Input takes className
        />
        {errors.total_people && <p className={errorTextStyle}>{errors.total_people}</p>}
      </div>

      {/* Travel Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <Label htmlFor="start_date" className={labelStyle}>
            <CalendarIcon size={16} className={`mr-2 ${infoIconColor}`} /> Start Date
          </Label>
          <Input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className={inputStyle}
          />
          {errors.start_date && <p className={errorTextStyle}>{errors.start_date}</p>}
        </div>
        <div>
          <Label htmlFor="end_date" className={labelStyle}>
            <CalendarIcon size={16} className={`mr-2 ${infoIconColor}`} /> End Date
          </Label>
          <Input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className={inputStyle}
          />
          {errors.end_date && <p className={errorTextStyle}>{errors.end_date}</p>}
        </div>
      </div>

      {/* Primary Guest Information */}
      <div className={`space-y-4 pt-6 border-t ${neutralBorder}`}>
         <h3 className={`text-lg font-semibold ${neutralText} flex items-center`}>
            <UserIcon size={20} className={`mr-2.5 ${infoIconColor}`} /> Guest Information
        </h3>
        <div>
          <Label htmlFor="guest_name" className={labelStyle}>
             Full Name
          </Label>
          <Input
            type="text"
            id="guest_name"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className={inputStyle}
          />
          {errors.guest_name && <p className={errorTextStyle}>{errors.guest_name}</p>}
        </div>
        <div>
          <Label htmlFor="guest_email" className={labelStyle}>
             Email Address
          </Label>
          <Input
            type="email"
            id="guest_email"
            name="guest_email"
            value={formData.guest_email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            className={inputStyle}
          />
          {errors.guest_email && <p className={errorTextStyle}>{errors.guest_email}</p>}
        </div>
        <div>
          <Label htmlFor="guest_phone" className={labelStyle}>
             Phone Number
          </Label>
          <Input
            type="tel"
            id="guest_phone"
            name="guest_phone"
            value={formData.guest_phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className={inputStyle}
          />
          {errors.guest_phone && <p className={errorTextStyle}>{errors.guest_phone}</p>}
        </div>
      </div>

      {/* Special Requests */}
      <div className={`pt-6 border-t ${neutralBorder}`}>
        <Label htmlFor="special_requests" className={labelStyle}>
          <InfoIcon size={16} className={`mr-2 ${infoIconColor}`} /> Special Requests (Optional)
        </Label>
        <Textarea
          id="special_requests"
          name="special_requests"
          value={formData.special_requests}
          onChange={handleInputChange}
          placeholder="Any special requirements or preferences? (e.g., dietary needs, accessibility requests)"
          rows={4}
          className={inputStyle} // Assumes shadcn Textarea takes className
        />
      </div>

      {/* Total Price Display */}
      <div className={`pt-6 border-t ${neutralBorder}`}>
        <div className={`flex justify-between items-center ${neutralBg} p-4 md:p-5 rounded-lg border ${neutralBorder}`}>
            <p className={`text-lg font-semibold ${neutralText} flex items-center`}>
                <DollarSignIcon size={20} className={`mr-2 ${successIconColor}`}/> Total Booking Amount:
            </p>
            <p className={`text-2xl font-bold ${successText}`}>
                ₹{totalPrice.toLocaleString('en-IN')}
            </p>
        </div>
         <p className={`text-xs ${neutralTextLight} mt-2 text-right`}>
            Based on {formData.total_people} traveler(s) at ₹{categoryDetails.price.toLocaleString('en-IN')} per person.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button 
          type="submit" 
          className={`${buttonPrimaryStyle} w-full text-lg py-3 h-auto disabled:opacity-60`} // Ensure buttonPrimaryStyle is applied correctly
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2.5" /> Submitting...
            </>
          ) : (
            'Confirm & Proceed to Payment'
          )}
        </Button>
      </div>
    </form>
  );
}

export default PackageBookingForm;
