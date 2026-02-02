import type { IncidentState, SystemMode } from '../types/incident'

export function getSystemMode(incidents: IncidentState): SystemMode {
  // If network is down, system is offline
  if (incidents.network.active && incidents.network.level === 'Down') {
    return 'Offline'
  }
  
  // If any incident is active (rain, wind, roadClosure, or network degraded), system is in disruption
  if (
    incidents.rain.active ||
    incidents.wind.active ||
    incidents.roadClosure.active ||
    (incidents.network.active && incidents.network.level === 'Degraded')
  ) {
    return 'Disruption'
  }
  
  // Otherwise, system is normal
  return 'Normal'
}
