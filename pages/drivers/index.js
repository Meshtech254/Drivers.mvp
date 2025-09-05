import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function DriversList() {
  const [drivers, setDrivers] = useState([])
  const [location, setLocation] = useState('')
  const [availability, setAvailability] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [search, setSearch] = useState('')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { supabase.auth.getSession().then(({ data }) => setSession(data.session)) }, [])

  useEffect(() => { 
    setLoading(true)
    fetchDrivers().finally(() => setLoading(false))
  }, [location, availability, vehicleType, search])

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Available Drivers</h1>
          <p className="text-lg text-gray-600">Find the perfect driver for your needs</p>
          {session?.user && (
            <div className="text-sm text-gray-500 mt-2">Logged in as {session.user.email}</div>
          )}
        </div>

        {/* Search Filters */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                placeholder="e.g., Nairobi" 
                value={location} 
                onChange={e=>setLocation(e.target.value)} 
                className="form-input" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select value={availability} onChange={e=>setAvailability(e.target.value)} className="form-select">
                <option value="">Any availability</option>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} className="form-select">
                <option value="">Any vehicle</option>
                <option value="truck">Truck</option>
                <option value="taxi">Taxi</option>
                <option value="personal car">Personal car</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input 
                placeholder="Name or email" 
                value={search} 
                onChange={e=>setSearch(e.target.value)} 
                className="form-input" 
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Searching...' : `${drivers.length} drivers found`}
            </h2>
            {drivers.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {drivers.length} result{drivers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Drivers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : drivers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map(d => (
              <div key={d.id} className="card hover:shadow-medium transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={d.photo_url || 'https://via.placeholder.com/64'} 
                    alt="Driver photo" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" 
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {d.full_name || 'Unnamed Driver'}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {d.location || 'N/A'} • {d.vehicle_type || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Availability:</span> {d.availability || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {d.years_experience || 0} years
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Rate:</span> {d.rate || 'Negotiable'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    href={`/drivers/${d.id}`} 
                    className="btn-secondary flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link 
                    href={`/book/${d.id}`} 
                    className="btn-primary flex-1 text-center"
                  >
                    Hire Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later.</p>
            <button 
              onClick={() => {
                setLocation('')
                setAvailability('')
                setVehicleType('')
                setSearch('')
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
