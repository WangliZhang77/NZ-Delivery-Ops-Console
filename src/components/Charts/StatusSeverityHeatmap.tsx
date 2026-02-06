import type { RiskLevel } from '../../types/order'

interface StatusSeverityData {
  status: string
  Low: number
  Medium: number
  High: number
}

interface StatusSeverityHeatmapProps {
  data: StatusSeverityData[]
}

const getCellStyle = (riskLevel: RiskLevel, value: number) => {
  if (value === 0) {
    return {
      backgroundColor: '#f9fafb',
      color: '#9ca3af',
    }
  }

  if (riskLevel === 'High') {
    // High: more visible red gradient
    const intensity = Math.min(value / 10, 1) // Normalize to 0-1, cap at 10
    const opacity = 0.15 + intensity * 0.5 // 0.15 to 0.65 opacity (more visible)
    return {
      backgroundColor: `rgba(239, 68, 68, ${opacity})`,
      color: value > 0 ? '#dc2626' : '#9ca3af',
      fontWeight: value > 0 ? 600 : 400,
    }
  }

  // Low and Medium: gray scale
  if (riskLevel === 'Medium') {
    const intensity = Math.min(value / 10, 1)
    const opacity = 0.05 + intensity * 0.2
    return {
      backgroundColor: `rgba(107, 114, 128, ${opacity})`,
      color: value > 0 ? '#6b7280' : '#9ca3af',
      fontWeight: value > 0 ? 500 : 400,
    }
  }

  // Low: further weakened (lighter gray)
  const intensity = Math.min(value / 10, 1)
  const opacity = 0.02 + intensity * 0.1 // Even lighter
  return {
    backgroundColor: `rgba(209, 213, 219, ${opacity})`, // Lighter gray
    color: value > 0 ? '#9ca3af' : '#9ca3af',
    fontWeight: value > 0 ? 400 : 400,
  }
}

export default function StatusSeverityHeatmap({ data }: StatusSeverityHeatmapProps) {
  const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High']

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 sticky left-0 bg-white z-10 border-r border-gray-200">
              Status
            </th>
            {riskLevels.map((level) => (
              <th
                key={level}
                className={`text-center py-2 px-3 text-xs font-semibold ${
                  level === 'High' ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {level}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
              <td className="py-2 px-3 text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors border-r border-gray-200">
                {row.status}
              </td>
              {riskLevels.map((level) => {
                const value = row[level]
                const style = getCellStyle(level, value)
                return (
                  <td
                    key={level}
                    className="text-center py-2 px-3 text-sm"
                    style={style}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
