import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { id, kyc_id_document_url, kyc_selfie_url, kyc_dob } = req.body || {}
    if (!id || !kyc_id_document_url || !kyc_selfie_url || !kyc_dob) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        kyc_id_document_url,
        kyc_selfie_url,
        kyc_dob,
        kyc_status: 'pending'
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, profile: data })
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message })
  }
}


