import { createSlice } from '@reduxjs/toolkit'
import type { QueuedAction, ActionType, QueueStatus } from '../types/queue'

interface QueueState {
  actions: QueuedAction[]
}

const initialState: QueueState = {
  actions: [],
}

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    enqueueAction: (
      state,
      action: {
        payload: {
          actionType: ActionType
          payload: QueuedAction['payload']
        }
      }
    ) => {
      const newAction: QueuedAction = {
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        actionType: action.payload.actionType,
        payload: action.payload.payload,
        queuedAt: new Date().toISOString(),
        status: 'Queued',
      }
      state.actions.push(newAction)
    },
    updateActionStatus: (
      state,
      action: {
        payload: {
          id: string
          status: QueueStatus
        }
      }
    ) => {
      const actionItem = state.actions.find((a) => a.id === action.payload.id)
      if (actionItem) {
        actionItem.status = action.payload.status
      }
    },
    clearSyncedActions: (state) => {
      state.actions = state.actions.filter((a) => a.status !== 'Synced')
    },
    clearAllActions: (state) => {
      state.actions = []
    },
  },
})

export const {
  enqueueAction,
  updateActionStatus,
  clearSyncedActions,
  clearAllActions,
} = queueSlice.actions

export default queueSlice.reducer
