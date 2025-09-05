// pages/auth/auth.js
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("driver") // default role
  const [authMode, setAuthMode] = useState("signup") // "signup" or "login"
  const [message, setMessage] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    setMessage("")

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.getUser()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-8), // Temporary password for magic link
      options: {
        data: { role }, // custom user metadata
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/confirm` : undefined,
      },
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(`Welcome! Magic link sent to ${email} ✉️ (Signing up as ${role})`)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/drivers` : undefined,
      },
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(`Login link sent to ${email} ✉️`)
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
        <h1 className="text-2xl font-bold mb-6">
          {authMode === "signup" ? "Sign Up" : "Login"}
        </h1>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className={`flex-1 py-2 rounded-lg border ${
              authMode === "signup"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2 rounded-lg border ${
              authMode === "login"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
        </div>

        <form onSubmit={authMode === "signup" ? handleSignup : handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />

          {authMode === "signup" && (
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
          )}

          <button
            type="submit"
            className={`w-full font-semibold py-2 rounded-lg transition ${
              authMode === "signup"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {authMode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes("Error") 
              ? "bg-red-100 text-red-700 border border-red-200" 
              : "bg-green-100 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2">
          <button onClick={() => signInWithProvider('google')} className="w-full border rounded-lg py-2 hover:bg-gray-50">Continue with Google</button>
          <button onClick={() => signInWithProvider('github')} className="w-full border rounded-lg py-2 hover:bg-gray-50">Continue with GitHub</button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          {authMode === "signup" 
            ? "New user? Your account will be created automatically 🚀" 
            : "Already have an account? Use the login link sent to your email ✉️"
          }
        </p>
      </div>
    </div>
  )
}
