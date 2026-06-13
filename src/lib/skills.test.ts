import { describe, expect, it } from 'vitest'
import { buildTemplates, gameSkills } from '@/data'
import { isPlayerSkill } from './validate'
import {
  ELEMENT_LABELS,
  categoryLabel,
  getSkill,
  getSkillName,
  recommendedBuilds,
  resolveSkillNames,
  searchSkills,
  templatesByCategory,
  toPlayerSkill,
} from './skills'

describe('searchSkills', () => {
  it('retourne tout le catalogue pour une requête vide', () => {
    expect(searchSkills('')).toHaveLength(gameSkills.length)
    expect(searchSkills('   ')).toHaveLength(gameSkills.length)
  })

  it('trouve par nom FR', () => {
    const results = searchSkills('foudre rouge')
    expect(results.map((s) => s.id)).toContain('red-lightning')
  })

  it('trouve par nom EN (guide)', () => {
    const results = searchSkills('red lightning')
    expect(results.map((s) => s.id)).toContain('red-lightning')
  })

  it('filtre par élément', () => {
    const results = searchSkills('glace')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((s) => s.element === 'glace')).toBe(true)
  })

  it('est insensible à la casse', () => {
    expect(searchSkills('FULGURANT').map((s) => s.id)).toContain('fulgurous')
  })
})

describe('getSkillName / resolveSkillNames', () => {
  it('résout un id en nom FR', () => {
    expect(getSkillName('iron-will')).toBe('Volonté de Fer')
  })

  it('retombe sur l’id pour une compétence inconnue', () => {
    expect(getSkillName('does-not-exist')).toBe('does-not-exist')
  })

  it('résout une liste d’ids', () => {
    expect(resolveSkillNames(['fulgurous', 'rage'])).toEqual(['Fulgurant', 'Rage'])
  })

  it('getSkill retourne l’objet complet', () => {
    expect(getSkill('rave')?.kind).toBe('immortal')
  })
})

describe('templatesByCategory', () => {
  it('regroupe sans perdre de build', () => {
    const groups = templatesByCategory()
    const total = groups.reduce((sum, group) => sum + group.templates.length, 0)
    expect(total).toBe(buildTemplates.length)
  })

  it('chaque catégorie a un libellé', () => {
    for (const { category } of templatesByCategory()) {
      expect(categoryLabel(category).length).toBeGreaterThan(0)
    }
  })
})

describe('libellés d’éléments', () => {
  it('couvre tous les éléments présents dans le catalogue', () => {
    for (const skill of gameSkills) {
      expect(ELEMENT_LABELS[skill.element]).toBeDefined()
    }
  })
})

describe('toPlayerSkill', () => {
  it('construit une compétence possédée valide depuis le catalogue', () => {
    const skill = getSkill('fulgurous')
    expect(skill).toBeDefined()
    const owned = toPlayerSkill(skill!, 5, true)
    expect(owned).toMatchObject({ id: 'fulgurous', name: 'Fulgurant', level: 5, equipped: true })
    expect(isPlayerSkill(owned)).toBe(true)
  })

  it('niveau 1 / non équipée par défaut', () => {
    const owned = toPlayerSkill(getSkill('rage')!)
    expect(owned.level).toBe(1)
    expect(owned.equipped).toBe(false)
  })
})

describe('recommendedBuilds', () => {
  it('renvoie des builds dont l’objectif correspond', () => {
    const builds = recommendedBuilds('boss')
    expect(builds.length).toBeGreaterThan(0)
    expect(builds.every((build) => build.goal === 'boss')).toBe(true)
  })

  it('retombe sur des builds défensifs quand aucun objectif ne correspond', () => {
    // Aucun template n'a goal === 'survie' → repli iron-will / earths-will.
    const builds = recommendedBuilds('survie')
    expect(builds.length).toBeGreaterThan(0)
    expect(
      builds.every(
        (build) => build.skills.includes('iron-will') || build.skills.includes('earths-will'),
      ),
    ).toBe(true)
  })

  it('respecte la limite', () => {
    expect(recommendedBuilds('farm_gold', 2).length).toBeLessThanOrEqual(2)
  })
})
