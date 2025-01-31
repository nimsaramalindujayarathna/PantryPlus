import { Bell, User, LogOut, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

export default function Header() {
  const { profile } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="border-b bg-background">
      <div className="h-16 px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Welcome, {profile?.first_name} {profile?.last_name}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-accent rounded-full"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          <button className="p-2 hover:bg-accent rounded-full" title="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/dashboard/profile" className="p-2 hover:bg-accent rounded-full" title="Profile">
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-accent rounded-full text-destructive"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}