import {
  BarChart3,
  ClipboardCheck,
  Database,
  FileJson,
  Home,
  Swords,
  Upload,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cx } from '../utils/classes'

const links = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/import', label: 'Import', icon: Upload },
  { to: '/history', label: 'Historique', icon: BarChart3 },
  { to: '/profile', label: 'Profil', icon: UserRound },
  { to: '/builds', label: 'Builds', icon: Swords },
  { to: '/daily', label: 'Daily', icon: ClipboardCheck },
  { to: '/settings', label: 'Données', icon: FileJson },
]

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_34%),linear-gradient(135deg,#020617_0%,#111827_54%,#1f2937_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-950/88 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg border border-amber-400/35 bg-amber-400/12 text-amber-200">
              <Database size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                Slayer
              </p>
              <p className="text-sm text-slate-400">Progression Helper</p>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cx(
                      'flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition',
                      isActive
                        ? 'border-amber-400/40 bg-amber-400/15 text-amber-100'
                        : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100',
                    )
                  }
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </aside>
        <main className="flex-1 px-4 py-5 md:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
