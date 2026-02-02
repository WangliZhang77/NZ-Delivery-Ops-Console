import { useParams, Link } from 'react-router-dom'
import { findOrderById } from '../mock/data'
import { generateStatusHistory } from '../utils/timeline'
import { formatEta, formatDateTime } from '../utils/format'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'
import Timeline from '../components/Timeline'

export default function OrderDetail() {
  const { id } = useParams()
  
  if (!id) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Orders
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Not Found</h1>
        <p className="text-gray-500">No order ID provided.</p>
      </div>
    )
  }

  const order = findOrderById(id)
  
  if (!order) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Orders
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Not Found</h1>
        <p className="text-gray-500">Order with ID {id} does not exist.</p>
      </div>
    )
  }

  const statusHistory = generateStatusHistory(order)

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/orders"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Orders
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Order Detail: {order.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500 block mb-1">Order ID</span>
              <p className="font-medium text-gray-900">{order.id}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">Route</span>
              <p className="font-medium text-gray-900">
                {order.fromCity} → {order.toCity}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">Driver</span>
              <p className="font-medium text-gray-900">
                {order.driverName || '-'}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">Status</span>
              <StatusBadge status={order.status} />
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">ETA</span>
              <p className="font-medium text-gray-900">
                {formatEta(order.adjustedEtaMinutes)}
              </p>
              {order.adjustedEtaMinutes !== order.baseEtaMinutes && (
                <p className="text-xs text-gray-500 mt-1">
                  Base: {formatEta(order.baseEtaMinutes)} (Adjusted: +{order.adjustedEtaMinutes - order.baseEtaMinutes}m)
                </p>
              )}
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">Risk Level</span>
              <RiskBadge riskLevel={order.riskLevel} />
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">Last Updated</span>
              <p className="font-medium text-gray-900">
                {formatDateTime(order.lastUpdatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Timeline</h2>
          <Timeline items={statusHistory} />
        </div>
      </div>

      {/* Impact Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Details</h2>
        {order.adjustedEtaMinutes !== order.baseEtaMinutes ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              ETA has been adjusted from {formatEta(order.baseEtaMinutes)} to {formatEta(order.adjustedEtaMinutes)}.
            </p>
            <p className="text-sm text-gray-500">
              Delay: +{order.adjustedEtaMinutes - order.baseEtaMinutes} minutes
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No impact details available. Order is on schedule.</p>
        )}
      </div>
    </div>
  )
}
