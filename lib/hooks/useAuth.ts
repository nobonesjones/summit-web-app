'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

const supabase = createClient()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('[useAuth] Checking session')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[useAuth] Error getting session:', error)
          setError(error)
        } else if (session) {
          console.log('[useAuth] Session found for user:', session.user.email)
          setUser(session.user)
        } else {
          console.log('[useAuth] No session found')
          setUser(null)
        }
      } catch (e) {
        console.error('[useAuth] Error:', e)
        setError(e instanceof Error ? e : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[useAuth] Auth state changed:', event, !!session)
      
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      
      setIsLoading(false)
    })

    return () => {
      console.log('[useAuth] Cleaning up subscription')
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    try {
      console.log('[useAuth] Signing out user:', user?.email)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('[useAuth] Error signing out:', error)
        throw error
      }
      
      setUser(null)
      console.log('[useAuth] User signed out successfully')
    } catch (err) {
      console.error('[useAuth] Error signing out:', err)
      setError(err instanceof Error ? err : new Error('Failed to sign out'))
    }
  }

  // Add isSignedIn property for easier checking
  const isSignedIn = !!user

  return {
    user,
    isLoading,
    error,
    signOut,
    isSignedIn
  }
} 