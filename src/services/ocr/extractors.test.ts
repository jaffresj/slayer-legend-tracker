import { describe, expect, it } from 'vitest'
import { extractProfileFromText, extractSkills, extractStats, parseLooseNumber } from './extractors'

describe('parseLooseNumber', () => {
  it.each([
    ['1 200', 1200],
    ['1,2k', 1200],
    ['3.5M', 3_500_000],
    ['2B', 2_000_000_000],
    ['15787', 15787],
  ])('parse %s → %d', (input, expected) => {
    expect(parseLooseNumber(input)).toBe(expected)
  })

  it('retourne undefined pour une valeur non numérique', () => {
    // Capture OCR brouillée : plusieurs séparateurs → Number() = NaN.
    expect(parseLooseNumber('1.2.3')).toBeUndefined()
  })
})

describe('extractStats', () => {
  it('extrait attaque et critique depuis un texte fr', () => {
    const stats = extractStats('Attaque : 15 787\nCritique 32 %')
    expect(stats.attack).toBe(15787)
    expect(stats.criticalRate).toBe(32)
  })

  it('omet les clés non détectées', () => {
    expect(extractStats('aucune donnée ici')).toEqual({})
  })
})

describe('extractSkills', () => {
  it('détecte les lignes "nom niveau N"', () => {
    const skills = extractSkills('Lame critique niveau 24\nbruit\nGarde lv 5')
    expect(skills).toHaveLength(2)
    expect(skills[0]).toMatchObject({ name: 'Lame critique', level: 24, rarity: 'exemple' })
  })
})

describe('extractProfileFromText', () => {
  it('agrège player + stats en un seul ProfileUpdate', () => {
    const update = extractProfileFromText('Niveau: 511\nStage: 160\nAttaque: 15787')
    expect(update.player).toMatchObject({ level: 511, stage: 160 })
    expect(update.stats).toMatchObject({ attack: 15787 })
  })

  it('ne produit pas de sections vides', () => {
    const update = extractProfileFromText('texte sans rien de pertinent')
    expect(update.stats).toBeUndefined()
    expect(update.growth).toBeUndefined()
  })
})
