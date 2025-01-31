import { useEffect, useRef, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase/client';
import { getLoadCellPath } from '../lib/firebase/utils';
import { triggerWeightSync } from '../lib/supabase/weightSync';
import toast from 'react-hot-toast';

const DEBOUNCE_MS = 100; // Debounce weight updates

export function useWeightSync(groceryId: string, loadCellNumber: number, userId: string) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastWeightRef = useRef<number>(0);

  const updateWeight = useCallback(async (weight: number) => {
    if (weight === lastWeightRef.current) return;
    lastWeightRef.current = weight;

    try {
      await triggerWeightSync(userId, loadCellNumber, weight);
    } catch (error) {
      console.error('Failed to sync weight:', error);
      toast.error('Failed to update weight');
    }
  }, [userId, loadCellNumber]);

  useEffect(() => {
    if (!groceryId || !loadCellNumber || !userId) return;

    const path = getLoadCellPath(userId, loadCellNumber);
    const weightRef = ref(db, path);
    
    const unsubscribe = onValue(weightRef, (snapshot) => {
      const weight = snapshot.val() || 0;

      // Debounce weight updates
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateWeight(weight);
      }, DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [groceryId, loadCellNumber, userId, updateWeight]);
}