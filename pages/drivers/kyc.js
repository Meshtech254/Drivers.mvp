import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function KYC() {
  const [idFile, setIdFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [dlFile, setDlFile] = useState(null)
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

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

    // Upload Driver's License
    const dlPath = `licenses/${Date.now()}_${dlFile.name}`
    const { data: dlData, error: dlError } = await supabase.storage
      .from('kyc-docs')
      .upload(dlPath, dlFile)
    if (dlError) return setMessage('Driver\'s license upload failed: ' + dlError.message)

    // Update profile
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      setMessage('Unable to get current user.')
      setLoading(false)
      return
    }

    const resp = await fetch('/api/profile/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userData.user.id,
        email: userData.user.email,
        kyc_id_document_url: idData.path,
        kyc_selfie_url: selfieData.path,
        kyc_drivers_license_url: dlData.path,
        kyc_dob: dob
      })
    })
    const result = await resp.json().catch(() => ({ error: 'KYC API error' }))
    if (!resp.ok || result.error) {
      setMessage('Profile update failed: ' + (result.error || 'Unknown'))
      setLoading(false)
      return
    }

    setMessage('KYC submitted successfully! We have received your KYC documents and will notify you when they are verified.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID Document</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => setIdFile(e.target.files[0])} required className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Selfie</label>
            <input type="file" accept="image/*" onChange={e => setSelfieFile(e.target.files[0])} required className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Driver's License</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => setDlFile(e.target.files[0])} required className="w-full" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">{loading ? 'Submitting...' : 'Submit KYC'}</button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  )
}