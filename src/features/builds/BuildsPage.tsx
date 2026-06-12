import { Plus, Swords, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Select,
  TextareaField,
} from '@/components/ui'
import { gameSkills } from '@/data'
import { GOALS, goalLabels } from '@/lib/labels'
import { useBuildStore } from '@/stores/buildStore'
import type { Goal } from '@/types/domain'
import { SkillToggle } from './components/SkillToggle'

const goalOptions = GOALS.map((goal) => ({ value: goal, label: goalLabels[goal] }))
const skillNameById = new Map(gameSkills.map((skill) => [skill.id, skill.name]))

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

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
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
            <TextareaField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28"
            />
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium text-slate-300">Compétences</legend>
              {gameSkills.map((skill) => (
                <SkillToggle
                  key={skill.id}
                  skill={skill}
                  checked={selectedSkills.includes(skill.id)}
                  onToggle={() => toggleSkill(skill.id)}
                />
              ))}
            </fieldset>
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
          <CardHeader title="Builds enregistrés" />
          {builds.length ? (
            <div className="grid gap-3">
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
                        <Badge key={skillId}>{skillNameById.get(skillId) ?? skillId}</Badge>
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
              description="Crée ton premier build avec le formulaire à gauche."
            />
          )}
        </Card>
      </section>
    </div>
  )
}
