'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import type { ImageFile } from '@/lib/validation';

interface FileDropzoneProps {
  label?: string;
  help?: string;
  error?: string;
  onChange: (file: ImageFile | null) => void;
  value?: ImageFile | null | undefined;
  id?: string;
}

export default function FileDropzone({
  label,
  help = "Upload 1 image (JPG/PNG, max 8MB). We recommend at least 1500×1500px.",
  error,
  onChange,
  value,
  id
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneId = id || `dropzone-${Math.random().toString(36).substr(2, 9)}`;

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return 'Please upload a JPG or PNG image';
    }
    
    // Check file size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      return 'File size must be under 8MB';
    }
    
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      // For now, we'll rely on the form validation to show the error
      onChange(null);
      return;
    }

    const imageFile: ImageFile = {
      name: file.name,
      size: file.size,
      type: file.type,
    };
    
    onChange(imageFile);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div className="space-y-4">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 ${
            isDragOver
              ? 'border-accent bg-accent/5'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-border bg-muted hover:bg-muted/80'
          }`}
          role="button"
          tabIndex={0}
          aria-describedby={
            error ? `${dropzoneId}-error` : help ? `${dropzoneId}-help` : undefined
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFileDialog();
            }
          }}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground">
                Drop image here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG up to 8MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept="image/jpeg,image/png"
            onChange={handleFileInput}
            aria-describedby={
              error ? `${dropzoneId}-error` : help ? `${dropzoneId}-help` : undefined
            }
          />
        </div>

        {/* Selected file */}
        {value && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-3">
            <div className="flex items-center space-x-3">
              <div className="rounded bg-accent/10 p-2">
                <Upload className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {value.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {help && !error && (
        <p id={`${dropzoneId}-help`} className="text-sm text-muted-foreground">
          {help}
        </p>
      )}
      
      {error && (
        <p id={`${dropzoneId}-error`} className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
