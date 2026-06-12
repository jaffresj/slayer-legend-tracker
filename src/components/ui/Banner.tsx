import { CheckCircle2, Info, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '@/lib/classes'

export type BannerTone = 'info' | 'success' | 'error'

type BannerProps = {
  tone?: BannerTone
  children: ReactNode
}

const config: Record<BannerTone, { className: string; Icon: typeof Info }> = {
  info: { className: 'border-slate-700 bg-slate-900 text-slate-200', Icon: Info },
  success: {
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
    Icon: CheckCircle2,
  },
  error: { className: 'border-rose-500/30 bg-rose-500/10 text-rose-100', Icon: XCircle },
}

/** Message d'état en ligne avec rôle ARIA pour les lecteurs d'écran. */
export function Banner({ tone = 'info', children }: BannerProps) {
  const { className, Icon } = config[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('flex items-center gap-3 rounded-lg border px-4 py-3 text-sm', className)}
    >
      <Icon size={18} className="shrink-0" />
      <span>{children}</span>
    </div>
  )
}
