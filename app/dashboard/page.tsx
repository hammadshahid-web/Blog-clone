'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, CheckCircle2, Clock, Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHomePage() {
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await axios.get('/api/blogs');
      return res.data;
    },
  });

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b: any) => b.status === 'published').length;
  const draftBlogs = blogs.filter((b: any) => b.status === 'draft').length;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back! Here is what's happening with your platform.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-sm font-medium">Total Articles</span>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalBlogs}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-sm font-medium">Published</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{publishedBlogs}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-sm font-medium">Drafts</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{draftBlogs}</p>
        </div>
      </div>
    </div>
  );
}