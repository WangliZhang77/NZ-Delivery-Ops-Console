export default function System() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">System Status & Audit Log</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Status</h2>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-medium text-gray-900">Online</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Queued Actions</h2>
          <p className="text-gray-500">No queued actions</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Log</h2>
        <div className="flex gap-4 mb-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Modes</option>
            <option>Normal</option>
            <option>Disruption</option>
            <option>Offline</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Action Types</option>
            <option>UpdateOrderStatus</option>
            <option>AssignDriver</option>
            <option>CreateOrder</option>
          </select>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No audit logs available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
