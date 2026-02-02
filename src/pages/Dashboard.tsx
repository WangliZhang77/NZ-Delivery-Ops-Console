import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { getSystemMode } from '../utils/systemMode'
import { mockOrders } from '../mock/data'
import { applyIncidentsToOrders, calculateDelayStats } from '../utils/incidentEffects'

export default function Dashboard() {
  const incidents = useSelector((state: RootState) => state.incidents)
  const systemMode = getSystemMode(incidents)

  // Apply incident effects and calculate stats
  const ordersWithIncidents = applyIncidentsToOrders(mockOrders, incidents)
  const delayStats = calculateDelayStats(ordersWithIncidents)
  
  // Count active deliveries (orders not delivered or cancelled)
  const activeDeliveries = ordersWithIncidents.filter(
    (order) => order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Deliveries
          </h3>
          <p className="text-3xl font-bold text-gray-900">{activeDeliveries}</p>
        </div>

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
            {delayStats.avgDelayMinutes}m
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Queued Actions
          </h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Mode</h2>
        <span
          className={`inline-block px-4 py-2 rounded-lg font-medium ${getModeColor()}`}
        >
          {systemMode}
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
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
    </div>
  )
}
