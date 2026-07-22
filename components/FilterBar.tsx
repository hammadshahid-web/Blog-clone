'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useTransition } from 'react';

const CATEGORIES = ['All', 'Next.js', 'Tailwind CSS', 'TypeScript', 'React'];

export default function FilterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('query') || '';
  const currentCategory = searchParams.get('category') || 'All';

  // Helper to update URL search parameters
  const updateFilters = (query: string, category: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    if (category && category !== 'All') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    // Wrap in transition to prevent UI freeze during URL state update
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search articles by title or topic..."
          value={currentSearch}
          onChange={(e) => updateFilters(e.target.value, currentCategory)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {currentSearch && (
          <button
            onClick={() => updateFilters('', currentCategory)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => updateFilters(currentSearch, cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}