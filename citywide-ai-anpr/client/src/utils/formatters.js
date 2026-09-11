export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function initialsFromName(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export const severityStyles = {
  critical: { badge: 'badge-danger', dot: 'bg-danger-500' },
  warning: { badge: 'badge-warning', dot: 'bg-warning-500' },
  info: { badge: 'badge-brand', dot: 'bg-brand-500' },
  success: { badge: 'badge-success', dot: 'bg-success-500' },
}

export const cameraStatusStyles = {
  online: { badge: 'badge-success', label: 'Online' },
  degraded: { badge: 'badge-warning', label: 'Degraded' },
  offline: { badge: 'badge-danger', label: 'Offline' },
}
