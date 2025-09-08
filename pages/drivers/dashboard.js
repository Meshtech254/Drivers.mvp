import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function DriverDashboard() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isAvailable, setIsAvailable] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [kycStatus, setKycStatus] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user?.id) {
        loadProfile(data.session.user.id)
        loadBookings(data.session.user.id)
      }
    })
  }, [])

  // Feedback popup after 7 days
  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = 'edh_first_seen'
    const now = Date.now()
    const stored = window.localStorage.getItem(key)
    if (!stored) {
      window.localStorage.setItem(key, String(now))
      return
    }
    const elapsed = now - Number(stored)
    if (elapsed > 7 * 24 * 60 * 60 * 1000) {
      setShowFeedback(true)
    }
  }, [])

  async function loadProfile(id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setProfile(data)
    setIsAvailable(!!data?.is_available)
    setKycStatus(data?.kyc_status || '')
  }

  async function loadBookings(id) {
    const { data } = await supabase.from('bookings').select('*').eq('driver_id', id).order('created_at', { ascending: false })
    setBookings(data || [])
  }

  async function toggleAvailability() {
    const next = !isAvailable
    setIsAvailable(next)
    try {
    await fetch('/api/drivers/toggle-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.user.id, is_available: next })
    })
      // Don't reload profile immediately to prevent state reset
      // loadProfile(session.user.id)
    } catch (error) {
      console.error('Error toggling availability:', error)
      // Revert state on error
      setIsAvailable(!next)
    }
  }

  async function saveProfile(e) {
    e.preventDefault()
    setSaveMessage('Saving profile...')
    
    const updates = {
      full_name: e.target.full_name.value,
      photo_url: e.target.photo_url.value,
      location: e.target.location.value,
      availability: e.target.availability.value,
      years_experience: parseInt(e.target.years_experience.value || '0', 10),
      rate: e.target.rate.value,
      vehicle_type: e.target.vehicle_type.value,
      license_type: e.target.license_type.value
    }
    
    try {
      const response = await fetch('/api/drivers/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: session.user.id, updates })
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setSaveMessage('Profile saved successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
        loadProfile(session.user.id)
      } else {
        console.error('API Error:', result)
        setSaveMessage(result.error || 'Error saving profile. Please try again.')
        setTimeout(() => setSaveMessage(''), 5000)
      }
    } catch (error) {
      console.error('Network Error:', error)
      setSaveMessage('Network error. Please check your connection and try again.')
      setTimeout(() => setSaveMessage(''), 5000)
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !session?.user?.id) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveMessage('Please select an image file (JPG, PNG, etc.)')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('File size must be less than 5MB')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }
    
    setUploading(true)
    setSaveMessage('Uploading image...')
    
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${session.user.id}_${Date.now()}.${ext}`
      const path = `driver-photos/${fileName}`
      
      console.log('Uploading file:', fileName, 'to path:', path)
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('driver-photos')
        .upload(path, file, { 
          upsert: true,
          cacheControl: '3600'
        })
        
      if (error) {
        console.error('Upload error:', error)
        
        // Check if it's a bucket not found error
        if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
          setSaveMessage('Storage bucket not configured. Please contact support.')
          setTimeout(() => setSaveMessage(''), 5000)
          return
        }
        
        throw new Error(`Upload failed: ${error.message}`)
      }
      
      console.log('Upload successful:', data)
      
      // Get public URL
      const { data: pubData } = supabase.storage
        .from('driver-photos')
        .getPublicUrl(path)
      
      const photoUrl = pubData.publicUrl
      console.log('Public URL:', photoUrl)
      setPhotoPreview(photoUrl)
      
      // Update profile with new photo URL
      const response = await fetch('/api/drivers/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: session.user.id, 
          updates: { photo_url: photoUrl } 
        })
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setSaveMessage('Photo uploaded successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
        loadProfile(session.user.id)
      } else {
        throw new Error(result.error || 'Failed to update profile with new photo')
      }
      
    } catch (err) {
      console.error('Upload error:', err)
      setSaveMessage(`Upload failed: ${err.message}`)
      setTimeout(() => setSaveMessage(''), 5000)
    } finally {
      setUploading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
            <p className="text-gray-600">You need to be logged in to access the driver dashboard.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
          <p className="text-lg text-gray-600">{session.user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* KYC Status */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900">KYC</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Status: {kycStatus || 'not submitted'}</p>
                  <p className="text-sm text-gray-500">Submit your ID and selfie for verification</p>
                </div>
                <a href="/drivers/kyc" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Open KYC</a>
              </div>
            </div>
            {/* Availability Status */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900">Availability Status</h3>
              </div>
        <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Current status</p>
                  <p className="text-sm text-gray-500">Toggle your availability for new bookings</p>
                </div>
                <button 
                  onClick={toggleAvailability} 
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isAvailable 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
            {isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>
      </div>

            {/* Profile Photo */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900">Profile Photo</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={photoPreview || profile?.photo_url || 'https://via.placeholder.com/120'} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200" 
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                    <input 
                      type="text" 
                      name="photo_url" 
                      defaultValue={profile?.photo_url || ''} 
                      placeholder="Enter photo URL" 
                      className="form-input" 
                    />
                  </div>
          <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUpload} 
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
            </div>
          </div>
        </div>
      </div>

            {/* Profile Form */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                {saveMessage && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                    saveMessage.includes('successfully') 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {saveMessage}
                  </div>
                )}
              </div>
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      name="full_name" 
                      defaultValue={profile?.full_name || ''} 
                      placeholder="Enter your full name" 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      name="location" 
                      defaultValue={profile?.location || ''} 
                      placeholder="e.g., Nairobi" 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select name="availability" defaultValue={profile?.availability || ''} className="form-select">
          <option value="">Select availability</option>
          <option value="part-time">Part-time</option>
          <option value="full-time">Full-time</option>
        </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input 
                      name="years_experience" 
                      type="number"
                      defaultValue={profile?.years_experience || ''} 
                      placeholder="0" 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                    <input 
                      name="rate" 
                      defaultValue={profile?.rate || ''} 
                      placeholder="e.g., Ksh 2,000/day" 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select name="vehicle_type" defaultValue={profile?.vehicle_type || ''} className="form-select">
                      <option value="">Select vehicle type</option>
          <option value="truck">Truck</option>
          <option value="taxi">Taxi</option>
          <option value="personal car">Personal car</option>
        </select>
                  </div>
        <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
                    <input 
                      name="license_type" 
                      defaultValue={profile?.license_type || ''} 
                      placeholder="e.g., BCE" 
                      className="form-input" 
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Save Profile
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold text-gray-900">{bookings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isAvailable ? 'status-available' : 'status-unavailable'
                  }`}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-gray-900">{profile?.years_experience || 0} years</span>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="space-y-4">
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{b.client_name}</div>
                    <div className="text-sm text-gray-600">{b.client_email}</div>
                    <div className="text-sm text-gray-500 mt-1">{b.message}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.status === 'pending' ? 'status-pending' :
                        b.status === 'completed' ? 'status-completed' :
                        'status-available'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(b.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Bookings */}
        <div className="mt-12">
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">All Bookings</h3>
            </div>
            <div className="space-y-4">
          {bookings.map(b => (
                <div key={b.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{b.client_name}</div>
                      <div className="text-sm text-gray-600">{b.client_email}</div>
                      <div className="text-sm text-gray-500">{b.client_phone}</div>
                      <div className="text-gray-700 mt-2">{b.message}</div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        b.status === 'pending' ? 'status-pending' :
                        b.status === 'completed' ? 'status-completed' :
                        'status-available'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(b.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">When you receive bookings, they'll appear here.</p>
                </div>
              )}
            </div>
          </div>
      </div>
      </main>
      
      <Footer />
      {/* 7-day Feedback Popup */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2">How is EasyDriverHire so far?</h3>
            <p className="text-gray-600 mb-4">We'd love your feedback to improve the platform.</p>
            <a href="https://forms.gle/J3MPWRbNRcE9gEyd9" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block mb-3">Give Feedback</a>
            <div className="flex justify-center gap-2">
              <button onClick={()=>setShowFeedback(false)} className="px-3 py-2 border rounded">Maybe later</button>
              <button onClick={()=>{ setShowFeedback(false); localStorage.setItem('edh_first_seen', String(Date.now())); }} className="px-3 py-2 bg-gray-800 text-white rounded">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


