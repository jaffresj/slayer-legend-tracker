import type { PlayerProfile, Stage, TaggedGameItem } from '@/types/domain'
import companionsJson from './companions.json'
import equipmentJson from './equipment.json'
import playerJson from './player.json'
import relicsJson from './relics.json'
import stagesJson from './stages.json'

// Les imports JSON élargissent les littéraux (ex: rarity devient string), un
// cast est donc inévitable ici. Ces casts sont couverts par src/data/data.test.ts
// qui valide chaque fichier avec les guards de lib/validate.
export const defaultProfile = playerJson as PlayerProfile

export const gameCompanions = companionsJson as TaggedGameItem[]
export const gameEquipment = equipmentJson as TaggedGameItem[]
export const gameRelics = relicsJson as TaggedGameItem[]

// Trié par stage croissant : le moteur de recommandations cherche le prochain
// palier avec find() et dépend de cet ordre.
export const gameStages = (stagesJson as Stage[]).slice().sort((a, b) => a.stage - b.stage)

// Catalogue de compétences et builds méta : modules TS type-vérifiés (pas de cast).
export { gameSkills } from './skills'
export type { SkillId } from './skills'
export { buildTemplates } from './buildTemplates'
