import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function AdminKYC() {
  const [profiles, setProfiles] = useState([])
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(true) // Temporarily open access

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      // Bypass admin check for preview
      setIsAdmin(true)
      supabase
        .from('profiles')
        .select('*')
        .eq('kyc_status', 'pending')
        .then(({ data }) => setProfiles(data || []))
    })
  }, [])

  const handleVerify = async (id, status) => {
    await supabase.from('profiles').update({ kyc_status: status }).eq('id', id)
    
    // Send email notification
    try {
      const { data: userProfile } = await supabase.from('profiles').select('email').eq('id', id).single()
      const to = userProfile?.email
      if (to) {
        let subject, text
        if (status === 'approved') {
          subject = 'KYC Verified Successfully'
          text = 'Congratulations! Your KYC has been verified successfully. You can now access all driver features on our platform.'
        } else if (status === 'rejected') {
          subject = 'KYC Documents Declined'
          text = 'Your KYC documents have been declined. Please review and upload your documents again. Make sure all documents are clear and valid.'
        } else {
          subject = 'KYC Status Update'
          text = 'Your KYC status has been updated.'
        }
        
        await fetch('/api/notifications/send-email', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ to, subject, text }) 
        })
      }
    } catch (e) {
      console.error('Email notification failed:', e)
    }
    
    setProfiles(profiles.filter(p => p.id !== id))
  }

  // Open access: no gating while you review

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">KYC Requests</h2>
        <div className="space-y-4">
          {profiles.map(profile => (
            <div key={profile.id} className="p-4 bg-white border rounded-lg">
              <p className="font-medium">User: {profile.full_name || profile.id}</p>
              <p className="text-sm text-gray-600">Email: {profile.email}</p>
              <p className="text-sm text-gray-700">DOB: {profile.kyc_dob}</p>
              <div className="mt-3 space-y-2">
                <div>
                  <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kyc-docs/${profile.kyc_id_document_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View ID Document</a>
                </div>
                <div>
                  <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kyc-docs/${profile.kyc_selfie_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Selfie</a>
                </div>
                <div>
                  <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kyc-docs/${profile.kyc_drivers_license_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Driver's License</a>
                </div>
              </div>
              <div className="mt-4 space-x-2">
                <button onClick={() => handleVerify(profile.id, 'approved')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                <button onClick={() => handleVerify(profile.id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Decline</button>
              </div>
            </div>
          ))}
          {profiles.length === 0 && (
            <p className="text-gray-600">No pending KYC requests.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}