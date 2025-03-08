import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function getAuthToken() {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set(name, value, options);
                },
                remove(name: string, options: any) {
                    cookieStore.set(name, '', { ...options, maxAge: 0 });
                },
            },
        }
    );
    
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
}