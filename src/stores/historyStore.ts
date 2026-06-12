import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { defaultProfile } from '@/data'
import { snapshotFromProfile } from '@/lib/profile'
import type { PlayerProfile, Snapshot } from '@/types/domain'

const MAX_SNAPSHOTS = 365

type HistoryState = {
  snapshots: Snapshot[]
  addSnapshot: (profile: PlayerProfile) => void
  replaceSnapshots: (snapshots: Snapshot[]) => void
  resetSnapshots: () => void
}

const defaultSnapshots = [snapshotFromProfile(defaultProfile)]

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      snapshots: defaultSnapshots,
      addSnapshot: (profile) =>
        set((state) => ({
          snapshots: [...state.snapshots, snapshotFromProfile(profile)].slice(-MAX_SNAPSHOTS),
        })),
      replaceSnapshots: (snapshots) => set({ snapshots }),
      resetSnapshots: () => set({ snapshots: defaultSnapshots }),
    }),
    {
      name: 'slayer-snapshots-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
