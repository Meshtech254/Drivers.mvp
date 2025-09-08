import { useEffect, useState } from 'react'

export default function ReportsList() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports/list').then(r => r.json()).then(d => {
      setReports(d.reports || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Reported User</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Details</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2 pr-4">{r.reported_user_id}</td>
              <td className="py-2 pr-4">{r.reason}</td>
              <td className="py-2 pr-4 max-w-md truncate" title={r.details || ''}>{r.details || '-'}</td>
              <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr><td className="py-3 text-gray-600">No reports</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}


