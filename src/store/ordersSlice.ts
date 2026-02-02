import { createSlice } from '@reduxjs/toolkit'
import type { Order, OrderStatus } from '../types/order'

interface OrdersState {
  orders: Order[]
}

const initialState: OrdersState = {
  orders: [],
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: { payload: Order[] }) => {
      state.orders = action.payload
    },
    updateOrderStatus: (
      state,
      action: {
        payload: {
          orderId: string
          status: OrderStatus
        }
      }
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId)
      if (order) {
        order.status = action.payload.status
        order.lastUpdatedAt = new Date().toISOString()
      }
    },
    assignDriver: (
      state,
      action: {
        payload: {
          orderId: string
          driverName: string
        }
      }
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId)
      if (order) {
        order.driverName = action.payload.driverName
        order.lastUpdatedAt = new Date().toISOString()
      }
    },
  },
})

export const { setOrders, updateOrderStatus, assignDriver } =
  ordersSlice.actions

export default ordersSlice.reducer
