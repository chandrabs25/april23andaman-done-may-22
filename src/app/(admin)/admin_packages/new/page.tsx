'use client';

import { useState } from 'react'; // Removed useEffect
import { useRouter } from 'next/navigation';
import { PlusIcon, MinusIcon, ArrowLeftIcon, Loader2, Info } from 'lucide-react'; // Added Loader2, Info
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader'; // Added ImageUploader
import { toast } from '@/hooks/use-toast'; // Added toast

// Define types
interface PackageCategory {
  category_name: string;
  price: number;
  hotel_details: string;
  category_description: string;
  max_pax_included_in_price: number;
  images: string[]; // Added for category images
}

interface PackageFormData {
  name: string;
  description: string;
  duration: string;
  base_price: number;
  max_people: number;
  itinerary: string[];
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
  const [loading, setLoading] = useState(false); // Will be used for general loading, image updates
  const [error, setError] = useState<string | null>(null);
  const [createdPackageId, setCreatedPackageId] = useState<string | null>(null);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  // tempPackageId is not strictly needed as ImageUploader can take null/undefined parentId initially if desired,
  // or we ensure it only renders when createdPackageId is set.
  // For simplicity, we'll ensure ImageUploader only gets a valid createdPackageId.

  // Initialize form data
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    duration: '',
    base_price: 0,
    max_people: 2,
    itinerary: [''], // Initialize with one empty day
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
        images: []
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
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index] = value;
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  // Add a new itinerary day
  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, '']
    }));
  };

  // Remove an itinerary day
  const removeItineraryDay = (index: number) => {
    if (formData.itinerary.length === 1) {
      // Optionally, clear the input if it's the last one instead of removing
      // For now, we prevent removing the last day to avoid empty itinerary
      return;
    }
    const updatedItinerary = formData.itinerary.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  // Handle category input changes
  const handleCategoryChange = (index: number, field: keyof PackageCategory, value: string | number) => {
    const updatedCategories = [...formData.package_categories];

    // Handle number inputs
    if (field === 'price' || field === 'max_pax_included_in_price') {
      updatedCategories[index][field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    } else if (field !== 'images') { // Add this condition to exclude 'images'
      // Handle text inputs
      updatedCategories[index][field] = value as string;
    }
    // If field is 'images', do nothing here, as it's handled by handleCategoryImagesChange
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
          images: [] // Initialize category images
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

  // Remove a category
  const removeCategory = (index: number) => {
    if (formData.package_categories.length === 1) {
      return; // Keep at least one category
    }

    const updatedCategories = formData.package_categories.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Handle images uploaded by ImageUploader
  const handleImagesUploaded = async (imageUrls: string[]) => {
    setFormData(prev => ({ ...prev, images: imageUrls }));

    if (!createdPackageId) {
      toast({ variant: "destructive", title: "Error", description: "Package ID not found. Cannot associate images." });
      setError("Package ID missing, cannot update images.");
      return;
    }

    setLoading(true); // Use general loading for this final update
    setError(null);
    try {
      const response = await fetch(`/api/admin/packages/${createdPackageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: JSON.stringify(imageUrls), // Main package images
          package_categories: formData.package_categories.map(category => ({
            ...category,
            images: JSON.stringify(category.images || []) // Ensure category images are also stringified
          }))
        }),
      });
      const result: CreatePackageApiResponse = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Success", description: "Package created and images uploaded successfully!" });
        router.push('/admin_packages');
      } else {
        throw new Error(result.message || "Failed to update package with images.");
      }
    } catch (error: any) {
      console.error("Update package with images error:", error);
      setError(error.message || "Failed to save images to the package. You may need to edit the package to add them.");
      toast({
        variant: "destructive",
        title: "Image Association Error",
        description: error.message || "Failed to save images. Edit the package to add them.",
      });
      // Optionally redirect to edit page or allow user to retry image upload
      // router.push(`/admin_packages/edit/${createdPackageId}`); 
    } finally {
      setLoading(false);
    }
  };


  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If package details are not yet created
    if (!createdPackageId) {
      setIsSubmittingDetails(true);

      const itineraryObject = formData.itinerary.reduce((obj, item, index) => {
        obj[`day${index + 1}`] = item;
        return obj;
      }, {} as Record<string, string>);

      // Send empty images array or omit if API allows
      const initialSubmissionData = {
        ...formData,
        itinerary: itineraryObject,
        images: [], // Send empty array for initial creation
      };

      try {
        const response = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initialSubmissionData),
        });

        const data: CreatePackageApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || `Error: ${response.status}`);
        }

        if (data.data?.id) {
          setCreatedPackageId(String(data.data.id));
          toast({ title: "Details Saved", description: "Package details saved. You can now upload images." });
          // Do not redirect. Form stays, ImageUploader becomes active.
        } else {
          throw new Error(data.message || 'Failed to create package details, ID missing.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while saving details');
        console.error('Failed to create package details:', err);
      } finally {
        setIsSubmittingDetails(false);
      }
    } else {
      // This case is if user clicks "Finish" after images are uploaded (or chooses to skip)
      // The actual image association happens in handleImagesUploaded
      if (formData.images.length > 0) {
        // Images have been uploaded and processed by handleImagesUploaded, which includes redirection.
        // If not redirected there, redirect here.
        toast({ title: "Package Ready", description: "Package created with images." });
        router.push('/admin_packages');
      } else {
        // No images uploaded, or user chose to skip.
        toast({ title: "Package Created", description: "Package created without images." });
        router.push('/admin_packages');
      }
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

            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Itinerary
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

              {formData.itinerary.map((dayDescription, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`itinerary_day_${index + 1}`} className="block text-sm font-medium text-gray-700">
                      Day {index + 1}
                    </label>
                    {formData.itinerary.length > 1 && (
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
                  <textarea
                    id={`itinerary_day_${index + 1}`}
                    name={`itinerary_day_${index + 1}`}
                    rows={3}
                    value={dayDescription}
                    onChange={(e) => handleItineraryChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Details for Day ${index + 1}...`}
                  />
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-1">Enter detailed day-by-day itinerary.</p>
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
              {!createdPackageId ? (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <Info size={20} className="mx-auto mb-2 text-gray-400" />
                  <p>Please save package details first to enable image uploads.</p>
                  <p className="text-xs mt-1">The "Save Details & Proceed to Images" button will appear below once all required fields are filled.</p>
                </div>
              ) : (
                <ImageUploader
                  label="Upload Images for the Package"
                  onImagesUploaded={handleImagesUploaded}
                  existingImages={formData.images}
                  parentId={createdPackageId}
                  type="package" // Ensure this type is handled by your API and ImageUploader
                  maxImages={10}
                  helperText="Upload images that showcase the package. Images are saved as they are uploaded via the uploader."
                />
              )}
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
                  {createdPackageId ? ( // Only enable category image uploader after package details are saved
                    <ImageUploader
                      label={`Images for Category ${index + 1}`}
                      onImagesUploaded={(imageUrls) => handleCategoryImagesChange(index, imageUrls)}
                      existingImages={category.images}
                      // For categories, parentId might be tricky. 
                      // If categories are saved along with the package, they won't have an ID yet.
                      // Using a temporary ID for upload, assuming backend /api/upload/images can handle it or it's mainly for client-side preview.
                      // Or, this uploader is only fully functional in edit mode.
                      // For now, using a temp ID. The actual association happens when the package is saved with category data.
                      parentId={`temp-category-${index}-${createdPackageId || 'new'}`}
                      type="package_category"
                      maxImages={5} // Example: Max 5 images per category
                      helperText="Upload images specific to this category."
                    />
                  ) : (
                    <div className="p-3 text-center text-xs text-gray-400 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      Save package details to enable category image uploads.
                    </div>
                  )}
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
            disabled={isSubmittingDetails || loading || (!createdPackageId && (formData.name === '' || formData.duration === '' || formData.base_price <= 0))}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmittingDetails || loading) ? 'opacity-75 cursor-not-allowed' : ''
              }`}
          >
            {isSubmittingDetails ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Saving Details...</>
            ) : loading ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Processing Images...</>
            ) : !createdPackageId ? (
              "Save Details & Proceed to Images"
            ) : (
              "Finish & Create Package"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 