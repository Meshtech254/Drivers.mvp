import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setMessage(`Error: ${error.message}`)
          setLoading(false)
          return
        }

        if (data.session?.user) {
          setMessage('Account confirmed successfully! Redirecting...')
          
          // Redirect based on user role
          const role = data.session.user.user_metadata?.role || 'driver'
          setTimeout(() => {
            if (role === 'employer') {
              router.push('/employer/dashboard')
            } else {
              router.push('/drivers/dashboard')
            }
          }, 2000)
        } else {
          setMessage('No active session found. Please try signing up again.')
          setTimeout(() => router.push('/auth/auth'), 3000)
        }
      } catch (error) {
        setMessage(`Unexpected error: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Account Confirmation</h1>
        
        {loading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Confirming your account...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className={`text-sm ${
              message.includes('Error') || message.includes('No active session') 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {message}
            </p>
            
            {!message.includes('Error') && !message.includes('No active session') && (
              <div className="text-xs text-gray-500">
                You will be redirected automatically...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
