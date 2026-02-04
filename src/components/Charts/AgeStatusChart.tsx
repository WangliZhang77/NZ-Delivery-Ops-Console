import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { OrderStatus } from '../../types/order'

interface AgeStatusChartProps {
  data: { ageGroup: string; [key in OrderStatus]: number }[]
}

const COLORS = {
  Created: '#94a3b8',
  Assigned: '#3b82f6',
  PickedUp: '#8b5cf6',
  EnRoute: '#f59e0b',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function AgeStatusChart({ data }: AgeStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
        <XAxis 
          dataKey="ageGroup" 
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
        <Bar dataKey="Created" stackId="a" fill={COLORS.Created} />
        <Bar dataKey="Assigned" stackId="a" fill={COLORS.Assigned} />
        <Bar dataKey="PickedUp" stackId="a" fill={COLORS.PickedUp} />
        <Bar dataKey="EnRoute" stackId="a" fill={COLORS.EnRoute} />
        <Bar dataKey="Delivered" stackId="a" fill={COLORS.Delivered} />
        <Bar dataKey="Cancelled" stackId="a" fill={COLORS.Cancelled} />
      </BarChart>
    </ResponsiveContainer>
  )
}
