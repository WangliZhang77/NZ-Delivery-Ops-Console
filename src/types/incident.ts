export type Severity = 'Low' | 'Medium' | 'High'
export type NetworkLevel = 'Degraded' | 'Down'
export type SystemMode = 'Normal' | 'Disruption' | 'Offline'

export interface IncidentState {
  rain: {
    active: boolean
    severity: Severity
    acknowledged: boolean
  }
  wind: {
    active: boolean
    severity: Severity
    acknowledged: boolean
  }
  roadClosure: {
    active: boolean
    severity: Severity
    acknowledged: boolean
  }
  network: {
    active: boolean
    level: NetworkLevel
    acknowledged: boolean
  }
}
