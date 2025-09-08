import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminKYC() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('kyc_status', 'pending')
      .then(({ data }) => setProfiles(data || []))
  }, [])

  const handleVerify = async (id, status) => {
    await supabase.from('profiles').update({ kyc_status: status }).eq('id', id)
    setProfiles(profiles.filter(p => p.id !== id))
  }

  return (
    <div>
      <h2>KYC Requests</h2>
      {profiles.map(profile => (
        <div key={profile.id} style={{border: '1px solid #ccc', margin: 8, padding: 8}}>
          <p>User: {profile.id}</p>
          <p>DOB: {profile.kyc_dob}</p>
          <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kyc-docs/${profile.kyc_id_document_url}`} target="_blank" rel="noopener noreferrer">View ID</a><br/>
          <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kyc-docs/${profile.kyc_selfie_url}`} target="_blank" rel="noopener noreferrer">View Selfie</a><br/>
          <button onClick={() => handleVerify(profile.id, 'approved')}>Approve</button>
          <button onClick={() => handleVerify(profile.id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  )
}