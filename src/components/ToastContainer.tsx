import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { removeToast, showToast } from '../store/toastSlice'
import Toast from './Toast'
import { useEffect, useRef } from 'react'

export default function ToastContainer() {
  const dispatch = useDispatch()
  const toastMessages = useSelector((state: RootState) => state.toast.messages)
  const queue = useSelector((state: RootState) => state.queue)
  const audit = useSelector((state: RootState) => state.audit)
  const previousActionIds = useRef<Set<string>>(new Set())
  const previousAuditIds = useRef<Set<string>>(new Set())

  // Show toast when action is queued (keep existing functionality)
  useEffect(() => {
    const queuedActions = queue.actions.filter((a) => a.status === 'Queued')
    const newActions = queuedActions.filter(
      (a) => !previousActionIds.current.has(a.id)
    )

    newActions.forEach((action) => {
      previousActionIds.current.add(action.id)
      dispatch(showToast({
        message: `Action queued: ${action.actionType}`,
        type: 'info',
      }))
    })
  }, [queue.actions, dispatch])

  // Show toast when recovery completes (keep existing functionality)
  useEffect(() => {
    const recoveryLogs = audit.logs.filter(
      (log) => log.details.includes('Network recovered') && !previousAuditIds.current.has(log.id)
    )

    recoveryLogs.forEach((log) => {
      previousAuditIds.current.add(log.id)
      const match = log.details.match(/Synced (\d+) actions/)
      if (match) {
        dispatch(showToast({
          message: `Recovery complete: ${match[1]} actions synced`,
          type: 'success',
        }))
      }
    })
  }, [audit.logs, dispatch])

  const handleClose = (id: string) => {
    dispatch(removeToast(id))
  }

  return (
    <>
      {toastMessages.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => handleClose(toast.id)}
          style={{
            top: `${80 + index * 70}px`,
          }}
        />
      ))}
    </>
  )
}
