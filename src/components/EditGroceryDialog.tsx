import { useState } from 'react'
import { supabase } from '../lib/supabase/client'
import toast from 'react-hot-toast'
import type { Database } from '../lib/supabase/types'

type Grocery = Database['public']['Tables']['groceries']['Row']

interface EditGroceryDialogProps {
  grocery: Grocery
  isOpen: boolean
  onClose: () => void
}

export default function EditGroceryDialog({ grocery, isOpen, onClose }: EditGroceryDialogProps) {
  const [name, setName] = useState(grocery.name)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('groceries')
        .update({ name })
        .eq('id', grocery.id)

      if (error) throw error

      toast.success('Grocery updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update grocery')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="bg-card p-6 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-xl font-semibold mb-4">Edit Grocery</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}