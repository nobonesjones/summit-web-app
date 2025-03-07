import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const fullName = String(formData.get('full_name') || '');
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-up?error=${error.message}`,
      {
        status: 301,
      }
    );
  }

  // If email confirmation is required
  if (data.user?.identities?.length === 0) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-up/verification?email=${email}`,
      {
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}${process.env.NEXT_PUBLIC_AFTER_SIGN_UP_URL || '/dashboard'}`,
    {
      status: 301,
    }
  );
} 