import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { PerformancePoint } from '@/types'

interface Props {
  data: PerformancePoint[]
  height?: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value as number
  const sign = val >= 0 ? '+' : ''
  const color = val >= 0 ? '#10b981' : '#ef4444'

  return (
    <div className="sf-card px-3 py-2 text-[0.78rem]">
      <p className="text-white/40 mb-1">
        {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      <p style={{ color }} className="font-semibold sf-mono">
        {sign}{val.toFixed(2)} units
      </p>
    </div>
  )
}

export function PerformanceChart({ data, height = 220 }: Props) {
  const formatted = data.map(d => ({
    date: d.date,
    units: d.cumulative_units,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}u`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="units"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
