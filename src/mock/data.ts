import type { Order, City, OrderStatus, RiskLevel } from '../types/order'

const cities: City[] = ['Hamilton', 'Auckland', 'Tauranga', 'Rotorua']
const statuses: OrderStatus[] = ['Created', 'Assigned', 'PickedUp', 'EnRoute', 'Delivered', 'Cancelled']
const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High']
const drivers = [
  'John Smith', 'Sarah Johnson', 'Mike Brown', 'Emma Wilson', 'David Lee',
  'Lisa Anderson', 'Tom Taylor', 'Amy Martinez', 'Chris Davis', 'Rachel White'
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(daysAgo: number = 7): string {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return date.toISOString()
}

function generateOrderId(index: number): string {
  return `ORD-${10000 + index}`
}

export function generateMockOrders(count: number = 35): Order[] {
  const orders: Order[] = []
  
  for (let i = 0; i < count; i++) {
    const fromCity = getRandomElement(cities)
    let toCity = getRandomElement(cities)
    // Ensure toCity is different from fromCity
    while (toCity === fromCity) {
      toCity = getRandomElement(cities)
    }
    
    const status = getRandomElement(statuses)
    const riskLevel = getRandomElement(riskLevels)
    
    // Base ETA: 30-180 minutes
    const baseEtaMinutes = Math.floor(Math.random() * 150) + 30
    
    // Adjusted ETA: base + random adjustment (0-60 minutes)
    const adjustment = Math.floor(Math.random() * 60)
    const adjustedEtaMinutes = baseEtaMinutes + adjustment
    
    // Driver is null for Created status, otherwise random driver
    const driverName = status === 'Created' ? null : getRandomElement(drivers)
    
    orders.push({
      id: generateOrderId(i),
      fromCity,
      toCity,
      status,
      driverName,
      baseEtaMinutes,
      adjustedEtaMinutes,
      riskLevel,
      lastUpdatedAt: getRandomDate(7)
    })
  }
  
  return orders
}

// Export a default set of orders
export const mockOrders: Order[] = generateMockOrders(35)

// Find order by id
export function findOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id)
}
