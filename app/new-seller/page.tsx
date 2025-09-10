'use client';

import { useState } from 'react';
import Image from 'next/image';
import FileDropzone from '@/components/FileDropzone';
import type { ImageFile } from '@/lib/validation';

export default function NewSellerPage() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [imageError, setImageError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const handleImageChange = async (imageFile: ImageFile | null) => {
    if (imageFile) {
      setIsUploading(true);
      setImageError('');
      
      try {
        // Create a FormData object for the upload
        const formData = new FormData();
        
        // Create a File object from the imageFile data
        const file = new File([new ArrayBuffer(imageFile.size)], imageFile.name, { 
          type: imageFile.type 
        });
        
        formData.append('image', file);

        // Upload the image
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setUploadedImageUrl(result.imageUrl);
          setSelectedImage(imageFile);
        } else {
          const error = await response.json();
          setImageError(error.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        setImageError('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    } else {
      setSelectedImage(null);
      setUploadedImageUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create Your Amazon Listing Pack
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Upload your product image to get started
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <FileDropzone
            label="Product Image *"
            help={isUploading ? "Uploading image..." : "Upload a high-quality product image (JPG/PNG, max 8MB). We'll use this to create your Amazon listing optimization checklist."}
            error={imageError}
            onChange={handleImageChange}
            value={selectedImage}
            id="product-image"
          />
          
          {/* Show uploaded image preview */}
          {uploadedImageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-2">Uploaded Image Preview:</p>
              <div className="relative inline-block">
                <Image
                  src={uploadedImageUrl}
                  alt="Product preview"
                  width={320}
                  height={240}
                  className="max-w-xs rounded-lg border border-border shadow-sm"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  ✓ Uploaded
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
