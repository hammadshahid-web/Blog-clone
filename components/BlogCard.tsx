import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
}

export default function BlogCard({ post }: { post: Post }) {
    return (
        <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300">

            {/* Optimized Image Cover */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 👈 Add this line!
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {post.category}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                        <Link href={`/blog/${post.slug}`}>
                            {post.title}
                        </Link>
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                    </p>
                </div>

                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2"
                >
                    Read Article <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

        </article>
    );
}