import { Download, FileText } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MockDataNotice from '../components/ui/MockDataNotice'
import { reports } from '../services/mockData'

export default function Reports() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generated traffic, violation, and system-health reports available for download."
        actions={<button className="btn-primary"><FileText size={16} /> Generate report</button>}
      />

      <MockDataNotice text="Report history below is sample data. Report generation will be wired to the backend in a later phase." />

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-y border-surface-border bg-surface-muted">
                <th className="px-5 py-2.5 font-medium">Report</th>
                <th className="px-5 py-2.5 font-medium">Type</th>
                <th className="px-5 py-2.5 font-medium">Period</th>
                <th className="px-5 py-2.5 font-medium">Generated on</th>
                <th className="px-5 py-2.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <FileText size={15} />
                      </div>
                      <div>
                        <p className="font-medium text-ink-900">{r.name}</p>
                        <p className="text-xs text-ink-500 data-mono">{r.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><Badge variant="brand">{r.type}</Badge></td>
                  <td className="px-5 py-3 text-ink-700">{r.period}</td>
                  <td className="px-5 py-3 text-ink-500">{r.generatedOn}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="btn-secondary !py-1.5 !px-3">
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
