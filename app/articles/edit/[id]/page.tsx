'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { DynamicForm } from '@/components/ui/DynamicForm';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

// Form Schema Definition for DynamicForm
const articleFormConfig: any[] = [
  {
    name: 'title',
    label: 'Article Title',
    type: 'text',
    placeholder: 'Enter article title...',
    rules: { required: 'Title is required' },
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Design', value: 'Design' },
      { label: 'Product', value: 'Product' },
    ],
  },
  {
    name: 'content',
    label: 'Content Body',
    type: 'textarea',
    placeholder: 'Write article content...',
  },
  {
    name: 'hasCoAuthor',
    label: 'Has Co-Author?',
    type: 'checkbox',
  },
  {
    name: 'author',
    label: 'Author Information',
    type: 'group',
    groupFields: [
      { name: 'name', label: 'Author Name', type: 'text' },
      { name: 'bio', label: 'Author Bio', type: 'textarea' },
    ],
  },
  {
    name: 'references',
    label: 'References & Links',
    type: 'array',
    arrayConfig: {
      itemLabel: 'Reference Link',
      fields: [
        { name: 'label', label: 'Link Title', type: 'text' },
        { name: 'url', label: 'URL', type: 'text' },
      ],
    },
  },
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();

  // Fetch Existing Article Data
  const { data: initialData, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const res = await axios.get(`/api/blogs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Update Article Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      return await axios.put(`/api/blogs/${id}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      alert('Article updated successfully!');
      router.push('/dashboard');
    },
    onError: (err) => {
      console.error('Update failed:', err);
      alert('Failed to update article.');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading article details for edit...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 border border-red-200 rounded-lg bg-red-50 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-semibold text-slate-900">Failed to Load Article</h2>
        <p className="text-sm text-slate-600">The article with ID "#{id}" could not be retrieved.</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Article
          </h1>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
          ID: {id}
        </span>
      </div>

      <DynamicForm
        config={articleFormConfig}
        defaultValues={initialData}
        onSubmit={(data) => updateMutation.mutate(data)}
        submitText="Save & Update Article"
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}