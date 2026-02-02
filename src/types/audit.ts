import type { SystemMode } from './incident'
import type { ActionType } from './queue'

export interface AuditLog {
  id: string
  timestamp: string // ISO string
  mode: SystemMode
  actionType: ActionType
  details: string
  orderId?: string
}
