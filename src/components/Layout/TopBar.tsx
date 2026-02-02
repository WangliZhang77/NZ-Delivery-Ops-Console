import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import IncidentPanel from '../IncidentPanel/IncidentPanel'
import OfflineBanner from '../OfflineBanner'

export default function TopBar() {
  const [incidentPanelOpen, setIncidentPanelOpen] = useState(false)
  const incidents = useSelector((state: RootState) => state.incidents)
  const isOffline =
    incidents.network.active && incidents.network.level === 'Down'

  return (
    <>
      {isOffline && <OfflineBanner />}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">
          NZ Delivery Ops Console
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIncidentPanelOpen(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
Incident Panel
        </button>
      </div>

      {incidentPanelOpen && (
        <IncidentPanel onClose={() => setIncidentPanelOpen(false)} />
      )}
      </header>
    </>
  )
}
