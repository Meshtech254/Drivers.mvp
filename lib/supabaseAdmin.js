import { createClient } from '@supabase/supabase-js'

let cachedAdminClient = null

export function getSupabaseAdmin() {
  if (cachedAdminClient) return cachedAdminClient
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
  }
  cachedAdminClient = createClient(supabaseUrl, serviceRoleKey)
  return cachedAdminClient
}
