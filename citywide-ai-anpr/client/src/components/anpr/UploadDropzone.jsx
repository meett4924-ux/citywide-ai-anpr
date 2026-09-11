import { useRef, useState } from 'react'
import { UploadCloud, ImageIcon, Video, X } from 'lucide-react'
import { validateAnprFile, formatFileSize, isVideoFile, ACCEPTED_TYPES, MAX_FILE_SIZE_MB } from '../../utils/fileValidation'
import { classNames } from '../../utils/formatters'

// `acceptedTypes`/`acceptAttr`/`title`/`helperText`/`showPreview` let callers
// reuse this one dropzone for a narrower use case (e.g. the video-only
// "Upload Traffic Video" card) instead of building a second component.
// Defaults reproduce the original image+video ANPR upload behavior exactly.
export default function UploadDropzone({
  file,
  onFileSelected,
  onRemove,
  disabled,
  acceptedTypes = ACCEPTED_TYPES,
  acceptAttr = 'image/jpeg,image/png,video/mp4,video/x-msvideo,video/quicktime,video/webm',
  title = 'Drag & drop a file here, or click to browse',
  helperText = `Supports JPG, PNG images and MP4, AVI, MOV, WebM videos · up to ${MAX_FILE_SIZE_MB}MB`,
  showTypeBadges = true,
  showPreview = true,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)

  function handleFiles(fileList) {
    const selected = fileList?.[0]
    if (!selected) return
    const { valid, error: validationError } = validateAnprFile(selected, acceptedTypes)
    if (!valid) {
      setError(validationError)
      return
    }
    setError(null)
    onFileSelected(selected)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  if (file) {
    // Callers that render their own richer preview (e.g. a full <video>
    // player) opt out of this compact one entirely rather than showing both.
    if (!showPreview) return null

    const previewUrl = !isVideoFile(file) ? URL.createObjectURL(file) : null
    return (
      <div className="border border-surface-border rounded-lg p-4 flex items-center gap-4 bg-surface-muted">
        <div className="w-16 h-16 rounded-md bg-white border border-surface-border flex items-center justify-center overflow-hidden shrink-0">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Video size={22} className="text-ink-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
          <p className="text-xs text-ink-500 mt-0.5">{formatFileSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="p-2 rounded-md text-ink-400 hover:text-danger-600 hover:bg-danger-50 disabled:opacity-40"
          aria-label="Remove file"
        >
          <X size={18} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={classNames(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging ? 'border-brand-500 bg-brand-50' : 'border-surface-border bg-surface-muted hover:bg-surface-subtle',
          disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          <UploadCloud size={22} />
        </div>
        <p className="text-sm font-medium text-ink-900">{title}</p>
        <p className="text-xs text-ink-500 mt-1.5">{helperText}</p>

        {showTypeBadges && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="badge badge-neutral"><ImageIcon size={12} /> Image</span>
            <span className="badge badge-neutral"><Video size={12} /> Video</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-xs text-danger-600 mt-2">{error}</p>}
    </div>
  )
}
