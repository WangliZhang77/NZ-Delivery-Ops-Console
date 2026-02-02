import { configureStore } from '@reduxjs/toolkit'
import incidentsReducer from './incidentsSlice'
import queueReducer from './queueSlice'
import auditReducer from './auditSlice'
import ordersReducer from './ordersSlice'

export const store = configureStore({
  reducer: {
    incidents: incidentsReducer,
    queue: queueReducer,
    audit: auditReducer,
    orders: ordersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
