import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { userId } = req.query || {}
    const supabaseAdmin = getSupabaseAdmin()
    let query = supabaseAdmin.from('reviews').select('*, reviewer:reviewer_id(email)').order('created_at', { ascending: false })
    if (userId) query = query.eq('reviewed_user_id', userId)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ reviews: data || [] })
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message })
  }
}


