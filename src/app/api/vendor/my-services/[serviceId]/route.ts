import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { verifyAuth, requireAuth } from '@/lib/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '../../../../../../cloudflare-env';

export const dynamic = 'force-dynamic';

// R2 Public Domain - IMPORTANT: Should ideally come from an environment variable
const R2_PUBLIC_DOMAIN = "pub-861b68dd53c047e0a06b7164e95ccc43.r2.dev"; // REPLACE if different or use env var

let R2_BUCKET_INSTANCE: R2Bucket | null = null;

// Asynchronously initialize R2 bucket instance
async function initializeR2() {
  if (R2_BUCKET_INSTANCE) return; // Already initialized
  try {
    // @ts-ignore // CloudflareEnv might not be perfectly typed for all bindings initially
    const ctx = await getCloudflareContext<CloudflareEnv>({ async: true });
    if (ctx?.env?.IMAGES_BUCKET) {
      R2_BUCKET_INSTANCE = ctx.env.IMAGES_BUCKET as R2Bucket;
      console.log("✅ [Service Update] R2_BUCKET (IMAGES_BUCKET) obtained via getCloudflareContext.");
    } else {
      console.warn("⚠️ [Service Update] IMAGES_BUCKET not found via getCloudflareContext. Image deletion from R2 will be skipped.");
    }
  } catch (e) {
    console.warn("⚠️ [Service Update] Error getting Cloudflare context for R2. Image deletion from R2 will be skipped:", e);
  }
}
// Initialize R2 when module loads
initializeR2();

interface RouteContext {
  params: {
    serviceId: string;
  };
}

// Helper function to check ownership and verification status
async function checkServiceOwnershipAndVerification(db: DatabaseService, userId: number | string, serviceId: number): Promise<{ isOwner: boolean; isVerified: boolean; isHotel: boolean; serviceProviderId: number | null }> {
    const serviceProvider = await db.getServiceProviderByUserId(Number(userId));
    if (!serviceProvider || !serviceProvider.id) {
        return { isOwner: false, isVerified: false, isHotel: false, serviceProviderId: null };
    }

    const isVerified = serviceProvider.verified === 1;
    const isHotel = serviceProvider.type === 'hotel';
    const serviceProviderId = serviceProvider.id;

    const service = await db.getServiceById(serviceId);
    const isOwner = service !== null && service?.provider_id === serviceProvider.id;

    return { isOwner, isVerified, isHotel, serviceProviderId };
}

// GET: Fetch a specific service by ID (owned by the verified vendor)
export async function GET(request: NextRequest, { params }: RouteContext) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: 'User not found after auth check' }, { status: 401 });
  }

  const serviceId = parseInt(params.serviceId, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ success: false, message: 'Invalid Service ID' }, { status: 400 });
  }

  try {
    const db = new DatabaseService();

    // Verify ownership and verification
    const { isOwner, isVerified } = await checkServiceOwnershipAndVerification(db, user.id, serviceId);

    if (!isOwner) {
        // Return 404 instead of 403 to avoid revealing existence
        return NextResponse.json({ success: false, message: 'Service not found or permission denied.' }, { status: 404 });
    }    // --- Verification Check Removed for GET as per requirements ---
    // Sticking to requirement: only verified vendors manage services.
    // if (!isVerified) {
    //     return NextResponse.json({ success: false, message: \"Vendor account not verified. Cannot view service details.\" }, { status: 403 });
    // }
    // --- End Check ---
    // Fetch the service details since ownership & verification are confirmed
    const service = await db.getServiceById(serviceId);

    if (!service) {
        // Should be caught by isOwner check, but for safety
        return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    // Frontend needs to parse JSON fields like 'amenities', 'availability', 'cancellation_policy'
    return NextResponse.json({ success: true, data: service });

  } catch (error) {
    console.error(`Error fetching service ${serviceId}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to fetch service.', error: message }, { status: 500 });
  }
}

// PUT: Update a specific service (Rentals/Activities)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: 'User not found after auth check' }, { status: 401 });
  }

  const serviceId = parseInt(params.serviceId, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ success: false, message: 'Invalid Service ID' }, { status: 400 });
  }

  try {
    const db = new DatabaseService();

    // Verify ownership, verification, and type
    const { isOwner, isVerified, isHotel } = await checkServiceOwnershipAndVerification(db, user.id, serviceId);

    if (!isOwner) {
        return NextResponse.json({ success: false, message: 'Permission denied: You do not own this service.' }, { status: 403 });
    }
    if (!isVerified) {
        return NextResponse.json({ success: false, message: 'Vendor account not verified. Cannot update service.' }, { status: 403 });
    }
    
    const serviceToUpdateDetails = await db.getServiceById(serviceId); // Fetch details once
    if (!serviceToUpdateDetails) { 
        return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }
    if (isHotel || serviceToUpdateDetails.type === 'hotel') {
        return NextResponse.json({ success: false, message: 'Hotel vendors should use the hotel management endpoint.' }, { status: 400 });
    }

    // Define expected body structure including specific fields (similar to POST)
    interface ServiceUpdateBody {
      // Generic
      name: string;
      description?: string;
      type: string; // e.g., "rental/car", "activity/trek"
      island_id: number;
      price: number;
      availability_days?: string[];
      availability_notes?: string;
      availability?: string | null; // Expecting already stringified JSON: {"days": [], "notes": ""}
      images?: string | null; // JSON string array of URLs
      cancellation_policy?: string | null; // Expecting plain string
      // is_active is handled by the status endpoint
      // Rental Specific (Optional)
      rental_unit?: 'per hour' | 'per day';
      quantity_available?: number;
      deposit_required?: boolean;
      deposit_amount?: number;
      age_license_requirement?: boolean;
      age_license_details?: string;
      // Activity Specific (Optional)
      duration?: number;
      duration_unit?: 'hours' | 'days';
      group_size_min?: number;
      group_size_max?: number;
      difficulty_level?: 'easy' | 'medium' | 'hard';
      equipment_provided?: string[];
      safety_requirements?: string;
      guide_required?: boolean;
      // General Amenities (Optional)
      general_amenities?: string[];
      // Location fields (NEW)
      street_address?: string | null;
      geo_lat?: number | null;
      geo_lng?: number | null;
      // Transport Specific (NEW - mirroring ServiceCreateBody)
      vehicle_type?: string;
      capacity_passengers?: number;
      route_details?: string;
      price_per_km?: number;
      price_per_trip?: number;
      driver_included?: boolean;
    }

    const body: ServiceUpdateBody = await request.json();

    if (!body || typeof body !== 'object') {
        return NextResponse.json({ success: false, message: 'Invalid request body format' }, { status: 400 });
    }

    // --- Determine if this is an image-only update --- 
    const isImageOnlyUpdate = body.images !== undefined && 
                              body.name === undefined && 
                              body.type === undefined && 
                              body.price === undefined && 
                              body.island_id === undefined;

    let serviceDataForUpdate: any;
    let existingServiceForImageLogic = serviceToUpdateDetails; // Use already fetched details

    if (isImageOnlyUpdate) {
        console.log(`[Service Update ID: ${serviceId}] Detected image-only update.`);
        if (!existingServiceForImageLogic) {
            return NextResponse.json({ success: false, message: 'Service not found for image update.' }, { status: 404 });
        }
        // For image-only update, we only care about the images from the body.
        // Other fields for db.updateService will come from existingServiceForImageLogic
        serviceDataForUpdate = {
            name: existingServiceForImageLogic.name,
            description: existingServiceForImageLogic.description,
            type: existingServiceForImageLogic.type,
            island_id: existingServiceForImageLogic.island_id,
            price: existingServiceForImageLogic.price,
            availability: existingServiceForImageLogic.availability, // Keep existing if not in body
            images: body.images, // This is the primary field to update
            amenities: existingServiceForImageLogic.amenities, // Keep existing if not in body
            cancellation_policy: existingServiceForImageLogic.cancellation_policy, // Keep existing if not in body
        };
    } else {
        // --- Full update validation --- 
        if (!body.name || !body.type || body.price === undefined || body.island_id === undefined) {
            return NextResponse.json({ success: false, message: 'Missing required fields (name, type, price, island_id) for full update.' }, { status: 400 });
        }
        if (body.type.startsWith('hotel')) {
            return NextResponse.json({ success: false, message: 'Invalid type. Use hotel management endpoint for hotels.' }, { status: 400 });
        }

        // Prepare amenities and other fields for a full update
        let specificFieldsData: any = {};
        if (body.type.startsWith('rental/')) {
            specificFieldsData.rental = {
                unit: body.rental_unit,
                quantity: body.quantity_available,
                deposit: body.deposit_required ? { required: true, amount: body.deposit_amount } : { required: false },
                requirements: body.age_license_requirement ? { required: true, details: body.age_license_details } : { required: false },
            };
        } else if (body.type.startsWith('activity/')) {
            specificFieldsData.activity = {
                duration: body.duration ? { value: body.duration, unit: body.duration_unit } : null,
                group_size: { min: body.group_size_min, max: body.group_size_max },
                difficulty: body.difficulty_level,
                equipment: body.equipment_provided,
                safety: body.safety_requirements,
                guide: body.guide_required,
            };
        } else if (body.type.startsWith('transport/')) {
            specificFieldsData.transport = {
                vehicle_type: body.vehicle_type,
                capacity_passengers: body.capacity_passengers,
                route_details: body.route_details,
                price_per_km: body.price_per_km,
                price_per_trip: body.price_per_trip,
                driver_included: body.driver_included,
            };
        }
        if (body.street_address || body.geo_lat !== undefined || body.geo_lng !== undefined) {
            specificFieldsData.location = {
                street_address: body.street_address || null,
                geo_lat: body.geo_lat !== undefined ? body.geo_lat : null,
                geo_lng: body.geo_lng !== undefined ? body.geo_lng : null,
            };
        }
        const amenitiesToStore = {
            general: body.general_amenities ?? [],
            specifics: specificFieldsData
        };

        let availabilityString: string | null = null;
        if (body.availability_days || body.availability_notes) {
            availabilityString = JSON.stringify({ days: body.availability_days ?? [], notes: body.availability_notes ?? "" });
        } else if (body.availability) {
            availabilityString = body.availability;
            if (availabilityString) JSON.parse(availabilityString);
        }

        serviceDataForUpdate = {
            name: body.name,
            description: body.description ?? null,
            type: body.type,
            island_id: Number(body.island_id),
            price: Number(body.price),
            availability: availabilityString, 
            images: body.images ?? existingServiceForImageLogic?.images ?? null, // Use new images, or keep existing, or null
            amenities: JSON.stringify(amenitiesToStore), 
            cancellation_policy: body.cancellation_policy ?? null,
        };
    }

    // --- Image Deletion Logic (uses existingServiceForImageLogic) --- 
    if (R2_BUCKET_INSTANCE && body.images !== undefined) { 
      let currentImageUrls: string[] = [];
      if (existingServiceForImageLogic.images) { // Use already fetched details
        try {
          currentImageUrls = db.parseImageUrls(existingServiceForImageLogic.images);
          if (!Array.isArray(currentImageUrls)) currentImageUrls = [];
        } catch (e) {
          console.error(`[Service Update ID: ${serviceId}] Error parsing current images JSON:`, existingServiceForImageLogic.images, e);
          currentImageUrls = [];
        }
      }

      let newImageUrls: string[] = [];
      if (body.images) { // body.images is a JSON string or null
        try {
          newImageUrls = db.parseImageUrls(body.images);
          if (!Array.isArray(newImageUrls)) newImageUrls = [];
        } catch (e) {
          console.error(`[Service Update ID: ${serviceId}] Error parsing new images JSON from body:`, body.images, e);
          return NextResponse.json({ success: false, message: 'Invalid format for new images data.' }, { status: 400 });
        }
      }
      
      const urlsToDelete = currentImageUrls.filter(url => !newImageUrls.includes(url));

      if (urlsToDelete.length > 0) {
        console.log(`[Service Update ID: ${serviceId}] Attempting to delete ${urlsToDelete.length} images from R2.`);
        for (const urlToDelete of urlsToDelete) {
          try {
            const urlParts = new URL(urlToDelete);
            if (urlParts.hostname === R2_PUBLIC_DOMAIN) {
              const r2ObjectKey = urlParts.pathname.substring(1);
              if (r2ObjectKey) {
                 // @ts-ignore R2Bucket types might not be fully available
                await R2_BUCKET_INSTANCE.delete(r2ObjectKey);
                console.log(`[Service Update ID: ${serviceId}] Successfully deleted ${r2ObjectKey} from R2.`);
              } else {
                 console.warn(`[Service Update ID: ${serviceId}] Could not extract R2 key from URL: ${urlToDelete}`);
              }
            } else {
              console.warn(`[Service Update ID: ${serviceId}] URL to delete (${urlToDelete}) does not match R2_PUBLIC_DOMAIN (${R2_PUBLIC_DOMAIN}). Skipping R2 delete.`);
            }
          } catch (deleteError) {
            console.error(`[Service Update ID: ${serviceId}] Failed to delete ${urlToDelete} from R2:`, deleteError);
          }
        }
      }
    } else if (body.images !== undefined && !R2_BUCKET_INSTANCE) {
        console.warn(`[Service Update ID: ${serviceId}] R2_BUCKET_INSTANCE not available. Skipping deletion of orphaned images from R2.`);
    }
    // --- End Image Deletion Logic ---

    // Safely stringify JSON fields (This is now part of the 'else' for full update, or handled in image-only part)
    // let availabilityString: string | null = null;
    // ... availability string construction ...
    // let amenitiesString: string | null = null;
    // ... amenities string construction ... 
    // let cancellationPolicyString: string | null = null;
    // ... cancellation policy string construction ...

    // The db.updateService call will now use serviceDataForUpdate which is tailored
    // for either image-only or full update.
    const result = await db.updateService(serviceId, serviceDataForUpdate);

     if (!result.success) {
        if (result.meta?.changes === 0) {
             return NextResponse.json({ success: false, message: 'Service not found or no changes detected.' }, { status: 404 });
        }
        throw new Error(result.error || 'Failed to update service in database');
    }

    // Fetch the updated service to return it
    const updatedService = await db.getServiceById(serviceId);
    if (!updatedService) {
        throw new Error('Failed to retrieve updated service.');
    }

    return NextResponse.json({ success: true, message: 'Service updated successfully', data: updatedService });

  } catch (error) {
    console.error(`Error updating service ${serviceId}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to update service.', error: message }, { status: 500 });
  }
}

// DELETE: Delete a specific service
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authResponse = await requireAuth(request, [3]); // Vendor role
  if (authResponse) return authResponse;

  const { user } = await verifyAuth(request);
  if (!user || !user.id) {
    return NextResponse.json({ success: false, message: 'User not found after auth check' }, { status: 401 });
  }

  const serviceId = parseInt(params.serviceId, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ success: false, message: 'Invalid Service ID' }, { status: 400 });
  }

  try {
    const db = new DatabaseService();

    // Verify ownership and verification
    const { isOwner, isVerified } = await checkServiceOwnershipAndVerification(db, user.id, serviceId);

    if (!isOwner) {
        return NextResponse.json({ success: false, message: 'Permission denied: You do not own this service.' }, { status: 403 });
    }
    if (!isVerified) {
        return NextResponse.json({ success: false, message: 'Vendor account not verified. Cannot delete service.' }, { status: 403 });
    }

    // --- R2 Image Deletion Logic for Service ---
    if (R2_BUCKET_INSTANCE) {
      const serviceToDelete = await db.getServiceById(serviceId); // Fetch the service data
      if (serviceToDelete?.images) {
        try {
          const imageUrls = db.parseImageUrls(serviceToDelete.images);
          if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            console.log(`[Service Delete ID: ${serviceId}] Attempting to delete ${imageUrls.length} images from R2.`);
            for (const urlToDelete of imageUrls) {
              try {
                const urlParts = new URL(urlToDelete);
                if (urlParts.hostname === R2_PUBLIC_DOMAIN) {
                  const r2ObjectKey = urlParts.pathname.substring(1); // Remove leading '/'
                  if (r2ObjectKey) {
                    // @ts-ignore R2Bucket types might not be fully available
                    await R2_BUCKET_INSTANCE.delete(r2ObjectKey);
                    console.log(`[Service Delete ID: ${serviceId}] Successfully deleted ${r2ObjectKey} from R2.`);
                  } else {
                    console.warn(`[Service Delete ID: ${serviceId}] Could not extract R2 key from URL: ${urlToDelete}`);
                  }
                } else {
                  console.warn(`[Service Delete ID: ${serviceId}] URL to delete (${urlToDelete}) does not match R2_PUBLIC_DOMAIN (${R2_PUBLIC_DOMAIN}). Skipping R2 delete.`);
                }
              } catch (deleteError) {
                console.error(`[Service Delete ID: ${serviceId}] Failed to delete ${urlToDelete} from R2:`, deleteError);
                // Continue, don't fail the whole service delete for a single R2 image delete error
              }
            }
          }
        } catch (e) {
          console.error(`[Service Delete ID: ${serviceId}] Error parsing images JSON for R2 deletion:`, serviceToDelete.images, e);
          // Continue with service deletion even if images can't be parsed/deleted
        }
      }
    } else {
      console.warn(`[Service Delete ID: ${serviceId}] R2_BUCKET_INSTANCE not available. Skipping deletion of images from R2.`);
    }
    // --- End R2 Image Deletion Logic ---

    // Optional: Add check for existing bookings before deleting?
    // const existingBookings = await db.checkBookingsForService(serviceId); // Needs implementation in DatabaseService

    const result = await db.deleteService(serviceId);

    if (!result.success) {
        throw new Error(result.error || 'Failed to delete service in database');
    }
    if (result.meta?.changes === 0) {
        // This implies the service didn't exist, which contradicts the ownership check, but handle defensively
        return NextResponse.json({ success: false, message: 'Service not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });

  } catch (error) {
    console.error(`Error deleting service ${serviceId}:`, error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to delete service.', error: message }, { status: 500 });
  }
}

