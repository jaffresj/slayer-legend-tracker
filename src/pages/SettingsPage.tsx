import { DatabaseBackup, Download, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { exportAppData, importAppData, resetAppData } from '../stores/appData'
import { useHistoryStore } from '../stores/historyStore'
import { useProfileStore } from '../stores/profileStore'
import type { AppExport } from '../types/domain'

function downloadJson(fileName: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function isAppExport(data: unknown): data is AppExport {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'profile' in data &&
      'snapshots' in data &&
      'builds' in data &&
      'daily' in data,
  )
}

export function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profile = useProfileStore((state) => state.profile)
  const addSnapshot = useHistoryStore((state) => state.addSnapshot)
  const [message, setMessage] = useState('')

  async function importJson(file: File) {
    try {
      const text = await file.text()
      const data = JSON.parse(text) as unknown
      if (!isAppExport(data)) throw new Error('invalid export')
      importAppData(data)
      setMessage('Import JSON terminé.')
    } catch {
      setMessage('Fichier JSON invalide.')
    }
  }

  function resetAllData() {
    const confirmed = window.confirm('Réinitialiser toutes les données locales ?')
    if (!confirmed) return
    resetAppData()
    setMessage('Données locales réinitialisées.')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Données" kicker="LocalStorage" />

      {message ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          {message}
        </div>
      ) : null}

      <Panel>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => downloadJson('slayer-progress-export.json', exportAppData())}
            className="inline-flex min-h-24 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/58 px-4 text-sm font-semibold text-slate-100 hover:border-amber-400/45 hover:text-amber-100"
          >
            <Download size={19} />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-24 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/58 px-4 text-sm font-semibold text-slate-100 hover:border-amber-400/45 hover:text-amber-100"
          >
            <Upload size={19} />
            Import JSON
          </button>
          <button
            type="button"
            onClick={() => {
              addSnapshot(profile)
              setMessage('Sauvegarde locale ajoutée à l’historique.')
            }}
            className="inline-flex min-h-24 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/58 px-4 text-sm font-semibold text-slate-100 hover:border-amber-400/45 hover:text-amber-100"
          >
            <DatabaseBackup size={19} />
            Sauvegarde locale
          </button>
          <button
            type="button"
            onClick={resetAllData}
            className="inline-flex min-h-24 items-center justify-center gap-2 rounded-lg border border-rose-400/35 bg-rose-400/10 px-4 text-sm font-semibold text-rose-100 hover:bg-rose-400/18"
          >
            <RotateCcw size={19} />
            Réinitialisation
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void importJson(file)
            event.target.value = ''
          }}
        />
      </Panel>

      <Panel>
        <h2 className="mb-4 text-lg font-semibold text-slate-50">Export actuel</h2>
        <pre className="max-h-[32rem] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
          {JSON.stringify(exportAppData(), null, 2)}
        </pre>
      </Panel>
    </div>
  )
}
