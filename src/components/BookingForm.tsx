'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '../hooks/use-toast'; // As specified in subtask

// Define Props and Interfaces
export interface CategoryDetailsType {
  id: string | number;
  category_name: string;
  description: string;
  price: number;
  max_pax_included_in_price?: number;
}

export interface UserType {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export interface PackageSummaryType {
  name: string;
  image?: string;
}

export interface BookingFormProps {
  packageId: string;
  categoryId: string; // This is category_name
  categoryDetails: CategoryDetailsType;
  packageSummary: PackageSummaryType;
  isUserLoggedIn: boolean;
  loggedInUserDetails: UserType | null;
  authToken: string | null;
}

export default function BookingForm({
  packageId,
  categoryId,
  categoryDetails,
  packageSummary,
  isUserLoggedIn,
  loggedInUserDetails,
  authToken,
}: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // State Management
  const [totalPeople, setTotalPeople] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill Fields from loggedInUserDetails
  useEffect(() => {
    if (isUserLoggedIn && loggedInUserDetails) {
      let nameToSet = loggedInUserDetails.email; // Default to email
      if (loggedInUserDetails.firstName && loggedInUserDetails.lastName) {
        nameToSet = `${loggedInUserDetails.firstName} ${loggedInUserDetails.lastName}`;
      } else if (loggedInUserDetails.firstName) {
        nameToSet = loggedInUserDetails.firstName;
      } else if (loggedInUserDetails.lastName) {
        nameToSet = loggedInUserDetails.lastName;
      }
      setGuestName(nameToSet);
      setGuestEmail(loggedInUserDetails.email);
      setGuestPhone(loggedInUserDetails.phone || '');
    }
  }, [loggedInUserDetails, isUserLoggedIn]);

  // Calculate Total Amount
  useEffect(() => {
    setTotalAmount(totalPeople * categoryDetails.price);
  }, [totalPeople, categoryDetails.price]);

  // Client-Side Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (totalPeople <= 0) {
      newErrors.totalPeople = 'Number of people must be greater than 0.';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    }
    if (startDate && endDate && endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date.';
    }
    if (!guestName.trim()) {
      newErrors.guestName = 'Guest name is required.';
    }
    if (!guestEmail.trim()) {
      newErrors.guestEmail = 'Guest email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        newErrors.guestEmail = 'Invalid email format.';
      }
    }
    if (!guestPhone.trim()) {
      newErrors.guestPhone = 'Guest phone number is required.';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormErrors({}); // Clear previous field-specific errors

    if (validateForm()) {
      setIsSubmitting(true);

      const bookingPayload = {
        user_id: isUserLoggedIn && loggedInUserDetails ? loggedInUserDetails.id : null,
        package_id: packageId, // from props
        package_category_id: categoryDetails.id, // from props.categoryDetails
        total_people: totalPeople,
        start_date: format(startDate!, "yyyy-MM-dd"), // startDate is confirmed by validateForm
        end_date: format(endDate!, "yyyy-MM-dd"),   // endDate is confirmed by validateForm
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        special_requests: specialRequests,
        // total_amount is not part of this payload, it's calculated or confirmed by backend
      };

      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          },
          body: JSON.stringify(bookingPayload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast({ title: "Booking Initiated!", description: "Redirecting to confirmation..." });
          // Assuming data.booking_id is returned on successful booking creation by the API
          router.push(`/bookings/confirmation/${data.booking_id}`); 
        } else {
          toast({
            title: "Booking Failed",
            description: data.message || "An unexpected error occurred while processing your booking.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Booking submission error:", error);
        toast({
          title: "Network Error",
          description: "Could not submit booking. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Booking for: {packageSummary.name}</h2>
        <p className="text-lg text-gray-700 mb-1">Category: <span className="font-medium text-blue-600">{categoryDetails.category_name}</span></p>
        <p className="text-lg text-gray-700">Price per person: <span className="font-medium">₹{categoryDetails.price.toLocaleString('en-IN')}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
              />
            </PopoverContent>
          </Popover>
          {formErrors.startDate && <p className="text-sm text-red-600 mt-1">{formErrors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => startDate ? date <= startDate : date < new Date(new Date().setHours(0,0,0,0)) }
              />
            </PopoverContent>
          </Popover>
          {formErrors.endDate && <p className="text-sm text-red-600 mt-1">{formErrors.endDate}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="totalPeople" className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
        <Input
          id="totalPeople"
          type="number"
          value={totalPeople}
          onChange={(e) => setTotalPeople(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          className="w-full md:w-1/2"
        />
         {categoryDetails.max_pax_included_in_price && (
            <p className="text-xs text-gray-500 mt-1">
                Max {categoryDetails.max_pax_included_in_price} people included in base category price.
            </p>
        )}
        {formErrors.totalPeople && <p className="text-sm text-red-600 mt-1">{formErrors.totalPeople}</p>}
      </div>

      <div>
        <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <Input
          id="guestName"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Enter your full name"
        />
        {formErrors.guestName && <p className="text-sm text-red-600 mt-1">{formErrors.guestName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <Input
            id="guestEmail"
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          {formErrors.guestEmail && <p className="text-sm text-red-600 mt-1">{formErrors.guestEmail}</p>}
        </div>
        <div>
          <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <Input
            id="guestPhone"
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
          {formErrors.guestPhone && <p className="text-sm text-red-600 mt-1">{formErrors.guestPhone}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
        <Textarea
          id="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requirements or preferences?"
          rows={4}
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xl font-semibold text-gray-800">
          Estimated Total Amount: <span className="text-blue-600">₹{totalAmount.toLocaleString('en-IN')}</span>
        </p>
        <p className="text-xs text-gray-500">
            Final amount may vary based on availability and final confirmation.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Confirm & Proceed
        </Button>
      </div>
    </form>
  );
}
