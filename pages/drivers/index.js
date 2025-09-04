import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function DriversList() {
  const [drivers, setDrivers] = useState([])

  useEffect(() => { fetchDrivers() }, [])

  async function fetchDrivers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_driver', true)
      .eq('is_approved', true)
    if (error) console.error(error)
    else setDrivers(data || [])
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold">Available Drivers</h2>
      <ul className="mt-4 space-y-4">
        {drivers.map(d => (
          <li key={d.id} className="p-4 border rounded">
            <h3 className="font-semibold">{d.full_name || 'Unnamed'}</h3>
            <p>Experience: {d.years_experience || 0} years</p>
            <p>Rate: {d.rate || 'Negotiable'}</p>
            <Link href={`/drivers/${d.id}`}><a className="text-blue-600">View profile</a></Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
