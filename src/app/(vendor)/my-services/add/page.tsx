// Path: /home/ubuntu/vendor_frontend_rev2/test 2/src/app/(vendor)/services/add/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, ArrowLeft, Hotel, Package, Info } from "lucide-react";
import Link from "next/link";
import { CheckboxGroup } from "@/components/CheckboxGroup"; // Import the new component
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
  price_per_km: string;
  price_per_trip: string;
  driver_included: boolean;
  // Location fields
  street_address: string; // Assuming you might want this too
  geo_lat: string;
  geo_lng: string;
}

interface VendorProfile {
  id: number;
  verified: number; // 0 or 1
  type: string; // e.g., 'hotel', 'rental', 'activity'
}

interface Island {
  id: number;
  name: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any; // Keep flexible for different API responses
}

// --- Define Options for Checkbox Groups ---
const generalAmenityOptions = [
  { label: "Wi-Fi", value: "wifi" },
  { label: "Parking", value: "parking" },
  { label: "Restroom", value: "restroom" },
  { label: "First Aid", value: "first_aid" },
  { label: "Refreshments Available", value: "refreshments" },
];

const equipmentOptions = [
  { label: "Helmet", value: "helmet" },
  { label: "Life Jacket", value: "life_jacket" },
  { label: "Snorkel Gear", value: "snorkel_gear" },
  { label: "Scuba Gear", value: "scuba_gear" },
  { label: "Kayak/Paddle", value: "kayak_paddle" },
  { label: "Hiking Boots", value: "hiking_boots" },
  { label: "Safety Harness", value: "safety_harness" },
];

const availabilityDayOptions = [
    { label: "Monday", value: "Mon" },
    { label: "Tuesday", value: "Tue" },
    { label: "Wednesday", value: "Wed" },
    { label: "Thursday", value: "Thu" },
    { label: "Friday", value: "Fri" },
    { label: "Saturday", value: "Sat" },
    { label: "Sunday", value: "Sun" },
];

// Updated Form state interface
interface ServiceFormData {
  // Generic
  name: string;
  description: string;
  type: string;
  island_id: string;
  price: string;
  availability_days: string[]; // Changed from string
  availability_notes: string; // Added for specific times/notes
  images: string[]; // Changed from string
  cancellation_policy: string;
  is_active: boolean;
  general_amenities: string[]; // Changed from string
  // Rental Specific
  rental_unit: "per hour" | "per day" | "";
  quantity_available: string;
  deposit_required: boolean;
  deposit_amount: string;
  age_license_requirement: boolean;
  age_license_details: string;
  // Activity Specific
  duration: string;
  duration_unit: "hours" | "days" | "";
  group_size_min: string;
  group_size_max: string;
  difficulty_level: "easy" | "medium" | "hard" | "";
  equipment_provided: string[]; // Changed from string
  safety_requirements: string;
  guide_required: boolean;
  // Transport Specific
  vehicle_type: string;
  capacity_passengers: string;
  route_details: string;
  price_per_km: string;
  price_per_trip: string;
  driver_included: boolean;
  // Location fields
  street_address: string; // Assuming you might want this too
  geo_lat: string;
  geo_lng: string;
}

// --- Helper Components (LoadingSpinner, VerificationPending, IncorrectVendorType) ---
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex justify-center items-center py-10">
    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
    <span>{text}</span>
  </div>
);

const VerificationPending = () => (
  <div className="flex flex-col items-center justify-center p-6 border border-yellow-300 bg-yellow-50 rounded-md shadow-sm text-yellow-700">
    <AlertTriangle className="h-8 w-8 mb-2" />
    <h3 className="text-lg font-semibold mb-1">Verification Pending</h3>
    <p className="text-sm text-center">Your vendor account is awaiting verification. You cannot add services until verified.</p>
    {/* Optionally add a link to contact support or check status */}
  </div>
);

const IncorrectVendorType = () => (
    <div className="flex flex-col items-center justify-center p-6 border border-red-300 bg-red-50 rounded-md shadow-sm text-red-700">
        <Info className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold mb-1">Incorrect Vendor Type</h3>
        <p className="text-sm text-center">This form is for adding Rentals or Activities. Hotel vendors should manage rooms via the Hotels section.</p>
        <Link href="/my-hotels" className="mt-3 text-sm text-indigo-600 hover:underline">
            Go to Hotel Management
        </Link>
    </div>
);

// --- Main Add Service Form Component ---
function AddServiceForm() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    type: "",
    island_id: "",
    price: "",
    availability_days: [],
    availability_notes: "",
    images: [],
    cancellation_policy: "",
    is_active: true,
    general_amenities: [],
    rental_unit: "",
    quantity_available: "",
    deposit_required: false,
    deposit_amount: "",
    age_license_requirement: false,
    age_license_details: "",
    duration: "",
    duration_unit: "",
    group_size_min: "",
    group_size_max: "",
    difficulty_level: "",
    equipment_provided: [],
    safety_requirements: "",
    guide_required: false,
    vehicle_type: "",
    capacity_passengers: "",
    route_details: "",
    price_per_km: "",
    price_per_trip: "",
    driver_included: true,
    street_address: "",
    geo_lat: "",
    geo_lng: "",
  });

  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isUpdatingWithImages, setIsUpdatingWithImages] = useState(false);
  const [createdServiceId, setCreatedServiceId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false); // State for map visibility
  const selectedServiceBaseType = formData.type.split("/")[0];
  
  // 1. Fetch Vendor Profile
  const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
  const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
  const isVerified = vendorProfile?.verified === 1;
  const isHotelVendor = vendorProfile?.type === "hotel";

  // 2. Fetch Islands
  const { data: islands = [], error: islandsError, status: islandsStatus } = useFetch<Island[]>("/api/islands");

  // --- Authorization & Loading Checks ---
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
      router.replace("/auth/signin?reason=unauthorized_vendor");
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const isLoading = authLoading || profileStatus === "loading" || islandsStatus === "loading";

  if (isLoading) {
    return <LoadingSpinner text="Loading Add Service Form..." />;
  }

  // Handle Profile Fetch Error/Not Found
  if (profileStatus === "error" || (profileStatus === "success" && !vendorProfile)) {
    return <div className="text-red-600">Error loading vendor profile or profile not found.</div>;
  }

  // --- Conditional Rendering based on Type ---
  if (isHotelVendor) {
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

  const handleArrayChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      street_address: prev.street_address, // Keep existing street address if any
      geo_lat: lat.toString(),
      geo_lng: lng.toString(),
    }));
  };

  // Handler for images uploaded via ImageUploader
  const handleImagesUploaded = async (imageUrls: string[]) => {
    if (!createdServiceId) {
      toast({ variant: "destructive", title: "Error", description: "Service ID not available for image upload." });
      return;
    }
    if (imageUrls.length === 0) {
        toast({ title: "Info", description: "No new images to upload. Service created without new images." });
        router.push("/my-services"); // Navigate if no images were selected/uploaded
        return;
    }

    setIsUpdatingWithImages(true);
    console.log(`Attempting to associate images with service ID: ${createdServiceId}`, imageUrls);

    try {
      const response = await fetch(`/api/vendor/my-services/${createdServiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: JSON.stringify(imageUrls) }), // Send only images
      });
      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Success", description: "Images associated with the service successfully." });
        setFormData((prev) => ({ ...prev, images: imageUrls })); // Update local state for consistency
        router.push("/my-services");
      } else {
        throw new Error(result.message || "Failed to associate images with the service.");
      }
    } catch (error: any) {
      console.error("Error associating images:", error);
      toast({
        variant: "destructive",
        title: "Image Association Error",
        description: error.message || "An unexpected error occurred while associating images.",
      });
    } finally {
      setIsUpdatingWithImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // If service already created, this button should ideally not be active for submitting details again.
    // Or, it could mean "skip image upload and finish" if designed that way.
    // For now, this handleSubmit is only for the initial detail submission.
    if (createdServiceId) {
        toast({ title: "Info", description: "Service details already submitted. Please upload images or navigate away."});
        // If no images were uploaded, allow to proceed.
        if (formData.images.length === 0 && !isUpdatingWithImages) {
             router.push("/my-services");
        }
        return;
    }

    setIsSubmittingDetails(true);

    // Basic validation
    if (!formData.type || !formData.island_id || !formData.name.trim() || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please fill all required fields (*) with valid data." });
        setIsSubmittingDetails(false);
        return;
    }
    // Add more specific validation based on type
    if (selectedServiceBaseType === "rental" && (!formData.rental_unit || isNaN(parseInt(formData.quantity_available)) || parseInt(formData.quantity_available) <= 0)) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please provide valid rental unit and quantity for rentals." });
        setIsSubmittingDetails(false);
        return;
    }
    if (selectedServiceBaseType === "activity" && (!formData.duration_unit || isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0)) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please provide valid duration and unit for activities." });
        setIsSubmittingDetails(false);
        return;
    }
    if (selectedServiceBaseType === "transport" && (!formData.vehicle_type || !formData.capacity_passengers)) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please provide vehicle type and capacity for transport services." });
        setIsSubmittingDetails(false);
        return;
    }

    // --- Data Transformation for API ---
    // Ensure images are NOT part of the initial payload
    let apiPayload: any = {
      // ...formData, // Spread all of formData EXCEPT images
      name: formData.name,
      description: formData.description,
      type: formData.type,
      island_id: parseInt(formData.island_id, 10) || null,
      price: parseFloat(formData.price) || 0,
      cancellation_policy: formData.cancellation_policy,
      is_active: formData.is_active,
      availability_days: formData.availability_days, // Keep as array for now, stringify below
      availability_notes: formData.availability_notes,
      general_amenities: formData.general_amenities, // Keep as array for now, stringify below

      // Rental Specific (conditionally add these)
      rental_unit: selectedServiceBaseType === 'rental' ? formData.rental_unit : undefined,
      quantity_available: selectedServiceBaseType === 'rental' && formData.quantity_available ? (parseInt(formData.quantity_available, 10) || null) : undefined,
      deposit_required: selectedServiceBaseType === 'rental' ? formData.deposit_required : undefined,
      deposit_amount: selectedServiceBaseType === 'rental' && formData.deposit_amount ? (parseFloat(formData.deposit_amount) || null) : undefined,
      age_license_requirement: selectedServiceBaseType === 'rental' ? formData.age_license_requirement : undefined,
      age_license_details: selectedServiceBaseType === 'rental' ? formData.age_license_details : undefined,

      // Activity Specific (conditionally add these)
      duration: selectedServiceBaseType === 'activity' && formData.duration ? (parseInt(formData.duration, 10) || null) : undefined,
      duration_unit: selectedServiceBaseType === 'activity' ? formData.duration_unit : undefined,
      group_size_min: selectedServiceBaseType === 'activity' && formData.group_size_min ? (parseInt(formData.group_size_min, 10) || null) : undefined,
      group_size_max: selectedServiceBaseType === 'activity' && formData.group_size_max ? (parseInt(formData.group_size_max, 10) || null) : undefined,
      difficulty_level: selectedServiceBaseType === 'activity' ? formData.difficulty_level : undefined,
      equipment_provided: selectedServiceBaseType === 'activity' ? formData.equipment_provided : undefined, // Keep as array, stringify below
      safety_requirements: selectedServiceBaseType === 'activity' ? formData.safety_requirements : undefined,
      guide_required: selectedServiceBaseType === 'activity' ? formData.guide_required : undefined,
      
      // Transport Specific (conditionally add these)
      vehicle_type: selectedServiceBaseType === 'transport' ? formData.vehicle_type : undefined,
      capacity_passengers: selectedServiceBaseType === 'transport' && formData.capacity_passengers ? (parseInt(formData.capacity_passengers, 10) || null) : undefined,
      route_details: selectedServiceBaseType === 'transport' ? formData.route_details : undefined,
      price_per_km: selectedServiceBaseType === 'transport' && formData.price_per_km ? (parseFloat(formData.price_per_km) || null) : undefined,
      price_per_trip: selectedServiceBaseType === 'transport' && formData.price_per_trip ? (parseFloat(formData.price_per_trip) || null) : undefined,
      driver_included: selectedServiceBaseType === 'transport' ? formData.driver_included : undefined,

      // Common fields to be stringified or processed
      service_provider_id: vendorProfile?.id,
      // Location data
      street_address: formData.street_address,
      geo_lat: formData.geo_lat ? parseFloat(formData.geo_lat) : null,
      geo_lng: formData.geo_lng ? parseFloat(formData.geo_lng) : null,
    };
    
    // Stringify array fields
    apiPayload.availability = JSON.stringify({
        days: formData.availability_days,
        notes: formData.availability_notes
    });
    apiPayload.general_amenities = formData.general_amenities;
    if (selectedServiceBaseType === 'activity' && formData.equipment_provided) {
        apiPayload.equipment_provided = formData.equipment_provided;
    }
    
    // Remove individual fields that are now part of JSON strings or conditionally not included
    delete apiPayload.availability_days;
    delete apiPayload.availability_notes;
    // Images are intentionally not included here
    // Other fields are conditionally added/removed based on selectedServiceBaseType

    // Clean undefined properties from payload
    Object.keys(apiPayload).forEach(key => apiPayload[key] === undefined && delete apiPayload[key]);


    // --- API Call ---
    try {
      const response = await fetch("/api/vendor/my-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      const result: ApiResponse = await response.json();
      if (response.ok && result.success && result.data?.id) {
        toast({ title: "Step 1 Complete", description: "Service details saved. Please upload images." });
        setCreatedServiceId(result.data.id.toString()); // Save the new service ID
        // Do not navigate yet, wait for image upload step
      } else {
        throw new Error(result.message || "Failed to add service details.");
      }
    } catch (error: any) {
      console.error("Add Service Details Error:", error);
      toast({ variant: "destructive", title: "Error Saving Details", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsSubmittingDetails(false);
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
                <Link href="/my-services" className="hover:text-indigo-600 hover:underline">Services</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li className="flex items-center text-gray-700 font-medium">
                Add New Service
            </li>
            </ol>
        </nav>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Service</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Basic Information --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Basic Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Service Type */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                        <option value="" disabled>-- Select Type --</option>
                        <optgroup label="Transport">
                            <option value="transport/car">Car Transport</option>
                            <option value="transport/van">Van Transport</option>
                            <option value="transport/bus">Bus Transport</option>
                            <option value="transport/ferry">Ferry Transport</option>
                            <option value="transport/boat">Boat Transport</option>
                        </optgroup>
                        <optgroup label="Rentals">
                            <option value="rental/car">Car Rental</option>
                            <option value="rental/bike">Bike/Scooter Rental</option>
                            <option value="rental/boat">Boat Rental</option>
                            <option value="rental/equipment">Equipment Rental (Surfboard, etc.)</option>
                        </optgroup>
                        <optgroup label="Activities">
                            <option value="activity/tour">Tour (Guided)</option>
                            <option value="activity/watersport">Watersport (Lesson/Rental)</option>
                            <option value="activity/hiking">Hiking/Trekking</option>
                            <option value="activity/cultural">Cultural Experience</option>
                            <option value="activity/diving">Diving/Snorkeling</option>
                        </optgroup>
                    </select>
                </div>
                {/* Island */}
                <div>
                    <label htmlFor="island_id" className="block text-sm font-medium text-gray-700 mb-1">Island <span className="text-red-500">*</span></label>
                    <select id="island_id" name="island_id" value={formData.island_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                        <option value="" disabled>-- Select Island --</option>
                        {islands?.map(island => (
                        <option key={island.id} value={island.id}>{island.name}</option>
                        ))}
                    </select>
                    {islandsStatus === "error" && <p className="text-xs text-red-500 mt-1">Error loading islands.</p>}
                </div>
                {/* Name */}
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Guided Island Tour, Scooter Rental"/>
                </div>
                {/* Description */}
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Provide details about the service..."></textarea>
                </div>
                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (INR) <span className="text-red-500">*</span></label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 1500"/>
                    <p className="mt-1 text-xs text-gray-500">Base price. Specify unit (per hour/day) in relevant section below.</p>
                </div>
                {/* Active Status */} 
                <div className="flex items-center pt-6">
                    <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 cursor-pointer">Service is Active</label>
                </div>
            </div>
        </fieldset>

        {/* --- Availability & Amenities --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Availability & Amenities</legend>
            <div className="space-y-6 mt-4">
                {/* Availability Days */}
                <CheckboxGroup
                    label="Available Days"
                    name="availability_days"
                    options={availabilityDayOptions}
                    selectedValues={formData.availability_days}
                    onChange={handleArrayChange}
                    gridCols={4} // Use grid layout
                    helperText="Select the days this service is typically available."
                />
                {/* Availability Notes */}
                <div>
                    <label htmlFor="availability_notes" className="block text-sm font-medium text-gray-700 mb-1">Availability Notes</label>
                    <input type="text" id="availability_notes" name="availability_notes" value={formData.availability_notes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 9 AM - 5 PM, Closed on public holidays"/>
                    <p className="mt-1 text-xs text-gray-500">Specify times, seasonal availability, or other notes.</p>
                </div>
                {/* General Amenities */}
                <CheckboxGroup
                    label="General Amenities"
                    name="general_amenities"
                    options={generalAmenityOptions}
                    selectedValues={formData.general_amenities}
                    onChange={handleArrayChange}
                    gridCols={3} // Use grid layout
                    helperText="Select amenities available at the location or included with the service."
                />
            </div>
        </fieldset>

        {/* --- Transport Specific Fields --- */}
        {selectedServiceBaseType === "transport" && (
            <fieldset className="border border-indigo-200 p-6 rounded-lg shadow-sm bg-indigo-50">
                <legend className="text-lg font-semibold text-indigo-700 px-2">Transport Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Vehicle Type */}
                    <div>
                        <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type <span className="text-red-500">*</span></label>
                        <select id="vehicle_type" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                            <option value="" disabled>-- Select Vehicle Type --</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Minivan">Minivan</option>
                            <option value="Minibus">Minibus</option>
                            <option value="Bus">Bus</option>
                            <option value="Ferry">Ferry</option>
                            <option value="Speedboat">Speedboat</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {/* Passenger Capacity */}
                    <div>
                        <label htmlFor="capacity_passengers" className="block text-sm font-medium text-gray-700 mb-1">Passenger Capacity <span className="text-red-500">*</span></label>
                        <input type="number" id="capacity_passengers" name="capacity_passengers" value={formData.capacity_passengers} onChange={handleChange} required min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 4"/>
                    </div>
                    {/* Route Details */}
                    <div className="md:col-span-2">
                        <label htmlFor="route_details" className="block text-sm font-medium text-gray-700 mb-1">Route Details</label>
                        <textarea id="route_details" name="route_details" value={formData.route_details} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Port Blair to Havelock, Airport to Hotels"></textarea>
                        <p className="mt-1 text-xs text-gray-500">Describe the routes or areas where your service operates.</p>
                    </div>
                    {/* Pricing Details */}
                    <div>
                        <label htmlFor="price_per_km" className="block text-sm font-medium text-gray-700 mb-1">Price per KM (INR)</label>
                        <input type="number" id="price_per_km" name="price_per_km" value={formData.price_per_km} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 15"/>
                    </div>
                    <div>
                        <label htmlFor="price_per_trip" className="block text-sm font-medium text-gray-700 mb-1">Price per Trip (INR)</label>
                        <input type="number" id="price_per_trip" name="price_per_trip" value={formData.price_per_trip} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 2500"/>
                    </div>
                    {/* Driver Included */}
                    <div className="flex items-center pt-6">
                        <input type="checkbox" id="driver_included" name="driver_included" checked={formData.driver_included} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
                        <label htmlFor="driver_included" className="ml-2 block text-sm text-gray-900 cursor-pointer">Driver Included</label>
                    </div>
                </div>
            </fieldset>
        )}

        {/* --- Rental Specific Fields --- */}
        {selectedServiceBaseType === "rental" && (
            <fieldset className="border border-blue-200 p-6 rounded-lg shadow-sm bg-blue-50">
                <legend className="text-lg font-semibold text-blue-700 px-2">Rental Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Rental Unit */}
                    <div>
                        <label htmlFor="rental_unit" className="block text-sm font-medium text-gray-700 mb-1">Rental Unit <span className="text-red-500">*</span></label>
                        <select id="rental_unit" name="rental_unit" value={formData.rental_unit} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                            <option value="" disabled>-- Select Unit --</option>
                            <option value="per hour">Per Hour</option>
                            <option value="per day">Per Day</option>
                        </select>
                    </div>
                    {/* Quantity Available */}
                    <div>
                        <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700 mb-1">Quantity Available <span className="text-red-500">*</span></label>
                        <input type="number" id="quantity_available" name="quantity_available" value={formData.quantity_available} onChange={handleChange} required min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 10"/>
                    </div>
                    {/* Deposit */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="flex items-center pt-6">
                            <input type="checkbox" id="deposit_required" name="deposit_required" checked={formData.deposit_required} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
                            <label htmlFor="deposit_required" className="ml-2 block text-sm text-gray-900 cursor-pointer">Deposit Required?</label>
                        </div>
                        {formData.deposit_required && (
                            <div className="md:col-span-2">
                                <label htmlFor="deposit_amount" className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (INR)</label>
                                <input type="number" id="deposit_amount" name="deposit_amount" value={formData.deposit_amount} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 500"/>
                            </div>
                        )}
                    </div>
                    {/* Age/License Requirement */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="flex items-center pt-6">
                            <input type="checkbox" id="age_license_requirement" name="age_license_requirement" checked={formData.age_license_requirement} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
                            <label htmlFor="age_license_requirement" className="ml-2 block text-sm text-gray-900 cursor-pointer">Age/License Required?</label>
                        </div>
                        {formData.age_license_requirement && (
                            <div className="md:col-span-2">
                                <label htmlFor="age_license_details" className="block text-sm font-medium text-gray-700 mb-1">Requirement Details</label>
                                <input type="text" id="age_license_details" name="age_license_details" value={formData.age_license_details} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Min age 18, Valid driving license"/>
                            </div>
                        )}
                    </div>
                </div>
            </fieldset>
        )}

        {/* --- Activity Specific Fields --- */}
        {selectedServiceBaseType === "activity" && (
            <fieldset className="border border-green-200 p-6 rounded-lg shadow-sm bg-green-50">
                <legend className="text-lg font-semibold text-green-700 px-2">Activity Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Duration */}
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration <span className="text-red-500">*</span></label>
                            <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} required min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 3"/>
                        </div>
                        <div>
                            <label htmlFor="duration_unit" className="block text-sm font-medium text-gray-700 mb-1">Unit <span className="text-red-500">*</span></label>
                            <select id="duration_unit" name="duration_unit" value={formData.duration_unit} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                                <option value="" disabled>-- Unit --</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                    </div>
                    {/* Group Size */}
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <label htmlFor="group_size_min" className="block text-sm font-medium text-gray-700 mb-1">Min Group Size</label>
                            <input type="number" id="group_size_min" name="group_size_min" value={formData.group_size_min} onChange={handleChange} min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 2"/>
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="group_size_max" className="block text-sm font-medium text-gray-700 mb-1">Max Group Size</label>
                            <input type="number" id="group_size_max" name="group_size_max" value={formData.group_size_max} onChange={handleChange} min="1" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 10"/>
                        </div>
                    </div>
                    {/* Difficulty Level */}
                    <div>
                        <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                        <select id="difficulty_level" name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                            <option value="" disabled>-- Select Level --</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    {/* Guide Required */}
                    <div className="flex items-center pt-6">
                        <input type="checkbox" id="guide_required" name="guide_required" checked={formData.guide_required} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
                        <label htmlFor="guide_required" className="ml-2 block text-sm text-gray-900 cursor-pointer">Guide Required/Included</label>
                    </div>
                    {/* Equipment Provided */}
                    <div className="md:col-span-2">
                        <CheckboxGroup
                            label="Equipment Provided"
                            name="equipment_provided"
                            options={equipmentOptions}
                            selectedValues={formData.equipment_provided}
                            onChange={handleArrayChange}
                            gridCols={3} // Use grid layout
                            helperText="Select equipment included in the activity price."
                        />
                    </div>
                    {/* Safety Requirements */}
                    <div className="md:col-span-2">
                        <label htmlFor="safety_requirements" className="block text-sm font-medium text-gray-700 mb-1">Safety Requirements</label>
                        <textarea id="safety_requirements" name="safety_requirements" value={formData.safety_requirements} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Must be able to swim, Good physical condition required..."></textarea>
                    </div>
                </div>
            </fieldset>
        )}

        {/* --- Location --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Location (Optional)</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2">
                    <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 mb-1">Street Address / Meeting Point</label>
                    <input 
                        type="text" 
                        id="street_address" 
                        name="street_address" 
                        value={formData.street_address} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Near Jetty, Shop No. 5"
                    />
                </div>
                <div>
                    <label htmlFor="geo_lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude (from map)</label>
                    <input 
                        type="text" 
                        id="geo_lat" 
                        name="geo_lat" 
                        value={formData.geo_lat} 
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
                        value={formData.geo_lng} 
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
                            : undefined
                        }
                        mapHeight="300px"
                      />
                      <p className="text-xs text-gray-500 p-2 bg-gray-50">Click on the map or drag the marker. Use search for places.</p>
                    </div>
                  )}
                </div>
            </div>
        </fieldset>

        {/* --- Images & Policies --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Images</legend>
            <div className="mt-4">
              {!createdServiceId && (
                <div className="p-4 bg-gray-100 rounded-md text-center text-gray-600">
                  <p className="font-medium">Please save service details first to enable image uploads.</p>
                  <p className="text-sm">After saving, this section will become active.</p>
                </div>
              )}
              {createdServiceId && (
                <ImageUploader
                    label={selectedServiceBaseType === "activity" ? "Activity Images" : 
                           selectedServiceBaseType === "transport" ? "Transport Vehicle Images" : 
                           "Rental Equipment Images"}
                    onImagesUploaded={handleImagesUploaded}
                    existingImages={formData.images} // formData.images will be initially empty, or filled if coming back to this step
                    parentId={createdServiceId}  // Use the actual service ID
                    type="service" // Generic type for service images folder structure
                    maxImages={8}
                    helperText={selectedServiceBaseType === "activity" 
                        ? "Upload photos showcasing your activity (locations, equipment, guests enjoying the activity)"
                        : selectedServiceBaseType === "transport"
                        ? "Upload photos of your transport vehicles in good condition"
                        : "Upload photos of the rental equipment in good condition"}
                />
              )}
            </div>
        </fieldset>

        {/* --- Policies --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
          <legend className="text-lg font-semibold text-gray-700 px-2">Policies</legend>
          <div className="space-y-6 mt-4">
            {/* Cancellation Policy */}
            <div>
              <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
              <textarea 
                id="cancellation_policy" 
                name="cancellation_policy" 
                value={formData.cancellation_policy} 
                onChange={handleChange} 
                rows={2} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="e.g., Full refund if cancelled 24 hours prior..."
              ></textarea>
            </div>
          </div>
        </fieldset>

        {/* --- Form Actions --- */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link href="/my-services" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-150 ease-in-out">
            Cancel
          </Link>
          <button
            type={createdServiceId ? "button" : "submit"}
            disabled={isSubmittingDetails || isLoading || (!!createdServiceId && isUpdatingWithImages)}
            onClick={createdServiceId ? (e) => {
              e.preventDefault(); 
              if (formData.images.length === 0 && !isUpdatingWithImages) {
                toast({title: "Finalizing Service", description: "No images selected. Finalizing service creation."}) 
                router.push("/my-services"); 
              } else if (isUpdatingWithImages) {
                toast({title: "Image Upload Pending", description: "Please wait for images to upload and associate."}) 
              } else {
                toast({title: "Image Upload Expected", description: "Please upload images, or wait for existing selections to process."}) 
              }
            } : undefined}
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isSubmittingDetails ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Saving Details...</>
            ) : createdServiceId ? (
                isUpdatingWithImages ? (
                    <><Loader2 size={16} className="animate-spin mr-2" /> Associating Images...</>
                ) : formData.images.length > 0 ?
                "Images Selected (Auto-associates on upload)" :
                "Finish & Save Service"
            ) : (
              "Save Details & Upload Images"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Wrap with Suspense ---
export default function AddVendorServicePage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Add Service Page..." />}>
      <AddServiceForm />
    </Suspense>
  );
}
