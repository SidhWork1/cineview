import { Link } from 'react-router-dom'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import type { Movie } from '../../core'

interface MovieCardProps {
  movie: Movie
  isInWatchlist?: boolean
  onToggleWatchlist?: () => void
}

const MovieCard = ({ movie, isInWatchlist = false, onToggleWatchlist }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : null

  return (
    <div className="relative flex-shrink-0 w-36 md:w-44 group">
      <Link to={`/movies/${movie.id}`}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
          <ImageWithFallback
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <span className="text-yellow-400 text-xs font-semibold">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-2 text-white/80 text-xs font-medium truncate">
          {movie.title}
        </p>
      </Link>

      {/* Watchlist Toggle */}
      <button
        onClick={onToggleWatchlist}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span className={`text-sm ${isInWatchlist ? 'text-purple-400' : 'text-white/60'}`}>
          {isInWatchlist ? '♥' : '♡'}
        </span>
      </button>
    </div>
  )
}

export default MovieCard