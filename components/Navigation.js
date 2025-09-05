import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Navigation() {
  const [session, setSession] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="nav-bg-gradient bg-gradient-to-r from-blue-50 to-green-50 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Driver Dashboard */}
          <div className="hidden md:flex">
            {session?.user && (
              <Link href="/drivers/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/50">
                Driver Dashboard
              </Link>
            )}
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              <span className="company-name-blue text-blue-600">Easy</span>
              <span className="company-name-green text-green-600">Driver</span>
              <span className="company-name-orange text-orange-500">Hire</span>
            </span>
          </Link>

          {/* Right Side - Navigation and Employer Dashboard */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/drivers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Browse Drivers
            </Link>
            {session?.user ? (
              <>
                <Link href="/employer/dashboard" className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/50">
                  Employer Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {session.user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link href="/auth/auth" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Sign Up / Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/drivers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Browse Drivers
              </Link>
              {session?.user ? (
                <>
                  <Link href="/drivers/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Driver Dashboard
                  </Link>
                  <Link href="/employer/dashboard" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                    Employer Dashboard
                  </Link>
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm">{session.user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/auth" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                  Sign Up / Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
