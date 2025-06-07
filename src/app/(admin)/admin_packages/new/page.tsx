'use client';

import { useState } from 'react'; // Removed useEffect
import { useRouter } from 'next/navigation';
import { PlusIcon, MinusIcon, ArrowLeftIcon, Loader2, Info } from 'lucide-react'; // Added Loader2, Info
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader'; // Added ImageUploader
import { toast } from '@/hooks/use-toast'; // Added toast

// --- Define types for structured itinerary ---
interface ItineraryActivityData {
  name: string;
  time: string;
  duration: string;
}

interface ItineraryDayData {
  dayNumber: number; // To keep track of the day
  title: string;
  description: string;
  activities: ItineraryActivityData[];
  meals: string[];
  accommodation: string;
}
// --- End structured itinerary types ---

// Define types
interface PackageCategory {
  category_name: string;
  price: number;
  hotel_details: string;
  category_description: string;
  max_pax_included_in_price: number;
  images: string[]; // Added for category images
  activities: string[]; // Category-specific activities
  meals: string[]; // Category-specific meals
  accommodation: {
    hotel_name: string;
    room_type: string;
    amenities: string[];
    special_features: string;
  } | null; // Category-specific accommodation details
}

interface PackageFormData {
  name: string;
  description: string;
  duration: string;
  number_of_days: number; // Added field for number of days
  base_price: number;
  max_people: number;
  itinerary_days: ItineraryDayData[]; // CHANGED: to structured days
  itinerary_highlights: string[];
  itinerary_inclusions: string[];
  itinerary_exclusions: string[];
  itinerary_notes: string;
  included_services: string;
  images: string[]; // Changed to string[]
  cancellation_policy: string;
  is_active: boolean;
  package_categories: PackageCategory[];
}

interface CreatePackageApiResponse {
  success: boolean;
  message: string;
  data?: { id: number }; // For successful response
  error?: string; // For error response from API logic
  warning?: string; // For partial success
}

export default function NewPackagePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [createdPackageId, setCreatedPackageId] = useState<string | null>(null);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  // const [loading, setLoading] = useState(false); // General loading, potentially for category image uploads if they become async internally.
                                                // If not, this can be removed if isSubmittingDetails covers all loading for this page.

  // Initialize form data
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    duration: '',
    number_of_days: 1,
    base_price: 0,
    max_people: 2,
    itinerary_days: [ // CHANGED: Initialize with one structured day
      {
        dayNumber: 1,
        title: '',
        description: '',
        activities: [{ name: '', time: '', duration: '' }],
        meals: [''],
        accommodation: ''
      }
    ],
    itinerary_highlights: [''],
    itinerary_inclusions: [''],
    itinerary_exclusions: [''],
    itinerary_notes: '',
    included_services: '',
    images: [], // Initialize as empty array
    cancellation_policy: '',
    is_active: true,
    package_categories: [
      {
        category_name: 'Standard',
        price: 0,
        hotel_details: '',
        category_description: '',
        max_pax_included_in_price: 2,
        images: [],
        activities: [''],
        meals: [''],
        accommodation: {
          hotel_name: '',
          room_type: '',
          amenities: [''],
          special_features: ''
        }
      }
    ]
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      return;
    }

    // Handle text inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle itinerary day input changes
  const handleItineraryChange = (index: number, value: string) => {
    const updatedItinerary = [...formData.itinerary_days]; // CHANGED: use itinerary_days
    updatedItinerary[index].description = value; // Assuming this was for description
    setFormData(prev => ({ ...prev, itinerary_days: updatedItinerary }));
  };

  // Add a new itinerary day
  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      // OLD: itinerary: [...prev.itinerary, '']
      itinerary_days: [ // CHANGED: add new structured day
        ...prev.itinerary_days,
        {
          dayNumber: prev.itinerary_days.length + 1,
          title: '',
          description: '',
          activities: [{ name: '', time: '', duration: '' }],
          meals: [''],
          accommodation: ''
        }
      ]
    }));
  };

  // Remove an itinerary day
  const removeItineraryDay = (index: number) => {
    if (formData.itinerary_days.length === 1) { // CHANGED: use itinerary_days
      // Optionally, clear the input if it's the last one instead of removing
      // For now, we prevent removing the last day to avoid empty itinerary
      return;
    }
    const updatedItinerary = formData.itinerary_days.filter((_, i) => i !== index); // CHANGED: use itinerary_days
    setFormData(prev => ({ ...prev, itinerary_days: updatedItinerary }));
  };

  // Handle category input changes
  const handleCategoryChange = (index: number, field: keyof PackageCategory, value: string | number) => {
    const updatedCategories = [...formData.package_categories];

    // Handle number inputs
    if (field === 'price' || field === 'max_pax_included_in_price') {
      updatedCategories[index][field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    } else if (field !== 'images' && field !== 'activities' && field !== 'meals' && field !== 'accommodation') {
      // Handle text inputs (excluding complex fields)
      updatedCategories[index][field] = value as string;
    }
    // Complex fields (images, activities, meals, accommodation) are handled by specific functions
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Add a new category
  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      package_categories: [
        ...prev.package_categories,
        {
          category_name: '',
          price: 0,
          hotel_details: '',
          category_description: '',
          max_pax_included_in_price: 2,
          images: [], // Initialize category images
          activities: [''],
          meals: [''],
          accommodation: {
            hotel_name: '',
            room_type: '',
            amenities: [''],
            special_features: ''
          }
        }
      ]
    }));
  };

  // Handle category image changes
  const handleCategoryImagesChange = (index: number, imageUrls: string[]) => {
    const updatedCategories = [...formData.package_categories];
    updatedCategories[index].images = imageUrls;
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Handle category activities changes
  const handleCategoryActivitiesChange = (categoryIndex: number, activityIndex: number, value: string) => {
    const updatedCategories = [...formData.package_categories];
    const updatedActivities = [...updatedCategories[categoryIndex].activities];
    updatedActivities[activityIndex] = value;
    updatedCategories[categoryIndex].activities = updatedActivities;
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const addCategoryActivity = (categoryIndex: number) => {
    const updatedCategories = [...formData.package_categories];
    updatedCategories[categoryIndex].activities.push('');
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const removeCategoryActivity = (categoryIndex: number, activityIndex: number) => {
    const updatedCategories = [...formData.package_categories];
    if (updatedCategories[categoryIndex].activities.length > 1) {
      updatedCategories[categoryIndex].activities = updatedCategories[categoryIndex].activities.filter((_, i) => i !== activityIndex);
    }
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Handle category meals changes
  const handleCategoryMealsChange = (categoryIndex: number, mealIndex: number, value: string) => {
    const updatedCategories = [...formData.package_categories];
    const updatedMeals = [...updatedCategories[categoryIndex].meals];
    updatedMeals[mealIndex] = value;
    updatedCategories[categoryIndex].meals = updatedMeals;
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const addCategoryMeal = (categoryIndex: number) => {
    const updatedCategories = [...formData.package_categories];
    updatedCategories[categoryIndex].meals.push('');
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const removeCategoryMeal = (categoryIndex: number, mealIndex: number) => {
    const updatedCategories = [...formData.package_categories];
    if (updatedCategories[categoryIndex].meals.length > 1) {
      updatedCategories[categoryIndex].meals = updatedCategories[categoryIndex].meals.filter((_, i) => i !== mealIndex);
    }
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Handle category accommodation changes
  const handleCategoryAccommodationChange = (categoryIndex: number, field: keyof NonNullable<PackageCategory['accommodation']>, value: string | string[]) => {
    const updatedCategories = [...formData.package_categories];
    if (updatedCategories[categoryIndex].accommodation) {
      if (field === 'amenities') {
        updatedCategories[categoryIndex].accommodation![field] = value as string[];
      } else {
        updatedCategories[categoryIndex].accommodation![field] = value as string;
      }
    }
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const handleCategoryAccommodationAmenityChange = (categoryIndex: number, amenityIndex: number, value: string) => {
    const updatedCategories = [...formData.package_categories];
    if (updatedCategories[categoryIndex].accommodation) {
      const updatedAmenities = [...updatedCategories[categoryIndex].accommodation!.amenities];
      updatedAmenities[amenityIndex] = value;
      updatedCategories[categoryIndex].accommodation!.amenities = updatedAmenities;
    }
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const addCategoryAccommodationAmenity = (categoryIndex: number) => {
    const updatedCategories = [...formData.package_categories];
    if (updatedCategories[categoryIndex].accommodation) {
      updatedCategories[categoryIndex].accommodation!.amenities.push('');
    }
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  const removeCategoryAccommodationAmenity = (categoryIndex: number, amenityIndex: number) => {
    const updatedCategories = [...formData.package_categories];
    if (updatedCategories[categoryIndex].accommodation && updatedCategories[categoryIndex].accommodation!.amenities.length > 1) {
      updatedCategories[categoryIndex].accommodation!.amenities = updatedCategories[categoryIndex].accommodation!.amenities.filter((_, i) => i !== amenityIndex);
    }
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Remove a category
  const removeCategory = (index: number) => {
    if (formData.package_categories.length === 1) {
      return; // Keep at least one category
    }

    const updatedCategories = formData.package_categories.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // --- NEW: Handlers for structured itinerary ---

  // Generic handler for simple list inputs (highlights, inclusions, exclusions)
  const handleListInputChange = (listName: keyof Pick<PackageFormData, 'itinerary_highlights' | 'itinerary_inclusions' | 'itinerary_exclusions'>, index: number, value: string) => {
    setFormData(prev => {
      const newList = [...(prev[listName] as string[])];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName: keyof Pick<PackageFormData, 'itinerary_highlights' | 'itinerary_inclusions' | 'itinerary_exclusions'>) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...(prev[listName] as string[]), '']
    }));
  };

  const removeListItem = (listName: keyof Pick<PackageFormData, 'itinerary_highlights' | 'itinerary_inclusions' | 'itinerary_exclusions'>, index: number) => {
    setFormData(prev => {
      const newList = (prev[listName] as string[]).filter((_, i) => i !== index);
      // Ensure at least one item remains if it was the last one (optional, can be removed)
      if (newList.length === 0) newList.push(''); 
      return { ...prev, [listName]: newList };
    });
  };

  // Handler for general itinerary notes
  const handleItineraryNotesChange = (value: string) => {
    setFormData(prev => ({ ...prev, itinerary_notes: value }));
  };
  
  // Handler for day-specific fields (title, description, accommodation)
  const handleDayInputChange = (dayIndex: number, field: keyof Pick<ItineraryDayData, 'title' | 'description' | 'accommodation'>, value: string) => {
    const updatedDays = [...formData.itinerary_days];
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  // Handlers for day activities
  const handleActivityChange = (dayIndex: number, activityIndex: number, field: keyof ItineraryActivityData, value: string) => {
    const updatedDays = [...formData.itinerary_days];
    const updatedActivities = [...updatedDays[dayIndex].activities];
    updatedActivities[activityIndex] = { ...updatedActivities[activityIndex], [field]: value };
    updatedDays[dayIndex].activities = updatedActivities;
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  const addActivity = (dayIndex: number) => {
    const updatedDays = [...formData.itinerary_days];
    updatedDays[dayIndex].activities.push({ name: '', time: '', duration: '' });
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...formData.itinerary_days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter((_, i) => i !== activityIndex);
    // Ensure at least one activity input remains (optional)
    if (updatedDays[dayIndex].activities.length === 0) {
        updatedDays[dayIndex].activities.push({ name: '', time: '', duration: '' });
    }
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  // Handlers for day meals
  const handleMealChange = (dayIndex: number, mealIndex: number, value: string) => {
    const updatedDays = [...formData.itinerary_days];
    const updatedMeals = [...updatedDays[dayIndex].meals];
    updatedMeals[mealIndex] = value;
    updatedDays[dayIndex].meals = updatedMeals;
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  const addMeal = (dayIndex: number) => {
    const updatedDays = [...formData.itinerary_days];
    updatedDays[dayIndex].meals.push('');
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    const updatedDays = [...formData.itinerary_days];
    updatedDays[dayIndex].meals = updatedDays[dayIndex].meals.filter((_, i) => i !== mealIndex);
     // Ensure at least one meal input remains (optional)
    if (updatedDays[dayIndex].meals.length === 0) {
        updatedDays[dayIndex].meals.push('');
    }
    setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
  };

  // --- END: Handlers for structured itinerary ---

  // MODIFIED: This function now only stages the main package images in formData
  const handleMainImagesStaged = (imageUrls: string[]) => {
    setFormData(prev => ({ ...prev, images: imageUrls }));
    toast({ title: "Main Images Staged", description: "Images are ready to be saved with the package." });
    // No API call here, images will be sent with the main form submission
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmittingDetails(true); // Set submitting state for the whole process

    // Construct the detailed itinerary object for submission
    const itineraryObject = {
      days: formData.itinerary_days.map(day => ({
        day: day.dayNumber,
        title: day.title,
        description: day.description,
        activities: day.activities.filter(a => a.name.trim() !== ''),
        meals: day.meals.filter(m => m.trim() !== ''),
        accommodation: day.accommodation
      })),
      highlights: formData.itinerary_highlights.filter(h => h.trim() !== ''),
      inclusions: formData.itinerary_inclusions.filter(i => i.trim() !== ''),
      exclusions: formData.itinerary_exclusions.filter(e => e.trim() !== ''),
      notes: formData.itinerary_notes
    };

    // Prepare the complete data for POSTing
    // Images are already in formData.images (as string[])
    // Category images are already in formData.package_categories[i].images (as string[])
    const submissionData = {
      ...formData, // Includes name, description, duration, base_price, max_people, images, cancellation_policy, is_active
      itinerary: itineraryObject, // The structured itinerary object
      package_categories: formData.package_categories.map(category => ({
        ...category,
        // Backend expects images to be stringified if it's an array. The POST /api/admin/packages handles this.
        // So, we send the array as is from the client for categories.
        images: category.images || [],
        // Filter out empty activities and meals
        activities: category.activities.filter(activity => activity.trim() !== ''),
        meals: category.meals.filter(meal => meal.trim() !== ''),
        // Prepare accommodation data, ensuring amenities are filtered
        accommodation: category.accommodation ? {
          ...category.accommodation,
          amenities: category.accommodation.amenities.filter(amenity => amenity.trim() !== '')
        } : null
      })),
    };

    // Remove the individual itinerary fields from the top level of submissionData
    // as they are now consolidated into the 'itinerary' object.
    delete (submissionData as any).itinerary_days;
    delete (submissionData as any).itinerary_highlights;
    delete (submissionData as any).itinerary_inclusions;
    delete (submissionData as any).itinerary_exclusions;
    delete (submissionData as any).itinerary_notes;

    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData), // Send all data including images
      });

      const data: CreatePackageApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      // No need to setCreatedPackageId for further client-side operations if redirecting immediately.
      // It was mainly for the two-step process.
      // However, if we wanted to redirect to an edit page, data.data.id would be useful.
      toast({ title: "Package Created!", description: "The new package has been saved successfully." });
      router.push('/admin_packages'); // Redirect to admin packages list

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while creating the package');
      console.error('Failed to create package:', err);
      toast({ variant: "destructive", title: "Creation Failed", description: err instanceof Error ? err.message : "Could not create package." });
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin_packages"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Create New Package</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Package Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Package Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                required
                placeholder="e.g., 3 Days / 2 Nights"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="number_of_days" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days *
              </label>
              <input
                type="number"
                id="number_of_days"
                name="number_of_days"
                required
                min="1"
                value={formData.number_of_days}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">
                Base Price *
              </label>
              <input
                type="number"
                id="base_price"
                name="base_price"
                required
                min="0"
                step="0.01"
                value={formData.base_price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="max_people" className="block text-sm font-medium text-gray-700 mb-1">
                Max People
              </label>
              <input
                type="number"
                id="max_people"
                name="max_people"
                min="1"
                value={formData.max_people}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Itinerary Days */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Itinerary Days
                </label>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Day
                </button>
              </div>
              {formData.itinerary_days.map((day, index) => (
                <div key={index} className="space-y-2 border border-gray-200 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold text-gray-700">
                      Day {day.dayNumber}
                    </h4>
                    {formData.itinerary_days.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <MinusIcon className="h-3 w-3 mr-1" />
                        Remove Day
                      </button>
                    )}
                  </div>
                  
                  {/* Day Title */}
                  <div>
                    <label htmlFor={`itinerary_day_title_${index}`} className="block text-xs font-medium text-gray-600">Title</label>
                    <input
                      type="text"
                      id={`itinerary_day_title_${index}`}
                      value={day.title}
                      onChange={(e) => handleDayInputChange(index, 'title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={`Title for Day ${day.dayNumber}`}
                    />
                  </div>

                  {/* Day Description */}
                  <div>
                    <label htmlFor={`itinerary_day_description_${index}`} className="block text-xs font-medium text-gray-600">Description</label>
                    <textarea
                      id={`itinerary_day_description_${index}`}
                      rows={2}
                      value={day.description}
                      onChange={(e) => handleDayInputChange(index, 'description', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={`Details for Day ${day.dayNumber}...`}
                    />
                  </div>

                  {/* Day Activities */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium text-gray-600">Activities</h5>
                        <button type="button" onClick={() => addActivity(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1"/>Add Activity</button>
                    </div>
                    {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="grid grid-cols-12 gap-2 items-end text-xs">
                            <div className="col-span-5">
                                <label className="block text-xs font-extralight text-gray-500">Name</label>
                                <input type="text" placeholder="Activity Name" value={activity.name} onChange={(e) => handleActivityChange(index, actIndex, 'name', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                            </div>
                            <div className="col-span-3">
                                <label className="block text-xs font-extralight text-gray-500">Time</label>
                                <input type="text" placeholder="e.g. 09:00 AM" value={activity.time} onChange={(e) => handleActivityChange(index, actIndex, 'time', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                            </div>
                            <div className="col-span-3">
                                <label className="block text-xs font-extralight text-gray-500">Duration</label>
                                <input type="text" placeholder="e.g. 2 hours" value={activity.duration} onChange={(e) => handleActivityChange(index, actIndex, 'duration', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                            </div>
                            <div className="col-span-1">
                                {day.activities.length > 1 && <button type="button" onClick={() => removeActivity(index, actIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12}/></button>}
                            </div>
                        </div>
                    ))}
                  </div>

                  {/* Day Meals */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium text-gray-600">Meals</h5>
                        <button type="button" onClick={() => addMeal(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1"/>Add Meal</button>
                    </div>
                    {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex items-center gap-2 text-xs">
                            <input type="text" placeholder="e.g. Breakfast, Lunch" value={meal} onChange={(e) => handleMealChange(index, mealIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                            {day.meals.length > 1 && <button type="button" onClick={() => removeMeal(index, mealIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12}/></button>}
                        </div>
                    ))}
                  </div>

                  {/* Day Accommodation */}
                  <div className="pt-2">
                    <label htmlFor={`itinerary_day_accommodation_${index}`} className="block text-sm font-medium text-gray-600">Accommodation</label>
                    <input
                      type="text"
                      id={`itinerary_day_accommodation_${index}`}
                      value={day.accommodation}
                      onChange={(e) => handleDayInputChange(index, 'accommodation', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Hotel Name - Room Type"
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-1">Click "Add Day" for multi-day packages.</p>
            </div>
            
            {/* Overall Itinerary Details (Highlights, Inclusions, Exclusions, Notes) */}
            <div className="md:col-span-2 space-y-4 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-medium text-gray-700">Overall Itinerary Details</h3>
              
              {/* Highlights */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-600">Highlights</label>
                  <button type="button" onClick={() => addListItem('itinerary_highlights')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1"/>Add Highlight</button>
                </div>
                {formData.itinerary_highlights.map((highlight, hlIndex) => (
                  <div key={hlIndex} className="flex items-center gap-2 text-xs">
                    <input type="text" placeholder="e.g., Visit to Cellular Jail" value={highlight} onChange={(e) => handleListInputChange('itinerary_highlights', hlIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                    {formData.itinerary_highlights.length > 1 && <button type="button" onClick={() => removeListItem('itinerary_highlights', hlIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12}/></button>}
                  </div>
                ))}
              </div>

              {/* Inclusions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-600">Inclusions</label>
                  <button type="button" onClick={() => addListItem('itinerary_inclusions')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1"/>Add Inclusion</button>
                </div>
                {formData.itinerary_inclusions.map((inclusion, inIndex) => (
                  <div key={inIndex} className="flex items-center gap-2 text-xs">
                    <input type="text" placeholder="e.g., All Permits and Entry Tickets" value={inclusion} onChange={(e) => handleListInputChange('itinerary_inclusions', inIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                    {formData.itinerary_inclusions.length > 1 && <button type="button" onClick={() => removeListItem('itinerary_inclusions', inIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12}/></button>}
                  </div>
                ))}
              </div>

              {/* Exclusions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-600">Exclusions</label>
                  <button type="button" onClick={() => addListItem('itinerary_exclusions')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1"/>Add Exclusion</button>
                </div>
                {formData.itinerary_exclusions.map((exclusion, exIndex) => (
                  <div key={exIndex} className="flex items-center gap-2 text-xs">
                    <input type="text" placeholder="e.g., Personal Expenses" value={exclusion} onChange={(e) => handleListInputChange('itinerary_exclusions', exIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                    {formData.itinerary_exclusions.length > 1 && <button type="button" onClick={() => removeListItem('itinerary_exclusions', exIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12}/></button>}
                  </div>
                ))}
              </div>

              {/* Itinerary Notes */}
              <div>
                <label htmlFor="itinerary_notes" className="block text-sm font-medium text-gray-600">Itinerary Notes</label>
                <textarea
                  id="itinerary_notes"
                  rows={3}
                  value={formData.itinerary_notes}
                  onChange={(e) => handleItineraryNotesChange(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Any special notes for the itinerary..."
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="included_services" className="block text-sm font-medium text-gray-700 mb-1">
                Included Services
              </label>
              <textarea
                id="included_services"
                name="included_services"
                rows={3}
                value={formData.included_services}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Airport transfers, Sightseeing, Meals, etc."
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Policy
              </label>
              <textarea
                id="cancellation_policy"
                name="cancellation_policy"
                rows={3}
                value={formData.cancellation_policy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cancellation terms and conditions..."
              ></textarea>
            </div>

            {/* Images Section - Conditional Rendering */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Package Images</h3>
              <ImageUploader
                label="Upload Images for the Package"
                onImagesUploaded={handleMainImagesStaged}
                existingImages={formData.images}
                parentId={createdPackageId || "new-package-main-images"}
                type="package"
                maxImages={10}
                helperText="Upload images that showcase the package. These will be saved when you create the package."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active (visible to users)
              </label>
            </div>
          </div>
        </div>

        {/* Package Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Package Categories</h2>
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Category
            </button>
          </div>

          {formData.package_categories.map((category, index) => (
            <div key={index} className="mb-8 border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Category {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  disabled={formData.package_categories.length === 1}
                  className={`inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md ${formData.package_categories.length === 1
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    }`}
                >
                  <MinusIcon className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={category.category_name}
                    onChange={(e) => handleCategoryChange(index, 'category_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Standard, Deluxe, Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={category.price}
                    onChange={(e) => handleCategoryChange(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max People Included in Price
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={category.max_pax_included_in_price}
                    onChange={(e) => handleCategoryChange(index, 'max_pax_included_in_price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel Details
                  </label>
                  <textarea
                    rows={3}
                    value={category.hotel_details}
                    onChange={(e) => handleCategoryChange(index, 'hotel_details', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Port Blair: Hotel Royal Palace - Deluxe AC Room, Havelock: Symphony Palms - Premium Cottage"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Description
                  </label>
                  <textarea
                    rows={2}
                    value={category.category_description}
                    onChange={(e) => handleCategoryChange(index, 'category_description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional information about this category"
                  ></textarea>
                </div>

                {/* Image Uploader for Category */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Images
                  </label>
                  <ImageUploader
                    label={`Images for Category ${index + 1}`}
                    onImagesUploaded={(imageUrls) => handleCategoryImagesChange(index, imageUrls)}
                    existingImages={category.images}
                    // Provide a unique temporary parentId if createdPackageId is not yet available.
                    // This is for the ImageUploader's own potential needs; images are saved with the main form submission.
                    parentId={createdPackageId || `new-pkg-category-${index}`}
                    type="package_category"
                    maxImages={5} // Example: Max 5 images per category
                    helperText="Upload images specific to this category. Images will be saved when you create the package."
                  />
                </div>

                {/* Category Activities */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Category Activities</label>
                    <button type="button" onClick={() => addCategoryActivity(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                      <PlusIcon size={12} className="inline mr-1"/>Add Activity
                    </button>
                  </div>
                  {category.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-center gap-2 text-xs">
                      <input 
                        type="text" 
                        placeholder="e.g., Private beach access, Scuba diving" 
                        value={activity} 
                        onChange={(e) => handleCategoryActivitiesChange(index, actIndex, e.target.value)} 
                        className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                      {category.activities.length > 1 && (
                        <button type="button" onClick={() => removeCategoryActivity(index, actIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                          <MinusIcon size={12}/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Category Meals */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Category Meals</label>
                    <button type="button" onClick={() => addCategoryMeal(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                      <PlusIcon size={12} className="inline mr-1"/>Add Meal
                    </button>
                  </div>
                  {category.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex items-center gap-2 text-xs">
                      <input 
                        type="text" 
                        placeholder="e.g., Welcome breakfast, Premium dinner buffet" 
                        value={meal} 
                        onChange={(e) => handleCategoryMealsChange(index, mealIndex, e.target.value)} 
                        className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                      {category.meals.length > 1 && (
                        <button type="button" onClick={() => removeCategoryMeal(index, mealIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                          <MinusIcon size={12}/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Category Accommodation */}
                <div className="md:col-span-2 space-y-4 p-4 border border-gray-200 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Category Accommodation Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Hotel Name</label>
                      <input
                        type="text"
                        value={category.accommodation?.hotel_name || ''}
                        onChange={(e) => handleCategoryAccommodationChange(index, 'hotel_name', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Symphony Palms Beach Resort"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600">Room Type</label>
                      <input
                        type="text"
                        value={category.accommodation?.room_type || ''}
                        onChange={(e) => handleCategoryAccommodationChange(index, 'room_type', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Ocean View Suite, Deluxe Room"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600">Special Features</label>
                      <textarea
                        rows={2}
                        value={category.accommodation?.special_features || ''}
                        onChange={(e) => handleCategoryAccommodationChange(index, 'special_features', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Complimentary spa access, Private balcony"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-medium text-gray-600">Amenities</label>
                        <button type="button" onClick={() => addCategoryAccommodationAmenity(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                          <PlusIcon size={12} className="inline mr-1"/>Add Amenity
                        </button>
                      </div>
                      {category.accommodation?.amenities.map((amenity, amenityIndex) => (
                        <div key={amenityIndex} className="flex items-center gap-2 text-xs">
                          <input 
                            type="text" 
                            placeholder="e.g., Mini bar, Room service, WiFi" 
                            value={amenity} 
                            onChange={(e) => handleCategoryAccommodationAmenityChange(index, amenityIndex, e.target.value)} 
                            className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                          {category.accommodation && category.accommodation.amenities.length > 1 && (
                            <button type="button" onClick={() => removeCategoryAccommodationAmenity(index, amenityIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                              <MinusIcon size={12}/>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin_packages"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            // Ensure `loading` state is considered if it still exists and is relevant for disabling the button during image uploads by category image uploaders.
            // For a single main submit, `isSubmittingDetails` is the primary concern.
            // The condition `(!createdPackageId && ...)` was for the old two-step save, which is no longer the case for the button's primary role.
            // Basic validation (empty fields) for enabling the button before any submission attempt:
            disabled={isSubmittingDetails || formData.name === '' || formData.duration === '' || formData.base_price <= 0}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmittingDetails) ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmittingDetails ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Creating Package...</>
            ) : (
              "Create Package"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 