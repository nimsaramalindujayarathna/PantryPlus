import { supabase } from '../supabase/client';

export async function checkLoadCellAvailability(loadCellNumber: number, excludeGroceryId?: string) {
  const query = supabase
    .from('groceries')
    .select('id')
    .eq('load_cell_number', loadCellNumber);

  if (excludeGroceryId) {
    query.neq('id', excludeGroceryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Return true if no groceries are using this load cell (except the excluded one)
  return data.length === 0;
}