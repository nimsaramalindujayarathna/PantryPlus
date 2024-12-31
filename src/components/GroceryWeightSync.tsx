import { useWeightSync } from '../hooks/useWeightSync';
import { useAuthStore } from '../stores/auth';
import type { Database } from '../lib/supabase/types';

type Grocery = Database['public']['Tables']['groceries']['Row'];

export default function GroceryWeightSync({ grocery }: { grocery: Grocery }) {
  const { profile } = useAuthStore();
  
  useWeightSync(
    grocery.id,
    grocery.load_cell_number,
    profile?.firebase_user_id || ''
  );
  
  return null;
}