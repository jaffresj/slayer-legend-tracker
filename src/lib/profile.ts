import type { PlayerProfile, ProfileUpdate, Snapshot } from '@/types/domain'
import { getDateTimeKey, makeId } from '@/lib/dates'

/** Fusion immuable et section par section d'un patch partiel dans le profil. */
export function mergeProfile(profile: PlayerProfile, update: ProfileUpdate): PlayerProfile {
  return {
    player: { ...profile.player, ...update.player },
    resources: { ...profile.resources, ...update.resources },
    stats: { ...profile.stats, ...update.stats },
    growth: { ...profile.growth, ...update.growth },
    skills: update.skills ?? profile.skills,
    companions: update.companions ?? profile.companions,
    equipment: update.equipment ?? profile.equipment,
    relics: update.relics ?? profile.relics,
  }
}

/** Capture les métriques suivies dans l'historique à partir d'un profil. */
export function snapshotFromProfile(profile: PlayerProfile): Snapshot {
  return {
    id: makeId('snapshot'),
    date: getDateTimeKey(),
    level: profile.player.level,
    stage: profile.player.stage,
    attack: profile.stats.attack,
    criticalRate: profile.stats.criticalRate,
    deathStrike: profile.stats.deathStrike,
    goldPerMinute: profile.stats.goldPerMinute,
  }
}
