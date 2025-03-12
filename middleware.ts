import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/user-profile', '/mini-apps']

// Define auth routes
const authRoutes = ['/sign-in', '/sign-up']

// Define public routes that don't need auth checks
const publicRoutes = [
  '/',
  '/api/',
  '/_next/',
  '/static/',
  '/favicon.ico',
  '/auth/callback',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname
  
  // Skip middleware for public routes and static assets
  if (publicRoutes.some(route => path.startsWith(route))) {
    // For public routes, we still want to check auth status to maintain the session
    // but we don't want to redirect
    try {
      const supabase = createMiddlewareClient(
        req as unknown as Request, 
        res as unknown as Response
      )
      
      // Check auth status but don't redirect
      await supabase.auth.getSession()
      
      return res
    } catch (error) {
      console.error('[Middleware] Error checking session on public route:', error)
      return res
    }
  }

  try {
    // Create supabase client using shared client
    const supabase = createMiddlewareClient(
      req as unknown as Request, 
      res as unknown as Response
    )

    // Check auth status
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // Log auth state for debugging
    console.log(`[Auth Debug] Path: ${path}, Session: ${!!session}, Error: ${error?.message || 'none'}`)

    // Handle auth routes (sign-in, sign-up)
    if (authRoutes.some(route => path.startsWith(route))) {
      if (session) {
        // Check if there's a redirect URL in the query params
        const redirectTo = req.nextUrl.searchParams.get('redirectTo')
        const targetPath = redirectTo || '/dashboard'
        
        // Prevent redirect loops by checking if we're already at the target
        if (path === targetPath) {
          return res
        }
        
        console.log(`[Auth Debug] Redirecting authenticated user from ${path} to ${targetPath}`)
        return NextResponse.redirect(new URL(targetPath, req.url))
      }
      return res
    }

    // Handle protected routes
    if (protectedRoutes.some(route => path.startsWith(route))) {
      if (!session) {
        console.log(`[Auth Debug] Redirecting unauthenticated user from ${path} to /sign-in`)
        // Store the original URL as the redirect target
        const redirectUrl = new URL('/sign-in', req.url)
        redirectUrl.searchParams.set('redirectTo', path)
        return NextResponse.redirect(redirectUrl)
      }
      
      // Add session user ID to request headers for tracking
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set('x-user-id', session.user.id)
      
      // Return response with modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return res
  } catch (error: any) {
    console.error('[Auth Error]', error.message || error)
    
    // On critical errors, redirect to sign-in with error message
    if (protectedRoutes.some(route => path.startsWith(route))) {
      const redirectUrl = new URL('/sign-in', req.url)
      redirectUrl.searchParams.set('error', 'Authentication error. Please sign in again.')
      return NextResponse.redirect(redirectUrl)
    }
    
    // On other routes, allow the request to proceed but log the error
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}