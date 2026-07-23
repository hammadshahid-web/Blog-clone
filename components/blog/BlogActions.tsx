'use client';

import React from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

export function BlogActions({ blogId, blogTitle }: { blogId: string; blogTitle: string }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/blogs/${blogId}`);
      return res.data;
    },
    onSuccess: () => {
      // 1. Manually update cache to instantly delete item from UI
      queryClient.setQueriesData({ queryKey: ['blogs'] }, (oldData: any) => {
        if (!oldData) return [];
        // Handle array response
        if (Array.isArray(oldData)) {
          return oldData.filter((post: any) => post.id !== blogId && post.slug !== blogId);
        }
        // Handle nested response like { data: [...] }
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.filter((post: any) => post.id !== blogId && post.slug !== blogId),
          };
        }
        return oldData;
      });

      // 2. Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (err) => {
      console.error('Delete error:', err);
      alert('Delete failed. Check server log.');
    },
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop duplicate events & form submits
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (deleteMutation.isPending) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${blogTitle}"?`);
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Link
        href={`/articles/edit/${blogId}`}
        onClick={(e) => e.stopPropagation()}
        className="p-2 text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg transition"
        title="Edit Article"
      >
        <Pencil className="w-4 h-4" />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        className="p-2 text-xs font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700/50 rounded-lg transition disabled:opacity-50"
        title="Delete Article"
      >
        {deleteMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}