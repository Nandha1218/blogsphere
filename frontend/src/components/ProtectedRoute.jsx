import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — redirects unauthenticated users to /login
 * Usage: wrap any page that requires login with this component.
 *
 * Shows a spinner while auth state is being restored from localStorage.
 */
export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
