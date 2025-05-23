'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, MinusIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

// Define types
interface PackageCategory {
  category_name: string;
  price: number;
  hotel_details: string;
  category_description: string;
  max_pax_included_in_price: number;
}

interface PackageFormData {
  name: string;
  description: string;
  duration: string;
  base_price: number;
  max_people: number;
  itinerary: string;
  included_services: string;
  images: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize form data
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    duration: '',
    base_price: 0,
    max_people: 2,
    itinerary: '',
    included_services: '',
    images: '',
    cancellation_policy: '',
    is_active: true,
    package_categories: [
      {
        category_name: 'Standard',
        price: 0,
        hotel_details: '',
        category_description: '',
        max_pax_included_in_price: 2
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

  // Handle category input changes
  const handleCategoryChange = (index: number, field: keyof PackageCategory, value: string | number) => {
    const updatedCategories = [...formData.package_categories];
    
    // Handle number inputs
    if (field === 'price' || field === 'max_pax_included_in_price') {
      updatedCategories[index][field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    } else {
      // Handle text inputs
      updatedCategories[index][field] = value as string;
    }
    
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
          max_pax_included_in_price: 2
        }
      ]
    }));
  };

  // Remove a category
  const removeCategory = (index: number) => {
    if (formData.package_categories.length === 1) {
      return; // Keep at least one category
    }
    
    const updatedCategories = formData.package_categories.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData: CreatePackageApiResponse = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data: CreatePackageApiResponse = await response.json();
      
      if (data.success) {
        router.push('/admin_packages');
      } else {
        throw new Error(data.message || 'Failed to create package');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Failed to create package:', err);
    } finally {
      setLoading(false);
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

            <div className="md:col-span-2">
              <label htmlFor="itinerary" className="block text-sm font-medium text-gray-700 mb-1">
                Itinerary
              </label>
              <textarea
                id="itinerary"
                name="itinerary"
                rows={5}
                value={formData.itinerary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Day 1: ... Day 2: ..."
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">Enter detailed day-by-day itinerary</p>
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
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comma-separated image URLs or JSON array"
              />
              <p className="text-sm text-gray-500 mt-1">Enter comma-separated image URLs or a JSON array</p>
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
                  className={`inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md ${
                    formData.package_categories.length === 1
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
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
} 