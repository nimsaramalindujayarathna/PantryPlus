import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useAuthStore } from '../../stores/auth';
import toast from 'react-hot-toast';
import type { Database } from '../../lib/supabase/types';
import DateInput from '../../components/DateInput';

type Grocery = Database['public']['Tables']['groceries']['Row'];

export default function UpdateExpiry() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [selectedGrocery, setSelectedGrocery] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (user) {
      fetchGroceries();
    }
  }, [user]);

  const fetchGroceries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('groceries')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to fetch groceries');
      return;
    }

    setGroceries(data);
  };

  const handleGroceryChange = (groceryId: string) => {
    setSelectedGrocery(groceryId);
    const grocery = groceries.find(g => g.id === groceryId);
    if (grocery) {
      setExpiryDate(grocery.expiry_date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedGrocery) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('groceries')
        .update({ expiry_date: expiryDate })
        .eq('id', selectedGrocery);

      if (error) throw error;

      toast.success('Expiry date updated successfully!');
      fetchGroceries();
    } catch (error) {
      toast.error('Failed to update expiry date');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Update Expiry Date</h2>
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
                {grocery.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium mb-2 text-foreground">
            New Expiry Date
          </label>
          <DateInput
            value={expiryDate}
            onChange={setExpiryDate}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedGrocery}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Expiry Date'}
        </button>
      </form>
    </div>
  );
}