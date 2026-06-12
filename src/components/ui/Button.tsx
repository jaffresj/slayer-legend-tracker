import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/classes'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-amber-400/40 bg-amber-400/15 text-amber-100 hover:bg-amber-400/25 active:bg-amber-400/30',
  secondary:
    'border-slate-700 bg-transparent text-slate-200 hover:border-amber-400/45 hover:text-amber-100',
  danger: 'border-rose-400/35 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20',
  ghost: 'border-transparent bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-3.5 text-sm',
  lg: 'h-11 px-4 text-sm',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cx(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </button>
  )
}
