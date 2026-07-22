'use client';

import Link from 'next/link';
import { Terminal, Moon, Sun, Rss } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Terminal className="w-5 h-5" />
          </div>
          <span>Dev<span className="text-blue-600 dark:text-blue-400">Pulse</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
          <Link href="/#articles" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Articles</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Topics</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About</Link>
          <Link
  href="/create"
  className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
>
  + New Article
</Link>

        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
              {/* //resuable btn  */}
          <Button variant="default" size="sm" className="hidden sm:inline-flex">
            <Rss className="w-4 h-4" />
            Subscribe
          </Button>
        </div>

      </div>
    </header>
  );
}