// Supabase Edge Function to send KYC status emails
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'noreply@easydriverhire.com'

interface EmailRequest {
  email: string
  full_name: string
  kyc_status: string
  old_status?: string
}

serve(async (req) => {
  try {
    const { email, full_name, kyc_status, old_status }: EmailRequest = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Determine email content based on KYC status
    let subject = ''
    let html = ''
    let text = ''

    if (kyc_status === 'pending' && old_status !== 'pending') {
      // New KYC submission
      subject = 'KYC Documents Received - EasyDriverHire'
      text = `Hello ${full_name || 'there'},\n\nWe have received your KYC documents and they are currently under review. We will notify you once the verification process is complete.\n\nThank you for your patience!\n\nBest regards,\nEasyDriverHire Team`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">KYC Documents Received</h2>
          <p>Hello <strong>${full_name || 'there'}</strong>,</p>
          <p>We have received your KYC documents and they are currently under review.</p>
          <p>We will notify you once the verification process is complete.</p>
          <p>Thank you for your patience!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>EasyDriverHire Team</p>
        </div>
      `
    } else if (kyc_status === 'approved') {
      // KYC approved
      subject = 'KYC Verified Successfully - EasyDriverHire'
      text = `Hello ${full_name || 'there'},\n\nCongratulations! Your KYC has been verified successfully.\n\nYou can now access all driver features on our platform. Start accepting bookings and grow your business with us!\n\nBest regards,\nEasyDriverHire Team`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">KYC Verified Successfully ✓</h2>
          <p>Hello <strong>${full_name || 'there'}</strong>,</p>
          <p><strong>Congratulations!</strong> Your KYC has been verified successfully.</p>
          <p>You can now access all driver features on our platform. Start accepting bookings and grow your business with us!</p>
          <div style="margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://easydriverhire.com'}/drivers/dashboard" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>EasyDriverHire Team</p>
        </div>
      `
    } else if (kyc_status === 'rejected') {
      // KYC rejected
      subject = 'KYC Documents Declined - EasyDriverHire'
      text = `Hello ${full_name || 'there'},\n\nUnfortunately, your KYC documents have been declined.\n\nPlease review and upload your documents again. Make sure all documents are:\n- Clear and readable\n- Valid and not expired\n- Match the information provided\n\nYou can resubmit your documents at any time.\n\nBest regards,\nEasyDriverHire Team`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">KYC Documents Declined</h2>
          <p>Hello <strong>${full_name || 'there'}</strong>,</p>
          <p>Unfortunately, your KYC documents have been declined.</p>
          <p>Please review and upload your documents again. Make sure all documents are:</p>
          <ul style="color: #374151;">
            <li>Clear and readable</li>
            <li>Valid and not expired</li>
            <li>Match the information provided</li>
          </ul>
          <p>You can resubmit your documents at any time.</p>
          <div style="margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://easydriverhire.com'}/drivers/kyc" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Resubmit Documents
            </a>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>EasyDriverHire Team</p>
        </div>
      `
    } else {
      // No email needed for this status change
      return new Response(
        JSON.stringify({ success: true, message: 'No email sent for this status change' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Send email via Resend
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping email')
      return new Response(
        JSON.stringify({ success: true, message: 'Email skipped (no API key)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject,
        text,
        html,
      }),
    })

    if (!resendResponse.ok) {
      const error = await resendResponse.text()
      console.error('Resend API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await resendResponse.json()
    console.log('Email sent successfully:', result)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent', result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-kyc-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
