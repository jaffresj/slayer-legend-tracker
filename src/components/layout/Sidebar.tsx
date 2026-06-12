import { Database } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cx } from '@/lib/classes'
import { NAV_ITEMS } from './navigation'

export function Sidebar() {
  return (
    <aside className="border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg border border-amber-400/35 bg-amber-400/12 text-amber-200">
          <Database size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">Slayer</p>
          <p className="text-sm text-slate-400">Progression Helper</p>
        </div>
      </div>
      <nav aria-label="Navigation principale">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cx(
                    'flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70',
                    isActive
                      ? 'border-amber-400/40 bg-amber-400/15 text-amber-100'
                      : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100',
                  )
                }
              >
                <Icon size={18} aria-hidden />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
