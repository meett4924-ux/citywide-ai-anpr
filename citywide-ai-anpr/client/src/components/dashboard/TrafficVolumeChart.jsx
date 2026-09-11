import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card, { CardHeader } from '../ui/Card'
import { trafficVolumeSeries } from '../../services/mockData'

export default function TrafficVolumeChart() {
  return (
    <Card>
      <CardHeader title="Traffic Volume - Last 24 Hours" subtitle="Vehicles detected per 2-hour window, all zones" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficVolumeSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2f6fee" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2f6fee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e7ee" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e7ee' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e7ee', fontSize: 12 }}
              labelStyle={{ color: '#0f1a2e', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="volume" stroke="#1e54d6" strokeWidth={2} fill="url(#volumeFill)" name="Vehicles" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
