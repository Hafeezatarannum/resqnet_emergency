import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'

/**
 * useRequireAuth — redirect to /login if the user is not authenticated.
 * Use inside any protected route component:
 *
 *   function Home() {
 *     useRequireAuth()
 *     return <div>...</div>
 *   }
 */
export function useRequireAuth(redirectTo = '/login') {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: redirectTo })
    }
  }, [user, loading, navigate, redirectTo])

  return { user, loading }
}
