// hooks/use-post-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '@/components/BlogCard';

// 1. Delete Post Mutation with Optimistic Update
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      await apiClient.delete(`/posts/${slug}`);
    },
    // Optimistic Update Before Server Response
    onMutate: async (deletedSlug) => {
      // Ongoing refetches cancel karein taake optimistic state overwrite na ho
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Previous cache state snapshot backup lein (Rollback ke liye)
      const previousData = queryClient.getQueryData(['posts']);

      // Optimistically UI se item remove karein
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.slug !== deletedSlug),
        };
      });

      return { previousData };
    },
    // Agar API Error aaye to state Restore/Rollback karein
    onError: (_err, _deletedSlug, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['posts'], context.previousData);
      }
    },
    // Success / Error ke baad Fresh Server Sync (Invalidation)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}