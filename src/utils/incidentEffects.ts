import type { Order, RiskLevel } from '../types/order'
import type { IncidentState } from '../types/incident'

/**
 * Apply incident effects to orders
 * Returns new orders with adjusted ETA and risk levels
 */
export function applyIncidentsToOrders(
  orders: Order[],
  incidents: IncidentState
): Order[] {
  return orders.map((order) => {
    let adjustedEta = order.baseEtaMinutes
    let riskLevel = order.riskLevel

    // Heavy Rain: ETA multiplier based on severity
    if (incidents.rain.active) {
      const multipliers = {
        Low: 1.10,
        Medium: 1.25,
        High: 1.45,
      }
      adjustedEta = Math.round(adjustedEta * multipliers[incidents.rain.severity])
    }

    // Strong Wind: Add minutes based on severity
    if (incidents.wind.active) {
      const windDelays = {
        Low: 5,
        Medium: 12,
        High: 20,
      }
      adjustedEta += windDelays[incidents.wind.severity]
    }

    // Road Closure: Increase risk and ETA for Medium/High severity
    if (incidents.roadClosure.active) {
      if (incidents.roadClosure.severity === 'Medium' || incidents.roadClosure.severity === 'High') {
        // Increase risk level
        if (riskLevel === 'Low') {
          riskLevel = 'Medium'
        } else if (riskLevel === 'Medium') {
          riskLevel = 'High'
        } else {
          riskLevel = 'High'
        }

        // Increase ETA more significantly
        const closureMultipliers = {
          Medium: 1.30,
          High: 1.60,
        }
        adjustedEta = Math.round(adjustedEta * closureMultipliers[incidents.roadClosure.severity])
      }
    }

    return {
      ...order,
      adjustedEtaMinutes: adjustedEta,
      riskLevel,
    }
  })
}

/**
 * Calculate delay statistics from orders
 */
export function calculateDelayStats(orders: Order[]) {
  const delayedOrders = orders.filter(
    (order) => order.adjustedEtaMinutes > order.baseEtaMinutes
  )

  const totalDelay = orders.reduce(
    (sum, order) => sum + (order.adjustedEtaMinutes - order.baseEtaMinutes),
    0
  )

  const avgDelay = orders.length > 0 ? Math.round(totalDelay / orders.length) : 0

  return {
    delayedCount: delayedOrders.length,
    avgDelayMinutes: avgDelay,
    totalDelay,
  }
}
