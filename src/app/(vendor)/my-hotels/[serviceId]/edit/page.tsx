// Path: /home/ubuntu/vendor_frontend_rev2/test 2/src/app/(vendor)/hotels/[serviceId]/edit/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, ArrowLeft, Hotel, Package, Info, BedDouble } from "lucide-react"; // Added BedDouble
import Link from "next/link";
import { CheckboxGroup } from "@/components/CheckboxGroup"; // Import CheckboxGroup
import { ImageUploader } from "@/components/ImageUploader"; // Import ImageUploader
import { default as dynamicImport } from 'next/dynamic'; // Import dynamic and alias it
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

// Existing Hotel Data Interface (from GET /api/vendor/hotels/[serviceId])
interface VendorHotel {
  service_id: number;
  name: string;
  description: string | null;
  price: number | string; // price_base
  cancellation_policy: string | null;
  images: string[]; 
  island_id: number;
  is_active: number;
  star_rating: number;
  check_in_time: string;
  check_out_time: string;
  total_rooms: number | null;
  facilities: string[]; 
  meal_plans: string[]; 
  pets_allowed: number;
  children_allowed: number;
  accessibility: string | null;
  street_address: string;
  geo_lat: number | null;
  geo_lng: number | null;
}

// Updated Form state interface (using arrays for multi-select)
interface HotelFormData {
  name: string;
  description: string;
  price: string;
  cancellation_policy: string;
  images: string[]; // Use array for TagInput
  island_id: string;
  // is_active is handled separately
  star_rating: string;
  check_in_time: string;
  check_out_time: string;
  total_rooms: string;
  facilities: string[]; // Use array for CheckboxGroup
  meal_plans: string[]; // Use array for CheckboxGroup
  pets_allowed: boolean;
  children_allowed: boolean;
  accessibility: string;
  street_address: string;
  geo_lat: string;
  geo_lng: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// --- Define Options for Checkbox Groups (Same as Add page) ---
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
    <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 border border-yellow-200 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
        <h3 className="text-lg font-semibold text-yellow-800">Verification Pending</h3>
        <p className="text-sm text-yellow-700 mt-1">
            Your vendor account is awaiting verification. You cannot edit services until verified.
        </p>
        <Link href="/dashboard" className="mt-3 text-sm text-blue-600 hover:underline">
            Go to Dashboard
        </Link>
    </div>
);

const IncorrectVendorType = () => (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-800">Incorrect Vendor Type</h3>
        <p className="text-sm text-red-700 mt-1">
            Your account is not registered as a Hotel provider. You cannot edit this service type.
        </p>
        <Link href="/dashboard" className="mt-3 text-sm text-blue-600 hover:underline">
            Go to Dashboard
        </Link>
    </div>
);

// Simple Tag Input Component (Reused)
const TagInput = ({ label, name, value, onChange, placeholder, helperText }: {
    label: string;
    name: string;
    value: string[];
    onChange: (name: string, value: string[]) => void;
    placeholder?: string;
    helperText?: string;
}) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !value.includes(newTag)) {
                onChange(name, [...value, newTag]);
            }
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(name, value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-md shadow-sm">
                {value.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                            &times;
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    id={name}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "Add item and press Enter or comma"}
                    className="flex-grow px-1 py-0.5 border-none focus:ring-0 sm:text-sm"
                />
            </div>
            {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
        </div>
    );
};

// --- Main Edit Hotel Form Component ---
function EditHotelForm() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };

  const [formData, setFormData] = useState<HotelFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false); // State for map visibility

  // 1. Fetch Vendor Profile
  const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
  const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
  const isVerified = vendorProfile?.verified === 1;
  const isHotelVendor = vendorProfile?.type === "hotel";

  // 2. Fetch Existing Hotel Data
  const shouldFetchHotel = profileStatus === "success" && vendorProfile && isHotelVendor && !!serviceId; // Removed verification check
  const hotelApiUrl = shouldFetchHotel ? `/api/vendor/my-hotels/${serviceId}` : null;
  const { data: hotelData, error: hotelError, status: hotelStatus } = useFetch<VendorHotel | null>(hotelApiUrl);

  // 3. Fetch Islands
  const { data: islands = [], status: islandsStatus } = useFetch<Island[]>("/api/islands");

  // --- Utility Function to Safely Parse JSON Array String ---
  const parseJsonArray = useCallback((jsonString: string | null | undefined, fieldName: string): string[] => {
    if (!jsonString || typeof jsonString !== "string" || !jsonString.trim()) {
        return [];
    }
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            // Filter out non-string items and ensure all items are strings
            return parsed.filter(item => typeof item === "string").map(item => String(item).trim());
        }
        // If parsed is a single string, wrap it in an array
        if (typeof parsed === "string" && parsed.trim()) {
            return [parsed.trim()];
        }
        // If parsed is a number or boolean, convert to string and wrap
        if (typeof parsed === 'number' || typeof parsed === 'boolean') {
            const strVal = String(parsed).trim();
            return strVal ? [strVal] : [];
        }
        console.warn(`Parsed ${fieldName} data is not an array or a recognized single string/value:`, parsed);
        // Fallback for unhandled parsed types: try splitting original string
        if (jsonString.includes(",")) {
           return jsonString.split(",").map(s => s.trim()).filter(Boolean);
        }
        // If not comma-separated and not empty, treat as a single item array
        const trimmedOriginal = jsonString.trim();
        return trimmedOriginal ? [trimmedOriginal] : [];

    } catch (e) {
        console.warn(`Failed to parse ${fieldName} JSON: "${jsonString}", attempting fallback. Error:`, e);
        // Fallback: treat as comma-separated if parsing fails
        if (jsonString.includes(",")) {
            return jsonString.split(",").map(s => s.trim()).filter(Boolean);
        }
        // Treat as single item if not empty and not comma-separated
        const trimmedOriginal = jsonString.trim();
        if (trimmedOriginal) {
            return [trimmedOriginal];
        }
        return [];
    }
  }, []); // Empty dependency array for useCallback

  // --- Populate Form Data Effect ---
  useEffect(() => {
    if (hotelStatus === "success" && hotelData) {
      const hotel = hotelData;
      
      // The backend now consistently returns string arrays for these fields
      // due to the updated _parseJsonString method in DatabaseService.
      // The parseJsonArray utility on the frontend is no longer strictly necessary
      // for these specific fields if the API guarantees the array format.
      // However, retaining it might offer robustness if other parts of the app
      // or legacy data sources still provide unparsed strings for these.
      // For this specific form, if we trust the API to always send arrays,
      // we can directly use hotel.images, hotel.facilities, hotel.meal_plans.

      // For now, let's assume the API guarantees string[] for these based on recent changes.
      // If not, the parseJsonArray calls would still be needed here.
      const imagesArray = Array.isArray(hotel.images) ? hotel.images : parseJsonArray(hotel.images as unknown as string, "images");
      const facilitiesArray = Array.isArray(hotel.facilities) ? hotel.facilities : parseJsonArray(hotel.facilities as unknown as string, "facilities");
      const mealPlansArray = Array.isArray(hotel.meal_plans) ? hotel.meal_plans : parseJsonArray(hotel.meal_plans as unknown as string, "meal_plans");

      console.log("[EditHotelForm] Fetched hotel.images from API:", hotel.images);
      console.log("[EditHotelForm] Final imagesArray for formData:", imagesArray);

      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        price: hotel.price?.toString() || "", 
        cancellation_policy: hotel.cancellation_policy || "",
        images: imagesArray, 
        island_id: hotel.island_id?.toString() || "",
        star_rating: hotel.star_rating?.toString() || "",
        check_in_time: hotel.check_in_time || "14:00",
        check_out_time: hotel.check_out_time || "12:00",
        total_rooms: hotel.total_rooms?.toString() || "",
        facilities: facilitiesArray, 
        meal_plans: mealPlansArray,   
        pets_allowed: hotel.pets_allowed === 1,
        children_allowed: hotel.children_allowed === 1,
        accessibility: hotel.accessibility || "",
        street_address: hotel.street_address || "",
        geo_lat: hotel.geo_lat?.toString() || "",
        geo_lng: hotel.geo_lng?.toString() || "",
      });
    } else if (hotelStatus === "success" && !hotelData) {
        toast({ variant: "destructive", title: "Error", description: "Hotel not found." });
        router.replace("/my-hotels");
    } else if (hotelStatus === "error") {
        toast({ variant: "destructive", title: "Error Loading Hotel", description: hotelError?.message || "Could not load hotel details." });
        router.replace("/my-hotels");
    }
  }, [hotelStatus, hotelData, hotelError, router, parseJsonArray]);

  // --- Authorization & Loading Checks ---
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
      router.replace("/auth/signin?reason=unauthorized_vendor");
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const isLoading = authLoading || profileStatus === "loading" || islandsStatus === "loading" || (shouldFetchHotel && hotelStatus === "loading");

  if (isLoading) {
    return <LoadingSpinner text="Loading Edit Hotel Form..." />;
  }

  // Handle Profile Fetch Error/Not Found
  if (profileStatus === "error" || (profileStatus === "success" && !vendorProfile)) {
    return <div className="text-red-600">Error loading vendor profile or profile not found.</div>;
  }

  // --- Conditional Rendering based on Type ---
  if (!isHotelVendor) {
    return <IncorrectVendorType />;
  }

  // Handle Hotel Not Found (redundant check, handled in useEffect)
  if (hotelStatus === "success" && !hotelData) {
      return <div className="text-orange-600">Hotel with ID {serviceId} not found.</div>;
  }

  // If formData is still null after loading and checks
  if (!formData) {
      return <LoadingSpinner text="Preparing form..." />;
  }

  // --- Form Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => prev ? { ...prev, [name]: checked } : null);
    } else {
      setFormData((prev) => prev ? { ...prev, [name]: value } : null);
    }
  };

  // Specific handler for CheckboxGroup and TagInput components
  const handleArrayChange = (name: string, values: string[]) => {
    setFormData((prev) => prev ? { ...prev, [name]: values } : null);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            geo_lat: lat.toString(),
            geo_lng: lng.toString(),
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);

    // Basic validation
    if (!formData.island_id || !formData.star_rating || !formData.name.trim() || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0 || isNaN(parseInt(formData.total_rooms, 10)) || parseInt(formData.total_rooms, 10) <= 0) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please fill all required fields (*) with valid data." });
        setIsSubmitting(false);
        return;
    }

    // --- Data Transformation for API (PUT Request) ---
    try {
      const apiPayload = {
          name: formData.name,
          description: formData.description,
          island_id: parseInt(formData.island_id, 10), // Ensure it's a number; validation should prevent NaN
          star_rating: parseInt(formData.star_rating, 10), // Ensure it's a number; validation should prevent NaN
          check_in_time: formData.check_in_time || "00:00", // Provide default if empty, server expects string
          check_out_time: formData.check_out_time || "00:00", // Provide default if empty, server expects string
          price: parseFloat(formData.price) || 0, // Changed from price_base
          total_rooms: parseInt(formData.total_rooms, 10) || undefined, // Send undefined if not a valid number
          pets_allowed: formData.pets_allowed,
          children_allowed: formData.children_allowed,
          accessibility: formData.accessibility,
          street_address: formData.street_address || "N/A", // Provide default if empty, server expects string
          geo_lat: formData.geo_lat ? parseFloat(formData.geo_lat) : null,
          geo_lng: formData.geo_lng ? parseFloat(formData.geo_lng) : null,
          cancellation_policy: formData.cancellation_policy, // Send as string, server will stringify if object/array
          images: formData.images.length > 0 ? JSON.stringify(formData.images) : null, // Stringify or send null
          facilities: formData.facilities, // Send as array
          meal_plans: formData.meal_plans, // Send as array
      };

      // --- API Call (PUT) ---
      const response = await fetch(`/api/vendor/my-hotels/${serviceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPayload),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
          toast({ title: "Success", description: "Hotel updated successfully." });
          router.push("/my-hotels");
      } else {
          throw new Error(result.message || "Failed to update hotel");
      }
    } catch (error: any) {
        console.error("Update Hotel Error:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- Handle Image Uploads ---
  const handleImagesUploaded = (imageUrls: string[]) => {
    if (formData) {
      setFormData({ ...formData, images: imageUrls });
    }
  };

  // --- Render Form ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
                <Link href="/my-hotels" className="hover:underline">Hotels</Link>
                <span className="mx-2">/</span>
            </li>
            <li className="flex items-center text-gray-700">
                Edit: {formData.name || "Hotel"}
            </li>
            </ol>
        </nav>

      <h2 className="text-2xl font-bold mb-6">Edit Hotel: {formData.name}</h2>

      {/* Link to Manage Rooms */} 
      <div className="mb-6">
          <Link 
              href={`/my-hotels/${serviceId}/rooms`}
              className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200"
          >
              <BedDouble size={16} className="mr-2" /> Manage Hotel Rooms
          </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Basic Information --- */}
        <fieldset className="border p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold px-2">Basic Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Name */}
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Island */}
                <div>
                    <label htmlFor="island_id" className="block text-sm font-medium text-gray-700">Island <span className="text-red-500">*</span></label>
                    <select id="island_id" name="island_id" value={formData.island_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="" disabled>-- Select Island --</option>
                        {islands && islands.map(island => (
                        <option key={island.id} value={island.id}>{island.name}</option>
                        ))}
                    </select>
                    {islandsStatus === "error" && <p className="text-xs text-red-500 mt-1">Error loading islands.</p>}
                </div>
                 {/* Star Rating */}
                <div>
                    <label htmlFor="star_rating" className="block text-sm font-medium text-gray-700">Star Rating <span className="text-red-500">*</span></label>
                    <select id="star_rating" name="star_rating" value={formData.star_rating} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                 {/* Base Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Base Price per Night (INR) <span className="text-red-500">*</span></label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 3500"/>
                </div>
                {/* Total Rooms */}
                <div>
                    <label htmlFor="total_rooms" className="block text-sm font-medium text-gray-700">Total Rooms <span className="text-red-500">*</span></label>
                    <input type="number" id="total_rooms" name="total_rooms" value={formData.total_rooms} onChange={handleChange} required min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 25"/>
                </div>
                 {/* is_active status is usually managed on the list page, not here */}
            </div>
        </fieldset>

        {/* --- Details & Policies --- */}
        <fieldset className="border p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold px-2">Details & Policies</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                 {/* Check-in Time */}
                <div>
                    <label htmlFor="check_in_time" className="block text-sm font-medium text-gray-700">Check-in Time</label>
                    <input type="time" id="check_in_time" name="check_in_time" value={formData.check_in_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Check-out Time */}
                <div>
                    <label htmlFor="check_out_time" className="block text-sm font-medium text-gray-700">Check-out Time</label>
                    <input type="time" id="check_out_time" name="check_out_time" value={formData.check_out_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Cancellation Policy */}
                <div className="md:col-span-2">
                    <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
                    <textarea id="cancellation_policy" name="cancellation_policy" value={formData.cancellation_policy} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Full refund if cancelled 48 hours prior..."></textarea>
                </div>
                {/* Pets Allowed */}
                <div className="flex items-center">
                    <input type="checkbox" id="pets_allowed" name="pets_allowed" checked={formData?.pets_allowed ?? false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="pets_allowed" className="ml-2 block text-sm text-gray-900">Pets Allowed</label>
                </div>
                {/* Children Allowed */}
                <div className="flex items-center">
                    <input type="checkbox" id="children_allowed" name="children_allowed" checked={formData?.children_allowed ?? false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="children_allowed" className="ml-2 block text-sm text-gray-900">Children Allowed</label>
                </div>
                {/* Accessibility Features */}
                <div className="md:col-span-2">
                    <label htmlFor="accessibility" className="block text-sm font-medium text-gray-700">Accessibility Features</label>
                    <textarea id="accessibility" name="accessibility" value={formData.accessibility} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Wheelchair accessible rooms, Ramps..."></textarea>
                </div>
            </div>
        </fieldset>

        {/* --- Facilities & Meal Plans --- */}
        <fieldset className="border p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold px-2">Facilities & Meal Plans</legend>
            <div className="space-y-6 mt-4">
                {/* Facilities */}
                <CheckboxGroup
                    label="Facilities Available"
                    name="facilities"
                    options={facilityOptions}
                    selectedValues={formData.facilities}
                    onChange={handleArrayChange}
                    helperText="Select all facilities offered by the hotel."
                />
                {/* Meal Plans */}
                <CheckboxGroup
                    label="Meal Plans Offered"
                    name="meal_plans"
                    options={mealPlanOptions}
                    selectedValues={formData.meal_plans}
                    onChange={handleArrayChange}
                    helperText="Select the types of meal plans available."
                />
            </div>
        </fieldset>

        {/* --- Images --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
          <legend className="text-lg font-semibold text-gray-700 px-2">Images</legend>
          <div className="mt-4">
            {formData && (
              <ImageUploader
                label="Hotel Images"
                onImagesUploaded={handleImagesUploaded}
                existingImages={formData.images}
                parentId={serviceId}
                type="hotel"
                maxImages={8}
                helperText="Upload photos showcasing your hotel (exterior, lobby, common areas)."
              />
            )}
          </div>
        </fieldset>

        {/* --- Location & Accessibility --- */}
        <fieldset className="border p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Location & Accessibility</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Street Address */}
                <div className="md:col-span-2">
                    <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input type="text" id="street_address" name="street_address" value={formData?.street_address || ""} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Latitude & Longitude - Replaced with Map Picker and read-only inputs */}
                <div>
                    <label htmlFor="geo_lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude (from map)</label>
                    <input
                        type="text"
                        id="geo_lat"
                        name="geo_lat"
                        value={formData?.geo_lat || ""}
                        readOnly
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
                        value={formData?.geo_lng || ""}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                        placeholder="Select on map"
                    />
                </div>
                <div className="md:col-span-2">
                    <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="mt-2 mb-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        disabled={!formData} // Disable if formData is not yet loaded
                    >
                        {showMap ? "Hide Map" : "Select Location on Map"}
                    </button>
                    {showMap && formData && (
                        <div className="mt-2 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <MapPicker
                            onLocationChange={handleLocationChange}
                            initialPosition={
                                formData.geo_lat && formData.geo_lng
                                ? { lat: parseFloat(formData.geo_lat), lng: parseFloat(formData.geo_lng) }
                                : undefined // Default center will be used in MapPicker
                            }
                            mapHeight="300px"
                        />
                        <p className="text-xs text-gray-500 p-2 bg-gray-50">Click on the map or drag the marker to set coordinates. Use search for places.</p>
                        </div>
                    )}
                </div>
                {/* Accessibility Features */}
                <div className="md:col-span-2">
                    <label htmlFor="accessibility" className="block text-sm font-medium text-gray-700">Accessibility Features</label>
                    <textarea id="accessibility" name="accessibility" value={formData.accessibility} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Wheelchair accessible rooms, Ramps..."></textarea>
                </div>
            </div>
        </fieldset>

        {/* --- Form Actions --- */}
        <div className="flex justify-end space-x-3 pt-4">
          <Link href="/my-hotels" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Saving Changes...</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Wrap with Suspense ---
export default function EditVendorHotelPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Edit Hotel Page..." />}>
      <EditHotelForm />
    </Suspense>
  );
}
