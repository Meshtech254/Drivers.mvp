import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
	try {
		const { id, is_approved, is_available, role } = req.body || {}
		if (!id) return res.status(400).json({ error: 'Missing user id' })
		const updates = {}
		if (typeof is_approved === 'boolean') updates.is_approved = is_approved
		if (typeof is_available === 'boolean') updates.is_available = is_available
		if (role) updates.role = role
		const { data, error } = await supabaseAdmin.from('profiles').update(updates).eq('id', id).select().single()
		if (error) return res.status(500).json({ error: error.message })
		return res.status(200).json({ success: true, profile: data })
	} catch (e) {
		return res.status(500).json({ error: 'Server error', details: e.message })
	}
}


