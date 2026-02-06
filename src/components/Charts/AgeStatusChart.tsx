import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import CustomTooltip from './CustomTooltip'

interface AgeStatusChartProps {
  data: { ageGroup: string; ageKey?: string; 'Not Started': number; 'In Transit': number; 'Completed': number; 'Exception': number }[]
}

// Only Overdue gets colors, others are gray
// Exception always red (exception-first design)
const getBarColor = (dataKey: string, ageKey?: string) => {
  if (dataKey === 'Exception') {
    return '#ef4444' // Red for exceptions (all age groups)
  }
  
  // Only Overdue (4h+) gets colors, others are gray
  if (ageKey === '4h+') {
    if (dataKey === 'Not Started') return '#94a3b8' // Gray
    if (dataKey === 'In Transit') return '#3b82f6' // Blue
    if (dataKey === 'Completed') return '#10b981' // Green
  }
  
  // Fresh and At Risk: all gray (no colors)
  return '#e5e7eb' // Light gray
}

// Legend colors: use representative colors (Overdue state colors)
const LEGEND_COLORS = {
  'Not Started': '#94a3b8', // Gray
  'In Transit': '#3b82f6', // Blue
  'Completed': '#10b981', // Green
  'Exception': '#ef4444', // Red
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
        <Bar dataKey="Not Started" stackId="a" fill={LEGEND_COLORS['Not Started']}>
          {data.map((entry, index) => (
            <Cell key={`cell-not-started-${index}`} fill={getBarColor('Not Started', entry.ageKey)} />
          ))}
        </Bar>
        <Bar dataKey="In Transit" stackId="a" fill={LEGEND_COLORS['In Transit']}>
          {data.map((entry, index) => (
            <Cell key={`cell-in-transit-${index}`} fill={getBarColor('In Transit', entry.ageKey)} />
          ))}
        </Bar>
        <Bar dataKey="Completed" stackId="a" fill={LEGEND_COLORS['Completed']}>
          {data.map((entry, index) => (
            <Cell key={`cell-completed-${index}`} fill={getBarColor('Completed', entry.ageKey)} />
          ))}
        </Bar>
        <Bar dataKey="Exception" stackId="a" fill={LEGEND_COLORS['Exception']}>
          {data.map((entry, index) => (
            <Cell key={`cell-exception-${index}`} fill={getBarColor('Exception', entry.ageKey)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
