import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { useToastState } from '../../context/ToastContext'
import { classNames } from '../../utils/formatters'

const STYLES = {
  success: { icon: CheckCircle2, className: 'border-success-500/30 bg-success-50 text-success-600' },
  error: { icon: XCircle, className: 'border-danger-500/30 bg-danger-50 text-danger-600' },
  warning: { icon: AlertTriangle, className: 'border-warning-500/30 bg-warning-50 text-warning-600' },
  info: { icon: Info, className: 'border-brand-500/30 bg-brand-50 text-brand-700' },
}

export default function ToastViewport() {
  const { toasts, dismiss } = useToastState()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((t) => {
        const meta = STYLES[t.type] || STYLES.info
        const Icon = meta.icon
        return (
          <div
            key={t.id}
            role="status"
            className={classNames(
              'flex items-start gap-2.5 rounded-lg border bg-white shadow-card px-3.5 py-3 text-sm',
              meta.className,
            )}
          >
            <Icon size={17} className="shrink-0 mt-0.5" />
            <p className="flex-1 text-ink-900">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-ink-400 hover:text-ink-700 shrink-0">
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
