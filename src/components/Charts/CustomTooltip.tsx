import type { TooltipProps } from 'recharts'

interface CustomTooltipProps extends TooltipProps<number, string> {
  titleKey?: string
  showPercentage?: boolean
  total?: number
  cursor?: boolean
}

export default function CustomTooltip({ active, payload, titleKey, showPercentage, total, cursor = true, ...props }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const title = titleKey ? data[titleKey] : payload[0].name

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2 min-w-[150px]"
      style={{ pointerEvents: cursor ? 'auto' : 'none' }}
    >
      {title && (
        <div className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-1">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const value = typeof entry.value === 'number' ? entry.value : 0
          const percentage = showPercentage && total ? ((value / total) * 100).toFixed(0) : null
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {value}
                {percentage && ` (${percentage}%)`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
