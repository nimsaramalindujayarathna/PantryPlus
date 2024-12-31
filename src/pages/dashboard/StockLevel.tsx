import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useAuthStore } from '../../stores/auth'
import { formatDate } from '../../lib/utils'
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Database } from '../../lib/supabase/types'
import GroceryWeightSync from '../../components/GroceryWeightSync'
import EditGroceryDialog from '../../components/EditGroceryDialog'
import { deleteGrocery } from '../../lib/api/groceries'

type Grocery = Database['public']['Tables']['groceries']['Row']
type SortField = 'name' | 'weight' | 'expiry_date' | 'load_cell_number'

export default function StockLevel() {
  const { user } = useAuthStore()
  const [groceries, setGroceries] = useState<Grocery[]>([])
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
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
  }, [user, sortField, sortDirection])

  const fetchGroceries = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('groceries')
      .select('*')
      .eq('user_id', user.id)
      .order(sortField, { ascending: sortDirection === 'asc' })

    if (error) {
      toast.error('Failed to fetch groceries')
      return
    }

    setGroceries(data)
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />
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
      <div className="overflow-x-auto">
        {groceries.map((grocery) => (
          <GroceryWeightSync key={grocery.id} grocery={grocery} />
        ))}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('weight')}
              >
                <div className="flex items-center space-x-1">
                  <span>Weight (g)</span>
                  {getSortIcon('weight')}
                </div>
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('expiry_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Expiry Date</span>
                  {getSortIcon('expiry_date')}
                </div>
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('load_cell_number')}
              >
                <div className="flex items-center space-x-1">
                  <span>Load Cell</span>
                  {getSortIcon('load_cell_number')}
                </div>
              </th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceries.map((grocery) => (
              <tr key={grocery.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-2">{grocery.name}</td>
                <td className="px-4 py-2">{grocery.weight?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-2">{formatDate(grocery.expiry_date)}</td>
                <td className="px-4 py-2">Load Cell {grocery.load_cell_number}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingGrocery(grocery)}
                      className="p-1 hover:bg-accent rounded-md"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(grocery.id)}
                      className="p-1 hover:bg-accent rounded-md text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingGrocery && (
        <EditGroceryDialog
          grocery={editingGrocery}
          isOpen={true}
          onClose={() => setEditingGrocery(null)}
        />
      )}
    </div>
  )
}