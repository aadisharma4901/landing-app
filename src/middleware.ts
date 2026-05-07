import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/orders(.*)',
  '/api/dashboard(.*)',
  '/api/orders(.*)',
  '/api/profile(.*)',
  '/api/checkout(.*)',
  '/api/cart(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/features(.*)',
  '/pricing(.*)',
  '/cart(.*)',
  '/success(.*)',
  '/cancel(.*)',
  '/test(.*)',
  '/api/webhooks(.*)',
  '/api/chat(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
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
