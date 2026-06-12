import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { DailyChecklist } from '../types/domain'
import { getTodayKey } from '../utils/dates'

type DailyState = {
  daily: DailyChecklist
  ensureToday: () => void
  toggleTask: (id: string) => void
  updateNotes: (notes: string) => void
  replaceDaily: (daily: DailyChecklist) => void
  resetDaily: () => void
}

export function createDailyChecklist(date = getTodayKey()): DailyChecklist {
  return {
    date,
    tasks: [
      { id: 'dungeons', label: 'Donjons', done: false },
      { id: 'boss', label: 'Boss', done: false },
      { id: 'quests', label: 'Quêtes', done: false },
      { id: 'events', label: 'Événements', done: false },
      { id: 'rewards', label: 'Récompenses', done: false },
    ],
    notes: '',
  }
}

function resetIfNeeded(daily: DailyChecklist) {
  const today = getTodayKey()
  return daily.date === today ? daily : createDailyChecklist(today)
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set) => ({
      daily: createDailyChecklist(),
      ensureToday: () =>
        set((state) => ({
          daily: resetIfNeeded(state.daily),
        })),
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
      updateNotes: (notes) =>
        set((state) => ({
          daily: { ...resetIfNeeded(state.daily), notes },
        })),
      replaceDaily: (daily) => set({ daily }),
      resetDaily: () => set({ daily: createDailyChecklist() }),
    }),
    {
      name: 'slayer-daily-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
