import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { OrderStatus } from '../../types/order'

interface IncidentStatusChartProps {
  data: { status: OrderStatus; Normal: number; Disruption: number; Offline: number }[]
}

const COLORS = {
  Normal: '#10b981',
  Disruption: '#f59e0b',
  Offline: '#ef4444',
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function IncidentStatusChart({ data }: IncidentStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
        <XAxis 
          dataKey="status" 
          angle={-45}
          textAnchor="end"
          height={60}
          tick={axisStyle}
        />
        <YAxis tick={axisStyle} />
        <Tooltip />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="square"
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
        <Bar dataKey="Normal" fill={COLORS.Normal} />
        <Bar dataKey="Disruption" fill={COLORS.Disruption} />
        <Bar dataKey="Offline" fill={COLORS.Offline} />
      </BarChart>
    </ResponsiveContainer>
  )
}
