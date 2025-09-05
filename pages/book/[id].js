import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function BookPage() {
  const router = useRouter()
  const { id } = router.query
  const [driver, setDriver] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [session, setSession] = useState(null)

  useEffect(() => { if (id) fetchDriver() }, [id])
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setSession(data.session)) }, [])

  async function fetchDriver() {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setDriver(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: id, client_name: name, client_email: email, client_phone: phone, message, employer_id: session?.user?.id || null })
    })
    const json = await res.json()
    if (res.ok) {
      alert('Booking request sent. Driver will receive an email with your details.')
      router.push('/drivers')
    } else {
      alert('Error: ' + (json.error || 'Unknown'))
    }
  }

  if (!driver) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold">Request Booking: {driver.full_name}</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm">Your name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm">Your email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm">Phone</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm">Message / Request details</label>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Send Booking Request</button>
      </form>
    </div>
  )
}
