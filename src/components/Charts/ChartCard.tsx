import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full" style={{ height: '280px' }}>
      {/* Fixed height header */}
      <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0" style={{ height: '48px' }}>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      {/* Fixed height content area with padding */}
      <div className="flex-1 p-4 min-h-0" style={{ height: '232px' }}>
        {children}
      </div>
    </div>
  )
}
