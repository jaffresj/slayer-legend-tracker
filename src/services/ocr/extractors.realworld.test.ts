import { describe, expect, it } from 'vitest'
import {
  extractGrowth,
  extractPlayerData,
  extractProfileFromText,
  extractSkills,
  extractStats,
} from './extractors'

// Fragments tirés de captures RÉELLES de Slayer Legends (FR), avec le
// vocabulaire abrégé du jeu : Niv. / Étape / ATQ / PV / Frappe Mortelle…
// Ces tests verrouillent la prise en charge de ce vocabulaire (régression V1
// où aucun de ces libellés ne matchait).

describe('vocabulaire réel du jeu — joueur', () => {
  it('lit « Niv. 511 » (abréviation de Niveau)', () => {
    expect(extractPlayerData('OneShot  Niv. 511  28,16%').player?.level).toBe(511)
  })

  it('lit « ÉTAPE 160 » (et non « étage »)', () => {
    const player = extractPlayerData('ÉTAPE 160  Zone Polaire IV').player
    expect(player?.stage).toBe(160)
  })

  it('lit la zone sans séparateur « Zone Polaire IV »', () => {
    expect(extractPlayerData('Zone Polaire IV').player?.zone).toMatch(/Polaire/)
  })
})

describe('vocabulaire réel du jeu — stats & croissance', () => {
  it('lit « ATQ +14 262 » (abréviation + préfixe +, milliers espacés)', () => {
    expect(extractStats('ATQ +14 262 -> +14 309').attack).toBe(14262)
  })

  it('lit « PV +3 275 » comme vie', () => {
    expect(extractStats('PV +3 275 -> +3 603').health).toBe(3275)
  })

  it('lit « Frappe Mortelle 551% »', () => {
    expect(extractStats('Frappe Mortelle  551% => 552%').deathStrike).toBe(551)
  })

  it('lit la « Récupération de PV +1 663 » dans le bloc Croissance', () => {
    const growth = extractGrowth('Croissance\nRécupération de PV +1 663 -> +1 715')
    expect(growth.recovery).toBe(1663)
  })

  it('ne confond pas « Renforcer » avec le libellé « or »', () => {
    // Régression : « or » sans \b matchait dans « RenfORcer ».
    expect(extractPlayerData('Renforcer les PV (14865/15000)').resources?.gold).toBeUndefined()
  })
})

describe('écran de stats Personnage — pas de fausses compétences', () => {
  // Bloc réel : « Dgt CRIT / CRIT % / Frappe Mortelle » en « Libellé Niv.N ».
  const statScreen = [
    'Dgt CRIT  Niv.4125',
    '4 125% -> 4 126%   1 456 167 296',
    'CRIT %  Niv.1000',
    '100,0%  Max',
    'Frappe Mortelle  Niv.551',
    '551% -> 552%   41 787 664 563',
  ].join('\n')

  it('« Dgt CRIT » alimente les dégâts critiques, pas le taux critique', () => {
    const stats = extractStats(statScreen)
    expect(stats.criticalDamage).toBe(4125)
    expect(stats.criticalRate).not.toBe(4125)
  })

  it('ne produit AUCUNE compétence depuis un écran de stats', () => {
    expect(extractSkills(statScreen)).toEqual([])
    expect(extractProfileFromText(statScreen).skills).toBeUndefined()
  })
})

describe('intégration — en-tête multi-lignes réaliste', () => {
  it('extrait niveau + étape depuis un en-tête bruité', () => {
    const ocr = ['OneShot  Niv. 511  28,16%', 'ÉTAPE 160   Zone Polaire IV', 'AUTO'].join('\n')
    const update = extractProfileFromText(ocr)
    expect(update.player?.level).toBe(511)
    expect(update.player?.stage).toBe(160)
  })
})
