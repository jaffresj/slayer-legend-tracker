import type { ReactNode } from 'react'
import { cx } from '@/lib/classes'

export type BadgeTone = 'neutral' | 'amber' | 'cyan' | 'rose' | 'emerald'

const tones: Record<BadgeTone, string> = {
  neutral: 'border-slate-700 text-slate-300',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  rose: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
}

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-lg border px-2 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
