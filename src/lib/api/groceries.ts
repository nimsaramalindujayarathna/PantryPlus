import { supabase } from '../supabase/client'
import type { Database } from '../supabase/types'

type Grocery = Database['public']['Tables']['groceries']['Row']

export async function deleteGrocery(id: string) {
  const { error } = await supabase
    .from('groceries')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function checkLoadCellAvailability(loadCellNumber: number, excludeGroceryId?: string) {
  const query = supabase
    .from('groceries')
    .select('id')
    .eq('load_cell_number', loadCellNumber)

  if (excludeGroceryId) {
    query.neq('id', excludeGroceryId)
  }

  const { data, error } = await query.single()

  if (error && error.code === 'PGRST116') {
    // No grocery found with this load cell number
    return true
  }

  return false
}