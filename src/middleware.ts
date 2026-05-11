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

export default clerkMiddleware(async (auth, request) => {
  // Allow unauthenticated access only to explicitly public routes.
  if (!isPublicRoute(request)) {
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
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|json|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
