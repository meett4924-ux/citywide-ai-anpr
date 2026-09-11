import { CheckCircle2, Loader2 } from 'lucide-react'
import { classNames } from '../../utils/formatters'

export const PROCESSING_STEPS = [
  'Detecting vehicles',
  'Detecting number plates',
  'Running OCR',
  'Saving ANPR results',
]

// `activeStepIndex` is driven by the parent as a simple client-side timed
// progression — the actual demo processing is fast/synchronous on the
// backend, so this gives the operator a readable sense of pipeline stages
// rather than claiming real per-stage backend progress reporting.
export default function ProcessingSteps({ activeStepIndex }) {
  return (
    <div className="space-y-2.5">
      {PROCESSING_STEPS.map((step, idx) => {
        const isDone = idx < activeStepIndex
        const isActive = idx === activeStepIndex
        return (
          <div key={step} className="flex items-center gap-3">
            {isDone ? (
              <CheckCircle2 size={18} className="text-success-600 shrink-0" />
            ) : isActive ? (
              <Loader2 size={18} className="text-brand-600 shrink-0 animate-spin" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-surface-border shrink-0" />
            )}
            <span
              className={classNames(
                'text-sm',
                isDone ? 'text-ink-500' : isActive ? 'text-ink-900 font-medium' : 'text-ink-400',
              )}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
