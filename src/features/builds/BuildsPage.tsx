import { Plus, Swords, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, CardHeader, EmptyState, Field, Select } from '@/components/ui'
import { GOALS, goalLabels } from '@/lib/labels'
import { getSkillName } from '@/lib/skills'
import { useBuildStore } from '@/stores/buildStore'
import type { BuildTemplate, Goal } from '@/types/domain'
import { BuildTemplateList } from './components/BuildTemplateList'
import { SkillPicker } from './components/SkillPicker'

const goalOptions = GOALS.map((goal) => ({ value: goal, label: goalLabels[goal] }))

export function BuildsPage() {
  const builds = useBuildStore((state) => state.builds)
  const addBuild = useBuildStore((state) => state.addBuild)
  const removeBuild = useBuildStore((state) => state.removeBuild)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState<Goal>('push_stage')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  function toggleSkill(skillId: string) {
    setSelectedSkills((current) =>
      current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId],
    )
  }

  function loadTemplate(template: BuildTemplate) {
    setName(template.name)
    setDescription(template.description)
    setGoal(template.goal ?? 'push_stage')
    setSelectedSkills([...template.skills])
  }

  function saveBuild() {
    const cleanName = name.trim()
    if (!cleanName) return
    addBuild({ name: cleanName, description: description.trim(), goal, skills: selectedSkills })
    setName('')
    setDescription('')
    setGoal('push_stage')
    setSelectedSkills([])
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Builds" kicker={`${builds.length} configurations`} />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Nouveau build" />
          <div className="grid gap-4">
            <Field label="Nom" value={name} onChange={(event) => setName(event.target.value)} />
            <Select
              label="Objectif"
              value={goal}
              onChange={(value) => setGoal(value as Goal)}
              options={goalOptions}
            />
            <Field
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-300">
                Compétences ({selectedSkills.length})
              </span>
              {selectedSkills.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkills.map((skillId) => (
                    <button
                      key={skillId}
                      type="button"
                      onClick={() => toggleSkill(skillId)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs text-amber-100 transition hover:bg-amber-400/20"
                      aria-label={`Retirer ${getSkillName(skillId)}`}
                    >
                      {getSkillName(skillId)}
                      <X size={12} aria-hidden />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Recherche et sélectionne des compétences ci-dessous, ou charge un build méta.
                </p>
              )}
              <SkillPicker selected={selectedSkills} onToggle={toggleSkill} />
            </div>

            <Button
              variant="primary"
              onClick={saveBuild}
              disabled={!name.trim()}
              icon={<Plus size={18} />}
            >
              Enregistrer le build
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Builds méta du guide" />
          <p className="mb-3 text-sm text-slate-400">
            Clique sur « Charger » pour pré-remplir le formulaire, puis ajuste et enregistre.
          </p>
          <BuildTemplateList onLoad={loadTemplate} />
        </Card>
      </section>

      <Card>
        <CardHeader title="Builds enregistrés" />
        {builds.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {builds.map((build) => (
              <article
                key={build.id}
                className="rounded-lg border border-slate-800 bg-slate-950/55 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-50">{build.name}</h3>
                    <p className="text-sm text-amber-200">{goalLabels[build.goal]}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeBuild(build.id)}
                    aria-label={`Supprimer ${build.name}`}
                    className="size-9 px-0 hover:border-rose-400/50 hover:text-rose-200"
                    icon={<Trash2 size={17} />}
                  />
                </div>
                {build.description ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">{build.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {build.skills.length ? (
                    build.skills.map((skillId) => (
                      <Badge key={skillId}>{getSkillName(skillId)}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Aucune compétence associée</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Swords size={28} />}
            title="Aucun build enregistré"
            description="Crée ton premier build avec le formulaire, ou charge un build méta du guide."
          />
        )}
      </Card>
    </div>
  )
}
