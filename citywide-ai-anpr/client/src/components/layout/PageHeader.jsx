import Breadcrumb from './Breadcrumb'

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <Breadcrumb />
        <h1 className="text-xl sm:text-2xl font-semibold text-ink-900 mt-1">{title}</h1>
        {description && <p className="text-sm text-ink-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
