import { Download } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { categoryLabel, resolveSkillNames, templatesByCategory } from '@/lib/skills'
import type { BuildTemplate } from '@/types/domain'

type BuildTemplateListProps = {
  onLoad: (template: BuildTemplate) => void
}

/** Catalogue des builds méta du guide, groupés par catégorie et clonables. */
export function BuildTemplateList({ onLoad }: BuildTemplateListProps) {
  const groups = templatesByCategory()

  return (
    <div className="grid max-h-[40rem] gap-5 overflow-y-auto pr-1">
      {groups.map(({ category, templates }) => (
        <div key={category} className="grid gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-300">
            {categoryLabel(category)}
          </h3>
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-lg border border-slate-800 bg-slate-950/55 p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-slate-100">{template.name}</h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {template.skills.length} compétences
                  </p>
                </div>
                <Button size="sm" onClick={() => onLoad(template)} icon={<Download size={15} />}>
                  Charger
                </Button>
              </div>
              <p className="mb-2 text-sm leading-6 text-slate-400">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {resolveSkillNames(template.skills).map((name, index) => (
                  <Badge key={`${template.id}-${index}`}>{name}</Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  )
}
