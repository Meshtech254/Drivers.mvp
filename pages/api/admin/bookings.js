import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
	try {
		if (req.method === 'GET') {
			const { status, page = '1', pageSize = '20' } = req.query || {}
			const pageNum = Math.max(parseInt(page, 10) || 1, 1)
			const size = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100)
			const from = (pageNum - 1) * size
			const to = from + size - 1
			let query = supabaseAdmin.from('bookings').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
			if (status) query = query.eq('status', status)
			const { data, error, count } = await query
			if (error) return res.status(500).json({ error: error.message })
			return res.status(200).json({ bookings: data || [], total: count || 0, page: pageNum, pageSize: size })
		}
		if (req.method === 'POST') {
			const { id, status } = req.body || {}
			if (!id || !status) return res.status(400).json({ error: 'Missing id or status' })
			const { data, error } = await supabaseAdmin.from('bookings').update({ status }).eq('id', id).select().single()
			if (error) return res.status(500).json({ error: error.message })
			return res.status(200).json({ success: true, booking: data })
		}
		return res.status(405).json({ error: 'Method not allowed' })
	} catch (e) {
		return res.status(500).json({ error: 'Server error', details: e.message })
	}
}


