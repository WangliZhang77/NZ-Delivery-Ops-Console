export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Deliveries</h3>
          <p className="text-3xl font-bold text-gray-900">--</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Delayed Orders</h3>
          <p className="text-3xl font-bold text-orange-600">--</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Delay</h3>
          <p className="text-3xl font-bold text-gray-900">--</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Queued Actions</h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Mode</h2>
        <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
          Normal
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Incidents</h2>
        <p className="text-gray-500">No recent incidents</p>
      </div>
    </div>
  )
}
