import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase/client'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AddGrocery from './pages/dashboard/AddGrocery'
import ChangeScale from './pages/dashboard/ChangeScale'
import StockLevel from './pages/dashboard/StockLevel'
import Profile from './pages/dashboard/Profile'
import UpdateExpiry from './pages/dashboard/UpdateExpiry'

// Components
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { setUser } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background">
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<Navigate to="stock" replace />} />
              <Route path="add" element={<AddGrocery />} />
              <Route path="change-scale" element={<ChangeScale />} />
              <Route path="stock" element={<StockLevel />} />
              <Route path="update-expiry" element={<UpdateExpiry />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </div>
    </div>
  )
}