'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PlusIcon, MinusIcon, ArrowLeftIcon, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/components/ImageUploader';
import { toast } from '@/hooks/use-toast';

// --- Define types for structured itinerary (consistent with new page) ---
interface ItineraryActivityData {
    name: string;
    time: string;
    duration: string;
}

interface ItineraryDayData {
    dayNumber: number;
    title: string;
    description: string;
    activities: ItineraryActivityData[];
    meals: string[];
    accommodation: string;
}

// Define types (consistent with new page)
interface PackageCategory {
    category_name: string;
    price: number;
    hotel_details: string;
    category_description: string;
    max_pax_included_in_price: number;
    images: string[]; // URLs
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
    number_of_days: number;
    base_price: number;
    max_people: number;
    itinerary_days: ItineraryDayData[];
    itinerary_highlights: string[];
    itinerary_inclusions: string[];
    itinerary_exclusions: string[];
    itinerary_notes: string;
    included_services: string;
    images: string[]; // URLs for main package images
    cancellation_policy: string;
    is_active: boolean;
    package_categories: PackageCategory[];
}

// API response types
interface ApiPackageCategoryData { // As fetched from GET /api/admin/packages/[id]
    id: number;
    package_id: number;
    category_name: string;
    price: number;
    hotel_details: string | null;
    category_description: string | null;
    max_pax_included_in_price: number | null;
    images: string | null; // JSON string of URLs
    activities: string | null; // JSON string of activities
    meals: string | null; // JSON string of meals
    accommodation: string | null; // JSON string of accommodation
    created_at?: string;
    updated_at?: string;
}

interface ApiPackageData { // As fetched from GET /api/admin/packages/[id]
    id: number;
    name: string;
    description: string | null;
    duration: string;
    number_of_days: number | null;
    base_price: number;
    max_people: number | null;
    itinerary: string | null; // JSON string for the structured itinerary
    included_services: string | null;
    images: string | null; // JSON string for main package images
    cancellation_policy: string | null;
    is_active: number; // 0 or 1
    created_by: number;
    created_at: string;
    updated_at: string;
}

interface GetPackageApiResponse {
    success: boolean;
    message: string;
    data?: {
        package: ApiPackageData;
        categories: ApiPackageCategoryData[];
    };
    error?: string;
}

interface UpdatePackageApiResponse {
    success: boolean;
    message: string;
    data?: { id: number };
    error?: string;
    warning?: string;
}


export default function EditPackagePage() {
    const router = useRouter();
    const params = useParams();
    const packageId = params.packageId as string;

    const [loading, setLoading] = useState(false); // For general saving
    const [pageLoading, setPageLoading] = useState(true); // For initial data load
    const [error, setError] = useState<string | null>(null);
    // No createdPackageId needed, we use packageId from URL.
    // No isSubmittingDetails needed as we load data first, then allow edits and image uploads.

    const [formData, setFormData] = useState<PackageFormData>({
        name: '',
        description: '',
        duration: '',
        number_of_days: 1,
        base_price: 0,
        max_people: 2,
        itinerary_days: [{ dayNumber: 1, title: '', description: '', activities: [{ name: '', time: '', duration: '' }], meals: [''], accommodation: '' }],
        itinerary_highlights: [''],
        itinerary_inclusions: [''],
        itinerary_exclusions: [''],
        itinerary_notes: '',
        included_services: '',
        images: [],
        cancellation_policy: '',
        is_active: true,
        package_categories: [{ 
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
        }]
    });

    useEffect(() => {
        if (!packageId) {
            setError("Package ID is missing.");
            setPageLoading(false);
            return;
        }

        const fetchPackageData = async () => {
            setPageLoading(true);
            try {
                const response = await fetch(`/api/admin/packages/${packageId}`);
                const result: GetPackageApiResponse = await response.json();

                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.message || "Failed to fetch package data.");
                }

                const { package: pkgData, categories: catData } = result.data;

                // Parse itinerary
                let parsedItineraryDays: ItineraryDayData[] = [{ dayNumber: 1, title: '', description: '', activities: [{ name: '', time: '', duration: '' }], meals: [''], accommodation: '' }];
                let parsedHighlights: string[] = [''];
                let parsedInclusions: string[] = [''];
                let parsedExclusions: string[] = [''];
                let parsedNotes: string = '';

                if (pkgData.itinerary) {
                    try {
                        const itineraryObj = JSON.parse(pkgData.itinerary);

                        if (itineraryObj && typeof itineraryObj === 'object') {
                            // Check for new structure first (presence of 'days' array)
                            if (Array.isArray(itineraryObj.days)) {
                                parsedItineraryDays = itineraryObj.days.map((day: any, index: number) => ({
                                    dayNumber: day.day || (index + 1),
                                    title: day.title || '',
                                    description: typeof day.description === 'string' ? day.description : '',
                                    activities: (Array.isArray(day.activities) && day.activities.length > 0 ? day.activities : [{ name: '', time: '', duration: '' }]).map((act: any) => ({
                                        name: String(act.name || ''),
                                        time: String(act.time || ''),
                                        duration: String(act.duration || ''),
                                    })),
                                    meals: Array.isArray(day.meals) && day.meals.length > 0 ? day.meals.map(String).filter((m: string) => m.trim() !== '') : [''],
                                    accommodation: String(day.accommodation || ''),
                                }));
                                if (parsedItineraryDays.length === 0) { // Ensure at least one day structure if 'days' was empty array
                                    parsedItineraryDays = [{ dayNumber: 1, title: '', description: '', activities: [{ name: '', time: '', duration: '' }], meals: [''], accommodation: '' }];
                                }
                            } else {
                                // Handle old structure (day1, day2, etc. as keys)
                                const oldDays: ItineraryDayData[] = [];
                                let dayCounter = 1;
                                while (itineraryObj[`day${dayCounter}`] !== undefined) {
                                    const dayDescription = itineraryObj[`day${dayCounter}`];
                                    if (typeof dayDescription === 'string') {
                                        oldDays.push({
                                            dayNumber: dayCounter,
                                            title: '', // No title in old structure, let user fill
                                            description: dayDescription,
                                            activities: [{ name: '', time: '', duration: '' }], // Default empty
                                            meals: [''], // Default empty
                                            accommodation: '' // Default empty
                                        });
                                    }
                                    dayCounter++;
                                }
                                if (oldDays.length > 0) {
                                    parsedItineraryDays = oldDays;
                                }
                                // If neither itineraryObj.days nor dayX keys are found, parsedItineraryDays remains the default single empty day.
                            }

                            // Parse highlights, inclusions, exclusions, notes (this part is likely fine)
                            parsedHighlights = Array.isArray(itineraryObj.highlights) && itineraryObj.highlights.length > 0 ? itineraryObj.highlights.map(String).filter((s: string) => s.trim() !== '') : [''];
                            if (parsedHighlights.length === 0) parsedHighlights = ['']; // Ensure at least one input

                            parsedInclusions = Array.isArray(itineraryObj.inclusions) && itineraryObj.inclusions.length > 0 ? itineraryObj.inclusions.map(String).filter((s: string) => s.trim() !== '') : [''];
                            if (parsedInclusions.length === 0) parsedInclusions = [''];

                            parsedExclusions = Array.isArray(itineraryObj.exclusions) && itineraryObj.exclusions.length > 0 ? itineraryObj.exclusions.map(String).filter((s: string) => s.trim() !== '') : [''];
                            if (parsedExclusions.length === 0) parsedExclusions = [''];

                            parsedNotes = typeof itineraryObj.notes === 'string' ? itineraryObj.notes : '';
                        }
                    } catch (e) {
                        console.error("Failed to parse itinerary JSON:", e);
                        // Keep parsedItineraryDays, etc. as their default initial values
                        setError("Failed to parse itinerary data. It may be malformed. Defaulting to empty structure.");
                    }
                }

                const parsedMainImages = pkgData.images ? (tryParseJSON(pkgData.images) || []) : [];

                setFormData({
                    name: pkgData.name || '',
                    description: pkgData.description || '',
                    duration: pkgData.duration || '',
                    number_of_days: pkgData.number_of_days || 1,
                    base_price: pkgData.base_price || 0,
                    max_people: pkgData.max_people || 2,
                    itinerary_days: parsedItineraryDays,
                    itinerary_highlights: parsedHighlights,
                    itinerary_inclusions: parsedInclusions,
                    itinerary_exclusions: parsedExclusions,
                    itinerary_notes: parsedNotes,
                    included_services: pkgData.included_services || '',
                    images: parsedMainImages,
                    cancellation_policy: pkgData.cancellation_policy || '',
                    is_active: pkgData.is_active === 1,
                    package_categories: catData.map(cat => ({
                        category_name: cat.category_name || '',
                        price: cat.price || 0,
                        hotel_details: cat.hotel_details || '',
                        category_description: cat.category_description || '',
                        max_pax_included_in_price: cat.max_pax_included_in_price || 2,
                        images: cat.images ? (tryParseJSON(cat.images) || []) : [],
                        activities: cat.activities ? (tryParseJSON(cat.activities) || ['']) : [''],
                        meals: cat.meals ? (tryParseJSON(cat.meals) || ['']) : [''],
                        accommodation: cat.accommodation ? (tryParseAccommodationJSON(cat.accommodation) || {
                            hotel_name: '',
                            room_type: '',
                            amenities: [''],
                            special_features: ''
                        }) : {
                            hotel_name: '',
                            room_type: '',
                            amenities: [''],
                            special_features: ''
                        }
                    }))
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
                console.error("Failed to load package data:", err);
            } finally {
                setPageLoading(false);
            }
        };

        fetchPackageData();
    }, [packageId]);

    const tryParseJSON = (jsonString: string): string[] | null => {
        try {
            const result = JSON.parse(jsonString);
            return Array.isArray(result) ? result.map(String) : null;
        } catch (e) {
            console.warn("Failed to parse JSON string:", jsonString, e);
            return null; // Return null or an empty array or handle error as needed
        }
    };

    const tryParseAccommodationJSON = (jsonString: string): PackageCategory['accommodation'] | null => {
        try {
            const result = JSON.parse(jsonString);
            if (result && typeof result === 'object') {
                return {
                    hotel_name: result.hotel_name || '',
                    room_type: result.room_type || '',
                    amenities: Array.isArray(result.amenities) ? result.amenities.map(String) : [''],
                    special_features: result.special_features || ''
                };
            }
            return null;
        } catch (e) {
            console.warn("Failed to parse accommodation JSON string:", jsonString, e);
            return null;
        }
    };

    // --- Input Handlers (copied from new/page.tsx, verify no changes needed) ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary_days: [
                ...prev.itinerary_days,
                { dayNumber: prev.itinerary_days.length + 1, title: '', description: '', activities: [{ name: '', time: '', duration: '' }], meals: [''], accommodation: '' }
            ]
        }));
    };

    const removeItineraryDay = (index: number) => {
        if (formData.itinerary_days.length === 1) return;
        const updatedItinerary = formData.itinerary_days.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, itinerary_days: updatedItinerary }));
    };

    const handleCategoryChange = (index: number, field: keyof PackageCategory, value: string | number) => {
        const updatedCategories = [...formData.package_categories];
        if (field === 'price' || field === 'max_pax_included_in_price') {
            updatedCategories[index][field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
        } else if (field !== 'images' && field !== 'activities' && field !== 'meals' && field !== 'accommodation') {
            // Handle text inputs (excluding complex fields)
            updatedCategories[index][field] = value as string;
        }
        // Complex fields (images, activities, meals, accommodation) are handled by specific functions
        setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
    };

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
        }));
    };

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

    const removeCategory = (index: number) => {
        if (formData.package_categories.length === 1) return;
        const updatedCategories = formData.package_categories.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
    };

    const handleListInputChange = (listName: keyof Pick<PackageFormData, 'itinerary_highlights' | 'itinerary_inclusions' | 'itinerary_exclusions'>, index: number, value: string) => {
        setFormData(prev => {
            const newList = [...(prev[listName] as string[])];
            newList[index] = value;
            return { ...prev, [listName]: newList };
        });
    };

    const addListItem = (listName: keyof Pick<PackageFormData, 'itinerary_highlights' | 'itinerary_inclusions' | 'itinerary_exclusions'>) => {
        setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] as string[]), ''] }));
    };

    const removeListItem = (listName: keyof Pick<PackageFormData, 'itinerary_highlights' | 'itinerary_inclusions' | 'itinerary_exclusions'>, index: number) => {
        setFormData(prev => {
            const newList = (prev[listName] as string[]).filter((_, i) => i !== index);
            if (newList.length === 0) newList.push('');
            return { ...prev, [listName]: newList };
        });
    };

    const handleItineraryNotesChange = (value: string) => {
        setFormData(prev => ({ ...prev, itinerary_notes: value }));
    };

    const handleDayInputChange = (dayIndex: number, field: keyof Pick<ItineraryDayData, 'title' | 'description' | 'accommodation'>, value: string) => {
        const updatedDays = [...formData.itinerary_days];
        updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
        setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
    };

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
        if (updatedDays[dayIndex].activities.length === 0) {
            updatedDays[dayIndex].activities.push({ name: '', time: '', duration: '' });
        }
        setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
    };

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
        if (updatedDays[dayIndex].meals.length === 0) {
            updatedDays[dayIndex].meals.push('');
        }
        setFormData(prev => ({ ...prev, itinerary_days: updatedDays }));
    };
    // --- END Input Handlers ---

    // MODIFIED: handleImagesUploaded now just updates formData and triggers main submit.
    const handleMainImagesUploaded = (imageUrls: string[]) => {
        setFormData(prev => ({ ...prev, images: imageUrls }));
        toast({ title: "Main Images Updated", description: "New main package images are staged. Save the package to apply all changes." });
    };

    const handleCategoryImagesUpdated = (categoryIndex: number, imageUrls: string[]) => {
        const updatedCategories = [...formData.package_categories];
        updatedCategories[categoryIndex].images = imageUrls;
        setFormData(prev => ({ ...prev, package_categories: updatedCategories }));
        toast({ title: `Category ${categoryIndex + 1} Images Updated`, description: "New images are staged. Save the package to apply all changes." });
    };


    // MODIFIED: Submit form for editing
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!packageId) {
            setError("Package ID is missing. Cannot update.");
            return;
        }
        setLoading(true);
        setError(null);

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

        const submissionData = {
            ...formData,
            itinerary: itineraryObject, // Backend expects 'itinerary' as the key for the complex object
            // Main package images are already in formData.images as string[]
            // Category images are already in formData.package_categories[i].images as string[]
            // The PUT request handler at /api/admin/packages/[packageId] will stringify these arrays.
            package_categories: formData.package_categories.map(category => ({
                ...category,
                // Filter out empty activities and meals
                activities: category.activities.filter(activity => activity.trim() !== ''),
                meals: category.meals.filter(meal => meal.trim() !== ''),
                // Prepare accommodation data, ensuring amenities are filtered
                accommodation: category.accommodation ? {
                    ...category.accommodation,
                    amenities: category.accommodation.amenities.filter(amenity => amenity.trim() !== '')
                } : null
            }))
        };

        // Remove individual itinerary fields as they are now in submissionData.itinerary
        delete (submissionData as any).itinerary_days;
        delete (submissionData as any).itinerary_highlights;
        delete (submissionData as any).itinerary_inclusions;
        delete (submissionData as any).itinerary_exclusions;
        delete (submissionData as any).itinerary_notes;

        try {
            const response = await fetch(`/api/admin/packages/${packageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const result: UpdatePackageApiResponse = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || result.error || `Error: ${response.status}`);
            }

            toast({ title: "Success", description: "Package updated successfully!" });
            if (result.warning) {
                toast({ variant: "default", title: "Notice", description: result.warning, duration: 7000 });
            }
            router.push('/admin_packages');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while updating the package');
            console.error('Failed to update package:', err);
            toast({ variant: "destructive", title: "Update Failed", description: err instanceof Error ? err.message : 'Could not update package.' });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <span className="ml-4 text-lg text-gray-700">Loading package details...</span>
            </div>
        );
    }

    // --- JSX Rendering (Similar to new/page.tsx, but with "Edit Package" text and prefilled data) ---
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin_packages" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-semibold">Edit Package (ID: {packageId})</h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Package Details */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-medium mb-4">Basic Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                            <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                            <input type="text" id="duration" name="duration" required placeholder="e.g., 3 Days / 2 Nights" value={formData.duration} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="number_of_days" className="block text-sm font-medium text-gray-700 mb-1">Number of Days *</label>
                            <input type="number" id="number_of_days" name="number_of_days" required min="1" value={formData.number_of_days} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 3" />
                        </div>

                        <div>
                            <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
                            <input type="number" id="base_price" name="base_price" required min="0" step="0.01" value={formData.base_price} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="max_people" className="block text-sm font-medium text-gray-700 mb-1">Max People</label>
                            <input type="number" id="max_people" name="max_people" min="1" value={formData.max_people} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>

                        {/* Itinerary Days */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">Itinerary Days</label>
                                <button type="button" onClick={addItineraryDay} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    <PlusIcon className="h-4 w-4 mr-1" /> Add Day
                                </button>
                            </div>
                            {formData.itinerary_days.map((day, index) => (
                                <div key={index} className="space-y-2 border border-gray-200 p-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-md font-semibold text-gray-700">Day {day.dayNumber}</h4>
                                        {formData.itinerary_days.length > 1 && (
                                            <button type="button" onClick={() => removeItineraryDay(index)} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                <MinusIcon className="h-3 w-3 mr-1" /> Remove Day
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor={`itinerary_day_title_${index}`} className="block text-xs font-medium text-gray-600">Title</label>
                                        <input type="text" id={`itinerary_day_title_${index}`} value={day.title} onChange={(e) => handleDayInputChange(index, 'title', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder={`Title for Day ${day.dayNumber}`} />
                                    </div>
                                    <div>
                                        <label htmlFor={`itinerary_day_description_${index}`} className="block text-xs font-medium text-gray-600">Description</label>
                                        <textarea id={`itinerary_day_description_${index}`} rows={2} value={day.description} onChange={(e) => handleDayInputChange(index, 'description', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder={`Details for Day ${day.dayNumber}...`} />
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between items-center">
                                            <h5 className="text-sm font-medium text-gray-600">Activities</h5>
                                            <button type="button" onClick={() => addActivity(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1" />Add Activity</button>
                                        </div>
                                        {day.activities.map((activity, actIndex) => (
                                            <div key={actIndex} className="grid grid-cols-12 gap-2 items-end text-xs">
                                                <div className="col-span-5"><label className="block text-xs font-extralight text-gray-500">Name</label><input type="text" placeholder="Activity Name" value={activity.name} onChange={(e) => handleActivityChange(index, actIndex, 'name', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
                                                <div className="col-span-3"><label className="block text-xs font-extralight text-gray-500">Time</label><input type="text" placeholder="e.g. 09:00 AM" value={activity.time} onChange={(e) => handleActivityChange(index, actIndex, 'time', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
                                                <div className="col-span-3"><label className="block text-xs font-extralight text-gray-500">Duration</label><input type="text" placeholder="e.g. 2 hours" value={activity.duration} onChange={(e) => handleActivityChange(index, actIndex, 'duration', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
                                                <div className="col-span-1">{day.activities.length > 1 && <button type="button" onClick={() => removeActivity(index, actIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12} /></button>}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between items-center">
                                            <h5 className="text-sm font-medium text-gray-600">Meals</h5>
                                            <button type="button" onClick={() => addMeal(index)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1" />Add Meal</button>
                                        </div>
                                        {day.meals.map((meal, mealIndex) => (
                                            <div key={mealIndex} className="flex items-center gap-2 text-xs">
                                                <input type="text" placeholder="e.g. Breakfast, Lunch" value={meal} onChange={(e) => handleMealChange(index, mealIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                                {day.meals.length > 1 && <button type="button" onClick={() => removeMeal(index, mealIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12} /></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2">
                                        <label htmlFor={`itinerary_day_accommodation_${index}`} className="block text-sm font-medium text-gray-600">Accommodation</label>
                                        <input type="text" id={`itinerary_day_accommodation_${index}`} value={day.accommodation} onChange={(e) => handleDayInputChange(index, 'accommodation', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g., Hotel Name - Room Type" />
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-gray-500 mt-1">Click "Add Day" for multi-day packages.</p>
                        </div>

                        {/* Overall Itinerary Details */}
                        <div className="md:col-span-2 space-y-4 p-4 border border-gray-200 rounded-md">
                            <h3 className="text-lg font-medium text-gray-700">Overall Itinerary Details</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-600">Highlights</label>
                                    <button type="button" onClick={() => addListItem('itinerary_highlights')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1" />Add Highlight</button>
                                </div>
                                {formData.itinerary_highlights.map((highlight, hlIndex) => (
                                    <div key={hlIndex} className="flex items-center gap-2 text-xs">
                                        <input type="text" placeholder="e.g., Visit to Cellular Jail" value={highlight} onChange={(e) => handleListInputChange('itinerary_highlights', hlIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                        {formData.itinerary_highlights.length > 1 && <button type="button" onClick={() => removeListItem('itinerary_highlights', hlIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12} /></button>}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-600">Inclusions</label>
                                    <button type="button" onClick={() => addListItem('itinerary_inclusions')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1" />Add Inclusion</button>
                                </div>
                                {formData.itinerary_inclusions.map((inclusion, inIndex) => (
                                    <div key={inIndex} className="flex items-center gap-2 text-xs">
                                        <input type="text" placeholder="e.g., All Permits and Entry Tickets" value={inclusion} onChange={(e) => handleListInputChange('itinerary_inclusions', inIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                        {formData.itinerary_inclusions.length > 1 && <button type="button" onClick={() => removeListItem('itinerary_inclusions', inIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12} /></button>}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-600">Exclusions</label>
                                    <button type="button" onClick={() => addListItem('itinerary_exclusions')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><PlusIcon size={12} className="inline mr-1" />Add Exclusion</button>
                                </div>
                                {formData.itinerary_exclusions.map((exclusion, exIndex) => (
                                    <div key={exIndex} className="flex items-center gap-2 text-xs">
                                        <input type="text" placeholder="e.g., Personal Expenses" value={exclusion} onChange={(e) => handleListInputChange('itinerary_exclusions', exIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                        {formData.itinerary_exclusions.length > 1 && <button type="button" onClick={() => removeListItem('itinerary_exclusions', exIndex)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600"><MinusIcon size={12} /></button>}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label htmlFor="itinerary_notes" className="block text-sm font-medium text-gray-600">Itinerary Notes</label>
                                <textarea id="itinerary_notes" rows={3} value={formData.itinerary_notes} onChange={(e) => handleItineraryNotesChange(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Any special notes for the itinerary..." />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="included_services" className="block text-sm font-medium text-gray-700 mb-1">Included Services</label>
                            <textarea id="included_services" name="included_services" rows={3} value={formData.included_services} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Airport transfers, Sightseeing, Meals, etc." />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
                            <textarea id="cancellation_policy" name="cancellation_policy" rows={3} value={formData.cancellation_policy} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cancellation terms and conditions..." />
                        </div>

                        {/* Images Section for Main Package */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Package Images</h3>
                            <ImageUploader
                                label="Update Images for the Package"
                                onImagesUploaded={handleMainImagesUploaded} // Use specific handler
                                existingImages={formData.images}
                                parentId={packageId} // Use the actual packageId
                                type="package"
                                maxImages={10}
                                helperText="Upload new or replace existing images for the package."
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (visible to users)</label>
                        </div>
                    </div>
                </div>

                {/* Package Categories */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">Package Categories</h2>
                        <button type="button" onClick={addCategory} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Category
                        </button>
                    </div>

                    {formData.package_categories.map((category, index) => (
                        <div key={index} className="mb-8 border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Category {index + 1}: {category.category_name || 'New Category'}</h3>
                                <button type="button" onClick={() => removeCategory(index)} disabled={formData.package_categories.length === 1} className={`inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md ${formData.package_categories.length === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}>
                                    <MinusIcon className="h-4 w-4 mr-1" /> Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                                    <input type="text" required value={category.category_name} onChange={(e) => handleCategoryChange(index, 'category_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Standard, Deluxe, Premium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                    <input type="number" required min="0" step="0.01" value={category.price} onChange={(e) => handleCategoryChange(index, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max People Included in Price</label>
                                    <input type="number" min="1" value={category.max_pax_included_in_price} onChange={(e) => handleCategoryChange(index, 'max_pax_included_in_price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Details</label>
                                    <textarea rows={3} value={category.hotel_details} onChange={(e) => handleCategoryChange(index, 'hotel_details', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Port Blair: Hotel Royal Palace - Deluxe AC Room, Havelock: Symphony Palms - Premium Cottage"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Description</label>
                                    <textarea rows={2} value={category.category_description} onChange={(e) => handleCategoryChange(index, 'category_description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Additional information about this category"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Images</label>
                                    <ImageUploader
                                        label={`Images for Category ${index + 1}`}
                                        onImagesUploaded={(imageUrls) => handleCategoryImagesUpdated(index, imageUrls)} // Use specific handler
                                        existingImages={category.images}
                                        parentId={`${packageId}-category-${index}`} // Unique parentId for category images
                                        type="package_category"
                                        maxImages={5}
                                        helperText="Update images specific to this category."
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
                    <Link href="/admin_packages" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading || pageLoading} className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(loading || pageLoading) ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {loading ? (<><Loader2 size={16} className="animate-spin mr-2" /> Saving Changes...</>) : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
} 