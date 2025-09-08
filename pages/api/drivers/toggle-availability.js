import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id, is_available } = req.body || {}
  if (!id || typeof is_available !== 'boolean') return res.status(400).json({ error: 'Missing id or is_available' })
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.from('profiles').update({ is_available }).eq('id', id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ profile: data })
}


