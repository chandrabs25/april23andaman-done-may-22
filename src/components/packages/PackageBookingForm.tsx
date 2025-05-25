// src/components/packages/PackageBookingForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserIcon, MailIcon, PhoneIcon, UsersIcon, CalendarIcon, DollarSignIcon, InfoIcon } from 'lucide-react';

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
      console.log("Client-side validation failed:", errors);
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      packageId: packageDetails.id,
      packageCategoryId: categoryDetails.id,
      total_people: formData.total_people,
      start_date: formData.start_date,
      end_date: formData.end_date,
      guest_name: formData.guest_name,
      guest_email: formData.guest_email,
      guest_phone: formData.guest_phone,
      special_requests: formData.special_requests || '',
      // total_amount is calculated server-side
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const responseData = await response.json();

      if (response.ok && response.status === 201) {
        // Success
        console.log('Booking successful:', responseData);
        router.push(`/booking/confirmation/${responseData.booking_id}`);
      } else {
        // Handle API errors
        console.error('API Error:', responseData);
        setErrors(prev => ({ ...prev, general: responseData.message || 'An unexpected error occurred.' }));
      }
    } catch (error) {
      console.error('Network or submission error:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to submit booking. Please check your connection and try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && <p className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">{errors.general}</p>}

      {/* Number of Travelers */}
      <div>
        <Label htmlFor="total_people" className="flex items-center mb-1 text-sm font-medium text-gray-700">
          <UsersIcon className="w-4 h-4 mr-2 text-blue-600" /> Number of Travelers
        </Label>
        <Input
          type="number"
          id="total_people"
          name="total_people"
          value={formData.total_people}
          onChange={handleInputChange}
          min="1"
          className="w-full"
        />
        {errors.total_people && <p className="text-red-500 text-xs mt-1">{errors.total_people}</p>}
      </div>

      {/* Travel Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="start_date" className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" /> Start Date
          </Label>
          <Input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="w-full"
          />
          {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
        </div>
        <div>
          <Label htmlFor="end_date" className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" /> End Date
          </Label>
          <Input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            className="w-full"
          />
          {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
        </div>
      </div>

      {/* Primary Guest Information */}
      <div className="space-y-4 pt-4 border-t">
         <h3 className="text-lg font-semibold text-gray-800">Guest Information</h3>
        <div>
          <Label htmlFor="guest_name" className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <UserIcon className="w-4 h-4 mr-2 text-blue-600" /> Full Name
          </Label>
          <Input
            type="text"
            id="guest_name"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="w-full"
          />
          {errors.guest_name && <p className="text-red-500 text-xs mt-1">{errors.guest_name}</p>}
        </div>
        <div>
          <Label htmlFor="guest_email" className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <MailIcon className="w-4 h-4 mr-2 text-blue-600" /> Email Address
          </Label>
          <Input
            type="email"
            id="guest_email"
            name="guest_email"
            value={formData.guest_email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            className="w-full"
          />
          {errors.guest_email && <p className="text-red-500 text-xs mt-1">{errors.guest_email}</p>}
        </div>
        <div>
          <Label htmlFor="guest_phone" className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <PhoneIcon className="w-4 h-4 mr-2 text-blue-600" /> Phone Number
          </Label>
          <Input
            type="tel"
            id="guest_phone"
            name="guest_phone"
            value={formData.guest_phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="w-full"
          />
          {errors.guest_phone && <p className="text-red-500 text-xs mt-1">{errors.guest_phone}</p>}
        </div>
      </div>

      {/* Special Requests */}
      <div className="pt-4 border-t">
        <Label htmlFor="special_requests" className="flex items-center mb-1 text-sm font-medium text-gray-700">
          <InfoIcon className="w-4 h-4 mr-2 text-blue-600" /> Special Requests (Optional)
        </Label>
        <Textarea
          id="special_requests"
          name="special_requests"
          value={formData.special_requests}
          onChange={handleInputChange}
          placeholder="Any special requirements or preferences?"
          rows={4}
          className="w-full"
        />
      </div>

      {/* Total Price Display */}
      <div className="pt-6 border-t">
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold text-gray-800 flex items-center">
                <DollarSignIcon className="w-5 h-5 mr-2 text-green-600"/> Total Booking Amount:
            </p>
            <p className="text-2xl font-bold text-green-600">
                ₹{totalPrice.toLocaleString('en-IN')}
            </p>
        </div>
         <p className="text-xs text-gray-500 mt-1 text-right">
            Based on {formData.total_people} traveler(s) at ₹{categoryDetails.price.toLocaleString('en-IN')} per person.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg disabled:opacity-75"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm & Proceed'}
        </Button>
      </div>
    </form>
  );
}

export default PackageBookingForm;
