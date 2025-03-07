import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    const fullName = String(formData.get('full_name') || '');
    const avatarUrl = String(formData.get('avatar_url') || '');
    
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      }
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 