import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function DriverProfile() {
  const router = useRouter()
  const { id } = router.query
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (id) fetchDriver() }, [id])

  async function fetchDriver() {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) console.error(error)
    else setDriver(data)
    setLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!driver) return <div className="p-6">Driver not found</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{driver.full_name}</h2>
      {driver.photo_url && (
        <img src={driver.photo_url} alt="photo" className="mt-3 w-32 h-32 rounded object-cover" />
      )}
      <p className="mt-2">Location: {driver.location || 'N/A'}</p>
      <p>Availability: {driver.availability || 'N/A'}</p>
      <p>Vehicle: {driver.vehicle_type || 'N/A'}</p>
      <p>License: {driver.license_type || 'N/A'}</p>
      <p>Experience: {driver.years_experience} years</p>
      <p>Rate: {driver.rate}</p>
      <div className="mt-4 space-x-2">
        <Link
          href={`/book/${driver.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded">Request Booking</Link>
        <Link href="/drivers" className="px-4 py-2 border rounded">Back</Link>
      </div>
    </div>
  );
}
