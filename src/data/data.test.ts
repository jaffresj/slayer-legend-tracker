import { describe, expect, it } from 'vitest'
import { getSkill } from '@/lib/skills'
import { isTaggedGameItem } from '@/lib/validate'
import {
  buildTemplates,
  defaultProfile,
  gameCompanions,
  gameEquipment,
  gameRelics,
  gameSkills,
  gameStages,
} from './index'

const ELEMENTS = ['feu', 'glace', 'foudre', 'terre', 'vent', 'eau', 'neutre']
const KINDS = ['active', 'passive', 'buff', 'immortal']

// Ces tests verrouillent les casts `as` de src/data/index.ts et la cohérence
// du catalogue : si une donnée dérive, le build casse de façon explicite.
describe('données TaggedGameItem (companions / equipment / relics)', () => {
  it.each([
    ['companions', gameCompanions],
    ['equipment', gameEquipment],
    ['relics', gameRelics],
  ])('%s respecte la structure TaggedGameItem', (_label, items) => {
    expect(items.length).toBeGreaterThan(0)
    expect(items.every(isTaggedGameItem)).toBe(true)
  })
})

describe('catalogue de compétences', () => {
  it('chaque compétence a un élément et un type valides', () => {
    expect(gameSkills.length).toBeGreaterThan(0)
    for (const skill of gameSkills) {
      expect(ELEMENTS).toContain(skill.element)
      expect(KINDS).toContain(skill.kind)
      expect(skill.name.length).toBeGreaterThan(0)
      expect(skill.nameEn.length).toBeGreaterThan(0)
    }
  })

  it('les ids de compétences sont uniques', () => {
    const ids = gameSkills.map((skill) => skill.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('builds méta', () => {
  it('chaque build référence des compétences existantes et non vides', () => {
    expect(buildTemplates.length).toBeGreaterThan(0)
    for (const template of buildTemplates) {
      expect(template.skills.length).toBeGreaterThan(0)
      for (const skillId of template.skills) {
        expect(getSkill(skillId), `${template.id} → ${skillId}`).toBeDefined()
      }
    }
  })

  it('les ids de builds sont uniques', () => {
    const ids = buildTemplates.map((template) => template.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('stages & profil par défaut', () => {
  it('les stages sont triés par numéro croissant', () => {
    const numbers = gameStages.map((stage) => stage.stage)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
  })

  it('le profil par défaut possède toutes les sections', () => {
    expect(defaultProfile.player).toBeDefined()
    expect(defaultProfile.resources).toBeDefined()
    expect(defaultProfile.stats).toBeDefined()
    expect(defaultProfile.growth).toBeDefined()
  })
})
