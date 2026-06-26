import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string | null
  alt: string
  className?: string
}

const ImageWithFallback = ({ src, alt, className }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`bg-white/5 flex items-center justify-center ${className}`}>
        <span className="text-white/20 text-xs text-center px-2">No Image</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}

export default ImageWithFallback