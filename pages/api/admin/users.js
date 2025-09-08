import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
	try {
		if (req.method === 'GET') {
			const { q = '', page = '1', pageSize = '20', role } = req.query || {}
			const pageNum = Math.max(parseInt(page, 10) || 1, 1)
			const size = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100)
			const from = (pageNum - 1) * size
			const to = from + size - 1

			let query = supabaseAdmin
				.from('profiles')
				.select('*', { count: 'exact' })
				.order('created_at', { ascending: false })
				.range(from, to)

			if (q) {
				// Simple ilike search over email and full_name
				query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
			}
			if (role) {
				query = query.eq('role', role)
			}

			const { data, error, count } = await query
			if (error) return res.status(500).json({ error: error.message })
			return res.status(200).json({ users: data || [], total: count || 0, page: pageNum, pageSize: size })
		}

		return res.status(405).json({ error: 'Method not allowed' })
	} catch (e) {
		return res.status(500).json({ error: 'Server error', details: e.message })
	}
}


