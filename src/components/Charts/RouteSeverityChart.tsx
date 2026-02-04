import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { RiskLevel } from '../../types/order'

interface RouteSeverityChartProps {
  data: { route: string; Low: number; Medium: number; High: number }[]
}

const COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
}

export default function RouteSeverityChart({ data }: RouteSeverityChartProps) {
  return (
    <div className="h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Route vs Severity</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="route" type="category" width={80} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Low" stackId="a" fill={COLORS.Low} />
          <Bar dataKey="Medium" stackId="a" fill={COLORS.Medium} />
          <Bar dataKey="High" stackId="a" fill={COLORS.High} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
