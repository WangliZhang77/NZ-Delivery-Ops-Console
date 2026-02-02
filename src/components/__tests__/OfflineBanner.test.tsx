import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import OfflineBanner from '../OfflineBanner'
import incidentsReducer from '../../store/incidentsSlice'

describe('OfflineBanner', () => {
  it('should render offline message', () => {
    render(<OfflineBanner />)
    expect(screen.getByText(/Offline mode: actions will be queued/i)).toBeInTheDocument()
  })
})
