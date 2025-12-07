import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface GuestRouteProps {
  children: React.ReactNode
}

/**
 * Wrapper component that redirects authenticated users away from auth pages.
 * Shows a loading state while auth status is being determined.
 */
const GuestRoute = ({ children }: GuestRouteProps) => {
  const { status } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if already authenticated
  if (status === 'authenticated') {
    // Check if there's a saved location to redirect to
    const from = (location.state as { from?: Location })?.from?.pathname || '/home'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

export default GuestRoute
