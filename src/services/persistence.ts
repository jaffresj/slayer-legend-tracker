import { defaultProfile } from '@/data'
import { getDateTimeKey } from '@/lib/dates'
import { normalizeAppExport } from '@/lib/validate'
import { useBuildStore } from '@/stores/buildStore'
import { useDailyStore } from '@/stores/dailyStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useProfileStore } from '@/stores/profileStore'
import type { AppExport } from '@/types/domain'

export function buildAppExport(): AppExport {
  return {
    version: 1,
    exportedAt: getDateTimeKey(),
    profile: useProfileStore.getState().profile,
    snapshots: useHistoryStore.getState().snapshots,
    builds: useBuildStore.getState().builds,
    daily: useDailyStore.getState().daily,
  }
}

export type ImportResult = { ok: true } | { ok: false; error: 'invalid-json' | 'invalid-shape' }

/**
 * Valide puis applique un export JSON externe à tous les stores.
 * Les données sont nettoyées (cf. normalizeAppExport) avant d'écraser l'état :
 * une entrée corrompue est filtrée plutôt que de planter l'application.
 */
export function importAppData(rawText: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawText)
  } catch {
    return { ok: false, error: 'invalid-json' }
  }

  const normalized = normalizeAppExport(parsed, defaultProfile)
  if (!normalized) return { ok: false, error: 'invalid-shape' }

  useProfileStore.getState().replaceProfile(normalized.profile)
  useHistoryStore.getState().replaceSnapshots(normalized.snapshots)
  useBuildStore.getState().replaceBuilds(normalized.builds)
  if (normalized.daily) useDailyStore.getState().replaceDaily(normalized.daily)

  return { ok: true }
}

export function resetAppData() {
  useProfileStore.getState().resetProfile()
  useHistoryStore.getState().resetSnapshots()
  useBuildStore.getState().resetBuilds()
  useDailyStore.getState().resetDaily()
}

export function downloadJson(fileName: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
