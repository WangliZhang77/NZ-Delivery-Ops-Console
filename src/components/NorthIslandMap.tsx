import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { getActualRoute } from '../services/routeService'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// City coordinates (New Zealand North Island)
const cities = {
  Auckland: { lat: -36.8485, lng: 174.7633, name: 'Auckland' },
  Hamilton: { lat: -37.7870, lng: 175.2793, name: 'Hamilton' },
  Tauranga: { lat: -37.6878, lng: 176.1651, name: 'Tauranga' },
  Rotorua: { lat: -38.1368, lng: 176.2497, name: 'Rotorua' },
}

// Routes configuration (will be populated with actual route data)
const routeConfigs = [
  { 
    key: 'Auckland-Hamilton',
    from: cities.Auckland, 
    to: cities.Hamilton, 
    color: '#3b82f6',
    label: 'Auckland → Hamilton',
  },
  { 
    key: 'Hamilton-Auckland',
    from: cities.Hamilton, 
    to: cities.Auckland, 
    color: '#3b82f6',
    label: 'Hamilton → Auckland',
  },
  { 
    key: 'Auckland-Tauranga',
    from: cities.Auckland, 
    to: cities.Tauranga, 
    color: '#10b981',
    label: 'Auckland → Tauranga',
  },
  { 
    key: 'Tauranga-Auckland',
    from: cities.Tauranga, 
    to: cities.Auckland, 
    color: '#10b981',
    label: 'Tauranga → Auckland',
  },
  { 
    key: 'Hamilton-Tauranga',
    from: cities.Hamilton, 
    to: cities.Tauranga, 
    color: '#f59e0b',
    label: 'Hamilton → Tauranga',
  },
  { 
    key: 'Tauranga-Hamilton',
    from: cities.Tauranga, 
    to: cities.Hamilton, 
    color: '#f59e0b',
    label: 'Tauranga → Hamilton',
  },
  { 
    key: 'Hamilton-Rotorua',
    from: cities.Hamilton, 
    to: cities.Rotorua, 
    color: '#8b5cf6',
    label: 'Hamilton → Rotorua',
  },
  { 
    key: 'Rotorua-Hamilton',
    from: cities.Rotorua, 
    to: cities.Hamilton, 
    color: '#8b5cf6',
    label: 'Rotorua → Hamilton',
  },
  { 
    key: 'Tauranga-Rotorua',
    from: cities.Tauranga, 
    to: cities.Rotorua, 
    color: '#ef4444',
    label: 'Tauranga → Rotorua',
  },
  { 
    key: 'Rotorua-Tauranga',
    from: cities.Rotorua, 
    to: cities.Tauranga, 
    color: '#ef4444',
    label: 'Rotorua → Tauranga',
  },
]

// Component to fit map bounds to show only the four cities
function FitBounds() {
  const map = useMap()
  
  useEffect(() => {
    const bounds = L.latLngBounds([
      [cities.Auckland.lat, cities.Auckland.lng],
      [cities.Hamilton.lat, cities.Hamilton.lng],
      [cities.Tauranga.lat, cities.Tauranga.lng],
      [cities.Rotorua.lat, cities.Rotorua.lng],
    ])
    // Fit bounds with larger padding to ensure all cities are clearly visible
    // Increase padding to make sure all cities are within the view
    map.fitBounds(bounds, { padding: [80, 80] })
    // Lock the view to prevent user interaction
    // Increase pad value to allow more space around cities
    map.setMaxBounds(bounds.pad(0.25))
  }, [map])
  
  return null
}

export default function NorthIslandMap() {
  const orders = useSelector((state: RootState) => state.orders.orders)
  const incidents = useSelector((state: RootState) => state.incidents)
  const [routeCoordinates, setRouteCoordinates] = useState<Record<string, [number, number][]>>({})
  const [loading, setLoading] = useState(true)
  // Track which routes are visible (default: all routes visible)
  const [visibleRoutes, setVisibleRoutes] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    routeConfigs.forEach(route => {
      initial[route.key] = true // Default: all routes visible
    })
    return initial
  })

  // Calculate center point of all cities
  const centerLat = (cities.Auckland.lat + cities.Hamilton.lat + cities.Tauranga.lat + cities.Rotorua.lat) / 4
  const centerLng = (cities.Auckland.lng + cities.Hamilton.lng + cities.Tauranga.lng + cities.Rotorua.lng) / 4

  // Fetch actual routes from OSRM API on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true)
      const routes: Record<string, [number, number][]> = {}

      try {
        // Fetch all routes in parallel with timeout
        const routePromises = routeConfigs.map(async (config) => {
          try {
            const start: [number, number] = [config.from.lat, config.from.lng]
            const end: [number, number] = [config.to.lat, config.to.lng]
            const coordinates = await getActualRoute(start, end)
            routes[config.key] = coordinates
          } catch (error) {
            console.error(`Failed to fetch route ${config.key}:`, error)
            // Use fallback straight line
            routes[config.key] = [[config.from.lat, config.from.lng], [config.to.lat, config.to.lng]]
          }
        })

        // Wait for all routes with overall timeout
        await Promise.race([
          Promise.all(routePromises),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Overall timeout')), 30000)
          )
        ])
      } catch (error) {
        console.error('Error fetching routes:', error)
        // Fill with fallback routes if all fail
        routeConfigs.forEach(config => {
          if (!routes[config.key]) {
            routes[config.key] = [[config.from.lat, config.from.lng], [config.to.lat, config.to.lng]]
          }
        })
      } finally {
        setRouteCoordinates(routes)
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  // Count active orders per route (memoized)
  const routeOrderCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    routeConfigs.forEach((route) => {
      const key = `${route.from.name}-${route.to.name}`
      counts[key] = orders.filter(
        (order) =>
          (order.fromCity === route.from.name && order.toCity === route.to.name) ||
          (order.fromCity === route.to.name && order.toCity === route.from.name)
      ).length
    })
    return counts
  }, [orders])

  // Get route color based on incidents (memoized)
  const routeColors = useMemo(() => {
    const colors: Record<string, string> = {}
    routeConfigs.forEach((route) => {
      if (incidents.roadClosure.active && incidents.roadClosure.severity === 'High') {
        colors[route.key] = '#dc2626' // Red for high road closure
      } else if (incidents.rain.active || incidents.wind.active) {
        colors[route.key] = '#f59e0b' // Orange for weather issues
      } else {
        colors[route.key] = route.color
      }
    })
    return colors
  }, [incidents.roadClosure.active, incidents.roadClosure.severity, incidents.rain.active, incidents.wind.active])

  const toggleRoute = (routeKey: string) => {
    setVisibleRoutes(prev => ({
      ...prev,
      [routeKey]: !prev[routeKey]
    }))
  }

  // Check if any route is selected
  const hasSelectedRoutes = Object.values(visibleRoutes).some(v => v)
  // If no routes selected, show all routes (default behavior)
  const shouldShowRoute = (routeKey: string) => {
    if (!hasSelectedRoutes) return true // Default: show all
    return visibleRoutes[routeKey]
  }

  return (
    <div className="flex gap-2" style={{ width: '400px' }}>
      {/* Left sidebar with route options */}
      <div className="bg-white rounded shadow-sm border border-gray-200 p-2 w-40 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gray-900 mb-2">Routes</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {routeConfigs.map((route) => (
            <label
              key={route.key}
              className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={visibleRoutes[route.key] || false}
                onChange={() => toggleRoute(route.key)}
                className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded flex-shrink-0"
                  style={{ backgroundColor: route.color }}
                />
                <span className="text-xs text-gray-700 truncate">{route.label}</span>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 flex gap-1">
          <button
            onClick={() => {
              const allVisible: Record<string, boolean> = {}
              routeConfigs.forEach(route => {
                allVisible[route.key] = true
              })
              setVisibleRoutes(allVisible)
            }}
            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Show All
          </button>
          <button
            onClick={() => {
              const allHidden: Record<string, boolean> = {}
              routeConfigs.forEach(route => {
                allHidden[route.key] = false
              })
              setVisibleRoutes(allHidden)
            }}
            className="flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Square map container */}
      <div className="flex-1 min-w-0" style={{ width: '240px' }}>
        <div className="w-full rounded overflow-hidden border border-gray-200" style={{ height: '240px' }}>
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
            minZoom={7}
            maxZoom={9}
          >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds />

        {/* Draw actual road routes from OSRM API */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-[1000]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-gray-600 text-sm font-medium">Loading routes...</div>
            </div>
          </div>
        ) : (
          routeConfigs.map((route) => {
            // Only show route if it's selected (or if no routes are selected, show all)
            if (!shouldShowRoute(route.key)) return null

            const coordinates = routeCoordinates[route.key]
            if (!coordinates || coordinates.length === 0) return null

            const orderCount = routeOrderCounts[`${route.from.name}-${route.to.name}`] || 0
            const routeColor = routeColors[route.key] || route.color
            const baseWeight = 4 // Fixed weight for better visibility when overlapping
            
            // Draw route with border and main color to make overlapping routes visible
            // When routes overlap, each route will have its own color visible
            return (
              <>
                {/* Outer border (white) for visibility when routes overlap */}
                <Polyline
                  key={`${route.key}-border`}
                  positions={coordinates}
                  pathOptions={{
                    color: '#ffffff',
                    weight: baseWeight + 2,
                    opacity: 0.95,
                    smoothFactor: 1,
                    lineJoin: 'round',
                    lineCap: 'round',
                  }}
                />
                {/* Main route color with good opacity for color mixing when overlapping */}
                <Polyline
                  key={`${route.key}-main`}
                  positions={coordinates}
                  pathOptions={{
                    color: routeColor,
                    weight: baseWeight,
                    opacity: 0.8, // Good opacity for color mixing
                    smoothFactor: 1,
                    lineJoin: 'round',
                    lineCap: 'round',
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{route.from.name} → {route.to.name}</strong>
                      <br />
                      Active Orders: {orderCount}
                    </div>
                  </Popup>
                </Polyline>
              </>
            )
          })
        )}

        {/* City markers */}
        {Object.values(cities).map((city) => {
          const cityOrders = orders.filter(
            (order) => order.fromCity === city.name || order.toCity === city.name
          ).length

          return (
            <Marker key={city.name} position={[city.lat, city.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>{city.name}</strong>
                  <br />
                  Total Orders: {cityOrders}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
        </div>
      </div>
    </div>
  )
}
