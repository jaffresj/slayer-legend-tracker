import { Coins, Crosshair, Gem, Shield, Skull, Sparkles, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { ProgressChart } from '../components/ProgressChart'
import {
  getRecommendations,
  goalLabels,
} from '../features/recommendations/getRecommendations'
import { useHistoryStore } from '../stores/historyStore'
import { useProfileStore } from '../stores/profileStore'
import type { Goal } from '../types/domain'
import { formatNumber, formatPercent } from '../utils/format'

const goals: Goal[] = ['push_stage', 'farm_gold', 'boss', 'survie']

export function DashboardPage() {
  const profile = useProfileStore((state) => state.profile)
  const snapshots = useHistoryStore((state) => state.snapshots)
  const [goal, setGoal] = useState<Goal>('push_stage')
  const recommendations = useMemo(
    () => getRecommendations(profile, goal).slice(0, 5),
    [profile, goal],
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" kicker={profile.player.name}>
        <select
          value={goal}
          onChange={(event) => setGoal(event.target.value as Goal)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none focus:border-amber-300"
        >
          {goals.map((item) => (
            <option key={item} value={item}>
              {goalLabels[item]}
            </option>
          ))}
        </select>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Niveau"
          value={formatNumber(profile.player.level)}
          detail={profile.player.zone}
          icon={<TrendingUp size={18} />}
          tone="cyan"
        />
        <KpiCard
          label="Stage"
          value={formatNumber(profile.player.stage)}
          detail="Palier actuel"
          icon={<Crosshair size={18} />}
          tone="amber"
        />
        <KpiCard
          label="Dégâts estimés"
          value={formatNumber(profile.stats.estimatedDamage)}
          detail={`Attaque ${formatNumber(profile.stats.attack)}`}
          icon={<Sparkles size={18} />}
          tone="rose"
        />
        <KpiCard
          label="Or par minute"
          value={formatNumber(profile.stats.goldPerMinute)}
          detail={`${formatNumber(profile.resources.gold)} or actuel`}
          icon={<Coins size={18} />}
          tone="emerald"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Panel>
          <p className="text-sm text-slate-400">Diamants</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-50">
            <Gem className="text-cyan-200" size={20} />
            {formatNumber(profile.resources.diamonds)}
          </p>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-400">Émeraudes</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-50">
            <Gem className="text-emerald-200" size={20} />
            {formatNumber(profile.resources.emeralds)}
          </p>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-400">Critique</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-50">
            <Shield className="text-amber-200" size={20} />
            {formatPercent(profile.stats.criticalRate)}
          </p>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-400">Frappe Mortelle</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-50">
            <Skull className="text-rose-200" size={20} />
            {formatPercent(profile.stats.deathStrike)}
          </p>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-50">Progression stage</h2>
            <span className="text-sm text-slate-500">
              {snapshots.length} snapshot{snapshots.length > 1 ? 's' : ''}
            </span>
          </div>
          <ProgressChart data={snapshots} dataKey="stage" label="Stage" color="#f59e0b" />
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Priorités</h2>
          <div className="space-y-3">
            {recommendations.map((recommendation) => (
              <article
                key={recommendation.id}
                className="rounded-lg border border-slate-800 bg-slate-950/54 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-slate-100">{recommendation.name}</h3>
                    <p className="text-xs text-amber-200">{recommendation.priorityLabel}</p>
                  </div>
                  <span className="rounded-lg border border-slate-700 px-2 py-1 text-sm font-semibold text-slate-100">
                    {recommendation.score}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-400">{recommendation.reason}</p>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  )
}
