import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth'; // Adjusted path to use @/

const ADMIN_ROLE_ID = 1;
// The actual path to the login page file due to previous issues.
const ADMIN_LOGIN_PAGE_PATH = '/admin_login_page';
const ADMIN_LOGIN_API_PATH = '/api/admin/auth/login'; // API for admin login
const ADMIN_ME_API_PATH = '/api/admin/auth/me'; // API for checking admin session

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is related to admin functionalities
    if (pathname.startsWith('/admin/') || pathname === ADMIN_LOGIN_PAGE_PATH || pathname.startsWith('/api/admin/')) {
        // Allow direct access to the admin login page, login API, and me API
        if (pathname === ADMIN_LOGIN_PAGE_PATH || pathname === ADMIN_LOGIN_API_PATH || pathname === ADMIN_ME_API_PATH) {
            console.log(`Middleware: Allowing public admin path: ${pathname}`);
            return NextResponse.next();
        }

        // For all other /admin/* UI routes and /api/admin/* API routes, verify authentication and role
        console.log(`Middleware: Protecting admin path: ${pathname}`);
        const { isAuthenticated, user } = await verifyAuth(request);

        if (!isAuthenticated || !user) {
            console.log(`Middleware: Admin path ${pathname} - Not authenticated. Redirecting to ${ADMIN_LOGIN_PAGE_PATH}`);
            return NextResponse.redirect(new URL(ADMIN_LOGIN_PAGE_PATH, request.url));
        }

        if (user.role_id !== ADMIN_ROLE_ID) {
            console.log(`Middleware: Admin path ${pathname} - User (ID: ${user.id}) is not an admin (Role: ${user.role_id}). Redirecting to ${ADMIN_LOGIN_PAGE_PATH}`);
            return NextResponse.redirect(new URL(ADMIN_LOGIN_PAGE_PATH, request.url));
        }

        console.log(`Middleware: Admin path ${pathname} - Authenticated admin (ID: ${user.id}). Allowing.`);
        return NextResponse.next(); // Allow access if authenticated admin
    }

    // console.log(`Middleware: Path ${pathname} did not match admin routes. Allowing.`);
    return NextResponse.next(); // Allow all other routes
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Other static assets if any
         * We want to match:
         * - /admin/* (admin UI routes)
         * - /admin_login_page (the specific admin login page file)
         * - /api/admin/* (admin API routes)
         */
        '/admin/:path*',
        '/admin_login_page',
        '/api/admin/:path*',
        // It's generally good practice to ensure that Next.js internals and static assets are not processed by the middleware
        // unless absolutely necessary. The default behavior of the matcher often excludes these, but explicit exclusion can be added.
        // '/((?!_next/static|_next/image|favicon.ico).*)', // This is a more complex example if needed
    ],
};
