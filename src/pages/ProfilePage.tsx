import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { useHistoryStore } from '../stores/historyStore'
import { useProfileStore } from '../stores/profileStore'
import type { PlayerProfile } from '../types/domain'
import { parseNumberInput } from '../utils/format'

type FieldProps = {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'number'
}

function Field({ label, value, onChange, type = 'text' }: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none focus:border-amber-300"
      />
    </label>
  )
}

function asJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function ProfilePage() {
  const profile = useProfileStore((state) => state.profile)
  const replaceProfile = useProfileStore((state) => state.replaceProfile)
  const addSnapshot = useHistoryStore((state) => state.addSnapshot)
  const [draft, setDraft] = useState<PlayerProfile>(profile)
  const [lists, setLists] = useState({
    skills: asJson(profile.skills),
    companions: asJson(profile.companions),
    equipment: asJson(profile.equipment),
    relics: asJson(profile.relics),
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    setDraft(profile)
    setLists({
      skills: asJson(profile.skills),
      companions: asJson(profile.companions),
      equipment: asJson(profile.equipment),
      relics: asJson(profile.relics),
    })
  }, [profile])

  function updatePlayer(key: keyof PlayerProfile['player'], value: string) {
    setDraft((current) => ({
      ...current,
      player: {
        ...current.player,
        [key]: key === 'name' || key === 'zone' ? value : parseNumberInput(value),
      },
    }))
  }

  function updateResource(key: keyof PlayerProfile['resources'], value: string) {
    setDraft((current) => ({
      ...current,
      resources: { ...current.resources, [key]: parseNumberInput(value) },
    }))
  }

  function updateStat(key: keyof PlayerProfile['stats'], value: string) {
    setDraft((current) => ({
      ...current,
      stats: { ...current.stats, [key]: parseNumberInput(value) },
    }))
  }

  function updateGrowth(key: keyof PlayerProfile['growth'], value: string) {
    setDraft((current) => ({
      ...current,
      growth: { ...current.growth, [key]: parseNumberInput(value) },
    }))
  }

  function saveProfile() {
    try {
      const nextProfile: PlayerProfile = {
        ...draft,
        skills: JSON.parse(lists.skills) as PlayerProfile['skills'],
        companions: JSON.parse(lists.companions) as PlayerProfile['companions'],
        equipment: JSON.parse(lists.equipment) as PlayerProfile['equipment'],
        relics: JSON.parse(lists.relics) as PlayerProfile['relics'],
      }
      replaceProfile(nextProfile)
      addSnapshot(nextProfile)
      setMessage('Profil enregistré et snapshot ajouté.')
    } catch {
      setMessage('JSON invalide dans une liste du profil.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profil joueur" kicker={draft.player.name}>
        <button
          type="button"
          onClick={saveProfile}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/15 px-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/22"
        >
          <Save size={18} />
          Enregistrer
        </button>
      </PageHeader>

      {message ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          {message}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Identité</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nom du joueur" value={draft.player.name} onChange={(value) => updatePlayer('name', value)} />
            <Field label="Zone" value={draft.player.zone} onChange={(value) => updatePlayer('zone', value)} />
            <Field label="Niveau" type="number" value={draft.player.level} onChange={(value) => updatePlayer('level', value)} />
            <Field label="Stage" type="number" value={draft.player.stage} onChange={(value) => updatePlayer('stage', value)} />
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Ressources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Diamants" type="number" value={draft.resources.diamonds} onChange={(value) => updateResource('diamonds', value)} />
            <Field label="Émeraudes" type="number" value={draft.resources.emeralds} onChange={(value) => updateResource('emeralds', value)} />
            <Field label="Or actuel" type="number" value={draft.resources.gold} onChange={(value) => updateResource('gold', value)} />
            <Field label="Âmes" type="number" value={draft.resources.souls} onChange={(value) => updateResource('souls', value)} />
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Statistiques</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Attaque" type="number" value={draft.stats.attack} onChange={(value) => updateStat('attack', value)} />
            <Field label="Dégâts estimés" type="number" value={draft.stats.estimatedDamage} onChange={(value) => updateStat('estimatedDamage', value)} />
            <Field label="Critique %" type="number" value={draft.stats.criticalRate} onChange={(value) => updateStat('criticalRate', value)} />
            <Field label="Dégâts critiques %" type="number" value={draft.stats.criticalDamage} onChange={(value) => updateStat('criticalDamage', value)} />
            <Field label="Frappe Mortelle %" type="number" value={draft.stats.deathStrike} onChange={(value) => updateStat('deathStrike', value)} />
            <Field label="Or par minute" type="number" value={draft.stats.goldPerMinute} onChange={(value) => updateStat('goldPerMinute', value)} />
            <Field label="Vie" type="number" value={draft.stats.health} onChange={(value) => updateStat('health', value)} />
            <Field label="Défense" type="number" value={draft.stats.defense} onChange={(value) => updateStat('defense', value)} />
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Croissance</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Attaque" type="number" value={draft.growth.attack} onChange={(value) => updateGrowth('attack', value)} />
            <Field label="Vie" type="number" value={draft.growth.health} onChange={(value) => updateGrowth('health', value)} />
            <Field label="Récupération" type="number" value={draft.growth.recovery} onChange={(value) => updateGrowth('recovery', value)} />
            <Field label="Critique" type="number" value={draft.growth.critical} onChange={(value) => updateGrowth('critical', value)} />
            <Field label="Frappe Mortelle" type="number" value={draft.growth.deathStrike} onChange={(value) => updateGrowth('deathStrike', value)} />
          </div>
        </Panel>
      </section>

      <Panel>
        <h2 className="mb-4 text-lg font-semibold text-slate-50">Listes du profil</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {(['skills', 'companions', 'equipment', 'relics'] as const).map((key) => (
            <label key={key} className="grid gap-2">
              <span className="text-sm font-medium capitalize text-slate-300">{key}</span>
              <textarea
                value={lists[key]}
                onChange={(event) =>
                  setLists((current) => ({ ...current, [key]: event.target.value }))
                }
                className="min-h-64 rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 outline-none focus:border-amber-300"
                spellCheck={false}
              />
            </label>
          ))}
        </div>
      </Panel>
    </div>
  )
}
