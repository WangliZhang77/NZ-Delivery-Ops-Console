import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import App from '../App'
import incidentsReducer from '../store/incidentsSlice'
import queueReducer from '../store/queueSlice'
import auditReducer from '../store/auditSlice'
import ordersReducer from '../store/ordersSlice'
import { mockOrders } from '../mock/data'
import { setOrders } from '../store/ordersSlice'

const createTestStore = () => {
  const store = configureStore({
    reducer: {
      incidents: incidentsReducer,
      queue: queueReducer,
      audit: auditReducer,
      orders: ordersReducer,
    },
  })
  store.dispatch(setOrders(mockOrders))
  return store
}

describe('Routing', () => {
  it('should navigate from orders list to order detail', () => {
    const store = createTestStore()
    const orderId = mockOrders[0].id

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/orders/${orderId}`]}>
          <App />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(new RegExp(`Order Detail: ${orderId}`, 'i'))).toBeInTheDocument()
  })

  it('should render dashboard on root path', () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })
})
