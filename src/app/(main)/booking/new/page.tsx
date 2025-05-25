'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth'; 

const BookingCreationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const [packageId, setPackageId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Interfaces for API response
  interface BookingDetailsData {
    packageName: string;
    packageImage: string | null;
    categoryName: string;
    categoryDescription: string | null;
    pricePerPerson: number;
    maxPaxIncludedInPrice: number | null;
    hotelDetails: string | null;
  }

  interface ApiResponse {
    success: boolean;
    data?: BookingDetailsData;
    message?: string;
  }

  // State for API data, loading, and error
  const [summaryData, setSummaryData] = useState<BookingDetailsData | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // State for form inputs
  const [numTravelers, setNumTravelers] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // State for total price
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // State for date validation error
  const [dateError, setDateError] = useState<string>('');

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    const pkgId = searchParams.get('packageId');
    const catId = searchParams.get('categoryId');
    setPackageId(pkgId);
    setCategoryId(catId);

    if (pkgId && catId) {
      console.log('Package ID from URL:', pkgId);
      console.log('Category ID from URL:', catId);
      
      setIsLoadingSummary(true);
      setSummaryError(null);
      setSummaryData(null);

      fetch(`/api/packages/${pkgId}/categories/${catId}/booking-details`)
        .then(res => res.json())
        .then((response: ApiResponse) => {
          if (response.success && response.data) {
            setSummaryData(response.data);
          } else {
            setSummaryError(response.message || 'Failed to load booking details.');
            console.error('Error fetching booking details:', response.message);
          }
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setSummaryError(err.message || 'An unexpected error occurred.');
        })
        .finally(() => {
          setIsLoadingSummary(false);
        });
    } else {
      // Reset if IDs are not present
      setIsLoadingSummary(false);
      setSummaryError(null);
      setSummaryData(null);
    }
  }, [searchParams]);

  // Effect for real-time price calculation
  useEffect(() => {
    if (summaryData && summaryData.pricePerPerson && numTravelers > 0) {
      const newTotalPrice = numTravelers * summaryData.pricePerPerson;
      setTotalPrice(newTotalPrice);
    } else {
      setTotalPrice(0);
    }
  }, [numTravelers, summaryData]);

  // Effect for date validation
  useEffect(() => {
    setDateError(''); // Reset error at the beginning
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0,0,0,0); // Ensure comparison is date-only
      // It's common to have a time zone offset issue when converting string to Date,
      // so we add the offset to make sure we are comparing local dates correctly.
      startDateObj.setTime(startDateObj.getTime() + startDateObj.getTimezoneOffset() * 60 * 1000);


      if (startDateObj < today) {
        setDateError("Start date cannot be in the past.");
        return;
      }
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      // Adjust for timezone differences for accurate date-only comparison
      startDateObj.setTime(startDateObj.getTime() + startDateObj.getTimezoneOffset() * 60 * 1000);
      endDateObj.setTime(endDateObj.getTime() + endDateObj.getTimezoneOffset() * 60 * 1000);
      startDateObj.setHours(0,0,0,0);
      endDateObj.setHours(0,0,0,0);


      if (endDateObj <= startDateObj) {
        setDateError("End date must be after the start date.");
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated && user) {
      // Pre-fill guestName
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      if (fullName) {
        setGuestName(fullName); 
      }
      
      // Pre-fill guestEmail
      if (user.email) {
        setGuestEmail(user.email); 
      }

      // user.phone is not in the User interface from useAuth, so guestPhone cannot be pre-filled from here.
    }
  }, [user, isLoadingAuth, isAuthenticated]);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (dateError) {
      setFormError(dateError);
      setIsSubmitting(false);
      return;
    }

    if (!guestName || !guestEmail || !guestPhone || !startDate || !endDate || numTravelers <= 0) {
      setFormError("Please fill in all required fields correctly.");
      setIsSubmitting(false);
      return;
    }

    if (!packageId || !categoryId) {
      setFormError("Package or category information is missing. Please go back and try again.");
      setIsSubmitting(false);
      return;
    }

    const bookingPayload = {
      packageId: parseInt(packageId as string),
      packageCategoryId: parseInt(categoryId as string),
      totalPeople: numTravelers,
      startDate,
      endDate,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      userId: user ? user.id : null,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        router.push(`/booking/confirmation/${result.bookingId}`);
      } else {
        setFormError(result.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create Booking</h1>
      {/* Removed the direct display of packageId and categoryId as they'll be in summary */}
      
      {/* Package & Category Summary Display */}
      <div style={{marginTop: '20px', padding: '10px', border: '1px solid #ccc'}}>
        <h2>Package & Category Summary</h2>
        {isLoadingSummary && <p>Loading package details...</p>}
        {summaryError && <p>Error loading details: {summaryError}</p>}
        {summaryData && !isLoadingSummary && !summaryError && (
          <>
            {summaryData.packageImage && (
              <img 
                src={summaryData.packageImage} 
                alt={summaryData.packageName} 
                style={{maxWidth: '200px', height: 'auto', marginBottom: '10px'}} 
              />
            )}
            <h3>Package: {summaryData.packageName}</h3>
            <p>Category: {summaryData.categoryName}</p>
            {summaryData.categoryDescription && <p>Description: {summaryData.categoryDescription}</p>}
            <p>Price per Person: ₹{summaryData.pricePerPerson.toLocaleString('en-IN')}</p>
            {summaryData.maxPaxIncludedInPrice && <p>Max Guests at this price: {summaryData.maxPaxIncludedInPrice}</p>}
            {summaryData.hotelDetails && (
              <div style={{marginTop: '10px'}}>
                <h4>Hotel Details:</h4>
                <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit'}}>{summaryData.hotelDetails}</pre>
              </div>
            )}
          </>
        )}
        {!isLoadingSummary && !summaryError && !summaryData && packageId && categoryId && (
            <p>No summary data to display. This might indicate an issue with the API response or data format.</p>
        )}
         {!packageId && !categoryId && (
            <p>Please ensure Package ID and Category ID are provided in the URL.</p>
        )}
      </div>

      {/* Booking Form */}
      <div style={{marginTop: '20px', padding: '10px', border: '1px solid #ccc'}}>
        <h2>Booking Form</h2>
        <form onSubmit={handleBookingSubmit}>
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="numTravelers" style={{display: 'block', marginBottom: '2px'}}>Number of Travelers:</label>
            <input type="number" id="numTravelers" name="numTravelers" min="1" value={numTravelers} onChange={(e) => setNumTravelers(parseInt(e.target.value, 10) || 1)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="startDate" style={{display: 'block', marginBottom: '2px'}}>Start Date:</label>
            <input type="date" id="startDate" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="endDate" style={{display: 'block', marginBottom: '2px'}}>End Date:</label>
            <input type="date" id="endDate" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          {dateError && <p style={{color: 'red', marginTop: '5px', fontSize: '0.9em'}}>{dateError}</p>}
          
          <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Guest Information</h4>
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="guestName" style={{display: 'block', marginBottom: '2px'}}>Full Name:</label>
            <input type="text" id="guestName" name="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="guestEmail" style={{display: 'block', marginBottom: '2px'}}>Email Address:</label>
            <input type="email" id="guestEmail" name="guestEmail" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="guestPhone" style={{display: 'block', marginBottom: '2px'}}>Phone Number:</label>
            <input type="tel" id="guestPhone" name="guestPhone" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="specialRequests" style={{display: 'block', marginBottom: '2px'}}>Special Requests (Optional):</label>
            <textarea id="specialRequests" name="specialRequests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}></textarea>
          </div>
          
          <div style={{marginTop: '20px', marginBottom: '20px', fontSize: '1.2em', fontWeight: 'bold'}}>
            <p>Total Price: <span id="totalPriceDisplay">₹{totalPrice.toLocaleString('en-IN')}</span></p>
          </div>

          {formError && <p style={{color: 'red', marginTop: '10px'}}>{formError}</p>}
          
          <div>
            <button 
              type="submit" 
              disabled={!!dateError || isSubmitting} 
              style={{
                padding: '10px 15px', 
                backgroundColor: (!!dateError || isSubmitting) ? '#ccc' : '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: (!!dateError || isSubmitting) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingCreationPage;
