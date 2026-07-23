// hooks/usePaginatedBlogs.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Mock data for fallback testing
const DUMMY_BLOGS = [
  {
    id: '1',
    slug: 'mastering-nextjs-15',
    title: 'Mastering Next.js 15 App Router',
    excerpt: 'A comprehensive guide to building modern full-stack web applications.',
    category: 'Next.js',
    date: 'July 24, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60',
    status: 'published',
  },
  {
    id: '2',
    slug: 'tanstack-query-v5-guide',
    title: 'Server State Management with TanStack Query v5',
    excerpt: 'Learn caching, mutations, optimistic updates, and prefetching.',
    category: 'React',
    date: 'July 22, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    status: 'published',
  },
  {
    id: '3',
    slug: 'getting-started-with-tailwind-v4',
    title: 'Getting Started with Modern UI Systems',
    excerpt: 'Build clean, accessible, and high-performance user interfaces with shadcn/ui and Tailwind.',
    category: 'Design Systems',
    date: 'July 20, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
    status: 'published',
  },
];

export function usePaginatedBlogs({ page, limit, search, status }: any) {
  return useQuery({
    queryKey: ['blogs', page, limit, search, status],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/blogs', {
          params: { page, limit, search, status },
        });
        return res.data;
      } catch (error) {
        // Fallback data when API server is offline/unreachable
        console.warn('API Endpoint unavailable, using mock data.');
        return {
          data: DUMMY_BLOGS,
          totalPages: 1,
          totalCount: DUMMY_BLOGS.length,
        };
      }
    },
  });
}