export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// Returns a 0-4 score plus a label/color for the strength meter UI.
export function getPasswordStrength(password = '') {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const capped = Math.min(score, 4)
  const meta = [
    { label: 'Very weak', color: 'bg-danger-500' },
    { label: 'Weak', color: 'bg-danger-500' },
    { label: 'Fair', color: 'bg-warning-500' },
    { label: 'Good', color: 'bg-brand-500' },
    { label: 'Strong', color: 'bg-success-500' },
  ][capped]

  return { score: capped, ...meta }
}
