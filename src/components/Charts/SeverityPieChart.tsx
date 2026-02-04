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

export default function SeverityPieChart({ data }: SeverityPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.riskLevel,
    value: item.count,
  }))

  return (
    <div className="h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Severity Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as RiskLevel]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
