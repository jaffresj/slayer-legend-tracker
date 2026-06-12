import { Field, TextareaField } from '@/components/ui'
import type { ProfileUpdate } from '@/types/domain'

type Section = 'player' | 'resources' | 'stats' | 'growth'

type FieldConfig = {
  section: Section
  key: string
  label: string
  text?: boolean
}

// Déclaratif : ajouter un champ détecté = ajouter une ligne ici.
const FIELDS: FieldConfig[] = [
  { section: 'player', key: 'name', label: 'Nom', text: true },
  { section: 'player', key: 'zone', label: 'Zone', text: true },
  { section: 'player', key: 'level', label: 'Niveau' },
  { section: 'player', key: 'stage', label: 'Stage' },
  { section: 'resources', key: 'diamonds', label: 'Diamants' },
  { section: 'resources', key: 'emeralds', label: 'Émeraudes' },
  { section: 'resources', key: 'gold', label: 'Or actuel' },
  { section: 'stats', key: 'attack', label: 'Attaque' },
  { section: 'stats', key: 'estimatedDamage', label: 'Dégâts estimés' },
  { section: 'stats', key: 'criticalRate', label: 'Critique %' },
  { section: 'stats', key: 'deathStrike', label: 'Frappe Mortelle %' },
  { section: 'stats', key: 'goldPerMinute', label: 'Or par minute' },
  { section: 'growth', key: 'attack', label: 'Croissance attaque' },
  { section: 'growth', key: 'health', label: 'Croissance vie' },
  { section: 'growth', key: 'recovery', label: 'Croissance récupération' },
  { section: 'growth', key: 'critical', label: 'Croissance critique' },
]

type DetectionFormProps = {
  detected: ProfileUpdate
  skillsText: string
  onFieldChange: (section: Section, key: string, value: string, text: boolean) => void
  onSkillsChange: (value: string) => void
}

export function DetectionForm({
  detected,
  skillsText,
  onFieldChange,
  onSkillsChange,
}: DetectionFormProps) {
  function valueFor(section: Section, key: string): string | number {
    const sectionData = detected[section] as Record<string, string | number> | undefined
    return sectionData?.[key] ?? ''
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS.map((field) => (
          <Field
            key={`${field.section}.${field.key}`}
            label={field.label}
            type={field.text ? 'text' : 'number'}
            value={valueFor(field.section, field.key)}
            onChange={(event) =>
              onFieldChange(field.section, field.key, event.target.value, Boolean(field.text))
            }
          />
        ))}
      </div>

      <TextareaField
        label="Compétences détectées"
        mono
        value={skillsText}
        onChange={(event) => onSkillsChange(event.target.value)}
        className="min-h-44"
      />
    </div>
  )
}
