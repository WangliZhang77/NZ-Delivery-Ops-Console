export type ActionType = 'UpdateOrderStatus' | 'AssignDriver' | 'CreateOrder'

export type QueueStatus = 'Queued' | 'Synced' | 'Failed'

export interface QueuedAction {
  id: string
  actionType: ActionType
  payload: {
    orderId?: string
    status?: string
    driverName?: string
    [key: string]: unknown
  }
  queuedAt: string // ISO string
  status: QueueStatus
}
