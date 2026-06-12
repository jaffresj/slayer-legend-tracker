import { useId } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/classes'

const controlClasses =
  'rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none transition focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300/40'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
}

/** Couple label + input accessibles (htmlFor/id reliés automatiquement). */
export function Field({ label, hint, className, id, ...props }: FieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input id={fieldId} className={cx(controlClasses, 'h-11', className)} {...props} />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  mono?: boolean
}

export function TextareaField({ label, mono, className, id, ...props }: TextareaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <textarea
        id={fieldId}
        spellCheck={mono ? false : undefined}
        className={cx(controlClasses, 'p-3', mono && 'font-mono text-sm', className)}
        {...props}
      />
    </div>
  )
}

type SelectFieldProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<{ value: string; label: string }>
  className?: string
  'aria-label'?: string
}

export function Select({
  label,
  value,
  onChange,
  options,
  className,
  'aria-label': ariaLabel,
}: SelectFieldProps) {
  const select = (
    <select
      value={value}
      aria-label={ariaLabel ?? label}
      onChange={(event) => onChange(event.target.value)}
      className={cx(controlClasses, 'h-10', className)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  if (!label) return select
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {select}
    </label>
  )
}
