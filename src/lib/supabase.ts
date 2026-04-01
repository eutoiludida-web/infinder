import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Browser client — uses anon key, respects RLS
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Admin client — bypasses RLS, server-side only (lazy init to avoid build errors)
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )
  }
  return _supabaseAdmin
}
