import type { Order } from '../types/order'

// Fixed mock data to ensure consistency across page refreshes
export const mockOrders: Order[] = [
  { id: 'ORD-10000', fromCity: 'Hamilton', toCity: 'Auckland', status: 'EnRoute', driverName: 'John Smith', baseEtaMinutes: 120, adjustedEtaMinutes: 135, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T10:30:00.000Z' },
  { id: 'ORD-10001', fromCity: 'Auckland', toCity: 'Tauranga', status: 'PickedUp', driverName: 'Sarah Johnson', baseEtaMinutes: 90, adjustedEtaMinutes: 95, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T09:15:00.000Z' },
  { id: 'ORD-10002', fromCity: 'Tauranga', toCity: 'Rotorua', status: 'Assigned', driverName: 'Mike Brown', baseEtaMinutes: 60, adjustedEtaMinutes: 70, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T11:00:00.000Z' },
  { id: 'ORD-10003', fromCity: 'Rotorua', toCity: 'Hamilton', status: 'Created', driverName: null, baseEtaMinutes: 75, adjustedEtaMinutes: 80, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T12:00:00.000Z' },
  { id: 'ORD-10004', fromCity: 'Auckland', toCity: 'Hamilton', status: 'Delivered', driverName: 'Emma Wilson', baseEtaMinutes: 105, adjustedEtaMinutes: 110, riskLevel: 'Low', lastUpdatedAt: '2024-01-14T16:45:00.000Z' },
  { id: 'ORD-10005', fromCity: 'Hamilton', toCity: 'Tauranga', status: 'EnRoute', driverName: 'David Lee', baseEtaMinutes: 45, adjustedEtaMinutes: 55, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T08:20:00.000Z' },
  { id: 'ORD-10006', fromCity: 'Tauranga', toCity: 'Auckland', status: 'PickedUp', driverName: 'Lisa Anderson', baseEtaMinutes: 150, adjustedEtaMinutes: 160, riskLevel: 'High', lastUpdatedAt: '2024-01-15T07:30:00.000Z' },
  { id: 'ORD-10007', fromCity: 'Rotorua', toCity: 'Tauranga', status: 'Assigned', driverName: 'Tom Taylor', baseEtaMinutes: 30, adjustedEtaMinutes: 35, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T13:15:00.000Z' },
  { id: 'ORD-10008', fromCity: 'Auckland', toCity: 'Rotorua', status: 'EnRoute', driverName: 'Amy Martinez', baseEtaMinutes: 180, adjustedEtaMinutes: 195, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T06:00:00.000Z' },
  { id: 'ORD-10009', fromCity: 'Hamilton', toCity: 'Rotorua', status: 'Created', driverName: null, baseEtaMinutes: 90, adjustedEtaMinutes: 100, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T14:00:00.000Z' },
  { id: 'ORD-10010', fromCity: 'Tauranga', toCity: 'Hamilton', status: 'Delivered', driverName: 'Chris Davis', baseEtaMinutes: 60, adjustedEtaMinutes: 65, riskLevel: 'Low', lastUpdatedAt: '2024-01-14T15:20:00.000Z' },
  { id: 'ORD-10011', fromCity: 'Rotorua', toCity: 'Auckland', status: 'PickedUp', driverName: 'Rachel White', baseEtaMinutes: 135, adjustedEtaMinutes: 145, riskLevel: 'High', lastUpdatedAt: '2024-01-15T05:45:00.000Z' },
  { id: 'ORD-10012', fromCity: 'Auckland', toCity: 'Tauranga', status: 'EnRoute', driverName: 'John Smith', baseEtaMinutes: 90, adjustedEtaMinutes: 105, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T09:30:00.000Z' },
  { id: 'ORD-10013', fromCity: 'Hamilton', toCity: 'Auckland', status: 'Assigned', driverName: 'Sarah Johnson', baseEtaMinutes: 120, adjustedEtaMinutes: 130, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T10:45:00.000Z' },
  { id: 'ORD-10014', fromCity: 'Tauranga', toCity: 'Rotorua', status: 'Created', driverName: null, baseEtaMinutes: 45, adjustedEtaMinutes: 50, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T15:00:00.000Z' },
  { id: 'ORD-10015', fromCity: 'Rotorua', toCity: 'Hamilton', status: 'EnRoute', driverName: 'Mike Brown', baseEtaMinutes: 75, adjustedEtaMinutes: 85, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T11:30:00.000Z' },
  { id: 'ORD-10016', fromCity: 'Auckland', toCity: 'Hamilton', status: 'PickedUp', driverName: 'Emma Wilson', baseEtaMinutes: 105, adjustedEtaMinutes: 115, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T08:00:00.000Z' },
  { id: 'ORD-10017', fromCity: 'Hamilton', toCity: 'Tauranga', status: 'Delivered', driverName: 'David Lee', baseEtaMinutes: 60, adjustedEtaMinutes: 70, riskLevel: 'Low', lastUpdatedAt: '2024-01-14T14:10:00.000Z' },
  { id: 'ORD-10018', fromCity: 'Tauranga', toCity: 'Auckland', status: 'Assigned', driverName: 'Lisa Anderson', baseEtaMinutes: 150, adjustedEtaMinutes: 165, riskLevel: 'High', lastUpdatedAt: '2024-01-15T12:30:00.000Z' },
  { id: 'ORD-10019', fromCity: 'Rotorua', toCity: 'Tauranga', status: 'EnRoute', driverName: 'Tom Taylor', baseEtaMinutes: 30, adjustedEtaMinutes: 40, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T13:45:00.000Z' },
  { id: 'ORD-10020', fromCity: 'Auckland', toCity: 'Rotorua', status: 'Created', driverName: null, baseEtaMinutes: 180, adjustedEtaMinutes: 190, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T16:00:00.000Z' },
  { id: 'ORD-10021', fromCity: 'Hamilton', toCity: 'Rotorua', status: 'PickedUp', driverName: 'Amy Martinez', baseEtaMinutes: 90, adjustedEtaMinutes: 100, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T07:15:00.000Z' },
  { id: 'ORD-10022', fromCity: 'Tauranga', toCity: 'Hamilton', status: 'EnRoute', driverName: 'Chris Davis', baseEtaMinutes: 60, adjustedEtaMinutes: 75, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T10:00:00.000Z' },
  { id: 'ORD-10023', fromCity: 'Rotorua', toCity: 'Auckland', status: 'Assigned', driverName: 'Rachel White', baseEtaMinutes: 135, adjustedEtaMinutes: 150, riskLevel: 'High', lastUpdatedAt: '2024-01-15T11:15:00.000Z' },
  { id: 'ORD-10024', fromCity: 'Auckland', toCity: 'Tauranga', status: 'Delivered', driverName: 'John Smith', baseEtaMinutes: 90, adjustedEtaMinutes: 95, riskLevel: 'Low', lastUpdatedAt: '2024-01-14T13:30:00.000Z' },
  { id: 'ORD-10025', fromCity: 'Hamilton', toCity: 'Auckland', status: 'EnRoute', driverName: 'Sarah Johnson', baseEtaMinutes: 120, adjustedEtaMinutes: 140, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T09:00:00.000Z' },
  { id: 'ORD-10026', fromCity: 'Tauranga', toCity: 'Rotorua', status: 'Created', driverName: null, baseEtaMinutes: 45, adjustedEtaMinutes: 55, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T17:00:00.000Z' },
  { id: 'ORD-10027', fromCity: 'Rotorua', toCity: 'Hamilton', status: 'PickedUp', driverName: 'Mike Brown', baseEtaMinutes: 75, adjustedEtaMinutes: 90, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T08:30:00.000Z' },
  { id: 'ORD-10028', fromCity: 'Auckland', toCity: 'Hamilton', status: 'EnRoute', driverName: 'Emma Wilson', baseEtaMinutes: 105, adjustedEtaMinutes: 120, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T07:00:00.000Z' },
  { id: 'ORD-10029', fromCity: 'Hamilton', toCity: 'Tauranga', status: 'Assigned', driverName: 'David Lee', baseEtaMinutes: 60, adjustedEtaMinutes: 65, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T14:30:00.000Z' },
  { id: 'ORD-10030', fromCity: 'Tauranga', toCity: 'Auckland', status: 'Cancelled', driverName: 'Lisa Anderson', baseEtaMinutes: 150, adjustedEtaMinutes: 150, riskLevel: 'High', lastUpdatedAt: '2024-01-13T10:00:00.000Z' },
  { id: 'ORD-10031', fromCity: 'Rotorua', toCity: 'Tauranga', status: 'EnRoute', driverName: 'Tom Taylor', baseEtaMinutes: 30, adjustedEtaMinutes: 45, riskLevel: 'Low', lastUpdatedAt: '2024-01-15T12:00:00.000Z' },
  { id: 'ORD-10032', fromCity: 'Auckland', toCity: 'Rotorua', status: 'PickedUp', driverName: 'Amy Martinez', baseEtaMinutes: 180, adjustedEtaMinutes: 200, riskLevel: 'High', lastUpdatedAt: '2024-01-15T06:30:00.000Z' },
  { id: 'ORD-10033', fromCity: 'Hamilton', toCity: 'Rotorua', status: 'Delivered', driverName: 'Chris Davis', baseEtaMinutes: 90, adjustedEtaMinutes: 100, riskLevel: 'Low', lastUpdatedAt: '2024-01-14T17:00:00.000Z' },
  { id: 'ORD-10034', fromCity: 'Tauranga', toCity: 'Hamilton', status: 'EnRoute', driverName: 'Rachel White', baseEtaMinutes: 60, adjustedEtaMinutes: 80, riskLevel: 'Medium', lastUpdatedAt: '2024-01-15T09:45:00.000Z' },
]

// Find order by id
export function findOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id)
}
