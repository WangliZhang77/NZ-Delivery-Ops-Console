import { describe, it, expect } from 'vitest'
import { applyIncidentsToOrders } from '../incidentEffects'
import type { Order } from '../../types/order'
import type { IncidentState } from '../../types/incident'

describe('incidentEffects', () => {
  const mockOrder: Order = {
    id: 'ORD-10001',
    fromCity: 'Hamilton',
    toCity: 'Auckland',
    status: 'EnRoute',
    driverName: 'John Smith',
    baseEtaMinutes: 60,
    adjustedEtaMinutes: 60,
    riskLevel: 'Low',
    lastUpdatedAt: new Date().toISOString(),
  }

  it('should increase ETA when Heavy Rain is active', () => {
    const incidents: IncidentState = {
      rain: { active: true, severity: 'Medium' },
      wind: { active: false, severity: 'Low' },
      roadClosure: { active: false, severity: 'Low' },
      network: { active: false, level: 'Degraded' },
    }

    const result = applyIncidentsToOrders([mockOrder], incidents)
    expect(result[0].adjustedEtaMinutes).toBeGreaterThan(mockOrder.baseEtaMinutes)
    expect(result[0].adjustedEtaMinutes).toBe(75) // 60 * 1.25
  })

  it('should add minutes when Strong Wind is active', () => {
    const incidents: IncidentState = {
      rain: { active: false, severity: 'Low' },
      wind: { active: true, severity: 'High' },
      roadClosure: { active: false, severity: 'Low' },
      network: { active: false, level: 'Degraded' },
    }

    const result = applyIncidentsToOrders([mockOrder], incidents)
    expect(result[0].adjustedEtaMinutes).toBe(80) // 60 + 20
  })

  it('should increase risk level when Road Closure is Medium or High', () => {
    const incidents: IncidentState = {
      rain: { active: false, severity: 'Low' },
      wind: { active: false, severity: 'Low' },
      roadClosure: { active: true, severity: 'High' },
      network: { active: false, level: 'Degraded' },
    }

    const result = applyIncidentsToOrders([mockOrder], incidents)
    expect(result[0].riskLevel).toBe('Medium') // Low -> Medium
    expect(result[0].adjustedEtaMinutes).toBeGreaterThan(mockOrder.baseEtaMinutes)
  })
})
