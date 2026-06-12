import type {
  GrowthData,
  PlayerProfile,
  PlayerSkill,
  PlayerStats,
} from '../../types/domain'
import type { ProfileUpdate } from '../../stores/profileStore'

function parseLooseNumber(value: string) {
  const normalized = value
    .replace(/\s/g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.kKmMbB-]/g, '')

  const multiplier = /b$/i.test(normalized)
    ? 1000000000
    : /m$/i.test(normalized)
      ? 1000000
      : /k$/i.test(normalized)
        ? 1000
        : 1
  const parsed = Number(normalized.replace(/[kKmMbB]$/, ''))
  return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : undefined
}

function firstNumber(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return parseLooseNumber(match[1])
  }
  return undefined
}

function firstText(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1].trim().slice(0, 80)
  }
  return undefined
}

export function extractPlayerData(text: string): Partial<PlayerProfile> {
  const name = firstText(text, [
    /(?:joueur|player|nom)\s*[:=-]\s*([^\n]+)/i,
    /(?:name)\s*[:=-]\s*([^\n]+)/i,
  ])
  const level = firstNumber(text, [
    /(?:niveau|level|lvl|lv)\s*[:.#-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const stage = firstNumber(text, [
    /(?:stage|palier|etage|étage)\s*[:.#-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const zone = firstText(text, [/(?:zone|area)\s*[:=-]\s*([^\n]+)/i])
  const diamonds = firstNumber(text, [
    /(?:diamants?|diamonds?)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const emeralds = firstNumber(text, [
    /(?:emeraudes?|émeraudes?|emeralds?)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const gold = firstNumber(text, [
    /(?:or actuel|gold|or)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])

  const update: ProfileUpdate = {}
  if (name || level !== undefined || stage !== undefined || zone) {
    update.player = {
      ...(name ? { name } : {}),
      ...(level !== undefined ? { level } : {}),
      ...(stage !== undefined ? { stage } : {}),
      ...(zone ? { zone } : {}),
    }
  }
  if (diamonds !== undefined || emeralds !== undefined || gold !== undefined) {
    update.resources = {
      ...(diamonds !== undefined ? { diamonds } : {}),
      ...(emeralds !== undefined ? { emeralds } : {}),
      ...(gold !== undefined ? { gold } : {}),
    }
  }

  return update as Partial<PlayerProfile>
}

export function extractStats(text: string): Partial<PlayerStats> {
  const attack = firstNumber(text, [
    /(?:attaque|attack|atk)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const estimatedDamage = firstNumber(text, [
    /(?:degats estim[eé]s?|dégâts estim[eé]s?|damage)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const criticalRate = firstNumber(text, [
    /(?:critique|critical|crit)\s*(?:rate|chance|%)?\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const criticalDamage = firstNumber(text, [
    /(?:d[eé]g[aâ]ts critiques?|critical damage|crit damage)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const deathStrike = firstNumber(text, [
    /(?:frappe mortelle|death strike)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const goldPerMinute = firstNumber(text, [
    /(?:or par minute|gold per minute|gpm)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const health = firstNumber(text, [
    /(?:vie|sant[eé]|health|hp)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const defense = firstNumber(text, [
    /(?:defense|défense|def)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])

  return {
    ...(attack !== undefined ? { attack } : {}),
    ...(estimatedDamage !== undefined ? { estimatedDamage } : {}),
    ...(criticalRate !== undefined ? { criticalRate } : {}),
    ...(criticalDamage !== undefined ? { criticalDamage } : {}),
    ...(deathStrike !== undefined ? { deathStrike } : {}),
    ...(goldPerMinute !== undefined ? { goldPerMinute } : {}),
    ...(health !== undefined ? { health } : {}),
    ...(defense !== undefined ? { defense } : {}),
  }
}

export function extractGrowth(text: string): Partial<GrowthData> {
  const growthBlock = text.match(/(?:croissance|growth)([\s\S]{0,800})/i)?.[1] ?? text
  const attack = firstNumber(growthBlock, [
    /(?:attaque|attack|atk)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const health = firstNumber(growthBlock, [
    /(?:vie|sant[eé]|health|hp)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const recovery = firstNumber(growthBlock, [
    /(?:recuperation|récupération|recovery)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const critical = firstNumber(growthBlock, [
    /(?:critique|critical|crit)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])
  const deathStrike = firstNumber(growthBlock, [
    /(?:frappe mortelle|death strike)\s*[:=-]?\s*([\d\s.,kKmMbB]+)/i,
  ])

  return {
    ...(attack !== undefined ? { attack } : {}),
    ...(health !== undefined ? { health } : {}),
    ...(recovery !== undefined ? { recovery } : {}),
    ...(critical !== undefined ? { critical } : {}),
    ...(deathStrike !== undefined ? { deathStrike } : {}),
  }
}

export function extractSkills(text: string): Partial<PlayerSkill[]> {
  const skillLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /(?:skill|comp[eé]tence|niveau|level|lv)/i.test(line))
    .slice(0, 12)

  return skillLines
    .map((line, index): PlayerSkill | undefined => {
      const match = line.match(/^(.{3,48}?)\s*(?:niveau|level|lv)\.?\s*[:=-]?\s*(\d{1,4})/i)
      if (!match) return undefined
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
      } satisfies PlayerSkill
    })
    .filter((skill): skill is PlayerSkill => Boolean(skill))
}

export function extractProfileFromText(text: string): ProfileUpdate {
  const playerData = extractPlayerData(text) as ProfileUpdate
  const stats = extractStats(text)
  const growth = extractGrowth(text)
  const skills = extractSkills(text) as PlayerSkill[]

  return {
    ...playerData,
    ...(Object.keys(stats).length ? { stats } : {}),
    ...(Object.keys(growth).length ? { growth } : {}),
    ...(skills.length ? { skills } : {}),
  }
}
