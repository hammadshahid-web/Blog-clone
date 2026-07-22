import { apiClient } from '@/lib/api-client';
import { Post } from '@/types/post';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts?_limit=9');
  return response.data;
};