import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function SignupRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/auth/auth') }, [router])
  return <div className="p-6">Redirecting to auth...</div>
}
