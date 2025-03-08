import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server-async';

export async function GET(request: Request) {
  // Use the async Supabase client
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const fullName = String(formData.get('full_name') || '');
    const avatarUrl = String(formData.get('avatar_url') || '');
    
    // Use the async Supabase client
    const supabase = await createServerSupabaseClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 