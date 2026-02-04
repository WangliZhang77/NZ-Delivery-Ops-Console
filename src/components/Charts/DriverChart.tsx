import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DriverChartProps {
  data: { name: string; count: number }[]
}

const axisStyle = { fontSize: 12, fill: '#64748b' }

export default function DriverChart({ data }: DriverChartProps) {
  // Shorten driver names if too long
  const shortenedData = data.map(item => ({
    ...item,
    name: item.name.length > 12 ? item.name.substring(0, 10) + '...' : item.name,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={shortenedData}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 16, left: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
        <XAxis type="number" tick={axisStyle} />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={65}
          tick={axisStyle}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
