import { useState } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useAuthStore } from '../../stores/auth'
import toast from 'react-hot-toast'
import LoadCellSelect from '../../components/LoadCellSelect'
import DateInput from '../../components/DateInput'

export default function AddGrocery() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [loadCellNumber, setLoadCellNumber] = useState<number>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !loadCellNumber) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('groceries')
        .insert([
          {
            user_id: user.id,
            name,
            expiry_date: expiryDate,
            load_cell_number: loadCellNumber,
          },
        ])

      if (error) throw error

      toast.success('Grocery added successfully!')
      setName('')
      setExpiryDate('')
      setLoadCellNumber(0)
    } catch (error) {
      toast.error('Failed to add grocery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Add New Grocery</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
            Grocery Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium mb-2 text-foreground">
            Expiry Date
          </label>
          <DateInput
            value={expiryDate}
            onChange={setExpiryDate}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="loadCellNumber" className="block text-sm font-medium mb-2 text-foreground">
            Load Cell Number
          </label>
          <LoadCellSelect
            value={loadCellNumber}
            onChange={setLoadCellNumber}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !loadCellNumber}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Grocery'}
        </button>
      </form>
    </div>
  )
}