'use client';

import { useEffect, useState } from 'react';
import BlogCard, { Post } from '@/components/BlogCard';
import { useSettingsStore } from '@/stores/use-settings-store';
import { LayoutGrid, List } from 'lucide-react';

export default function BlogFeedList({ posts }: { posts: Post[] }) {
  const { viewMode, setViewMode } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to grid on server to prevent mismatch before mount
  const currentMode = mounted ? viewMode : 'grid';

  return (
    <div className="space-y-6">
      {/* 🌟 View Toggle Buttons */}
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md transition ${
              currentMode === 'grid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-md transition ${
              currentMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🌟 Dynamic Layout Classes based on Zustand State */}
      <div
        className={
          currentMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}