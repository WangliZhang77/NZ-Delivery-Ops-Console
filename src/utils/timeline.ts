import type { Order, OrderStatus } from '../types/order'
import type { StatusHistoryItem } from '../types/timeline'

// Status progression order
const statusOrder: OrderStatus[] = [
  'Created',
  'Assigned',
  'PickedUp',
  'EnRoute',
  'Delivered',
  'Cancelled'
]

// Generate status history based on current status
export function generateStatusHistory(order: Order): StatusHistoryItem[] {
  const history: StatusHistoryItem[] = []
  const currentStatusIndex = statusOrder.indexOf(order.status)
  
  // Generate timestamps going backwards from lastUpdatedAt
  const baseDate = new Date(order.lastUpdatedAt)
  const statusCount = currentStatusIndex + 1
  
  // Always include at least 3 statuses
  // If order is in early stages, we'll show the progression up to current status
  const minStatuses = Math.max(3, statusCount)
  
  // Generate status history items
  for (let i = 0; i < minStatuses; i++) {
    // Determine which status to show
    // If we need more items than actual statuses, repeat the current status with different timestamps
    let status: OrderStatus
    if (i <= currentStatusIndex) {
      // Show actual status progression
      status = statusOrder[i]
    } else {
      // If we need more items, show the current status again (for orders in early stages)
      status = order.status
    }
    
    // Calculate timestamp: more recent statuses have more recent timestamps
    // Space them out by 30-90 minutes
    const minutesAgo = (minStatuses - i) * (30 + Math.random() * 60)
    const timestamp = new Date(baseDate.getTime() - minutesAgo * 60000)
    
    let description = ''
    switch (status) {
      case 'Created':
        description = 'Order was created'
        break
      case 'Assigned':
        description = order.driverName ? `Assigned to ${order.driverName}` : 'Driver assigned'
        break
      case 'PickedUp':
        description = 'Package picked up from origin'
        break
      case 'EnRoute':
        description = `En route from ${order.fromCity} to ${order.toCity}`
        break
      case 'Delivered':
        description = `Delivered to ${order.toCity}`
        break
      case 'Cancelled':
        description = 'Order was cancelled'
        break
    }
    
    history.push({
      status,
      timestamp: timestamp.toISOString(),
      description
    })
  }
  
  // Sort by timestamp (oldest first)
  return history.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}
