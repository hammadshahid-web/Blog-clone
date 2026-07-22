'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { createPostSchema, type CreatePostInput } from '@/lib/validations/post';

export function CreatePostForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  // Handle image upload and generate object URL preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue('image', undefined as unknown as FileList, { shouldValidate: true });
  };

  const onSubmit = async (data: CreatePostInput) => {
    setIsSubmitting(true);
    
    // Simulate API upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Submitted Post Data:', {
      ...data,
      fileName: data.image[0].name,
    });

    alert('Post created successfully!');
    reset();
    removeImage();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          {...register('title')}
          type="text"
          placeholder="e.g. Master Next.js 15 Server Actions"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
        >
          <option value="">Select a category</option>
          <option value="Next.js">Next.js</option>
          <option value="React">React</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Architecture">Architecture</option>
        </select>
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Cover Image Upload + Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">Cover Image</label>
        
        {imagePreview ? (
          <div className="relative h-60 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Click to upload cover image (PNG, JPG, WEBP)
            </span>
            <input
              {...register('image')}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                register('image').onChange(e);
                handleImageChange(e);
              }}
            />
          </label>
        )}
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">
            {errors.image.message as string}
          </p>
        )}
      </div>

      {/* Content Textarea */}
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          {...register('content')}
          rows={6}
          placeholder="Write your article body here..."
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Publishing...' : 'Publish Article'}
      </button>
    </form>
  );
}