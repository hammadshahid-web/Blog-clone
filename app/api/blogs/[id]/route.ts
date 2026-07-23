import { NextResponse } from 'next/server';

// 1. GET Request: Single Article Fetch Karne Ke Liye
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Mock Single Post Data (Directly return the object for DynamicForm binding)
    const post = {
      id,
      slug: id,
      title: 'Mastering Next.js 15 & Server State Management',
      content: 'Full-stack application development using Next.js App Router, TanStack Query v5, and dynamic API endpoints.',
      category: 'Engineering',
      status: 'published',
      author: {
        name: 'John Doe',
        bio: 'Senior Software Engineer',
      },
      hasCoAuthor: false,
      references: [
        { label: 'Documentation', url: 'https://nextjs.org' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: '5 min read',
    };

    // Note: Direct JSON response so TanStack Query returns `post` data cleanly
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: 'Article not found.' },
      { status: 404 }
    );
  }
}

// 2. PUT Request: Blog Post Ko Edit/Update Karne Ke Liye
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Basic Validation
    if (!body.title) {
      return NextResponse.json(
        { message: 'Title is required.' },
        { status: 400 }
      );
    }

    // Mock Updated Object
    const updatedPost = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Article updated successfully!',
      data: updatedPost,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update article.' },
      { status: 500 }
    );
  }
}

// 3. DELETE Request: Blog Post Delete Karne Ke Liye
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Simulate Database Delete Delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(`[API] Article deleted successfully: ${id}`);

    return NextResponse.json({
      message: `Article #${id} deleted successfully!`,
      deletedId: id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete article.' },
      { status: 500 }
    );
  }
}   