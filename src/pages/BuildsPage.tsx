import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import skillsJson from '../data/skills.json'
import { goalLabels } from '../features/recommendations/getRecommendations'
import { useBuildStore } from '../stores/buildStore'
import type { Goal, TaggedGameItem } from '../types/domain'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'

const skills = skillsJson as TaggedGameItem[]
const goals: Goal[] = ['push_stage', 'farm_gold', 'boss', 'survie']

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
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    )
  }

  function saveBuild() {
    const cleanName = name.trim()
    if (!cleanName) return
    addBuild({
      name: cleanName,
      description: description.trim(),
      goal,
      skills: selectedSkills,
    })
    setName('')
    setDescription('')
    setGoal('push_stage')
    setSelectedSkills([])
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Builds" kicker={`${builds.length} configurations`} />

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Nouveau build</h2>
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-300">Nom</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none focus:border-amber-300"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-300">Objectif</span>
              <select
                value={goal}
                onChange={(event) => setGoal(event.target.value as Goal)}
                className="h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none focus:border-amber-300"
              >
                {goals.map((item) => (
                  <option key={item} value={item}>
                    {goalLabels[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-300">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-28 rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-amber-300"
              />
            </label>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">Compétences</p>
              <div className="grid gap-2">
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/58 px-3 py-2"
                  >
                    <span>
                      <span className="block text-sm font-medium text-slate-100">{skill.name}</span>
                      <span className="block text-xs text-slate-500">{skill.tags.join(', ')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                      className="size-4 accent-amber-300"
                    />
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={saveBuild}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/15 px-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/22"
            >
              <Plus size={18} />
              Enregistrer le build
            </button>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Builds enregistrés</h2>
          <div className="grid gap-3">
            {builds.map((build) => (
              <article
                key={build.id}
                className="rounded-lg border border-slate-800 bg-slate-950/58 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-50">{build.name}</h3>
                    <p className="text-sm text-amber-200">{goalLabels[build.goal]}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBuild(build.id)}
                    className="grid size-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:border-rose-400/50 hover:text-rose-200"
                    aria-label={`Supprimer ${build.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                {build.description ? (
                  <p className="mt-3 text-sm leading-6 text-slate-400">{build.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {build.skills.length ? (
                    build.skills.map((skillId) => (
                      <span
                        key={skillId}
                        className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300"
                      >
                        {skills.find((skill) => skill.id === skillId)?.name ?? skillId}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Aucune compétence associée</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  )
}
