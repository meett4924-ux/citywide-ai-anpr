import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import { currentUser } from '../services/mockData'

export default function Settings() {
  const [notifyPrefs, setNotifyPrefs] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    weeklyReports: false,
    cameraHealth: true,
  })

  function togglePref(key) {
    setNotifyPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile, notification preferences, and account security." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Profile" subtitle="Your account information" />
          <div className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" defaultValue={currentUser.name} />
            </div>
            <div>
              <label className="label">Role</label>
              <input className="input" defaultValue={currentUser.role} disabled />
            </div>
            <div>
              <label className="label">Organization</label>
              <input className="input" defaultValue={currentUser.organization} />
            </div>
            <button className="btn-primary">Save changes</button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notification preferences" subtitle="Choose which events notify you" />
          <div className="space-y-3">
            {[
              { key: 'criticalAlerts', label: 'Critical alerts (stolen vehicle, hotlist match)' },
              { key: 'warningAlerts', label: 'Warning alerts (overspeed, violations)' },
              { key: 'cameraHealth', label: 'Camera health & connectivity issues' },
              { key: 'weeklyReports', label: 'Weekly analytics report summary' },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
                <span className="text-sm text-ink-700">{item.label}</span>
                <button
                  type="button"
                  onClick={() => togglePref(item.key)}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                    notifyPrefs[item.key] ? 'bg-brand-600' : 'bg-surface-border'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      notifyPrefs[item.key] ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Security" subtitle="Password and session management" />
          <div className="space-y-4">
            <div>
              <label className="label">Current password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">New password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <button className="btn-primary">Update password</button>
          </div>
        </Card>

        <Card>
          <CardHeader title="System" subtitle="Platform configuration (read-only preview)" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Environment</dt>
              <dd className="text-ink-900 font-medium">Development</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">API base URL</dt>
              <dd className="text-ink-900 font-medium data-mono text-xs">{import.meta.env.VITE_API_BASE_URL || 'not set'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">ANPR engine</dt>
              <dd className="text-ink-500">Not connected</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
