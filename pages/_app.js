import '../styles/globals.css'
import { supabase } from '../lib/supabaseClient'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    let unsub = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = session.user
        let role = user.user_metadata?.role || null
        if (!role && typeof window !== 'undefined') {
          role = window.localStorage.getItem('selected_role') || null
        }
        const email = user.email
        await fetch('/api/profile/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, email, role })
        })
      }
    })
    return () => {
      try { unsub?.data?.subscription?.unsubscribe?.() } catch (e) {}
    }
  }, [])

  return <Component {...pageProps} supabase={supabase} />
}
