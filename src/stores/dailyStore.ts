import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getTodayKey } from '@/lib/dates'
import type { DailyChecklist } from '@/types/domain'

type DailyState = {
  daily: DailyChecklist
  ensureToday: () => void
  toggleTask: (id: string) => void
  updateNotes: (notes: string) => void
  replaceDaily: (daily: DailyChecklist) => void
  resetDaily: () => void
}

const DEFAULT_TASKS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'dungeons', label: 'Donjons' },
  { id: 'boss', label: 'Boss' },
  { id: 'quests', label: 'Quêtes' },
  { id: 'events', label: 'Événements' },
  { id: 'rewards', label: 'Récompenses' },
]

export function createDailyChecklist(date = getTodayKey()): DailyChecklist {
  return {
    date,
    tasks: DEFAULT_TASKS.map((task) => ({ ...task, done: false })),
    notes: '',
  }
}

/** Repart d'une checklist vierge si la date stockée n'est plus aujourd'hui. */
export function resetIfNeeded(daily: DailyChecklist): DailyChecklist {
  const today = getTodayKey()
  return daily.date === today ? daily : createDailyChecklist(today)
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set) => ({
      daily: createDailyChecklist(),
      ensureToday: () => set((state) => ({ daily: resetIfNeeded(state.daily) })),
      toggleTask: (id) =>
        set((state) => {
          const daily = resetIfNeeded(state.daily)
          return {
            daily: {
              ...daily,
              tasks: daily.tasks.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task,
              ),
            },
          }
        }),
      updateNotes: (notes) => set((state) => ({ daily: { ...resetIfNeeded(state.daily), notes } })),
      replaceDaily: (daily) => set({ daily }),
      resetDaily: () => set({ daily: createDailyChecklist() }),
    }),
    {
      name: 'slayer-daily-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
