// Path: /home/ubuntu/vendor_frontend_rev2/test 2/src/app/(vendor)/services/[serviceId]/edit/page.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, ArrowLeft, Hotel, Package, Info } from "lucide-react";
import Link from "next/link";
import { CheckboxGroup } from "@/components/CheckboxGroup"; // Import the CheckboxGroup component
import { ImageUploader } from "@/components/ImageUploader"; // Import ImageUploader
import { default as dynamicImport } from 'next/dynamic'; // Import dynamic and alias it
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Dynamically import MapPicker with ssr: false
const MapPicker = dynamicImport(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

// --- Interfaces ---
interface AuthUser {
  id: string | number;
  role_id?: number;
  price_per_km?: number;
  price_per_trip?: number;
  driver_included?: boolean;
  // Location fields for existing service data
  street_address?: string | null; 
  geo_lat?: number | null;
  geo_lng?: number | null;
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

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// Existing Service Data Interface (from GET /api/vendor/services/[serviceId])
interface VendorService {
  id: number;
  name: string;
  description: string | null;
  type: string;
  island_id: number;
  price: string | number;
  availability: string | null; // Expecting JSON string like {"days":["Mon", "Tue"], "notes":"9am-5pm"} or legacy text
  images: string | null; // Expecting JSON array string or legacy comma-separated/single URL
  amenities: string | null; // Expecting JSON string like {"general":["wifi"], "specifics":{...}}
  cancellation_policy: string | null;
  is_active: number;
  // Specific fields might be nested in amenities or separate, adjust based on actual API response
  rental_unit?: "per hour" | "per day";
  quantity_available?: number;
  deposit_required?: boolean;
  deposit_amount?: number;
  age_license_requirement?: boolean;
  age_license_details?: string;
  duration?: number;
  duration_unit?: "hours" | "days";
  group_size_min?: number;
  group_size_max?: number;
  difficulty_level?: "easy" | "medium" | "hard";
  equipment_provided?: string | string[]; // Could be JSON array string or array itself if parsed from amenities
  safety_requirements?: string;
  guide_required?: boolean;
  // Transport specific fields
  vehicle_type?: string;
  capacity_passengers?: number;
  route_details?: string;
  price_per_km?: number;
  price_per_trip?: number;
  driver_included?: boolean;
  // Location fields for existing service data
  street_address?: string | null; 
  geo_lat?: number | null;
  geo_lng?: number | null;
}

// --- Define Options for Checkbox Groups (Same as Add page) ---
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

// Updated Form state interface (using arrays for multi-select)
interface ServiceFormData {
  name: string;
  description: string;
  type: string;
  island_id: string;
  price: string;
  availability_days: string[]; // Use array for checkboxes
  availability_notes: string; // Text field for notes
  images: string[]; // Use array for TagInput
  cancellation_policy: string;
  // is_active is not edited here
  rental_unit: "per hour" | "per day" | "";
  quantity_available: string;
  deposit_required: boolean;
  deposit_amount: string;
  age_license_requirement: boolean;
  age_license_details: string;
  duration: string;
  duration_unit: "hours" | "days" | "";
  group_size_min: string;
  group_size_max: string;
  difficulty_level: "easy" | "medium" | "hard" | "";
  equipment_provided: string[]; // Use array for CheckboxGroup
  safety_requirements: string;
  guide_required: boolean;
  general_amenities: string[]; // Use array for CheckboxGroup
  // Transport Specific Fields
  vehicle_type: string;
  capacity_passengers: string;
  route_details: string;
  price_per_km: string;
  price_per_trip: string;
  driver_included: boolean;
  // Location fields for form data
  street_address: string;
  geo_lat: string;
  geo_lng: string;
}

// --- Helper Components (LoadingSpinner, VerificationPending, IncorrectVendorType, TagInput) ---
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span>{text}</span>
    </div>
);

const VerificationPending = () => (<div>VerificationPending Placeholder</div>);
const IncorrectVendorType = () => (<div>IncorrectVendorType Placeholder</div>);

// Simple Tag Input Component (Styling updated)
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
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="mt-1 flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                {value.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 flex-shrink-0 text-indigo-500 hover:text-indigo-700 focus:outline-none">
                            <span className="sr-only">Remove {tag}</span>
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
                    className="flex-grow px-1 py-0.5 border-none focus:ring-0 sm:text-sm outline-none"
                />
            </div>
            {helperText && <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>}
        </div>
    );
};

// --- Main Edit Service Form Component ---
function EditServiceForm() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };

  const [formData, setFormData] = useState<ServiceFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialServiceType, setInitialServiceType] = useState<string>("");
  const [showMap, setShowMap] = useState(false); // State for map visibility

  // 1. Fetch Vendor Profile
  const profileApiUrl = authUser?.id ? `/api/vendors/profile?userId=${authUser.id}` : null;
  const { data: vendorProfile, error: profileError, status: profileStatus } = useFetch<VendorProfile | null>(profileApiUrl);
  const isVerified = vendorProfile?.verified === 1;
  const isHotelVendor = vendorProfile?.type === "hotel";

  // 2. Fetch Existing Service Data
  const shouldFetchService = profileStatus === "success" && vendorProfile && !isHotelVendor && !!serviceId;
  const serviceApiUrl = shouldFetchService ? `/api/vendor/my-services/${serviceId}` : null;
  const { data: serviceData, error: serviceError, status: serviceStatus } = useFetch<VendorService | null>(serviceApiUrl);

  // 3. Fetch Islands
  const { data: islands = [], status: islandsStatus } = useFetch<Island[]>("/api/islands");

  // --- Utility Function to Safely Parse JSON Array String ---
  const parseJsonArray = (jsonString: string | null | undefined, fieldName: string): string[] => {
      if (!jsonString || typeof jsonString !== "string" || !jsonString.trim()) return [];
      try {
          const parsed = JSON.parse(jsonString);
          if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) return parsed;
          console.warn(`Parsed ${fieldName} data is not an array of strings:`, parsed);
          if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()];
          return [];
      } catch (e) {
          console.error(`Failed to parse ${fieldName} JSON:`, jsonString, e);
          if (typeof jsonString === "string" && jsonString.includes(",")) return jsonString.split(",").map(s => s.trim()).filter(Boolean);
          if (typeof jsonString === "string" && jsonString.trim()) return [jsonString.trim()];
          return [];
      }
  };

  // --- Populate Form Data Effect ---
  useEffect(() => {
    if (serviceStatus === "success" && serviceData) {
      const service = serviceData;
      console.log("Service Data Received from API:", JSON.stringify(service, null, 2)); // DEBUG LINE
      setInitialServiceType(service.type); // Store the initial type

      // --- Parse Amenities --- 
      let parsedGeneralAmenities: string[] = [];
      let parsedSpecifics: any = {}; // Keep 'any' for flexibility, specific parts will be type-checked later
      try {
          if (typeof service.amenities === "string" && service.amenities.trim()) {
              const rawAmenities = JSON.parse(service.amenities);
              if (typeof rawAmenities === 'object' && rawAmenities !== null) {
                  if (Array.isArray(rawAmenities.general) && rawAmenities.general.every((item: any) => typeof item === 'string')) {
                      parsedGeneralAmenities = rawAmenities.general;
                  }
                  if (typeof rawAmenities.specifics === 'object' && rawAmenities.specifics !== null) {
                      parsedSpecifics = rawAmenities.specifics;
                  }
              }
          }
      } catch (e) {
          console.error("Failed to parse amenities JSON:", service.amenities, e);
          // Defaults are already set: parsedGeneralAmenities = [], parsedSpecifics = {}
      }

      // --- Parse Availability --- 
      let parsedAvailabilityDays: string[] = [];
      let parsedAvailabilityNotes: string = "";
      try {
          if (typeof service.availability === "string" && service.availability.trim()) {
              const rawAvailability = JSON.parse(service.availability);
              if (typeof rawAvailability === 'object' && rawAvailability !== null) {
                  if (Array.isArray(rawAvailability.days) && rawAvailability.days.every((day: any) => typeof day === 'string')) {
                      parsedAvailabilityDays = rawAvailability.days;
                  }
                  if (typeof rawAvailability.notes === 'string') {
                      parsedAvailabilityNotes = rawAvailability.notes;
                  }
              }
          }
      } catch (e) {
          console.error("Failed to parse availability JSON:", service.availability, e);
          // Fallback for legacy non-JSON availability string (treat as notes)
          if (typeof service.availability === "string" && service.availability.trim() && !service.availability.startsWith('{') && !service.availability.startsWith('[')) {
              parsedAvailabilityNotes = service.availability;
          }
          // Defaults are already set: parsedAvailabilityDays = [], parsedAvailabilityNotes = ""
      }

      // --- Parse Images --- (using the existing robust parseJsonArray)
      const imagesArray = parseJsonArray(service.images, "images");

      // --- Format Initial Form State --- 
      const formDataInitial: ServiceFormData = {
        name: service.name || "",
        description: service.description || "",
        type: service.type || "",
        island_id: service.island_id ? service.island_id.toString() : "",
        price: service.price ? service.price.toString() : "",
        availability_days: parsedAvailabilityDays,
        availability_notes: parsedAvailabilityNotes,
        images: imagesArray,
        cancellation_policy: service.cancellation_policy || "",
        
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
        general_amenities: parsedGeneralAmenities,
        
        vehicle_type: "",
        capacity_passengers: "",
        route_details: "",
        price_per_km: "",
        price_per_trip: "",
        driver_included: true,
        street_address: parsedSpecifics.location?.street_address || service.street_address || "",
        geo_lat: parsedSpecifics.location?.geo_lat?.toString() || service.geo_lat?.toString() || "",
        geo_lng: parsedSpecifics.location?.geo_lng?.toString() || service.geo_lng?.toString() || "",
      };

      // Add service-specific fields based on type, using parsedSpecifics
      const serviceBaseType = service.type.split('/')[0];
      
      if (serviceBaseType === "rental") {
          const rentalSpecifics = parsedSpecifics.rental || {}; // Default to empty object
          formDataInitial.rental_unit = rentalSpecifics.unit || "";
          formDataInitial.quantity_available = rentalSpecifics.quantity_available?.toString() || "";
          formDataInitial.deposit_required = rentalSpecifics.deposit_required || false;
          formDataInitial.deposit_amount = rentalSpecifics.deposit_amount?.toString() || "";
          formDataInitial.age_license_requirement = rentalSpecifics.age_license_requirement || false;
          formDataInitial.age_license_details = rentalSpecifics.age_license_details || "";
      } else if (serviceBaseType === "activity") {
          const activitySpecifics = parsedSpecifics.activity || {}; // Default to empty object
          formDataInitial.duration = activitySpecifics.duration?.toString() || "";
          formDataInitial.duration_unit = activitySpecifics.duration_unit || "";
          formDataInitial.group_size_min = activitySpecifics.group_size_min?.toString() || "";
          formDataInitial.group_size_max = activitySpecifics.group_size_max?.toString() || "";
          formDataInitial.difficulty_level = activitySpecifics.difficulty_level || "";
          formDataInitial.equipment_provided = Array.isArray(activitySpecifics.equipment_provided) ? activitySpecifics.equipment_provided : [];
          formDataInitial.safety_requirements = activitySpecifics.safety_requirements || "";
          formDataInitial.guide_required = activitySpecifics.guide_required || false;
      } else if (serviceBaseType === "transport") {
          const transportSpecifics = parsedSpecifics.transport || {}; // Default to empty object
          formDataInitial.vehicle_type = transportSpecifics.vehicle_type || "";
          formDataInitial.capacity_passengers = transportSpecifics.capacity_passengers?.toString() || "";
          formDataInitial.route_details = transportSpecifics.route_details || "";
          formDataInitial.price_per_km = transportSpecifics.price_per_km?.toString() || "";
          formDataInitial.price_per_trip = transportSpecifics.price_per_trip?.toString() || "";
          formDataInitial.driver_included = transportSpecifics.driver_included !== undefined ? transportSpecifics.driver_included : true;
      }

      setFormData(formDataInitial);
    } else if (serviceStatus === "error") {
        toast({ variant: "destructive", title: "Error Loading Service", description: serviceError?.message || "Could not load service details." });
        router.replace("/my-services");
    }
  }, [serviceStatus, serviceData, serviceError, router]);

  // --- Authorization & Loading Checks ---
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || authUser?.role_id !== 3)) {
      router.replace("/auth/signin?reason=unauthorized_vendor");
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const isLoading = authLoading || profileStatus === "loading" || (shouldFetchService && serviceStatus === "loading") || islandsStatus === "loading";

  if (isLoading) {
    return <LoadingSpinner text="Loading Edit Service Form..." />;
  }

  // Handle Profile Fetch Error/Not Found
  if (profileStatus === "error" || (profileStatus === "success" && !vendorProfile)) {
    return <div className="text-red-600">Error loading vendor profile or profile not found.</div>;
  }

  // --- Conditional Rendering based on Type ---
  if (isHotelVendor) {
    return <IncorrectVendorType />;
  }

  // Handle Service Not Found or Error after profile is loaded
  if (shouldFetchService && serviceStatus === "success" && !serviceData) {
    return (
      <div className="text-red-600">
        Service not found or could not be loaded.
        <Link href="/my-services" className="ml-2 text-blue-600 hover:underline">Back to Services</Link>
      </div>
    );
  }
   if (shouldFetchService && serviceStatus === "error") {
     return <LoadingSpinner text="Error loading service..." />;
  }

  // If formData hasn't been populated yet
  if (!formData) {
     return <LoadingSpinner text="Processing service details..." />;
  }

  const selectedServiceBaseType = formData.type.split("/")[0];

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
    setIsSubmitting(true);

    if (!formData) {
      toast({ variant: "destructive", title: "Error", description: "Form data is not properly initialized." });
      setIsSubmitting(false);
      return;
    }

    // --- Basic Validation ---
    if (!formData.name.trim() || !formData.type || !formData.island_id || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please fill all required fields with valid data." });
      setIsSubmitting(false);
      return;
    }

    // --- Specific Validation Based on Type ---
    const serviceBaseType = formData.type.split('/')[0];
    if (serviceBaseType === "rental" && (!formData.rental_unit || isNaN(parseInt(formData.quantity_available)) || parseInt(formData.quantity_available) <= 0)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please provide valid rental unit and quantity for rentals." });
      setIsSubmitting(false);
      return;
    }
    if (serviceBaseType === "activity" && (!formData.duration_unit || isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please provide valid duration and unit for activities." });
      setIsSubmitting(false);
      return;
    }
    if (serviceBaseType === "transport" && (!formData.vehicle_type || !formData.capacity_passengers)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please provide vehicle type and capacity for transport services." });
      setIsSubmitting(false);
      return;
    }

    // --- Data Transformation for API ---
    let apiPayload: any = {
        ...formData,
        island_id: parseInt(formData.island_id, 10) || null,
        price: parseFloat(formData.price) || 0,
        availability: JSON.stringify({
            days: formData.availability_days,
            notes: formData.availability_notes
        }),
        amenities: JSON.stringify({
            general: formData.general_amenities,
            specifics: {}
        }),
        images: JSON.stringify(formData.images),
        // Location data
        street_address: formData.street_address,
        geo_lat: formData.geo_lat ? parseFloat(formData.geo_lat) : null,
        geo_lng: formData.geo_lng ? parseFloat(formData.geo_lng) : null,
    };

    delete apiPayload.availability_days;
    delete apiPayload.availability_notes;
    delete apiPayload.general_amenities;

    // Based on type, prepare type-specific data correctly
    if (serviceBaseType === "rental") {
        apiPayload.amenities = JSON.stringify({
            general: formData.general_amenities,
            specifics: {
                rental: {
                    unit: formData.rental_unit,
                    quantity_available: parseInt(formData.quantity_available, 10) || null,
                    deposit_required: formData.deposit_required,
                    deposit_amount: formData.deposit_required ? (parseFloat(formData.deposit_amount) || null) : null,
                    age_license_requirement: formData.age_license_requirement,
                    age_license_details: formData.age_license_requirement ? formData.age_license_details : ""
                }
            }
        });
        
        // Also include direct fields for backward compatibility
        apiPayload.rental_unit = formData.rental_unit;
        apiPayload.quantity_available = parseInt(formData.quantity_available, 10) || null;
        apiPayload.deposit_required = formData.deposit_required;
        apiPayload.deposit_amount = formData.deposit_required ? (parseFloat(formData.deposit_amount) || null) : null;
        apiPayload.age_license_requirement = formData.age_license_requirement;
        apiPayload.age_license_details = formData.age_license_requirement ? formData.age_license_details : "";
    } 
    else if (serviceBaseType === "activity") {
        apiPayload.amenities = JSON.stringify({
            general: formData.general_amenities,
            specifics: {
                activity: {
                    duration: parseInt(formData.duration, 10) || null,
                    duration_unit: formData.duration_unit,
                    group_size_min: parseInt(formData.group_size_min, 10) || null,
                    group_size_max: parseInt(formData.group_size_max, 10) || null,
                    difficulty_level: formData.difficulty_level,
                    equipment_provided: formData.equipment_provided,
                    safety_requirements: formData.safety_requirements,
                    guide_required: formData.guide_required
                }
            }
        });
        
        // Also include direct fields for backward compatibility
        apiPayload.duration = parseInt(formData.duration, 10) || null;
        apiPayload.duration_unit = formData.duration_unit;
        apiPayload.group_size_min = parseInt(formData.group_size_min, 10) || null;
        apiPayload.group_size_max = parseInt(formData.group_size_max, 10) || null;
        apiPayload.difficulty_level = formData.difficulty_level;
        apiPayload.equipment_provided = JSON.stringify(formData.equipment_provided);
        apiPayload.safety_requirements = formData.safety_requirements;
        apiPayload.guide_required = formData.guide_required;
    }
    else if (serviceBaseType === "transport") {
        apiPayload.amenities = JSON.stringify({
            general: formData.general_amenities,
            specifics: {
                transport: {
                    vehicle_type: formData.vehicle_type,
                    capacity_passengers: parseInt(formData.capacity_passengers, 10) || null,
                    route_details: formData.route_details,
                    price_per_km: parseFloat(formData.price_per_km) || null,
                    price_per_trip: parseFloat(formData.price_per_trip) || null,
                    driver_included: formData.driver_included
                }
            }
        });
        
        // Also include direct fields for backward compatibility
        apiPayload.vehicle_type = formData.vehicle_type;
        apiPayload.capacity_passengers = parseInt(formData.capacity_passengers, 10) || null;
        apiPayload.route_details = formData.route_details;
        apiPayload.price_per_km = parseFloat(formData.price_per_km) || null;
        apiPayload.price_per_trip = parseFloat(formData.price_per_trip) || null;
        apiPayload.driver_included = formData.driver_included;
    }

    // --- API Call (PUT) ---
    try {
      const response = await fetch(`/api/vendor/my-services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      const result: ApiResponse = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Success", description: "Service updated successfully." });
        router.push("/my-services");
      } else {
        throw new Error(result.message || "Failed to update service");
      }
    } catch (error: any) {
      console.error("Update Service Error:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handle Image Uploads ---
  const handleImagesUploaded = (imageUrls: string[]) => {
    console.log(`Images uploaded for service ID: ${serviceId}`, imageUrls);
    if (formData) {
      setFormData({ ...formData, images: imageUrls });
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
                Edit: {formData.name || "Service"}
            </li>
            </ol>
        </nav>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Service: {formData.name}</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Basic Information --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Basic Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Service Type */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                    <select 
                        id="type" 
                        name="type" 
                        value={formData?.type || ""}
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                    >
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
                 {/* is_active status is usually managed on the list page, not here */}
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

        {/* --- Images & Policies --- */}
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">Images</legend>
            <div className="mt-4">
              <ImageUploader
                label={formData.type.startsWith("activity") ? "Activity Images" : 
                      formData.type.startsWith("transport") ? "Transport Vehicle Images" : 
                      "Rental Equipment Images"}
                onImagesUploaded={handleImagesUploaded}
                existingImages={formData.images}
                parentId={serviceId}
                type="service"
                maxImages={8}
                helperText={formData.type.startsWith("activity") 
                  ? "Upload photos showcasing your activity (locations, equipment, guests enjoying the activity)"
                  : formData.type.startsWith("transport")
                  ? "Upload photos of your transport vehicles in good condition"
                  : "Upload photos of the rental equipment in good condition"}
              />
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

        {/* --- Transport Specific Fields --- */}
        {formData && formData.type.startsWith("transport/") && (
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
                        value={formData?.street_address || ""} 
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
                    disabled={!formData} // Disable if formData not loaded
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

        {/* --- Form Actions --- */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link href="/my-services" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition duration-150 ease-in-out">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
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
export default function EditVendorServicePage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Edit Service Page..." />}>
      <EditServiceForm />
    </Suspense>
  );
}
