import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase/client'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, setProfile } = useAuthStore()

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    }

    getProfile()
  }, [user, setProfile])

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}