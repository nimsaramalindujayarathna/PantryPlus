import { Link, useLocation } from 'react-router-dom'
import { ShoppingBasket, PlusCircle, Scale, Calendar, Package, Settings } from 'lucide-react'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Add Grocery', href: '/dashboard/add', icon: PlusCircle },
  { name: 'Change Scale', href: '/dashboard/change-scale', icon: Scale },
  { name: 'Update Expiry', href: '/dashboard/update-expiry', icon: Calendar },
  { name: 'Stock Levels', href: '/dashboard/stock', icon: Package },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 border-r bg-card">
      <div className="h-16 flex items-center px-4 border-b">
        <Link to="/" className="flex items-center">
          <ShoppingBasket className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold text-primary">Pantry Plus</span>
        </Link>
      </div>
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm rounded-md',
                location.pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}