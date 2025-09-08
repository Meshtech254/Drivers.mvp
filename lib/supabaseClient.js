import { createClient } from '@supabase/supabase-js'

let cachedClient = null

export function getSupabaseClient() {
  if (cachedClient) return cachedClient
  if (typeof window === 'undefined') {
    return null
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env not set in client')
    return null
  }
  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'supabase.auth.token'
    }
  })
  return cachedClient
}

export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null