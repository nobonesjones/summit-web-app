import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server-async'

// Webhook secret for verification
const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook signature if a secret is configured
    if (webhookSecret) {
      const signature = request.headers.get('x-supabase-webhook-signature')
      if (!signature) {
        console.error('Missing webhook signature')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      // TODO: Implement proper signature verification
      // This is a placeholder for actual signature verification
    }
    
    // Parse the webhook payload
    const payload = await request.json()
    console.log('Received Supabase webhook event:', payload.type)
    
    // Handle different event types
    switch (payload.type) {
      case 'user.created':
        await handleUserCreated(payload.record)
        break
      case 'user.updated':
        await handleUserUpdated(payload.record)
        break
      case 'user.deleted':
        await handleUserDeleted(payload.record)
        break
      default:
        console.log('Unhandled webhook event type:', payload.type)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Handle user creation events
async function handleUserCreated(user: any) {
  try {
    console.log('Processing user.created webhook for user:', user.id)
    
    // Create a profile in Supabase
    const supabase = await createServerSupabaseClient()
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (!checkError && existingProfile) {
      console.log('Profile already exists for user:', user.id)
      return
    }
    
    // Create a new profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: user.raw_user_meta_data?.full_name || user.email?.split('@')[0] || '',
        avatar_url: user.raw_user_meta_data?.avatar_url || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    
    if (error) {
      console.error('Error creating profile in webhook handler:', error)
      throw error
    }
    
    console.log('Successfully created profile for user:', user.id)
  } catch (error) {
    console.error('Error in handleUserCreated:', error)
    throw error
  }
}

// Handle user update events
async function handleUserUpdated(user: any) {
  try {
    console.log('Processing user.updated webhook for user:', user.id)
    
    // Update the user's profile in Supabase
    const supabase = await createServerSupabaseClient()
    
    const { error } = await supabase
      .from('profiles')
      .update({
        email: user.email || '',
        full_name: user.raw_user_meta_data?.full_name || user.email?.split('@')[0] || '',
        avatar_url: user.raw_user_meta_data?.avatar_url || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
    
    if (error) {
      console.error('Error updating profile in webhook handler:', error)
      throw error
    }
    
    console.log('Successfully updated profile for user:', user.id)
  } catch (error) {
    console.error('Error in handleUserUpdated:', error)
    throw error
  }
}

// Handle user deletion events
async function handleUserDeleted(user: any) {
  try {
    console.log('Processing user.deleted webhook for user:', user.id)
    
    // Delete the user's profile from Supabase
    const supabase = await createServerSupabaseClient()
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)
    
    if (error) {
      console.error('Error deleting profile in webhook handler:', error)
      throw error
    }
    
    console.log('Successfully deleted profile for user:', user.id)
  } catch (error) {
    console.error('Error in handleUserDeleted:', error)
    throw error
  }
} 