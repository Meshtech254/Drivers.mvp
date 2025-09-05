import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Approve all drivers who are not yet approved
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_approved: true,
        is_available: true 
      })
      .eq('is_driver', true)
      .eq('is_approved', false)
      .select()

    if (error) {
      console.error('Error approving users:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ 
      success: true, 
      message: `Approved ${data?.length || 0} drivers`,
      approvedUsers: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    })
  }
}
