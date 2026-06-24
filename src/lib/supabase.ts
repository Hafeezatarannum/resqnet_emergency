import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Supabase client — single instance used across the entire app
// VITE_SUPABASE_URL  → your project base URL  (e.g. https://xyz.supabase.co)
// VITE_SUPABASE_ANON_KEY → public anon key (safe to expose in browser)
// ---------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage so users stay logged in
    persistSession: true,
    // Automatically refresh the token before it expires
    autoRefreshToken: true,
    // Detect session from URL hash after OAuth redirect
    detectSessionInUrl: true,
  },
})

// ---------------------------------------------------------------------------
// Re-export helper types for convenience throughout the app
// ---------------------------------------------------------------------------
export type { User, Session } from '@supabase/supabase-js'
