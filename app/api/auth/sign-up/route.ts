import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server-async';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Use the async Supabase client
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
} 