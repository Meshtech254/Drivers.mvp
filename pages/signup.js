import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [isDriver, setIsDriver] = useState(false)
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email })
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for a login link. After confirming, complete your profile.')
      router.push('/')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold">Sign up / Login</h2>
      <form onSubmit={handleSignup} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={isDriver} onChange={e=>setIsDriver(e.target.checked)} />
            <span className="ml-2">Sign up as Driver</span>
          </label>
        </div>

        <button className="px-4 py-2 bg-green-600 text-white rounded">Send Magic Link</button>
      </form>
    </div>
  )
}
