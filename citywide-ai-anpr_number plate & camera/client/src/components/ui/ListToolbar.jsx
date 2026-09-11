import { Search } from 'lucide-react'

export default function ListToolbar({ searchPlaceholder = 'Search...', value, onChange, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={searchPlaceholder}
          className="input pl-9"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  )
}
