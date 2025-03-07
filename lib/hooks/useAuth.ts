'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setLoading(true)
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user ?? null)

        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            router.refresh()
          }
        )

        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()
  }, [router])

  const signOut = async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
      })
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    session,
    loading,
    signOut,
    isSignedIn: !!user,
  }
} 