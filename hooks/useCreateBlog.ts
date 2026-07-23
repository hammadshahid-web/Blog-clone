// hooks/useCreateBlog.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface CreateBlogPayload {
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  image?: File | null;
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBlogPayload) => {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('content', payload.content);
      formData.append('category', payload.category);
      formData.append('status', payload.status);
      if (payload.image) {
        formData.append('image', payload.image);
      }

      const response = await axios.post('/api/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate blogs list cache so UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}