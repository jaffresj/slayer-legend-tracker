import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import defaultProfileJson from '../data/player.json'
import type {
  GrowthData,
  PlayerInfo,
  PlayerProfile,
  PlayerResources,
  PlayerStats,
} from '../types/domain'

export type ProfileUpdate = {
  player?: Partial<PlayerInfo>
  resources?: Partial<PlayerResources>
  stats?: Partial<PlayerStats>
  growth?: Partial<GrowthData>
  skills?: PlayerProfile['skills']
  companions?: PlayerProfile['companions']
  equipment?: PlayerProfile['equipment']
  relics?: PlayerProfile['relics']
}

type ProfileState = {
  profile: PlayerProfile
  replaceProfile: (profile: PlayerProfile) => void
  updateProfile: (update: ProfileUpdate) => void
  resetProfile: () => void
}

export const defaultProfile = defaultProfileJson as PlayerProfile

export function mergeProfile(profile: PlayerProfile, update: ProfileUpdate): PlayerProfile {
  return {
    player: { ...profile.player, ...update.player },
    resources: { ...profile.resources, ...update.resources },
    stats: { ...profile.stats, ...update.stats },
    growth: { ...profile.growth, ...update.growth },
    skills: update.skills ?? profile.skills,
    companions: update.companions ?? profile.companions,
    equipment: update.equipment ?? profile.equipment,
    relics: update.relics ?? profile.relics,
  }
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      replaceProfile: (profile) => set({ profile }),
      updateProfile: (update) => {
        set((state) => ({ profile: mergeProfile(state.profile, update) }))
      },
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'slayer-profile-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
