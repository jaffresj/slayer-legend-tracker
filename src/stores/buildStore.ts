import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Build } from '../types/domain'
import { getDateTimeKey, makeId } from '../utils/dates'

type BuildState = {
  builds: Build[]
  addBuild: (build: Omit<Build, 'id' | 'createdAt'>) => void
  removeBuild: (id: string) => void
  replaceBuilds: (builds: Build[]) => void
  resetBuilds: () => void
}

const defaultBuilds: Build[] = [
  {
    id: 'default-progression',
    name: 'Progression',
    description: 'Build exemple pour pousser les stages avec attaque et critique.',
    goal: 'push_stage',
    skills: ['sample-critical-edge'],
    createdAt: getDateTimeKey(),
  },
  {
    id: 'default-farm',
    name: 'Farm',
    description: "Build exemple pour augmenter les gains d'or.",
    goal: 'farm_gold',
    skills: ['sample-gold-rush'],
    createdAt: getDateTimeKey(),
  },
  {
    id: 'default-boss',
    name: 'Boss',
    description: 'Build exemple pour concentrer les dégâts sur une cible.',
    goal: 'boss',
    skills: ['sample-critical-edge', 'sample-guard-stance'],
    createdAt: getDateTimeKey(),
  },
  {
    id: 'default-survie',
    name: 'Survie',
    description: 'Build exemple pour améliorer la tenue défensive.',
    goal: 'survie',
    skills: ['sample-guard-stance'],
    createdAt: getDateTimeKey(),
  },
]

export const useBuildStore = create<BuildState>()(
  persist(
    (set) => ({
      builds: defaultBuilds,
      addBuild: (build) =>
        set((state) => ({
          builds: [
            ...state.builds,
            {
              ...build,
              id: makeId('build'),
              createdAt: getDateTimeKey(),
            },
          ],
        })),
      removeBuild: (id) =>
        set((state) => ({
          builds: state.builds.filter((build) => build.id !== id),
        })),
      replaceBuilds: (builds) => set({ builds }),
      resetBuilds: () => set({ builds: defaultBuilds }),
    }),
    {
      name: 'slayer-builds-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
