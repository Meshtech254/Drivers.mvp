import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function EmployerDashboard() {
  const [session, setSession] = useState(null)
  const [bookings, setBookings] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user?.id) {
        loadBookings(data.session.user.id)
        loadFavorites(data.session.user.id)
      }
    })
  }, [])

  async function loadBookings(id) {
    const { data } = await supabase.from('bookings').select('*, profiles:driver_id(full_name, location, vehicle_type)').eq('employer_id', id).order('created_at', { ascending: false })
    setBookings(data || [])
  }

  async function loadFavorites(id) {
    const { data } = await supabase.from('favorites').select('driver_id, profiles:driver_id(full_name, location, vehicle_type)').eq('employer_id', id)
    setFavorites(data || [])
  }

  if (!session) return <div className="p-6">Please log in.</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Employer Dashboard</h2>
      <div className="mt-2 text-gray-600">{session.user.email}</div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Bookings Made</h3>
        <ul className="space-y-3">
          {bookings.map(b => (
            <li key={b.id} className="p-3 border rounded">
              <div className="font-medium">Driver: {b.profiles?.full_name || b.driver_id}</div>
              <div className="text-sm">Message: {b.message}</div>
              <div className="text-xs text-gray-500">{new Date(b.created_at).toLocaleString()} • {b.status}</div>
              <Link href={`/drivers/${b.driver_id}`} className="text-blue-600 text-sm">View driver</Link>
            </li>
          ))}
          {bookings.length === 0 && (<li className="text-sm text-gray-500">No bookings yet.</li>)}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Favorite Drivers</h3>
        <ul className="space-y-3">
          {favorites.map(f => (
            <li key={f.driver_id} className="p-3 border rounded">
              <div className="font-medium">{f.profiles?.full_name || f.driver_id}</div>
              <div className="text-sm text-gray-600">{f.profiles?.location} • {f.profiles?.vehicle_type}</div>
              <Link href={`/drivers/${f.driver_id}`} className="text-blue-600 text-sm">View driver</Link>
            </li>
          ))}
          {favorites.length === 0 && (<li className="text-sm text-gray-500">No favorites yet.</li>)}
        </ul>
      </div>
    </div>
  )
}


