import { RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, CardHeader } from '@/components/ui'
import { useDailyStore } from '@/stores/dailyStore'

export function DailyPage() {
  const daily = useDailyStore((state) => state.daily)
  const ensureToday = useDailyStore((state) => state.ensureToday)
  const toggleTask = useDailyStore((state) => state.toggleTask)
  const updateNotes = useDailyStore((state) => state.updateNotes)
  const resetDaily = useDailyStore((state) => state.resetDaily)
  const completed = daily.tasks.filter((task) => task.done).length

  useEffect(() => {
    ensureToday()
  }, [ensureToday])

  return (
    <div className="space-y-6">
      <PageHeader title="Checklist quotidienne" kicker={daily.date}>
        <Button onClick={resetDaily} icon={<RotateCcw size={18} />}>
          Reset
        </Button>
      </PageHeader>

      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader
            title="Tâches"
            action={
              <Badge tone="amber">
                {completed}/{daily.tasks.length}
              </Badge>
            }
          />
          <div className="grid gap-3">
            {daily.tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-3"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="size-5 accent-amber-300"
                />
                <span className={task.done ? 'text-slate-500 line-through' : 'text-slate-100'}>
                  {task.label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notes" />
          <textarea
            value={daily.notes}
            onChange={(event) => updateNotes(event.target.value)}
            className="min-h-80 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none transition focus-visible:border-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300/40"
            placeholder="Notes du jour"
          />
        </Card>
      </section>
    </div>
  )
}
