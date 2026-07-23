'use client';

import { useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { usePaginatedBlogs } from '@/hooks/usePaginatedBlogs';

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const limit = 6; // Items per page

  const { data, isLoading, isFetching, isError } = usePaginatedBlogs({
    page,
    limit,
    search: searchTerm,
    status: statusFilter,
  });

  const blogs = data?.data || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (status: 'all' | 'published' | 'draft') => {
    setStatusFilter(status);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Articles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Explore articles or manage your draft posts.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-3">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search articles by title or keyword..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isFetching && !isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
        )}
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          Failed to load articles. Please check your network connection and try again.
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400">No articles found.</p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <BlogCard key={blog.id || blog.slug} post={blog} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{' '}
                <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}