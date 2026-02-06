import type { OrderStatus } from '../../types/order'
import type { SystemMode } from '../../types/incident'

interface ImpactData {
  status: OrderStatus
  Disruption: number
  Offline: number
}

interface ImpactVsNormalProps {
  data: ImpactData[]
  systemMode: SystemMode
}

export default function ImpactVsNormal({ data, systemMode }: ImpactVsNormalProps) {
  // In Normal mode, show all statuses with "No change"
  if (systemMode === 'Normal') {
    return (
      <div className="h-full overflow-y-auto flex flex-col justify-center px-4">
        <div className="space-y-2.5">
          {data.map((item, index) => (
            <div key={index} className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-gray-600 flex-shrink-0">{item.status}:</span>
              <span className="text-sm font-medium text-gray-500">No change</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Filter out zero values and format for Disruption/Offline modes
  const impactItems = data
    .map((item) => {
      const disruption = item.Disruption !== 0 ? { mode: 'Disruption' as const, value: item.Disruption } : null
      const offline = item.Offline !== 0 ? { mode: 'Offline' as const, value: item.Offline } : null
      return { status: item.status, impacts: [disruption, offline].filter(Boolean) as Array<{ mode: 'Disruption' | 'Offline'; value: number }> }
    })
    .filter((item) => item.impacts.length > 0)

  if (impactItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        No impact detected
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col justify-center px-4">
      <div className="space-y-2.5">
        {impactItems.map((item, index) => (
          <div key={index} className="flex items-baseline gap-2">
            <span className="text-xs font-medium text-gray-600 flex-shrink-0">{item.status}:</span>
            <div className="flex items-center gap-3 flex-wrap">
              {item.impacts.map((impact, idx) => (
                <span
                  key={idx}
                  className={`text-sm font-semibold ${
                    impact.mode === 'Disruption' ? 'text-orange-600' : 'text-red-600'
                  }`}
                >
                  {impact.value > 0 ? '+' : ''}{impact.value} {impact.mode === 'Disruption' ? 'Disruption' : 'Offline'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
