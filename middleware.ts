import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if user has authToken cookie
    const authToken = request.cookies.get('authToken')?.value;
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    // Protect admin routes - redirect to login if no token
    if (isAdminRoute && !authToken) {
        const loginUrl = new URL('/signInPage', request.url);
        // Save the original URL to redirect back after login
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        '/admin/:path*', // Protect all admin routes
    ],
};
