import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-supabase-webhook-signature') || '';
    
    // In production, you should verify the webhook signature
    // This requires setting up a webhook secret in your Supabase dashboard
    // and implementing signature verification logic
    
    const payload = await request.json();
    const { type, record } = payload;
    
    // Handle user creation event
    if (type === 'INSERT' && payload.table === 'auth.users') {
      const { id, email, raw_user_meta_data } = record;
      
      // Create a profile record for the new user
      const { error } = await supabaseAdmin
        .from('profiles')
        .insert({
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          full_name: raw_user_meta_data?.full_name || '',
          avatar_url: raw_user_meta_data?.avatar_url || '',
        });
      
      if (error) {
        console.error('Error creating profile:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Handle other webhook events as needed
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 