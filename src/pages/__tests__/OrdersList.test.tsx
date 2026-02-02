import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import OrdersList from '../OrdersList'
import incidentsReducer from '../../store/incidentsSlice'
import queueReducer from '../../store/queueSlice'
import auditReducer from '../../store/auditSlice'
import ordersReducer from '../../store/ordersSlice'
import { mockOrders } from '../../mock/data'
import { setOrders } from '../../store/ordersSlice'

describe('OrdersList', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        incidents: incidentsReducer,
        queue: queueReducer,
        audit: auditReducer,
        orders: ordersReducer,
      },
    })
    store.dispatch(setOrders(mockOrders))
  })

  it('should render orders list', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrdersList />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText(/Orders/i)).toBeInTheDocument()
  })

  it('should display orders in the table', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrdersList />
        </BrowserRouter>
      </Provider>
    )

    // Verify orders are displayed
    const firstOrderId = mockOrders[0].id
    expect(screen.getByText(firstOrderId)).toBeInTheDocument()
  })
})
