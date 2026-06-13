import { useId } from 'react'
import { Badge } from '@/components/ui'
import type { BadgeTone } from '@/components/ui'
import { ELEMENT_LABELS } from '@/lib/skills'
import type { GameSkill, SkillElement } from '@/types/domain'

const elementTone: Record<SkillElement, BadgeTone> = {
  feu: 'rose',
  glace: 'cyan',
  foudre: 'amber',
  terre: 'emerald',
  vent: 'neutral',
  eau: 'cyan',
  neutre: 'neutral',
}

type SkillToggleProps = {
  skill: GameSkill
  checked: boolean
  onToggle: () => void
}

/** Ligne de sélection d'une compétence (label ↔ checkbox liés par id). */
export function SkillToggle({ skill, checked, onToggle }: SkillToggleProps) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-slate-100">{skill.name}</span>
          <Badge tone={elementTone[skill.element]}>{ELEMENT_LABELS[skill.element]}</Badge>
          {skill.tentative ? (
            <span title="Traduction FR à confirmer" className="text-xs text-slate-600">
              ?
            </span>
          ) : null}
        </span>
        <span className="block truncate text-xs text-slate-500">{skill.nameEn}</span>
      </label>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="size-4 shrink-0 accent-amber-300"
      />
    </div>
  )
}
