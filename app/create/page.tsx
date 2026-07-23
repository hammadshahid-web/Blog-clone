'use client';

import { useForm, Controller } from 'react-hook-form';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useCreateBlog } from '@/hooks/useCreateBlog';
import { useRouter } from 'next/navigation';

interface CreateArticleInputs {
  title: string;
  category: string;
  content: string;
  image: File | null;
}

export default function CreateArticlePage() {
  const router = useRouter();
  const createBlogMutation = useCreateBlog();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateArticleInputs>({
    defaultValues: {
      title: '',
      category: 'Next.js',
      content: '',
      image: null,
    },
  });

  const handleSave = (data: CreateArticleInputs, status: 'draft' | 'published') => {
    createBlogMutation.mutate(
      { ...data, status },
      {
        onSuccess: () => {
          router.push('/articles');
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Create New Article
      </h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Article Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Mastering Next.js 15 App Router"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Cover Image
          </label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  setValue('image', file, { shouldValidate: true });
                }}
                error={errors.image?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Content
          </label>
          <textarea
            rows={6}
            {...register('content', { required: 'Article body is required' })}
            placeholder="Write your article body here..."
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.content && (
            <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* Action Buttons: Save Draft vs Publish */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            disabled={createBlogMutation.isPending}
            onClick={handleSubmit((data) => handleSave(data, 'draft'))}
            className="flex-1 py-3.5 px-6 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={createBlogMutation.isPending}
            onClick={handleSubmit((data) => handleSave(data, 'published'))}
            className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition active:scale-[0.99] disabled:opacity-50"
          >
            {createBlogMutation.isPending ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}