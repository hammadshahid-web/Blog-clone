import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debugging console log
  console.log('🔥 MIDDLEWARE RUNNING ON ROUTE:', pathname);

  if (pathname.startsWith('/create') || pathname.startsWith('/dashboard')) {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      console.log('⛔ Unauthorized! Redirecting to /login...');
      return NextResponse.redirect(new URL('/login?from=' + pathname, req.url));
    }
  }

  return NextResponse.next();
}

// Ensure matcher matches ALL subpaths
export const config = {
  matcher: ['/create', '/create/:path*', '/dashboard/:path*'],
};