import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import ErrorMessage from '../../../Common/components/ErrorMessage'
import { getSeasonDetail } from '../../data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import { formatDate } from '../../../Common/utils'
import type { SeasonDetail } from '../../core'

const SeasonDetailPage = () => {
  const { id, seasonNumber } = useParams<{ id: string; seasonNumber: string }>()

  const [season, setSeason] = useState<SeasonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !seasonNumber) return
    window.scrollTo(0, 0)

    const fetchSeason = async () => {
      try {
        const data = await getSeasonDetail(id, seasonNumber)
        setSeason(data)
      } catch {
        setError('Season not found.')
      } finally {
        setLoading(false)
      }
    }

    fetchSeason()
  }, [id, seasonNumber])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !season) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ErrorMessage message={error ?? 'Season not found.'} />
        <Link
          to={`/tv/${id}`}
          className="text-purple-500 hover:text-purple-400 text-sm transition-colors"
        >
          Back to show
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Season Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-xl">{season.name}</h2>
          <Link
            to={`/tv/${id}`}
            className="text-purple-500 hover:text-purple-400 text-sm transition-colors"
          >
            ← Back to show
          </Link>
        </div>

        {/* Episode List */}
        <div className="flex flex-col gap-4">
          {season.episodes.map((episode) => {
            const stillUrl = episode.still_path
              ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop.small}${episode.still_path}`
              : null

            return (
              <div
                key={episode.id}
                className="flex gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                {/* Still Image */}
                <div className="flex-shrink-0 w-32 md:w-48 rounded-lg overflow-hidden aspect-video">
                  <ImageWithFallback
                    src={stillUrl}
                    alt={episode.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Episode Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/30 text-xs">
                      EP {episode.episode_number}
                    </span>
                    {episode.air_date && (
                      <span className="text-white/30 text-xs">
                        · {formatDate(episode.air_date)}
                      </span>
                    )}
                    {episode.runtime && (
                      <span className="text-white/30 text-xs">
                        · {episode.runtime} min
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1 truncate">
                    {episode.name}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                    {episode.overview || 'No description available.'}
                  </p>
                </div>

                {/* Watched Toggle Placeholder */}
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-5 h-5 rounded-full border border-white/20" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SeasonDetailPage