import { ref, get, set } from 'firebase/database';
import { db } from './client';

export async function initializeFirebaseData() {
  const usersRef = ref(db);
  const snapshot = await get(usersRef);
  
  if (!snapshot.exists()) {
    // Initialize structure for all possible users
    const initialData = Array.from({ length: 100 }, (_, i) => {
      const userId = `user${String(i + 1).padStart(3, '0')}`;
      return [
        userId,
        Array.from({ length: 20 }, (_, j) => ({
          [`loadCell${String(j + 1).padStart(2, '0')}`]: {
            weight: 0
          }
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
      ];
    }).reduce((acc, [key, value]) => ({ ...acc, [key as string]: value }), {});

    await set(usersRef, initialData);
  }
}

export async function getAvailableUserIds(): Promise<string[]> {
  // First ensure the data structure exists
  await initializeFirebaseData();
  
  const snapshot = await get(ref(db));
  const data = snapshot.val() || {};
  
  // Get all user IDs that don't have any non-zero weights
  const availableIds = Object.entries(data).filter(([_, userData]: [string, any]) => {
    return Object.values(userData).every((cell: any) => cell.weight === 0);
  }).map(([userId]) => userId);
  
  return availableIds;
}

export function getLoadCellPath(userId: string, loadCellNumber: number): string {
  return `${userId}/loadCell${String(loadCellNumber).padStart(2, '0')}/weight`;
}