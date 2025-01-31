import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}