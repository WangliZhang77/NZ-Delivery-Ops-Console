import { store } from '../store/store'
import { enqueueAction } from '../store/queueSlice'
import type { ActionType } from '../types/queue'

/**
 * Enqueue an action when network is offline
 */
export function enqueueActionIfOffline(
  actionType: ActionType,
  payload: Record<string, unknown>
): boolean {
  const state = store.getState()
  const isOffline =
    state.incidents.network.active && state.incidents.network.level === 'Down'

  if (isOffline) {
    store.dispatch(
      enqueueAction({
        actionType,
        payload,
      })
    )
    return true // Action was queued
  }

  return false // Action was not queued (network is online)
}
