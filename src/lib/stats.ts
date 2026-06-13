import type { PlayerStats } from '@/types/domain'

/**
 * Dégâts estimés — valeur DÉRIVÉE (l'utilisateur ne la saisit plus).
 *
 * ⚠️ FORMULE PROVISOIRE, à calibrer avec la formule exacte de Slayer Legend.
 *    Quand la formule réelle est connue, ne modifier QUE le corps de cette
 *    fonction et les constantes ci-dessous — tout le reste de l'app consomme
 *    `computeEstimatedDamage`, donc le changement est local.
 *
 * Modèle actuel : attaque pondérée par l'espérance de dégâts critiques puis par
 * la frappe mortelle, ces deux stats étant exprimées en pourcentage dans le jeu.
 */

// Le taux critique plafonne à 100 % en jeu.
const CRIT_RATE_CAP = 100

export function computeEstimatedDamage(stats: PlayerStats): number {
  const critRate = Math.min(Math.max(stats.criticalRate, 0), CRIT_RATE_CAP) / 100
  const critMultiplier = Math.max(stats.criticalDamage, 0) / 100
  const deathStrike = Math.max(stats.deathStrike, 0) / 100

  const critFactor = 1 + critRate * critMultiplier
  const deathStrikeFactor = 1 + deathStrike

  const estimate = stats.attack * critFactor * deathStrikeFactor
  return Number.isFinite(estimate) ? Math.round(estimate) : 0
}
