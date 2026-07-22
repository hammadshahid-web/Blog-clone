// hooks/use-posts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '@/components/BlogCard';

interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

const fetchPaginatedPosts = async (page: number, limit: number = 6): Promise<PostsResponse> => {
  const response = await apiClient.get<PostsResponse>(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

export function usePaginatedPosts(page: number) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPaginatedPosts(page),
    placeholderData: (previousData) => previousData, // Smooth Pagination UX
  });
}