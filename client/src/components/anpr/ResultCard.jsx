import { Car, ImageIcon } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { resolveMediaUrl } from '../../utils/media'

function ConfidencePill({ label, value }) {
  if (value === null || value === undefined) {
    return (
      <div>
        <p className="text-[11px] text-ink-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-ink-400 mt-0.5">&mdash;</p>
      </div>
    )
  }
  const pct = Math.round(value * 100)
  const color = pct >= 90 ? 'text-success-600' : pct >= 70 ? 'text-warning-600' : 'text-danger-600'
  return (
    <div>
      <p className="text-[11px] text-ink-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${color}`}>{pct}%</p>
    </div>
  )
}

export default function ResultCard({ result, index }) {
  const plateImage = resolveMediaUrl(result.plateImageUrl)
  const sourceImage = resolveMediaUrl(result.imageUrl)

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-ink-500">Vehicle #{String(index + 1).padStart(3, '0')}</p>
          <p className="text-lg font-semibold text-ink-900 data-mono tracking-wide mt-0.5">
            {result.plateNumber}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {result.processingMode === 'demo' && <Badge variant="warning">Demo</Badge>}
          <Badge variant={result.processingStatus === 'completed' ? 'success' : 'danger'}>
            {result.processingStatus}
          </Badge>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="w-20 h-20 rounded-md bg-surface-muted border border-surface-border flex items-center justify-center overflow-hidden shrink-0">
          {plateImage ? (
            <img src={plateImage} alt="Plate crop" className="w-full h-full object-cover" />
          ) : sourceImage ? (
            <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-ink-300" />
          )}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-y-1.5 gap-x-3 text-sm">
          <div className="flex items-center gap-1.5 text-ink-700">
            <Car size={14} className="text-ink-400" />
            {result.vehicleType}
          </div>
          <div className="text-ink-700">{result.vehicleColor || '—'}</div>
          <div className="text-ink-500 text-xs col-span-2">
            {result.sourceName} &middot; {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-surface-border">
        <ConfidencePill label="Detection" value={result.vehicleConfidence} />
        <ConfidencePill label="Plate" value={result.plateConfidence} />
        <ConfidencePill label="OCR" value={result.ocrConfidence} />
      </div>
    </Card>
  )
}
