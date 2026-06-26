import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TrailerModalProps {
  videoKey: string
  onClose: () => void
}

const TrailerModal = ({ videoKey, onClose }: TrailerModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        ✕
      </button>
    </div>,
    document.body
  )
}

export default TrailerModal