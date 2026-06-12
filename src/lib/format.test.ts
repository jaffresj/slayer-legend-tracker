import { describe, expect, it } from 'vitest'
import { formatNumber, formatPercent, parseNumberInput } from './format'

describe('formatNumber', () => {
  it('groupe les milliers en format fr-FR', () => {
    // L'espace est une espace insécable étroite (U+202F) selon l'ICU.
    expect(formatNumber(15787).replace(/\s/g, ' ')).toBe('15 787')
  })

  it('remplace les valeurs non finies par 0', () => {
    expect(formatNumber(Number.NaN)).toBe('0')
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('0')
  })
})

describe('formatPercent', () => {
  it('ajoute le suffixe pourcentage', () => {
    expect(formatPercent(32)).toMatch(/32\s%/)
  })
})

describe('parseNumberInput', () => {
  it('accepte les virgules décimales et les espaces', () => {
    expect(parseNumberInput('1 200,5')).toBe(1200.5)
  })

  it('retourne 0 pour une entrée non numérique', () => {
    expect(parseNumberInput('abc')).toBe(0)
    expect(parseNumberInput('')).toBe(0)
  })
})
