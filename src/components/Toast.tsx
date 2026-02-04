import { useEffect } from 'react'
import type { CSSProperties } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
  onClose: () => void
  duration?: number
  style?: CSSProperties
}

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
  style,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  return (
    <div className="fixed right-6 z-50 animate-slide-in" style={style}>
      <div
        className={`${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  )
}
