// Path: .\src\app\vendor\dashboard\page.tsx
'use client';
export const dynamic = 'force-dynamic'
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image'; // Not used in the provided snippet, but kept from original
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Calendar, Clock, User as UserIconLucide, MapPin, Phone, Mail, Shield, Package, Activity, Settings, LogOut, Home, Users as UsersIcon, FileText, Star, Loader2, AlertTriangle, Hotel, Bike, Anchor, Edit3, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // This should be useVendorAuth based on other files
import { useFetch } from '@/hooks/useFetch';

// --- Interfaces (assuming these are unchanged) ---
interface AuthUser {
    id: string | number;
    email: string;
    first_name?: string;
    last_name?: string;
    role_id?: number;
}
interface VendorProfile {
    id: number;
    user_id: number;
    business_name: string;
    type: string; // e.g., 'hotel', 'rental', 'activity'
    address: string | null;
    verified: number; // 0 or 1
    email?: string;
    phone?: string;
    created_at?: string;
    profile_image?: string | null;
    description?: string | null;
}
interface GetVendorProfileResponse { success: boolean; data: VendorProfile | null; message?: string; }

interface VendorStats {
    totalServices: number;
    activeBookings: number;
    totalEarnings: number;
    reviewScore: number | null;
}

interface VendorService {
    id: number;
    name: string;
    price: string | number;
    duration?: string;
    bookings_count?: number;
    rating?: number | null;
    is_active: number;
}

type VendorBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
interface VendorBooking {
    id: number | string;
    serviceOrPackageName: string;
    customerName: string;
    start_date: string;
    end_date?: string;
    total_people: number;
    total_amount: number;
    net_amount: number;
    status: VendorBookingStatus;
}

interface VendorReview {
    id: number;
    serviceName: string;
    customerName: string;
    rating: number;
    comment: string | null;
    created_at: string;
}
// --- End Interfaces ---


// --- LoadingSpinner Component ---
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span>{text}</span>
    </div>
);
// --- End Loading Spinner ---

// --- Helper Functions (assuming these are unchanged) ---
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return 'Invalid Date';
    }
};
const getBookingStatusColor = (status: VendorBookingStatus): string => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default:
            console.warn(`Unknown booking status in getBookingStatusColor: ${status}`);
            return 'bg-gray-100 text-gray-800';
    }
};
// --- End Helper Functions ---

// --- Verification Pending Component (can be used within a card) ---
const VerificationPendingCard = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out animate-fadeIn">
        <div className="flex">
            <div className="py-1"><AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" /></div>
            <div>
                <p className="font-bold text-lg">Verification Pending</p>
                <p className="text-sm">Your account is currently under review. Full access to service management features will be enabled upon verification. You can still update your profile information.</p>
            </div>
        </div>
    </div>
);
// --- End Verification Pending Component ---

// --- Card Component (Generic for styling) ---
const InfoCard = ({ title, children, className = '', icon: Icon }: { title?: string, children: React.ReactNode, className?: string, icon?: React.ElementType }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-fadeIn ${className}`}>
        {title && (
            <div className="flex items-center mb-4">
                {Icon && <Icon className="h-6 w-6 text-blue-600 mr-3" />}
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            </div>
        )}
        {children}
    </div>
);

// --- Main Dashboard Content Component ---
function VendorDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview'; // Get active tab from URL query

    const { user: authUser, isLoading: authLoading, isAuthenticated, logout: originalLogout } = useAuth() as {
        user: AuthUser | null;
        isLoading: boolean;
        isAuthenticated: boolean;
        logout: () => Promise<void>;
    };

    const logout = async () => {
        await originalLogout();
        router.push('/login'); // Ensure this path is correct for vendor login
    };

    const userId = authUser?.id;
    const profileApiUrl = userId ? `/api/vendors/profile?userId=${userId}` : null;
    const profileFetchResult = useFetch<VendorProfile | null>(profileApiUrl);
    const currentVendorProfile = profileFetchResult.data;

    const shouldFetchOtherData = profileFetchResult.status === 'success' && !!userId && currentVendorProfile?.verified === 1;

    const statsApiUrl = shouldFetchOtherData ? `/api/vendors/stats?userId=${userId}` : null;
    const servicesApiUrl = shouldFetchOtherData ? `/api/vendors/services?providerUserId=${userId}&limit=5` : null;
    const bookingsApiUrl = shouldFetchOtherData ? `/api/vendors/bookings?vendorUserId=${userId}&limit=5` : null;
    const reviewsApiUrl = shouldFetchOtherData ? `/api/vendors/reviews?vendorUserId=${userId}&limit=3` : null;

    const { data: vendorStats, error: statsError, status: statsStatus } = useFetch<VendorStats | null>(statsApiUrl);
    const { data: vendorServices, error: servicesError, status: servicesStatus } = useFetch<VendorService[] | null>(servicesApiUrl);
    const { data: vendorBookings, error: bookingsError, status: bookingsStatus } = useFetch<VendorBooking[] | null>(bookingsApiUrl);
    const { data: vendorReviews, error: reviewsError, status: reviewsStatus } = useFetch<VendorReview[] | null>(reviewsApiUrl);

    const statsData = vendorStats ?? { totalServices: 0, activeBookings: 0, totalEarnings: 0, reviewScore: null };
    const servicesData = vendorServices || [];
    const bookingsData = vendorBookings || [];
    const reviewsData = vendorReviews || [];


    useEffect(() => {
        if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
            router.replace('/login?reason=unauthorized_vendor');
        }
    }, [authLoading, isAuthenticated, authUser, router]);

    const isAuthOrProfileLoading = authLoading || profileFetchResult.status === 'loading';
    let criticalError: Error | null = null;
    if (!authLoading) {
        if (!isAuthenticated || authUser?.role_id !== 3) {
            criticalError = new Error("Access Denied: You do not have permission to view this page.");
        } else if (profileFetchResult.status === 'error') {
            criticalError = profileFetchResult.error || new Error('Failed to load vendor profile data.');
        }
    }

    if (isAuthOrProfileLoading) {
        return <LoadingSpinner text="Loading Vendor Dashboard..." />;
    }

    if (criticalError) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50">
                <InfoCard className="max-w-md w-full">
                    <div className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-red-600 mb-3">Access Denied or Error</h2>
                        <p className="text-gray-700 mb-6 text-sm">{criticalError.message}</p>
                        <button onClick={logout} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 text-sm font-medium">Logout and Sign In Again</button>
                    </div>
                </InfoCard>
            </div>
        );
    }

    if (profileFetchResult.status === 'success' && currentVendorProfile === null) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50" style={{ borderRadius: '0.5rem' }}>
                <InfoCard className="max-w-md w-full">
                    <div className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-orange-600 mb-3">Profile Not Found</h2>
                        <p className="text-gray-700 mb-6 text-sm">Could not retrieve your vendor profile information. Please contact support.</p>
                        <button onClick={logout} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 text-sm font-medium">Logout</button>
                    </div>
                </InfoCard>
            </div>
        );
    }

    if (profileFetchResult.status === 'success' && typeof currentVendorProfile === 'undefined') {
        return <LoadingSpinner text="Finalizing dashboard..." />;
    }


    const isVerified = currentVendorProfile?.verified === 1;
    const isHotelVendor = currentVendorProfile?.type === 'hotel';

    // --- Render Tab Content Logic ---
    const renderOverviewContent = () => (
        <div className="space-y-6">
            {!isVerified && <VerificationPendingCard />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <InfoCard className="hover:border-blue-500 border-2 border-transparent">
                    <div className="flex items-center mb-3">
                        <div className={`p-3 rounded-full mr-4 ${isHotelVendor ? 'bg-indigo-100' : 'bg-blue-100'}`}>
                            {isHotelVendor ? <Hotel className="h-6 w-6 text-indigo-600" /> : <Package className="h-6 w-6 text-blue-600" />}
                        </div>
                        <div> <p className="text-sm text-gray-500">Total {isHotelVendor ? 'Hotels' : 'Services'}</p> <h3 className="text-2xl font-bold text-gray-800">{statsStatus === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : statsData.totalServices}</h3> </div>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full"><div className={`h-1.5 ${isHotelVendor ? 'bg-indigo-500' : 'bg-blue-500'} rounded-full`} style={{ width: statsData.totalServices > 0 ? '100%' : '0%' }}></div></div>
                </InfoCard>
                <InfoCard className="hover:border-green-500 border-2 border-transparent">
                    <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full mr-4"> <Calendar className="h-6 w-6 text-green-600" /> </div>
                        <div> <p className="text-sm text-gray-500">Active Bookings</p> <h3 className="text-2xl font-bold text-gray-800">{statsStatus === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : statsData.activeBookings}</h3> </div>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-green-500 rounded-full" style={{ width: statsData.activeBookings > 0 ? '75%' : '0%' }}></div></div>
                </InfoCard>
                <InfoCard className="hover:border-purple-500 border-2 border-transparent">
                    <div className="flex items-center mb-3">
                        <div className="bg-purple-100 p-3 rounded-full mr-4"> <Star className="h-6 w-6 text-purple-600" /> </div>
                        <div> <p className="text-sm text-gray-500">Avg. Rating</p> <h3 className="text-2xl font-bold text-gray-800">{statsStatus === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : (statsData.reviewScore ? `${statsData.reviewScore.toFixed(1)}/5` : 'N/A')}</h3> </div>
                    </div>
                    {/* This width calculation might need adjustment based on actual rating scale */}
                    <div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-purple-500 rounded-full" style={{ width: `${(statsData.reviewScore || 0) / 5 * 100}%` }}></div></div>
                </InfoCard>
                <InfoCard className="hover:border-yellow-500 border-2 border-transparent">
                    <div className="flex items-center mb-3">
                        <div className="bg-yellow-100 p-3 rounded-full mr-4"> <FileText className="h-6 w-6 text-yellow-600" /> </div>
                        <div> <p className="text-sm text-gray-500">Total Earnings</p> <h3 className="text-2xl font-bold text-gray-800">{statsStatus === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : `₹${statsData.totalEarnings.toLocaleString('en-IN')}`}</h3> </div>
                    </div>
                    {/* This width calculation might need adjustment based on actual earnings scale */}
                    <div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-yellow-500 rounded-full" style={{ width: statsData.totalEarnings > 0 ? '85%' : '0%' }}></div></div>
                </InfoCard>
            </div>

            {isVerified && (
                <InfoCard title="Manage Your Business" icon={Briefcase}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Modified Link elements with inline styles */}
                        <Link href={isHotelVendor ? "/my-hotels/add" : "/my-services/add"}
                            className="block bg-blue-50 hover:bg-blue-100 p-4 transition-colors duration-150 text-blue-700 font-medium"
                            style={{ borderRadius: '0.5rem' }} // Added inline style for rounded-lg (8px)
                        >
                            <div className="flex items-center">
                                {isHotelVendor ? <Hotel size={20} className="mr-2" /> : <Package size={20} className="mr-2" />}
                                Add New {isHotelVendor ? 'Hotel' : 'Service'}
                            </div>
                        </Link>
                        <Link href={isHotelVendor ? "/my-hotels" : "/my-services"}
                            className="block bg-green-50 hover:bg-green-100 p-4 transition-colors duration-150 text-green-700 font-medium"
                            style={{ borderRadius: '0.5rem' }}
                        >
                            <div className="flex items-center">
                                <Settings size={20} className="mr-2" />
                                Manage All {isHotelVendor ? 'Hotels' : 'Services'}
                            </div>
                        </Link>
                        <Link href="/inventory"
                            className="block bg-indigo-50 hover:bg-indigo-100 p-4 transition-colors duration-150 text-indigo-700 font-medium"
                            style={{ borderRadius: '0.5rem' }}
                        >
                            <div className="flex items-center">
                                <Calendar size={20} className="mr-2" />
                                Inventory Calendar
                            </div>
                        </Link>
                    </div>
                </InfoCard>
            )}

            {isVerified && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard title="Recent Bookings" icon={CalendarCheck}>
                        {bookingsStatus === 'loading' && <LoadingSpinner text="Loading bookings..." />}
                        {bookingsStatus === 'error' && <p className="text-sm text-red-600">Error: {bookingsError?.message || 'Could not load bookings.'}</p>}
                        {bookingsStatus === 'success' && bookingsData.length > 0 ? (
                            <>
                                <div className="overflow-x-auto -mx-6">
                                    <table className="min-w-full text-sm">
                                        <thead> <tr className="border-b"> <th className="py-2 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service/Pkg</th> <th className="py-2 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th> <th className="py-2 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th> <th className="py-2 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> </tr> </thead>
                                        <tbody>
                                            {bookingsData.map(booking => (
                                                <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="py-3 px-6 font-medium text-gray-700 truncate max-w-[150px]">{booking.serviceOrPackageName}</td>
                                                    <td className="py-3 px-6 text-gray-600">{formatDate(booking.start_date)}</td>
                                                    <td className="py-3 px-6 text-gray-600">₹{(booking.net_amount ?? booking.total_amount ?? 0).toLocaleString('en-IN')}</td>
                                                    <td className="py-3 px-6"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBookingStatusColor(booking.status)}`}>{booking.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-right">
                                    <Link href="/manage-bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"> View all bookings → </Link>
                                </div>
                            </>
                        ) : bookingsStatus === 'success' ? (<p className="text-sm text-gray-500 text-center py-4">No recent bookings.</p>) : null}
                    </InfoCard>

                    <InfoCard title="Recent Reviews" icon={Star}>
                        {reviewsStatus === 'loading' && <LoadingSpinner text="Loading reviews..." />}
                        {reviewsStatus === 'error' && <p className="text-sm text-red-600">Error: {reviewsError?.message || 'Could not load reviews.'}</p>}
                        {reviewsStatus === 'success' && reviewsData.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {reviewsData.map(review => (
                                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <div>
                                                    <p className="font-semibold text-gray-700 text-sm">{review.serviceName}</p>
                                                    <p className="text-xs text-gray-500">by {review.customerName}</p>
                                                </div>
                                                <div className="flex items-center text-sm text-yellow-500">
                                                    {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'stroke-current'} />))}
                                                </div>
                                            </div>
                                            {review.comment && <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md">"{review.comment}"</p>}
                                            <p className="text-xs text-gray-400 mt-1.5 text-right">{formatDate(review.created_at)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-right">
                                    <Link href="/dashboard?tab=reviews" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"> View all reviews → </Link>
                                </div>
                            </>
                        ) : reviewsStatus === 'success' ? (<p className="text-sm text-gray-500 text-center py-4">No recent reviews.</p>) : null}
                    </InfoCard>
                </div>
            )}
        </div>
    );


    const renderProfileContent = () => (
        <InfoCard title="Business Profile" icon={UserIconLucide}>
            {currentVendorProfile ? (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><label className="text-xs font-medium text-gray-500 block mb-1">Business Name</label><p className="text-gray-800 text-sm">{currentVendorProfile.business_name || 'N/A'}</p></div>
                        <div><label className="text-xs font-medium text-gray-500 block mb-1">Type</label><p className="text-gray-800 text-sm capitalize">{currentVendorProfile.type || 'N/A'}</p></div>
                        <div><label className="text-xs font-medium text-gray-500 block mb-1">Registered Email</label><p className="text-gray-800 text-sm">{currentVendorProfile.email || authUser?.email || 'N/A'}</p></div>
                        <div><label className="text-xs font-medium text-gray-500 block mb-1">Contact Phone</label><p className="text-gray-800 text-sm">{currentVendorProfile.phone || 'N/A'}</p></div>
                        <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 block mb-1">Address</label><p className="text-gray-800 text-sm">{currentVendorProfile.address || 'Not Provided'}</p></div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1">Verification Status</label>
                            <p className={`text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {isVerified ? <Shield size={14} className="mr-1.5" /> : <Clock size={14} className="mr-1.5" />}
                                {isVerified ? 'Verified' : 'Pending Verification'}
                            </p>
                        </div>
                    </div>
                    <div className="pt-5 text-right border-t border-gray-200 mt-3">
                        {/* This button doesn't navigate, so it would need an onClick handler to open an edit modal or navigate */}
                        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-150 flex items-center ml-auto">
                            <Edit3 size={16} className="mr-2" /> Edit Profile
                        </button>
                    </div>
                </div>
            ) : <LoadingSpinner text="Loading profile..." />}
        </InfoCard>
    );

    const renderReviewsContent = () => (
        <InfoCard title="All Reviews" icon={Star}>
            {/* Placeholder for full reviews list - This would typically involve pagination and more robust fetching */}
            {reviewsStatus === 'loading' && <LoadingSpinner text="Loading reviews..." />}
            {reviewsStatus === 'error' && <p className="text-sm text-red-600">Error: {reviewsError?.message || 'Could not load reviews.'}</p>}
            {reviewsStatus === 'success' && reviewsData.length > 0 ? (
                <div className="space-y-6">
                    {reviewsData.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-1.5">
                                <div>
                                    <p className="font-semibold text-gray-800">{review.serviceName}</p>
                                    <p className="text-xs text-gray-500">by {review.customerName}</p>
                                </div>
                                <div className="flex items-center text-sm text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={16} className={i < review.rating ? 'fill-current' : 'stroke-current'} />))}
                                </div>
                            </div>
                            {review.comment && <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-md my-2">"{review.comment}"</p>}
                            <p className="text-xs text-gray-400 mt-1.5 text-right">{formatDate(review.created_at)}</p>
                        </div>
                    ))}
                </div>
            ) : reviewsStatus === 'success' ? (<p className="text-sm text-gray-500 text-center py-6">No reviews found.</p>) : null}
        </InfoCard>
    );


    const renderContentByTab = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverviewContent();
            case 'profile':
                return renderProfileContent();
            case 'reviews':
                return renderReviewsContent();
            // Cases for 'services' and 'bookings' are handled by redirects in VendorTopNav if clicked directly,
            // or would be separate pages (/my-services, /manage-bookings) which are not part of this dashboard page's tabs.
            default:
                // Fallback to overview if tab is unknown or not specified
                if (activeTab !== 'overview') router.replace('/dashboard?tab=overview');
                return renderOverviewContent();
        }
    };

    // --- Main Return Structure for the page content ---
    // The overall page structure (min-h-screen, flex) is now handled by VendorLayoutContent
    // This component just renders the specific content for the dashboard page.
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 animate-fadeInUp">Welcome, {currentVendorProfile?.business_name || authUser?.first_name || 'Vendor'}!</h1>
            {/* The old sidebar is removed. Navigation is handled by VendorTopNav and query params. */}
            {/* Render content based on the activeTab from URL query param */}
            <Suspense fallback={<LoadingSpinner text="Loading content..." />}>
                {renderContentByTab()}
            </Suspense>
        </div>
    );
}

// --- Suspense Wrapper for the Page ---
export default function VendorDashboardPage() {
    return (
        // Suspense boundary for client components that use useSearchParams
        <Suspense fallback={<LoadingSpinner text="Loading Dashboard Page..." />}>
            <VendorDashboardContent />
        </Suspense>
    );
}

