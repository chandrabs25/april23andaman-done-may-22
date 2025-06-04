// src/components/packages/PackageBookingForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserIcon, MailIcon, PhoneIcon, UsersIcon, CalendarIcon, InfoIcon, Loader2, BadgeIndianRupee } from 'lucide-react';

// --- Theme Styles (Derived from destinations/page.tsx theme) ---
const primaryButtonBg = 'bg-gray-800';
const primaryButtonHoverBg = 'hover:bg-gray-900';
const primaryButtonText = 'text-white';

const infoIconColor = 'text-blue-600'; // For icons in labels and section headings

const successText = 'text-green-800';     // For price text
const successIconColor = 'text-green-600'; // For price icon

const errorBg = 'bg-red-50';
const errorBorder = 'border-red-200';
const errorText = 'text-red-700';

const neutralBg = 'bg-gray-100';          // For Price Display background
const neutralBorder = 'border-gray-200';  // For dividers, input borders
const neutralText = 'text-gray-800';      // Primary text, labels
const neutralTextLight = 'text-gray-600'; // Helper text, placeholders

const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} font-semibold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-base sm:text-lg`; // Adjusted padding & text size for responsiveness

// Form Element Styles
const labelStyle = `flex items-center mb-1.5 text-xs sm:text-sm font-medium ${neutralText}`;
const inputSharedStyle = `w-full mt-1 px-3 py-2 text-sm sm:text-base rounded-md border ${neutralBorder} file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:${neutralTextLight} focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed`;
const errorTextStyle = `text-xs ${errorText} mt-1`;
const generalErrorContainerStyle = `p-3 sm:p-4 rounded-lg ${errorBg} border ${errorBorder} text-xs sm:text-sm ${errorText}`;
const formSectionDividerStyle = `pt-4 sm:pt-5 border-t ${neutralBorder}`;
const formSubHeadingStyle = `text-base sm:text-md font-semibold ${neutralText} flex items-center`;
const priceDisplayBoxStyle = `flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center ${neutralBg} p-3 sm:p-4 rounded-lg border ${neutralBorder}`;
const totalPriceLabelStyle = `text-sm sm:text-base font-semibold ${neutralText} flex items-center`;
const totalPriceAmountStyle = `text-lg sm:text-xl font-bold ${successText} text-left sm:text-right`;
const priceDetailsTextStyle = `text-xs ${neutralTextLight} mt-1.5 sm:mt-2 text-left sm:text-right`;
// --- End Theme Styles ---


// --- Interfaces ---
interface PackageCategory {
  id: number;
  category_name: string;
  price: number;
}

interface PackageDetails {
  id: number;
  name: string;
  number_of_days?: number | null;
}

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTotalPrice(categoryDetails.price * Math.max(1, formData.total_people));
  }, [formData.total_people, categoryDetails.price]);

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

  // Auto-calculate end date based on start date and number of days
  useEffect(() => {
    if (formData.start_date && packageDetails.number_of_days) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + packageDetails.number_of_days - 1); // Subtract 1 because it's inclusive
      const endDateString = endDate.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        end_date: endDateString
      }));
    }
  }, [formData.start_date, packageDetails.number_of_days]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    if (name === 'total_people') {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue) || processedValue < 1) {
        processedValue = 1; // Or keep the input as is and show error, depends on UX choice
      }
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for date comparison

    if (formData.total_people < 1) newErrors.total_people = "At least 1 traveler is required.";
    if (!formData.start_date) newErrors.start_date = "Start date is required.";
    else if (new Date(formData.start_date) < today) newErrors.start_date = "Start date cannot be in the past.";
    
    // End date validation is simplified since it's auto-calculated
    if (!formData.end_date) newErrors.end_date = "End date could not be calculated. Please check the start date.";
    
    if (!formData.guest_name.trim()) newErrors.guest_name = "Guest name is required.";
    if (!formData.guest_email.trim()) newErrors.guest_email = "Guest email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.guest_email)) newErrors.guest_email = "Email address is invalid.";
    if (!formData.guest_phone.trim()) newErrors.guest_phone = "Guest phone number is required.";
    // Basic phone validation (example: at least 10 digits)
    else if (!/^\d{10,}$/.test(formData.guest_phone.replace(/\s+/g, ''))) newErrors.guest_phone = "Phone number seems invalid.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, general: undefined }));

    if (!validateForm()) return;

    setIsSubmitting(true);

    const paymentPayload = {
      packageId: packageDetails.id.toString(),
      categoryId: categoryDetails.id.toString(),
      userId: user?.id || null,
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
    };

    try {
      const response = await fetch('/api/bookings/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
      });

      const responseData = await response.json() as PaymentResponse;

      if (response.ok && responseData.success && responseData.redirectUrl) {
        window.location.href = responseData.redirectUrl;
        return;
      } else {
        setErrors(prev => ({ ...prev, general: responseData.message || `Failed to initiate payment. (Status: ${response.status})` }));
      }
    } catch (err) {
      console.error('Error submitting booking form for payment:', err);
      setErrors(prev => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // The form itself can be styled as a card if needed: className={`bg-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 md:space-y-8`}
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {errors.general && (
        <div className={generalErrorContainerStyle}>
          {errors.general}
        </div>
      )}

      <div>
        <Label htmlFor="total_people" className={labelStyle}>
          <UsersIcon size={14} className={`mr-1.5 sm:mr-2 ${infoIconColor}`} /> Number of Travelers
        </Label>
        <Input
          type="number"
          id="total_people"
          name="total_people"
          value={formData.total_people}
          onChange={handleInputChange}
          min="1"
          className={inputSharedStyle}
          aria-describedby={errors.total_people ? "total_people-error" : undefined}
        />
        {errors.total_people && <p id="total_people-error" className={errorTextStyle}>{errors.total_people}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <Label htmlFor="start_date" className={labelStyle}>
            <CalendarIcon size={14} className={`mr-1.5 sm:mr-2 ${infoIconColor}`} /> Start Date
          </Label>
          <Input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className={inputSharedStyle}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
            aria-describedby={errors.start_date ? "start_date-error" : undefined}
          />
          {errors.start_date && <p id="start_date-error" className={errorTextStyle}>{errors.start_date}</p>}
        </div>
        <div>
          <Label htmlFor="end_date" className={labelStyle}>
            <CalendarIcon size={14} className={`mr-1.5 sm:mr-2 ${infoIconColor}`} /> End Date
            {packageDetails.number_of_days && (
              <span className={`ml-2 text-xs ${neutralTextLight} font-normal`}>
                (Auto-calculated: {packageDetails.number_of_days} days)
              </span>
            )}
          </Label>
          <Input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            readOnly
            className={`${inputSharedStyle} bg-gray-50 cursor-not-allowed`}
            aria-describedby={errors.end_date ? "end_date-error" : undefined}
          />
          {errors.end_date && <p id="end_date-error" className={errorTextStyle}>{errors.end_date}</p>}
          {packageDetails.number_of_days && !errors.end_date && (
            <p className={`text-xs ${neutralTextLight} mt-1`}>
              Automatically calculated based on {packageDetails.number_of_days}-day package duration
            </p>
          )}
        </div>
      </div>

      <div className={`space-y-3 sm:space-y-4 ${formSectionDividerStyle}`}>
        <h3 className={formSubHeadingStyle}>
          <UserIcon size={16} className={`mr-2 sm:mr-2.5 ${infoIconColor}`} /> Guest Information
        </h3>
        <div>
          <Label htmlFor="guest_name" className={labelStyle}>Full Name</Label>
          <Input
            type="text"
            id="guest_name"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className={inputSharedStyle}
            aria-describedby={errors.guest_name ? "guest_name-error" : undefined}
          />
          {errors.guest_name && <p id="guest_name-error" className={errorTextStyle}>{errors.guest_name}</p>}
        </div>
        <div>
          <Label htmlFor="guest_email" className={labelStyle}>Email Address</Label>
          <Input
            type="email"
            id="guest_email"
            name="guest_email"
            value={formData.guest_email}
            onChange={handleInputChange}
            placeholder="name@example.com"
            className={inputSharedStyle}
            aria-describedby={errors.guest_email ? "guest_email-error" : undefined}
          />
          {errors.guest_email && <p id="guest_email-error" className={errorTextStyle}>{errors.guest_email}</p>}
        </div>
        <div>
          <Label htmlFor="guest_phone" className={labelStyle}>Phone Number</Label>
          <Input
            type="tel"
            id="guest_phone"
            name="guest_phone"
            value={formData.guest_phone}
            onChange={handleInputChange}
            placeholder="Enter 10-digit phone number"
            className={inputSharedStyle}
            aria-describedby={errors.guest_phone ? "guest_phone-error" : undefined}
          />
          {errors.guest_phone && <p id="guest_phone-error" className={errorTextStyle}>{errors.guest_phone}</p>}
        </div>
      </div>

      <div className={formSectionDividerStyle}>
        <Label htmlFor="special_requests" className={labelStyle}>
          <InfoIcon size={14} className={`mr-1.5 sm:mr-2 ${infoIconColor}`} /> Special Requests (Optional)
        </Label>
        <Textarea
          id="special_requests"
          name="special_requests"
          value={formData.special_requests}
          onChange={handleInputChange}
          placeholder="e.g., dietary needs, accessibility, preferred room view"
          rows={3}
          className={inputSharedStyle}
        />
      </div>

      <div className={formSectionDividerStyle}>
        <div className={priceDisplayBoxStyle}>
          <p className={totalPriceLabelStyle}>
            <BadgeIndianRupee size={16} className={`mr-1.5 sm:mr-2 ${successIconColor}`} /> Total Amount
          </p>
          <p className={totalPriceAmountStyle}>
            ₹{totalPrice.toLocaleString('en-IN')}
          </p>
        </div>
        <p className={priceDetailsTextStyle}>
          Based on {formData.total_people} traveler(s) at ₹{categoryDetails.price.toLocaleString('en-IN')} per person.
        </p>
      </div>

      <div className="pt-4 sm:pt-5">
        <Button
          type="submit"
          className={`${buttonPrimaryStyle} w-full h-auto text-sm sm:text-base py-2.5 sm:py-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-md`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" /> Submitting...
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