import { buildTemplates, gameSkills } from '@/data'
import type { BuildCategory, BuildTemplate, GameSkill, SkillElement } from '@/types/domain'

const skillsById = new Map<string, GameSkill>(gameSkills.map((skill) => [skill.id, skill]))

export function getSkill(id: string): GameSkill | undefined {
  return skillsById.get(id)
}

/** Nom FR d'une compétence, ou l'id brut en repli (compétence inconnue). */
export function getSkillName(id: string): string {
  return skillsById.get(id)?.name ?? id
}

export function resolveSkillNames(ids: readonly string[]): string[] {
  return ids.map(getSkillName)
}

/**
 * Recherche floue sur nom FR, nom EN, élément, tags et alias.
 * Chaîne vide → tout le catalogue.
 */
export function searchSkills(query: string): GameSkill[] {
  const q = query.trim().toLowerCase()
  if (!q) return [...gameSkills]
  return gameSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(q) ||
      skill.nameEn.toLowerCase().includes(q) ||
      skill.element.includes(q) ||
      skill.tags.some((tag) => tag.includes(q)) ||
      (skill.aliases?.some((alias) => alias.toLowerCase().includes(q)) ?? false),
  )
}

export const ELEMENT_LABELS: Record<SkillElement, string> = {
  feu: 'Feu',
  glace: 'Glace',
  foudre: 'Foudre',
  terre: 'Terre',
  vent: 'Vent',
  eau: 'Eau',
  neutre: 'Neutre',
}

const CATEGORY_LABELS: Record<BuildCategory, string> = {
  promotion: 'Promotion',
  'spirit-dungeon': 'Donjon des Esprits',
  'closed-mines': 'Mines Fermées',
  boss: 'Boss',
  farming: 'Farm',
  endgame: 'Endgame',
  adventure: 'Aventure',
  companion: 'Compagnon',
  rift: 'Faille',
}

export function categoryLabel(category: BuildCategory): string {
  return CATEGORY_LABELS[category]
}

/** Regroupe les builds méta par catégorie, dans l'ordre d'apparition. */
export function templatesByCategory(): Array<{
  category: BuildCategory
  templates: BuildTemplate[]
}> {
  const groups = new Map<BuildCategory, BuildTemplate[]>()
  for (const template of buildTemplates) {
    const list = groups.get(template.category) ?? []
    list.push(template)
    groups.set(template.category, list)
  }
  return [...groups.entries()].map(([category, templates]) => ({ category, templates }))
}
