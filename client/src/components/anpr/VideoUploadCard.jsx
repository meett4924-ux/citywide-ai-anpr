import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle, Video, X } from 'lucide-react'
import Card, { CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import MockDataNotice from '../ui/MockDataNotice'
import UploadDropzone from './UploadDropzone'
import ResultCard from './ResultCard'
import { ACCEPTED_VIDEO_TYPES, formatFileSize } from '../../utils/fileValidation'
import { useDemoScenario, cameraIdFromSourceName } from '../../context/DemoScenarioContext'

// This card's own UI promises exactly "MP4, WebM, or MOV" — a subset of the
// shared ACCEPTED_VIDEO_TYPES (which also allows AVI for the general
// Process Media uploader). Filtering here keeps validation honest about
// what this specific dropzone says it accepts.
const TRAFFIC_VIDEO_TYPES = ACCEPTED_VIDEO_TYPES.filter((t) => t !== 'video/x-msvideo')
const VIDEO_ACCEPT_ATTR = 'video/mp4,video/webm,video/quicktime'

function formatVideoDuration(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// "UPLOAD TRAFFIC VIDEO" — SIH jury demo feature.
//
// This intentionally does NOT add a second ANPR backend path or a second
// demo pipeline. The video is only ever a local, in-browser preview (an
// object URL, revoked on remove/unmount) acting as the visual stand-in for
// the CAM-002 feed. "Process Video" simply calls the exact same
// useDemoScenario().start() used by the "Start Demo Scenario" button on the
// Tracking page — same backend call, same detectionStore records, same
// deterministic GJ05AB1234 result, same downstream Live Map / Analytics /
// Alerts. There is nothing video-specific on the server for this feature.
export default function VideoUploadCard() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [meta, setMeta] = useState(null) // { duration, width, height } | { error: true }
  const [metaLoading, setMetaLoading] = useState(false)
  const videoRef = useRef(null)

  const { status, detections, isRunning, isCompleted, usingFallback, error: demoError, start, reset } =
    useDemoScenario()

  // Always release the object URL — on remove AND on unmount — so we don't
  // leak memory across repeated selections during a long jury demo session.
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [videoUrl])

  function handleFileSelected(selected) {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setFile(selected)
    setVideoUrl(URL.createObjectURL(selected))
    setMeta(null)
    setMetaLoading(true)
  }

  function handleRemove() {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setFile(null)
    setVideoUrl(null)
    setMeta(null)
    setMetaLoading(false)
  }

  function handleLoadedMetadata() {
    const el = videoRef.current
    if (!el) return
    setMeta({ duration: el.duration, width: el.videoWidth, height: el.videoHeight })
    setMetaLoading(false)
  }

  function handleVideoError() {
    setMeta({ error: true })
    setMetaLoading(false)
  }

  async function handleProcess() {
    if (!file || meta?.error) return
    await start()
  }

  const cam002Result = detections.find((d) => cameraIdFromSourceName(d.sourceName) === 'CAM-002')
  const scenarioStarted = status !== 'idle'

  return (
    <Card className="mb-5">
      <CardHeader
        title="Upload Traffic Video"
        subtitle="Use a local traffic/CCTV-style clip as the CAM-002 feed for the demo scenario"
      />

      <MockDataNotice text="DEMO VIDEO PROCESSING — the video is used only as a visual camera feed. Detection results below are simulated, not real computer vision." />

      {!file ? (
        <UploadDropzone
          file={null}
          onFileSelected={handleFileSelected}
          onRemove={handleRemove}
          acceptedTypes={TRAFFIC_VIDEO_TYPES}
          acceptAttr={VIDEO_ACCEPT_ATTR}
          title="Drag & drop a traffic video here, or click to browse"
          helperText="MP4, WebM, or MOV"
          showTypeBadges={false}
          showPreview={false}
        />
      ) : (
        <div>
          <div className="rounded-lg overflow-hidden border border-surface-border bg-black">
            {/* Standard HTML5 video + a local object URL — no upload to any
                external service happens for this preview. */}
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full max-h-80 bg-black"
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleVideoError}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">File Name</p>
              <p className="text-sm font-medium text-ink-900 truncate mt-0.5">{file.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Duration</p>
              <p className="text-sm font-medium text-ink-900 mt-0.5">
                {metaLoading ? 'Loading...' : formatVideoDuration(meta?.duration)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Resolution</p>
              <p className="text-sm font-medium text-ink-900 mt-0.5">
                {meta?.width ? `${meta.width}×${meta.height}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">File Size</p>
              <p className="text-sm font-medium text-ink-900 mt-0.5">{formatFileSize(file.size)}</p>
            </div>
          </div>

          {meta?.error && (
            <div className="mt-3 rounded-md bg-danger-50 text-danger-600 text-xs px-3.5 py-2.5">
              This video could not be played back by your browser. It may be corrupted or in an unsupported
              codec — try a different file.
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button onClick={handleRemove} disabled={isRunning} className="btn-secondary">
              <X size={15} /> Remove Video
            </button>
            <button onClick={handleProcess} disabled={isRunning || !!meta?.error} className="btn-primary">
              <PlayCircle size={15} /> {isRunning ? 'Processing...' : 'Process Video'}
            </button>
          </div>

          {demoError && (
            <div className="mt-4 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">{demoError}</div>
          )}

          {usingFallback && scenarioStarted && (
            <div className="mt-4 rounded-md bg-warning-50 text-warning-600 text-xs px-3.5 py-2.5">
              Backend unreachable — running the scenario fully in the browser with the same demo data.
            </div>
          )}

          {scenarioStarted && (
            <div className="mt-5 pt-5 border-t border-surface-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-ink-900">Demo Detection Result</h3>
                <Badge variant="warning">SIMULATED ANPR RESULT</Badge>
              </div>

              {!cam002Result ? (
                <div className="flex items-center gap-2 text-sm text-ink-500">
                  <Video size={16} className="animate-pulse" />
                  Running vehicle detection, plate detection, and OCR (demo)...
                </div>
              ) : (
                <ResultCard result={cam002Result} index={0} />
              )}

              <p className="text-xs text-ink-500 mt-3">
                Demo scenario — multi-camera movement is simulated.{' '}
                {isCompleted
                  ? 'The full CAM-002 → CAM-014 → CAM-033 journey has completed — see'
                  : 'This continues on'}{' '}
                <Link to="/trajectories" className="text-brand-600 font-medium hover:underline">
                  the Tracking page
                </Link>{' '}
                for the live trajectory, or check Live Map, Analytics, and Alerts.
              </p>

              {isCompleted && (
                <button onClick={reset} className="btn-secondary mt-3">
                  <X size={14} /> Reset Demo
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
