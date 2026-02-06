import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { RiskLevel } from '../../types/order'
import CustomTooltip from './CustomTooltip'

interface SeverityPieChartProps {
  data: { riskLevel: RiskLevel; count: number }[]
}

// Weakened colors for overview (not alarm)
// Low/Medium: lighter, High: reduced saturation
const COLORS = {
  Low: '#86efac', // lighter green
  Medium: '#fcd34d', // lighter orange
  High: '#f87171', // reduced saturation red
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function SeverityPieChart({ data }: SeverityPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.riskLevel,
    value: item.count,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  const highRiskCount = data.find((item) => item.riskLevel === 'High')?.count || 0

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 8, right: 16, bottom: 16, left: 24 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={2}
          labelLine={false}
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as RiskLevel]} />
          ))}
        </Pie>
        {/* Center text showing total and high risk */}
        <text
          x="50%"
          y="42%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '16px', fontWeight: 700, fill: '#111827' }}
        >
          {total} Deliveries
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '12px', fontWeight: 600, fill: '#ef4444' }}
        >
          High Risk: {highRiskCount}
        </text>
        <Tooltip content={<CustomTooltip showPercentage total={total} />} />
        <Legend 
          verticalAlign="bottom" 
          height={24}
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
