import BlogCard, { Post } from '@/components/BlogCard';
import FilterBar from '@/components/FilterBar';
import BlogFeedList from '@/components/BlogFeedList';
import { Sparkles, TrendingUp, SearchX } from 'lucide-react';
import { Suspense } from 'react';


const mockPosts: Post[] = [
  {
    slug: 'nextjs-app-router-mastery',
    title: 'Mastering Next.js 15 App Router: Server Components & Streaming',
    excerpt: 'Explore how React Server Components and dynamic routing fundamentally alter full-stack web application performance.',
    category: 'Next.js',
    date: 'Jul 20, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'tailwind-css-v4-guide',
    title: 'Building Modern Design Systems with Tailwind CSS & shadcn/ui',
    excerpt: 'Learn how utility classes combined with accessible headless UI primitives radically accelerate frontend workflows.',
    category: 'Tailwind CSS',
    date: 'Jul 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'typescript-generics-explained',
    title: 'Demystifying TypeScript Generics & Advanced Utility Types',
    excerpt: 'A practical guide to writing reusable, rock-solid type definitions without losing static type safety.',
    category: 'TypeScript',
    date: 'Jul 12, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  },
];

interface HomePageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { query = '', category = 'All' } = await searchParams;

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category === 'All' || post.category.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 transition-colors duration-200">
      {/* Hero Section */}
      <section className="py-8 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Updated for Next.js 15
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-blue-600 dark:text-white">
          Engineering Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Frontend Craft</span>
        </h1>
      </section>

      {/* Main Filter & Articles Section */}
      <section id="articles" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Latest Articles
          </h2>
        </div>

        {/* Client Filter Component wrapped in Suspense */}
        <Suspense fallback={<div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />}>
          <FilterBar />
        </Suspense>

        {/* 🌟 Render Posts using View Toggle Component */}
        {filteredPosts.length > 0 ? (
          <BlogFeedList posts={filteredPosts} />
        ) : (
          <div className="text-center py-16 space-y-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <SearchX className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No results matching &quot;{query}&quot; in {category}. Try searching for a different keyword or category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}