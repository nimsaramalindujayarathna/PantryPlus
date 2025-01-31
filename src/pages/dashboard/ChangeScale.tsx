import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useAuthStore } from '../../stores/auth'
import toast from 'react-hot-toast'
import type { Database } from '../../lib/supabase/types'
import LoadCellSelect from '../../components/LoadCellSelect'
import { updateGroceryLoadCell, checkLoadCellAvailability } from '../../lib/api/groceries'

type Grocery = Database['public']['Tables']['groceries']['Row']

export default function ChangeScale() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [groceries, setGroceries] = useState<Grocery[]>([])
  const [selectedGrocery, setSelectedGrocery] = useState<string>('')
  const [loadCellNumber, setLoadCellNumber] = useState<number>(0)

  useEffect(() => {
    if (user) {
      fetchGroceries()
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

    setGroceries(data)
  }

  const handleGroceryChange = (groceryId: string) => {
    setSelectedGrocery(groceryId)
    const grocery = groceries.find(g => g.id === groceryId)
    if (grocery) {
      setLoadCellNumber(grocery.load_cell_number)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedGrocery || !loadCellNumber) return

    setLoading(true)
    try {
      // Check if the new load cell is available
      const isAvailable = await checkLoadCellAvailability(loadCellNumber, selectedGrocery)
      
      if (!isAvailable) {
        toast.error('This load cell is already in use')
        return
      }

      // Update the grocery with the new load cell
      await updateGroceryLoadCell(selectedGrocery, loadCellNumber)

      toast.success('Load cell updated successfully!')
      fetchGroceries()
    } catch (error) {
      toast.error('Failed to update load cell')
    } finally {
      setLoading(false)
    }
  }

  const currentGrocery = groceries.find(g => g.id === selectedGrocery)

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Change Load Cell</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="grocery" className="block text-sm font-medium mb-2 text-foreground">
            Select Grocery
          </label>
          <select
            id="grocery"
            value={selectedGrocery}
            onChange={(e) => handleGroceryChange(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          >
            <option value="">Select a grocery</option>
            {groceries.map((grocery) => (
              <option key={grocery.id} value={grocery.id}>
                {grocery.name} (Load Cell {grocery.load_cell_number})
              </option>
            ))}
          </select>
        </div>

        {selectedGrocery && (
          <div>
            <label htmlFor="newLoadCell" className="block text-sm font-medium mb-2 text-foreground">
              New Load Cell Number
            </label>
            <LoadCellSelect
              value={loadCellNumber}
              onChange={setLoadCellNumber}
              currentLoadCell={currentGrocery?.load_cell_number}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedGrocery || !loadCellNumber}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Load Cell'}
        </button>
      </form>
    </div>
  )
}