import { ChevronDown, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { SkillPicker } from '@/components/skills/SkillPicker'
import { elementTone } from '@/components/skills/elementTone'
import { Badge, Button } from '@/components/ui'
import { cx } from '@/lib/classes'
import { parseNumberInput } from '@/lib/format'
import { ELEMENT_LABELS, getSkill, toPlayerSkill } from '@/lib/skills'
import type { PlayerSkill } from '@/types/domain'

type OwnedSkillsEditorProps = {
  skills: PlayerSkill[]
  onChange: (skills: PlayerSkill[]) => void
}

/**
 * Éditeur structuré des compétences possédées : sélection depuis le catalogue,
 * niveau et état « équipée ». Remplace l'ancien textarea JSON.
 */
export function OwnedSkillsEditor({ skills, onChange }: OwnedSkillsEditorProps) {
  const [adding, setAdding] = useState(false)
  const ownedIds = skills.map((skill) => skill.id)

  function toggleSkill(skillId: string) {
    if (ownedIds.includes(skillId)) {
      onChange(skills.filter((skill) => skill.id !== skillId))
      return
    }
    const catalogSkill = getSkill(skillId)
    if (catalogSkill) onChange([...skills, toPlayerSkill(catalogSkill)])
  }

  function patchSkill(skillId: string, patch: Partial<PlayerSkill>) {
    onChange(skills.map((skill) => (skill.id === skillId ? { ...skill, ...patch } : skill)))
  }

  return (
    <div className="grid gap-3">
      {skills.length ? (
        <ul className="grid gap-2">
          {skills.map((skill) => {
            const element = getSkill(skill.id)?.element
            return (
              <li
                key={skill.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2"
              >
                <span className="flex min-w-40 flex-1 items-center gap-2">
                  <span className="truncate text-sm font-medium text-slate-100">{skill.name}</span>
                  {element ? (
                    <Badge tone={elementTone[element]}>{ELEMENT_LABELS[element]}</Badge>
                  ) : null}
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  Niv.
                  <input
                    type="number"
                    min={0}
                    value={skill.level}
                    onChange={(event) =>
                      patchSkill(skill.id, { level: parseNumberInput(event.target.value) })
                    }
                    className="h-9 w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 text-slate-100 outline-none focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300/40"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={skill.equipped}
                    onChange={(event) => patchSkill(skill.id, { equipped: event.target.checked })}
                    className="size-4 accent-amber-300"
                  />
                  Équipée
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleSkill(skill.id)}
                  aria-label={`Retirer ${skill.name}`}
                  className="size-9 px-0 hover:border-rose-400/50 hover:text-rose-200"
                  icon={<Trash2 size={15} />}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Aucune compétence possédée. Ajoute-les ci-dessous.</p>
      )}

      <Button
        variant="secondary"
        onClick={() => setAdding((open) => !open)}
        icon={adding ? <ChevronDown size={16} /> : <Plus size={16} />}
        className="justify-self-start"
      >
        {adding ? 'Fermer le catalogue' : 'Ajouter des compétences'}
      </Button>

      <div className={cx(adding ? 'block' : 'hidden')}>
        <SkillPicker selected={ownedIds} onToggle={toggleSkill} />
      </div>

      {skills.length ? (
        <button
          type="button"
          onClick={() => onChange([])}
          className="inline-flex items-center gap-1 justify-self-start text-xs text-slate-500 transition hover:text-rose-200"
        >
          <X size={12} aria-hidden />
          Tout retirer
        </button>
      ) : null}
    </div>
  )
}
