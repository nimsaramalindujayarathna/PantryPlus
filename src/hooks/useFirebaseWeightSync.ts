import { useEffect } from 'react';
import { weightSyncManager } from '../lib/firebase/weightSync';
import toast from 'react-hot-toast';

export function useFirebaseWeightSync(
  groceryId: string,
  loadCellNumber: number,
  firebaseUserId: string
) {
  useEffect(() => {
    if (!groceryId || !loadCellNumber || !firebaseUserId) return;

    const unsubscribe = weightSyncManager.subscribe({
      userId: firebaseUserId,
      loadCellNumber,
      onError: (error) => {
        console.error('Weight sync error:', error);
        toast.error('Failed to sync weight data');
      },
    });

    return () => {
      unsubscribe();
    };
  }, [groceryId, loadCellNumber, firebaseUserId]);
}