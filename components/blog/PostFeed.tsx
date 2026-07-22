'use client';

import Link from 'next/link';
import { usePosts } from '@/hooks/use-posts';

export function PostFeed() {
  const { data: posts, isLoading, isError, error } = usePosts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse p-6"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
        Error loading posts: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts?.map((post) => {
        // Post title se SEO-friendly slug banayein
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        return (
          <Link
            key={post.id}
            href={`/blog/${slug}`}
            className="group block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Article #{post.id}
            </span>
            <h2 className="text-xl font-bold mt-2 capitalize line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm line-clamp-3">
              {post.body}
            </p>
          </Link>
        );
      })}
    </div>
  );
}