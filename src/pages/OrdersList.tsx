import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'
import type { Order, City, OrderStatus, RiskLevel } from '../types/order'
import type { RootState } from '../store/store'
import { formatEta, formatDateTime } from '../utils/format'
import { applyIncidentsToOrders } from '../utils/incidentEffects'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

type SortField = 'eta' | 'lastUpdated' | null
type SortDirection = 'asc' | 'desc'

export default function OrdersList() {
  const navigate = useNavigate()
  const incidents = useSelector((state: RootState) => state.incidents, shallowEqual)
  const orders = useSelector((state: RootState) => state.orders.orders)
  const [cityFilter, setCityFilter] = useState<string>('All Cities')
  const [statusFilter, setStatusFilter] = useState<string>('All Status')
  const [riskFilter, setRiskFilter] = useState<string>('All Risk')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Apply incident effects to orders
  const ordersWithIncidents = useMemo(() => {
    return applyIncidentsToOrders(orders, incidents)
  }, [orders, incidents])

  // Filter orders
  const filteredOrders = useMemo(() => {
    return ordersWithIncidents.filter((order) => {
      // City filter: match fromCity or toCity
      if (cityFilter !== 'All Cities') {
        if (order.fromCity !== cityFilter && order.toCity !== cityFilter) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'All Status') {
        if (order.status !== statusFilter) {
          return false
        }
      }

      // Risk filter
      if (riskFilter !== 'All Risk') {
        if (order.riskLevel !== riskFilter) {
          return false
        }
      }

      return true
    })
  }, [ordersWithIncidents, cityFilter, statusFilter, riskFilter])

  // Sort orders
  const sortedOrders = useMemo(() => {
    if (!sortField) return filteredOrders

    const sorted = [...filteredOrders].sort((a, b) => {
      let comparison = 0

      if (sortField === 'eta') {
        comparison = a.adjustedEtaMinutes - b.adjustedEtaMinutes
      } else if (sortField === 'lastUpdated') {
        comparison = new Date(a.lastUpdatedAt).getTime() - new Date(b.lastUpdatedAt).getTime()
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredOrders, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`)
  }

  // Get unique cities for filter
  const cities = useMemo(() => {
    const citySet = new Set<City>()
    orders.forEach((order) => {
      citySet.add(order.fromCity)
      citySet.add(order.toCity)
    })
    return Array.from(citySet).sort()
  }, [orders])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-4">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Status</option>
            <option value="Created">Created</option>
            <option value="Assigned">Assigned</option>
            <option value="PickedUp">PickedUp</option>
            <option value="EnRoute">EnRoute</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Risk</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('eta')}
                >
                  <div className="flex items-center gap-1">
                    ETA
                    {sortField === 'eta' && (
                      <span className="text-gray-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastUpdated')}
                >
                  <div className="flex items-center gap-1">
                    Last Updated
                    {sortField === 'lastUpdated' && (
                      <span className="text-gray-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders found matching the filters.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.fromCity} → {order.toCity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.driverName || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatEta(order.adjustedEtaMinutes)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskBadge riskLevel={order.riskLevel} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(order.lastUpdatedAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {sortedOrders.length} of {ordersWithIncidents.length} orders
      </div>
    </div>
  )
}
