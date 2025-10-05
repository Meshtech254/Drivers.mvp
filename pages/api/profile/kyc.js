import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { id, email, kyc_id_document_url, kyc_selfie_url, kyc_drivers_license_url, kyc_dob } = req.body || {}
    if (!id || !kyc_id_document_url || !kyc_selfie_url || !kyc_drivers_license_url || !kyc_dob) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        kyc_id_document_url,
        kyc_selfie_url,
        kyc_drivers_license_url,
        kyc_dob,
        kyc_status: 'pending'
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    
    // Send confirmation email
    if (email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'KYC Documents Received',
            text: 'We have received your KYC documents and will notify you when they are verified. Thank you for your patience.'
          })
        })
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Don't fail the request if email fails
      }
    }
    
    return res.status(200).json({ success: true, profile: data })
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message })
  }
}


