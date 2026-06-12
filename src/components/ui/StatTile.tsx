import type { ReactNode } from 'react'
import { cx } from '@/lib/classes'

type Tone = 'amber' | 'cyan' | 'rose' | 'emerald'

type StatTileProps = {
  label: string
  value: string
  detail?: string
  icon?: ReactNode
  tone?: Tone
}

const iconTone: Record<Tone, string> = {
  amber: 'border-amber-400/30 text-amber-200',
  cyan: 'border-cyan-400/30 text-cyan-200',
  rose: 'border-rose-400/30 text-rose-200',
  emerald: 'border-emerald-400/30 text-emerald-200',
}

/** Tuile KPI : libellé, grande valeur, détail optionnel et icône colorée. */
export function StatTile({ label, value, detail, icon, tone = 'amber' }: StatTileProps) {
  return (
    <article className="min-h-32 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {icon ? (
          <span
            className={cx(
              'grid size-9 place-items-center rounded-lg border bg-slate-900',
              iconTone[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="text-2xl font-semibold tabular-nums text-slate-50">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
    </article>
  )
}
