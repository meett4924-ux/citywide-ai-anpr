import { useState, useEffect, useRef } from 'react'
import { ScanLine, PlayCircle } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import UploadDropzone from '../components/anpr/UploadDropzone'
import VideoUploadCard from '../components/anpr/VideoUploadCard'
import ProcessingSteps, { PROCESSING_STEPS } from '../components/anpr/ProcessingSteps'
import ResultCard from '../components/anpr/ResultCard'
import AnprHistoryTable from '../components/anpr/AnprHistoryTable'
import { processMedia } from '../services/anprApi'
import { useToast } from '../context/ToastContext'

export default function AnprProcessing() {
  const toast = useToast()
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [results, setResults] = useState(null)
  const [processingMeta, setProcessingMeta] = useState(null)
  const [error, setError] = useState(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const stepTimer = useRef(null)

  useEffect(() => () => clearInterval(stepTimer.current), [])

  function handleFileSelected(selected) {
    setFile(selected)
    setResults(null)
    setError(null)
  }

  function handleRemove() {
    setFile(null)
    setResults(null)
    setError(null)
  }

  async function handleProcess() {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setResults(null)
    setActiveStep(0)

    // Client-side staged progression for readability — the demo backend
    // responds quickly and synchronously, so this is a UI pacing aid, not a
    // reflection of real per-stage backend progress reporting.
    stepTimer.current = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, PROCESSING_STEPS.length - 1))
    }, 650)

    try {
      const data = await processMedia(file)
      clearInterval(stepTimer.current)
      setActiveStep(PROCESSING_STEPS.length)

      if (!data.results.length) {
        toast.info(data.message || 'No vehicles detected in the provided media.')
      } else {
        toast.success(`Processed ${data.results.length} vehicle${data.results.length > 1 ? 's' : ''}.`)
      }
      setResults(data.results)
      setProcessingMeta({ processingMode: data.processingMode, storage: data.storage })
      setHistoryRefreshKey((k) => k + 1)
    } catch (err) {
      clearInterval(stepTimer.current)
      const message = err.response?.data?.message || 'Processing failed. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Automatic Number Plate Recognition"
        description="AI-powered vehicle and number plate detection"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card>
          <CardHeader
            title="Process Media"
            subtitle="Upload a vehicle image or short video to run detection"
          />

          <UploadDropzone
            file={file}
            onFileSelected={handleFileSelected}
            onRemove={handleRemove}
            disabled={isProcessing}
          />

          <button
            onClick={handleProcess}
            disabled={!file || isProcessing}
            className="btn-primary w-full mt-4"
          >
            <PlayCircle size={16} />
            {isProcessing ? 'Processing...' : 'Process'}
          </button>

          {error && (
            <div className="mt-4 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">{error}</div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Processing Status"
            subtitle={isProcessing ? 'Running the ANPR pipeline...' : 'Idle'}
          />
          {isProcessing ? (
            <ProcessingSteps activeStepIndex={activeStep} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 text-ink-400">
              <ScanLine size={28} className="mb-2" />
              <p className="text-sm">Select and process a file to see pipeline progress here.</p>
            </div>
          )}
        </Card>
      </div>

      <VideoUploadCard />

      {results && results.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-900">Detection Results</h2>
            {processingMeta?.processingMode === 'demo' && (
              <span className="badge badge-warning">
                Demo processing — not a real AI detection
                {processingMeta.storage === 'memory' ? ' · in-memory (no database connected)' : ''}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((r, idx) => (
              <ResultCard key={r._id} result={r} index={idx} />
            ))}
          </div>
        </div>
      )}

      <AnprHistoryTable refreshKey={historyRefreshKey} />
    </div>
  )
}
