import { useId } from 'react'
import type { TaggedGameItem } from '@/types/domain'

type SkillToggleProps = {
  skill: TaggedGameItem
  checked: boolean
  onToggle: () => void
}

/** Ligne de sélection d'une compétence (label ↔ checkbox liés par id). */
export function SkillToggle({ skill, checked, onToggle }: SkillToggleProps) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-medium text-slate-100">{skill.name}</span>
        <span className="block text-xs text-slate-500">{skill.tags.join(', ')}</span>
      </label>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="size-4 accent-amber-300"
      />
    </div>
  )
}
