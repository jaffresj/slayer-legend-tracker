import { describe, expect, it } from 'vitest'
import { isTaggedGameItem } from '@/lib/validate'
import {
  defaultProfile,
  gameCompanions,
  gameEquipment,
  gameRelics,
  gameSkills,
  gameStages,
} from './index'

// Ces tests verrouillent les casts `as` de src/data/index.ts : si un fichier
// JSON dérive de la structure attendue, le build casse de façon explicite.
describe('fichiers de données du jeu', () => {
  it.each([
    ['skills', gameSkills],
    ['companions', gameCompanions],
    ['equipment', gameEquipment],
    ['relics', gameRelics],
  ])('%s respecte la structure TaggedGameItem', (_label, items) => {
    expect(items.length).toBeGreaterThan(0)
    expect(items.every(isTaggedGameItem)).toBe(true)
  })

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
