import '../styles/globals.css'
import { supabase } from '../lib/supabaseClient'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} supabase={supabase} />
}
