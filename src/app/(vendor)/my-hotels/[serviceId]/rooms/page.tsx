// Path: /home/ubuntu/vendor_dev/component/(vendor)/my-hotels/[serviceId]/rooms/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Hotel,
  Package,
  BedDouble,
  Users, // For max guests
  DollarSign, // For price
  ImageIcon, // For images placeholder - not used in RoomCard but kept from original imports
  CheckSquare, // For amenities
  Bed, // For quantity available
  Home, // For return to dashboard - used in IncorrectVendorTypeCard
  Settings // For go to service management - used in IncorrectVendorTypeCard
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

interface VendorHotel {
  service_id: number;
  name: string;
}

interface RoomType {
  id: number;
  hotel_service_id: number;
  room_type_name: string;
  base_price: number | string;
  max_guests: number;
  quantity_available: number | null;
  amenities: string | null; // JSON string
  images: string | null; // URLs, assuming comma-separated or JSON array string
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

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
    <p className="text-sm">Your account must be verified before you can manage rooms. Please check your profile status or contact support.</p> {/* Removed gray-600, using parent color */}
    <Link href="/dashboard?tab=profile" className="text-sm text-blue-700 hover:text-blue-800 hover:underline mt-3 inline-block font-medium">Go to Profile</Link> {/* Adjusted link color */}
  </InfoCard>
);

const IncorrectVendorTypeCard = () => (
  <InfoCard title="Incorrect Vendor Type" icon={Package} className="bg-red-50 border-l-4 border-red-400 text-red-700"> {/* Styled as an error/alert */}
    <p className="text-sm">This page is for managing Hotel Rooms. Non-hotel vendors should use the Service Management section.</p> {/* Removed gray-600, using parent color */}
    <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4"> {/* Adjusted layout for links */}
      <Link href="/my-services" className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 hover:underline font-medium"> {/* Adjusted link color */}
        <Settings size={14} className="mr-1.5" /> Go to Service Management
      </Link>
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 hover:underline font-medium"> {/* Adjusted link color */}
        <Home size={14} className="mr-1.5" /> Return to Dashboard
      </Link>
    </div>
  </InfoCard>
);


// --- Room Card Component (Styled to match HotelCard) ---
const RoomTypeCard = ({
  room,
  hotelServiceId,
  onDelete,
  isDeleting,
}: {
  room: RoomType;
  hotelServiceId: string;
  onDelete: (roomId: number) => void;
  isDeleting: number | null;
}) => {
  const cardAnimation = "animate-fadeInUp";
  // let imageUrls: string[] = []; // Old parsing logic
  // try {
  //   if (room.images) {
  //     const parsedImages = JSON.parse(room.images);
  //     if (Array.isArray(parsedImages)) {
  //       imageUrls = parsedImages;
  //     }
  //   }
  // } catch (e) {
  //   // If not a JSON array, maybe it is a single URL or comma-separated, handle if needed
  //   if (typeof room.images === "string" && room.images.startsWith("http")) {
  //     imageUrls = [room.images];
  //   }
  //   console.warn("Could not parse room images string: ", room.images);
  // }

  // New logic: room.images from the API is already expected to be string[] | null due to backend parsing
  const imageUrls: string[] = Array.isArray(room.images) ? room.images : [];
  const primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

  let amenitiesList: string[] = [];
  try {
    if (room.amenities) {
      const parsedAmenities = JSON.parse(room.amenities);
      if (Array.isArray(parsedAmenities)) {
        amenitiesList = parsedAmenities.map(a => typeof a === "object" && a.name ? a.name : String(a));
      }
    }
  } catch (e) {
    console.warn("Could not parse room amenities string: ", room.amenities);
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col ${cardAnimation}`}> {/* Adjusted rounded corners, shadow, transition */}
      {primaryImageUrl ? (
        <img src={primaryImageUrl} alt={room.room_type_name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
          <BedDouble size={48} />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow"> {/* Added padding */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={room.room_type_name}>{room.room_type_name}</h3> {/* Adjusted margin-bottom to match HotelCard */}

        <div className="text-sm text-gray-600 space-y-1 mb-3 flex-grow"> {/* Adjusted space-y and margin-bottom */}
          <div className="flex items-center">
            <DollarSign size={14} className="mr-2 text-gray-500" /> {/* Styled icon */}
            <span>{Number(room.base_price).toLocaleString("en-IN", { style: "currency", currency: "INR" })} / night</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-2 text-gray-500" /> {/* Styled icon */}
            <span>Max {room.max_guests} guests</span>
          </div>
          <div className="flex items-center">
            <Bed size={14} className="mr-2 text-gray-500" /> {/* Styled icon */}
            <span>{room.quantity_available ?? "N/A"} available</span>
          </div>
          {amenitiesList.length > 0 && (
            <div className="flex items-start pt-1">
              <CheckSquare size={14} className="mr-2 text-gray-500 mt-0.5 flex-shrink-0" /> {/* Styled icon */}
              <span className="text-xs text-gray-500 truncate" title={amenitiesList.join(", ")}>Amenities: {amenitiesList.slice(0, 3).join(", ")} {amenitiesList.length > 3 ? "..." : ""}</span> {/* Styled text */}
            </div>
          )}
        </div>

        {/* Room card doesn't have a toggle like hotel card, only edit/delete. Keep justify-end */}
        <div className="flex items-center justify-end space-x-2 border-t border-gray-200 pt-4 mt-auto"> {/* Styled border top, padding top, space between buttons */}
          <Link href={`/my-hotels/${hotelServiceId}/rooms/${room.id}/edit`} className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-md hover:bg-indigo-50 transition-colors" title="Edit Room Type"> {/* Styled link with colors, hover, rounded corners */}
            <Edit size={18} />
          </Link>
          <button
            onClick={() => onDelete(room.id)}
            disabled={isDeleting === room.id}
            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-wait" /* Styled button with colors, hover, disabled, rounded corners */
            title="Delete Room Type"
          >
            {isDeleting === room.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Room List Component (Styled for overall page layout) ---
function RoomListContent() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
  const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
  const isVerified = vendorProfile?.verified === 1;
  const isHotelVendor = vendorProfile?.type === "hotel";

  const shouldFetchHotel = profileStatus === "success" && vendorProfile && isVerified && isHotelVendor && !!serviceId;
  const hotelApiUrl = shouldFetchHotel ? `/api/vendor/my-hotels/${serviceId}` : null;
  const { data: hotelData, error: hotelError, status: hotelStatus } = useFetch<VendorHotel | null>(hotelApiUrl);
  const hotelName = hotelData?.name || `Hotel (ID: ${serviceId})`;

  const shouldFetchRooms = hotelStatus === "success" && !!hotelData;
  const roomsApiUrl = shouldFetchRooms ? `/api/vendor/my-hotels/${serviceId}/rooms` : null;
  const { data: fetchedRooms, error: roomsError, status: roomsStatus } = useFetch<RoomType[] | null>(roomsApiUrl);

  useEffect(() => {
    if (roomsStatus === "success" && fetchedRooms) {
      setRoomTypes(fetchedRooms);
    }
  }, [roomsStatus, fetchedRooms]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
      router.replace("/login?reason=unauthorized_vendor"); // Adjusted path
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const isLoading = authLoading || profileStatus === "loading" || (shouldFetchHotel && hotelStatus === "loading") || (shouldFetchRooms && roomsStatus === "loading");

  // Render loading, error, or specific messages first
  if (isLoading) {
    return <LoadingSpinner text="Loading Room Types..." />;
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
          <p className="text-sm">Vendor profile not found. Cannot load rooms.</p> {/* Styled text */}
        </InfoCard>
      </div>
    );
  }

  if (!isVerified && profileStatus === "success") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
        <VerificationPendingCard />
      </div>
    );
  }
  if (!isHotelVendor && profileStatus === "success") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
        <IncorrectVendorTypeCard />
      </div>
    );
  }

  if (hotelStatus === "error" || (hotelStatus === "success" && !hotelData)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
        <InfoCard title="Error Loading Hotel" icon={AlertTriangle} className="max-w-md w-full"> {/* Added max-width */}
          <p className="text-red-600 text-sm">Error loading hotel details: {hotelError?.message || "Hotel not found or permission denied."}</p> {/* Styled text */}
          <Link href="/my-hotels" className="text-sm text-blue-700 hover:text-blue-800 hover:underline mt-3 inline-block font-medium">Return to Hotel List</Link> {/* Adjusted link color */}
        </InfoCard>
      </div>
    );
  }

  if (roomsStatus === "error" && shouldFetchRooms) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-10 bg-gray-50"> {/* Added outer container styling */}
        <InfoCard title="Error Loading Rooms" icon={AlertTriangle} className="max-w-md w-full"> {/* Added max-width */}
          <p className="text-red-600 text-sm">Error loading room types: {roomsError?.message || "Unknown error"}</p> {/* Styled text */}
        </InfoCard>
      </div>
    );
  }


  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm("Are you sure you want to delete this room type? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(roomId);
    try {
      const response = await fetch(`/api/vendor/my-hotels/${serviceId}/rooms/${roomId}`, {
        method: "DELETE",
      });
      const result: ApiResponse = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete room type");
      }
      toast({ title: "Success", description: "Room type deleted successfully." });
      setRoomTypes((prev) => prev.filter((r) => r.id !== roomId));
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Could not delete room type.",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Main content rendering
  return (
    <div className="space-y-6 py-6"> {/* Added vertical spacing and padding */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"> {/* Added bottom margin */}
        <div>
          
          <Link
            href={`/my-hotels`}
            className="inline-flex items-center bg-blue-600 text-white px-2 py-0.5  text-sm font-medium hover:bg-blue-700 transition-colors duration-150 shadow-md animate-fadeIn"
            style={{ borderRadius: '0.5rem' }}
          >
            <ArrowLeft size={14} className="mr-2" /> Back to Hotel
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 animate-fadeInUp">Manage Rooms: {hotelName}</h1> {/* Increased font size to match dashboard title */}
        </div>
        {isVerified && isHotelVendor && (
          <Link
            href={`/my-hotels/${serviceId}/rooms/add`}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5  text-sm font-medium hover:bg-blue-700 transition-colors duration-150 shadow-md animate-fadeIn" 
            style={{ borderRadius: '0.5rem' }}
          >
            <PlusCircle size={18} className="mr-2" /> Add New Room Type
          </Link>
        )}
      </div>

      {isVerified && isHotelVendor && roomsStatus !== "loading" && (
        roomTypes.length === 0 && roomsStatus === "success" ? (
          <InfoCard className="text-center"> {/* Centered text within card */}
            <div className="py-8"> {/* Added vertical padding */}
              <BedDouble size={48} className="mx-auto text-gray-400 mb-4" /> {/* Centered icon */}
              <p className="text-gray-500 text-lg font-medium">No room types found for {hotelName}.</p> {/* Styled text */}
              <p className="text-gray-400 text-sm mt-1">Click &quot;Add New Room Type&quot; to get started.</p> {/* Styled text */}
            </div>
          </InfoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Styled grid */}
            {roomTypes.map((room) => (
              <RoomTypeCard
                key={room.id}
                room={room}
                hotelServiceId={serviceId}
                onDelete={handleDeleteRoom}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )
      )}
      {isVerified && isHotelVendor && roomsStatus === "loading" && <LoadingSpinner text="Loading room types..." />}

      {/* TODO: Add Pagination if necessary */}
    </div>
  );
}

// This is the default export function that renders the main content wrapped in Suspense
export default function VendorHotelRoomsPage() {
  return (
    // Added overall page container styling here to match dashboard layout
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 py-8"> {/* Added background, padding */}
      <Suspense fallback={<LoadingSpinner text="Loading Rooms Page..." />}>
        <RoomListContent />
      </Suspense>
    </div>
  );
}