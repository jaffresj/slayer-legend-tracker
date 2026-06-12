import type { ReactNode } from 'react'
import { cx } from '@/lib/classes'

type CardProps = {
  children: ReactNode
  className?: string
}

/** Conteneur de section standard (ex-`Panel`). */
export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cx(
        'rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.26)] md:p-5',
        className,
      )}
    >
      {children}
    </section>
  )
}

type CardHeaderProps = {
  title: string
  count?: ReactNode
  action?: ReactNode
}

/** En-tête de carte cohérent : titre à gauche, badge/action à droite. */
export function CardHeader({ title, count, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
        {count != null ? <span className="text-sm text-slate-500">{count}</span> : null}
      </div>
      {action}
    </div>
  )
}
