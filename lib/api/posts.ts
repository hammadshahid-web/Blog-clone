import { apiClient } from '@/lib/api-client';
import { Post } from '@/types/post';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts?_limit=9');
  return response.data;
};

// 🆕 Add this function for mutation support
export const createPost = async (newPost: { title: string; body: string }): Promise<Post> => {
  const response = await apiClient.post<Post>('/posts', {
    ...newPost,
    userId: 1,
  });
  return response.data;
};