'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BookingConfirmationDetails {
  id: number;
  user_id: number | null;
  packageName: string;
  categoryName: string;
  total_people: number;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  payment_status: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  special_requests: string | null;
  created_at: string;
  categoryPricePerPerson: number; // Included based on the API structure from previous subtask
}

interface ApiBookingResponse {
  success: boolean;
  data?: BookingConfirmationDetails;
  message?: string;
}

const BookingConfirmationPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [bookingDetails, setBookingDetails] = useState<BookingConfirmationDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      setIsLoading(true);
      setError(null);
      setBookingDetails(null); // Reset previous details

      fetch(`/api/bookings/${bookingId}`)
        .then(res => {
          if (!res.ok) { // Check for non-2xx responses
            return res.json().then(errData => {
              throw new Error(errData.message || `Error: ${res.status}`);
            });
          }
          return res.json();
        })
        .then((apiResponse: ApiBookingResponse) => {
          if (apiResponse.success && apiResponse.data) {
            setBookingDetails(apiResponse.data);
          } else {
            setError(apiResponse.message || 'Failed to load booking details.');
            console.error('API error:', apiResponse.message);
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch booking details.');
          console.error('Fetch error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setError('Booking ID not found in URL.');
    }
  }, [bookingId]);

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}><p>Loading booking details...</p></div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}><p>Error: {error}</p></div>;
  }

  if (!bookingDetails) {
    return <div style={{ padding: '20px', textAlign: 'center' }}><p>No booking details found.</p></div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        Booking Confirmation
      </h2>
      
      <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Booking ID:</strong> {bookingDetails.id}</p>
        <p><strong>Package:</strong> {bookingDetails.packageName}</p>
        <p><strong>Category:</strong> {bookingDetails.categoryName}</p>
        <p><strong>Guest Name:</strong> {bookingDetails.guest_name || 'N/A'}</p>
        <p><strong>Guest Email:</strong> {bookingDetails.guest_email || 'N/A'}</p>
        <p><strong>Guest Phone:</strong> {bookingDetails.guest_phone || 'N/A'}</p>
        <p><strong>Number of Travelers:</strong> {bookingDetails.total_people}</p>
        <p><strong>Start Date:</strong> {new Date(bookingDetails.start_date).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(bookingDetails.end_date).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ₹{bookingDetails.total_amount.toLocaleString('en-IN')}</p>
        <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: bookingDetails.status === 'confirmed' ? 'green' : 'orange' }}>{bookingDetails.status}</span></p>
        <p><strong>Payment Status:</strong> <span style={{ fontWeight: 'bold', color: bookingDetails.payment_status === 'paid' ? 'green' : 'red' }}>{bookingDetails.payment_status}</span></p>
        {bookingDetails.special_requests && <p><strong>Special Requests:</strong> {bookingDetails.special_requests}</p>}
        <p><strong>Booked On:</strong> {new Date(bookingDetails.created_at).toLocaleString()}</p>
      </div>

      <button 
        onClick={() => {
          // Placeholder for payment logic
          // For now, it could redirect to a payment page or show a modal
          alert('Pay Now clicked - Payment Gateway Integration (Not Implemented)');
          // Example: router.push(`/payment/process?bookingId=${bookingDetails.id}`);
        }}
        style={{
          display: 'block',
          width: '100%',
          marginTop: '20px', 
          padding: '12px 15px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default BookingConfirmationPage;
