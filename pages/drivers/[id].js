import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function DriverProfile() {
  const router = useRouter()
  const { id } = router.query
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState('Fraud / Fake profile')
  const [reportDetails, setReportDetails] = useState('')
  const [reportMsg, setReportMsg] = useState('')
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)

  useEffect(() => { if (id) { fetchDriver(); fetchReviews(); } }, [id])

  async function fetchDriver() {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) console.error(error)
    else setDriver(data)
    setLoading(false)
  }

  async function fetchReviews() {
    const res = await fetch(`/api/reviews/list?userId=${id}`)
    const d = await res.json()
    const list = d.reviews || []
    setReviews(list)
    if (list.length) {
      const avg = list.reduce((a, b) => a + (b.rating || 0), 0) / list.length
      setAvgRating(avg)
    } else setAvgRating(null)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!driver) return <div className="p-6">Driver not found</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">{driver.full_name}</h2>
      {driver.photo_url && (
        <img src={driver.photo_url} alt="photo" className="mt-3 w-32 h-32 rounded object-cover" />
      )}
      <p className="mt-2">Location: {driver.location || 'N/A'}</p>
      <p>Availability: {driver.availability || 'N/A'}</p>
      <p>Vehicle: {driver.vehicle_type || 'N/A'}</p>
      <p>License: {driver.license_type || 'N/A'}</p>
      <p>Experience: {driver.years_experience} years</p>
      <p>Rate: {driver.rate}</p>
      <div className="flex items-center justify-between mt-2">
        <div>{avgRating ? `⭐ ${avgRating.toFixed(1)}/5` : 'No ratings yet'}</div>
        <button onClick={() => setShowReport(true)} className="text-red-600 text-sm">Report</button>
      </div>
      <div className="mt-4 space-x-2">
        <Link
          href={`/book/${driver.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded">Request Booking</Link>
        <Link href="/drivers" className="px-4 py-2 border rounded">Back</Link>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        <div className="space-y-3 mt-2">
          {reviews.slice(0,5).map(r => (
            <div key={r.id} className="p-3 border rounded">
              <div className="font-medium">⭐ {r.rating}/5</div>
              {r.comment && <div className="text-gray-700">{r.comment}</div>}
              <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))}
          {(!reviews || reviews.length === 0) && <p className="text-gray-600">No reviews yet.</p>}
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Report Profile</h3>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <select value={reportReason} onChange={e=>setReportReason(e.target.value)} className="w-full border rounded px-3 py-2 mb-3">
              <option>Fraud / Fake profile</option>
              <option>Unsafe behavior</option>
              <option>Harassment / Abuse</option>
              <option>Payment issue</option>
              <option>Other</option>
            </select>
            {reportReason === 'Other' && (
              <textarea value={reportDetails} onChange={e=>setReportDetails(e.target.value)} placeholder="Additional details" className="w-full border rounded px-3 py-2 mb-3" maxLength={500}/>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowReport(false)} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={async ()=>{
                const { data: ses } = await supabase.auth.getSession()
                const uid = ses?.session?.user?.id
                if (!uid) { setReportMsg('Please log in.'); return }
                const resp = await fetch('/api/reports/create', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reporter_id: uid, reported_user_id: id, reason: reportReason, details: reportDetails })
                })
                if (resp.ok) { setReportMsg('✅ Report submitted. Thank you for keeping EasyDriverHire safe.'); setShowReport(false) }
                else { setReportMsg('Could not submit report. Try again later.') }
              }} className="px-3 py-2 bg-red-600 text-white rounded">Submit</button>
            </div>
            {reportMsg && <p className="text-sm mt-2">{reportMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
