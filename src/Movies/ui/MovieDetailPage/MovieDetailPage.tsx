import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CastCarousel from '../CastCarousel'
import ContentRow from '../ContentRow'
import TrailerModal from '../TrailerModal'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import ErrorMessage from '../../../Common/components/ErrorMessage'
import ErrorBoundary from '../../../Common/components/ErrorBoundary'
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getRecommendedMovies,
} from '../../data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import type { MovieDetail, CastMember, Video, Movie } from '../../core'

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [similar, setSimilar] = useState<Movie[]>([])
  const [recommended, setRecommended] = useState<Movie[]>([])
  const [showTrailer, setShowTrailer] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [similarLoading, setSimilarLoading] = useState(true)
  const [recommendedLoading, setRecommendedLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    window.scrollTo(0, 0)

    const fetchMovie = async () => {
      try {
        const data = await getMovieDetail(id)
        setMovie(data)
      } catch {
        setError('Movie not found.')
      } finally {
        setLoading(false)
      }
    }

    const fetchCredits = async () => {
      try {
        const data = await getMovieCredits(id)
        setCast(data.cast)
      } catch {
        setCast([])
      }
    }

    const fetchVideos = async () => {
      try {
        const data = await getMovieVideos(id)
        setVideos(data.results)
      } catch {
        setVideos([])
      }
    }

    const fetchSimilar = async () => {
      try {
        const data = await getSimilarMovies(id)
        setSimilar(data.results)
      } catch {
        setSimilar([])
      } finally {
        setSimilarLoading(false)
      }
    }

    const fetchRecommended = async () => {
      try {
        const data = await getRecommendedMovies(id)
        setRecommended(data.results)
      } catch {
        setRecommended([])
      } finally {
        setRecommendedLoading(false)
      }
    }

    fetchMovie()
    fetchCredits()
    fetchVideos()
    fetchSimilar()
    fetchRecommended()
  }, [id])

  const trailerKey = videos.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  )?.key

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ErrorMessage message={error ?? 'Movie not found.'} />
        <Link to="/" className="text-purple-500 hover:text-purple-400 text-sm transition-colors">
          Go back home
        </Link>
      </div>
    )
  }

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
    : null

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.large}${movie.poster_path}`
    : null

  return (
    <div className="pb-12">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex gap-8">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0 w-48 rounded-xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={posterUrl}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-8">
            {/* Genres */}
            <div className="flex gap-2 flex-wrap mb-3">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-white/40 text-sm italic mb-4">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 text-sm text-white/50">
              <span className="text-yellow-400 font-semibold">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              {movie.release_date && (
                <span>{movie.release_date.slice(0, 4)}</span>
              )}
              {movie.runtime && <span>{movie.runtime} min</span>}
              <span>{movie.status}</span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  ▶ Watch Trailer
                </button>
              )}
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                + Watchlist
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <ErrorBoundary>
            <div className="mt-12">
              <h2 className="text-white font-semibold text-lg mb-4">Top Cast</h2>
              <CastCarousel cast={cast} />
            </div>
          </ErrorBoundary>
        )}

        {/* Similar Movies */}
        <ErrorBoundary>
          <div className="mt-8 -mx-6">
            <ContentRow
              title="Similar Movies"
              items={similar}
              isLoading={similarLoading}
            />
          </div>
        </ErrorBoundary>

        {/* Recommended */}
        <ErrorBoundary>
          <div className="mt-4 -mx-6">
            <ContentRow
              title="Recommended for You"
              items={recommended}
              isLoading={recommendedLoading}
            />
          </div>
        </ErrorBoundary>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}

export default MovieDetailPage