import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Create a route matcher for public routes
const isPublicRoute = createRouteMatcher([
  '/login(.*)',  // Allow the login route
  '/signup(.*)', // Allow the sign-up route
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except for public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};