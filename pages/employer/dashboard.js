import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
            <p className="text-gray-600">You need to be logged in to access the employer dashboard.</p>
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-lg text-gray-600">{session.user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/drivers" className="btn-primary text-center">
                  Browse Drivers
                </Link>
                <Link href="/drivers" className="btn-secondary text-center">
                  Find New Driver
                </Link>
              </div>
            </div>

            {/* Bookings Made */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900">Bookings Made</h3>
              </div>
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {b.profiles?.full_name?.charAt(0) || 'D'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {b.profiles?.full_name || 'Unknown Driver'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {b.profiles?.location} • {b.profiles?.vehicle_type}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-700 mb-2">{b.message}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(b.created_at).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            b.status === 'pending' ? 'status-pending' :
                            b.status === 'completed' ? 'status-completed' :
                            'status-available'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link 
                          href={`/drivers/${b.driver_id}`} 
                          className="btn-secondary text-sm px-4 py-2"
                        >
                          View Driver
                        </Link>
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
                    <p className="text-gray-600 mb-4">Start by browsing available drivers.</p>
                    <Link href="/drivers" className="btn-primary">
                      Browse Drivers
                    </Link>
                  </div>
                )}
              </div>
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
                  <span className="text-gray-600">Favorite Drivers</span>
                  <span className="font-semibold text-gray-900">{favorites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Bookings</span>
                  <span className="font-semibold text-gray-900">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Favorite Drivers */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Favorite Drivers</h3>
              </div>
              <div className="space-y-4">
                {favorites.map(f => (
                  <div key={f.driver_id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          {f.profiles?.full_name?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {f.profiles?.full_name || 'Unknown Driver'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {f.profiles?.location} • {f.profiles?.vehicle_type}
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/drivers/${f.driver_id}`} 
                      className="text-blue-600 text-sm hover:text-blue-700 font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No favorite drivers yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 3).map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Booked {b.profiles?.full_name || 'driver'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(b.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-center py-4 text-sm">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}


