import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function DriversList() {
  const [drivers, setDrivers] = useState([])
  const [location, setLocation] = useState('')
  const [availability, setAvailability] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [search, setSearch] = useState('')
  const [session, setSession] = useState(null)

  useEffect(() => { supabase.auth.getSession().then(({ data }) => setSession(data.session)) }, [])

  useEffect(() => { fetchDrivers() }, [location, availability, vehicleType, search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const qsLoc = url.searchParams.get('location') || ''
      const qsType = url.searchParams.get('vehicle_type') || ''
      if (qsLoc) setLocation(qsLoc)
      if (qsType) setVehicleType(qsType)
    }
  }, [])

  async function fetchDrivers() {
    let query = supabase.from('profiles').select('*')
      .eq('is_driver', true)
      .eq('is_approved', true)
      .eq('is_available', true)

    if (location) query = query.ilike('location', `%${location}%`)
    if (availability) query = query.eq('availability', availability)
    if (vehicleType) query = query.eq('vehicle_type', vehicleType)
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)

    const { data, error } = await query
    if (error) console.error(error)
    else setDrivers(data || [])
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold">Available Drivers</h2>
      {session?.user && (
        <div className="text-sm text-gray-600 mt-1">Logged in as {session.user.email}</div>
      )}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} className="border p-2 rounded" />
        <select value={availability} onChange={e=>setAvailability(e.target.value)} className="border p-2 rounded">
          <option value="">Any availability</option>
          <option value="part-time">Part-time</option>
          <option value="full-time">Full-time</option>
        </select>
        <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} className="border p-2 rounded">
          <option value="">Any vehicle</option>
          <option value="truck">Truck</option>
          <option value="taxi">Taxi</option>
          <option value="personal car">Personal car</option>
        </select>
        <input placeholder="Search name/email" value={search} onChange={e=>setSearch(e.target.value)} className="border p-2 rounded" />
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drivers.map(d => (
            <div key={d.id} className="p-4 border rounded flex flex-col">
              <div className="flex items-center gap-3">
                <img src={d.photo_url || 'https://via.placeholder.com/64'} alt="photo" className="w-16 h-16 rounded object-cover" />
                <div>
                  <h3 className="font-semibold">{d.full_name || 'Unnamed'}</h3>
                  <div className="text-sm text-gray-600">{d.location || 'N/A'} • {d.vehicle_type || 'N/A'}</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div>Availability: {d.availability || 'N/A'}</div>
                <div>Experience: {d.years_experience || 0} years</div>
                <div>Rate: {d.rate || 'Negotiable'}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/drivers/${d.id}`} className="px-3 py-2 border rounded">View Profile</Link>
                <Link href={`/book/${d.id}`} className="px-3 py-2 bg-blue-600 text-white rounded">Hire Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
