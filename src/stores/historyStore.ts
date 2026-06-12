import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { PlayerProfile, Snapshot } from '../types/domain'
import { getDateTimeKey, makeId } from '../utils/dates'
import { defaultProfile } from './profileStore'

type HistoryState = {
  snapshots: Snapshot[]
  addSnapshot: (profile: PlayerProfile) => void
  replaceSnapshots: (snapshots: Snapshot[]) => void
  resetSnapshots: () => void
}

export function snapshotFromProfile(profile: PlayerProfile): Snapshot {
  return {
    id: makeId('snapshot'),
    date: getDateTimeKey(),
    level: profile.player.level,
    stage: profile.player.stage,
    attack: profile.stats.attack,
    criticalRate: profile.stats.criticalRate,
    deathStrike: profile.stats.deathStrike,
    goldPerMinute: profile.stats.goldPerMinute,
  }
}

const defaultSnapshots = [snapshotFromProfile(defaultProfile)]

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      snapshots: defaultSnapshots,
      addSnapshot: (profile) =>
        set((state) => ({
          snapshots: [...state.snapshots, snapshotFromProfile(profile)].slice(-365),
        })),
      replaceSnapshots: (snapshots) => set({ snapshots }),
      resetSnapshots: () => set({ snapshots: defaultSnapshots }),
    }),
    {
      name: 'slayer-snapshots-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
