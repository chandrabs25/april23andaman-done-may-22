'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
// Assuming you might want to use some UI components from shadcn/ui if available in project
// For example: import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// --- Interface Definition ---
interface CheckStatusResponse {
  success: boolean;
  message: string;
  // Fields present on successful response from /api/bookings/check-payment-status
  merchantTransactionId?: string;
  phonePePaymentStatus?: string;
  phonePeTransactionState?: string;
  phonePeAmount?: number;
  bookingStatus?: string;
  paymentStatus?: string;
  // Fields present on error response from /api/bookings/check-payment-status
  phonePeCode?: string; // e.g., when PhonePe API itself returns success: false
  // errorDetail?: string; // If your general error responses include this
}
// --- End Interface Definition ---

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mtid = searchParams.get('mtid');

  const [statusMessage, setStatusMessage] = useState('Verifying payment status, please wait...');
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [currentPollAttempt, setCurrentPollAttempt] = useState(0); 
  const maxPolls = 5; // Max 5 retries for pending status

  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mtid) {
      setStatusMessage('Invalid payment session. Merchant Transaction ID is missing.');
      setIsLoading(false);
      setErrorDetails('No transaction ID found in URL.');
      return;
    }

    const checkStatus = async (attempt: number) => {
      setIsLoading(true); 
      // setErrorDetails(null); // Avoid clearing error if polling, so user sees last known error while pending
      setCurrentPollAttempt(attempt);

      try {
        const response = await fetch(`/api/bookings/check-payment-status?mtid=${mtid}`);
        // It's good practice to check response.ok before assuming response.json() will succeed
        if (!response.ok) {
            let errorMsg = `Error: ${response.status} ${response.statusText || 'Failed to fetch status'}`;
            try {
                // Type errorData to allow checking for a message property
                const errorData: { message?: string } = await response.json(); 
                errorMsg = errorData.message || errorMsg;
            } catch (e) { /* Ignore if error response is not JSON */ }
            
            setStatusMessage('Failed to verify payment status.');
            setErrorDetails(errorMsg);
            setIsLoading(false);
            if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current); // Stop polling on hard error
            return;
        }
        
        const data: CheckStatusResponse = await response.json();

        if (data.success) {
          if (data.phonePePaymentStatus === 'PAYMENT_SUCCESS' || data.bookingStatus === 'CONFIRMED') {
            setStatusMessage('Payment successful! Redirecting to your booking confirmation...');
            setErrorDetails(null); // Clear any previous errors on success
            setIsLoading(false); 
            if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
            pollingTimeoutRef.current = setTimeout(() => router.push(`/booking/confirmation/${mtid}`), 2000);
          } else if (data.phonePePaymentStatus === 'PAYMENT_PENDING' || data.bookingStatus === 'PENDING_PAYMENT') {
            if (attempt < maxPolls) {
              setStatusMessage(`Payment is pending. Checking again soon... (Attempt ${attempt + 1}/${maxPolls})`);
              // Keep previous errorDetails if any, or set to null if none now
              // setErrorDetails(null); // Or some info message about polling.
              if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
              pollingTimeoutRef.current = setTimeout(() => checkStatus(attempt + 1), 5000); // Poll every 5 seconds
            } else {
              setStatusMessage('Payment is still pending. We will update you once confirmed.');
              setErrorDetails('Your payment is taking longer than usual to confirm. Please check your email or "My Bookings" section later for updates.');
              setIsLoading(false);
            }
          } else { // Other non-successful terminal states from PhonePe (e.g. PAYMENT_FAILURE, PAYMENT_DECLINED)
            setStatusMessage('Payment failed.');
            setErrorDetails(data.message || `Gateway Status: ${data.phonePePaymentStatus || 'Unknown'}`);
            setIsLoading(false);
          }
        } else { // API call success was false (e.g. validation error like mtid not found by API)
          setStatusMessage('Failed to verify payment status.');
          setErrorDetails(data.message || 'Could not retrieve valid payment details from server.');
          setIsLoading(false);
        }
      } catch (error) { // Network error or JSON parsing error etc.
        console.error('Error checking payment status:', error);
        setStatusMessage('An error occurred while checking payment status.');
        setErrorDetails('A network or server error occurred. Please try refreshing or check back later.');
        setIsLoading(false);
      }
    };

    checkStatus(0); // Initial check

    return () => { 
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtid, router]); // currentPollAttempt is managed internally by checkStatus calls

  // Basic UI, can be enhanced with Card, Icons etc.
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '20px', color: '#333' }}>Payment Status</h1>
      
      {/* Can use lucide-react icons here if project has them */}
      {/* {isLoading && <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />}
      {!isLoading && statusMessage.includes("successful") && <CheckCircle className="h-10 w-10 text-green-500 mb-4" />}
      {!isLoading && (errorDetails || statusMessage.includes("failed")) && <XCircle className="h-10 w-10 text-red-500 mb-4" />}
      {!isLoading && statusMessage.includes("still pending") && <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />} */}

      <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '15px', minHeight: '50px' }}>{statusMessage}</p>
      
      {isLoading && <p style={{ color: '#777', fontStyle: 'italic' }}>Loading details...</p>}
      
      {errorDetails && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ffcccc', backgroundColor: '#fff0f0', borderRadius: '5px', color: '#cc0000' }}>
          <strong>Error Details:</strong> {errorDetails}
        </div>
      )}
      
      {!isLoading && (errorDetails || statusMessage.includes("still pending") || statusMessage.includes("failed")) && (
        <div style={{ marginTop: '30px' }}>
          <Link href="/packages" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', marginRight: '10px' }}>
            Go back to Packages
          </Link>
          <Link href="/user/bookings" style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            View My Bookings
          </Link>
        </div>
      )}
       {!isLoading && statusMessage.includes("successful!") && (
         <div style={{ marginTop: '30px' }}>
           <Link href="/user/bookings" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
             View My Bookings
           </Link>
         </div>
       )}
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>
            Loading Payment Details...
          </h1>
          <p style={{ fontStyle: 'italic', color: '#777' }}>
            Please wait...
          </p>
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}

