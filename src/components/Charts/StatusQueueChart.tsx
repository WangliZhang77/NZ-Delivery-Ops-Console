import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import type { QueueStatus } from '../../types/queue'
import CustomTooltip from './CustomTooltip'

interface StatusQueueChartProps {
  data: { status: QueueStatus; count: number }[]
}

const COLORS: Record<QueueStatus, string> = {
  Queued: '#3b82f6',
  Synced: '#10b981',
  Failed: '#ef4444',
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function StatusQueueChart({ data }: StatusQueueChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <XAxis 
          dataKey="status" 
          tick={axisStyle}
        />
        <YAxis tick={axisStyle} />
        <CustomTooltip titleKey="status" />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
