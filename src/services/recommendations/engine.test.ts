import { describe, expect, it } from 'vitest'
import { defaultProfile } from '@/data'
import { clampScore, getRecommendations, priorityFromScore } from './engine'

describe('clampScore', () => {
  it('borne le score entre 0 et 100 et arrondit', () => {
    expect(clampScore(-10)).toBe(0)
    expect(clampScore(150)).toBe(100)
    expect(clampScore(42.6)).toBe(43)
  })
})

describe('priorityFromScore', () => {
  it.each([
    [90, 'very-high'],
    [70, 'high'],
    [50, 'medium'],
    [10, 'low'],
  ] as const)('mappe %d → %s', (score, priority) => {
    expect(priorityFromScore(score)).toBe(priority)
  })
})

describe('getRecommendations', () => {
  it('retourne 8 recommandations triées par score décroissant', () => {
    const recs = getRecommendations(defaultProfile, 'push_stage')
    expect(recs).toHaveLength(8)
    const scores = recs.map((r) => r.score)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })

  it("priorise l'or pour l'objectif farm_gold vs push_stage", () => {
    const farm = getRecommendations(defaultProfile, 'farm_gold')
    const push = getRecommendations(defaultProfile, 'push_stage')
    const goldFarm = farm.find((r) => r.id === 'upgrade-gold')?.score ?? 0
    const goldPush = push.find((r) => r.id === 'upgrade-gold')?.score ?? 0
    expect(goldFarm).toBeGreaterThan(goldPush)
  })

  it("rehausse la survie sous l'objectif survie par rapport au push", () => {
    // Invariant robuste : on compare le même item entre deux objectifs
    // (les scores absolus dépendent du profil, l'effet du modificateur non).
    const survie = getRecommendations(defaultProfile, 'survie')
    const push = getRecommendations(defaultProfile, 'push_stage')
    const survivalSurvie = survie.find((r) => r.id === 'upgrade-survival')?.score ?? 0
    const survivalPush = push.find((r) => r.id === 'upgrade-survival')?.score ?? 0
    expect(survivalSurvie).toBeGreaterThan(survivalPush)
  })

  it('garde tous les scores dans [0, 100]', () => {
    for (const rec of getRecommendations(defaultProfile, 'boss')) {
      expect(rec.score).toBeGreaterThanOrEqual(0)
      expect(rec.score).toBeLessThanOrEqual(100)
    }
  })

  it('déprioritise une famille de skills déjà couverte par un build', () => {
    const without = getRecommendations(defaultProfile, 'push_stage')
    const covered = getRecommendations(defaultProfile, 'push_stage', new Set(['critique']))
    const scoreWithout = without.find((r) => r.id === 'skill-critical')?.score ?? 0
    const scoreCovered = covered.find((r) => r.id === 'skill-critical')?.score ?? 0
    expect(scoreCovered).toBeLessThan(scoreWithout)
  })
})
