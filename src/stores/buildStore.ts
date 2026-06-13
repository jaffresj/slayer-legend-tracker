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
      description: 'Pousser les stages : AoE foudre/feu et burst critique.',
      goal: 'push_stage',
      skills: ['red-lightning', 'flame-wave', 'curved-blade', 'fulgurous', 'speed-sword'],
      createdAt,
    },
    {
      id: 'default-farm',
      name: 'Farm',
      description: "Maximiser le nettoyage des mobs et les gains d'or.",
      goal: 'farm_gold',
      skills: ['fulgurous', 'fire-sword', 'flowing-blade', 'blizzard', 'meditation'],
      createdAt,
    },
    {
      id: 'default-boss',
      name: 'Boss',
      description: 'Concentrer le burst sur une cible unique.',
      goal: 'boss',
      skills: ['fulgurous', 'hellfire-slash', 'giga-strike', 'curved-blade', 'iron-will'],
      createdAt,
    },
    {
      id: 'default-survie',
      name: 'Survie',
      description: 'Tenue défensive et récupération de mana.',
      goal: 'survie',
      skills: ['iron-will', 'earths-will', 'mana-of-life', 'meditation'],
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
