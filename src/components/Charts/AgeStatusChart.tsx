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

export default function AgeStatusChart({ data }: AgeStatusChartProps) {
  return (
    <div className="h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Age vs Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ageGroup" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Created" stackId="a" fill={COLORS.Created} />
          <Bar dataKey="Assigned" stackId="a" fill={COLORS.Assigned} />
          <Bar dataKey="PickedUp" stackId="a" fill={COLORS.PickedUp} />
          <Bar dataKey="EnRoute" stackId="a" fill={COLORS.EnRoute} />
          <Bar dataKey="Delivered" stackId="a" fill={COLORS.Delivered} />
          <Bar dataKey="Cancelled" stackId="a" fill={COLORS.Cancelled} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
