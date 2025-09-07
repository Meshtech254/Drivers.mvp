import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function KYC() {
  const [idFile, setIdFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Upload ID
    const idPath = `ids/${Date.now()}_${idFile.name}`
    const { data: idData, error: idError } = await supabase.storage
      .from('kyc-docs')
      .upload(idPath, idFile)
    if (idError) return setMessage('ID upload failed: ' + idError.message)

    // Upload Selfie
    const selfiePath = `selfies/${Date.now()}_${selfieFile.name}`
    const { data: selfieData, error: selfieError } = await supabase.storage
      .from('kyc-docs')
      .upload(selfiePath, selfieFile)
    if (selfieError) return setMessage('Selfie upload failed: ' + selfieError.message)

    // Update profile
    const user = supabase.auth.getUser()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        kyc_id_document_url: idData.path,
        kyc_selfie_url: selfieData.path,
        kyc_dob: dob,
        kyc_status: 'pending'
      })
      .eq('id', (await user).data.user.id)
    if (updateError) return setMessage('Profile update failed: ' + updateError.message)

    setMessage('KYC submitted! Await admin approval.')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>KYC Verification</h2>
      <label>Date of Birth:</label>
      <input type="date" value={dob} onChange={e => setDob(e.target.value)} required />
      <label>Upload ID Document:</label>
      <input type="file" accept="image/*,application/pdf" onChange={e => setIdFile(e.target.files[0])} required />
      <label>Upload Selfie:</label>
      <input type="file" accept="image/*" onChange={e => setSelfieFile(e.target.files[0])} required />
      <button type="submit" disabled={loading}>Submit KYC</button>
      <p>{message}</p>
    </form>
  )
}