// hooks/use-post-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService, UpdateBlogPayload } from '@/services/blog-service';

// 1. Delete Post Mutation with Optimistic Update
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await blogService.deleteBlog(id);
    },
    // Optimistic Update Before Server Response
    onMutate: async (deletedId) => {
      // 1. Invalidation cancel karein taake refetch state overwrite na ho
      await queryClient.cancelQueries({ queryKey: ['blogs'] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // 2. Snapshot backup lein (Rollback ke liye)
      const previousData = queryClient.getQueryData(['blogs']) || queryClient.getQueryData(['posts']);

      // 3. UI Cache se item instant filter/remove karein (Dono query keys update honge)
      const updateCache = (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((post: any) => post.id !== deletedId && post.slug !== deletedId);
        }
        if (old.posts) {
          return {
            ...old,
            posts: old.posts.filter((post: any) => post.id !== deletedId && post.slug !== deletedId),
          };
        }
        return old;
      };

      queryClient.setQueriesData({ queryKey: ['blogs'] }, updateCache);
      queryClient.setQueriesData({ queryKey: ['posts'] }, updateCache);

      return { previousData };
    },
    // Agar API Error aaye to state Restore/Rollback karein
    onError: (_err, _deletedId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['blogs'], context.previousData);
        queryClient.setQueryData(['posts'], context.previousData);
      }
    },
    // Success / Error ke baad Fresh Server Sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 2. Update Post Mutation (PUT Request)
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBlogPayload) => {
      return await blogService.updateBlog(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', data.data.id] });
    },
  });
}