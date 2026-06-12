import { describe, expect, it } from 'vitest'
import { defaultProfile } from '@/data'
import { mergeProfile, snapshotFromProfile } from './profile'

describe('mergeProfile', () => {
  it('fusionne partiellement une section sans écraser les autres champs', () => {
    const merged = mergeProfile(defaultProfile, { stats: { attack: 99999 } })
    expect(merged.stats.attack).toBe(99999)
    // Les autres stats restent intactes.
    expect(merged.stats.defense).toBe(defaultProfile.stats.defense)
    expect(merged.player).toEqual(defaultProfile.player)
  })

  it('remplace entièrement une liste fournie', () => {
    const merged = mergeProfile(defaultProfile, { skills: [] })
    expect(merged.skills).toEqual([])
  })

  it('ne mute pas le profil source', () => {
    const snapshot = JSON.stringify(defaultProfile)
    mergeProfile(defaultProfile, { player: { level: 1 } })
    expect(JSON.stringify(defaultProfile)).toBe(snapshot)
  })
})

describe('snapshotFromProfile', () => {
  it('extrait les métriques suivies', () => {
    const snapshot = snapshotFromProfile(defaultProfile)
    expect(snapshot.level).toBe(defaultProfile.player.level)
    expect(snapshot.stage).toBe(defaultProfile.player.stage)
    expect(snapshot.attack).toBe(defaultProfile.stats.attack)
    expect(snapshot.id).toMatch(/^snapshot-/)
  })
})
