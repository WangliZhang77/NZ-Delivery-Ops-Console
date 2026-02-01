import { useParams, Link } from 'react-router-dom'

export default function OrderDetail() {
  const { id } = useParams()

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/orders"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
Back to Orders
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Order Detail: {id || 'N/A'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Order ID:</span>
              <p className="font-medium">{id || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Route:</span>
              <p className="font-medium">--</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Driver:</span>
              <p className="font-medium">--</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <p className="font-medium">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Timeline</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">Created</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">Assigned</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">PickedUp</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">EnRoute</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">Delivered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Details</h2>
        <p className="text-gray-500">No impact details available</p>
      </div>
    </div>
  )
}
