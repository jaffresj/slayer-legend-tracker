import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { ProgressChart } from '../components/ProgressChart'
import { useHistoryStore } from '../stores/historyStore'

export function HistoryPage() {
  const snapshots = useHistoryStore((state) => state.snapshots)

  return (
    <div className="space-y-6">
      <PageHeader title="Historique" kicker={`${snapshots.length} snapshots`} />

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Évolution niveau</h2>
          <ProgressChart data={snapshots} dataKey="level" label="Niveau" color="#22d3ee" />
        </Panel>
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Évolution stage</h2>
          <ProgressChart data={snapshots} dataKey="stage" label="Stage" color="#f59e0b" />
        </Panel>
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Évolution attaque</h2>
          <ProgressChart data={snapshots} dataKey="attack" label="Attaque" color="#fb7185" />
        </Panel>
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Évolution critique</h2>
          <ProgressChart data={snapshots} dataKey="criticalRate" label="Critique" color="#a7f3d0" />
        </Panel>
        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Évolution frappe mortelle</h2>
          <ProgressChart
            data={snapshots}
            dataKey="deathStrike"
            label="Frappe Mortelle"
            color="#c084fc"
          />
        </Panel>
      </section>
    </div>
  )
}
