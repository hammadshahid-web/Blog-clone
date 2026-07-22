import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/lib/api/posts';
import { Post } from '@/types/post';

// Mutation payload shape
export interface CreatePostPayload {
  title: string;
  body: string;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  // Explicitly specify <ResponseData, ErrorType, PayloadType>
  return useMutation<Post, Error, CreatePostPayload>({
    mutationFn: (newPost) => createPost(newPost),
    onSuccess: (newPost) => {
      // Posts cache ko update karein
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });

      // Cache invalidate karein taake sync rahe
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};