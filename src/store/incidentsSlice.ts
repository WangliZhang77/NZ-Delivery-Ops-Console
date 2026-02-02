import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IncidentState, Severity, NetworkLevel } from '../types/incident'

const initialState: IncidentState = {
  rain: {
    active: false,
    severity: 'Low',
  },
  wind: {
    active: false,
    severity: 'Low',
  },
  roadClosure: {
    active: false,
    severity: 'Low',
  },
  network: {
    active: false,
    level: 'Degraded',
  },
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    toggleRain: (state) => {
      state.rain.active = !state.rain.active
    },
    setRainSeverity: (state, action: PayloadAction<Severity>) => {
      state.rain.severity = action.payload
    },
    toggleWind: (state) => {
      state.wind.active = !state.wind.active
    },
    setWindSeverity: (state, action: PayloadAction<Severity>) => {
      state.wind.severity = action.payload
    },
    toggleRoadClosure: (state) => {
      state.roadClosure.active = !state.roadClosure.active
    },
    setRoadClosureSeverity: (state, action: PayloadAction<Severity>) => {
      state.roadClosure.severity = action.payload
    },
    toggleNetwork: (state) => {
      state.network.active = !state.network.active
    },
    setNetworkLevel: (state, action: PayloadAction<NetworkLevel>) => {
      state.network.level = action.payload
    },
    recoverAll: (state) => {
      state.rain.active = false
      state.wind.active = false
      state.roadClosure.active = false
      state.network.active = false
    },
  },
})

export const {
  toggleRain,
  setRainSeverity,
  toggleWind,
  setWindSeverity,
  toggleRoadClosure,
  setRoadClosureSeverity,
  toggleNetwork,
  setNetworkLevel,
  recoverAll,
} = incidentsSlice.actions

export default incidentsSlice.reducer
