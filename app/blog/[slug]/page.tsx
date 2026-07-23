'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await axios.get(`/api/blogs/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Article Not Found</h2>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-500 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </button>

      {/* Meta Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            {blog.category || 'General'}
          </span>
          {blog.status === 'draft' && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Draft
            </span>
          )}
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> 5 min read
          </span>
        </div>
      </div>

      {/* Banner Cover Image */}
      {blog.imageUrl && (
        <div className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-slate-900">
          <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Content Area */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4">
        {blog.content}
      </div>
    </article>
  );
}