import type { SystemMode } from '../../types/incident'

interface QueueHealthProps {
  queued: number
  synced: number
  failed: number
  systemMode: SystemMode
}

export default function QueueHealth({ queued, synced, failed, systemMode }: QueueHealthProps) {
  const total = queued + synced + failed
  const syncedPercent = total > 0 ? Math.round((synced / total) * 100) : 0
  const isOnline = systemMode !== 'Offline'

  // Color rules:
  // 0 = gray
  // >0 = yellow
  // Failed >0 = red
  const getQueuedColor = () => {
    if (queued === 0) return 'text-gray-500'
    return 'text-yellow-600'
  }

  const getFailedColor = () => {
    if (failed === 0) return 'text-gray-500'
    return 'text-red-600'
  }

  const getStatusColor = () => {
    if (isOnline) return 'text-green-600'
    return 'text-red-600'
  }

  return (
    <div className="flex flex-col h-full justify-center px-4">
      {/* System Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${getStatusColor()}`}>
            {isOnline ? '●' : '○'} {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Large numbers */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-center flex-1">
          <div className={`text-3xl font-bold ${getQueuedColor()}`}>{queued}</div>
          <div className="text-xs text-gray-500 mt-1">Queued</div>
        </div>
        <div className="text-center flex-1">
          <div className={`text-3xl font-bold ${getFailedColor()}`}>{failed}</div>
          <div className="text-xs text-gray-500 mt-1">Failed</div>
        </div>
      </div>

      {/* Progress bar - only show if total > 0 */}
      {total > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Synced</span>
            <span className="text-xs text-gray-600">{synced} / {total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${syncedPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{syncedPercent}%</div>
        </div>
      )}
    </div>
  )
}
