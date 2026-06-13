import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Banner, Button, Card, CardHeader, Field } from '@/components/ui'
import { useStatusMessage } from '@/hooks/useStatusMessage'
import { parseNumberInput } from '@/lib/format'
import { useHistoryStore } from '@/stores/historyStore'
import { useProfileStore } from '@/stores/profileStore'
import type { PlayerProfile } from '@/types/domain'
import { ItemListEditor } from './components/ItemListEditor'

export function ProfilePage() {
  const profile = useProfileStore((state) => state.profile)
  const replaceProfile = useProfileStore((state) => state.replaceProfile)
  const addSnapshot = useHistoryStore((state) => state.addSnapshot)
  const { message, notify } = useStatusMessage()

  const [draft, setDraft] = useState<PlayerProfile>(profile)

  // Resynchronise le brouillon si le profil change ailleurs (import JSON / reset).
  useEffect(() => {
    setDraft(profile)
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

  function updateNumeric(section: 'resources' | 'stats' | 'growth', key: string, value: string) {
    setDraft((current) => ({
      ...current,
      [section]: { ...current[section], [key]: parseNumberInput(value) },
    }))
  }

  function saveProfile() {
    // Tout est déjà structuré dans le brouillon : sauvegarde directe, pas de
    // parsing JSON ni de chemin d'erreur.
    replaceProfile(draft)
    addSnapshot(draft)
    notify('success', 'Profil enregistré et snapshot ajouté.')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profil joueur" kicker={draft.player.name}>
        <Button variant="primary" onClick={saveProfile} icon={<Save size={18} />}>
          Enregistrer
        </Button>
      </PageHeader>

      {message ? <Banner tone={message.tone}>{message.text}</Banner> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Identité" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Nom du joueur"
              value={draft.player.name}
              onChange={(e) => updatePlayer('name', e.target.value)}
            />
            <Field
              label="Zone"
              value={draft.player.zone}
              onChange={(e) => updatePlayer('zone', e.target.value)}
            />
            <Field
              label="Niveau"
              type="number"
              value={draft.player.level}
              onChange={(e) => updatePlayer('level', e.target.value)}
            />
            <Field
              label="Stage"
              type="number"
              value={draft.player.stage}
              onChange={(e) => updatePlayer('stage', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Ressources" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Diamants"
              type="number"
              value={draft.resources.diamonds}
              onChange={(e) => updateNumeric('resources', 'diamonds', e.target.value)}
            />
            <Field
              label="Émeraudes"
              type="number"
              value={draft.resources.emeralds}
              onChange={(e) => updateNumeric('resources', 'emeralds', e.target.value)}
            />
            <Field
              label="Or actuel"
              type="number"
              value={draft.resources.gold}
              onChange={(e) => updateNumeric('resources', 'gold', e.target.value)}
            />
            <Field
              label="Âmes"
              type="number"
              value={draft.resources.souls}
              onChange={(e) => updateNumeric('resources', 'souls', e.target.value)}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Statistiques" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Attaque"
              type="number"
              value={draft.stats.attack}
              onChange={(e) => updateNumeric('stats', 'attack', e.target.value)}
            />
            <Field
              label="Critique %"
              type="number"
              value={draft.stats.criticalRate}
              onChange={(e) => updateNumeric('stats', 'criticalRate', e.target.value)}
            />
            <Field
              label="Dégâts critiques %"
              type="number"
              value={draft.stats.criticalDamage}
              onChange={(e) => updateNumeric('stats', 'criticalDamage', e.target.value)}
            />
            <Field
              label="Frappe Mortelle %"
              type="number"
              value={draft.stats.deathStrike}
              onChange={(e) => updateNumeric('stats', 'deathStrike', e.target.value)}
            />
            <Field
              label="Or par minute"
              type="number"
              value={draft.stats.goldPerMinute}
              onChange={(e) => updateNumeric('stats', 'goldPerMinute', e.target.value)}
            />
            <Field
              label="Vie"
              type="number"
              value={draft.stats.health}
              onChange={(e) => updateNumeric('stats', 'health', e.target.value)}
            />
            <Field
              label="Défense"
              type="number"
              value={draft.stats.defense}
              onChange={(e) => updateNumeric('stats', 'defense', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Croissance" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Attaque"
              type="number"
              value={draft.growth.attack}
              onChange={(e) => updateNumeric('growth', 'attack', e.target.value)}
            />
            <Field
              label="Vie"
              type="number"
              value={draft.growth.health}
              onChange={(e) => updateNumeric('growth', 'health', e.target.value)}
            />
            <Field
              label="Récupération"
              type="number"
              value={draft.growth.recovery}
              onChange={(e) => updateNumeric('growth', 'recovery', e.target.value)}
            />
            <Field
              label="Critique"
              type="number"
              value={draft.growth.critical}
              onChange={(e) => updateNumeric('growth', 'critical', e.target.value)}
            />
            <Field
              label="Frappe Mortelle"
              type="number"
              value={draft.growth.deathStrike}
              onChange={(e) => updateNumeric('growth', 'deathStrike', e.target.value)}
            />
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader title="Compagnons" count={draft.companions.length} />
        <ItemListEditor
          items={draft.companions}
          onChange={(items) => setDraft((current) => ({ ...current, companions: items }))}
          itemNoun="compagnon"
        />
      </Card>

      <Card>
        <CardHeader title="Équipements" count={draft.equipment.length} />
        <ItemListEditor
          items={draft.equipment}
          withEquipped
          onChange={(items) =>
            setDraft((current) => ({
              ...current,
              equipment: items.map((item) => ({ ...item, equipped: item.equipped ?? false })),
            }))
          }
          itemNoun="équipement"
        />
      </Card>

      <Card>
        <CardHeader title="Reliques" count={draft.relics.length} />
        <ItemListEditor
          items={draft.relics}
          onChange={(items) => setDraft((current) => ({ ...current, relics: items }))}
          itemNoun="relique"
        />
      </Card>
    </div>
  )
}
