import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import CustomTooltip from './CustomTooltip'

interface DriverChartProps {
  data: { name: string; fullName?: string; count: number }[]
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function DriverChart({ data }: DriverChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <XAxis type="number" tick={axisStyle} />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={80}
          tick={axisStyle}
        />
        <Tooltip content={<CustomTooltip titleKey="fullName" />} />
        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
