import { gameSkills, gameStages } from '@/data'
import type {
  Goal,
  PlayerProfile,
  Priority,
  Recommendation,
  RecommendationCategory,
} from '@/types/domain'

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function priorityFromScore(score: number): Priority {
  if (score >= 85) return 'very-high'
  if (score >= 65) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

function makeRecommendation(
  id: string,
  name: string,
  score: number,
  reason: string,
  category: RecommendationCategory,
): Recommendation {
  const normalizedScore = clampScore(score)
  return {
    id,
    name,
    score: normalizedScore,
    priority: priorityFromScore(normalizedScore),
    reason,
    category,
  }
}

/**
 * Recommande une famille de compétences si AUCUN build du joueur ne la couvre,
 * et la déprioritise si un build l'inclut déjà. Les compétences possédées sont
 * ainsi déduites des builds (plus de liste « owned » séparée). Tags = familles.
 */
function scoreSkillCoverage(
  ownedSkillTags: ReadonlySet<string>,
  tags: string[],
  baseScore: number,
) {
  const covered = tags.some((tag) => ownedSkillTags.has(tag))
  return covered ? baseScore - 6 : baseScore + 10
}

/** Pression d'attaque (0-100) pour atteindre le prochain palier recommandé. */
export function attackGapPressure(profile: PlayerProfile): number {
  const nextStage = gameStages.find((stage) => stage.stage > profile.player.stage)
  if (!nextStage) return 20
  const attackGap = nextStage.recommendedAttack - profile.stats.attack
  return clampScore((attackGap / nextStage.recommendedAttack) * 100)
}

// Ajustements de score par objectif. Centralisé pour rester lisible et testable.
const goalModifiers: Record<Goal, Record<string, number>> = {
  push_stage: {
    'upgrade-attack': 16,
    'upgrade-critical': 14,
    'upgrade-death-strike': 12,
    'upgrade-gold': -4,
    'upgrade-survival': 4,
    'skill-critical': 12,
    'skill-farm': -8,
    'skill-guard': 2,
  },
  farm_gold: {
    'upgrade-attack': 2,
    'upgrade-critical': 0,
    'upgrade-death-strike': -8,
    'upgrade-gold': 24,
    'upgrade-survival': -6,
    'skill-critical': -4,
    'skill-farm': 22,
    'skill-guard': -8,
  },
  boss: {
    'upgrade-attack': 16,
    'upgrade-critical': 10,
    'upgrade-death-strike': 18,
    'upgrade-gold': -8,
    'upgrade-survival': 6,
    'skill-critical': 10,
    'skill-farm': -12,
    'skill-guard': 6,
  },
  survie: {
    'upgrade-attack': -2,
    'upgrade-critical': -4,
    'upgrade-death-strike': -6,
    'upgrade-gold': 0,
    'upgrade-survival': 26,
    'skill-critical': -6,
    'skill-farm': -4,
    'skill-guard': 22,
  },
}

export function getRecommendations(
  profile: PlayerProfile,
  goal: Goal,
  ownedSkillTags: ReadonlySet<string> = new Set(),
): Recommendation[] {
  const gapPressure = attackGapPressure(profile)
  const critNeed = Math.max(0, 60 - profile.stats.criticalRate)
  const deathStrikeNeed = Math.max(0, 35 - profile.stats.deathStrike)
  const goldNeed =
    profile.stats.goldPerMinute <= 0 ? 70 : clampScore(70000 / profile.stats.goldPerMinute)

  const sampleGoldSkill = gameSkills.find((skill) => skill.tags.includes('farm'))
  const sampleGuardSkill = gameSkills.find((skill) => skill.tags.includes('survie'))
  const sampleCritSkill = gameSkills.find((skill) => skill.tags.includes('critique'))

  const candidates: Recommendation[] = [
    makeRecommendation(
      'upgrade-attack',
      'Attaque',
      48 + gapPressure + profile.growth.attack / 12,
      "Augmenter l'attaque améliore directement la progression et les combats de boss.",
      'growth',
    ),
    makeRecommendation(
      'upgrade-critical',
      'Dégâts critiques',
      54 + critNeed * 0.65 + profile.growth.critical / 18,
      'Le critique reste très rentable quand le taux critique et les dégâts montent ensemble.',
      'stat',
    ),
    makeRecommendation(
      'upgrade-death-strike',
      'Frappe Mortelle',
      44 + deathStrikeNeed + profile.growth.deathStrike / 16,
      'La frappe mortelle ajoute un pic de dégâts utile sur les paliers difficiles.',
      'stat',
    ),
    makeRecommendation(
      'upgrade-gold',
      "Gain d'or",
      42 + goldNeed + profile.resources.gold / 1000000,
      "Plus d'or par minute accélère les prochains cycles d'amélioration.",
      'resource',
    ),
    makeRecommendation(
      'upgrade-survival',
      'Survie',
      38 + Math.max(0, 75 - profile.growth.health / 2),
      'La vie, la défense et la récupération stabilisent les combats longs.',
      'growth',
    ),
    makeRecommendation(
      'skill-critical',
      sampleCritSkill?.name ?? 'Compétence critique',
      scoreSkillCoverage(ownedSkillTags, ['critique'], 58),
      'Prioriser une compétence critique aide à convertir les stats offensives en progression.',
      'skill',
    ),
    makeRecommendation(
      'skill-farm',
      sampleGoldSkill?.name ?? 'Compétence de farm',
      scoreSkillCoverage(ownedSkillTags, ['farm', 'or'], 52),
      "Une compétence de farm devient prioritaire quand les gains d'or ralentissent.",
      'skill',
    ),
    makeRecommendation(
      'skill-guard',
      sampleGuardSkill?.name ?? 'Compétence de survie',
      scoreSkillCoverage(ownedSkillTags, ['survie', 'defense'], 48),
      'Une option défensive réduit les échecs sur les combats prolongés.',
      'skill',
    ),
  ]

  return candidates
    .map((recommendation) =>
      makeRecommendation(
        recommendation.id,
        recommendation.name,
        recommendation.score + (goalModifiers[goal][recommendation.id] ?? 0),
        recommendation.reason,
        recommendation.category,
      ),
    )
    .sort((a, b) => b.score - a.score)
}
