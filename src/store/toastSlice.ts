import { createSlice } from '@reduxjs/toolkit'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastState {
  messages: ToastMessage[]
}

const initialState: ToastState = {
  messages: [],
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (
      state,
      action: {
        payload: {
          message: string
          type?: ToastType
          duration?: number
        }
      }
    ) => {
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      }
      state.messages.push(newToast)
    },
    removeToast: (state, action: { payload: string }) => {
      state.messages = state.messages.filter((t) => t.id !== action.payload)
    },
    clearAllToasts: (state) => {
      state.messages = []
    },
  },
})

export const { showToast, removeToast, clearAllToasts } = toastSlice.actions
export default toastSlice.reducer
