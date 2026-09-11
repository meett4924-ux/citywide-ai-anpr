import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)
let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback(
    (message, { type = 'info', duration = 4500 } = {}) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      timers.current[id] = setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  const toast = {
    success: (message, opts) => push(message, { ...opts, type: 'success' }),
    error: (message, opts) => push(message, { ...opts, type: 'error' }),
    info: (message, opts) => push(message, { ...opts, type: 'info' }),
    warning: (message, opts) => push(message, { ...opts, type: 'warning' }),
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx.toast
}

// Used only by the <ToastViewport /> renderer.
export function useToastState() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastState must be used within a ToastProvider')
  return ctx
}
