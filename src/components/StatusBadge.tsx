import type { OrderStatus } from '../types/order'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusColors: Record<OrderStatus, string> = {
  Created: 'bg-gray-100 text-gray-800',
  Assigned: 'bg-blue-100 text-blue-800',
  PickedUp: 'bg-yellow-100 text-yellow-800',
  EnRoute: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  )
}
