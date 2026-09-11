import { ChevronRight } from 'lucide-react'
import { useBreadcrumb } from '../../hooks/useBreadcrumb'

export default function Breadcrumb() {
  const { crumbs } = useBreadcrumb()
  return (
    <nav className="flex items-center text-xs text-ink-500" aria-label="Breadcrumb">
      {crumbs.map((crumb, idx) => (
        <span key={`${crumb}-${idx}`} className="flex items-center">
          {idx > 0 && <ChevronRight size={12} className="mx-1 text-ink-400" />}
          <span className={idx === crumbs.length - 1 ? 'text-ink-700 font-medium' : ''}>{crumb}</span>
        </span>
      ))}
    </nav>
  )
}
