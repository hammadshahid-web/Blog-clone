'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Loader2, Save, Trash2 } from 'lucide-react';

import { createPostSchema, type CreatePostInput } from '@/lib/validations/post';
import { useCreatePost } from '@/hooks/use-create-post';
import { useDraftStore } from '@/stores/use-draft-store';

export function CreatePostForm() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  // Zustand Global Store State & Actions
  const { title, category, content, lastSaved, setDraft, clearDraft } = useDraftStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      category: '' as any,
      content: '',
    },
  });

  // 1. Client-side Hydration check & Load draft into React Hook Form
  useEffect(() => {
    if (title) setValue('title', title);
    if (category) setValue('category', category as any);
    if (content) setValue('content', content);
    setHasHydrated(true);
  }, [setValue, title, category, content]);

  // 2. Watch form fields and update Zustand Draft Store in real-time
  const watchedFields = watch();
  useEffect(() => {
    if (!hasHydrated) return;

    const { title: wTitle, category: wCategory, content: wContent } = watchedFields;

    if (wTitle !== undefined || wCategory !== undefined || wContent !== undefined) {
      setDraft({
        title: wTitle || '',
        category: wCategory || '',
        content: wContent || '',
      });
    }
  }, [watchedFields.title, watchedFields.category, watchedFields.content, hasHydrated, setDraft]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setValue('image', undefined as unknown as FileList, { shouldValidate: true });
  };

  const handleDiscardDraft = () => {
    clearDraft();
    reset({
      title: '',
      category: '' as any,
      content: '',
    });
    removeImage();
  };

  const onSubmit = (data: CreatePostInput) => {
    createPostMutation.mutate(
      {
        title: data.title,
        body: data.content,
      },
      {
        onSuccess: () => {
          alert('Post published successfully!');
          clearDraft(); // Clear draft on successful publication
          reset();
          removeImage();
          router.push('/');
        },
        onError: (err: Error) => { // 👈 Explicit type 'Error' add kar diya
          alert(`Failed to create post: ${err.message}`);
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Draft Indicator Header */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Save className="w-4 h-4 text-blue-500" />
          <span>
            {lastSaved ? `Draft auto-saved at ${lastSaved}` : 'Auto-save ready'}
          </span>
        </div>
        {(title || content || category) && (
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Discard Draft
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          {imagePreview ? (
            <div className="relative h-60 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
            <p className="text-sm text-red-500 mt-1">{errors.image.message as string}</p>
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
          disabled={createPostMutation.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {createPostMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {createPostMutation.isPending ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}