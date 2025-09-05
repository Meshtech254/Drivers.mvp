import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id, updates } = req.body || {}
  if (!id || !updates) return res.status(400).json({ error: 'Missing id or updates' })
  const { data, error } = await supabaseAdmin.from('profiles').update(updates).eq('id', id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ profile: data })
}


