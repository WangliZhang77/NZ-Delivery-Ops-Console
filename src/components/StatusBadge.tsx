import type { OrderStatus } from '../types/order'

interface StatusBadgeProps {
  status: OrderStatus
}

// Status colors: use grayscale (no colors for normal status)
// Exception (Cancelled) uses red
const statusColors: Record<OrderStatus, string> = {
  Created: 'bg-gray-100 text-gray-800',
  Assigned: 'bg-gray-100 text-gray-800',
  PickedUp: 'bg-gray-200 text-gray-700',
  EnRoute: 'bg-gray-200 text-gray-700',
  Delivered: 'bg-gray-300 text-gray-700',
  Cancelled: 'bg-red-100 text-red-800', // Exception: red
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  )
}
