// Normalizes raw OCR output and checks it against a general Indian vehicle
// registration format. This does not guarantee correctness — it only flags
// text that is *shaped* like a valid plate versus text that clearly isn't.

// General Indian format: 2 letters (state) + 1-2 digits (RTO code) +
// 1-3 letters (series) + 4 digits (number), e.g. GJ05AB1234, MH12CD1.
const INDIAN_PLATE_REGEX = /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/

export function normalizePlate(raw = '') {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '') // strip spaces, dashes, punctuation
    .trim()
}

// Returns { valid, confidence, reason } — confidence here reflects format
// plausibility, not OCR accuracy (that's ocrConfidence, tracked separately).
export function validatePlate(normalized) {
  if (!normalized) {
    return { valid: false, confidence: 0, reason: 'Empty plate text after normalization.' }
  }
  if (INDIAN_PLATE_REGEX.test(normalized)) {
    return { valid: true, confidence: 0.95, reason: 'Matches standard Indian plate format.' }
  }
  // Right length range but doesn't fully match the strict pattern — still
  // usable, just flagged with lower confidence rather than rejected outright.
  if (normalized.length >= 8 && normalized.length <= 11) {
    return { valid: true, confidence: 0.55, reason: 'Plausible length but non-standard format.' }
  }
  return { valid: false, confidence: 0.1, reason: 'Does not resemble a valid plate format.' }
}
