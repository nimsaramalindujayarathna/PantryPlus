import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { Scale, ShoppingBasket, Calendar, Weight } from 'lucide-react'

export default function Landing() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <ShoppingBasket className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">Pantry Plus</span>
            </div>
            <div>
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
              Smart Grocery Management
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Take control of your pantry with real-time weight tracking, expiry date management, and smart organization.
            </p>
          </div>

          <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Weight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Real-time Weight Tracking</h3>
              <p className="mt-2 text-muted-foreground">
                Monitor your groceries with precision using our smart scale integration.
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Expiry Management</h3>
              <p className="mt-2 text-muted-foreground">
                Never waste food again with our expiry date tracking system.
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">Smart Scale Assignment</h3>
              <p className="mt-2 text-muted-foreground">
                Easily manage multiple items with our intelligent scale assignment system.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}