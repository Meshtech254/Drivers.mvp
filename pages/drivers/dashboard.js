import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function DriverDashboard() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isAvailable, setIsAvailable] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user?.id) {
        loadProfile(data.session.user.id)
        loadBookings(data.session.user.id)
      }
    })
  }, [])

  async function loadProfile(id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setProfile(data)
    setIsAvailable(!!data?.is_available)
  }

  async function loadBookings(id) {
    const { data } = await supabase.from('bookings').select('*').eq('driver_id', id).order('created_at', { ascending: false })
    setBookings(data || [])
  }

  async function toggleAvailability() {
    const next = !isAvailable
    setIsAvailable(next)
    await fetch('/api/drivers/toggle-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.user.id, is_available: next })
    })
    loadProfile(session.user.id)
  }

  async function saveProfile(e) {
    e.preventDefault()
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
    await fetch('/api/drivers/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.user.id, updates })
    })
    loadProfile(session.user.id)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !session?.user?.id) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${session.user.id}/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('driver-photos').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: pub } = supabase.storage.from('driver-photos').getPublicUrl(path)
      const photoUrl = pub.publicUrl
      setPhotoPreview(photoUrl)
      await fetch('/api/drivers/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: session.user.id, updates: { photo_url: photoUrl } })
      })
      loadProfile(session.user.id)
    } catch (err) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!session) return <div className="p-6">Please log in.</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Driver Dashboard</h2>
      <div className="mt-2 text-gray-600">{session.user.email}</div>

      <div className="mt-6 p-4 border rounded">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Availability</h3>
          <button onClick={toggleAvailability} className={`px-3 py-1 rounded text-white ${isAvailable ? 'bg-green-600' : 'bg-gray-500'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">Profile Photo</h3>
        <div className="flex items-center gap-3">
          <img src={photoPreview || profile?.photo_url || 'https://via.placeholder.com/96'} alt="photo" className="w-24 h-24 rounded object-cover" />
          <div>
            <input type="text" name="photo_url" defaultValue={profile?.photo_url || ''} placeholder="Photo URL" className="border p-2 rounded w-64" />
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="mt-6 p-4 border rounded grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="full_name" defaultValue={profile?.full_name || ''} placeholder="Full name" className="border p-2 rounded" />
        <input name="location" defaultValue={profile?.location || ''} placeholder="Location (e.g., Nairobi)" className="border p-2 rounded" />
        <select name="availability" defaultValue={profile?.availability || ''} className="border p-2 rounded">
          <option value="">Select availability</option>
          <option value="part-time">Part-time</option>
          <option value="full-time">Full-time</option>
        </select>
        <input name="years_experience" defaultValue={profile?.years_experience || ''} placeholder="Years of experience" className="border p-2 rounded" />
        <input name="rate" defaultValue={profile?.rate || ''} placeholder="Rate (e.g., Ksh 2,000/day)" className="border p-2 rounded" />
        <select name="vehicle_type" defaultValue={profile?.vehicle_type || ''} className="border p-2 rounded">
          <option value="">Vehicle type</option>
          <option value="truck">Truck</option>
          <option value="taxi">Taxi</option>
          <option value="personal car">Personal car</option>
        </select>
        <input name="license_type" defaultValue={profile?.license_type || ''} placeholder="License type (e.g., BCE)" className="border p-2 rounded" />
        <div className="md:col-span-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Profile</button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Bookings Received</h3>
        <ul className="space-y-3">
          {bookings.map(b => (
            <li key={b.id} className="p-3 border rounded">
              <div className="font-medium">{b.client_name} &lt;{b.client_email}&gt;</div>
              <div className="text-sm text-gray-600">{b.client_phone}</div>
              <div className="text-sm">{b.message}</div>
              <div className="text-xs text-gray-500">{new Date(b.created_at).toLocaleString()} • {b.status}</div>
            </li>
          ))}
          {bookings.length === 0 && (<li className="text-sm text-gray-500">No bookings yet.</li>)}
        </ul>
      </div>
    </div>
  )
}


