import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import TrailerModal from '../TrailerModal'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import { collectionStore } from '../../../Collection/data'
import type { Movie } from '../../core'

interface HeroBannerProps {
  movie: Movie
  trailerKey?: string | null
}

const HeroBanner = observer(({ movie, trailerKey }: HeroBannerProps) => {
  const [showTrailer, setShowTrailer] = useState(false)

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
    : null

  const isInWatchlist = collectionStore.isInWatchlist(movie.id, 'movie')

  const handleToggleWatchlist = () => {
    if (isInWatchlist) {
      collectionStore.removeFromWatchlist(movie.id, 'movie')
    } else {
      collectionStore.addToWatchlist(
        movie.id,
        'movie',
        movie.title,
        movie.poster_path,
        movie.vote_average
      )
    }
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[500px]">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-white/5" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 px-6 pb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          {movie.title}
        </h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-yellow-400 font-semibold">
            ★ {movie.vote_average.toFixed(1)}
          </span>
          {movie.release_date && (
            <span className="text-white/50 text-sm">
              {movie.release_date.slice(0, 4)}
            </span>
          )}
        </div>
        <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          {trailerKey && (
            <button
              onClick={() => setShowTrailer(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ▶ Watch Trailer
            </button>
          )}
          <button
            onClick={handleToggleWatchlist}
            className={`px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${
              isInWatchlist
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isInWatchlist ? '♥ In Watchlist' : '+ Watchlist'}
          </button>
        </div>
      </div>

      {showTrailer && trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
})

export default HeroBanner