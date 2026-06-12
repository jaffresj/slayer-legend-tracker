import { Badge } from '@/components/ui'
import type { BadgeTone } from '@/components/ui'
import { priorityLabels } from '@/lib/labels'
import type { Priority, Recommendation } from '@/types/domain'

const priorityTone: Record<Priority, BadgeTone> = {
  'very-high': 'rose',
  high: 'amber',
  medium: 'cyan',
  low: 'neutral',
}

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-100">{recommendation.name}</h3>
          <Badge tone={priorityTone[recommendation.priority]} className="mt-1">
            {priorityLabels[recommendation.priority]}
          </Badge>
        </div>
        <span className="rounded-lg border border-slate-700 px-2 py-1 text-sm font-semibold tabular-nums text-slate-100">
          {recommendation.score}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-400">{recommendation.reason}</p>
    </article>
  )
}
