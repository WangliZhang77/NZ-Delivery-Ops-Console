import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { formatDateTime } from '../utils/format'
import type { SystemMode } from '../types/incident'
import type { ActionType } from '../types/queue'

export default function System() {
  const incidents = useSelector((state: RootState) => state.incidents)
  const queue = useSelector((state: RootState) => state.queue)
  const audit = useSelector((state: RootState) => state.audit)
  
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>('All')
  const [auditModeFilter, setAuditModeFilter] = useState<string>('All Modes')
  const [auditActionFilter, setAuditActionFilter] = useState<string>('All Action Types')
  
  const isOffline =
    incidents.network.active && incidents.network.level === 'Down'
  const networkStatus = isOffline ? 'Offline' : 'Online'
  const networkStatusColor = isOffline ? 'bg-red-500' : 'bg-green-500'

  // Filter queued actions
  const filteredQueueActions = useMemo(() => {
    if (queueStatusFilter === 'All') {
      return queue.actions
    }
    return queue.actions.filter((a) => a.status === queueStatusFilter)
  }, [queue.actions, queueStatusFilter])

  // Filter audit logs
  const filteredAuditLogs = useMemo(() => {
    let logs = audit.logs

    if (auditModeFilter !== 'All Modes') {
      logs = logs.filter((log) => log.mode === auditModeFilter)
    }

    if (auditActionFilter !== 'All Action Types') {
      logs = logs.filter((log) => log.actionType === auditActionFilter)
    }

    // Sort by timestamp (newest first)
    return logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [audit.logs, auditModeFilter, auditActionFilter])

  const queuedActions = queue.actions.filter((a) => a.status === 'Queued')
  const syncedActions = queue.actions.filter((a) => a.status === 'Synced')
  const failedActions = queue.actions.filter((a) => a.status === 'Failed')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        System Status & Audit Log
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Network Status
          </h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${networkStatusColor}`}></div>
            <span className="font-medium text-gray-900">{networkStatus}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Queued Actions
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Queued:</span>
              <span className="font-medium text-blue-600">
                {queuedActions.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Synced:</span>
              <span className="font-medium text-green-600">
                {syncedActions.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Failed:</span>
              <span className="font-medium text-red-600">
                {failedActions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Queued Actions List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Queued Actions
          </h2>
          <select
            value={queueStatusFilter}
            onChange={(e) => setQueueStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Queued">Queued</option>
            <option value="Synced">Synced</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        {filteredQueueActions.length === 0 ? (
          <p className="text-gray-500">No queued actions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payload
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Queued At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQueueActions.map((action) => (
                  <tr key={action.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {action.id.substring(0, 20)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {action.actionType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {JSON.stringify(action.payload)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(action.queuedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          action.status === 'Queued'
                            ? 'bg-blue-100 text-blue-800'
                            : action.status === 'Synced'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {action.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Log</h2>
        <div className="flex gap-4 mb-4">
          <select
            value={auditModeFilter}
            onChange={(e) => setAuditModeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Modes</option>
            <option>Normal</option>
            <option>Disruption</option>
            <option>Offline</option>
          </select>
          <select
            value={auditActionFilter}
            onChange={(e) => setAuditActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Action Types</option>
            <option>UpdateOrderStatus</option>
            <option>AssignDriver</option>
            <option>CreateOrder</option>
          </select>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAuditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No audit logs available
                  </td>
                </tr>
              ) : (
                filteredAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.mode === 'Normal'
                            ? 'bg-green-100 text-green-800'
                            : log.mode === 'Disruption'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.actionType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
