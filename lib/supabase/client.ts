'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// This is safe to expose as it's a public key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton browser client
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
  // Use existing instance if available (important for maintaining auth state)
  if (supabaseInstance) return supabaseInstance
  
  try {
    // Create a new instance with persistent storage
    supabaseInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          storageKey: 'summit-auth-token',
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
    
    // Log for debugging
    console.log('[Supabase] Client created')
    
    return supabaseInstance
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    // Re-throw to make the error visible
    throw error
  }
}

// For direct use in components
export const supabase = createClient() 