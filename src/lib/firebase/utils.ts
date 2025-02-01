import { supabase } from '../supabase/client';

export async function getAvailableUserIds(): Promise<string[]> {
  try {
    // Get all profiles to check used IDs
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('firebase_user_id');
    
    if (error) throw error;
    
    // Create a Set of used IDs for efficient lookup
    const usedIds = new Set(
      profiles
        ?.map(p => p.firebase_user_id)
        .filter(id => id !== null && id !== undefined) || []
    );
    
    // Generate available IDs
    const availableIds: string[] = [];
    for (let i = 1; i <= 100; i++) {
      const userId = `user${String(i).padStart(3, '0')}`;
      if (!usedIds.has(userId)) {
        availableIds.push(userId);
      }
    }
    
    return availableIds;
  } catch (error) {
    console.error('Error fetching available user IDs:', error);
    throw error;
  }
}

export function getLoadCellPath(userId: string, loadCellNumber: number): string {
  const paddedNumber = String(loadCellNumber).padStart(2, '0');
  return `${userId}/loadCell${paddedNumber}/weight`;
}