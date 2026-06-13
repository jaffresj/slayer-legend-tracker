import { describe, expect, it } from 'vitest'
import type { PlayerStats } from '@/types/domain'
import { computeEstimatedDamage } from './stats'

const base: PlayerStats = {
  attack: 10000,
  criticalRate: 30,
  criticalDamage: 180,
  deathStrike: 10,
  goldPerMinute: 0,
  health: 0,
  defense: 0,
}

// Tests volontairement indépendants des coefficients exacts : ils vérifient des
// propriétés (entier fini, monotonie) qui doivent rester vraies même après
// calibration de la formule.
describe('computeEstimatedDamage', () => {
  it('retourne un entier fini positif', () => {
    const value = computeEstimatedDamage(base)
    expect(Number.isInteger(value)).toBe(true)
    expect(value).toBeGreaterThan(0)
  })

  it('croît avec l’attaque', () => {
    const more = computeEstimatedDamage({ ...base, attack: base.attack * 2 })
    expect(more).toBeGreaterThan(computeEstimatedDamage(base))
  })

  it('ne décroît pas quand le critique augmente', () => {
    const more = computeEstimatedDamage({ ...base, criticalDamage: base.criticalDamage + 100 })
    expect(more).toBeGreaterThanOrEqual(computeEstimatedDamage(base))
  })

  it('reste défini pour des stats à zéro', () => {
    const zero = computeEstimatedDamage({ ...base, attack: 0 })
    expect(Number.isFinite(zero)).toBe(true)
  })
})
