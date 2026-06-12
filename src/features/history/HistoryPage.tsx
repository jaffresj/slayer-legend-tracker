import { ProgressChart } from '@/components/charts/ProgressChart'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardHeader } from '@/components/ui'
import { useHistoryStore } from '@/stores/historyStore'
import type { Snapshot } from '@/types/domain'

type ChartConfig = {
  dataKey: keyof Pick<Snapshot, 'level' | 'stage' | 'attack' | 'criticalRate' | 'deathStrike'>
  title: string
  label: string
  color: string
}

const CHARTS: ChartConfig[] = [
  { dataKey: 'level', title: 'Évolution niveau', label: 'Niveau', color: '#22d3ee' },
  { dataKey: 'stage', title: 'Évolution stage', label: 'Stage', color: '#f59e0b' },
  { dataKey: 'attack', title: 'Évolution attaque', label: 'Attaque', color: '#fb7185' },
  { dataKey: 'criticalRate', title: 'Évolution critique', label: 'Critique', color: '#a7f3d0' },
  {
    dataKey: 'deathStrike',
    title: 'Évolution frappe mortelle',
    label: 'Frappe Mortelle',
    color: '#c084fc',
  },
]

export function HistoryPage() {
  const snapshots = useHistoryStore((state) => state.snapshots)

  return (
    <div className="space-y-6">
      <PageHeader title="Historique" kicker={`${snapshots.length} snapshots`} />

      <section className="grid gap-4 xl:grid-cols-2">
        {CHARTS.map((chart) => (
          <Card key={chart.dataKey}>
            <CardHeader title={chart.title} />
            <ProgressChart
              data={snapshots}
              dataKey={chart.dataKey}
              label={chart.label}
              color={chart.color}
            />
          </Card>
        ))}
      </section>
    </div>
  )
}
