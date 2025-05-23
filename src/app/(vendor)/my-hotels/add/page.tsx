// Path: /home/ubuntu/vendor_frontend_rev2/test 2/src/app/(vendor)/hotels/add/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, ArrowLeft, Hotel, Package, Info } from "lucide-react";
import Link from "next/link";
import { default as dynamicImport } from 'next/dynamic'; // Import dynamic and alias it
import { CheckboxGroup } from "@/components/CheckboxGroup"; // Import CheckboxGroup
import { ImageUploader } from "@/components/ImageUploader"; // Import our new ImageUploader
// import MapPicker from "@/components/MapPicker"; // Comment out direct import
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Dynamically import MapPicker with ssr: false
const MapPicker = dynamicImport(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <p>Loading map...</p> // Optional loading component
});

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

interface Island {
  id: number;
  name: string;
}

// Form state interface (matches API body, using arrays for multi-select)
interface HotelFormData {
  name: string;
  description: string;
  price: string;
  cancellation_policy: string;
  images: string[]; // Will store URLs after successful upload and hotel creation
  island_id: string;
  is_active: boolean;
  star_rating: string;
  check_in_time: string;
  check_out_time: string;
  total_rooms: string;
  facilities: string[]; // Use array for CheckboxGroup
  meal_plans: string[]; // Use array for CheckboxGroup
  pets_allowed: boolean;
  children_allowed: boolean;
  accessibility_features: string;
  street_address: string;
  geo_lat: string;
  geo_lng: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any; // Added for potential future use (e.g., returning created ID)
}

// --- Define Options for Checkbox Groups ---
const facilityOptions = [
  { label: "Wi-Fi", value: "wifi" },
  { label: "Swimming Pool", value: "pool" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Bar/Lounge", value: "bar" },
  { label: "Gym/Fitness Center", value: "gym" },
  { label: "Spa", value: "spa" },
  { label: "Parking", value: "parking" },
  { label: "Room Service", value: "room_service" },
  { label: "Air Conditioning", value: "ac" },
  { label: "Laundry Service", value: "laundry" },
  { label: "Business Center", value: "business_center" },
  { label: "Airport Shuttle", value: "shuttle" },
];

const mealPlanOptions = [
  { label: "Breakfast Included (CP)", value: "cp" },
  { label: "Breakfast & Dinner (MAP)", value: "map" },
  { label: "All Meals (AP)", value: "ap" },
  { label: "Room Only (EP)", value: "ep" },
  { label: "All Inclusive (AI)", value: "ai" },
];

// --- Helper Components (LoadingSpinner, VerificationPending, IncorrectVendorType, TagInput) ---
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
        <p className="mt-2 text-sm">Your vendor profile is awaiting verification. You cannot add services until verified.</p>
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

// --- Main Add Hotel Form Component ---
function AddHotelForm() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };

  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    description: "",
    price: "",
    cancellation_policy: "",
    images: [], // Initialize as empty array
    island_id: "",
    is_active: true,
    star_rating: "",
    check_in_time: "14:00",
    check_out_time: "12:00",
    total_rooms: "",
    facilities: [], // Initialize as empty array
    meal_plans: [], // Initialize as empty array
    pets_allowed: false,
    children_allowed: true,
    accessibility_features: "",
    street_address: "",
    geo_lat: "",
    geo_lng: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // We need a temporary hotel ID for image uploads before the hotel is created
  const [tempHotelId, setTempHotelId] = useState<string>('temp-' + Date.now());
  const [createdHotelId, setCreatedHotelId] = useState<string | null>(null);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isUpdatingWithImages, setIsUpdatingWithImages] = useState(false);
  const [showMap, setShowMap] = useState(false); // State for map visibility

  // 1. Fetch Vendor Profile
  const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
  const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
  const isVerified = vendorProfile?.verified === 1;
  const isHotelVendor = vendorProfile?.type === "hotel";

  // 2. Fetch Islands
  const { data: islands = [], error: islandsError, status: islandsStatus } = useFetch<Island[]>("/api/islands"); // Added islandsError

  // --- Authorization & Loading Checks ---
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
      router.replace("/auth/signin?reason=unauthorized_vendor");
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const isLoading = authLoading || profileStatus === "loading" || islandsStatus === "loading";

  if (isLoading) {
    return <LoadingSpinner text="Loading Add Hotel Form..." />;
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

  // --- Form Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Specific handler for CheckboxGroup and ImageUploader components
  const handleArrayChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      geo_lat: lat.toString(),
      geo_lng: lng.toString(),
    }));
  };

  // Handle images uploaded via ImageUploader
  const handleImagesUploaded = async (imageUrls: string[]) => {
    setFormData((prev) => ({ ...prev, images: imageUrls }));

    if (!createdHotelId) {
      toast({ variant: "destructive", title: "Error", description: "Hotel ID not found. Cannot associate images." });
      return;
    }

    setIsUpdatingWithImages(true);
    try {
      const response = await fetch(`/api/vendor/my-hotels/${createdHotelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: JSON.stringify(imageUrls) }), // Send as stringified JSON
      });
      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Success", description: "Hotel added and images uploaded successfully!" });
        router.push("/my-hotels");
      } else {
        throw new Error(result.message || "Failed to update hotel with images.");
      }
    } catch (error: any) {
      console.error("Update Hotel with Images Error:", error);
      toast({
        variant: "destructive",
        title: "Image Association Error",
        description: error.message || "Failed to save images to the hotel. You can add them by editing the hotel.",
      });
      router.push(`/my-hotels/${createdHotelId}/edit`); // Redirect to edit page
    } finally {
      setIsUpdatingWithImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // If hotel not yet created, create it first
    if (!createdHotelId) {
      setIsSubmittingDetails(true);
      setIsSubmitting(true); // Keep general submitting true

      // Basic validation (copied from original handleSubmit)
      if (!formData.island_id || !formData.star_rating || !formData.name.trim() || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0 || isNaN(parseInt(formData.total_rooms, 10)) || parseInt(formData.total_rooms, 10) <= 0) {
          toast({ variant: "destructive", title: "Validation Error", description: "Please fill all required fields (*) with valid data." });
          setIsSubmittingDetails(false);
          setIsSubmitting(false);
          return;
      }

      try {
          const apiPayload = {
              service_provider_id: vendorProfile?.id,
              name: formData.name,
              description: formData.description,
              island_id: parseInt(formData.island_id, 10) || null,
              is_active: formData.is_active,
              star_rating: parseInt(formData.star_rating, 10) || null,
              check_in_time: formData.check_in_time || null,
              check_out_time: formData.check_out_time || null,
              price_base: parseFloat(formData.price) || 0,
              total_rooms: parseInt(formData.total_rooms, 10) || null,
              pets_allowed: formData.pets_allowed,
              children_allowed: formData.children_allowed,
              accessibility_features: formData.accessibility_features,
              street_address: formData.street_address,
              geo_lat: formData.geo_lat ? parseFloat(formData.geo_lat) : null,
              geo_lng: formData.geo_lng ? parseFloat(formData.geo_lng) : null,
              cancellation_policy: formData.cancellation_policy,
              // DO NOT SEND IMAGES OR TEMP ID HERE
              facilities: JSON.stringify(formData.facilities),
              meal_plans: JSON.stringify(formData.meal_plans),
          };

          const response = await fetch("/api/vendor/my-hotels", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(apiPayload),
          });

          const result: ApiResponse = await response.json();

          const hotelId = result.data?.service_id || result.data?.id;
          if (response.ok && result.success && hotelId) {
              setCreatedHotelId(String(hotelId));
              toast({ title: "Details Saved", description: "Hotel details saved successfully. Now please upload images." });
              // The form remains, ImageUploader becomes active. User uploads, then handleImagesUploaded is called.
              // No direct redirection here.
          } else {
              throw new Error(result.message || "Failed to add hotel details.");
          }
      } catch (error: any) {
          console.error("Add Hotel Details Error:", error);
          toast({
              variant: "destructive",
              title: "Error Saving Details",
              description: error.message || "An unexpected error occurred.",
          });
      } finally {
          setIsSubmittingDetails(false);
          setIsSubmitting(false); // Reset general submitting state
      }
    } else {
      // This case should ideally not be hit if ImageUploader directly calls handleImagesUploaded.
      // If there are already images in formData.images (e.g. user added more after initial upload)
      // and createdHotelId exists, it means we are updating images.
      // However, handleImagesUploaded is the primary way to update images.
      // This button might act as a "Done" or "Save All" if images are already uploaded via uploader.
      if (formData.images.length > 0) {
        await handleImagesUploaded(formData.images);
      } else {
        toast({ title: "No Images", description: "Please upload images for the hotel or click cancel."});
      }
    }
  };

  // --- Render Form ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
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
            <li className="flex items-center text-gray-700 font-medium">
                Add New Hotel
            </li>
            </ol>
        </nav>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Hotel</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Basic Information --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Basic Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Name */}
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Hotel Name <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Island */}
                <div>
                    <label htmlFor="island_id" className="block text-sm font-medium text-gray-700 mb-1">Island <span className="text-red-500">*</span></label>
                    <select id="island_id" name="island_id" value={formData.island_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                        <option value="" disabled>-- Select Island --</option>
                        {/* FIX: Add null check for islands */}
                        {islands?.map(island => (
                        <option key={island.id} value={island.id}>{island.name}</option>
                        ))}
                    </select>
                    {islandsStatus === "error" && <p className="text-xs text-red-500 mt-1">Error loading islands: {islandsError?.message}</p>}
                </div>
                 {/* Star Rating */}
                <div>
                    <label htmlFor="star_rating" className="block text-sm font-medium text-gray-700 mb-1">Star Rating <span className="text-red-500">*</span></label>
                    <select id="star_rating" name="star_rating" value={formData.star_rating} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                        <option value="" disabled>-- Select Rating --</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                </div>
                 {/* Description */}
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                 {/* Base Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Base Price per Night (INR) <span className="text-red-500">*</span></label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 3500"/>
                </div>
                {/* Total Rooms */}
                <div>
                    <label htmlFor="total_rooms" className="block text-sm font-medium text-gray-700 mb-1">Total Rooms <span className="text-red-500">*</span></label>
                    <input type="number" id="total_rooms" name="total_rooms" value={formData.total_rooms} onChange={handleChange} required min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 50"/>
                </div>
            </div>
        </fieldset>

        {/* --- Check-in/out & Policies --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Check-in/out & Policies</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Check-in Time */}
                <div>
                    <label htmlFor="check_in_time" className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                    <input type="time" id="check_in_time" name="check_in_time" value={formData.check_in_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Check-out Time */}
                <div>
                    <label htmlFor="check_out_time" className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                    <input type="time" id="check_out_time" name="check_out_time" value={formData.check_out_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Pets Allowed */}
                <div className="flex items-center">
                    <input type="checkbox" id="pets_allowed" name="pets_allowed" checked={formData.pets_allowed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="pets_allowed" className="ml-2 block text-sm text-gray-900">Pets Allowed</label>
                </div>
                {/* Children Allowed */}
                <div className="flex items-center">
                    <input type="checkbox" id="children_allowed" name="children_allowed" checked={formData.children_allowed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="children_allowed" className="ml-2 block text-sm text-gray-900">Children Allowed</label>
                </div>
                {/* Cancellation Policy */}
                <div className="md:col-span-2">
                    <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
                    <textarea id="cancellation_policy" name="cancellation_policy" value={formData.cancellation_policy} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Full refund if cancelled 48 hours prior..."></textarea>
                </div>
            </div>
        </fieldset>

        {/* --- Facilities & Meal Plans --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Facilities & Meal Plans</legend>
            <div className="space-y-6 mt-4">
                {/* Facilities */}
                <CheckboxGroup
                    label="Facilities"
                    name="facilities"
                    options={facilityOptions}
                    selectedValues={formData.facilities}
                    onChange={handleArrayChange}
                    gridCols={3}
                    helperText="Select facilities available at the hotel."
                />
                {/* Meal Plans */}
                <CheckboxGroup
                    label="Meal Plans Offered"
                    name="meal_plans"
                    options={mealPlanOptions}
                    selectedValues={formData.meal_plans}
                    onChange={handleArrayChange}
                    gridCols={3}
                    helperText="Select meal plans available for booking."
                />
            </div>
        </fieldset>

        {/* --- Location & Accessibility --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Location & Accessibility</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Street Address */}
                <div className="md:col-span-2">
                    <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input type="text" id="street_address" name="street_address" value={formData.street_address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Latitude & Longitude - Replaced with Map Picker and read-only inputs */}
                <div>
                    <label htmlFor="geo_lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude (from map)</label>
                    <input
                        type="text"
                        id="geo_lat"
                        name="geo_lat"
                        value={formData.geo_lat}
                        onChange={handleChange} // Keep onChange for potential manual override, though not primary
                        readOnly // Primarily set by map
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                        placeholder="Select on map"
                    />
                </div>
                <div>
                    <label htmlFor="geo_lng" className="block text-sm font-medium text-gray-700 mb-1">Longitude (from map)</label>
                    <input
                        type="text"
                        id="geo_lng"
                        name="geo_lng"
                        value={formData.geo_lng}
                        onChange={handleChange} // Keep onChange for potential manual override
                        readOnly // Primarily set by map
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                        placeholder="Select on map"
                    />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="mt-2 mb-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {showMap ? "Hide Map" : "Select Location on Map"}
                  </button>
                  {showMap && (
                    <div className="mt-2 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <MapPicker
                        onLocationChange={handleLocationChange}
                        initialPosition={
                          formData.geo_lat && formData.geo_lng
                            ? { lat: parseFloat(formData.geo_lat), lng: parseFloat(formData.geo_lng) }
                            : undefined // Default center will be used in MapPicker if undefined
                        }
                        mapHeight="300px"
                      />
                       <p className="text-xs text-gray-500 p-2 bg-gray-50">Click on the map or drag the marker to set coordinates.</p>
                    </div>
                  )}
                </div>
                {/* Accessibility Features */}
                <div className="md:col-span-2">
                    <label htmlFor="accessibility_features" className="block text-sm font-medium text-gray-700 mb-1">Accessibility Features</label>
                    <input type="text" id="accessibility_features" name="accessibility_features" value={formData.accessibility_features} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Wheelchair accessible, Ramp access"/>
                </div>
            </div>
        </fieldset>

        {/* --- Images --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Images</legend>
            <div className="mt-4">
              {!createdHotelId ? (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
                  <Info size={20} className="mx-auto mb-2" />
                  Please save hotel details first to enable image uploads.
                </div>
              ) : (
                <ImageUploader
                    label="Hotel Images"
                    onImagesUploaded={handleImagesUploaded}
                    existingImages={formData.images} // These would be images already associated
                    parentId={createdHotelId} // Use the actual hotel ID
                    type="hotel"
                    maxImages={8}
                    helperText="Upload photos showcasing your hotel. Images are saved as they are uploaded."
                />
              )}
            </div>
        </fieldset>

        {/* --- Form Actions --- */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link href="/my-hotels" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-150 ease-in-out">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmittingDetails || isUpdatingWithImages || isLoading || (!!createdHotelId && formData.images.length === 0) }
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isSubmittingDetails ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Saving Details...</>
            ) : isUpdatingWithImages ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Saving Images...</>
            ) : !createdHotelId ? (
              "Save Details & Proceed to Images"
            ) : (
              "Finish & Save Hotel" // Or "Update Images" if some are already there
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Wrap with Suspense ---
export default function AddVendorHotelPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Add Hotel Page..." />}>
      <AddHotelForm />
    </Suspense>
  );
}

