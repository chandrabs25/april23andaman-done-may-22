'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
// Assuming you might want to use some UI components from shadcn/ui if available in project
import { Loader2, CheckCircle, XCircle, AlertTriangle, ExternalLinkIcon, HomeIcon } from 'lucide-react';

// --- Theme Imports ---
import {
  neutralBgLight, neutralText, neutralTextLight, neutralBorder,
  infoText, infoIconColor, infoBg, infoBorder,
  successText, successIconColor, successBg, successBorder,
  errorText, errorIconColor, errorBg, errorBorder,
  warningText, warningIconColor, warningBg, warningBorder, // For pending/attention states
  buttonPrimaryStyle, buttonSecondaryStyleHero,
  cardBaseStyle, sectionPadding, sectionHeadingStyle,
} from '@/styles/26themeandstyle';
// --- End Theme Imports ---

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
    const { isAuthenticated } = useAuth();
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

    let statusCardBg = infoBg;
    let statusCardBorder = infoBorder;
    let statusIconColor = infoIconColor;
    let statusTitleColor = infoText;
    let StatusIcon = Loader2; // Default to loading/info

    if (!isLoading) {
        if (statusMessage.includes("successful")) {
            statusCardBg = successBg;
            statusCardBorder = successBorder;
            statusIconColor = successIconColor;
            statusTitleColor = successText;
            StatusIcon = CheckCircle;
        } else if (errorDetails || statusMessage.includes("failed")) {
            statusCardBg = errorBg;
            statusCardBorder = errorBorder;
            statusIconColor = errorIconColor;
            statusTitleColor = errorText;
            StatusIcon = XCircle;
        } else if (statusMessage.includes("still pending")) {
            statusCardBg = warningBg;
            statusCardBorder = warningBorder;
            statusIconColor = warningIconColor;
            statusTitleColor = warningText;
            StatusIcon = AlertTriangle;
        }
    }
    
    const showButtons = !isLoading && (errorDetails || statusMessage.includes("still pending") || statusMessage.includes("failed") || statusMessage.includes("successful"));

    return (
        <div className={`min-h-[70vh] ${sectionPadding} flex flex-col justify-center items-center text-center`}>
            <h1 className={`${sectionHeadingStyle} text-3xl md:text-4xl mb-8`}>Payment Status</h1>

            <div className={`${cardBaseStyle} w-full max-w-lg p-6 md:p-8 text-center ${statusCardBg} border-2 ${statusCardBorder}`}>
                <StatusIcon size={64} className={`mb-5 mx-auto ${statusIconColor} ${isLoading ? 'animate-spin' : ''}`} />
                
                <p className={`text-xl md:text-2xl font-semibold mb-3 min-h-[60px] ${statusTitleColor}`}>
                    {statusMessage}
                </p>

                {isLoading && <p className={`${neutralTextLight} text-sm`}>Verifying details, please hold on...</p>}

                {errorDetails && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${errorBg} border ${errorBorder} ${errorText} text-left whitespace-pre-wrap`}>
                        <strong>Details:</strong> {errorDetails}
                    </div>
                )}
            </div>

            {showButtons && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                    {statusMessage.includes("successful") && isAuthenticated ? (
                        <Link href="/user/bookings" className={`${buttonPrimaryStyle} w-full`}>
                           <ExternalLinkIcon size={18} className="mr-2" /> View My Bookings
                        </Link>
                    ) : statusMessage.includes("successful") && !isAuthenticated ? (
                        <Link href="/" className={`${buttonPrimaryStyle} w-full`}>
                           <HomeIcon size={18} className="mr-2" /> Go to Homepage
                        </Link>
                    ) : (
                        <>
                            <Link href="/packages" className={`${buttonPrimaryStyle} w-full bg-white hover:bg-gray-100 text-gray-700 border-gray-300`}>
                               <HomeIcon size={18} className="mr-2" /> Back to Packages
                            </Link>
                             <Link href="/contact" className={`${buttonPrimaryStyle} w-full`}>
                                Contact Support
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <div className={`${neutralBgLight} min-h-screen`}>
            <Suspense
                fallback={
                    <div className={`min-h-screen ${sectionPadding} flex flex-col justify-center items-center text-center ${neutralBgLight}`}>
                        <Loader2 size={48} className={`animate-spin ${infoIconColor} mb-4`} />
                        <h1 className={`${sectionHeadingStyle} text-2xl ${infoText}`}>
                            Loading Payment Details...
                        </h1>
                        <p className={`${neutralTextLight}`}>
                            Please wait a moment.
                        </p>
                    </div>
                }
            >
                <PaymentStatusContent />
            </Suspense>
        </div>
    );
}

