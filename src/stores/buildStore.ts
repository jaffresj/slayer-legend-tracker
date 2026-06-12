import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getDateTimeKey, makeId } from '@/lib/dates'
import type { Build } from '@/types/domain'

type BuildState = {
  builds: Build[]
  addBuild: (build: Omit<Build, 'id' | 'createdAt'>) => void
  removeBuild: (id: string) => void
  replaceBuilds: (builds: Build[]) => void
  resetBuilds: () => void
}

function createDefaultBuilds(): Build[] {
  const createdAt = getDateTimeKey()
  return [
    {
      id: 'default-progression',
      name: 'Progression',
      description: 'Build exemple pour pousser les stages avec attaque et critique.',
      goal: 'push_stage',
      skills: ['sample-critical-edge'],
      createdAt,
    },
    {
      id: 'default-farm',
      name: 'Farm',
      description: "Build exemple pour augmenter les gains d'or.",
      goal: 'farm_gold',
      skills: ['sample-gold-rush'],
      createdAt,
    },
    {
      id: 'default-boss',
      name: 'Boss',
      description: 'Build exemple pour concentrer les dégâts sur une cible.',
      goal: 'boss',
      skills: ['sample-critical-edge', 'sample-guard-stance'],
      createdAt,
    },
    {
      id: 'default-survie',
      name: 'Survie',
      description: 'Build exemple pour améliorer la tenue défensive.',
      goal: 'survie',
      skills: ['sample-guard-stance'],
      createdAt,
    },
  ]
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set) => ({
      builds: createDefaultBuilds(),
      addBuild: (build) =>
        set((state) => ({
          builds: [...state.builds, { ...build, id: makeId('build'), createdAt: getDateTimeKey() }],
        })),
      removeBuild: (id) =>
        set((state) => ({ builds: state.builds.filter((build) => build.id !== id) })),
      replaceBuilds: (builds) => set({ builds }),
      resetBuilds: () => set({ builds: createDefaultBuilds() }),
    }),
    {
      name: 'slayer-builds-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
