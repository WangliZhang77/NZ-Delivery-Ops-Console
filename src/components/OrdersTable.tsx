import { useMemo } from 'react'
import type { Order, RiskLevel } from '../types/order'
import type { IncidentState } from '../types/incident'
import { formatDateTime } from '../utils/format'
import StatusBadge from './StatusBadge'
import RiskBadge from './RiskBadge'

interface OrdersTableProps {
  orders: Order[]
  incidents: IncidentState
}

type OrderType = 'Delivery' | 'Return' | 'Express'
type Category = 'Weather' | 'Network' | 'Road' | 'None'

interface TableRowData {
  order: Order
  priority: RiskLevel
  age: string
  escalated: boolean
  type: OrderType
  category: Category
  acknowledged: boolean
}

// Get risk icon
const RiskIcon = ({ riskLevel }: { riskLevel: RiskLevel }) => {
  const icons = {
    Low: '🟢',
    Medium: '🟡',
    High: '🔴',
  }
  return <span className="text-lg">{icons[riskLevel]}</span>
}

// Calculate age string
const calculateAge = (lastUpdated: string): string => {
  const now = new Date()
  const updated = new Date(lastUpdated)
  const hoursAgo = (now.getTime() - updated.getTime()) / (1000 * 60 * 60)
  
  if (hoursAgo < 1) {
    const minutes = Math.floor(hoursAgo * 60)
    return `${minutes}m`
  }
  if (hoursAgo < 24) {
    return `${Math.floor(hoursAgo)}h`
  }
  const days = Math.floor(hoursAgo / 24)
  return `${days}d`
}

// Determine order type (simplified logic)
const getOrderType = (order: Order): OrderType => {
  // Simple heuristic: based on ETA
  if (order.baseEtaMinutes < 60) return 'Express'
  if (order.baseEtaMinutes < 120) return 'Delivery'
  return 'Return'
}

// Determine category based on incidents affecting the order
const getCategory = (order: Order, incidents: IncidentState): Category => {
  if (incidents.roadClosure.active) return 'Road'
  if (incidents.network.active) return 'Network'
  if (incidents.rain.active || incidents.wind.active) return 'Weather'
  return 'None'
}

// Check if order is acknowledged (simplified: if no active incidents affecting it)
const isAcknowledged = (order: Order, incidents: IncidentState): boolean => {
  // If order is affected by incidents, check if incidents are acknowledged
  const hasActiveIncidents = 
    incidents.rain.active || 
    incidents.wind.active || 
    incidents.roadClosure.active || 
    incidents.network.active
  
  if (!hasActiveIncidents) return true
  
  // Check if all affecting incidents are acknowledged
  const affectingIncidents = [
    incidents.rain.active && !incidents.rain.acknowledged,
    incidents.wind.active && !incidents.wind.acknowledged,
    incidents.roadClosure.active && !incidents.roadClosure.acknowledged,
    incidents.network.active && !incidents.network.acknowledged,
  ]
  
  return !affectingIncidents.some(Boolean)
}

export default function OrdersTable({ orders, incidents }: OrdersTableProps) {
  const tableData = useMemo(() => {
    return orders
      .filter((order) => order.status !== 'Delivered' && order.status !== 'Cancelled')
      .map((order): TableRowData => {
        const delay = order.adjustedEtaMinutes - order.baseEtaMinutes
        return {
          order,
          priority: order.riskLevel,
          age: calculateAge(order.lastUpdatedAt),
          escalated: delay > 30,
          type: getOrderType(order),
          category: getCategory(order, incidents),
          acknowledged: isAcknowledged(order, incidents),
        }
      })
      .sort((a, b) => {
        // Sort by priority (High first), then by escalated, then by age
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        if (a.escalated !== b.escalated) {
          return a.escalated ? -1 : 1
        }
        return a.age.localeCompare(b.age)
      })
  }, [orders, incidents])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Orders Table</h2>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Summary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From / To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acknowledged
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Escalated
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              tableData.map((row) => (
                <tr key={row.order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <RiskIcon riskLevel={row.order.riskLevel} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {row.order.fromCity} → {row.order.toCity}
                    </div>
                    <div className="text-xs text-gray-500">{row.order.status}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row.order.fromCity}</div>
                    <div className="text-sm text-gray-500">→ {row.order.toCity}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <RiskBadge riskLevel={row.priority} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={row.order.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.age}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(row.order.lastUpdatedAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.order.driverName || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.acknowledged ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.escalated ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.category !== 'None' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.category}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
