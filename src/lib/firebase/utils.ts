import { supabase } from '../supabase/client';

export async function getAvailableUserIds(): Promise<string[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('firebase_user_id');
    
    if (error) throw error;
    
    const usedIds = new Set(profiles?.map(p => p.firebase_user_id) || []);
    
    // Return IDs from user001 to user100 that aren't already assigned
    return Array.from({ length: 100 }, (_, i) => {
      const userId = `user${String(i + 1).padStart(3, '0')}`;
      return !usedIds.has(userId) ? userId : null;
    }).filter((id): id is string => id !== null);
  } catch (error) {
    console.error('Error fetching available user IDs:', error);
    throw error;
  }
}

export function getLoadCellPath(userId: string, loadCellNumber: number): string {
  const paddedNumber = String(loadCellNumber).padStart(2, '0');
  return `${userId}/loadCell${paddedNumber}/weight`;
}