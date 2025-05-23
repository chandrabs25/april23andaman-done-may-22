import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CloudflareEnv } from '../../../../../cloudflare-env'; // Trying one more path adjustment

// When in local development, we'll need filesystem support
let fsPromises: typeof import('fs/promises') | null = null;
let path: typeof import('path') | null = null;
let fs: typeof import('fs') | null = null;

// We'll determine if we are in a Cloudflare environment capable of R2 uploads
// by successfully retrieving the R2 binding via getCloudflareContext.
let isCloudflareEnvWithR2 = false;
let R2_BUCKET_INSTANCE: R2Bucket | null = null;

// Asynchronously initialize environment-specific parts
async function initializeEnv() {
  try {
    const ctx = await getCloudflareContext<CloudflareEnv>({ async: true });
    if (ctx?.env?.IMAGES_BUCKET) {
      R2_BUCKET_INSTANCE = ctx.env.IMAGES_BUCKET as R2Bucket;
      isCloudflareEnvWithR2 = true;
      console.log("✅ [Image Upload] R2_BUCKET (IMAGES_BUCKET) obtained via getCloudflareContext.");
    } else {
      console.warn("⚠️ [Image Upload] IMAGES_BUCKET not found via getCloudflareContext. Falling back to local FS mode.");
      isCloudflareEnvWithR2 = false;
    }
  } catch (e) {
    console.warn("⚠️ [Image Upload] Error getting Cloudflare context for R2. Falling back to local FS mode:", e);
    isCloudflareEnvWithR2 = false;
  }

  if (!isCloudflareEnvWithR2) {
    try {
      fsPromises = await import('fs/promises');
      path = await import('path');
      fs = await import('fs');
      console.log("✅ [Image Upload] Local filesystem modules loaded.");
    } catch (error) {
      console.error("❌ [Image Upload] Failed to load local filesystem modules:", error);
      // If these fail, local mode won't work either.
    }
  }
}

const initializeEnvPromise = initializeEnv(); // Call initialization once when module loads

export async function POST(request: NextRequest) {
  await initializeEnvPromise; // Ensure initialization is complete before proceeding

  try {
    const formData = await request.formData();
    const parentId = formData.get("parentId") as string;
    const type = formData.get("type") as "hotel" | "room" | "service";
    
    if (!parentId || !type) {
      return NextResponse.json({ error: "Missing parentId or type" }, { status: 400 });
    }

    // Handle temporary IDs
    const isTempId = parentId.startsWith('temp-');
    
    // Get all files from the request
    const files = formData.getAll("images") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Determine the base path segment based on type
    let basePathSegment: string;
    const urlDirName = isTempId ? "temp" : parentId.toString();
    
    if (type === "hotel") {
      basePathSegment = `/images/hotels/${urlDirName}`;
    } else if (type === "room") {
      basePathSegment = `/images/hotels/${urlDirName}/rooms`;
    } else { // service
      basePathSegment = `/images/services/${urlDirName}`;
    }
    
    // Array to store image URLs
    const imageUrls: string[] = [];
    
    if (isCloudflareEnvWithR2 && R2_BUCKET_INSTANCE) {
      const R2_BUCKET = R2_BUCKET_INSTANCE; // Use the initialized instance
      console.log("✅ [Image Upload] Proceeding with R2 upload logic.");
      for (const file of files) {
        try {
          // Create a safe filename
          const originalName = file.name;
          const timestamp = Date.now();
          const fileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          
          // Generate the full path for R2 (this is the path within the bucket)
          const r2Path = `${basePathSegment.substring(1)}/${fileName}`; // Example: images/hotels/123/timestamp-image.jpg
          
          // Upload file to R2
          const arrayBuffer = await file.arrayBuffer();
          await R2_BUCKET.put(r2Path, arrayBuffer, {
            httpMetadata: {
              contentType: file.type,
            }
          });
          
          // IMPORTANT: Define your R2 public custom domain here
          const R2_PUBLIC_DOMAIN = "pub-861b68dd53c047e0a06b7164e95ccc43.r2.dev"; // REPLACE THIS WITH YOUR ACTUAL DOMAIN

          if (R2_PUBLIC_DOMAIN === "pub-861b68dd53c047e0a06b7164e95ccc43.r2.dev") {
            console.warn("R2_PUBLIC_DOMAIN is set to a custom domain");
            // Optionally, you could fall back to relative paths or return an error during development if not set
          }

          const publicUrl = `https://${R2_PUBLIC_DOMAIN}/${r2Path}`;
          imageUrls.push(publicUrl);
          console.log(`✅ [Image Upload] Successfully uploaded ${fileName} to R2. URL: ${publicUrl}`);

        } catch (fileError) {
          console.error(`❌ [Image Upload] Error processing file ${file.name} for R2 upload:`, fileError);
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          return NextResponse.json({ 
            error: "Failed to process file for R2 upload.",
            details: errorMessage,
            file: file.name
          }, { status: 500 });
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        imageUrls,
        message: `${files.length} images processed successfully in Cloudflare R2 environment`
      });
    } 
    // In local development, use filesystem
    else {
      console.log("ℹ️ [Image Upload] Proceeding with local filesystem logic.");
      // Make sure fs modules are available
      if (!fsPromises || !path || !fs) {
        console.error("❌ [Image Upload] Local filesystem modules not available for local upload.");
        return NextResponse.json({ 
          error: "File system modules unavailable for local development.", 
          details: "Failed to import fs/path modules."
        }, { status: 500 });
      }
      
      // Paths for directory creation
      const publicDir = path.join(process.cwd(), "public");
      const imagesDir = path.join(publicDir, "images");
      
      try {
        // Create base directories if they don't exist
        if (!fs.existsSync(imagesDir)) {
          await fsPromises.mkdir(imagesDir, { recursive: true });
        }
        
        // Create type-specific directory
        let targetDir: string;
        
        if (type === "hotel" || type === "room") {
          // Hotel and room images go to hotels directory
          const hotelsDir = path.join(imagesDir, "hotels");
          if (!fs.existsSync(hotelsDir)) {
            await fsPromises.mkdir(hotelsDir, { recursive: true });
          }
          
          // Use temp dir for temporary IDs
          const dirName = isTempId ? "temp" : parentId.toString();
          
          const hotelDir = path.join(hotelsDir, dirName);
          if (!fs.existsSync(hotelDir)) {
            await fsPromises.mkdir(hotelDir, { recursive: true });
          }
          
          if (type === "room") {
            const roomsDir = path.join(hotelDir, "rooms");
            if (!fs.existsSync(roomsDir)) {
              await fsPromises.mkdir(roomsDir, { recursive: true });
            }
            targetDir = roomsDir;
          } else {
            targetDir = hotelDir;
          }
        } else { // service
          const servicesDir = path.join(imagesDir, "services");
          if (!fs.existsSync(servicesDir)) {
            await fsPromises.mkdir(servicesDir, { recursive: true });
          }
          
          // Use temp dir for temporary IDs
          const dirName = isTempId ? "temp" : parentId.toString();
          
          targetDir = path.join(servicesDir, dirName);
          if (!fs.existsSync(targetDir)) {
            await fsPromises.mkdir(targetDir, { recursive: true });
          }
        }
        
        // Process each file
        for (const file of files) {
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            // Create a safe filename
            const originalName = file.name;
            const timestamp = Date.now();
            const fileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            
            // Full path to save the file
            const filePath = path.join(targetDir, fileName);
            
            // Save the file
            await fsPromises.writeFile(filePath, buffer);
            
            // Generate URL path
            const relativePath = `${basePathSegment}/${fileName}`;
            imageUrls.push(relativePath);
            console.log(`✅ [Image Upload] Successfully saved ${fileName} to local FS. Path: ${relativePath}`);
          } catch (fileError) {
            console.error(`❌ [Image Upload] Error processing file ${file.name} for local save:`, fileError);
            const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
            return NextResponse.json({ 
              error: "Failed to save file locally.", 
              details: errorMessage,
              file: file.name
            }, { status: 500 });
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          imageUrls,
          message: `${files.length} images saved successfully in local environment`
        });
      } catch (dirError) {
        console.error("❌ [Image Upload] Local directory creation/access error:", dirError);
        const errorMessage = dirError instanceof Error ? dirError.message : String(dirError);
        return NextResponse.json({ 
          error: "Failed to create or access directories for local save.", 
          details: errorMessage
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("❌ [Image Upload] General error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to process images", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 