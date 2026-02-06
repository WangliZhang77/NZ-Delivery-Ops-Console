import type { RiskLevel } from '../../types/order'

interface RouteRiskData {
  route: string
  riskLevel: RiskLevel
  avgDelayMinutes: number
}

interface TopRiskRoutesProps {
  data: RouteRiskData[]
}

const RISK_COLORS = {
  High: 'text-red-600',
  Medium: 'text-orange-600',
  Low: 'text-green-600',
}

const RISK_BADGES = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-orange-100 text-orange-800',
  Low: 'bg-green-100 text-green-800',
}

export default function TopRiskRoutes({ data }: TopRiskRoutesProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        No active routes
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-1">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 py-2.5 px-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 flex-shrink-0" style={{ minWidth: '90px' }}>
              {item.route}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ${RISK_BADGES[item.riskLevel]}`}
            >
              {item.riskLevel}
            </span>
            <div className={`text-sm font-medium flex-shrink-0 ml-auto ${RISK_COLORS[item.riskLevel]}`}>
              {item.avgDelayMinutes > 0 ? `+${item.avgDelayMinutes} min` : '0 min'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
