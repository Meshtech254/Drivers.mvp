import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { reviewer_id, reviewed_user_id, booking_id, rating, comment } = req.body || {}
    if (!reviewer_id || !reviewed_user_id || !rating) return res.status(400).json({ error: 'Missing fields' })
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({ reviewer_id, reviewed_user_id, booking_id: booking_id || null, rating, comment })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, review: data })
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message })
  }
}


