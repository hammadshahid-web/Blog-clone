'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ArticleError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center space-y-4 max-w-md mx-auto">
      <div className="p-3 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 w-fit rounded-full mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold">Failed to load article</h2>
      <p className="text-slate-500 text-sm">
        {error.message || 'An unexpected error occurred while fetching the post.'}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}