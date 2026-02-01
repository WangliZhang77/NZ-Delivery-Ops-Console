import type { RiskLevel } from '../types/order'

interface RiskBadgeProps {
  riskLevel: RiskLevel
}

const riskColors: Record<RiskLevel, string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
}

export default function RiskBadge({ riskLevel }: RiskBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColors[riskLevel]}`}>
      {riskLevel}
    </span>
  )
}
