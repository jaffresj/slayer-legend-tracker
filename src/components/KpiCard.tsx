import type { ReactNode } from 'react'
import { cx } from '../utils/classes'

type KpiCardProps = {
  label: string
  value: string
  detail?: string
  icon?: ReactNode
  tone?: 'amber' | 'cyan' | 'rose' | 'emerald'
}

const toneClass: Record<NonNullable<KpiCardProps['tone']>, string> = {
  amber: 'border-amber-400/30 text-amber-200',
  cyan: 'border-cyan-400/30 text-cyan-200',
  rose: 'border-rose-400/30 text-rose-200',
  emerald: 'border-emerald-400/30 text-emerald-200',
}

export function KpiCard({ label, value, detail, icon, tone = 'amber' }: KpiCardProps) {
  return (
    <article className="min-h-32 rounded-lg border border-slate-800 bg-slate-950/58 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {icon ? (
          <span
            className={cx(
              'grid size-9 place-items-center rounded-lg border bg-slate-900',
              toneClass[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
    </article>
  )
}
