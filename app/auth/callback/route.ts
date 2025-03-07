import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const referrer = request.headers.get('referer') || ''
  
  // Determine if this is a sign-up or sign-in based on the referrer URL
  const isSignUp = referrer.includes('/sign-up')
  const successParam = isSignUp ? 'signup' : 'signin'
  
  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to sign-in page with error
        return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      }
      
      // Redirect to dashboard with appropriate success message
      return NextResponse.redirect(new URL(`/dashboard?success=${successParam}`, requestUrl.origin))
    } catch (err) {
      console.error('Exception in auth callback:', err)
      // Redirect to sign-in page with generic error
      return NextResponse.redirect(new URL('/sign-in?error=Authentication%20failed', requestUrl.origin))
    }
  }
  
  // If no code is present, redirect to dashboard as fallback
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
} 