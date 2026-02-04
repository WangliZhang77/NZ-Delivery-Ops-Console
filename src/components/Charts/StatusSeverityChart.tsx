import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { RiskLevel } from '../../types/order'

interface StatusSeverityChartProps {
  data: { status: string; Low: number; Medium: number; High: number }[]
}

const COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function StatusSeverityChart({ data }: StatusSeverityChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
        <XAxis type="number" tick={axisStyle} />
        <YAxis 
          dataKey="status" 
          type="category" 
          width={70}
          tick={axisStyle}
        />
        <Tooltip />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="square"
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
        <Bar dataKey="Low" stackId="a" fill={COLORS.Low} />
        <Bar dataKey="Medium" stackId="a" fill={COLORS.Medium} />
        <Bar dataKey="High" stackId="a" fill={COLORS.High} />
      </BarChart>
    </ResponsiveContainer>
  )
}
