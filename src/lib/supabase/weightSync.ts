import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './client';
import { create } from 'zustand';

interface WeightUpdate {
  groceryId: string;
  weight: number;
  timestamp: string;
}

interface WeightSyncStore {
  updates: Record<string, WeightUpdate>;
  addUpdate: (groceryId: string, update: WeightUpdate) => void;
}

export const useWeightSyncStore = create<WeightSyncStore>((set) => ({
  updates: {},
  addUpdate: (groceryId, update) =>
    set((state) => ({
      updates: { ...state.updates, [groceryId]: update },
    })),
}));

let weightSyncChannel: RealtimeChannel | null = null;

export function setupWeightSync() {
  if (weightSyncChannel) {
    return () => weightSyncChannel?.unsubscribe();
  }

  weightSyncChannel = supabase
    .channel('weight_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'groceries',
      },
      (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new.weight !== payload.old.weight) {
          useWeightSyncStore.getState().addUpdate(payload.new.id, {
            groceryId: payload.new.id,
            weight: payload.new.weight,
            timestamp: payload.new.updated_at,
          });
        }
      }
    )
    .subscribe();

  return () => {
    if (weightSyncChannel) {
      weightSyncChannel.unsubscribe();
      weightSyncChannel = null;
    }
  };
}

export async function triggerWeightSync(
  firebaseUserId: string,
  loadCellNumber: number,
  weight: number
) {
  try {
    const { data, error } = await supabase
      .from('groceries')
      .update({ weight })
      .eq('load_cell_number', loadCellNumber)
      .eq('user_id', (
        await supabase
          .from('profiles')
          .select('id')
          .eq('firebase_user_id', firebaseUserId)
          .single()
      ).data?.id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error syncing weight:', error);
    throw error;
  }
}