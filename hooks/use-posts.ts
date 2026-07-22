import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/api/posts';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
};