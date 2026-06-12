import { useMutation } from '@tanstack/react-query'
import { ScanText } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Banner, Button, Card, CardHeader, TextareaField } from '@/components/ui'
import { useStatusMessage } from '@/hooks/useStatusMessage'
import { parseNumberInput } from '@/lib/format'
import { mergeProfile } from '@/lib/profile'
import { isPlayerSkill, parseJsonArray } from '@/lib/validate'
import { extractProfileFromText, runOcrForImages } from '@/services/ocr'
import { useHistoryStore } from '@/stores/historyStore'
import { useProfileStore } from '@/stores/profileStore'
import type { ProfileUpdate } from '@/types/domain'
import { DetectionForm } from './components/DetectionForm'
import { Dropzone } from './components/Dropzone'
import { useImagePreviews } from './hooks/useImagePreviews'

type Section = 'player' | 'resources' | 'stats' | 'growth'

export function ImportPage() {
  const profile = useProfileStore((state) => state.profile)
  const replaceProfile = useProfileStore((state) => state.replaceProfile)
  const addSnapshot = useHistoryStore((state) => state.addSnapshot)
  const { previews, addFiles, clear } = useImagePreviews()
  const { message, notify } = useStatusMessage(6000)

  const [detected, setDetected] = useState<ProfileUpdate>({})
  const [skillsText, setSkillsText] = useState('[]')
  const [rawText, setRawText] = useState('')
  const [progress, setProgress] = useState('')

  const ocrMutation = useMutation({
    mutationFn: () =>
      runOcrForImages(
        previews.map((preview) => preview.file),
        (next) => setProgress(`${next.fileName} · ${next.status} · ${next.progress} %`),
      ),
    onSuccess: (text) => {
      applyExtraction(text)
      notify('success', 'OCR terminé. Vérifie les valeurs avant enregistrement.')
      setProgress('OCR terminé')
    },
    onError: () => {
      notify('error', "L'OCR a échoué sur ces images.")
      setProgress('')
    },
  })

  function applyExtraction(text: string) {
    const update = extractProfileFromText(text)
    setRawText(text)
    setDetected(update)
    setSkillsText(JSON.stringify(update.skills ?? [], null, 2))
  }

  function updateField(section: Section, key: string, value: string, text: boolean) {
    setDetected((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown> | undefined),
        [key]: text ? value : parseNumberInput(value),
      },
    }))
  }

  function saveDetectedProfile() {
    const parsedSkills = parseJsonArray(skillsText, isPlayerSkill)
    if (!parsedSkills) {
      notify('error', 'JSON invalide dans les compétences détectées.')
      return
    }
    const update: ProfileUpdate = {
      ...detected,
      ...(parsedSkills.length ? { skills: parsedSkills } : {}),
    }
    const nextProfile = mergeProfile(profile, update)
    replaceProfile(nextProfile)
    addSnapshot(nextProfile)
    notify('success', 'Profil mis à jour et snapshot ajouté.')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Import de captures" kicker="OCR V1">
        <Button
          variant="primary"
          onClick={() => ocrMutation.mutate()}
          disabled={!previews.length || ocrMutation.isPending}
          icon={<ScanText size={18} />}
        >
          {ocrMutation.isPending ? 'OCR en cours…' : 'Lancer OCR'}
        </Button>
      </PageHeader>

      {message ? <Banner tone={message.tone}>{message.text}</Banner> : null}

      <Card>
        <Dropzone previews={previews} onAddFiles={addFiles} onClear={clear} progress={progress} />
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader
            title="Valeurs détectées"
            action={
              <Button variant="primary" onClick={saveDetectedProfile}>
                Enregistrer dans mon profil
              </Button>
            }
          />
          <DetectionForm
            detected={detected}
            skillsText={skillsText}
            onFieldChange={updateField}
            onSkillsChange={setSkillsText}
          />
        </Card>

        <Card>
          <CardHeader title="Texte OCR" />
          <TextareaField
            label="Texte reconnu (éditable)"
            mono
            value={rawText}
            onChange={(event) => applyExtraction(event.target.value)}
            className="min-h-[36rem]"
          />
        </Card>
      </section>
    </div>
  )
}
