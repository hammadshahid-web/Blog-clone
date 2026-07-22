'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Terminal, Moon, Sun, Bookmark, Search, User, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { useAuthStore } from '@/stores/use-auth-store';
import { useUIStore } from '@/stores/use-ui-store';
import axios from 'axios';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // 🌟 Updated Auth Store Actions
  const { user, clearAuth } = useAuthStore();
  const wishlistSlugs = useWishlistStore((state) => state.wishlistSlugs);
  const { toggleSearch } = useUIStore();

  useEffect(() => setMounted(true), []);

  const wishlistCount = mounted ? wishlistSlugs.length : 0;

  // Real Logout Handler
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

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
          <Link href="/create" className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            + New Article
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* UI Store: Toggle Search */}
          <button
            onClick={toggleSearch}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Icon */}
          <Link
            href="#"
            className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <Bookmark className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* 🌟 Updated Auth Display */}
          {mounted && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {user.email.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout} 
                title="Logout" 
                className="p-1 text-slate-500 hover:text-red-500 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                <User className="w-4 h-4 mr-1" /> Login
              </Button>
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}