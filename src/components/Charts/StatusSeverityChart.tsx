import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { RiskLevel } from '../../types/order'

interface StatusSeverityChartProps {
  data: { status: string; Low: number; Medium: number; High: number }[]
}

const COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
}

export default function StatusSeverityChart({ data }: StatusSeverityChartProps) {
  return (
    <div className="h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Status vs Severity</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="status" type="category" width={100} />
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
