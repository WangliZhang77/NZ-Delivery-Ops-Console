import type { QueueStatus } from '../../types/queue'

interface QueueHealthProps {
  queued: number
  synced: number
  failed: number
}

export default function QueueHealth({ queued, synced, failed }: QueueHealthProps) {
  const total = queued + synced + failed
  const syncedPercent = total > 0 ? Math.round((synced / total) * 100) : 0

  return (
    <div className="flex flex-col h-full justify-center px-4">
      {/* Large numbers */}
      <div className="flex items-baseline justify-between mb-6">
        <div className="text-center flex-1">
          <div className="text-4xl font-bold text-blue-600">{queued}</div>
          <div className="text-xs text-gray-500 mt-1">Queued</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-4xl font-bold text-red-600">{failed}</div>
          <div className="text-xs text-gray-500 mt-1">Failed</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
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
    </div>
  )
}
