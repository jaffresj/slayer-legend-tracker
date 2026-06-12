import type { ReactNode } from 'react'
import { cx } from '../utils/classes'

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return (
    <section
      className={cx(
        'rounded-lg border border-slate-800/80 bg-slate-900/72 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.26)]',
        className,
      )}
    >
      {children}
    </section>
  )
}
