import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '../../store/store'
import { enqueueActionIfOffline } from '../queue'
import { toggleNetwork, setNetworkLevel } from '../../store/incidentsSlice'

describe('queue', () => {
  beforeEach(() => {
    // Reset network state
    const state = store.getState()
    if (state.incidents.network.active) {
      store.dispatch(toggleNetwork())
    }
  })

  it('should enqueue action when network is offline', () => {
    // Set network to offline
    store.dispatch(setNetworkLevel('Down'))
    store.dispatch(toggleNetwork())

    const wasQueued = enqueueActionIfOffline('UpdateOrderStatus', {
      orderId: 'ORD-10001',
      status: 'EnRoute',
    })

    expect(wasQueued).toBe(true)
    
    const state = store.getState()
    expect(state.queue.actions.length).toBe(1)
    expect(state.queue.actions[0].status).toBe('Queued')
  })

  it('should not enqueue action when network is online', () => {
    // Ensure network is online
    const state = store.getState()
    if (state.incidents.network.active) {
      store.dispatch(toggleNetwork())
    }

    const wasQueued = enqueueActionIfOffline('UpdateOrderStatus', {
      orderId: 'ORD-10001',
      status: 'EnRoute',
    })

    expect(wasQueued).toBe(false)
    
    const finalState = store.getState()
    expect(finalState.queue.actions.length).toBe(0)
  })
})
