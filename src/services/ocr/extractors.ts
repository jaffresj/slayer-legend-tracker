import type { GrowthData, PlayerSkill, PlayerStats, ProfileUpdate } from '@/types/domain'

const NUMBER_GROUP = '([\\d\\s.,kKmMbB]+)'

/** Parse "1,2k" / "3 400" / "5M" → entier. `undefined` si non numérique. */
export function parseLooseNumber(value: string): number | undefined {
  const normalized = value
    .replace(/\s/g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.kKmMbB-]/g, '')

  const multiplier = /b$/i.test(normalized)
    ? 1_000_000_000
    : /m$/i.test(normalized)
      ? 1_000_000
      : /k$/i.test(normalized)
        ? 1_000
        : 1
  const parsed = Number(normalized.replace(/[kKmMbB]$/, ''))
  return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : undefined
}

function firstNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return parseLooseNumber(match[1])
  }
  return undefined
}

function firstText(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1].trim().slice(0, 80)
  }
  return undefined
}

/** Construit un objet en n'incluant que les paires dont la valeur est définie. */
function defined<T extends Record<string, unknown>>(entries: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(entries) as Array<keyof T>) {
    if (entries[key] !== undefined) result[key] = entries[key]
  }
  return result
}

export function extractPlayerData(text: string): Pick<ProfileUpdate, 'player' | 'resources'> {
  const player = defined({
    name: firstText(text, [
      /(?:joueur|player|nom)\s*[:=-]\s*([^\n]+)/i,
      /(?:name)\s*[:=-]\s*([^\n]+)/i,
    ]),
    level: firstNumber(text, [
      new RegExp(`(?:niveau|level|lvl|lv)\\s*[:.#-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    stage: firstNumber(text, [
      new RegExp(`(?:stage|palier|etage|étage)\\s*[:.#-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    zone: firstText(text, [/(?:zone|area)\s*[:=-]\s*([^\n]+)/i]),
  })

  const resources = defined({
    diamonds: firstNumber(text, [
      new RegExp(`(?:diamants?|diamonds?)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    emeralds: firstNumber(text, [
      new RegExp(`(?:emeraudes?|émeraudes?|emeralds?)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    gold: firstNumber(text, [
      new RegExp(`(?:or actuel|gold|or)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
  })

  return {
    ...(Object.keys(player).length ? { player } : {}),
    ...(Object.keys(resources).length ? { resources } : {}),
  }
}

export function extractStats(text: string): Partial<PlayerStats> {
  return defined({
    attack: firstNumber(text, [
      new RegExp(`(?:attaque|attack|atk)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    estimatedDamage: firstNumber(text, [
      new RegExp(
        `(?:degats estim[eé]s?|dégâts estim[eé]s?|damage)\\s*[:=-]?\\s*${NUMBER_GROUP}`,
        'i',
      ),
    ]),
    criticalRate: firstNumber(text, [
      new RegExp(
        `(?:critique|critical|crit)\\s*(?:rate|chance|%)?\\s*[:=-]?\\s*${NUMBER_GROUP}`,
        'i',
      ),
    ]),
    criticalDamage: firstNumber(text, [
      new RegExp(
        `(?:d[eé]g[aâ]ts critiques?|critical damage|crit damage)\\s*[:=-]?\\s*${NUMBER_GROUP}`,
        'i',
      ),
    ]),
    deathStrike: firstNumber(text, [
      new RegExp(`(?:frappe mortelle|death strike)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    goldPerMinute: firstNumber(text, [
      new RegExp(`(?:or par minute|gold per minute|gpm)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    health: firstNumber(text, [
      new RegExp(`(?:vie|sant[eé]|health|hp)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    defense: firstNumber(text, [
      new RegExp(`(?:defense|défense|def)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
  })
}

export function extractGrowth(text: string): Partial<GrowthData> {
  const growthBlock = text.match(/(?:croissance|growth)([\s\S]{0,800})/i)?.[1] ?? text
  return defined({
    attack: firstNumber(growthBlock, [
      new RegExp(`(?:attaque|attack|atk)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    health: firstNumber(growthBlock, [
      new RegExp(`(?:vie|sant[eé]|health|hp)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    recovery: firstNumber(growthBlock, [
      new RegExp(`(?:recuperation|récupération|recovery)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    critical: firstNumber(growthBlock, [
      new RegExp(`(?:critique|critical|crit)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
    deathStrike: firstNumber(growthBlock, [
      new RegExp(`(?:frappe mortelle|death strike)\\s*[:=-]?\\s*${NUMBER_GROUP}`, 'i'),
    ]),
  })
}

export function extractSkills(text: string): PlayerSkill[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /(?:skill|comp[eé]tence|niveau|level|lv)/i.test(line))
    .slice(0, 12)
    .map((line, index): PlayerSkill | undefined => {
      const match = line.match(/^(.{3,48}?)\s*(?:niveau|level|lv)\.?\s*[:=-]?\s*(\d{1,4})/i)
      if (!match?.[1] || !match[2]) return undefined
      const name = match[1].replace(/(?:skill|comp[eé]tence)[:=-]?/i, '').trim()
      const level = Number(match[2])
      if (!name || !Number.isFinite(level)) return undefined
      return {
        id: `ocr-skill-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name,
        rarity: 'exemple',
        description: 'Compétence détectée par OCR V1, à vérifier manuellement.',
        type: 'ocr',
        tags: ['ocr'],
        level,
        equipped: false,
      }
    })
    .filter((skill): skill is PlayerSkill => skill !== undefined)
}

/** Agrège tous les extracteurs en un seul ProfileUpdate prêt à fusionner. */
export function extractProfileFromText(text: string): ProfileUpdate {
  const playerData = extractPlayerData(text)
  const stats = extractStats(text)
  const growth = extractGrowth(text)
  const skills = extractSkills(text)

  return {
    ...playerData,
    ...(Object.keys(stats).length ? { stats } : {}),
    ...(Object.keys(growth).length ? { growth } : {}),
    ...(skills.length ? { skills } : {}),
  }
}
