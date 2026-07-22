// lib/validations/post.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  category: z.enum(['Next.js', 'React', 'TypeScript', 'Architecture'], {
    message: 'Please select a valid category', // Direct message parameter
  }),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters long'),
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Cover image is required')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max image size is 5MB'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;