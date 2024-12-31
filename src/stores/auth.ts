import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { Database } from '../lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthStore {
  user: User | null
  profile: Profile | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}))