import '../styles/globals.css'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setLoading(false)
      
      if (session?.user) {
        const user = session.user
        let role = user.user_metadata?.role || null
        if (!role && typeof window !== 'undefined') {
          role = window.localStorage.getItem('selected_role') || null
        }
        const email = user.email
        
        try {
          await fetch('/api/profile/upsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id, email, role })
          })
        } catch (error) {
          console.error('Error upserting profile:', error)
        }
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <Component {...pageProps} supabase={supabase} session={session} />
}
