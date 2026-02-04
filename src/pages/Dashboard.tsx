import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { getSystemMode } from '../utils/systemMode'
import { applyIncidentsToOrders, calculateDelayStats } from '../utils/incidentEffects'
import { formatEta } from '../utils/format'
import NorthIslandMap from '../components/NorthIslandMap'

export default function Dashboard() {
  const incidents = useSelector((state: RootState) => state.incidents)
  const orders = useSelector((state: RootState) => state.orders.orders)
  const queuedActionsCount = useSelector(
    (state: RootState) => state.queue.actions.filter(a => a.status === 'Queued').length
  )
  const systemMode = getSystemMode(incidents)

  // Apply incident effects and calculate stats
  const ordersWithIncidents = applyIncidentsToOrders(orders, incidents)
  const delayStats = calculateDelayStats(ordersWithIncidents)
  
  // KPI 1: Open - Active Deliveries (orders not delivered or cancelled)
  const openKPI = ordersWithIncidents.filter(
    (order) => order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length
  
  // KPI 2: Critical - High Risk Deliveries
  const criticalKPI = ordersWithIncidents.filter(
    (order) => order.riskLevel === 'High' && order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length
  
  // KPI 3: Escalated - Orders with ETA delay > 30 minutes
  const escalatedKPI = ordersWithIncidents.filter(
    (order) => {
      const delay = order.adjustedEtaMinutes - order.baseEtaMinutes
      return delay > 30 && order.status !== 'Delivered' && order.status !== 'Cancelled'
    }
  ).length
  
  // KPI 4: Unassigned - Orders without driver
  const unassignedKPI = ordersWithIncidents.filter(
    (order) => !order.driverName && order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length
  
  // KPI 5: Unacknowledged - Active incidents that are not acknowledged
  const unacknowledgedKPI = [
    incidents.rain.active && !incidents.rain.acknowledged,
    incidents.wind.active && !incidents.wind.acknowledged,
    incidents.roadClosure.active && !incidents.roadClosure.acknowledged,
    incidents.network.active && !incidents.network.acknowledged,
  ].filter(Boolean).length

  const getModeColor = () => {
    switch (systemMode) {
      case 'Normal':
        return 'bg-green-100 text-green-800'
      case 'Disruption':
        return 'bg-yellow-100 text-yellow-800'
      case 'Offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Top KPI Tiles - Oracle Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Open KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Open
          </h3>
          <p className="text-3xl font-bold text-gray-900">{openKPI}</p>
          <p className="text-xs text-gray-400 mt-1">Active Deliveries</p>
        </div>

        {/* Critical KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Critical
          </h3>
          <p className="text-3xl font-bold text-red-600">{criticalKPI}</p>
          <p className="text-xs text-gray-400 mt-1">High Risk Deliveries</p>
        </div>

        {/* Escalated KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Escalated
          </h3>
          <p className="text-3xl font-bold text-orange-600">{escalatedKPI}</p>
          <p className="text-xs text-gray-400 mt-1">Delayed &gt;30min</p>
        </div>

        {/* Unassigned KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Unassigned
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{unassignedKPI}</p>
          <p className="text-xs text-gray-400 mt-1">No Driver Assigned</p>
        </div>

        {/* Unacknowledged KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Unacknowledged
          </h3>
          <p className="text-3xl font-bold text-purple-600">{unacknowledgedKPI}</p>
          <p className="text-xs text-gray-400 mt-1">Active Incidents</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Delayed Orders
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {delayStats.delayedCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Delay</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatEta(delayStats.avgDelayMinutes)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Queued Actions
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {queuedActionsCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Incidents
          </h2>
          {systemMode === 'Normal' ? (
            <p className="text-gray-500">No recent incidents</p>
          ) : (
            <div className="space-y-2">
              {incidents.rain.active && (
                <p className="text-sm text-gray-600">
                  Heavy Rain ({incidents.rain.severity})
                </p>
              )}
              {incidents.wind.active && (
                <p className="text-sm text-gray-600">
                  Strong Wind ({incidents.wind.severity})
                </p>
              )}
              {incidents.roadClosure.active && (
                <p className="text-sm text-gray-600">
                  Road Closure ({incidents.roadClosure.severity})
                </p>
              )}
              {incidents.network.active && (
                <p className="text-sm text-gray-600">
                  Network {incidents.network.level}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Mode</h2>
          <span
            className={`inline-block px-4 py-2 rounded-lg font-medium ${getModeColor()}`}
          >
            {systemMode}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          North Island Delivery Routes
        </h2>
        <NorthIslandMap />
      </div>
    </div>
  )
}
