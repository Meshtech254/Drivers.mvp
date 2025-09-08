import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function AdminDashboard() {
	const [session, setSession] = useState(null)
	const [activeTab, setActiveTab] = useState('overview')
	const [stats, setStats] = useState({ users: 0, drivers: 0, pendingKyc: 0, bookings: 0 })
	const [users, setUsers] = useState([])
	const [usersTotal, setUsersTotal] = useState(0)
	const [bookings, setBookings] = useState([])
	const [bookingsTotal, setBookingsTotal] = useState(0)
	const [query, setQuery] = useState('')

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => setSession(data.session))
	}, [])

	useEffect(() => {
		if (!session) return
		loadStats()
		if (activeTab === 'users') loadUsers()
		if (activeTab === 'bookings') loadBookings()
	}, [session, activeTab])

	async function loadStats() {
		const [{ usersCount }, { driversCount }, { pendingKycCount }, { bookingsCount }] = await Promise.all([
			fetch('/api/admin/users?pageSize=1').then(r => r.json()).then(d => ({ usersCount: d.total || 0 })),
			fetch('/api/admin/users?pageSize=1&role=driver').then(r => r.json()).then(d => ({ driversCount: d.total || 0 })),
			fetch('/api/admin/users?pageSize=1&q=kyc_status:pending').then(r => r.json()).then(d => ({ pendingKycCount: d.total || 0 })).catch(() => ({ pendingKycCount: 0 })),
			fetch('/api/admin/bookings?pageSize=1').then(r => r.json()).then(d => ({ bookingsCount: d.total || 0 })),
		])
		setStats({ users: usersCount, drivers: driversCount, pendingKyc: pendingKycCount, bookings: bookingsCount })
	}

	async function loadUsers(page = 1) {
		const res = await fetch(`/api/admin/users?page=${page}&pageSize=20&q=${encodeURIComponent(query)}`)
		const data = await res.json()
		setUsers(data.users || [])
		setUsersTotal(data.total || 0)
	}

	async function loadBookings(page = 1) {
		const res = await fetch(`/api/admin/bookings?page=${page}&pageSize=20`)
		const data = await res.json()
		setBookings(data.bookings || [])
		setBookingsTotal(data.total || 0)
	}

	async function setUserStatus(id, updates) {
		await fetch('/api/admin/user-status', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, ...updates })
		})
		loadUsers()
	}

	if (!session) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navigation />
				<div className="max-w-4xl mx-auto p-6">
					<h2 className="text-2xl font-bold">Admin</h2>
					<p>Please sign in to access admin dashboard.</p>
				</div>
				<Footer />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />
			<main className="max-w-7xl mx-auto px-6 py-8">
				<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
				<div className="flex gap-2 mb-6">
					{['overview','users','kyc','bookings'].map(tab => (
						<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{tab.toUpperCase()}</button>
					))}
				</div>

				{activeTab === 'overview' && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="bg-white border rounded-lg p-4"><div className="text-sm text-gray-500">Users</div><div className="text-2xl font-bold">{stats.users}</div></div>
						<div className="bg-white border rounded-lg p-4"><div className="text-sm text-gray-500">Drivers</div><div className="text-2xl font-bold">{stats.drivers}</div></div>
						<div className="bg-white border rounded-lg p-4"><div className="text-sm text-gray-500">Pending KYC</div><div className="text-2xl font-bold">{stats.pendingKyc}</div></div>
						<div className="bg-white border rounded-lg p-4"><div className="text-sm text-gray-500">Bookings</div><div className="text-2xl font-bold">{stats.bookings}</div></div>
					</div>
				)}

				{activeTab === 'users' && (
					<div className="bg-white border rounded-lg p-4">
						<div className="flex items-center gap-2 mb-4">
							<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search email or name" className="px-3 py-2 border rounded-md flex-1"/>
							<button onClick={()=>loadUsers(1)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Search</button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left border-b">
										<th className="py-2">Email</th>
										<th className="py-2">Role</th>
										<th className="py-2">Approved</th>
										<th className="py-2">Available</th>
										<th className="py-2">Actions</th>
									</tr>
								</thead>
								<tbody>
									{users.map(u => (
										<tr key={u.id} className="border-b">
											<td className="py-2 pr-4">{u.email}</td>
											<td className="py-2 pr-4">{u.role || (u.is_driver ? 'driver' : 'user')}</td>
											<td className="py-2 pr-4">{u.is_approved ? 'Yes' : 'No'}</td>
											<td className="py-2 pr-4">{u.is_available ? 'Yes' : 'No'}</td>
											<td className="py-2 pr-4 space-x-2">
												<button onClick={()=>setUserStatus(u.id, { is_approved: !u.is_approved })} className="px-3 py-1 border rounded">{u.is_approved ? 'Unapprove' : 'Approve'}</button>
												<button onClick={()=>setUserStatus(u.id, { is_available: !u.is_available })} className="px-3 py-1 border rounded">{u.is_available ? 'Make Unavailable' : 'Make Available'}</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="text-sm text-gray-600 mt-3">Total: {usersTotal}</div>
					</div>
				)}

				{activeTab === 'kyc' && (
					<div className="bg-white border rounded-lg p-4">
						<p>Use the dedicated KYC page.</p>
						<a href="/admin/kyc" className="text-blue-600 hover:underline">Go to KYC approvals</a>
					</div>
				)}

				{activeTab === 'bookings' && (
					<div className="bg-white border rounded-lg p-4">
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left border-b">
										<th className="py-2">Client</th>
										<th className="py-2">Email</th>
										<th className="py-2">Driver Id</th>
										<th className="py-2">Status</th>
									</tr>
								</thead>
								<tbody>
									{bookings.map(b => (
										<tr key={b.id} className="border-b">
											<td className="py-2 pr-4">{b.client_name}</td>
											<td className="py-2 pr-4">{b.client_email}</td>
											<td className="py-2 pr-4">{b.driver_id}</td>
											<td className="py-2 pr-4">{b.status}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="text-sm text-gray-600 mt-3">Total: {bookingsTotal}</div>
					</div>
				)}
			</main>
			<Footer />
		</div>
	)
}


