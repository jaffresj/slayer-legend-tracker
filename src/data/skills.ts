import type { GameSkill } from '@/types/domain'

/**
 * Catalogue des compétences de Slayer Legend.
 *
 * `name` = nom FR observé en jeu ; `nameEn` = nom du guide communautaire EN
 * (Grumpus). `tentative: true` marque les traductions FR non confirmées par une
 * capture (le nom EN reste fiable et sert au mapping/recherche).
 *
 * `as const satisfies` valide chaque entrée à la compilation ET produit le type
 * `SkillId` (union littérale de tous les ids), utilisé par buildTemplates.ts
 * pour garantir qu'aucun build ne référence une compétence inexistante.
 */
const CATALOG = [
  // — Feu —
  {
    id: 'flame-wave',
    name: 'Vague de Flamme',
    nameEn: 'Flame Wave',
    element: 'feu',
    kind: 'active',
    tags: ['aoe', 'progression'],
  },
  {
    id: 'burning-sword',
    name: 'Épée Brûlante',
    nameEn: 'Burning Sword',
    element: 'feu',
    kind: 'passive',
    tags: ['buff', 'progression'],
  },
  {
    id: 'fire-sword',
    name: 'Épée de Feu',
    nameEn: 'Fire Sword',
    element: 'feu',
    kind: 'active',
    tags: ['aoe', 'farm'],
  },
  {
    id: 'hellfire-slash',
    name: "Coup de Feu de l'Enfer",
    nameEn: 'Hellfire Slash',
    element: 'feu',
    kind: 'active',
    tags: ['aoe', 'boss'],
  },
  {
    id: 'fire-strike',
    name: 'Coup de Feu',
    nameEn: 'Fire Strike',
    element: 'feu',
    kind: 'active',
    tags: ['mono'],
  },
  {
    id: 'flame-slash',
    name: 'Tranchant de Feu',
    nameEn: 'Flame Slash',
    element: 'feu',
    kind: 'active',
    tags: ['aoe'],
  },
  {
    id: 'fire-blast',
    name: 'Déflagration',
    nameEn: 'Fire Blast',
    element: 'feu',
    kind: 'active',
    tags: ['mono', 'boss'],
    aliases: ['Hot Blast', 'Detonation'],
  },
  {
    id: 'flame-pillar',
    name: 'Pilier de Flammes',
    nameEn: 'Flame Pillar',
    element: 'feu',
    kind: 'active',
    tags: ['aoe', 'endgame'],
    tentative: true,
  },
  {
    id: 'warrior-burn',
    name: 'Brûlure Guerrière',
    nameEn: 'Warrior Burn',
    element: 'feu',
    kind: 'buff',
    tags: ['buff', 'boss', 'endgame'],
    tentative: true,
  },

  // — Glace —
  {
    id: 'blizzard',
    name: 'Douche de Glace',
    nameEn: 'Blizzard',
    element: 'glace',
    kind: 'active',
    tags: ['aoe', 'farm'],
    tentative: true,
  },
  {
    id: 'ice-stone',
    name: 'Pierre Glace',
    nameEn: 'Ice Stone',
    element: 'glace',
    kind: 'active',
    tags: ['mono'],
  },
  {
    id: 'ice-time',
    name: 'Temps de Glace',
    nameEn: 'Ice Time',
    element: 'glace',
    kind: 'active',
    tags: ['controle'],
  },

  // — Foudre —
  {
    id: 'red-lightning',
    name: 'Foudre Rouge',
    nameEn: 'Red Lightning',
    element: 'foudre',
    kind: 'active',
    tags: ['aoe', 'boss', 'progression'],
  },
  {
    id: 'thunderbolt-slash',
    name: 'Entaille de Foudre',
    nameEn: 'Thunderbolt Slash',
    element: 'foudre',
    kind: 'active',
    tags: ['mono', 'boss'],
  },
  {
    id: 'lightning-stroke',
    name: 'Coup de Foudre',
    nameEn: 'Lightning Stroke',
    element: 'foudre',
    kind: 'active',
    tags: ['aoe', 'critique'],
  },
  {
    id: 'fulgurous',
    name: 'Fulgurant',
    nameEn: 'Fulgurous',
    element: 'foudre',
    kind: 'passive',
    tags: ['farm', 'or', 'aoe', 'progression'],
  },
  {
    id: 'strong-current',
    name: 'Coup de Force',
    nameEn: 'Strong Current',
    element: 'foudre',
    kind: 'active',
    tags: ['aoe'],
    tentative: true,
  },
  {
    id: 'thunder-slash',
    name: 'Éclair Tranchant',
    nameEn: 'Thunder Slash',
    element: 'foudre',
    kind: 'active',
    tags: ['mono'],
    tentative: true,
  },
  {
    id: 'lightning-body',
    name: 'Corps Foudroyant',
    nameEn: 'Lightning Body',
    element: 'foudre',
    kind: 'passive',
    tags: ['buff', 'endgame'],
    tentative: true,
  },

  // — Terre —
  {
    id: 'earths-will',
    name: 'Volonté de la Terre',
    nameEn: "Earth's Will",
    element: 'terre',
    kind: 'passive',
    tags: ['survie', 'buff', 'progression'],
  },
  {
    id: 'power-impact',
    name: 'Impact de Puissance',
    nameEn: 'Power Impact',
    element: 'terre',
    kind: 'active',
    tags: ['stun', 'boss', 'controle'],
  },
  {
    id: 'stone-strike',
    name: 'Coup de Pierre',
    nameEn: 'Stone Strike',
    element: 'terre',
    kind: 'active',
    tags: ['mono'],
  },
  {
    id: 'earth-blessing',
    name: 'Bénédiction de la Terre',
    nameEn: 'Earth Blessing',
    element: 'terre',
    kind: 'passive',
    tags: ['survie', 'defense', 'buff'],
  },

  // — Vent —
  {
    id: 'supersonic',
    name: 'Supersonique',
    nameEn: 'Supersonic',
    element: 'vent',
    kind: 'active',
    tags: ['mono', 'boss', 'farm'],
    tentative: true,
  },
  {
    id: 'wind-sword',
    name: 'Épée du Vent',
    nameEn: 'Wind Sword',
    element: 'vent',
    kind: 'active',
    tags: ['aoe'],
  },

  // — Eau —
  {
    id: 'water-slash',
    name: "Coup de fouet d'Eau",
    nameEn: 'Water Slash',
    element: 'eau',
    kind: 'active',
    tags: ['aoe'],
  },
  {
    id: 'dancing-waves',
    name: 'Vagues Dansantes',
    nameEn: 'Dancing Waves',
    element: 'eau',
    kind: 'active',
    tags: ['aoe'],
  },
  {
    id: 'flowing-blade',
    name: 'Lame Continue',
    nameEn: 'Flowing Blade',
    element: 'eau',
    kind: 'passive',
    tags: ['buff', 'farm', 'progression'],
    tentative: true,
  },

  // — Neutre / utilitaire —
  {
    id: 'iron-will',
    name: 'Volonté de Fer',
    nameEn: 'Iron Will',
    element: 'neutre',
    kind: 'passive',
    tags: ['survie', 'defense', 'buff'],
  },
  {
    id: 'speed-sword',
    name: 'Épée de Vitesse',
    nameEn: 'Speed Sword',
    element: 'neutre',
    kind: 'passive',
    tags: ['buff', 'progression'],
  },
  {
    id: 'curved-blade',
    name: 'Lame Courbée',
    nameEn: 'Curved Blade',
    element: 'neutre',
    kind: 'active',
    tags: ['mono', 'critique', 'boss'],
  },
  {
    id: 'agile-movement',
    name: 'Agile',
    nameEn: 'Agile Movement',
    element: 'neutre',
    kind: 'passive',
    tags: ['buff'],
  },
  {
    id: 'meditation',
    name: 'Méditation',
    nameEn: 'Meditation',
    element: 'neutre',
    kind: 'active',
    tags: ['mana', 'survie'],
  },
  {
    id: 'rage',
    name: 'Rage',
    nameEn: 'Rage',
    element: 'neutre',
    kind: 'buff',
    tags: ['buff', 'boss'],
  },
  {
    id: 'mana-of-life',
    name: 'Mana de vie',
    nameEn: 'Mana of Life',
    element: 'neutre',
    kind: 'passive',
    tags: ['mana', 'survie'],
  },
  {
    id: 'mana-blessing',
    name: 'Bénédiction de Mana',
    nameEn: 'Mana Blessing',
    element: 'neutre',
    kind: 'passive',
    tags: ['mana', 'buff'],
  },
  {
    id: 'giga-strike',
    name: 'Frappe Giga',
    nameEn: 'Giga Strike',
    element: 'neutre',
    kind: 'active',
    tags: ['mono', 'boss', 'endgame'],
    tentative: true,
  },
  {
    id: 'demon-hunt',
    name: 'Chasse au Démon',
    nameEn: 'Demon Hunt',
    element: 'neutre',
    kind: 'active',
    tags: ['boss', 'endgame'],
    tentative: true,
  },
  {
    id: 'wrath-of-god',
    name: 'Courroux Divin',
    nameEn: 'Wrath of God',
    element: 'neutre',
    kind: 'buff',
    tags: ['buff', 'boss', 'endgame'],
    tentative: true,
  },

  // — Immortelles (épée Orr) —
  {
    id: 'rave',
    name: 'Rave',
    nameEn: 'Rave',
    element: 'neutre',
    kind: 'immortal',
    tags: ['boss', 'endgame', 'immortal'],
  },
  {
    id: 'mantra',
    name: 'Mantra',
    nameEn: 'Mantra',
    element: 'neutre',
    kind: 'immortal',
    tags: ['buff', 'endgame', 'immortal'],
  },
] as const satisfies readonly GameSkill[]

/** Union littérale de tous les ids — utilisée pour valider les builds méta. */
export type SkillId = (typeof CATALOG)[number]['id']

// Exporté élargi en `readonly GameSkill[]` : les consommateurs voient le type
// commun (aliases optionnel, tags string[]) plutôt que 41 littéraux disjoints.
export const gameSkills: readonly GameSkill[] = CATALOG
