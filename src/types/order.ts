export type City = 'Hamilton' | 'Auckland' | 'Tauranga' | 'Rotorua'
export type OrderStatus = 'Created' | 'Assigned' | 'PickedUp' | 'EnRoute' | 'Delivered' | 'Cancelled'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface Order {
  id: string
  fromCity: City
  toCity: City
  status: OrderStatus
  driverName: string | null
  baseEtaMinutes: number
  adjustedEtaMinutes: number
  riskLevel: RiskLevel
  lastUpdatedAt: string // ISO string
}
