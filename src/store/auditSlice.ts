import { createSlice } from '@reduxjs/toolkit'
import type { AuditLog, SystemMode } from '../types/audit'
import type { ActionType } from '../types/queue'

interface AuditState {
  logs: AuditLog[]
}

const initialState: AuditState = {
  logs: [],
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    addAuditLog: (
      state,
      action: {
        payload: {
          mode: SystemMode
          actionType: ActionType
          details: string
          orderId?: string
        }
      }
    ) => {
      const log: AuditLog = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        mode: action.payload.mode,
        actionType: action.payload.actionType,
        details: action.payload.details,
        orderId: action.payload.orderId,
      }
      state.logs.push(log)
    },
    clearAuditLogs: (state) => {
      state.logs = []
    },
  },
})

export const { addAuditLog, clearAuditLogs } = auditSlice.actions

export default auditSlice.reducer
