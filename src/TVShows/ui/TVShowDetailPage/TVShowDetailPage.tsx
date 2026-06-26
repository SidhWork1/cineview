import { useState, useEffect } from 'react'
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import ErrorMessage from '../../../Common/components/ErrorMessage'
import ErrorBoundary from '../../../Common/components/ErrorBoundary'
import { getTVShowDetail } from '../../data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import type { TVShowDetail } from '../../core'

const TVShowDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [show, setShow] = useState<TVShowDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    window.scrollTo(0, 0)

    const fetchShow = async () => {
      try {
        const data = await getTVShowDetail(id)
        setShow(data)
      } catch {
        setError('TV show not found.')
      } finally {
        setLoading(false)
      }
    }

    fetchShow()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ErrorMessage message={error ?? 'TV show not found.'} />
        <Link to="/" className="text-purple-500 hover:text-purple-400 text-sm transition-colors">
          Go back home
        </Link>
      </div>
    )
  }

  const backdropUrl = show.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop.large}${show.backdrop_path}`
    : null

  const posterUrl = show.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.large}${show.poster_path}`
    : null

  const mainSeasons = show.seasons.filter((s) => s.season_number > 0)

  return (
    <div className="pb-12">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={show.name}
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
              alt={show.name}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-8">
            {/* Genres */}
            <div className="flex gap-2 flex-wrap mb-3">
              {show.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {show.name}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 text-sm text-white/50">
              <span className="text-yellow-400 font-semibold">
                ★ {show.vote_average.toFixed(1)}
              </span>
              {show.first_air_date && (
                <span>{show.first_air_date.slice(0, 4)}</span>
              )}
              {show.number_of_seasons && (
                <span>{show.number_of_seasons} Seasons</span>
              )}
              {show.number_of_episodes && (
                <span>{show.number_of_episodes} Episodes</span>
              )}
              {show.status && <span>{show.status}</span>}
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-2xl">
              {show.overview}
            </p>

            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
              + Watchlist
            </button>
          </div>
        </div>

        {/* Seasons List */}
        <ErrorBoundary>
          <div className="mt-12">
            <h2 className="text-white font-semibold text-lg mb-4">Seasons</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mainSeasons.map((season) => {
                const seasonPoster = season.poster_path
                  ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.medium}${season.poster_path}`
                  : null

                return (
                  <div
                    key={season.id}
                    onClick={() =>
                      navigate(`/tv/${id}/season/${season.season_number}`)
                    }
                    className="cursor-pointer group"
                  >
                    <div className="rounded-xl overflow-hidden aspect-[2/3] mb-2">
                      <ImageWithFallback
                        src={seasonPoster}
                        alt={season.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-white/80 text-xs font-medium truncate">
                      {season.name}
                    </p>
                    <p className="text-white/40 text-xs">
                      {season.episode_count} episodes
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </ErrorBoundary>

        {/* Nested Season Route */}
        <Outlet />
      </div>
    </div>
  )
}

export default TVShowDetailPage