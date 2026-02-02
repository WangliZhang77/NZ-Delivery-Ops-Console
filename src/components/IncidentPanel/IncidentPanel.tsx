import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import {
  toggleRain,
  setRainSeverity,
  toggleWind,
  setWindSeverity,
  toggleRoadClosure,
  setRoadClosureSeverity,
  toggleNetwork,
  setNetworkLevel,
  recoverAll,
} from '../../store/incidentsSlice'
import type { Severity, NetworkLevel } from '../../types/incident'

interface IncidentPanelProps {
  onClose: () => void
}

export default function IncidentPanel({ onClose }: IncidentPanelProps) {
  const dispatch = useDispatch()
  const incidents = useSelector((state: RootState) => state.incidents)

  const handleSeverityChange = (
    type: 'rain' | 'wind' | 'roadClosure',
    severity: Severity
  ) => {
    switch (type) {
      case 'rain':
        dispatch(setRainSeverity(severity))
        break
      case 'wind':
        dispatch(setWindSeverity(severity))
        break
      case 'roadClosure':
        dispatch(setRoadClosureSeverity(severity))
        break
    }
  }

  const handleNetworkLevelChange = (level: NetworkLevel) => {
    dispatch(setNetworkLevel(level))
  }

  const handleRecover = () => {
    dispatch(recoverAll())
    // TODO: Add recovery logic here
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Incident Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Heavy Rain */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">Heavy Rain</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incidents.rain.active}
                    onChange={() => dispatch(toggleRain())}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {incidents.rain.active && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={incidents.rain.severity}
                  onChange={(e) =>
                    handleSeverityChange('rain', e.target.value as Severity)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            )}
          </div>

          {/* Strong Wind */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">Strong Wind</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incidents.wind.active}
                    onChange={() => dispatch(toggleWind())}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {incidents.wind.active && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={incidents.wind.severity}
                  onChange={(e) =>
                    handleSeverityChange('wind', e.target.value as Severity)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            )}
          </div>

          {/* Road Closure */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">Road Closure</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incidents.roadClosure.active}
                    onChange={() => dispatch(toggleRoadClosure())}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {incidents.roadClosure.active && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={incidents.roadClosure.severity}
                  onChange={(e) =>
                    handleSeverityChange(
                      'roadClosure',
                      e.target.value as Severity
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            )}
          </div>

          {/* Network Degraded / Down */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">
                  Network Degraded / Down
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incidents.network.active}
                    onChange={() => dispatch(toggleNetwork())}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {incidents.network.active && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network Level
                </label>
                <select
                  value={incidents.network.level}
                  onChange={(e) =>
                    handleNetworkLevelChange(e.target.value as NetworkLevel)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Degraded">Degraded</option>
                  <option value="Down">Down</option>
                </select>
              </div>
            )}
          </div>

          {/* Recover Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleRecover}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Recover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
