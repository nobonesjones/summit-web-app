import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server-async';

// This route handler is protected and should only be accessible to admins
export async function GET(request: Request) {
  // Use the async Supabase client
  const supabase = await createServerSupabaseClient();

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Get all users
  const { data: users, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json({ users });
} 