// Path: /home/ubuntu/vendor_frontend_rev2/test 2/src/app/(vendor)/my-hotels/[serviceId]/rooms/add/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, ArrowLeft, Hotel, Package, BedDouble } from "lucide-react";
import Link from "next/link";
import { CheckboxGroup } from "@/components/CheckboxGroup"; // Import CheckboxGroup
import { ImageUploader } from "@/components/ImageUploader"; // Import our new ImageUploader

// --- Interfaces ---
interface AuthUser {
  id: string | number;
  role_id?: number;
}

interface VendorProfile {
  id: number;
  verified: number;
  type: string;
}

interface VendorHotel {
  service_id: number;
  name: string;
}

// Updated Form state interface (using arrays for multi-select)
interface RoomTypeFormData {
  room_type_name: string;
  base_price: string;
  max_guests: string;
  quantity_available: string;
  amenities: string[]; // Use array for CheckboxGroup
  images: string[]; // Use array for image URLs from ImageUploader
}

interface ApiResponse {
    success: boolean;
    message?: string;
}

// --- Define Options for Checkbox Groups (Room Amenities) ---
const roomAmenityOptions = [
  { label: "Wi-Fi", value: "wifi" },
  { label: "Air Conditioning", value: "ac" },
  { label: "Heating", value: "heating" },
  { label: "Television", value: "tv" },
  { label: "Mini Bar", value: "minibar" },
  { label: "Coffee/Tea Maker", value: "coffee_maker" },
  { label: "Hair Dryer", value: "hair_dryer" },
  { label: "Iron & Board", value: "iron" },
  { label: "Balcony/Patio", value: "balcony" },
  { label: "Ensuite Bathroom", value: "ensuite" },
  { label: "Work Desk", value: "desk" },
  { label: "Safe", value: "safe" },
];

// --- Helper Components (LoadingSpinner, VerificationPending, IncorrectVendorType) ---
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span>{text}</span>
    </div>
);

const VerificationPending = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md max-w-2xl mx-auto my-6">
        <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <h3 className="font-semibold">Verification Pending</h3>
        </div>
        <p className="mt-2 text-sm">Your vendor profile is awaiting verification. You cannot manage services until verified.</p>
    </div>
);
const IncorrectVendorType = () => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md max-w-2xl mx-auto my-6">
        <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <h3 className="font-semibold">Incorrect Vendor Type</h3>
        </div>
        <p className="mt-2 text-sm">This section is for Hotel vendors only.</p>
    </div>
);

// --- Main Add Room Form Component ---
function AddRoomForm() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };

  const [formData, setFormData] = useState<RoomTypeFormData>({
    room_type_name: "",
    base_price: "",
    max_guests: "",
    quantity_available: "",
    amenities: [], // Initialize as empty array
    images: [], // Initialize as empty array
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Vendor Profile
  const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
  const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
  const isVerified = vendorProfile?.verified === 1;
  const isHotelVendor = vendorProfile?.type === "hotel";

  // 2. Fetch Parent Hotel Details
  const shouldFetchHotel = profileStatus === "success" && vendorProfile && isVerified && isHotelVendor && !!serviceId;
  const hotelApiUrl = shouldFetchHotel ? `/api/vendor/my-hotels/${serviceId}` : null;
  const { data: hotelData, error: hotelError, status: hotelStatus } = useFetch<VendorHotel | null>(hotelApiUrl);
  const hotelName = hotelData?.name || `Hotel ${serviceId}`;

  // --- Authorization & Loading Checks ---
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
      router.replace("/auth/signin?reason=unauthorized_vendor");
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const isLoading = authLoading || profileStatus === "loading" || (shouldFetchHotel && hotelStatus === "loading");

  if (isLoading) {
    return <LoadingSpinner text="Loading Add Room Form..." />;
  }

  // Handle Profile Fetch Error/Not Found
  if (profileStatus === "error" || (profileStatus === "success" && !vendorProfile)) {
    return <div className="text-red-600">Error loading vendor profile or profile not found.</div>;
  }

  // --- Conditional Rendering based on Verification & Type ---
  if (!isVerified) {
    return <VerificationPending />;
  }
  if (!isHotelVendor) {
    return <IncorrectVendorType />;
  }

  // Handle Hotel Fetch Error or Not Found
  if (hotelStatus === "error" || (hotelStatus === "success" && !hotelData)) {
    return (
      <div className="text-red-600">
        Error loading hotel details: {hotelError?.message || "Hotel not found or permission denied."}
        <br />
        <Link href="/my-hotels" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Return to Hotel List
        </Link>
      </div>
    );
  }

  // --- Form Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Specific handler for CheckboxGroup component
  const handleArrayChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  // Handler for images uploaded via ImageUploader
  const handleImagesUploaded = (imageUrls: string[]) => {
    setFormData((prev) => ({ ...prev, images: imageUrls }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.room_type_name || !formData.base_price || !formData.max_guests || isNaN(parseFloat(formData.base_price)) || parseFloat(formData.base_price) <= 0 || isNaN(parseInt(formData.max_guests, 10)) || parseInt(formData.max_guests, 10) <= 0) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please fill Room Type Name, Base Price, and Max Guests with valid numbers." });
        setIsSubmitting(false);
        return;
    }

    // Robust parsing for quantity_available
    const rawQty = formData.quantity_available;
    const parsedQty = parseInt(rawQty, 10);
    const finalQty = (!rawQty || rawQty.trim() === "" || isNaN(parsedQty)) ? null : parsedQty;

    // Prepare API payload
    const payload = {
      room_type_name: formData.room_type_name,
      base_price: parseFloat(formData.base_price),
      max_guests: parseInt(formData.max_guests, 10),
      quantity_available: finalQty, // Use the robustly parsed value
      amenities: JSON.stringify(formData.amenities || []),
      images: (formData.images && formData.images.length > 0) ? formData.images.join(',') : null, // Comma-separated string or null
    };

    try {
      const response = await fetch(`/api/vendor/my-hotels/${serviceId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add room type");
      }

      toast({ title: "Success", description: "Room type added successfully." });
      router.push(`/my-hotels/${serviceId}/rooms`);
    } catch (error) {
      console.error("Error adding room type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Could not add room type.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Form ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
                <Link href="/dashboard" className="hover:text-indigo-600 hover:underline">Dashboard</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li className="flex items-center">
                <Link href="/my-hotels" className="hover:text-indigo-600 hover:underline">Hotels</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li className="flex items-center">
                 <Link href={`/my-hotels/${serviceId}/edit`} className="hover:text-indigo-600 hover:underline truncate max-w-[150px]">{hotelName}</Link>
            </li>
             <li><span className="text-gray-400">/</span></li>
             <li className="flex items-center">
                 <Link href={`/my-hotels/${serviceId}/rooms`} className="hover:text-indigo-600 hover:underline">Rooms</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li className="flex items-center text-gray-700 font-medium">
                Add New Room Type
            </li>
            </ol>
        </nav>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <BedDouble size={24} className="mr-3 text-indigo-600"/> Add New Room Type for {hotelName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Room Details --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Room Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Room Type Name */}
                <div className="md:col-span-2">
                    <label htmlFor="room_type_name" className="block text-sm font-medium text-gray-700 mb-1">Room Type Name <span className="text-red-500">*</span></label>
                    <input type="text" id="room_type_name" name="room_type_name" value={formData.room_type_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Deluxe Double, Standard Single"/>
                </div>
                {/* Base Price */}
                <div>
                    <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">Base Price/Night (INR) <span className="text-red-500">*</span></label>
                    <input type="number" id="base_price" name="base_price" value={formData.base_price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 2500"/>
                </div>
                {/* Max Guests */}
                <div>
                    <label htmlFor="max_guests" className="block text-sm font-medium text-gray-700 mb-1">Max Guests <span className="text-red-500">*</span></label>
                    <input type="number" id="max_guests" name="max_guests" value={formData.max_guests} onChange={handleChange} required min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 2"/>
                </div>
                {/* Quantity Available */}
                <div>
                    <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                    <input type="number" id="quantity_available" name="quantity_available" value={formData.quantity_available} onChange={handleChange} min="0" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 10"/>
                    <p className="mt-1 text-xs text-gray-500">Number of rooms of this type.</p>
                </div>
            </div>
        </fieldset>

        {/* --- Amenities & Images --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Amenities & Images</legend>
            <div className="space-y-6 mt-4">
                {/* Amenities */}
                <CheckboxGroup
                    label="Room Amenities"
                    name="amenities"
                    options={roomAmenityOptions}
                    selectedValues={formData.amenities}
                    onChange={handleArrayChange}
                    gridCols={3} // Use grid layout
                    helperText="Select amenities available in this room type."
                />
                
                {/* Replace TagInput with ImageUploader */}
                <ImageUploader
                    label="Room Images"
                    onImagesUploaded={handleImagesUploaded}
                    existingImages={formData.images}
                    parentId={serviceId}
                    type="room"
                    maxImages={6}
                    helperText="Upload photos specific to this room type (beds, bathroom, views)."
                />
            </div>
        </fieldset>

        {/* --- Form Actions --- */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link href={`/my-hotels/${serviceId}/rooms`} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-150 ease-in-out">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!!(isSubmitting || isLoading)} // FIX: Ensure boolean | undefined
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Adding Room...</>
            ) : (
              "Add Room Type"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Wrap with Suspense ---
export default function AddVendorRoomPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Add Room Page..." />}>
      <AddRoomForm />
    </Suspense>
  );
}

