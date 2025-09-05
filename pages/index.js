import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="block">
                  <span className="text-blue-200">Easy</span>
                  <span className="text-green-200">Driver</span>
                  <span className="text-orange-200">Hire</span>
                </span>
                <span className="block text-white">Find Trusted Drivers Near You</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Connect with reliable drivers across Kenya. Part-time or full-time opportunities in Nairobi, Kisumu, and more.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link href="/drivers" className="btn-primary bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  Hire a Driver
                </Link>
                <Link href="/drivers/dashboard" className="btn-secondary border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  Become a Driver
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Driver</h2>
              <p className="text-lg text-gray-600">Search by location and vehicle type to find the right driver for your needs</p>
            </div>
            
            <form onSubmit={goSearch} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    value={city} 
                    onChange={e=>setCity(e.target.value)} 
                    placeholder="City (e.g., Nairobi)" 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <select value={type} onChange={e=>setType(e.target.value)} className="form-select">
                    <option value="">Any vehicle</option>
                    <option value="truck">Truck</option>
                    <option value="taxi">Taxi</option>
                    <option value="personal car">Personal car</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="btn-primary w-full">
                    Search Drivers
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EasyDriversHire?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We make it easy to connect with reliable drivers and find great opportunities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Drivers</h3>
                <p className="text-gray-600">All drivers are verified and background-checked for your safety and peace of mind.</p>
              </div>
              
              <div className="card text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Matching</h3>
                <p className="text-gray-600">Find drivers in your area quickly with our advanced search and filtering system.</p>
              </div>
              
              <div className="card text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trusted Community</h3>
                <p className="text-gray-600">Join thousands of satisfied employers and drivers who trust our platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Links for Logged-in Users */}
        {session?.user && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Dashboard</h2>
                <p className="text-lg text-gray-600">Access your personalized dashboard to manage your account</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/drivers/dashboard" className="card hover:shadow-medium transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Driver Dashboard</h3>
                      <p className="text-gray-600">Manage your driver profile and bookings</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/employer/dashboard" className="card hover:shadow-medium transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Employer Dashboard</h3>
                      <p className="text-gray-600">Manage your bookings and favorite drivers</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
