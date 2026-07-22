import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug.replace(/-/g, ' ').toUpperCase();

  return {
    title: `${formattedTitle} // DevPulse Article`,
    description: `Read our comprehensive guide on ${formattedTitle}.`,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all articles
      </Link>

      {/* Article Header */}
      <header className="space-y-4">
        <span className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-md">
          Next.js
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          {slug.replace(/-/g, ' ').toUpperCase()}
        </h1>

        <div className="flex flex-wrap items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-y border-slate-200 dark:border-slate-800 py-3 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-200">
              <User className="w-4 h-4 text-blue-600" /> Alex Rivera
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Jul 20, 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> 6 min read
            </span>
          </div>

          <button className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&auto=format&fit=crop&q=80"
          alt="Article Cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
        <p className="text-xl font-medium text-slate-900 dark:text-slate-100">
          The React ecosystem evolved rapidly in recent years. With the Next.js App Router, the boundaries between client and server code are seamlessly unified.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white pt-4">
          Why Server Components Matter
        </h2>
        <p>
          By default, every component inside the <code>app/</code> directory is a React Server Component. This means zero bytes of component JavaScript are shipped to the browser, significantly accelerating initial page loads.
        </p>

        <div className="p-4 rounded-xl border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-base">
          <strong>Key Takeaway:</strong> Keep data-fetching on the server, and only opt into Client Components (<code>'use client'</code>) when you need interactivity like <code>useState</code> or DOM event listeners.
        </div>
      </div>
    </article>
  );
}