'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowUpRight, Bookmark } from 'lucide-react';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { useEffect, useState } from 'react';
import { BlogActions } from '@/components/blog/BlogActions';

export interface Post {
  id?: string;
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  date?: string;
  createdAt?: string;
  readTime?: string;
  image?: string;
  imageUrl?: string;
  status?: string;
}

export default function BlogCard({ post }: { post: Post }) {
  const { wishlistSlugs, toggleWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe fallbacks for missing/varying backend properties
  const blogId = post.id || post.slug || '';
  const blogSlug = post.slug || post.id || '#';
  const blogImage = post.image || post.imageUrl || '/placeholder.jpg';
  const blogCategory = post.category || 'General';
  const blogExcerpt = post.excerpt || post.content || 'No summary available.';
  const blogDate = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent');
  const blogReadTime = post.readTime || '3 min read';

  const isBookmarked = mounted && wishlistSlugs.includes(blogSlug);

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 relative">
      
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={blogImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
            {blogCategory}
          </span>
          {post.status === 'draft' && (
            <span className="bg-amber-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
              Draft
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(blogSlug);
          }}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-all active:scale-95"
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {blogDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {blogReadTime}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            <Link href={`/blog/${blogSlug}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
            {blogExcerpt}
          </p>
        </div>

        {/* Bottom Actions Bar */}
        <div 
          className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/blog/${blogSlug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read Article <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Edit / Delete Component */}
          <BlogActions blogId={blogId} blogTitle={post.title} />
        </div>
      </div>

    </article>
  );
}