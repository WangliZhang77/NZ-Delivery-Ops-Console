export type Severity = 'Low' | 'Medium' | 'High'
export type NetworkLevel = 'Degraded' | 'Down'
export type SystemMode = 'Normal' | 'Disruption' | 'Offline'

export interface IncidentState {
  rain: {
    active: boolean
    severity: Severity
  }
  wind: {
    active: boolean
    severity: Severity
  }
  roadClosure: {
    active: boolean
    severity: Severity
  }
  network: {
    active: boolean
    level: NetworkLevel
  }
}
