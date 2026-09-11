// A minimal valid 1x1 JPEG, base64-encoded, used purely so the Demo Scenario
// button has something to submit to the real POST /api/anpr/process endpoint
// without requiring the presenter to have a sample image file on hand. This
// reuses the exact same upload path as a real user-selected file — nothing
// about processing is special-cased for the demo.
const TINY_JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q=='

export function createDemoFile() {
  const byteChars = atob(TINY_JPEG_BASE64)
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i)
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'image/jpeg' })
  return new File([blob], 'demo-scenario-vehicle.jpg', { type: 'image/jpeg' })
}
