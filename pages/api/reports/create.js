import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { reporter_id, reported_user_id, reason, details } = req.body || {}
    if (!reporter_id || !reported_user_id || !reason) return res.status(400).json({ error: 'Missing fields' })
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.from('reports').insert({ reporter_id, reported_user_id, reason, details }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, report: data })
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message })
  }
}


