import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id, email, role } = req.body || {}
  if (!id || !email) return res.status(400).json({ error: 'Missing id or email' })

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const isDriver = role === 'driver'
    const profile = {
      id,
      email,
      role: role || null,
      is_driver: isDriver,
      is_approved: isDriver, // Auto-approve drivers for now
      is_available: isDriver, // Make drivers available by default
    }
    const { data, error } = await supabaseAdmin.from('profiles').upsert(profile).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ profile: data })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}


