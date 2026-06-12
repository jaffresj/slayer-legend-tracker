import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { defaultProfile } from '@/data'
import { mergeProfile } from '@/lib/profile'
import type { PlayerProfile, ProfileUpdate } from '@/types/domain'

type ProfileState = {
  profile: PlayerProfile
  replaceProfile: (profile: PlayerProfile) => void
  updateProfile: (update: ProfileUpdate) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      replaceProfile: (profile) => set({ profile }),
      updateProfile: (update) => set((state) => ({ profile: mergeProfile(state.profile, update) })),
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'slayer-profile-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
