import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/orders(.*)',
  '/api/dashboard(.*)',
  '/api/orders(.*)',
  '/api/profile(.*)',
  '/api/checkout(.*)',
  '/api/cart(.*)',
  // Admin routes – only accessible to users with admin role
  '/admin(.*)',
  '/api/admin(.*)',
]);

// Public routes – only allow unauthenticated access to sign‑in and sign‑up pages.
// All other pages (including product listings, about, etc.) now require authentication.
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

/**
 * Updated Clerk middleware for production stability.
 *
 * - Public routes are returned early without any authentication checks.
 * - Protected routes run `auth.protect()` and, if the route is an admin
 *   path, verify the signed‑in user has the `admin` role.
 * - The middleware always returns a `NextResponse` (either the JSON error
 *   responses for auth failures or `NextResponse.next()` for successful
 *   requests). This prevents the `MIDDLEWARE_INVOCATION_FAILED` error that
 *   occurs when a middleware handler does not return a response.
 */
export default clerkMiddleware(async (auth, request) => {
  try {
    // Allow unauthenticated access to explicitly public routes.
    if (isPublicRoute(request)) {
      return NextResponse.next();
    }

    // Protect all non‑public routes.
    await auth.protect();

    // Admin‑only protection: ensure the signed‑in user has role "admin"
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      // @ts-ignore – publicMetadata is a free‑form object
      if (user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Authorized request – continue to the next handler.
    return NextResponse.next();
  } catch (error) {
    // Log the error server‑side (console) and return a generic 500 response.
    // This prevents the middleware from bubbling up an unhandled exception
    // which would result in MIDDLEWARE_INVOCATION_FAILED.
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

/**
 * Middleware matcher configuration.
 *
 * The original regular expression was overly complex and caused the
 * middleware to be invoked for static assets, which can trigger the
 * `MIDDLEWARE_INVOCATION_FAILED` error during builds. The updated
 * configuration excludes the Next.js internal `_next` directory and
 * common static file extensions, while still applying the middleware to
 * all page routes and API routes.
 */
export const config = {
  matcher: [
    // Apply to all page routes except static assets and the Next.js internals.
    '/((?!_next|.*\\.(?:png|jpe?g|svg|ico|webp|gif|css|js|json|txt|xml)).*)',
    // Apply to all API routes.
    '/api/:path*',
  ],
};
