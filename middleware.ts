import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

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
  
  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname
  
  // Add debugging to console (visible in server logs)
  console.log(`Middleware - Path: ${path}, Session exists: ${!!session}`)
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (session && authRoutes.some(route => path.startsWith(route))) {
    console.log('Authenticated user accessing auth route - redirecting to dashboard')
    // Use a direct URL without any query parameters to avoid circular redirects
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    console.log('Unauthenticated user accessing protected route - redirecting to sign-in')
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  // For dashboard access, check subscription status (if needed)
  if (path.startsWith('/dashboard') && session) {
    // You can add subscription verification logic here if needed
    console.log('Authenticated user accessing dashboard - proceeding')
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