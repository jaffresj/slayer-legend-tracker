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

  it('retourne undefined quand il n’y a aucun chiffre', () => {
    expect(parseLooseNumber('Niv.')).toBeUndefined()
    expect(parseLooseNumber('aucune donnée')).toBeUndefined()
  })

  it('ne colle pas deux nombres séparés par une espace courte', () => {
    // « Niv. 511 28,16 % » ne doit pas donner 51128.
    expect(parseLooseNumber('511 28,16')).toBe(511)
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
  it('détecte le format de maîtrise réel "Nom courant/max"', () => {
    const skills = extractSkills('Épée Brûlante 4/16\nbruit\nMana de vie 27/3')
    expect(skills).toHaveLength(2)
    expect(skills[0]).toMatchObject({ name: 'Épée Brûlante', level: 4, rarity: 'exemple' })
  })

  it('ne confond PAS les lignes de stats "Libellé Niv.N" avec des compétences', () => {
    // Régression : ces lignes remplissaient la liste de compétences de déchets.
    const skills = extractSkills('Dgt CRIT Niv.4125\nFrappe Mortelle Niv.551\nATQ Niv.16055')
    expect(skills).toEqual([])
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
