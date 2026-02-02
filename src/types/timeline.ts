import type { OrderStatus } from './order'

export interface StatusHistoryItem {
  status: OrderStatus
  timestamp: string // ISO string
  description?: string
}
