interface IncidentPanelProps {
  onClose: () => void
}

export default function IncidentPanel({ onClose }: IncidentPanelProps) {
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
        
        <div className="p-6">
          <p className="text-gray-600">Incident controls will be implemented here.</p>
          <div className="mt-4 space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">Heavy Rain</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">Strong Wind</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">Road Closure</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">Network Degraded / Down</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
