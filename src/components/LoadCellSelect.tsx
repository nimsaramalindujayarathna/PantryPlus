import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuthStore } from '../stores/auth';

interface LoadCellSelectProps {
  value: number;
  onChange: (value: number) => void;
  currentLoadCell?: number;
  className?: string;
}

export default function LoadCellSelect({ value, onChange, currentLoadCell, className }: LoadCellSelectProps) {
  const { profile } = useAuthStore();
  const [inUseLoadCells, setInUseLoadCells] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoadCellsStatus = async () => {
      if (!profile?.id) return;

      try {
        // Get load cells currently in use from Supabase
        const { data: groceries, error } = await supabase
          .from('groceries')
          .select('load_cell_number')
          .eq('user_id', profile.id);

        if (error) throw error;

        const usedCells = groceries.map(g => g.load_cell_number);
        setInUseLoadCells(usedCells);
      } catch (error) {
        console.error('Error fetching load cells:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoadCellsStatus();
  }, [currentLoadCell, profile?.id]);

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={loading}
      className={className}
      required
    >
      <option value="">Select a load cell</option>
      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
        const isInUse = inUseLoadCells.includes(num);
        const isCurrent = num === currentLoadCell;
        
        return (
          <option 
            key={num} 
            value={num}
            disabled={isInUse && !isCurrent}
          >
            Load Cell {num} {isInUse && !isCurrent ? '(In use)' : ''}
          </option>
        );
      })}
    </select>
  );
}