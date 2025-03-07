import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/user-profile',
  '/mini-apps',
]

// Define auth routes
const authRoutes = [
  '/sign-in',
  '/sign-up',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create supabase middleware client
  const supabase = createMiddlewareClient({ req, res })
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (session && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  // For dashboard access, check subscription status (if needed)
  if (path.startsWith('/dashboard') && session) {
    // You can add subscription verification logic here if needed
    // For example, checking if the user has an active subscription
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/convex (Convex API)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/convex).*)',
    // Always run for API routes
    '/api/:path*',
  ],
}