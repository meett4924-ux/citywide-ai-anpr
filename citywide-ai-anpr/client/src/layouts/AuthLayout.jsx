import { Outlet } from 'react-router-dom'
import { ScanLine, ShieldCheck, Radar, MapPinned } from 'lucide-react'

const FEATURES = [
  { icon: Radar, text: 'Real-time ANPR detection across every connected camera feed' },
  { icon: MapPinned, text: 'City-wide vehicle trajectory reconstruction and route replay' },
  { icon: ShieldCheck, text: 'Instant alerts for hotlisted, overspeeding and flagged vehicles' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* Brand panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-[42%] bg-brand-950 text-white flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
              <ScanLine size={20} />
            </div>
            <div>
              <p className="font-semibold leading-tight">CityWide ANPR</p>
              <p className="text-xs text-brand-200 leading-tight">Traffic Intelligence Platform</p>
            </div>
          </div>

          <div className="mt-14 max-w-sm">
            <h1 className="text-3xl font-semibold leading-tight">City-Wide AI Engine</h1>
            <p className="text-lg text-brand-100 mt-2 leading-snug">
              Multi-Camera ANPR &amp; Urban Traffic Intelligence
            </p>
          </div>

          <ul className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} />
                </div>
                <p className="text-sm text-brand-100 leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-300">
          Authorized personnel only. All access to this system is logged and monitored.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
