import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { RiskLevel } from '../../types/order'

interface SeverityPieChartProps {
  data: { riskLevel: RiskLevel; count: number }[]
}

const COLORS = {
  Low: '#10b981', // green
  Medium: '#f59e0b', // orange
  High: '#ef4444', // red
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function SeverityPieChart({ data }: SeverityPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.riskLevel,
    value: item.count,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 8, right: 16, bottom: 16, left: 24 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={65}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as RiskLevel]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
