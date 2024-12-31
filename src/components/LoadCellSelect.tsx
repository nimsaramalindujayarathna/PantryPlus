import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase/client';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../lib/supabase/client';

interface LoadCellSelectProps {
  value: number;
  onChange: (value: number) => void;
  currentLoadCell?: number;
  className?: string;
}

export default function LoadCellSelect({ value, onChange, currentLoadCell, className }: LoadCellSelectProps) {
  const { profile } = useAuthStore();
  const [availableLoadCells, setAvailableLoadCells] = useState<number[]>([]);
  const [inUseLoadCells, setInUseLoadCells] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoadCellsStatus = async () => {
      if (!profile?.firebase_user_id) return;

      try {
        // Get load cells with zero weight from Firebase
        const userRef = ref(db, profile.firebase_user_id);
        const fbSnapshot = await get(userRef);
        
        let availableCells: number[] = [];
        if (fbSnapshot.exists()) {
          const data = fbSnapshot.val();
          availableCells = Object.keys(data)
            .filter(key => key.startsWith('loadCell'))
            .map(key => parseInt(key.replace('loadCell', ''), 10))
            .filter(cellNum => data[`loadCell${String(cellNum).padStart(2, '0')}`].weight === 0);
        }

        // Get load cells currently in use from Supabase
        const { data: groceries, error } = await supabase
          .from('groceries')
          .select('load_cell_number')
          .eq('user_id', profile.id);

        if (error) throw error;

        const usedCells = groceries.map(g => g.load_cell_number);
        setInUseLoadCells(usedCells);

        // A load cell is available if:
        // 1. It has zero weight in Firebase AND
        // 2. It's not currently assigned to any grocery (except the current one)
        const actuallyAvailable = availableCells.filter(
          cell => !usedCells.includes(cell) || cell === currentLoadCell
        );

        setAvailableLoadCells(actuallyAvailable);
      } catch (error) {
        console.error('Error fetching load cells:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoadCellsStatus();
  }, [currentLoadCell, profile?.firebase_user_id, profile?.id]);

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
        const isAvailable = availableLoadCells.includes(num);
        const isInUse = inUseLoadCells.includes(num);
        const isCurrent = num === currentLoadCell;
        
        return (
          <option 
            key={num} 
            value={num}
            disabled={(!isAvailable && !isCurrent) || (isInUse && !isCurrent)}
          >
            Load Cell {num} {isInUse && !isCurrent ? '(In use)' : ''} {!isAvailable && !isInUse && !isCurrent ? '(Has weight)' : ''}
          </option>
        );
      })}
    </select>
  );
}