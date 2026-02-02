import { store } from '../store/store'
import { toggleNetwork, setNetworkLevel } from '../store/incidentsSlice'
import { updateActionStatus } from '../store/queueSlice'
import { updateOrderStatus, assignDriver } from '../store/ordersSlice'
import { addAuditLog } from '../store/auditSlice'
import type { QueuedAction } from '../types/queue'
import type { SystemMode } from '../types/incident'

/**
 * Recover from offline mode and sync all queued actions
 */
export async function recoverAndSync(): Promise<{
  syncedCount: number
  failedCount: number
}> {
  const state = store.getState()
  const queuedActions = state.queue.actions.filter(
    (a) => a.status === 'Queued'
  )

  // Set network back to online (only if it was down)
  if (state.incidents.network.active && state.incidents.network.level === 'Down') {
    store.dispatch(setNetworkLevel('Degraded'))
    store.dispatch(toggleNetwork()) // This will set active to false
  }

  let syncedCount = 0
  let failedCount = 0

  // Sync each action with delay
  for (const action of queuedActions) {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Apply the action
      if (action.actionType === 'UpdateOrderStatus') {
        const status = action.payload.status as string
        if (status) {
          store.dispatch(
            updateOrderStatus({
              orderId: action.payload.orderId as string,
              status: status as any,
            })
          )
        }
      } else if (action.actionType === 'AssignDriver') {
        const driverName = action.payload.driverName as string
        if (driverName) {
          store.dispatch(
            assignDriver({
              orderId: action.payload.orderId as string,
              driverName,
            })
          )
        }
      }

      // Mark as synced
      store.dispatch(
        updateActionStatus({
          id: action.id,
          status: 'Synced',
        })
      )

      // Add audit log
      store.dispatch(
        addAuditLog({
          mode: 'Offline',
          actionType: action.actionType,
          details: `Synced: ${action.actionType} for order ${action.payload.orderId}`,
          orderId: action.payload.orderId as string,
        })
      )

      syncedCount++
    } catch (error) {
      // Mark as failed
      store.dispatch(
        updateActionStatus({
          id: action.id,
          status: 'Failed',
        })
      )

      store.dispatch(
        addAuditLog({
          mode: 'Offline',
          actionType: action.actionType,
          details: `Failed to sync: ${action.actionType} for order ${action.payload.orderId}`,
          orderId: action.payload.orderId as string,
        })
      )

      failedCount++
    }
  }

  // Add recovery audit log
  store.dispatch(
    addAuditLog({
      mode: 'Normal',
      actionType: 'UpdateOrderStatus',
      details: `Network recovered. Synced ${syncedCount} actions, ${failedCount} failed.`,
    })
  )

  return { syncedCount, failedCount }
}
