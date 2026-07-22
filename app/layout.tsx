// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { AppProviders } from '@/providers'; // 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevPulse // Modern Web & Tech Insights',
  description: 'Articles on Next.js, React, TypeScript, and modern frontend architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col antialiased transition-colors duration-200`}>

        <AppProviders>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}