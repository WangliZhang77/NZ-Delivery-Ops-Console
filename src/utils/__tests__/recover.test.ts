import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '../../store/store'
import { recoverAndSync } from '../recover'
import { toggleNetwork, setNetworkLevel } from '../../store/incidentsSlice'
import { enqueueAction } from '../../store/queueSlice'
import { setOrders } from '../../store/ordersSlice'
import { mockOrders } from '../../mock/data'

describe('recover', () => {
  beforeEach(() => {
    // Reset store
    store.dispatch(setOrders(mockOrders))
    
    // Set network to offline
    store.dispatch(setNetworkLevel('Down'))
    store.dispatch(toggleNetwork())

    // Queue some actions
    store.dispatch(
      enqueueAction({
        actionType: 'UpdateOrderStatus',
        payload: {
          orderId: mockOrders[0].id,
          status: 'EnRoute',
        },
      })
    )
  })

  it('should sync queued actions after recovery', async () => {
    const result = await recoverAndSync()

    expect(result.syncedCount).toBeGreaterThan(0)
    
    const state = store.getState()
    const syncedActions = state.queue.actions.filter((a) => a.status === 'Synced')
    expect(syncedActions.length).toBeGreaterThan(0)
    
    // Check audit log
    expect(state.audit.logs.length).toBeGreaterThan(0)
    expect(state.audit.logs.some((log) => log.details.includes('Network recovered'))).toBe(true)
  })
})
