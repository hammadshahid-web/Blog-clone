'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, RefreshCw } from 'lucide-react';

interface ImageUploadProps {
  value?: string | File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

export function ImageUpload({ value, onChange, disabled, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize string URL or File object with preview state
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url); // Clean up memory
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        disabled={disabled}
        className="hidden"
      />

      {!preview ? (
        /* Dropzone UI */
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center ${
            error 
              ? 'border-red-500/50 bg-red-500/5' 
              : 'border-slate-300 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-900/50'
          }`}
        >
          <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-full text-blue-600 dark:text-blue-400 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Click to upload article cover image
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PNG, JPG, WEBP up to 5MB
          </p>
        </div>
      ) : (
        /* Responsive Preview Card with Fixed Action Controls */
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video w-full max-h-80 shadow-md">
          <Image
            src={preview}
            alt="Upload Preview"
            fill
            className="object-cover"
          />

          {/* Hover Overlay with Action Buttons */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replace
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          {/* Touch Screen Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="md:hidden absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md z-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}