'use client';

import { useState } from 'react';
import { usePaginatedPosts } from '@/hooks/use-posts';
import { useDeletePost } from '@/hooks/use-post-mutations';
import BlogCard from '@/components/BlogCard';
import { Loader2, AlertCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginatedBlogFeed() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isFetching } = usePaginatedPosts(page);
  const deleteMutation = useDeletePost();

  // 🔴 Error State
  if (isError) {
    return (
      <div className="p-6 my-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-500">Failed to Load Articles</h3>
        <p className="text-sm text-slate-400">{(error as Error).message || 'Something went wrong.'}</p>
      </div>
    );
  }

  // 🟡 Loading Skeleton State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 my-8">
      {/* Background Fetching Indicator */}
      {isFetching && (
        <div className="flex items-center gap-2 text-xs text-blue-500 font-medium">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating feed...
        </div>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.posts.map((post) => (
          <div key={post.slug} className="relative group">
            <BlogCard post={post} />
            
            {/* Optimistic Delete Button */}
            <button
              onClick={() => deleteMutation.mutate(post.slug)}
              disabled={deleteMutation.isPending}
              className="absolute top-3 right-12 p-2 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 🟢 Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-sm font-medium text-slate-500">
          Page {page} of {data?.totalPages || 1}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= (data?.totalPages || 1)}
          className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}