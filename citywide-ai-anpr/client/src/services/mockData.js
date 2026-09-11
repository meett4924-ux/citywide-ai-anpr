// ---------------------------------------------------------------------------
// Mock data layer.
// Every export here mirrors the shape the real API is expected to return, so
// swapping a page from mock data to `services/api.js` calls later requires no
// change to the component markup — only the data source changes.
// ---------------------------------------------------------------------------

export const kpiSummary = [
  { id: 'vehicles', label: 'Vehicles Detected (24h)', value: '48,213', delta: '+6.2%', trend: 'up' },
  { id: 'cameras', label: 'Cameras Online', value: '182 / 196', delta: '92.9%', trend: 'flat' },
  { id: 'alerts', label: 'Active Alerts', value: '7', delta: '+2 today', trend: 'up-negative' },
  { id: 'avgSpeed', label: 'Avg. Corridor Speed', value: '38 km/h', delta: '-3.1%', trend: 'down' },
]

export const trafficVolumeSeries = [
  { time: '00:00', volume: 420 }, { time: '02:00', volume: 260 }, { time: '04:00', volume: 190 },
  { time: '06:00', volume: 980 }, { time: '08:00', volume: 2410 }, { time: '10:00', volume: 1870 },
  { time: '12:00', volume: 2040 }, { time: '14:00', volume: 1930 }, { time: '16:00', volume: 2260 },
  { time: '18:00', volume: 2870 }, { time: '20:00', volume: 1540 }, { time: '22:00', volume: 810 },
]

export const detectionsByCameraSeries = [
  { camera: 'CAM-014', detections: 3210 },
  { camera: 'CAM-002', detections: 2870 },
  { camera: 'CAM-091', detections: 2650 },
  { camera: 'CAM-057', detections: 2110 },
  { camera: 'CAM-033', detections: 1980 },
  { camera: 'CAM-076', detections: 1640 },
]

export const vehicleClassSplit = [
  { name: 'Car', value: 62 },
  { name: 'Two-wheeler', value: 21 },
  { name: 'Commercial / Truck', value: 9 },
  { name: 'Bus', value: 5 },
  { name: 'Other', value: 3 },
]

export const cameras = [
  { id: 'CAM-002', name: 'Sabarmati Bridge East', zone: 'Zone 1 - Central', status: 'online', uptime: '99.8%', lastPing: '4s ago', lat: 23.0281, lng: 72.5811 },
  { id: 'CAM-014', name: 'GIFT City Junction', zone: 'Zone 4 - GIFT City', status: 'online', uptime: '99.2%', lastPing: '2s ago', lat: 23.1610, lng: 72.6850 },
  { id: 'CAM-033', name: 'Infocity Circle', zone: 'Zone 4 - GIFT City', status: 'online', uptime: '97.4%', lastPing: '9s ago', lat: 23.1935, lng: 72.6383 },
  { id: 'CAM-057', name: 'Sector 21 Crossing', zone: 'Zone 2 - Sectors', status: 'degraded', uptime: '81.6%', lastPing: '48s ago', lat: 23.2020, lng: 72.6420 },
  { id: 'CAM-076', name: 'Koba Toll Approach', zone: 'Zone 3 - Highway', status: 'online', uptime: '99.9%', lastPing: '1s ago', lat: 23.2156, lng: 72.6369 },
  { id: 'CAM-091', name: 'Mahatma Mandir Gate', zone: 'Zone 1 - Central', status: 'offline', uptime: '64.0%', lastPing: '14m ago', lat: 23.2260, lng: 72.6480 },
  { id: 'CAM-104', name: 'Adalaj Flyover North', zone: 'Zone 3 - Highway', status: 'online', uptime: '98.7%', lastPing: '6s ago', lat: 23.1660, lng: 72.5850 },
]

export const vehicles = [
  { plate: 'GJ01AB4521', type: 'Car', color: 'White', lastSeenCamera: 'CAM-014', lastSeenTime: '2 min ago', flag: null },
  { plate: 'GJ05CT8890', type: 'Two-wheeler', color: 'Black', lastSeenCamera: 'CAM-002', lastSeenTime: '5 min ago', flag: null },
  { plate: 'GJ18XZ1123', type: 'Truck', color: 'Blue', lastSeenCamera: 'CAM-076', lastSeenTime: '7 min ago', flag: 'stolen' },
  { plate: 'GJ27PL5567', type: 'Car', color: 'Silver', lastSeenCamera: 'CAM-033', lastSeenTime: '11 min ago', flag: null },
  { plate: 'GJ01ZT0099', type: 'Bus', color: 'Yellow', lastSeenCamera: 'CAM-057', lastSeenTime: '14 min ago', flag: 'overspeed' },
  { plate: 'GJ09MK3345', type: 'Car', color: 'Red', lastSeenCamera: 'CAM-104', lastSeenTime: '19 min ago', flag: null },
  { plate: 'GJ01QW7788', type: 'Two-wheeler', color: 'White', lastSeenCamera: 'CAM-091', lastSeenTime: '22 min ago', flag: 'no-helmet' },
]

export const trajectories = [
  {
    id: 'TRJ-88213',
    plate: 'GJ18XZ1123',
    path: ['CAM-076', 'CAM-057', 'CAM-014'],
    startTime: '09:12',
    endTime: '09:41',
    distanceKm: 14.2,
    status: 'flagged',
  },
  {
    id: 'TRJ-88214',
    plate: 'GJ01AB4521',
    path: ['CAM-002', 'CAM-033', 'CAM-014'],
    startTime: '10:02',
    endTime: '10:26',
    distanceKm: 9.6,
    status: 'normal',
  },
  {
    id: 'TRJ-88215',
    plate: 'GJ27PL5567',
    path: ['CAM-104', 'CAM-002'],
    startTime: '10:15',
    endTime: '10:29',
    distanceKm: 5.1,
    status: 'normal',
  },
]

export const alerts = [
  { id: 'ALT-3391', severity: 'critical', title: 'Stolen vehicle detected', detail: 'GJ18XZ1123 matched hotlist at CAM-076 (Koba Toll Approach)', time: '2 min ago' },
  { id: 'ALT-3390', severity: 'warning', title: 'Overspeed violation', detail: 'GJ01ZT0099 recorded at 74 km/h in a 50 km/h zone, CAM-057', time: '9 min ago' },
  { id: 'ALT-3388', severity: 'warning', title: 'Helmet violation', detail: 'Two-wheeler GJ01QW7788 flagged with no-helmet, CAM-091', time: '22 min ago' },
  { id: 'ALT-3384', severity: 'info', title: 'Camera degraded', detail: 'CAM-057 signal quality dropped below 85% threshold', time: '41 min ago' },
  { id: 'ALT-3379', severity: 'critical', title: 'Camera offline', detail: 'CAM-091 (Mahatma Mandir Gate) has not reported in 14 minutes', time: '1 hr ago' },
]

export const notifications = [
  { id: 1, title: 'Stolen vehicle match', detail: 'GJ18XZ1123 flagged at Koba Toll Approach', time: '2 min ago', unread: true },
  { id: 2, title: 'Camera degraded', detail: 'CAM-057 signal quality below threshold', time: '41 min ago', unread: true },
  { id: 3, title: 'Weekly report ready', detail: 'Traffic analytics summary for last week is ready', time: '3 hr ago', unread: false },
]

export const reports = [
  { id: 'RPT-1042', name: 'Weekly Traffic Summary', period: '01 Sep - 07 Sep 2026', generatedOn: '07 Sep 2026', type: 'Traffic Analytics' },
  { id: 'RPT-1041', name: 'Monthly Violation Report', period: 'Aug 2026', generatedOn: '01 Sep 2026', type: 'Violations' },
  { id: 'RPT-1039', name: 'Camera Uptime Audit', period: 'Aug 2026', generatedOn: '01 Sep 2026', type: 'System Health' },
  { id: 'RPT-1035', name: 'Zone-wise Congestion Report', period: '25 Aug 2026', generatedOn: '26 Aug 2026', type: 'Traffic Analytics' },
]

export const currentUser = {
  name: 'Inspector A. Rao',
  role: 'Administrator',
  organization: 'City Traffic Police - Command Center',
  avatar: null,
  isActive: true,
}
