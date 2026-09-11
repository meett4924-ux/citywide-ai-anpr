import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Card, { CardHeader } from '../ui/Card'
import { detectionsByCameraSeries, vehicleClassSplit } from '../../services/mockData'

const PIE_COLORS = ['#1e54d6', '#5794f6', '#16a34a', '#d97706', '#94a3b8']

export function DetectionsByCameraChart() {
  return (
    <Card>
      <CardHeader title="Top Cameras by Detections" subtitle="Last 24 hours" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={detectionsByCameraSeries} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e7ee" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="camera" type="category" width={72} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e7ee', fontSize: 12 }} cursor={{ fill: '#f5f7fa' }} />
            <Bar dataKey="detections" fill="#1e54d6" radius={[0, 4, 4, 0]} barSize={16} name="Detections" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function VehicleClassChart() {
  return (
    <Card>
      <CardHeader title="Vehicle Class Split" subtitle="Share of total detections" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={vehicleClassSplit}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
            >
              {vehicleClassSplit.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e7ee', fontSize: 12 }} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#334155' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
