import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { OrderStatus } from '../../types/order'

interface IncidentStatusChartProps {
  data: { status: OrderStatus; Normal: number; Disruption: number; Offline: number }[]
}

const COLORS = {
  Normal: '#10b981',
  Disruption: '#f59e0b',
  Offline: '#ef4444',
}

export default function IncidentStatusChart({ data }: IncidentStatusChartProps) {
  return (
    <div className="h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Incident vs Order Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Normal" fill={COLORS.Normal} />
          <Bar dataKey="Disruption" fill={COLORS.Disruption} />
          <Bar dataKey="Offline" fill={COLORS.Offline} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
