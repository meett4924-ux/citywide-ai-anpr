import { ScanLine } from 'lucide-react'

export default function FullScreenLoader({ label = 'Loading...' }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-surface-muted gap-3">
      <div className="w-11 h-11 rounded-md bg-brand-600 flex items-center justify-center animate-pulse">
        <ScanLine size={20} className="text-white" />
      </div>
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  )
}
