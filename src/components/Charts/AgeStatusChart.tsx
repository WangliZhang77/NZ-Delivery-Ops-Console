import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import CustomTooltip from './CustomTooltip'

interface AgeStatusChartProps {
  data: { ageGroup: string; 'Not Started': number; 'In Transit': number; 'Completed': number; 'Exception': number }[]
}

const COLORS = {
  'Not Started': '#94a3b8',
  'In Transit': '#3b82f6',
  'Completed': '#10b981',
  'Exception': '#ef4444',
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function AgeStatusChart({ data }: AgeStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <XAxis 
          dataKey="ageGroup" 
          tick={axisStyle}
        />
        <YAxis tick={axisStyle} />
        <Tooltip content={<CustomTooltip titleKey="ageGroup" />} />
        <Legend 
          verticalAlign="bottom" 
          height={24}
          iconType="square"
          wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
        />
        <Bar dataKey="Not Started" stackId="a" fill={COLORS['Not Started']} />
        <Bar dataKey="In Transit" stackId="a" fill={COLORS['In Transit']} />
        <Bar dataKey="Completed" stackId="a" fill={COLORS['Completed']} />
        <Bar dataKey="Exception" stackId="a" fill={COLORS['Exception']} />
      </BarChart>
    </ResponsiveContainer>
  )
}
