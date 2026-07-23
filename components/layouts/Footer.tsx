'use client';

import Link from 'next/link';
import { Terminal, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FOOTER_LINKS = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Create Article', href: '/create' },
  ],
  topics: [
    { label: 'Next.js 15', href: '/articles?category=Next.js' },
    { label: 'Tailwind CSS', href: '/articles?category=Tailwind' },
    { label: 'TypeScript', href: '/articles?category=TypeScript' },
    { label: 'React', href: '/articles?category=React' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Settings', href: '/dashboard/settings' },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800">

          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Terminal className="w-5 h-5" />
              </div>
              <span>Dev<span className="text-blue-600 dark:text-blue-400">Pulse</span></span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed mb-1">
              In-depth engineering articles, full-stack tutorials, and modern frontend architecture insights.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="space-y-2 pt-2" id="newsletter">
              <span className="text-xs font-semibold tracking-wider text-slate-900 dark:text-white uppercase">
                Subscribe to our newsletter
              </span>

              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <Button type="submit" variant="default" size="default">
                  Join
                </Button>
              </form>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">
              Topics
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.topics.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">
              Legal & Account
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">

          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} DevPulse. Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> using Next.js 15 & Tailwind CSS.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}