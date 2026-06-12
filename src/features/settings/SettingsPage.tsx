import { DatabaseBackup, Download, RotateCcw, Upload } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Banner, Button, Card, CardHeader } from '@/components/ui'
import { useStatusMessage } from '@/hooks/useStatusMessage'
import { buildAppExport, downloadJson, importAppData, resetAppData } from '@/services/persistence'
import { useBuildStore } from '@/stores/buildStore'
import { useDailyStore } from '@/stores/dailyStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useProfileStore } from '@/stores/profileStore'

const IMPORT_ERRORS = {
  'invalid-json': 'Fichier illisible : JSON invalide.',
  'invalid-shape': 'Structure de sauvegarde non reconnue.',
} as const

export function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profile = useProfileStore((state) => state.profile)
  const snapshots = useHistoryStore((state) => state.snapshots)
  const builds = useBuildStore((state) => state.builds)
  const daily = useDailyStore((state) => state.daily)
  const addSnapshot = useHistoryStore((state) => state.addSnapshot)
  const { message, notify } = useStatusMessage()

  // Aperçu reconstruit à partir des quatre slices réellement exportées :
  // les dépendances sont explicites et le rendu reste correct sans stringify
  // à chaque render.
  const exportPreview = useMemo(
    () => JSON.stringify({ profile, snapshots, builds, daily }, null, 2),
    [profile, snapshots, builds, daily],
  )

  async function importFile(file: File) {
    const result = importAppData(await file.text())
    if (result.ok) notify('success', 'Import JSON terminé.')
    else notify('error', IMPORT_ERRORS[result.error])
  }

  function handleReset() {
    if (!window.confirm('Réinitialiser toutes les données locales ?')) return
    resetAppData()
    notify('info', 'Données locales réinitialisées.')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Données" kicker="LocalStorage" />

      {message ? <Banner tone={message.tone}>{message.text}</Banner> : null}

      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Button
            className="min-h-24 flex-col"
            onClick={() => downloadJson('slayer-progress-export.json', buildAppExport())}
            icon={<Download size={19} />}
          >
            Export JSON
          </Button>
          <Button
            className="min-h-24 flex-col"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload size={19} />}
          >
            Import JSON
          </Button>
          <Button
            className="min-h-24 flex-col"
            onClick={() => {
              addSnapshot(profile)
              notify('success', 'Sauvegarde locale ajoutée à l’historique.')
            }}
            icon={<DatabaseBackup size={19} />}
          >
            Sauvegarde locale
          </Button>
          <Button
            className="min-h-24 flex-col"
            variant="danger"
            onClick={handleReset}
            icon={<RotateCcw size={19} />}
          >
            Réinitialisation
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void importFile(file)
            event.target.value = ''
          }}
        />
      </Card>

      <Card>
        <CardHeader title="Export actuel" />
        <pre className="max-h-[32rem] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
          {exportPreview}
        </pre>
      </Card>
    </div>
  )
}
