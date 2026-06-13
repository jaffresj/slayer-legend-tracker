import { Coins, Crosshair, Gem, Shield, Skull, Sparkles, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { ProgressChart } from '@/components/charts/ProgressChart'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader, Select, StatTile } from '@/components/ui'
import { GOALS, goalLabels } from '@/lib/labels'
import { formatNumber, formatPercent } from '@/lib/format'
import { getSkill } from '@/lib/skills'
import { computeEstimatedDamage } from '@/lib/stats'
import { getRecommendations } from '@/services/recommendations/engine'
import { useBuildStore } from '@/stores/buildStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useProfileStore } from '@/stores/profileStore'
import type { Goal } from '@/types/domain'
import { RecommendationCard } from './components/RecommendationCard'
import { RecommendedBuilds } from './components/RecommendedBuilds'

const goalOptions = GOALS.map((goal) => ({ value: goal, label: goalLabels[goal] }))

export function DashboardPage() {
  const profile = useProfileStore((state) => state.profile)
  const snapshots = useHistoryStore((state) => state.snapshots)
  const builds = useBuildStore((state) => state.builds)
  const [goal, setGoal] = useState<Goal>('push_stage')

  // Compétences « couvertes » = familles de tags présentes dans les builds.
  const ownedSkillTags = useMemo(() => {
    const tags = new Set<string>()
    for (const build of builds) {
      for (const skillId of build.skills) {
        for (const tag of getSkill(skillId)?.tags ?? []) tags.add(tag)
      }
    }
    return tags
  }, [builds])

  const recommendations = useMemo(
    () => getRecommendations(profile, goal, ownedSkillTags).slice(0, 5),
    [profile, goal, ownedSkillTags],
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" kicker={profile.player.name}>
        <Select
          value={goal}
          onChange={(value) => setGoal(value as Goal)}
          options={goalOptions}
          aria-label="Objectif des recommandations"
        />
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Niveau"
          value={formatNumber(profile.player.level)}
          detail={profile.player.zone}
          icon={<TrendingUp size={18} />}
          tone="cyan"
        />
        <StatTile
          label="Stage"
          value={formatNumber(profile.player.stage)}
          detail="Palier actuel"
          icon={<Crosshair size={18} />}
          tone="amber"
        />
        <StatTile
          label="Dégâts estimés"
          value={formatNumber(computeEstimatedDamage(profile.stats))}
          detail={`Attaque ${formatNumber(profile.stats.attack)}`}
          icon={<Sparkles size={18} />}
          tone="rose"
        />
        <StatTile
          label="Or par minute"
          value={formatNumber(profile.stats.goldPerMinute)}
          detail={`${formatNumber(profile.resources.gold)} or actuel`}
          icon={<Coins size={18} />}
          tone="emerald"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResourceTile
          label="Diamants"
          value={formatNumber(profile.resources.diamonds)}
          icon={<Gem className="text-cyan-200" size={20} />}
        />
        <ResourceTile
          label="Émeraudes"
          value={formatNumber(profile.resources.emeralds)}
          icon={<Gem className="text-emerald-200" size={20} />}
        />
        <ResourceTile
          label="Critique"
          value={formatPercent(profile.stats.criticalRate)}
          icon={<Shield className="text-amber-200" size={20} />}
        />
        <ResourceTile
          label="Frappe Mortelle"
          value={formatPercent(profile.stats.deathStrike)}
          icon={<Skull className="text-rose-200" size={20} />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader
            title="Progression stage"
            count={`${snapshots.length} snapshot${snapshots.length > 1 ? 's' : ''}`}
          />
          <ProgressChart data={snapshots} dataKey="stage" label="Stage" color="#f59e0b" />
        </Card>

        <Card>
          <CardHeader title="Priorités" />
          <div className="space-y-3">
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader title={`Builds conseillés — ${goalLabels[goal]}`} />
        <RecommendedBuilds goal={goal} />
      </Card>
    </div>
  )
}

function ResourceTile({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-2xl font-semibold tabular-nums text-slate-50">
        {icon}
        {value}
      </p>
    </Card>
  )
}
