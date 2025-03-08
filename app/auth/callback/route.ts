import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const referrer = request.headers.get('referer') || ''
  
  console.log(`Auth callback - Code present: ${!!code}, Referrer: ${referrer}`)
  
  // Determine if this is a sign-up or sign-in based on the referrer URL
  const isSignUp = referrer.includes('/sign-up')
  const successParam = isSignUp ? 'signup' : 'signin'
  
  if (code) {
    try {
      console.log('Exchanging code for session')
      const cookieStore = cookies()
      
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set(name, value, options)
            },
            remove(name: string, options: any) {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            },
          },
        }
      )
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to sign-in page with error
        return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      }
      
      console.log(`Session established successfully, redirecting to dashboard with ${successParam} parameter`)
      
      // Redirect to dashboard with appropriate success message
      // Use a clean URL without any query parameters that might cause issues
      const dashboardUrl = new URL(`/dashboard?success=${successParam}`, requestUrl.origin)
      return NextResponse.redirect(dashboardUrl)
    } catch (err) {
      console.error('Exception in auth callback:', err)
      // Redirect to sign-in page with generic error
      return NextResponse.redirect(new URL('/sign-in?error=Authentication%20failed', requestUrl.origin))
    }
  }
  
  console.log('No code present in callback, redirecting to dashboard')
  // If no code is present, redirect to dashboard as fallback
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
} 