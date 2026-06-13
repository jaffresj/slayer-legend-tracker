import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { searchSkills } from '@/lib/skills'
import { SkillToggle } from './SkillToggle'

type SkillPickerProps = {
  selected: string[]
  onToggle: (skillId: string) => void
}

/** Sélecteur de compétences avec recherche (FR / EN / élément / tag). */
export function SkillPicker({ selected, onToggle }: SkillPickerProps) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchSkills(query), [query])

  return (
    <div className="grid gap-2">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher (Foudre Rouge, Red Lightning, boss…)"
          aria-label="Rechercher une compétence"
          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-slate-100 outline-none transition focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300/40"
        />
      </div>

      <p className="text-xs text-slate-500">
        {selected.length} sélectionnée(s) · {results.length} résultat(s)
      </p>

      <div className="grid max-h-96 gap-2 overflow-y-auto pr-1">
        {results.length ? (
          results.map((skill) => (
            <SkillToggle
              key={skill.id}
              skill={skill}
              checked={selected.includes(skill.id)}
              onToggle={() => onToggle(skill.id)}
            />
          ))
        ) : (
          <p className="px-1 py-4 text-sm text-slate-500">Aucune compétence ne correspond.</p>
        )}
      </div>
    </div>
  )
}
