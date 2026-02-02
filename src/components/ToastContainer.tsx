import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import Toast from './Toast'
import { useState, useEffect, useRef } from 'react'

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export default function ToastContainer() {
  const queue = useSelector((state: RootState) => state.queue)
  const audit = useSelector((state: RootState) => state.audit)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const previousActionIds = useRef<Set<string>>(new Set())
  const previousAuditIds = useRef<Set<string>>(new Set())

  // Show toast when action is queued
  useEffect(() => {
    const queuedActions = queue.actions.filter((a) => a.status === 'Queued')
    const newActions = queuedActions.filter(
      (a) => !previousActionIds.current.has(a.id)
    )

    newActions.forEach((action) => {
      previousActionIds.current.add(action.id)
      setToasts((prev) => [
        ...prev,
        {
          id: action.id,
          message: `Action queued: ${action.actionType}`,
          type: 'info',
        },
      ])
    })
  }, [queue.actions])

  // Show toast when recovery completes
  useEffect(() => {
    const recoveryLogs = audit.logs.filter(
      (log) => log.details.includes('Network recovered') && !previousAuditIds.current.has(log.id)
    )

    recoveryLogs.forEach((log) => {
      previousAuditIds.current.add(log.id)
      const match = log.details.match(/Synced (\d+) actions/)
      if (match) {
        setToasts((prev) => [
          ...prev,
          {
            id: log.id,
            message: `Recovery complete: ${match[1]} actions synced`,
            type: 'success',
          },
        ])
      }
    })
  }, [audit.logs])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}
