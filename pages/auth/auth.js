// pages/auth/auth.js
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("driver") // default role

  const handleSignup = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { role }, // custom user metadata
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/drivers` : undefined,
      },
    })

    if (error) {
      alert(error.message)
    } else {
      alert(`Magic link sent! Check your inbox ✉️ (Signing up as ${role})`)
    }
  }

  const signInWithProvider = async (provider) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('selected_role', role)
    }
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/drivers` } })
    if (error) alert(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Sign up / Login</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("driver")}
              className={`flex-1 py-2 rounded-lg border ${
                role === "driver"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Driver
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex-1 py-2 rounded-lg border ${
                role === "employer"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Employer
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Magic Link
          </button>
        </form>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <button onClick={() => signInWithProvider('google')} className="w-full border rounded-lg py-2 hover:bg-gray-50">Continue with Google</button>
          <button onClick={() => signInWithProvider('github')} className="w-full border rounded-lg py-2 hover:bg-gray-50">Continue with GitHub</button>
        </div>

        <p className="mt-4 text-sm text-gray-500">New user? Your account will be created automatically 🚀</p>
      </div>
    </div>
  )
}
