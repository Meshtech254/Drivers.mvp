import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold">Drivers.com (MVP)</h1>
        <nav className="space-x-4">
          <Link href="/signup"><a>Sign Up / Login</a></Link>
          <Link href="/drivers"><a>Browse Drivers</a></Link>
        </nav>
      </header>

      <main className="mt-10">
        <h2 className="text-xl font-semibold">Find trusted drivers for part-time or full-time</h2>
        <p className="mt-4">Demo MVP: book a driver and an email will be sent to the driver with your contact details.</p>
        <div className="mt-6">
          <Link href="/drivers"><a className="px-4 py-2 bg-blue-600 text-white rounded">Browse Drivers</a></Link>
        </div>
      </main>
    </div>
  )
}
