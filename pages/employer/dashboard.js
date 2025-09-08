import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function EmployerDashboard() {
  const [session, setSession] = useState(null)
  const [bookings, setBookings] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewBooking, setReviewBooking] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user?.id) {
        loadBookings(data.session.user.id)
        loadFavorites(data.session.user.id)
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
                        {b.status === 'completed' && (
                          <button
                            onClick={() => { setReviewBooking(b); setShowReview(true); setRating(5); setComment(''); setReviewMsg('') }}
                            className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                          >
                            Leave a Review
                          </button>
                        )}
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
      
      {/* Review Modal */}
      {showReview && reviewBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <label className="block text-sm font-medium mb-1">Comment (optional)</label>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength={1000} className="w-full border rounded px-3 py-2 mb-3" placeholder="Share feedback (max 250 words)" />
            <div className="flex justify-end gap-2">
              <button onClick={()=>{setShowReview(false); setReviewBooking(null)}} className="px-3 py-2 border rounded">Cancel</button>
              <button
                onClick={async ()=>{
                  const uid = session?.user?.id
                  if (!uid) { setReviewMsg('Please log in.'); return }
                  const resp = await fetch('/api/reviews/create', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewer_id: uid, reviewed_user_id: reviewBooking.driver_id, booking_id: reviewBooking.id, rating, comment })
                  })
                  if (resp.ok) {
                    setReviewMsg('✅ Thank you for your feedback. Your review helps build trust.')
                    setTimeout(()=>{ setShowReview(false); setReviewBooking(null); setReviewMsg('') }, 1200)
                  } else {
                    setReviewMsg('Could not submit review. Try again later.')
                  }
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >Submit</button>
            </div>
            {reviewMsg && <p className="text-sm mt-2">{reviewMsg}</p>}
          </div>
        </div>
      )}

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

      <Footer />
    </div>
  )
}


