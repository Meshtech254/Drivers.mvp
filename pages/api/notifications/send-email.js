export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { to, subject, text } = req.body || {}
    if (!to || !subject || !text) return res.status(400).json({ error: 'Missing fields' })
    const resendApiKey = process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM || 'noreply@easydriverhire.com'
    if (!resendApiKey) return res.status(200).json({ success: true, note: 'RESEND_API_KEY not set; skipped' })
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: emailFrom, to: Array.isArray(to) ? to : [to], subject, text })
    })
    if (!resp.ok) {
      const err = await resp.text()
      return res.status(200).json({ success: false, error: err })
    }
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message })
  }
}


