import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// This client should ONLY be used in server-side contexts
// NEVER expose this client in the browser
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
); 