import { Info } from 'lucide-react'

// Shown on list pages so it's clear to reviewers/stakeholders which screens are
// still backed by mock data versus a live backend + ANPR engine.
export default function MockDataNotice({ text = 'Showing sample data. Connect the backend API to display live records.' }) {
  return (
    <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-md px-3 py-2 mb-4">
      <Info size={14} className="shrink-0" />
      <span>{text}</span>
    </div>
  )
}
