// Path: /home/ubuntu/vendor_dev/component/(vendor)/services/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import {
    PlusCircle,
    Edit,
    Trash2,
    ToggleLeft, // Not used in favor of Eye/EyeOff
    ToggleRight, // Not used in favor of Eye/EyeOff
    Loader2,
    AlertTriangle,
    Shield, // Not used in the provided code, but kept if needed elsewhere
    Package, // Used for general services / incorrect type
    Hotel, // Used for incorrect type (hotel vendor on services page)
    MapPin,
    Tag, // Used for service type
    DollarSign, // Used for price
    Eye, // Used for Active status toggle
    EyeOff, // Used for Inactive status toggle
    Home, // Used in IncorrectVendorTypeCard
    Settings // Used in IncorrectVendorTypeCard
} from "lucide-react";
import { toast } from "@/hooks/use-toast"; // Assuming use-toast is from shadcn/ui or similar

// --- Interfaces ---
interface AuthUser {
    id: string | number;
    role_id?: number;
}

interface VendorProfile {
    id: number;
    verified: number; // 0 or 1
    type: string; // e.g., hotel, rental, activity
}

interface VendorService {
    id: number;
    name: string;
    type: string;
    price: string | number;
    island_id: number;
    is_active: number; // 0 or 1
    amenities?: string | null; // JSON string - not displayed in this card, but part of interface
    description?: string | null; // not displayed in this card, but part of interface
    images?: string | null; // Optional images for the card, added for consistency if needed later
}

interface Island {
    id: number;
    name: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
}

// --- Helper function to parse JSON array string for images ---
const parseImageUrls = (jsonString: string | null | undefined): string[] => {
    if (!jsonString || typeof jsonString !== "string" || !jsonString.trim()) {
        return [];
    }
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
            return parsed.filter(url => url.trim() !== ""); // Filter out empty strings
        }
        // Handle case where it might be a single URL string not in an array (legacy or error)
        if (typeof parsed === 'string' && parsed.trim() !== "") {
            return [parsed.trim()];
        }
        return [];
    } catch (e) {
        // If JSON.parse fails, and it's not an array string,
        // but it is a non-empty string, treat it as a single URL.
        if (typeof jsonString === 'string' && jsonString.trim() && !jsonString.startsWith('[') && !jsonString.endsWith(']')) {
            const trimmedString = jsonString.trim();
            if (trimmedString) return [trimmedString];
        }
        console.warn("Failed to parse image URLs:", jsonString, e);
        return [];
    }
};

// --- Helper Components (Styled to match Dashboard) ---
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-700 text-base">{text}</span> {/* Added text styling */}
    </div>
);

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

const VerificationPendingCard = () => (
    <InfoCard title="Verification Pending" icon={AlertTriangle} className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700"> {/* Added specific styling from dashboard */}
        <p className="text-sm">Your account must be verified before you can manage services. Please check your profile status or contact support.</p> {/* Removed gray-600, using parent color */}
        <Link href="/dashboard?tab=profile" className="text-sm text-blue-700 hover:text-blue-800 hover:underline mt-3 inline-block font-medium">Go to Profile</Link> {/* Adjusted link color */}
    </InfoCard>
);

const IncorrectVendorTypeCard = () => (
    <InfoCard title="Incorrect Vendor Type" icon={Hotel} className="bg-red-50 border-l-4 border-red-400 text-red-700"> {/* Styled as an error/alert */}
        <p className="text-sm">This page is for managing Rentals and Activities. Hotel vendors should use the Hotel Management section.</p> {/* Removed gray-600, using parent color */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4"> {/* Adjusted layout for links */}
            <Link href="/my-hotels" className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 hover:underline font-medium"> {/* Adjusted link color */}
                <Hotel size={14} className="mr-1.5" /> Go to Hotel Management
            </Link>
            <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 hover:underline font-medium"> {/* Adjusted link color */}
                <Home size={14} className="mr-1.5" /> Return to Dashboard
            </Link>
        </div>
    </InfoCard>
);

// --- Service Card Component (Styled to match HotelCard) ---
const ServiceCard = ({
    service,
    islandName,
    onToggleActive,
    onDelete,
    isToggling,
    isDeleting,
}: {
    service: VendorService;
    islandName: string;
    onToggleActive: (serviceId: number, currentStatus: boolean) => void;
    onDelete: (serviceId: number) => void;
    isToggling: number | null;
    isDeleting: number | null;
}) => {
    const cardAnimation = "animate-fadeInUp"; // Keep entrance animation
    const imageUrls = parseImageUrls(service.images);
    const firstImage = imageUrls.length > 0 ? imageUrls[0] : null;

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col ${cardAnimation}`}>
            {firstImage ? (
                <img 
                    src={firstImage} 
                    alt={service.name || "Service image"} 
                    className="w-full h-48 object-cover" // Added styling for image
                    onError={(e) => { // Basic error handling: hide if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        // Optionally, replace with a placeholder:
                        // (e.target as HTMLImageElement).src = '/path/to/placeholder.png'; 
                    }}
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    <Package size={48} /> {/* Placeholder icon */}
                </div>
            )}
            <div className="p-5 flex flex-col flex-grow"> {/* Added padding */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={service.name}>{service.name}</h3> {/* Styled heading */}

                <div className="text-sm text-gray-600 space-y-1 mb-3 flex-grow"> {/* Styled details section, adjusted space-y and mb */}
                    <div className="flex items-center">
                        <Tag size={14} className="mr-2 text-gray-500" /> {/* Styled icon */}
                        <span className="capitalize">{service.type.replace("/", " - ")}</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign size={14} className="mr-2 text-gray-500" /> {/* Styled icon */}
                        <span>{Number(service.price).toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-gray-500" /> {/* Styled icon */}
                        <span className="truncate" title={islandName || `ID: ${service.island_id}`}>{islandName || `ID: ${service.island_id}`}</span>
                    </div>
                </div>

                <div className="mb-4"> {/* Added bottom margin */}
                    <button
                        onClick={() => onToggleActive(service.id, service.is_active === 1)}
                        disabled={isToggling === service.id}
                        className={`w-full flex items-center justify-center px-3 py-2  text-xs font-medium transition-colors ${service.is_active === 1 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} disabled:opacity-60 disabled:cursor-wait`}
                        style={{ borderRadius: '0.5rem' }}
                    >
                        {isToggling === service.id ? (
                            <Loader2 size={14} className="animate-spin mr-1.5" />
                        ) : service.is_active === 1 ? (
                            <Eye size={14} className="mr-1.5" />
                        ) : (
                            <EyeOff size={14} className="mr-1.5" />
                        )}
                        {service.is_active === 1 ? "Active" : "Inactive"}
                        {isToggling === service.id && "..."}
                    </button>
                </div>

                <div className="flex items-center justify-end space-x-2 border-t border-gray-200 pt-4 mt-auto"> {/* Styled border top, padding top, space between buttons */}
                    <Link href={`/my-services/${service.id}/edit`} className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-md hover:bg-indigo-50 transition-colors" title="Edit Service"> {/* Styled link with colors, hover, rounded corners */}
                        <Edit size={18} />
                    </Link>
                    <button
                        onClick={() => onDelete(service.id)}
                        disabled={isDeleting === service.id}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-wait" /* Styled button with colors, hover, disabled, rounded corners */
                        title="Delete Service"
                    >
                        {isDeleting === service.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Service List Component (Styled for overall page layout) ---
function ServiceListContent() {
    const router = useRouter();
    const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
        user: AuthUser | null;
        isLoading: boolean;
        isAuthenticated: boolean;
    };

    const [services, setServices] = useState<VendorService[]>([]);
    const [isToggling, setIsToggling] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
    const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
    const isVerified = vendorProfile?.verified === 1;
    const isHotelVendor = vendorProfile?.type === "hotel";

    // Only fetch services if profile loaded, verified, AND *NOT* a hotel vendor
    const shouldFetchServices = profileStatus === "success" && vendorProfile && isVerified && !isHotelVendor;
    const servicesApiUrl = shouldFetchServices ? `/api/vendor/my-services` : null;
    const { data: fetchedServices, error: servicesError, status: servicesStatus } = useFetch<VendorService[] | null>(servicesApiUrl);

    const { data: fetchedIslands, status: islandsStatus } = useFetch<Island[] | null>("/api/islands");
    const islandsMap = React.useMemo(() => {
        const map = new Map<number, string>();
        fetchedIslands?.forEach(island => map.set(island.id, island.name));
        return map;
    }, [fetchedIslands]);

    useEffect(() => {
        if (servicesStatus === "success" && fetchedServices) {
            setServices(fetchedServices);
        }
    }, [servicesStatus, fetchedServices]);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
            router.replace("/login?reason=unauthorized_vendor"); // Adjusted path
        }
    }, [authLoading, isAuthenticated, authUser, router]);

    const isLoading = authLoading || profileStatus === "loading" || (shouldFetchServices && servicesStatus === "loading") || islandsStatus === "loading";

    // Render loading, error, or specific messages first
    if (isLoading) {
        return <LoadingSpinner text="Loading Services..." />;
    }

    // Critical error/state handling styled with InfoCard
    if (profileStatus === "error") {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
                <InfoCard title="Error" icon={AlertTriangle} className="max-w-md w-full"> {/* Added max-width */}
                    <p className="text-red-600 text-sm">Error loading vendor profile: {profileError?.message || "Unknown error"}</p> {/* Styled text */}
                </InfoCard>
            </div>
        );
    }
    if (profileStatus === "success" && !vendorProfile) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
                <InfoCard title="Profile Not Found" icon={AlertTriangle} className="max-w-md w-full bg-orange-50 border-l-4 border-orange-400 text-orange-700"> {/* Styled card */}
                    <p className="text-sm">Vendor profile not found. Cannot load services.</p> {/* Styled text */}
                </InfoCard>
            </div>
        );
    }

    if (!isVerified && profileStatus === "success") { // Show only if profile loaded
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
                <VerificationPendingCard />
            </div>
        );
    }
    if (isHotelVendor && profileStatus === "success") { // Show only if profile loaded
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
                <IncorrectVendorTypeCard />
            </div>
        );
    }

    if (servicesStatus === "error" && shouldFetchServices) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
                <InfoCard title="Error Loading Services" icon={AlertTriangle} className="max-w-md w-full"> {/* Added max-width */}
                    <p className="text-red-600 text-sm">Error loading services: {servicesError?.message || "Unknown error"}</p> {/* Styled text */}
                </InfoCard>
            </div>
        );
    }

    const handleToggleActive = async (serviceId: number, currentStatus: boolean) => {
        setIsToggling(serviceId);
        try {
            const response = await fetch(`/api/vendor/my-services/${serviceId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            const result: ApiResponse = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update status");
            }
            toast({ title: "Success", description: `Service ${!currentStatus ? "activated" : "deactivated"}.` });
            setServices(prev => prev.map(s => s.id === serviceId ? { ...s, is_active: !currentStatus ? 1 : 0 } : s));
        } catch (error) {
            console.error("Error toggling service status:", error);
            toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Could not update service status." });
        } finally {
            setIsToggling(null);
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            return;
        }
        setIsDeleting(serviceId);
        try {
            const response = await fetch(`/api/vendor/my-services/${serviceId}`, {
                method: "DELETE",
            });
            const result: ApiResponse = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to delete service");
            }
            toast({ title: "Success", description: "Service deleted successfully." });
            setServices(prev => prev.filter(s => s.id !== serviceId));
        } catch (error) {
            console.error("Error deleting service:", error);
            toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Could not delete service." });
        } finally {
            setIsDeleting(null);
        }
    };

    // Main content rendering
    return (
        <div className="space-y-6 py-6" style={{ borderRadius: '0.5rem' }}> {/* Added vertical spacing and padding */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" style={{ borderRadius: '0.5rem' }}> {/* Added bottom margin */}
                <h1 className="text-3xl font-bold text-gray-800 animate-fadeInUp">Manage Services (Rentals & Activities)</h1> {/* Increased font size to match dashboard title */}
                {isVerified && !isHotelVendor && (
                    <Link
                        href="/my-services/add"
                        className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors duration-150 shadow-md animate-fadeIn" 
                        style={{ borderRadius: '0.5rem' }}
                    >
                        <PlusCircle size={18} className="mr-2" /> Add New Service
                    </Link>
                )}
            </div>

            {/* Render cards only if verified and not a hotel vendor, and services are loaded or loading */}
            {isVerified && !isHotelVendor && servicesStatus !== "loading" && (
                services.length === 0 && servicesStatus === "success" ? (
                    <InfoCard className="text-center"> {/* Centered text within card */}
                        <div className="py-8"> {/* Added vertical padding */}
                            <Package size={48} className="mx-auto text-gray-400 mb-4" /> {/* Centered icon */}
                            <p className="text-gray-500 text-lg font-medium">You haven&apos;t added any services yet.</p> {/* Styled text */}
                            <p className="text-gray-400 text-sm mt-1">Click &quot;Add New Service&quot; to get started.</p> {/* Styled text */}
                        </div>
                    </InfoCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Styled grid */}
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                islandName={islandsMap.get(service.island_id) || "Unknown Island"}
                                onToggleActive={handleToggleActive}
                                onDelete={handleDeleteService}
                                isToggling={isToggling}
                                isDeleting={isDeleting}
                            />
                        ))}
                    </div>
                )
            )}
            {isVerified && !isHotelVendor && servicesStatus === "loading" && <LoadingSpinner text="Loading your services..." />}

            {/* TODO: Add Pagination if necessary */}
        </div>
    );
}


// This is the default export function that renders the main content wrapped in Suspense
export default function VendorServicesPage() {
    return (
        // Added overall page container styling here to match dashboard layout
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 py-8"> {/* Added background, padding */}
            <Suspense fallback={<LoadingSpinner text="Loading Services Page..." />}>
                <ServiceListContent />
            </Suspense>
        </div>
    );
}