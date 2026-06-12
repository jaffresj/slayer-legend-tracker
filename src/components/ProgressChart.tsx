import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Snapshot } from '../types/domain'
import { formatNumber } from '../utils/format'

type ProgressChartProps = {
  data: Snapshot[]
  dataKey: keyof Pick<
    Snapshot,
    'level' | 'stage' | 'attack' | 'criticalRate' | 'deathStrike' | 'goldPerMinute'
  >
  label: string
  color: string
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

export function ProgressChart({ data, dataKey, label, color }: ProgressChartProps) {
  const chartData = data.map((snapshot) => ({
    ...snapshot,
    shortDate: formatDate(snapshot.date),
  }))

  return (
    <div className="h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis
            dataKey="shortDate"
            stroke="#64748b"
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            stroke="#64748b"
            tickFormatter={(value) => formatNumber(Number(value))}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            width={72}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#e2e8f0',
            }}
            formatter={(value) => [formatNumber(Number(value)), label]}
            labelFormatter={(value) => `Date ${value}`}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
