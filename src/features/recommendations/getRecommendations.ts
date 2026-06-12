import skillsJson from '../../data/skills.json'
import stagesJson from '../../data/stages.json'
import type {
  Goal,
  PlayerProfile,
  PriorityLabel,
  Recommendation,
  Stage,
  TaggedGameItem,
} from '../../types/domain'

const skills = skillsJson as TaggedGameItem[]
const stages = stagesJson as Stage[]

export const goalLabels: Record<Goal, string> = {
  push_stage: 'Push stage',
  farm_gold: 'Farm or',
  boss: 'Boss',
  survie: 'Survie',
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function priorityLabel(score: number): PriorityLabel {
  if (score >= 85) return 'Priorité très élevée'
  if (score >= 65) return 'Priorité élevée'
  if (score >= 40) return 'Priorité moyenne'
  return 'Priorité faible'
}

function buildRecommendation(
  id: string,
  name: string,
  score: number,
  reason: string,
  category: Recommendation['category'],
): Recommendation {
  const normalizedScore = clampScore(score)
  return {
    id,
    name,
    score: normalizedScore,
    priorityLabel: priorityLabel(normalizedScore),
    reason,
    category,
  }
}

function scoreOwnedSkill(profile: PlayerProfile, tags: string[], baseScore: number) {
  const ownedMatch = profile.skills.find((skill) =>
    tags.some((tag) => skill.tags.includes(tag)),
  )

  if (!ownedMatch) return baseScore + 8
  if (ownedMatch.level < 20) return baseScore + 12
  if (ownedMatch.level < 50) return baseScore + 4
  return baseScore - 8
}

export function getRecommendations(
  profile: PlayerProfile,
  goal: Goal,
): Recommendation[] {
  const nextStage = stages.find((stage) => stage.stage > profile.player.stage)
  const attackGap = nextStage
    ? nextStage.recommendedAttack - profile.stats.attack
    : profile.stats.attack * 0.2
  const gapPressure = nextStage ? clampScore((attackGap / nextStage.recommendedAttack) * 100) : 20
  const critNeed = Math.max(0, 60 - profile.stats.criticalRate)
  const deathStrikeNeed = Math.max(0, 35 - profile.stats.deathStrike)
  const goldNeed = profile.stats.goldPerMinute <= 0 ? 70 : clampScore(70000 / profile.stats.goldPerMinute)

  const sampleGoldSkill = skills.find((skill) => skill.tags.includes('farm'))
  const sampleGuardSkill = skills.find((skill) => skill.tags.includes('survie'))
  const sampleCritSkill = skills.find((skill) => skill.tags.includes('critique'))

  const base: Recommendation[] = [
    buildRecommendation(
      'upgrade-attack',
      'Attaque',
      48 + gapPressure + profile.growth.attack / 12,
      "Augmenter l'attaque améliore directement la progression et les combats de boss.",
      'growth',
    ),
    buildRecommendation(
      'upgrade-critical',
      'Dégâts critiques',
      54 + critNeed * 0.65 + profile.growth.critical / 18,
      'Le critique reste très rentable quand le taux critique et les dégâts montent ensemble.',
      'stat',
    ),
    buildRecommendation(
      'upgrade-death-strike',
      'Frappe Mortelle',
      44 + deathStrikeNeed + profile.growth.deathStrike / 16,
      'La frappe mortelle ajoute un pic de dégâts utile sur les paliers difficiles.',
      'stat',
    ),
    buildRecommendation(
      'upgrade-gold',
      "Gain d'or",
      42 + goldNeed + profile.resources.gold / 1000000,
      "Plus d'or par minute accélère les prochains cycles d'amélioration.",
      'resource',
    ),
    buildRecommendation(
      'upgrade-survival',
      'Survie',
      38 + Math.max(0, 75 - profile.growth.health / 2),
      'La vie, la défense et la récupération stabilisent les combats longs.',
      'growth',
    ),
  ]

  const skillRecommendations = [
    buildRecommendation(
      'skill-critical',
      sampleCritSkill?.name ?? 'Compétence critique',
      scoreOwnedSkill(profile, ['critique'], 58),
      'Prioriser une compétence critique aide à convertir les stats offensives en progression.',
      'skill',
    ),
    buildRecommendation(
      'skill-farm',
      sampleGoldSkill?.name ?? 'Compétence de farm',
      scoreOwnedSkill(profile, ['farm', 'or'], 52),
      "Une compétence de farm devient prioritaire quand les gains d'or ralentissent.",
      'skill',
    ),
    buildRecommendation(
      'skill-guard',
      sampleGuardSkill?.name ?? 'Compétence de survie',
      scoreOwnedSkill(profile, ['survie', 'defense'], 48),
      'Une option défensive réduit les échecs sur les combats prolongés.',
      'skill',
    ),
  ]

  const modifiers: Record<Goal, Record<string, number>> = {
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

  return [...base, ...skillRecommendations]
    .map((recommendation) =>
      buildRecommendation(
        recommendation.id,
        recommendation.name,
        recommendation.score + (modifiers[goal][recommendation.id] ?? 0),
        recommendation.reason,
        recommendation.category,
      ),
    )
    .sort((a, b) => b.score - a.score)
}
