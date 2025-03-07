import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

// This route handler is protected and should only be accessible to admins
export async function GET(request: Request) {
  try {
    // First, verify that the current user is an admin
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Here you would typically check if the user has admin privileges
    // For example, by checking a custom claim or a role in your database
    // This is just a placeholder - implement your own admin check
    const isAdmin = false; // Replace with actual admin check
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // If the user is an admin, use the admin client to fetch all users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ users: users.users });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 