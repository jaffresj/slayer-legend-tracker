import { isGoal } from '@/lib/labels'
import type {
  AppExport,
  Build,
  DailyChecklist,
  DailyTask,
  PlayerCompanion,
  PlayerEquipment,
  PlayerProfile,
  PlayerRelic,
  PlayerSkill,
  Snapshot,
  TaggedGameItem,
} from '@/types/domain'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

// La rareté est validée comme simple chaîne (pas comme union stricte) pour que
// les exports d'anciennes ou futures versions du jeu restent importables.
export function isTaggedGameItem(value: unknown): value is TaggedGameItem {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.rarity) &&
    isString(value.description) &&
    isString(value.type) &&
    Array.isArray(value.tags) &&
    value.tags.every(isString)
  )
}

export function isPlayerSkill(value: unknown): value is PlayerSkill {
  if (!isTaggedGameItem(value)) return false
  const record = value as Record<string, unknown>
  return isFiniteNumber(record.level) && isBoolean(record.equipped)
}

export function isPlayerCompanion(value: unknown): value is PlayerCompanion {
  if (!isTaggedGameItem(value)) return false
  return isFiniteNumber((value as Record<string, unknown>).level)
}

export function isPlayerEquipment(value: unknown): value is PlayerEquipment {
  if (!isTaggedGameItem(value)) return false
  const record = value as Record<string, unknown>
  return isFiniteNumber(record.level) && isBoolean(record.equipped)
}

export function isPlayerRelic(value: unknown): value is PlayerRelic {
  if (!isTaggedGameItem(value)) return false
  return isFiniteNumber((value as Record<string, unknown>).level)
}

export function isSnapshot(value: unknown): value is Snapshot {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.date) &&
    isFiniteNumber(value.level) &&
    isFiniteNumber(value.stage) &&
    isFiniteNumber(value.attack) &&
    isFiniteNumber(value.criticalRate) &&
    isFiniteNumber(value.deathStrike) &&
    isFiniteNumber(value.goldPerMinute)
  )
}

export function isBuild(value: unknown): value is Build {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.description) &&
    isString(value.goal) &&
    isGoal(value.goal) &&
    isString(value.createdAt) &&
    Array.isArray(value.skills) &&
    value.skills.every(isString)
  )
}

export function isDailyTask(value: unknown): value is DailyTask {
  return isRecord(value) && isString(value.id) && isString(value.label) && isBoolean(value.done)
}

export function isDailyChecklist(value: unknown): value is DailyChecklist {
  return (
    isRecord(value) &&
    isString(value.date) &&
    isString(value.notes) &&
    Array.isArray(value.tasks) &&
    value.tasks.every(isDailyTask)
  )
}

/**
 * Recopie une section du profil champ par champ : seules les valeurs du bon
 * type remplacent la valeur par défaut, tout le reste est ignoré.
 */
function sanitizeSection<T extends Record<string, string | number>>(
  defaults: T,
  value: unknown,
): T {
  const result = { ...defaults }
  if (!isRecord(value)) return result
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const candidate = value[key as string]
    const fallback = defaults[key]
    if (typeof fallback === 'number' && isFiniteNumber(candidate)) {
      result[key] = candidate as T[keyof T]
    } else if (typeof fallback === 'string' && isString(candidate)) {
      result[key] = candidate as T[keyof T]
    }
  }
  return result
}

function sanitizeList<T>(value: unknown, guard: (item: unknown) => item is T): T[] {
  if (!Array.isArray(value)) return []
  return value.filter(guard)
}

export function normalizeProfile(value: unknown, defaults: PlayerProfile): PlayerProfile | null {
  if (!isRecord(value)) return null
  return {
    player: sanitizeSection(defaults.player, value.player),
    resources: sanitizeSection(defaults.resources, value.resources),
    stats: sanitizeSection(defaults.stats, value.stats),
    growth: sanitizeSection(defaults.growth, value.growth),
    skills: sanitizeList(value.skills, isPlayerSkill),
    companions: sanitizeList(value.companions, isPlayerCompanion),
    equipment: sanitizeList(value.equipment, isPlayerEquipment),
    relics: sanitizeList(value.relics, isPlayerRelic),
  }
}

export type NormalizedAppExport = {
  profile: PlayerProfile
  snapshots: Snapshot[]
  builds: Build[]
  daily: DailyChecklist | null
}

/**
 * Valide et nettoie un export JSON externe avant de toucher aux stores.
 * Retourne `null` si la structure de base est invalide ; les entrées de
 * listes corrompues sont filtrées au lieu de faire échouer tout l'import.
 */
export function normalizeAppExport(
  data: unknown,
  defaults: PlayerProfile,
): NormalizedAppExport | null {
  if (!isRecord(data)) return null
  const profile = normalizeProfile(data.profile, defaults)
  if (!profile) return null
  return {
    profile,
    snapshots: sanitizeList(data.snapshots, isSnapshot),
    builds: sanitizeList(data.builds, isBuild),
    daily: isDailyChecklist(data.daily) ? data.daily : null,
  }
}

export function isAppExportShape(data: unknown): data is Partial<AppExport> {
  return isRecord(data) && 'profile' in data
}

export function parseJsonArray<T>(text: string, guard: (item: unknown) => item is T): T[] | null {
  try {
    const parsed: unknown = JSON.parse(text)
    if (!Array.isArray(parsed)) return null
    return parsed.every(guard) ? (parsed as T[]) : null
  } catch {
    return null
  }
}
