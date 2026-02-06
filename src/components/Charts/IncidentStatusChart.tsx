import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import type { OrderStatus } from '../../types/order'
import CustomTooltip from './CustomTooltip'

interface IncidentStatusChartProps {
  data: { status: OrderStatus; Disruption: number; Offline: number }[]
}

const COLORS = {
  Disruption: '#f59e0b', // Orange
  Offline: '#ef4444', // Red
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function IncidentStatusChart({ data }: IncidentStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <XAxis 
          dataKey="status" 
          tick={axisStyle}
          angle={-15}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={axisStyle} />
        <Tooltip 
          content={<CustomTooltip titleKey="status" />}
          formatter={(value: number) => {
            if (value > 0) return `+${value}`
            if (value < 0) return `${value}`
            return '0'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={24}
          iconType="square"
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
        <Bar dataKey="Disruption" fill={COLORS.Disruption} />
        <Bar dataKey="Offline" fill={COLORS.Offline} />
      </BarChart>
    </ResponsiveContainer>
  )
}
