'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Use the shared Supabase client
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('[Auth] Initializing auth state')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('[Auth] Session error:', sessionError)
          throw sessionError
        }
        
        if (session) {
          console.log('[Auth] Session found for user:', session.user.email)
          setUser(session.user)
        } else {
          console.log('[Auth] No session found')
          setUser(null)
        }
      } catch (e) {
        console.error('[Auth] Error during initialization:', e)
        setError(e instanceof Error ? e : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Event:', event, 'Session:', !!session, 'Path:', pathname)
        
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        
        setLoading(false)
        
        // Handle navigation based on auth events
        if (event === 'SIGNED_IN') {
          console.log('[Auth] User signed in, refreshing...')
          router.refresh()
        } else if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out, redirecting...')
          // Only redirect if on a protected page
          if (pathname.startsWith('/dashboard') || 
              pathname.startsWith('/user-profile') || 
              pathname.startsWith('/mini-apps')) {
            router.push('/')
          }
          router.refresh()
        }
      }
    )

    // Cleanup subscription
    return () => {
      console.log('[Auth] Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  const signOut = async () => {
    try {
      console.log("[Auth] Signing out user:", user?.email);
      
      // First, clear any local state
      setUser(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[Auth] Error during sign out:", error);
        throw error;
      }
      
      console.log("[Auth] User signed out successfully");
      
      // Navigate to home page
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error("[Auth] Sign out error:", e);
      setError(e instanceof Error ? e : new Error('An error occurred during sign out'));
      throw e;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 