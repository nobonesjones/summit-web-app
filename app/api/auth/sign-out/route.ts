import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server-async';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  
  // Use the async Supabase client
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/`, {
    status: 301,
  });
} 