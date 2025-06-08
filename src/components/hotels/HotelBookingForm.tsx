'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, CreditCard, User, Mail, Phone, MessageSquare, Clock, MapPin, AlertCircle } from 'lucide-react';

// --- Theme Imports ---
import {
  neutralBgLight, neutralText, neutralTextLight, neutralBorder, neutralBorderLight, neutralBg,
  infoText, infoIconColor, infoBg, infoBorder,
  successText, successIconColor, successBg, successBorder,
  errorText, errorIconColor, errorBg, errorBorder,
  buttonPrimaryStyle, buttonSecondaryStyleHero,
  cardBaseStyle, sectionPadding, sectionHeadingStyle,
  inputBaseStyle, labelBaseStyle,
} from '@/styles/26themeandstyle';

// --- Interfaces ---
interface HotelRoomType {
  id: number;
  room_type: string;
  base_price: number;
  capacity: number;
  amenities?: string[];
  description?: string;
  images?: string[];
  room_size?: string;
  bed_type?: string;
  special_features?: string;
}

interface HotelData {
  id: number;
  name: string;
  description?: string;
  star_rating?: number;
  images_parsed?: string[];
  amenities_parsed?: string[];
  address?: string;
  island_name?: string;
  room_types?: HotelRoomType[];
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface HotelBookingFormProps {
  hotelDetails: HotelData;
  roomTypeDetails: HotelRoomType;
  user: User | null;
}

export function HotelBookingForm({ hotelDetails, roomTypeDetails, user }: HotelBookingFormProps) {
  const router = useRouter();
  
  // Form state
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Booking hold state
  const [sessionId, setSessionId] = useState<string>('');
  const [holdId, setHoldId] = useState<number | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [holdTimeRemaining, setHoldTimeRemaining] = useState<number>(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'unavailable' | 'held' | null>(null);

  // Initialize session ID
  useEffect(() => {
    const generateSessionId = () => `hotel_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(generateSessionId());
  }, []);

  // Hold timer effect
  useEffect(() => {
    if (!holdExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeRemaining = Math.max(0, holdExpiresAt.getTime() - now.getTime());
      setHoldTimeRemaining(timeRemaining);

      if (timeRemaining <= 0) {
        setHoldId(null);
        setHoldExpiresAt(null);
        setAvailabilityStatus(null);
        setError('Your room hold has expired. Please check availability again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  // Calculate number of nights and total amount
  const calculateBookingDetails = () => {
    if (!checkInDate || !checkOutDate) return { nights: 0, totalAmount: 0 };
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (nights <= 0) return { nights: 0, totalAmount: 0 };
    
    const totalAmount = roomTypeDetails.base_price * numberOfRooms * nights;
    return { nights, totalAmount };
  };

  const { nights, totalAmount } = calculateBookingDetails();

  // Check room availability and create hold
  const checkAvailabilityAndCreateHold = async () => {
    if (!checkInDate || !checkOutDate || nights <= 0) {
      setError('Please select valid check-in and check-out dates');
      return false;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus('checking');
    setError(null);

    try {
      // First check availability
      const availabilityResponse = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hotel_room',
          room_type_id: roomTypeDetails.id,
          service_id: hotelDetails.id,
          start_date: checkInDate,
          end_date: checkOutDate,
          required_rooms: numberOfRooms,
        }),
      });

      const availabilityData = await availabilityResponse.json() as {
        available: boolean;
        message?: string;
      };

      if (!availabilityData.available) {
        setAvailabilityStatus('unavailable');
        setError('Selected rooms are not available for these dates. Please choose different dates or reduce room count.');
        return false;
      }

      // Create booking hold
      const holdResponse = await fetch('/api/bookings/create-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: user?.id || null,
          hold_type: 'hotel_room',
          room_type_id: roomTypeDetails.id,
          service_id: hotelDetails.id,
          hold_date: checkInDate,
          quantity: numberOfRooms,
          hold_price: totalAmount,
          expires_in_minutes: 15,
        }),
      });

      const holdData = await holdResponse.json() as {
        success: boolean;
        hold_id?: number;
        expires_at?: string;
        message?: string;
      };

      if (holdData.success) {
        setHoldId(holdData.hold_id || null);
        setHoldExpiresAt(holdData.expires_at ? new Date(holdData.expires_at) : null);
        setAvailabilityStatus('held');
        return true;
      } else {
        setAvailabilityStatus('unavailable');
        setError(holdData.message || 'Failed to secure room hold. Please try again.');
        return false;
      }

    } catch (error) {
      console.error('Availability check error:', error);
      setAvailabilityStatus('unavailable');
      setError('Failed to check availability. Please try again.');
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Validation
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!checkInDate) errors.push('Check-in date is required');
    if (!checkOutDate) errors.push('Check-out date is required');
    if (!guestName.trim()) errors.push('Guest name is required');
    if (!guestEmail.trim()) errors.push('Guest email is required');
    if (!guestPhone.trim()) errors.push('Guest phone is required');
    
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) errors.push('Check-in date cannot be in the past');
      if (checkOut <= checkIn) errors.push('Check-out date must be after check-in date');
    }
    
    if (numberOfRooms < 1) errors.push('At least 1 room is required');
    if (numberOfGuests < 1) errors.push('At least 1 guest is required');
    
    const roomCapacity = Math.max(roomTypeDetails.capacity || 2, 1);
    const maxCapacity = Math.min(numberOfRooms * roomCapacity, numberOfRooms * 10);
    if (numberOfGuests > maxCapacity) {
      errors.push(`Maximum ${maxCapacity} guests allowed for ${numberOfRooms} room(s)`);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (guestEmail && !emailRegex.test(guestEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    // Try to create a hold if not already done (optional for booking to work)
    if (!holdId || availabilityStatus !== 'held') {
      try {
        await checkAvailabilityAndCreateHold();
      } catch (error) {
        console.warn('Hold creation failed, proceeding without hold:', error);
        // Continue with booking even if hold fails
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        holdId: holdId || null,
        sessionId: sessionId,
        userId: user?.id || null,
        guestDetails: {
          name: guestName,
          email: guestEmail,
          mobileNumber: guestPhone,
        },
        numberOfRooms,
        numberOfGuests,
        specialRequests: specialRequests || undefined,
        // Direct booking data for fallback
        hotelId: hotelDetails.id,
        roomTypeId: roomTypeDetails.id,
        checkInDate,
        checkOutDate,
        totalAmount,
      };

      console.log('Submitting hotel booking with hold:', bookingData);

      const response = await fetch('/api/bookings/initiate-payment/hotel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json() as {
        success: boolean;
        redirectUrl?: string;
        message?: string;
      };

      if (result.success && result.redirectUrl) {
        // Redirect to PhonePe payment page
        window.location.href = result.redirectUrl;
      } else {
        throw new Error(result.message || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error('Hotel booking submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get minimum checkout date (day after checkin)
  const getMinCheckoutDate = () => {
    if (!checkInDate) return getMinDate();
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className={`p-4 rounded-lg ${errorBg} border ${errorBorder}`}>
          <p className={`text-sm ${errorText}`}>{error}</p>
        </div>
      )}

      {/* Availability Status */}
      {availabilityStatus && (
        <div className={`p-4 rounded-lg border ${
          availabilityStatus === 'held' ? `${successBg} ${successBorder}` :
          availabilityStatus === 'available' ? `${infoBg} ${infoBorder}` :
          availabilityStatus === 'unavailable' ? `${errorBg} ${errorBorder}` :
          `${neutralBg} ${neutralBorder}`
        }`}>
          <div className="flex items-center">
            {availabilityStatus === 'checking' && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className={`text-sm ${infoText}`}>Checking room availability...</span>
              </>
            )}
            {availabilityStatus === 'available' && (
              <>
                <Clock size={16} className={`mr-2 ${infoIconColor}`} />
                <span className={`text-sm ${infoText}`}>Rooms are available for selected dates</span>
              </>
            )}
            {availabilityStatus === 'held' && (
              <>
                <Clock size={16} className={`mr-2 ${successIconColor}`} />
                <div className="flex-1">
                  <span className={`text-sm ${successText} font-medium`}>
                    Room(s) secured for {Math.floor(holdTimeRemaining / 60000)}:{String(Math.floor((holdTimeRemaining % 60000) / 1000)).padStart(2, '0')}
                  </span>
                  <p className={`text-xs ${neutralTextLight} mt-1`}>
                    Complete booking before hold expires
                  </p>
                </div>
              </>
            )}
            {availabilityStatus === 'unavailable' && (
              <>
                <AlertCircle size={16} className={`mr-2 ${errorIconColor}`} />
                <span className={`text-sm ${errorText}`}>Rooms not available for selected dates</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Booking Summary */}
      {nights > 0 && (
        <div className={`${infoBg} border ${infoBorder} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold ${infoText} mb-3 flex items-center`}>
            <Clock size={20} className={`mr-2 ${infoIconColor}`} />
            Booking Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`${neutralTextLight}`}>Hotel:</span>
              <p className={`font-medium ${neutralText}`}>{hotelDetails.name}</p>
            </div>
            <div>
              <span className={`${neutralTextLight}`}>Room Type:</span>
              <p className={`font-medium ${neutralText}`}>{roomTypeDetails.room_type}</p>
            </div>
            <div>
              <span className={`${neutralTextLight}`}>Duration:</span>
              <p className={`font-medium ${neutralText}`}>{nights} night(s)</p>
            </div>
            <div>
              <span className={`${neutralTextLight}`}>Rooms:</span>
              <p className={`font-medium ${neutralText}`}>{numberOfRooms} room(s)</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-200">
              <span className={`${neutralTextLight}`}>Total Amount:</span>
              <p className={`text-xl font-bold ${successText}`}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
              <p className={`text-xs ${neutralTextLight}`}>
                ₹{roomTypeDetails.base_price.toLocaleString('en-IN')} × {numberOfRooms} room(s) × {nights} night(s)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`${labelBaseStyle} flex items-center`}>
            <Calendar size={16} className={`mr-2 ${infoIconColor}`} />
            Check-in Date *
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={getMinDate()}
            required
            className={`${inputBaseStyle}`}
          />
        </div>
        <div>
          <label className={`${labelBaseStyle} flex items-center`}>
            <Calendar size={16} className={`mr-2 ${infoIconColor}`} />
            Check-out Date *
          </label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={getMinCheckoutDate()}
            required
            className={`${inputBaseStyle}`}
          />
        </div>
      </div>

      {/* Room and Guest Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`${labelBaseStyle} flex items-center`}>
            <MapPin size={16} className={`mr-2 ${infoIconColor}`} />
            Number of Rooms *
          </label>
          <select
            value={numberOfRooms}
            onChange={(e) => {
              const newRoomCount = parseInt(e.target.value);
              setNumberOfRooms(newRoomCount);
              
              // Adjust guest count if it exceeds new room capacity
              const roomCapacity = Math.max(roomTypeDetails.capacity || 2, 1);
              const newMaxCapacity = Math.min(newRoomCount * roomCapacity, newRoomCount * 10);
              if (numberOfGuests > newMaxCapacity) {
                setNumberOfGuests(newMaxCapacity);
              }
            }}
            required
            className={`${inputBaseStyle}`}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`${labelBaseStyle} flex items-center`}>
            <Users size={16} className={`mr-2 ${infoIconColor}`} />
            Number of Guests *
          </label>
          <select
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
            required
            className={`${inputBaseStyle}`}
          >
            {(() => {
              // Ensure minimum capacity of 2 per room, maximum of 10 per room for safety
              const roomCapacity = Math.max(roomTypeDetails.capacity || 2, 1);
              const maxCapacity = Math.min(numberOfRooms * roomCapacity, numberOfRooms * 10);
              const options = [];
              
              for (let i = 1; i <= maxCapacity; i++) {
                options.push(
                  <option key={i} value={i}>
                    {i} Guest{i > 1 ? 's' : ''}
                  </option>
                );
              }
              
              return options;
            })()}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Room capacity: {roomTypeDetails.capacity || 'Not specified'} guests per room
          </p>
        </div>
      </div>

      {/* Guest Information */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${neutralText} flex items-center`}>
          <User size={20} className={`mr-2 ${infoIconColor}`} />
          Guest Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`${labelBaseStyle} flex items-center`}>
              <User size={16} className={`mr-2 ${infoIconColor}`} />
              Guest Name *
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter primary guest name"
              required
              className={`${inputBaseStyle}`}
            />
          </div>
          <div>
            <label className={`${labelBaseStyle} flex items-center`}>
              <Mail size={16} className={`mr-2 ${infoIconColor}`} />
              Email Address *
            </label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter email address"
              required
              className={`${inputBaseStyle}`}
            />
          </div>
        </div>
        
        <div>
          <label className={`${labelBaseStyle} flex items-center`}>
            <Phone size={16} className={`mr-2 ${infoIconColor}`} />
            Phone Number *
          </label>
          <input
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="Enter phone number"
            required
            className={`${inputBaseStyle}`}
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className={`${labelBaseStyle} flex items-center`}>
          <MessageSquare size={16} className={`mr-2 ${infoIconColor}`} />
          Special Requests (Optional)
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests or preferences (early check-in, late check-out, room preferences, etc.)"
          rows={4}
          className={`${inputBaseStyle} resize-none`}
        />
      </div>

      {/* Hotel Policies */}
      {hotelDetails.cancellation_policy && (
        <div className={`${cardBaseStyle} p-4 ${neutralBg} border ${neutralBorderLight}`}>
          <h4 className={`font-semibold ${neutralText} mb-2`}>Cancellation Policy</h4>
          <p className={`text-sm ${neutralTextLight} whitespace-pre-line`}>
            {hotelDetails.cancellation_policy}
          </p>
        </div>
      )}

      {/* Check-in/Check-out Times */}
      <div className={`${cardBaseStyle} p-4 ${infoBg} border ${infoBorder}`}>
        <h4 className={`font-semibold ${infoText} mb-2`}>Hotel Timings</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={`${neutralTextLight}`}>Check-in:</span>
            <p className={`font-medium ${neutralText}`}>{hotelDetails.check_in_time || '3:00 PM'}</p>
          </div>
          <div>
            <span className={`${neutralTextLight}`}>Check-out:</span>
            <p className={`font-medium ${neutralText}`}>{hotelDetails.check_out_time || '11:00 AM'}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3">
        {/* Check Availability Button */}
        {(!holdId || availabilityStatus !== 'held') && nights > 0 && (
          <button
            type="button"
            onClick={checkAvailabilityAndCreateHold}
            disabled={isCheckingAvailability || nights <= 0}
            className={`${buttonSecondaryStyleHero} w-full py-3 text-lg font-semibold ${isCheckingAvailability || nights <= 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/30'
            }`}
          >
            {isCheckingAvailability ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Checking Availability...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Clock size={20} className="mr-2" />
                Check Availability & Secure Rooms
              </span>
            )}
          </button>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || nights <= 0}
          className={`${buttonPrimaryStyle} w-full py-4 text-lg font-semibold ${
            isSubmitting || nights <= 0
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : nights > 0 ? (
            <span className="flex items-center justify-center">
              <CreditCard size={20} className="mr-2" />
              Proceed to Payment - ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          ) : (
            'Please select valid dates'
          )}
        </button>
      </div>

      {/* Terms and Conditions */}
      <div className={`text-xs ${neutralTextLight} text-center`}>
        By proceeding, you agree to our 
        <a href="/terms" className={`${infoText} hover:underline mx-1`}>Terms & Conditions</a>
        and 
        <a href="/privacy" className={`${infoText} hover:underline ml-1`}>Privacy Policy</a>
      </div>
    </form>
  );
} 