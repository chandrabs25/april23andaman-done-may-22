'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlusIcon, MinusIcon, ArrowLeftIcon, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader';
import { toast } from '@/hooks/use-toast';

// Define types
interface PackageCategory {
    id?: string | number; // Added for existing category IDs
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
    images: string[];
    cancellation_policy: string;
    is_active: boolean;
    package_categories: PackageCategory[];
}

// Generic API response type
interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
    warning?: string;
}

export default function EditPackagePage() {
    const router = useRouter();
    const params = useParams();
    const packageId = params.packageId as string;

    const [formData, setFormData] = useState<PackageFormData>({
        name: '',
        description: '',
        duration: '',
        base_price: 0,
        max_people: 2,
        itinerary: [''],
        included_services: '',
        images: [],
        cancellation_policy: '',
        is_active: true,
        package_categories: [{
            // id: undefined, // No ID for initial default category
            category_name: 'Standard',
            price: 0,
            hotel_details: '',
            category_description: '',
            max_pax_included_in_price: 2,
            images: []
        }]
    });

    const [loading, setLoading] = useState(false); // For general form submission (PUT) / image updates by main uploader
    const [isFetchingDetails, setIsFetchingDetails] = useState(true); // For initial data load
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!packageId) {
            setError("Package ID is missing.");
            setIsFetchingDetails(false);
            return;
        }

        const fetchPackageDetails = async () => {
            setIsFetchingDetails(true);
            setError(null);
            try {
                const response = await fetch(`/api/admin/packages/${packageId}`);
                if (!response.ok) {
                    const errorData: ApiResponse = await response.json();
                    throw new Error(errorData.message || `Error: ${response.status}`);
                }
                const result: ApiResponse = await response.json();
                if (result.success && result.data) {
                    const packageData = result.data;
                    // Transform itinerary from object to array
                    const itineraryArray = packageData.itinerary && typeof packageData.itinerary === 'object'
                        ? Object.values(packageData.itinerary) as string[]
                        : ['']; // Default if no itinerary

                    // Ensure images is an array
                    let mainImagesArray: string[] = [];
                    if (typeof packageData.images === 'string') {
                        try {
                            mainImagesArray = JSON.parse(packageData.images);
                            if (!Array.isArray(mainImagesArray)) mainImagesArray = [];
                        } catch (e) {
                            mainImagesArray = [];
                        }
                    } else if (Array.isArray(packageData.images)) {
                        mainImagesArray = packageData.images;
                    }

                    const processedCategories = (packageData.package_categories || []).map((cat: any) => {
                        let categoryImagesArray: string[] = [];
                        if (typeof cat.images === 'string') {
                            try {
                                categoryImagesArray = JSON.parse(cat.images);
                                if (!Array.isArray(categoryImagesArray)) categoryImagesArray = [];
                            } catch (e) {
                                categoryImagesArray = [];
                            }
                        } else if (Array.isArray(cat.images)) {
                            categoryImagesArray = cat.images;
                        }
                        return {
                            ...cat,
                            id: cat.id, // Ensure ID is carried over
                            images: categoryImagesArray,
                        };
                    });

                    setFormData({
                        name: packageData.name || '',
                        description: packageData.description || '',
                        duration: packageData.duration || '',
                        base_price: packageData.base_price || 0,
                        max_people: packageData.max_people || 2,
                        itinerary: itineraryArray.length > 0 ? itineraryArray : [''],
                        included_services: packageData.included_services || '',
                        images: mainImagesArray,
                        cancellation_policy: packageData.cancellation_policy || '',
                        is_active: packageData.is_active !== undefined ? packageData.is_active : true,
                        package_categories: processedCategories.length > 0
                            ? processedCategories
                            : [{ category_name: 'Standard', price: 0, hotel_details: '', category_description: '', max_pax_included_in_price: 2, images: [] }]
                    });
                } else {
                    throw new Error(result.message || "Failed to fetch package details.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching details.');
                console.error('Failed to fetch package details:', err);
            } finally {
                setIsFetchingDetails(false);
            }
        };

        fetchPackageDetails();
    }, [packageId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleItineraryChange = (index: number, value: string) => {
        const updatedItinerary = [...formData.itinerary];
        updatedItinerary[index] = value;
        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
    };

    const addItineraryDay = () => {
        setFormData(prev => ({ ...prev, itinerary: [...prev.itinerary, ''] }));
    };

    const removeItineraryDay = (index: number) => {
        if (formData.itinerary.length === 1) return;
        const updatedItinerary = formData.itinerary.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
    };

    const handleCategoryChange = (index: number, field: keyof PackageCategory, value: string | number) => {
        const updatedCategories = [...formData.package_categories];
        if (field === 'price' || field === 'max_pax_included_in_price') {
            updatedCategories[index][field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
        } else if (field !== 'images') {
            updatedCategories[index][field] = value as string;
        }
        setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
    };

    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            package_categories: [
                ...prev.package_categories,
                {
                    // id: `temp-${Date.now()}`, // Temporary ID for new categories for key prop, not sent to backend unless it's for parentId
                    category_name: '',
                    price: 0,
                    hotel_details: '',
                    category_description: '',
                    max_pax_included_in_price: 2,
                    images: []
                }
            ]
        }));
    };

    const handleCategoryImagesChange = (categoryIndex: number, imageUrls: string[]) => {
        const updatedCategories = [...formData.package_categories];
        updatedCategories[categoryIndex].images = imageUrls;
        setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
    };

    const removeCategory = (index: number) => {
        if (formData.package_categories.length === 1) return;
        const updatedCategories = formData.package_categories.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
    };

    // This function is called by ImageUploader and is responsible for updating the package with new image URLs
    const handleImagesUpdatedByUploader = async (imageUrls: string[]) => {
        setFormData(prev => ({ ...prev, images: imageUrls })); // Update local state first

        if (!packageId) {
            toast({ variant: "destructive", title: "Error", description: "Package ID not found. Cannot update images." });
            setError("Package ID missing, cannot update images.");
            return;
        }

        setLoading(true); // Indicate loading state for this specific action
        setError(null);
        try {
            const response = await fetch(`/api/admin/packages/${packageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images: JSON.stringify(imageUrls), // Main package images
                    package_categories: formData.package_categories.map(category => ({
                        ...category,
                        // Ensure category.id is included if it exists, for the backend to identify existing categories
                        id: category.id,
                        images: JSON.stringify(category.images || [])
                    }))
                }),
            });
            const result: ApiResponse = await response.json();

            if (response.ok && result.success) {
                toast({ title: "Images Updated", description: "Package images have been successfully updated." });
            } else {
                // Restore previous images if update failed? Or let user retry?
                // For now, just show error. User can try submitting main form again or re-upload.
                throw new Error(result.message || "Failed to update package with new images.");
            }
        } catch (error: any) {
            console.error("Update package images error:", error);
            setError(error.message || "Failed to save new images to the package.");
            toast({
                variant: "destructive",
                title: "Image Update Error",
                description: error.message || "Failed to save new images. Please try again or contact support.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const itineraryObject = formData.itinerary.reduce((obj, item, index) => {
            obj[`day${index + 1}`] = item;
            return obj;
        }, {} as Record<string, string>);

        const submissionData = {
            ...formData,
            itinerary: itineraryObject,
            images: JSON.stringify(formData.images), // Main package images
            package_categories: formData.package_categories.map(category => ({
                ...category,
                id: category.id, // Important for backend to match existing categories or create new ones
                images: JSON.stringify(category.images || []) // Category images
            })),
        };

        try {
            const response = await fetch(`/api/admin/packages/${packageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const result: ApiResponse = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `Error: ${response.status}`);
            }

            toast({ title: "Package Updated", description: "Package details updated successfully." });
            router.push('/admin_packages');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while updating the package.');
            console.error('Failed to update package:', err);
            toast({ variant: "destructive", title: "Update Failed", description: err instanceof Error ? err.message : 'An unknown error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    if (isFetchingDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2">Loading package details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin_packages"
                    className="text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-semibold">Edit Package</h1>
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

                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Package Images</h3>
                            {packageId ? (
                                <ImageUploader
                                    label="Upload Images for the Package"
                                    onImagesUploaded={handleImagesUpdatedByUploader} // This callback updates images via PUT
                                    existingImages={formData.images}
                                    parentId={packageId}
                                    type="package"
                                    maxImages={10}
                                    helperText="Manage images for the package. New images are uploaded and associated automatically. Removed images are disassociated upon clicking 'Update Package'."
                                />
                            ) : (
                                <p>Loading Image Uploader...</p> // Should not happen if packageId is present
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
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
                                        Category Images (ID: {category.id || 'New'})
                                    </label>
                                    <ImageUploader
                                        label={`Images for Category ${index + 1}`}
                                        onImagesUploaded={(imageUrls) => handleCategoryImagesChange(index, imageUrls)}
                                        existingImages={category.images || []}
                                        parentId={category.id || `temp-category-${index}-${packageId}`} // Use real ID if available
                                        type="package_category"
                                        maxImages={5}
                                        helperText="Upload images specific to this category."
                                    />
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
                        disabled={loading || isFetchingDetails}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(loading || isFetchingDetails) ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin mr-2" /> Updating...</>
                        ) : (
                            "Update Package"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
