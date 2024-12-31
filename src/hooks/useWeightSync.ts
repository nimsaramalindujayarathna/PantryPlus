import { useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase/client';
import { supabase } from '../lib/supabase/client';
import { getLoadCellPath } from '../lib/firebase/utils';
import toast from 'react-hot-toast';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useWeightSync(groceryId: string, loadCellNumber: number, userId: string) {
  const retryCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!groceryId || !loadCellNumber || !userId) return;

    const updateWeight = async (weight: number) => {
      try {
        const { error } = await supabase
          .from('groceries')
          .update({ weight })
          .eq('id', groceryId);

        if (error) throw error;
        retryCount.current = 0;
      } catch (error) {
        console.error('Error updating weight:', error);
        
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current++;
          timeoutRef.current = setTimeout(() => {
            updateWeight(weight);
          }, RETRY_DELAY * retryCount.current);
        } else {
          toast.error('Failed to update weight. Please refresh the page.');
        }
      }
    };

    const path = getLoadCellPath(userId, loadCellNumber);
    const weightRef = ref(db, path);
    
    const unsubscribe = onValue(weightRef, (snapshot) => {
      const weight = snapshot.val() || 0;
      updateWeight(weight);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [groceryId, loadCellNumber, userId]);
}