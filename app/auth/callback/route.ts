import { createServerSupabaseClient } from '@/lib/supabase/server-async'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '')

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  
  // If there's no code, redirect to sign-in
  if (!code) {
    console.error('No code provided in auth callback')
    return NextResponse.redirect(`${origin}/sign-in?error=No%20authentication%20code%20provided`)
  }
  
  try {
    // Use the async Supabase client
    const supabase = await createServerSupabaseClient()
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message)}`)
    }
    
    if (!data.session || !data.user) {
      console.error('No session or user data returned')
      return NextResponse.redirect(`${origin}/sign-in?error=Authentication%20failed`)
    }
    
    // Check if this is a sign-up or sign-in
    const isSignUp = data.user.created_at === data.user.last_sign_in_at
    const successParam = isSignUp ? 'signup' : 'signin'
    
    console.log(`Session established successfully, user:`, data.user.id)
    
    try {
      // Create or update user profile in Supabase
      await createUserProfile(data.user)
      
      // Redirect to the requested URL or dashboard
      const redirectTo = isSignUp 
        ? new URL(`/dashboard?success=${successParam}`, origin) 
        : new URL('/dashboard', origin)
      
      return NextResponse.redirect(redirectTo)
    } catch (error: any) {
      console.error('Error in callback handler:', error)
      return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message || 'Profile creation failed')}`)
    }
  } catch (error: any) {
    console.error('Exception in auth callback:', error)
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message || 'Authentication failed')}`)
  }
}

// Helper function to create a user profile in Supabase
async function createUserProfile(user: any) {
  if (!user) {
    console.error('No user provided to createUserProfile')
    throw new Error('No user data available')
  }
  
  try {
    console.log('Creating/updating user profile in Supabase:', user.id)
    
    // Use the async Supabase client
    const supabase = await createServerSupabaseClient()
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the error code for "no rows returned" - this is expected if the profile doesn't exist
      console.error('Error checking for existing profile:', fetchError)
      throw fetchError
    }
    
    if (existingProfile) {
      console.log('User profile already exists, updating:', user.id)
      
      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
        })
        .eq('id', user.id)
      
      if (updateError) {
        console.error('Error updating user profile:', updateError)
        throw updateError
      }
      
      console.log('User profile successfully updated in Supabase:', user.id)
      return
    }
    
    // Create a new profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      })
    
    if (insertError) {
      console.error('Error creating user profile:', insertError)
      throw insertError
    }
    
    console.log('User profile successfully created in Supabase:', user.id)
  } catch (error) {
    console.error('Error in createUserProfile:', error)
    throw error
  }
}

// Helper function to create a user in Convex - commented out as we're migrating to Supabase
/*
async function createUserInConvex(user: any) {
  try {
    console.log('Creating user in Convex:', user.id)
    console.log('User data:', JSON.stringify({
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    }, null, 2))
    
    // Check if the Convex URL is defined
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      console.error('NEXT_PUBLIC_CONVEX_URL is not defined')
      throw new Error('NEXT_PUBLIC_CONVEX_URL is not defined')
    }
    
    // Check if user already exists in Convex
    try {
      const existingUser = await convex.query(api.users.getUserByToken, {
        tokenIdentifier: user.id,
      });
      
      if (existingUser) {
        console.log('User already exists in Convex, updating:', user.id);
        
        // Update the user in Convex
        const updatedUserId = await convex.mutation(api.users.updateUser, {
          tokenIdentifier: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        });
        
        console.log('User successfully updated in Convex:', updatedUserId);
        return updatedUserId;
      }
    } catch (queryError) {
      console.log('User does not exist in Convex, creating new user');
    }
    
    // Create the user in Convex
    const userId = await convex.mutation(api.users.createUser, {
      tokenIdentifier: user.id,
      userId: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      createdAt: new Date().toISOString(),
    });
    
    console.log('User successfully created in Convex:', userId);
    return userId;
  } catch (error) {
    console.error('Error creating user in Convex:', error);
    throw error;
  }
}
*/ 