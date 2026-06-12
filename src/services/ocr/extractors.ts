import type { GrowthData, PlayerSkill, PlayerStats, ProfileUpdate } from '@/types/domain'

// Espaces de regroupement des milliers : espace normale + insécables FR.
const THOUSANDS = ' \\u00a0\\u202f'

/**
 * Extrait le PREMIER nombre exploitable d'un fragment OCR.
 *
 * - Les milliers sont groupés par des espaces (« 14 262 », « 594 600 ») —
 *   uniquement quand le groupe fait exactement 3 chiffres, pour ne pas coller
 *   « 511 » à « 28.16 % » dans « Niv. 511 28,16 % ».
 * - Suffixes k/M/B et virgule décimale FR pris en charge.
 * - `undefined` si aucun chiffre.
 */
export function parseLooseNumber(value: string): number | undefined {
  const token = value.match(
    new RegExp(`\\d+(?:[${THOUSANDS}]\\d{3})*(?:[.,]\\d+)?\\s*[kKmMbB]?`),
  )?.[0]
  if (!token) return undefined

  const suffix = token
    .trim()
    .match(/[kKmMbB]$/)?.[0]
    ?.toLowerCase()
  const multiplier = suffix === 'b' ? 1e9 : suffix === 'm' ? 1e6 : suffix === 'k' ? 1e3 : 1
  const numeric = token
    .replace(/[kKmMbB]\s*$/, '')
    .replace(new RegExp(`[${THOUSANDS}]`, 'g'), '') // retire les séparateurs de milliers
    .replace(',', '.') // décimale FR
    .trim()

  const parsed = Number(numeric)
  return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : undefined
}

// Séparateurs tolérés entre un libellé et sa valeur (`:`, `+`, `->`, `.`, etc.),
// suivis d'une fenêtre courte où chercher le nombre (l'OCR insère du bruit).
const SEP = '[\\s:.=+#>)\\]·-]*'
const VALUE = '([^\\n]{0,24})'

/** Construit une regex « libellé puis valeur » à partir d'alternatives. */
function labelPattern(labels: string): RegExp {
  return new RegExp(`(?:${labels})${SEP}${VALUE}`, 'i')
}

function firstNumber(text: string, labels: string): number | undefined {
  const match = text.match(labelPattern(labels))
  return match?.[1] ? parseLooseNumber(match[1]) : undefined
}

function firstText(text: string, pattern: RegExp): string | undefined {
  const match = text.match(pattern)
  return match?.[1] ? match[1].trim().slice(0, 80) : undefined
}

/** Construit un objet en n'incluant que les paires dont la valeur est définie. */
function defined<T extends Record<string, unknown>>(entries: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(entries) as Array<keyof T>) {
    if (entries[key] !== undefined) result[key] = entries[key]
  }
  return result
}

// Vocabulaire réel du jeu (FR) : abréviations Niv. / Étape / ATQ / PV …
// Les libellés courts (2-3 lettres) sont bornés par \b pour limiter les faux
// positifs (« or » ne doit pas matcher dans « RenfORcer »).
const LABELS = {
  level: 'niveau|\\bniv\\b|level|lvl|\\blv\\b',
  stage: 'etape|étape|stage|palier|etage|étage',
  diamonds: 'diamants?|diamonds?',
  emeralds: 'emeraudes?|émeraudes?|emeralds?',
  gold: 'or actuel|gold|\\bor\\b',
  attack: 'attaque|\\batq\\b|attack|\\batk\\b',
  estimatedDamage: 'degats estim[eé]s?|dégâts estim[eé]s?|damage',
  // « crit » seul est volontairement exclu pour ne pas capturer « Dgt CRIT »
  // (qui est le DÉGÂT critique, géré par criticalDamage ci-dessous).
  criticalRate: 'taux critique|critique|crit\\s*%|critical rate',
  criticalDamage: 'd[eé]g[aâ]ts critiques?|dgt crit|critical damage',
  deathStrike: 'frappe mortelle|death strike',
  goldPerMinute: 'or par minute|gold per minute|\\bgpm\\b',
  health: '\\bpv\\b|\\bvie\\b|sant[eé]|health|\\bhp\\b',
  defense: 'defense|défense|\\bdef\\b',
  recovery: 'r[eé]cup[eé]ration|recovery',
} as const

export function extractPlayerData(text: string): Pick<ProfileUpdate, 'player' | 'resources'> {
  const player = defined({
    name: firstText(text, /(?:joueur|player|pseudo|nom)\s*[:=-]\s*([^\n]+)/i),
    level: firstNumber(text, LABELS.level),
    stage: firstNumber(text, LABELS.stage),
    // La zone n'a pas de séparateur dans le jeu (« Zone Polaire IV »).
    zone: firstText(text, /(?:zone|area)[\s:=-]*([A-Za-zÀ-ÿ][^\n]{1,28})/i),
  })

  const resources = defined({
    diamonds: firstNumber(text, LABELS.diamonds),
    emeralds: firstNumber(text, LABELS.emeralds),
    gold: firstNumber(text, LABELS.gold),
  })

  return {
    ...(Object.keys(player).length ? { player } : {}),
    ...(Object.keys(resources).length ? { resources } : {}),
  }
}

export function extractStats(text: string): Partial<PlayerStats> {
  return defined({
    attack: firstNumber(text, LABELS.attack),
    estimatedDamage: firstNumber(text, LABELS.estimatedDamage),
    criticalRate: firstNumber(text, LABELS.criticalRate),
    criticalDamage: firstNumber(text, LABELS.criticalDamage),
    deathStrike: firstNumber(text, LABELS.deathStrike),
    goldPerMinute: firstNumber(text, LABELS.goldPerMinute),
    health: firstNumber(text, LABELS.health),
    defense: firstNumber(text, LABELS.defense),
  })
}

export function extractGrowth(text: string): Partial<GrowthData> {
  // Limite la recherche au bloc « Croissance » quand il est présent.
  const growthBlock = text.match(/(?:croissance|growth)([\s\S]{0,800})/i)?.[1] ?? text
  return defined({
    attack: firstNumber(growthBlock, LABELS.attack),
    health: firstNumber(growthBlock, LABELS.health),
    recovery: firstNumber(growthBlock, LABELS.recovery),
    critical: firstNumber(growthBlock, LABELS.criticalRate),
    deathStrike: firstNumber(growthBlock, LABELS.deathStrike),
  })
}

// Libellés de STATS à ne jamais confondre avec des compétences (même si l'OCR
// les présente bizarrement). Les vraies compétences du jeu n'utilisent pas
// « Niv.N » mais une maîtrise « courant/max ».
const STAT_LABELS_IN_SKILL =
  /(dgt\s*crit|crit\s*%|frappe mortelle|r[eé]cup[eé]ration|\batq\b|\bpv\b|niveau|niv\.|étape|etape|esquive|pr[eé]cision)/i

/**
 * Détecte les compétences au format réel du jeu : « Nom  courant/max »
 * (ex. « Épée Brûlante 4/16 »). Ce format exclut structurellement les lignes
 * de stats « Libellé Niv.N » qui polluaient la V1, et on filtre en plus tout
 * nom contenant un libellé de stat.
 */
export function extractSkills(text: string): PlayerSkill[] {
  const skills: PlayerSkill[] = []
  for (const rawLine of text.split(/\r?\n/)) {
    if (skills.length >= 12) break
    const line = rawLine.trim()
    const match = line.match(/^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’ .-]{2,40}?)\s+(\d{1,3})\s*\/\s*\d{1,3}\b/)
    if (!match?.[1] || !match[2]) continue

    const name = match[1].trim()
    if (!/[A-Za-zÀ-ÿ]{3,}/.test(name) || STAT_LABELS_IN_SKILL.test(name)) continue

    const level = Number(match[2])
    if (!Number.isFinite(level)) continue

    skills.push({
      id: `ocr-skill-${skills.length}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name,
      rarity: 'exemple',
      description: 'Compétence détectée par OCR V1, à vérifier manuellement.',
      type: 'ocr',
      tags: ['ocr'],
      level,
      equipped: false,
    })
  }
  return skills
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
