import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [session, setSession] = useState(null)
  useEffect(()=>{ supabase.auth.getSession().then(({ data }) => setSession(data.session)) }, [])

  function goSearch(e){
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('location', city)
    if (type) params.set('vehicle_type', type)
    window.location.href = `/drivers?${params.toString()}`
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold tracking-tight">EasyDriversHire</h1>
          <nav className="flex items-center gap-6 text-gray-700">
            <Link href="/drivers" className="hover:text-gray-900">Browse</Link>
            <Link href="/auth/auth" className="hover:text-gray-900">Sign Up / Login</Link>
          </nav>
        </header>
      </div>

      <main className="mx-auto max-w-7xl px-6">
        <section className="min-h-[70vh] rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-100 border flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find trusted drivers near you.</h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed">Part-time or full-time • Nairobi, Kisumu, and more</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/drivers" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Hire a Driver</Link>
            <Link href="/drivers/dashboard" className="px-6 py-3 border rounded-lg hover:bg-white/60">Become a Driver</Link>
          </div>
          <form onSubmit={goSearch} className="mt-8 w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City (e.g., Nairobi)" className="flex-1 border p-3 rounded-lg" />
              <select value={type} onChange={e=>setType(e.target.value)} className="flex-1 border p-3 rounded-lg">
                <option value="">Any vehicle</option>
                <option value="truck">Truck</option>
                <option value="taxi">Taxi</option>
                <option value="personal car">Personal car</option>
              </select>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Search</button>
            </div>
          </form>
        </section>

        {session?.user && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/drivers/dashboard" className="p-6 border rounded-2xl hover:shadow bg-white">Driver Dashboard</Link>
            <Link href="/employer/dashboard" className="p-6 border rounded-2xl hover:shadow bg-white">Employer Dashboard</Link>
          </div>
        )}
      </main>
    </div>
  );
}
