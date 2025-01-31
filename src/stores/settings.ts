import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  stockLevels: {
    weightThreshold: number
    daysThreshold: number
  }
  notifications: {
    weightThreshold: number
    daysThreshold: number
  }
}

interface SettingsStore extends Settings {
  updateStockLevelSettings: (weightThreshold: number, daysThreshold: number) => void
  updateNotificationSettings: (weightThreshold: number, daysThreshold: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      stockLevels: {
        weightThreshold: 100,
        daysThreshold: 7,
      },
      notifications: {
        weightThreshold: 100,
        daysThreshold: 7,
      },
      updateStockLevelSettings: (weightThreshold, daysThreshold) =>
        set((state) => ({
          stockLevels: { weightThreshold, daysThreshold },
        })),
      updateNotificationSettings: (weightThreshold, daysThreshold) =>
        set((state) => ({
          notifications: { weightThreshold, daysThreshold },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
)