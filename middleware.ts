import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // TEMPORARY: Disable middleware cookie check
    // Cookie dari backend domain (vercel.app) tidak bisa dibaca di frontend middleware
    // karena cross-domain. Rely on client-side auth guard di layout.tsx instead

    // Debug logging
    console.log('[Middleware] Path:', request.nextUrl.pathname);
    console.log('[Middleware] All cookies:', request.cookies.getAll().map(c => c.name));

    // Allow all requests - client-side guard will handle auth
    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        '/admin/:path*', // Monitor admin routes
    ],
};
