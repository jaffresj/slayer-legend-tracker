import type { AppExport } from '../types/domain'
import { getDateTimeKey } from '../utils/dates'
import { useBuildStore } from './buildStore'
import { useDailyStore } from './dailyStore'
import { useHistoryStore } from './historyStore'
import { useProfileStore } from './profileStore'

export function exportAppData(): AppExport {
  return {
    version: 1,
    exportedAt: getDateTimeKey(),
    profile: useProfileStore.getState().profile,
    snapshots: useHistoryStore.getState().snapshots,
    builds: useBuildStore.getState().builds,
    daily: useDailyStore.getState().daily,
  }
}

export function importAppData(data: AppExport) {
  useProfileStore.getState().replaceProfile(data.profile)
  useHistoryStore.getState().replaceSnapshots(data.snapshots ?? [])
  useBuildStore.getState().replaceBuilds(data.builds ?? [])
  useDailyStore.getState().replaceDaily(data.daily)
}

export function resetAppData() {
  useProfileStore.getState().resetProfile()
  useHistoryStore.getState().resetSnapshots()
  useBuildStore.getState().resetBuilds()
  useDailyStore.getState().resetDaily()
}
