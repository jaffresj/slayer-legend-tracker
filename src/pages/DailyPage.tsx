import { RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { useDailyStore } from '../stores/dailyStore'

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
        <button
          type="button"
          onClick={resetDaily}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 hover:border-amber-400/45 hover:text-amber-100"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </PageHeader>

      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-50">Tâches</h2>
            <span className="rounded-lg border border-slate-700 px-2 py-1 text-sm text-slate-300">
              {completed}/{daily.tasks.length}
            </span>
          </div>
          <div className="grid gap-3">
            {daily.tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/58 px-3 py-3"
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
        </Panel>

        <Panel>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Notes</h2>
          <textarea
            value={daily.notes}
            onChange={(event) => updateNotes(event.target.value)}
            className="min-h-80 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-amber-300"
            placeholder="Notes du jour"
          />
        </Panel>
      </section>
    </div>
  )
}
