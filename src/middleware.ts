// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth'; // Adjusted path assuming middleware.ts is in src

// Role ID for admin
const ADMIN_ROLE_ID = 1;

// IMPORTANT: This middleware relies on the JWT_SECRET environment variable being set.
// Ensure it is configured in your environment for authentication to work correctly.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that require admin authentication
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (isAdminPath) {
    const { isAuthenticated, user } = await verifyAuth(request);

    if (!isAuthenticated) {
      // For API routes, return 401
      if (pathname.startsWith('/api/admin')) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Authentication required. Please log in.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // For UI routes, redirect to sign-in
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname); // Optional: redirect back after login
      return NextResponse.redirect(signInUrl);
    }

    if (user?.role_id !== ADMIN_ROLE_ID) {
      // For API routes, return 403
      if (pathname.startsWith('/api/admin')) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Forbidden: You do not have admin privileges.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // For UI routes, rewrite to a 'not-authorized' page.
      // This page must not use the AdminLayout.
      console.log(`[Middleware] User not admin. Rewriting ${pathname} to /not-authorized`);
      return NextResponse.rewrite(new URL('/not-authorized', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
