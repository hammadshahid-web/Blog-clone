'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

interface FileUploadProps {
  multiple?: boolean;
  maxSizeMB?: number; // Default 5MB
  allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png', 'image/webp']
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUpload({
  multiple = false,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  onFilesChange,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate single file size & type
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid type (${file.type.split('/')[1] || 'file'}). Allowed: ${allowedTypes
        .map((t) => t.split('/')[1])
        .join(', ')}`;
    }
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)`;
    }
    return null;
  };

  // Simulate upload progress (Replace with real Axios onUploadProgress if needed)
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f))
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  // Process incoming raw files
  const handleProcessFiles = (incomingFiles: FileList | File[]) => {
    const newFilesArray: UploadedFile[] = [];
    const validRawFiles: File[] = [];

    Array.from(incomingFiles).forEach((file) => {
      const error = validateFile(file);
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';

      if (error) {
        newFilesArray.push({
          id,
          file,
          previewUrl,
          progress: 0,
          status: 'error',
          errorMessage: error,
        });
      } else {
        validRawFiles.push(file);
        newFilesArray.push({
          id,
          file,
          previewUrl,
          progress: 0,
          status: 'uploading',
        });
        simulateUpload(id);
      }
    });

    setFiles((prev) => {
      const updated = multiple ? [...prev, ...newFilesArray] : newFilesArray;
      if (onFilesChange) {
        onFilesChange(updated.filter((f) => f.status !== 'error').map((f) => f.file));
      }
      return updated;
    });
  };

  // Drag & Drop Event Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files) return;
    handleProcessFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (onFilesChange) {
        onFilesChange(filtered.filter((f) => f.status !== 'error').map((f) => f.file));
      }
      return filtered;
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(',')}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* 1. Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-900/50'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-full text-blue-600 dark:text-blue-400 mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {isDragging
            ? 'Drop files here...'
            : `Click or drag & drop ${multiple ? 'files' : 'a file'} here`}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Max file size: {maxSizeMB}MB ({allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')})
        </p>
      </div>

      {/* 2. Uploaded Files List with Progress Bars */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 shadow-sm"
            >
              {/* File Icon / Preview */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                {item.previewUrl ? (
                  <Image src={item.previewUrl} alt={item.file.name} fill className="object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-slate-500" />
                )}
              </div>

              {/* Info + Progress Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.file.name}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                {/* Status or Progress Indicator */}
                {item.status === 'error' ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {item.errorMessage}
                  </p>
                ) : (
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Status Icons / Delete Button */}
              <div className="flex items-center gap-2">
                {item.status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {item.status === 'uploading' && (
                  <span className="text-xs font-mono text-blue-500">{item.progress}%</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(item.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}