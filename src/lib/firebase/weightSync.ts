import { ref, onValue, DatabaseReference } from 'firebase/database';
import { db } from './client';
import { supabase } from '../supabase/client';
import { getLoadCellPath } from './utils';

interface WeightSyncConfig {
  userId: string;
  loadCellNumber: number;
  onError?: (error: Error) => void;
}

class WeightSyncManager {
  private static instance: WeightSyncManager;
  private subscriptions: Map<string, () => void> = new Map();

  private constructor() {}

  static getInstance(): WeightSyncManager {
    if (!this.instance) {
      this.instance = new WeightSyncManager();
    }
    return this.instance;
  }

  private async updateSupabaseWeight(
    profileId: string,
    loadCellNumber: number,
    weight: number
  ) {
    try {
      await supabase
        .from('groceries')
        .update({ weight })
        .eq('user_id', profileId)
        .eq('load_cell_number', loadCellNumber);
    } catch (error) {
      console.error('Failed to update weight in Supabase:', error);
      throw error;
    }
  }

  private async getProfileId(firebaseUserId: string): Promise<string> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('firebase_user_id', firebaseUserId)
      .single();

    if (error) throw new Error('Failed to get profile ID');
    return data.id;
  }

  subscribe({ userId, loadCellNumber, onError }: WeightSyncConfig): () => void {
    const subscriptionKey = `${userId}-${loadCellNumber}`;

    // Clean up existing subscription if any
    this.unsubscribe(subscriptionKey);

    const path = getLoadCellPath(userId, loadCellNumber);
    const weightRef: DatabaseReference = ref(db, path);

    let profileId: string | null = null;

    // Get profile ID first
    this.getProfileId(userId)
      .then((id) => {
        profileId = id;
      })
      .catch((error) => {
        console.error('Failed to get profile ID:', error);
        onError?.(error);
      });

    const unsubscribe = onValue(
      weightRef,
      async (snapshot) => {
        try {
          if (!profileId) {
            profileId = await this.getProfileId(userId);
          }

          const weight = snapshot.val() || 0;
          await this.updateSupabaseWeight(profileId, loadCellNumber, weight);
        } catch (error) {
          console.error('Weight sync error:', error);
          onError?.(error as Error);
        }
      },
      (error) => {
        console.error('Firebase subscription error:', error);
        onError?.(error);
      }
    );

    this.subscriptions.set(subscriptionKey, unsubscribe);
    return () => this.unsubscribe(subscriptionKey);
  }

  private unsubscribe(key: string) {
    const unsubscribe = this.subscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.clear();
  }
}

export const weightSyncManager = WeightSyncManager.getInstance();