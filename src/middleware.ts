import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_TOKEN_KEY = 'auth_token';

// Paths that require authentication
const protectedRoutes = [
  '/dashboard',
  '/portfolio',
  '/analytics',
  '/goal',
  '/transaction',
  '/category',
  '/notification',
  '/profile',
  '/settings',
  '/admin',
  '/reports',
  '/investment',
  '/announcements',
];

// Paths that are only for guest users (should redirect to dashboard if authenticated)
const guestRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  // Check if it's a protected route (prefix match)
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if it's a guest route
  const isGuestRoute = guestRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If user is not logged in and tries to access a protected route -> redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Keep target path in query params to redirect back after login if desired
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access a guest route -> redirect to dashboard
  if (isGuestRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See Next.js middleware matching documentation: Match all request paths except public ones
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.png (shortcut icon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)',
  ],
};
