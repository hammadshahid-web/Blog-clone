import { Metadata } from 'next';
import { CreatePostForm } from '@/components/blog/CreatePostForm';

export const metadata: Metadata = {
  title: 'Create New Post // DevPulse',
  description: 'Publish a new blog post with live validation.',
};

export default function CreatePostPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Share your knowledge with the tech community.
        </p>
      </div>

      <CreatePostForm />
    </div>
  );
}