import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useAuthStore } from '../../stores/auth'
import toast from 'react-hot-toast'
import type { Database } from '../../lib/supabase/types'
import { deleteGrocery } from '../../lib/api/groceries'
import EditGroceryDialog from '../../components/EditGroceryDialog'
import StockTable from '../../components/StockTable'
import { getDaysToExpiry } from '../../lib/utils/dates'
import GroceryWeightSync from '../../components/GroceryWeightSync'

type Grocery = Database['public']['Tables']['groceries']['Row']

export default function StockLevel() {
  const { user } = useAuthStore()
  const [activeGroceries, setActiveGroceries] = useState<Grocery[]>([])
  const [expiredGroceries, setExpiredGroceries] = useState<Grocery[]>([])
  const [outOfStockGroceries, setOutOfStockGroceries] = useState<Grocery[]>([])
  const [editingGrocery, setEditingGrocery] = useState<Grocery | null>(null)

  useEffect(() => {
    if (!user) return
    fetchGroceries()

    const subscription = supabase
      .channel('groceries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'groceries',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchGroceries()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchGroceries = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('groceries')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      toast.error('Failed to fetch groceries')
      return
    }

    const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))

    const active = sortedData.filter(g => 
      getDaysToExpiry(g.expiry_date) >= 0 && 
      (g.weight ?? 0) > 0
    )
    
    const expired = sortedData.filter(g => 
      getDaysToExpiry(g.expiry_date) < 0
    )
    
    const outOfStock = sortedData.filter(g => 
      (g.weight ?? 0) <= 0
    )

    setActiveGroceries(active)
    setExpiredGroceries(expired)
    setOutOfStockGroceries(outOfStock)

    // Set up weight sync for all groceries
    active.concat(expired, outOfStock).forEach(grocery => {
      return <GroceryWeightSync key={grocery.id} grocery={grocery} />
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this grocery?')) return

    try {
      await deleteGrocery(id)
      toast.success('Grocery deleted successfully')
      fetchGroceries()
    } catch (error) {
      toast.error('Failed to delete grocery')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stock Level</h2>
      
      <StockTable
        title="Active Groceries"
        groceries={activeGroceries}
        showColorHighlights={true}
        onEdit={setEditingGrocery}
        onDelete={handleDelete}
      />

      <StockTable
        title="Expired Groceries"
        groceries={expiredGroceries}
        onEdit={setEditingGrocery}
        onDelete={handleDelete}
      />

      <StockTable
        title="Out of Stock Groceries"
        groceries={outOfStockGroceries}
        onEdit={setEditingGrocery}
        onDelete={handleDelete}
      />

      {editingGrocery && (
        <EditGroceryDialog
          grocery={editingGrocery}
          isOpen={true}
          onClose={() => setEditingGrocery(null)}
        />
      )}

      {/* Weight Sync Components */}
      {activeGroceries.concat(expiredGroceries, outOfStockGroceries).map(grocery => (
        <GroceryWeightSync key={grocery.id} grocery={grocery} />
      ))}
    </div>
  )
}