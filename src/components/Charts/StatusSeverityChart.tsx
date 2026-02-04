import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import type { RiskLevel } from '../../types/order'
import CustomTooltip from './CustomTooltip'

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
        barSize={18}
        margin={{ top: 8, right: 16, bottom: 16, left: 80 }}
      >
        <XAxis type="number" tick={axisStyle} />
        <YAxis 
          dataKey="status" 
          type="category" 
          width={90}
          tick={axisStyle}
          tickMargin={8}
        />
        <Tooltip content={<CustomTooltip titleKey="status" cursor={false} />} cursor={false} />
        <Legend 
          verticalAlign="bottom" 
          height={24}
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
