import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Middleware client creation
export const createMiddlewareClient = (req: Request, res: Response) => {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.headers.get('cookie')?.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
        },
        set(name: string, value: string, options: CookieOptions) {
          res.headers.append('Set-Cookie', `${name}=${value}; ${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('; ')}`)
        },
        remove(name: string, options: CookieOptions) {
          res.headers.append('Set-Cookie', `${name}=; max-age=0; ${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('; ')}`)
        },
      },
    }
  )
} 