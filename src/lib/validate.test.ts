import { describe, expect, it } from 'vitest'
import { defaultProfile } from '@/data'
import { isPlayerSkill, isSnapshot, normalizeAppExport, parseJsonArray } from './validate'

describe('isPlayerSkill', () => {
  it('valide une compétence complète', () => {
    expect(isPlayerSkill(defaultProfile.skills[0])).toBe(true)
  })

  it('rejette un objet auquel il manque des champs', () => {
    expect(isPlayerSkill({ id: 'x', name: 'y' })).toBe(false)
    expect(isPlayerSkill(null)).toBe(false)
  })
})

describe('isSnapshot', () => {
  it('rejette les nombres non finis', () => {
    expect(
      isSnapshot({
        id: 'a',
        date: 'b',
        level: Number.NaN,
        stage: 1,
        attack: 1,
        criticalRate: 1,
        deathStrike: 1,
        goldPerMinute: 1,
      }),
    ).toBe(false)
  })
})

describe('parseJsonArray', () => {
  it('parse et valide un tableau homogène', () => {
    const json = JSON.stringify(defaultProfile.skills)
    expect(parseJsonArray(json, isPlayerSkill)).toHaveLength(defaultProfile.skills.length)
  })

  it('retourne null pour un JSON malformé', () => {
    expect(parseJsonArray('{not json', isPlayerSkill)).toBeNull()
  })

  it('retourne null si un élément échoue à la validation', () => {
    expect(parseJsonArray('[{"id":"x"}]', isPlayerSkill)).toBeNull()
  })
})

describe('normalizeAppExport', () => {
  it('nettoie les entrées corrompues au lieu de tout rejeter', () => {
    const result = normalizeAppExport(
      {
        profile: defaultProfile,
        snapshots: [{ id: 'bad' }, ...[]],
        builds: 'not-an-array',
        daily: null,
      },
      defaultProfile,
    )
    expect(result).not.toBeNull()
    expect(result?.snapshots).toEqual([]) // snapshot invalide filtré
    expect(result?.builds).toEqual([]) // type invalide → tableau vide
    expect(result?.profile.player.name).toBe(defaultProfile.player.name)
  })

  it('retourne null si le profil est absent ou invalide', () => {
    expect(normalizeAppExport({ snapshots: [] }, defaultProfile)).toBeNull()
    expect(normalizeAppExport('nope', defaultProfile)).toBeNull()
  })

  it('récupère les champs numériques valides du profil importé', () => {
    const result = normalizeAppExport(
      { profile: { ...defaultProfile, stats: { attack: 42 } } },
      defaultProfile,
    )
    expect(result?.profile.stats.attack).toBe(42)
    // Champ manquant → valeur par défaut conservée.
    expect(result?.profile.stats.defense).toBe(defaultProfile.stats.defense)
  })
})
