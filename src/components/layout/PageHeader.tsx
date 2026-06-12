import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  kicker?: string
  children?: ReactNode
}

/** En-tête de page : sur-titre optionnel, titre, et zone d'actions à droite. */
export function PageHeader({ title, kicker, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {kicker ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            {kicker}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">{title}</h1>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  )
}
