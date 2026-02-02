import type { StatusHistoryItem } from '../types/timeline'
import { formatDateTime } from '../utils/format'
import StatusBadge from './StatusBadge'

interface TimelineProps {
  items: StatusHistoryItem[]
}

export default function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return <p className="text-gray-500 text-sm">No status history available</p>
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex gap-4 relative">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full z-10 ${
                  isLast
                    ? 'bg-blue-500 ring-2 ring-blue-200'
                    : 'bg-gray-300'
                }`}
              />
              {!isLast && (
                <div className="absolute left-1.5 top-3 w-0.5 h-full bg-gray-200" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-3 mb-1">
                <StatusBadge status={item.status} />
                <span className="text-sm text-gray-500">
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
