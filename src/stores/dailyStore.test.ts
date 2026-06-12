import { describe, expect, it } from 'vitest'
import { getTodayKey } from '@/lib/dates'
import { createDailyChecklist, resetIfNeeded } from './dailyStore'

describe('createDailyChecklist', () => {
  it('initialise les tâches du jour, toutes non cochées', () => {
    const checklist = createDailyChecklist()
    expect(checklist.date).toBe(getTodayKey())
    expect(checklist.tasks.length).toBeGreaterThan(0)
    expect(checklist.tasks.every((task) => !task.done)).toBe(true)
    expect(checklist.notes).toBe('')
  })
})

describe('resetIfNeeded', () => {
  it('conserve la checklist si la date est aujourd’hui', () => {
    const today = createDailyChecklist()
    expect(resetIfNeeded(today)).toBe(today)
  })

  it('réinitialise si la date est dépassée', () => {
    const stale = createDailyChecklist('2000-01-01')
    const fresh = resetIfNeeded(stale)
    expect(fresh).not.toBe(stale)
    expect(fresh.date).toBe(getTodayKey())
  })
})
