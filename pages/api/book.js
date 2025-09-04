import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { driver_id, client_name, client_email, client_phone, message } = req.body
  if (!driver_id || !client_name || !client_email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Save booking to Supabase
    const { data: booking, error: insertErr } = await supabaseAdmin
      .from('bookings')
      .insert([{
        driver_id,
        client_name,
        client_email,
        client_phone,
        message,
        status: 'requested'
      }])
      .select()
      .single()

    if (insertErr) {
      console.error('Insert error', insertErr)
      return res.status(500).json({ error: 'Could not create booking' })
    }

    // Fetch driver contact (email) and name
    const { data: driver } = await supabaseAdmin.from('profiles').select('*').eq('id', driver_id).single()
    if (!driver) return res.status(404).json({ error: 'Driver not found' })

    // Prepare email payload using Resend API
    const resendApiKey = process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM || 'noreply@drivers.com'

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set - skipping email send in dev')
      return res.status(200).json({ booking })
    }

    const emailBody = `Hello ${driver.full_name || 'Driver'},\n\nYou have a new booking request on Drivers.com:\n\nClient Name: ${client_name}\nEmail: ${client_email}\nPhone: ${client_phone || 'N/A'}\nMessage: ${message || 'N/A'}\n\nPlease reach out to the client directly to confirm the booking.`

    const payload = {
      from: emailFrom,
      to: [driver.email || driver.contact_email || driver.client_email || client_email],
      subject: 'New Booking Request on Drivers.com',
      text: emailBody
    }

    // Call Resend API
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text
      })
    })

    if (!resp.ok) {
      const errText = await resp.text()
      console.error('Resend error', errText)
      // still return success for booking creation, but warn caller
      return res.status(200).json({ booking, emailSent: false, resendError: errText })
    }

    return res.status(200).json({ booking, emailSent: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
