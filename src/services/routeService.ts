// Service to fetch actual driving routes using OSRM (Open Source Routing Machine)
// OSRM is a free routing service that provides real driving paths

export interface RouteCoordinates {
  lat: number
  lng: number
}

const OSRM_API = 'https://router.project-osrm.org/route/v1/driving'

/**
 * Get actual driving route between two points
 * Returns array of coordinates following real roads
 */
export async function getActualRoute(
  start: [number, number], // [lat, lng]
  end: [number, number]    // [lat, lng]
): Promise<[number, number][]> {
  try {
    // OSRM API format: longitude,latitude (note: lng comes first!)
    const url = `${OSRM_API}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    
    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        // Convert GeoJSON coordinates [lng, lat] to [lat, lng] for Leaflet
        const coordinates = data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
        )
        return coordinates
      }
      
      // Fallback: return straight line if API response is invalid
      console.warn('OSRM API returned invalid response, using fallback route')
      return [start, end]
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.warn('Route request timed out, using fallback route')
      } else {
        console.warn('Failed to fetch route from OSRM:', fetchError.message)
      }
      // Fallback: return straight line
      return [start, end]
    }
  } catch (error) {
    console.error('Unexpected error fetching route:', error)
    // Fallback: return straight line
    return [start, end]
  }
}

/**
 * Get multiple routes in parallel
 */
export async function getMultipleRoutes(
  routePairs: Array<{ start: [number, number]; end: [number, number] }>
): Promise<Array<[number, number][]>> {
  const promises = routePairs.map((pair) => getActualRoute(pair.start, pair.end))
  return Promise.all(promises)
}
