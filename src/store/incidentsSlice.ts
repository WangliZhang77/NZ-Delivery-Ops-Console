import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IncidentState, Severity, NetworkLevel } from '../types/incident'

const initialState: IncidentState = {
  rain: {
    active: false,
    severity: 'Low',
    acknowledged: false,
  },
  wind: {
    active: false,
    severity: 'Low',
    acknowledged: false,
  },
  roadClosure: {
    active: false,
    severity: 'Low',
    acknowledged: false,
  },
  network: {
    active: false,
    level: 'Degraded',
    acknowledged: false,
  },
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    toggleRain: (state) => {
      state.rain.active = !state.rain.active
      // Reset acknowledged when toggling off
      if (!state.rain.active) {
        state.rain.acknowledged = false
      }
    },
    setRainSeverity: (state, action: PayloadAction<Severity>) => {
      state.rain.severity = action.payload
    },
    toggleWind: (state) => {
      state.wind.active = !state.wind.active
      // Reset acknowledged when toggling off
      if (!state.wind.active) {
        state.wind.acknowledged = false
      }
    },
    setWindSeverity: (state, action: PayloadAction<Severity>) => {
      state.wind.severity = action.payload
    },
    toggleRoadClosure: (state) => {
      state.roadClosure.active = !state.roadClosure.active
      // Reset acknowledged when toggling off
      if (!state.roadClosure.active) {
        state.roadClosure.acknowledged = false
      }
    },
    setRoadClosureSeverity: (state, action: PayloadAction<Severity>) => {
      state.roadClosure.severity = action.payload
    },
    toggleNetwork: (state) => {
      state.network.active = !state.network.active
      // Reset acknowledged when toggling off
      if (!state.network.active) {
        state.network.acknowledged = false
      }
    },
    setNetworkLevel: (state, action: PayloadAction<NetworkLevel>) => {
      state.network.level = action.payload
    },
    acknowledgeRain: (state) => {
      state.rain.acknowledged = true
    },
    acknowledgeWind: (state) => {
      state.wind.acknowledged = true
    },
    acknowledgeRoadClosure: (state) => {
      state.roadClosure.acknowledged = true
    },
    acknowledgeNetwork: (state) => {
      state.network.acknowledged = true
    },
    recoverAll: (state) => {
      state.rain.active = false
      state.wind.active = false
      state.roadClosure.active = false
      state.network.active = false
      // Reset acknowledged when recovering
      state.rain.acknowledged = false
      state.wind.acknowledged = false
      state.roadClosure.acknowledged = false
      state.network.acknowledged = false
    },
  },
})

export const {
  toggleRain,
  setRainSeverity,
  acknowledgeRain,
  toggleWind,
  setWindSeverity,
  acknowledgeWind,
  toggleRoadClosure,
  setRoadClosureSeverity,
  acknowledgeRoadClosure,
  toggleNetwork,
  setNetworkLevel,
  acknowledgeNetwork,
  recoverAll,
} = incidentsSlice.actions

export default incidentsSlice.reducer
