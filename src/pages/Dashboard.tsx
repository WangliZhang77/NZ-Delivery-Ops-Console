import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import type { RootState } from '../store/store'
import { getSystemMode } from '../utils/systemMode'
import { applyIncidentsToOrders, calculateDelayStats } from '../utils/incidentEffects'
import { formatEta } from '../utils/format'
import NorthIslandMap from '../components/NorthIslandMap'
import SeverityPieChart from '../components/Charts/SeverityPieChart'
import TopRiskRoutes from '../components/Charts/TopRiskRoutes'
import StatusSeverityChart from '../components/Charts/StatusSeverityChart'
import IncidentStatusChart from '../components/Charts/IncidentStatusChart'
import AgeStatusChart from '../components/Charts/AgeStatusChart'
import QueueHealth from '../components/Charts/QueueHealth'
import DriverChart from '../components/Charts/DriverChart'
import ChartCard from '../components/Charts/ChartCard'
import OrdersTable from '../components/OrdersTable'
import type { RiskLevel, OrderStatus } from '../types/order'

export default function Dashboard() {
  const incidents = useSelector((state: RootState) => state.incidents)
  const orders = useSelector((state: RootState) => state.orders.orders)
  const queue = useSelector((state: RootState) => state.queue)
  const queuedActionsCount = useSelector(
    (state: RootState) => state.queue.actions.filter(a => a.status === 'Queued').length
  )
  const systemMode = getSystemMode(incidents)

  // Apply incident effects and calculate stats
  const ordersWithIncidents = applyIncidentsToOrders(orders, incidents)
  const delayStats = calculateDelayStats(ordersWithIncidents)
  
  // KPI 1: Open - Active Deliveries (orders not delivered or cancelled)
  const openKPI = ordersWithIncidents.filter(
    (order) => order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length
  
  // KPI 2: Critical - High Risk Deliveries
  const criticalKPI = ordersWithIncidents.filter(
    (order) => order.riskLevel === 'High' && order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length
  
  // KPI 3: Escalated - Orders with ETA delay > 30 minutes
  const escalatedKPI = ordersWithIncidents.filter(
    (order) => {
      const delay = order.adjustedEtaMinutes - order.baseEtaMinutes
      return delay > 30 && order.status !== 'Delivered' && order.status !== 'Cancelled'
    }
  ).length
  
  // KPI 4: Unassigned - Orders without driver
  const unassignedKPI = ordersWithIncidents.filter(
    (order) => !order.driverName && order.status !== 'Delivered' && order.status !== 'Cancelled'
  ).length
  
  // KPI 5: Unacknowledged - Active incidents that are not acknowledged
  const unacknowledgedKPI = [
    incidents.rain.active && !incidents.rain.acknowledged,
    incidents.wind.active && !incidents.wind.acknowledged,
    incidents.roadClosure.active && !incidents.roadClosure.acknowledged,
    incidents.network.active && !incidents.network.acknowledged,
  ].filter(Boolean).length

  // Chart 1: Severity Distribution (Pie Chart)
  const severityData = useMemo(() => {
    const counts: Record<RiskLevel, number> = { Low: 0, Medium: 0, High: 0 }
    ordersWithIncidents.forEach((order) => {
      if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
        counts[order.riskLevel]++
      }
    })
    return [
      { riskLevel: 'Low' as RiskLevel, count: counts.Low },
      { riskLevel: 'Medium' as RiskLevel, count: counts.Medium },
      { riskLevel: 'High' as RiskLevel, count: counts.High },
    ]
  }, [ordersWithIncidents])

  // Chart 2: Top Risk Routes (Table format)
  const topRiskRoutesData = useMemo(() => {
    const routeMap = new Map<string, {
      from: string
      to: string
      delays: number[]
      riskLevels: RiskLevel[]
    }>()
    
    ordersWithIncidents.forEach((order) => {
      if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
        const key = `${order.fromCity}-${order.toCity}`
        if (!routeMap.has(key)) {
          routeMap.set(key, {
            from: order.fromCity,
            to: order.toCity,
            delays: [],
            riskLevels: [],
          })
        }
        const route = routeMap.get(key)!
        const delay = order.adjustedEtaMinutes - order.baseEtaMinutes
        route.delays.push(delay)
        route.riskLevels.push(order.riskLevel)
      }
    })

    // Convert to array and calculate average delay and highest risk
    const routes = Array.from(routeMap.entries())
      .map(([key, route]) => {
        const avgDelay = route.delays.length > 0
          ? Math.round(route.delays.reduce((sum, d) => sum + d, 0) / route.delays.length)
          : 0
        
        // Get highest risk level (High > Medium > Low)
        const riskPriority = { High: 3, Medium: 2, Low: 1 }
        const highestRisk = route.riskLevels.reduce((max, risk) => {
          return riskPriority[risk] > riskPriority[max] ? risk : max
        }, 'Low' as RiskLevel)

        return {
          route: `${route.from.substring(0, 3).toUpperCase()} → ${route.to.substring(0, 3).toUpperCase()}`,
          riskLevel: highestRisk,
          avgDelayMinutes: avgDelay,
        }
      })
      // Sort by risk level (High first), then by delay
      .sort((a, b) => {
        const riskPriority = { High: 3, Medium: 2, Low: 1 }
        if (riskPriority[a.riskLevel] !== riskPriority[b.riskLevel]) {
          return riskPriority[b.riskLevel] - riskPriority[a.riskLevel]
        }
        return b.avgDelayMinutes - a.avgDelayMinutes
      })

    return routes
  }, [ordersWithIncidents])

  // Chart 3: Status vs Severity (Horizontal Stacked Bar)
  const statusSeverityData = useMemo(() => {
    const statusMap = new Map<OrderStatus, Record<RiskLevel, number>>()
    const statusOrder: OrderStatus[] = ['Created', 'Assigned', 'PickedUp', 'EnRoute', 'Delivered', 'Cancelled']
    
    ordersWithIncidents.forEach((order) => {
      if (!statusMap.has(order.status)) {
        statusMap.set(order.status, { Low: 0, Medium: 0, High: 0 })
      }
      const counts = statusMap.get(order.status)!
      counts[order.riskLevel]++
    })

    return statusOrder.map((status) => {
      const counts = statusMap.get(status) || { Low: 0, Medium: 0, High: 0 }
      return {
        status,
        Low: counts.Low,
        Medium: counts.Medium,
        High: counts.High,
      }
    })
  }, [ordersWithIncidents])

  // Chart 4: Incident vs Order Status (Bar Chart)
  const incidentStatusData = useMemo(() => {
    // Use shorter status names for x-axis
    const statusOrder: OrderStatus[] = ['Assigned', 'EnRoute', 'Cancelled', 'Delivered']
    const currentMode = systemMode

    const countByStatus = (orders: typeof ordersWithIncidents, status: OrderStatus) => {
      return orders.filter((o) => o.status === status).length
    }

    // Show current mode data, and set others to 0 or show all orders grouped by current mode
    return statusOrder.map((status) => {
      const count = countByStatus(ordersWithIncidents, status)
      return {
        status,
        Normal: currentMode === 'Normal' ? count : 0,
        Disruption: currentMode === 'Disruption' ? count : 0,
        Offline: currentMode === 'Offline' ? count : 0,
      }
    })
  }, [ordersWithIncidents, systemMode])

  // Chart 5: Age vs Status (Stacked Bar Chart) - Business-friendly status grouping
  const ageStatusData = useMemo(() => {
    const now = new Date()
    const ageGroups = ['0-1h', '1-4h', '4h+']
    
    const getAgeGroup = (lastUpdated: string) => {
      const updated = new Date(lastUpdated)
      const hoursAgo = (now.getTime() - updated.getTime()) / (1000 * 60 * 60)
      
      if (hoursAgo < 1) return '0-1h'
      if (hoursAgo < 4) return '1-4h'
      return '4h+'
    }

    // Business-friendly status groups
    const ageMap = new Map<string, { 'Not Started': number; 'In Transit': number; 'Completed': number; 'Exception': number }>()
    ageGroups.forEach(age => {
      ageMap.set(age, {
        'Not Started': 0,
        'In Transit': 0,
        'Completed': 0,
        'Exception': 0,
      })
    })

    ordersWithIncidents.forEach((order) => {
      const ageGroup = getAgeGroup(order.lastUpdatedAt)
      const counts = ageMap.get(ageGroup)!
      
      // Map status to business-friendly groups
      if (order.status === 'Created') {
        counts['Not Started']++
      } else if (order.status === 'Assigned' || order.status === 'PickedUp' || order.status === 'EnRoute') {
        counts['In Transit']++
      } else if (order.status === 'Delivered') {
        counts['Completed']++
      } else if (order.status === 'Cancelled') {
        counts['Exception']++
      }
    })

    return ageGroups.map((ageGroup) => ({
      ageGroup,
      ...ageMap.get(ageGroup)!,
    }))
  }, [ordersWithIncidents])

  // Chart 6: Queue Health (Card with metrics)
  const queueHealthData = useMemo(() => {
    let queued = 0
    let synced = 0
    let failed = 0

    queue.actions.forEach((action) => {
      if (action.status === 'Queued') queued++
      else if (action.status === 'Synced') synced++
      else if (action.status === 'Failed') failed++
    })

    return { queued, synced, failed }
  }, [queue.actions])

  // Chart 7: Driver Distribution (Bar Chart) - Top 5 + No Driver + Others
  const driverData = useMemo(() => {
    const driverMap = new Map<string, number>()
    let noDriverCount = 0

    ordersWithIncidents.forEach((order) => {
      if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
        if (order.driverName) {
          driverMap.set(order.driverName, (driverMap.get(order.driverName) || 0) + 1)
        } else {
          noDriverCount++
        }
      }
    })

    // Convert to array and sort
    const drivers = Array.from(driverMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Top 5 + Others
    const top5 = drivers.slice(0, 5).map(d => ({
      name: d.name.split(' ').map(n => n[0]).join('. ') + '.', // Abbreviate: "John Smith" -> "J. S."
      fullName: d.name,
      count: d.count,
    }))
    
    const othersTotal = drivers.slice(5).reduce((sum, d) => sum + d.count, 0)

    const result = [...top5]
    
    if (noDriverCount > 0) {
      result.push({ name: 'No Driver', fullName: 'No Driver', count: noDriverCount })
    }
    
    if (othersTotal > 0) {
      result.push({ name: 'Others', fullName: `${drivers.slice(5).length} other drivers`, count: othersTotal })
    }

    return result
  }, [ordersWithIncidents])

  const getModeColor = () => {
    switch (systemMode) {
      case 'Normal':
        return 'bg-green-100 text-green-800'
      case 'Disruption':
        return 'bg-yellow-100 text-yellow-800'
      case 'Offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Top KPI Tiles - Oracle Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Open KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Open
          </h3>
          <p className="text-3xl font-bold text-gray-900">{openKPI}</p>
          <p className="text-xs text-gray-400 mt-1">Active Deliveries</p>
        </div>

        {/* Critical KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Critical
          </h3>
          <p className="text-3xl font-bold text-red-600">{criticalKPI}</p>
          <p className="text-xs text-gray-400 mt-1">High Risk Deliveries</p>
        </div>

        {/* Escalated KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Escalated
          </h3>
          <p className="text-3xl font-bold text-orange-600">{escalatedKPI}</p>
          <p className="text-xs text-gray-400 mt-1">Delayed &gt;30min</p>
        </div>

        {/* Unassigned KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Unassigned
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{unassignedKPI}</p>
          <p className="text-xs text-gray-400 mt-1">No Driver Assigned</p>
        </div>

        {/* Unacknowledged KPI */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Unacknowledged
          </h3>
          <p className="text-3xl font-bold text-purple-600">{unacknowledgedKPI}</p>
          <p className="text-xs text-gray-400 mt-1">Active Incidents</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Delayed Orders
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {delayStats.delayedCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Delay</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatEta(delayStats.avgDelayMinutes)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Queued Actions
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {queuedActionsCount}
          </p>
        </div>
      </div>

      {/* Charts Section - First Row (4 charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" style={{ minHeight: '280px' }}>
        <ChartCard title="Severity Distribution">
          <SeverityPieChart data={severityData} />
        </ChartCard>
        <ChartCard title="Top Risk Routes">
          <TopRiskRoutes data={topRiskRoutesData} />
        </ChartCard>
        <ChartCard title="Status vs Severity">
          <StatusSeverityChart data={statusSeverityData} />
        </ChartCard>
        <ChartCard title="Order Status by System Mode">
          <IncidentStatusChart data={incidentStatusData} />
        </ChartCard>
      </div>

      {/* Charts Section - Second Row (3 charts + Map Preview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" style={{ minHeight: '280px' }}>
        <ChartCard title="Age vs Status">
          <AgeStatusChart data={ageStatusData} />
        </ChartCard>
        <ChartCard title="Queue Health">
          <QueueHealth 
            queued={queueHealthData.queued}
            synced={queueHealthData.synced}
            failed={queueHealthData.failed}
          />
        </ChartCard>
        <ChartCard title="Driver Distribution">
          <DriverChart data={driverData} />
        </ChartCard>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
          <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-700">Map Preview</h3>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-xs">Available below</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Incidents
          </h2>
          {systemMode === 'Normal' ? (
            <p className="text-gray-500">No recent incidents</p>
          ) : (
            <div className="space-y-2">
              {incidents.rain.active && (
                <p className="text-sm text-gray-600">
                  Heavy Rain ({incidents.rain.severity})
                </p>
              )}
              {incidents.wind.active && (
                <p className="text-sm text-gray-600">
                  Strong Wind ({incidents.wind.severity})
                </p>
              )}
              {incidents.roadClosure.active && (
                <p className="text-sm text-gray-600">
                  Road Closure ({incidents.roadClosure.severity})
                </p>
              )}
              {incidents.network.active && (
                <p className="text-sm text-gray-600">
                  Network {incidents.network.level}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Mode</h2>
          <span
            className={`inline-block px-4 py-2 rounded-lg font-medium ${getModeColor()}`}
          >
            {systemMode}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          North Island Delivery Routes
        </h2>
        <NorthIslandMap />
      </div>

      {/* Orders Table - Bottom Section */}
      <div className="mt-6">
        <OrdersTable orders={ordersWithIncidents} incidents={incidents} />
      </div>
    </div>
  )
}
