"use client";

import React, { useState, useRef } from "react";
import { Upload, Plus, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  onImagesUploaded: (imageUrls: string[]) => void;
  existingImages?: string[];
  parentId: string | number;
  type: "hotel" | "room" | "service" | "package" | "package_category";
  maxImages?: number;
  helperText?: string;
}

export function ImageUploader({
  label,
  onImagesUploaded,
  existingImages = [],
  parentId,
  type,
  maxImages = 10,
  helperText,
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCloudflareMode, setIsCloudflareMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("parentId", parentId.toString());
    formData.append("type", type);
    
    // Append each file to the form data
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json() as { error: string; message?: string };
        throw new Error(errorData.message || errorData.error || "Failed to upload images");
      }

      const data = await response.json() as { 
        success: boolean; 
        imageUrls: string[];
        message: string; 
      };
      
      // Check if we're in Cloudflare mode (images processed but not stored)
      if (data.message?.includes("Cloudflare environment")) {
        setIsCloudflareMode(true);
      }
      
      const newImageUrls = data.imageUrls;
      
      const updatedImages = [...uploadedImages, ...newImageUrls];
      setUploadedImages(updatedImages);
      onImagesUploaded(updatedImages);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
        {/* Image previews */}
        {uploadedImages.map((image, index) => (
          <div 
            key={index} 
            className="relative group aspect-square border border-gray-200 rounded-md overflow-hidden shadow-sm"
          >
            {isCloudflareMode ? (
              // Placeholder for Cloudflare mode where actual images aren't stored
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                <div className="text-center p-2">
                  <Upload size={24} className="mx-auto mb-1" />
                  <span className="text-xs">Image {index + 1}</span>
                </div>
              </div>
            ) : (
              // Normal image display
              <img 
                src={image} 
                alt={`Uploaded image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add button */}
        {uploadedImages.length < maxImages && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isUploading}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-square hover:border-gray-400 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <>
                <Plus size={24} className="text-gray-400" />
                <span className="text-xs text-gray-500 mt-2">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple={uploadedImages.length < maxImages}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {isCloudflareMode && (
        <p className="text-amber-500 text-sm">
          <strong>Note:</strong> In development mode, images are not actually stored. They will appear as placeholders.
        </p>
      )}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      <p className="text-xs text-gray-500">
        {uploadedImages.length} of {maxImages} images uploaded
      </p>
    </div>
  );
} 