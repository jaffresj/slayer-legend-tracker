import { useMutation } from '@tanstack/react-query'
import { ImageIcon, Save, ScanText, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { extractProfileFromText, runOcrForImages } from '../features/ocr'
import { useHistoryStore } from '../stores/historyStore'
import { mergeProfile, useProfileStore } from '../stores/profileStore'
import type { PlayerProfile } from '../types/domain'
import type { ProfileUpdate } from '../stores/profileStore'
import { parseNumberInput } from '../utils/format'

type UploadPreview = {
  file: File
  url: string
}

type DetectionFieldProps = {
  label: string
  value: string | number | undefined
  onChange: (value: string) => void
  type?: 'text' | 'number'
}

function DetectionField({ label, value, onChange, type = 'number' }: DetectionFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none focus:border-amber-300"
      />
    </label>
  )
}

function toJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function ImportPage() {
  const profile = useProfileStore((state) => state.profile)
  const replaceProfile = useProfileStore((state) => state.replaceProfile)
  const addSnapshot = useHistoryStore((state) => state.addSnapshot)
  const [previews, setPreviews] = useState<UploadPreview[]>([])
  const [detected, setDetected] = useState<ProfileUpdate>({})
  const [skillsText, setSkillsText] = useState('[]')
  const [rawText, setRawText] = useState('')
  const [progress, setProgress] = useState('')
  const [message, setMessage] = useState('')

  const ocrMutation = useMutation({
    mutationFn: async () => {
      setProgress('Préparation OCR')
      return runOcrForImages(
        previews.map((preview) => preview.file),
        (nextProgress) => {
          setProgress(
            `${nextProgress.fileName} · ${nextProgress.status} · ${nextProgress.progress} %`,
          )
        },
      )
    },
    onSuccess: (text) => {
      const update = extractProfileFromText(text)
      setRawText(text)
      setDetected(update)
      setSkillsText(toJson(update.skills ?? []))
      setMessage('OCR terminé. Vérifie les valeurs avant enregistrement.')
      setProgress('OCR terminé')
    },
    onError: () => {
      setMessage("L'OCR a échoué sur ces images.")
      setProgress('')
    },
  })

  function addFiles(fileList: FileList | File[]) {
    const imageFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'))
    const nextPreviews = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews((current) => [...current, ...nextPreviews])
  }

  function clearFiles() {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    setPreviews([])
  }

  function updateNested(
    section: 'player' | 'resources' | 'stats' | 'growth',
    key: string,
    value: string,
    text = false,
  ) {
    setDetected((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown> | undefined),
        [key]: text ? value : parseNumberInput(value),
      },
    }))
  }

  function saveDetectedProfile() {
    try {
      const parsedSkills = JSON.parse(skillsText) as PlayerProfile['skills']
      const update: ProfileUpdate = {
        ...detected,
        ...(parsedSkills.length ? { skills: parsedSkills } : {}),
      }
      const nextProfile = mergeProfile(profile, update)
      replaceProfile(nextProfile)
      addSnapshot(nextProfile)
      setMessage('Profil mis à jour et snapshot ajouté.')
    } catch {
      setMessage('JSON invalide dans les compétences détectées.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Import de captures" kicker="OCR V1">
        <button
          type="button"
          onClick={() => ocrMutation.mutate()}
          disabled={!previews.length || ocrMutation.isPending}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/15 px-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/22 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ScanText size={18} />
          Lancer OCR
        </button>
      </PageHeader>

      {message ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          {message}
        </div>
      ) : null}

      <Panel>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            addFiles(event.dataTransfer.files)
          }}
          className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-700 bg-slate-950/58 p-6 text-center"
        >
          <UploadCloud className="text-amber-200" size={34} />
          <div>
            <p className="font-semibold text-slate-100">Déposer les images</p>
            <p className="mt-1 text-sm text-slate-500">PNG, JPG ou WebP</p>
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 hover:border-amber-400/45 hover:text-amber-100">
            <ImageIcon size={18} />
            Choisir des fichiers
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) addFiles(event.target.files)
              }}
            />
          </label>
        </div>

        {previews.length ? (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">{previews.length} image(s)</p>
              <button
                type="button"
                onClick={clearFiles}
                className="text-sm font-medium text-slate-400 hover:text-rose-200"
              >
                Vider
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {previews.map((preview) => (
                <figure
                  key={`${preview.file.name}-${preview.url}`}
                  className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                >
                  <img
                    src={preview.url}
                    alt={preview.file.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="truncate px-3 py-2 text-xs text-slate-400">
                    {preview.file.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        {progress ? <p className="mt-4 text-sm text-amber-200">{progress}</p> : null}
      </Panel>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-50">Valeurs détectées</h2>
            <button
              type="button"
              onClick={saveDetectedProfile}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/15 px-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/22"
            >
              <Save size={18} />
              Enregistrer dans mon profil
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetectionField label="Nom" type="text" value={detected.player?.name} onChange={(value) => updateNested('player', 'name', value, true)} />
            <DetectionField label="Zone" type="text" value={detected.player?.zone} onChange={(value) => updateNested('player', 'zone', value, true)} />
            <DetectionField label="Niveau" value={detected.player?.level} onChange={(value) => updateNested('player', 'level', value)} />
            <DetectionField label="Stage" value={detected.player?.stage} onChange={(value) => updateNested('player', 'stage', value)} />
            <DetectionField label="Diamants" value={detected.resources?.diamonds} onChange={(value) => updateNested('resources', 'diamonds', value)} />
            <DetectionField label="Émeraudes" value={detected.resources?.emeralds} onChange={(value) => updateNested('resources', 'emeralds', value)} />
            <DetectionField label="Or actuel" value={detected.resources?.gold} onChange={(value) => updateNested('resources', 'gold', value)} />
            <DetectionField label="Attaque" value={detected.stats?.attack} onChange={(value) => updateNested('stats', 'attack', value)} />
            <DetectionField label="Dégâts estimés" value={detected.stats?.estimatedDamage} onChange={(value) => updateNested('stats', 'estimatedDamage', value)} />
            <DetectionField label="Critique %" value={detected.stats?.criticalRate} onChange={(value) => updateNested('stats', 'criticalRate', value)} />
            <DetectionField label="Frappe Mortelle %" value={detected.stats?.deathStrike} onChange={(value) => updateNested('stats', 'deathStrike', value)} />
            <DetectionField label="Or par minute" value={detected.stats?.goldPerMinute} onChange={(value) => updateNested('stats', 'goldPerMinute', value)} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <DetectionField label="Croissance attaque" value={detected.growth?.attack} onChange={(value) => updateNested('growth', 'attack', value)} />
            <DetectionField label="Croissance vie" value={detected.growth?.health} onChange={(value) => updateNested('growth', 'health', value)} />
            <DetectionField label="Croissance récupération" value={detected.growth?.recovery} onChange={(value) => updateNested('growth', 'recovery', value)} />
            <DetectionField label="Croissance critique" value={detected.growth?.critical} onChange={(value) => updateNested('growth', 'critical', value)} />
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-medium text-slate-300">Compétences détectées</span>
            <textarea
              value={skillsText}
              onChange={(event) => setSkillsText(event.target.value)}
              className="min-h-44 rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 outline-none focus:border-amber-300"
              spellCheck={false}
            />
          </label>
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Texte OCR</h2>
          <textarea
            value={rawText}
            onChange={(event) => {
              const nextText = event.target.value
              const update = extractProfileFromText(nextText)
              setRawText(nextText)
              setDetected(update)
              setSkillsText(toJson(update.skills ?? []))
            }}
            className="min-h-[36rem] w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 outline-none focus:border-amber-300"
            spellCheck={false}
          />
        </Panel>
      </section>
    </div>
  )
}
