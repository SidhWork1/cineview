import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import ErrorMessage from '../../../Common/components/ErrorMessage'
import { getSeasonDetail } from '../../data'
import { collectionStore } from '../../../Collection/data'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import { formatDate } from '../../../Common/utils'
import type { SeasonDetail } from '../../core'

const SeasonDetailPage = observer(() => {
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

  const showId = Number(id)
  const seasonNum = Number(seasonNumber)
  const episodeNumbers = season.episodes.map((e) => e.episode_number)
  const watchedCount = season.episodes.filter((e) =>
    collectionStore.isEpisodeWatched(showId, seasonNum, e.episode_number)
  ).length
  const totalCount = season.episodes.length
  const progressPercent = totalCount > 0
    ? Math.round((watchedCount / totalCount) * 100)
    : 0

  const handleMarkAll = () => {
    collectionStore.markAllEpisodes(showId, seasonNum, episodeNumbers)
  }

  const handleUnmarkAll = () => {
    collectionStore.unmarkAllEpisodes(showId, seasonNum)
  }

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">

        {/* Season Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-xl">{season.name}</h2>
          <Link
            to={`/tv/${id}`}
            className="text-purple-500 hover:text-purple-400 text-sm transition-colors"
          >
            ← Back to show
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/50 text-xs">
              {watchedCount} / {totalCount} episodes watched
            </span>
            <span className="text-white/50 text-xs">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Mark All / Unmark All */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleMarkAll}
            className="px-4 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs rounded-lg transition-colors"
          >
            ✓ Mark All
          </button>
          <button
            onClick={handleUnmarkAll}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 text-xs rounded-lg transition-colors"
          >
            ✕ Unmark All
          </button>
        </div>

        {/* Episode List */}
        <div className="flex flex-col gap-4">
          {season.episodes.map((episode) => {
            const isWatched = collectionStore.isEpisodeWatched(
              showId,
              seasonNum,
              episode.episode_number
            )
            const stillUrl = episode.still_path
              ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop.small}${episode.still_path}`
              : null

            return (
              <div
                key={episode.id}
                className={`flex gap-4 rounded-xl p-4 transition-colors ${
                  isWatched
                    ? 'bg-purple-600/10 border border-purple-600/20'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
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

                {/* Watched Toggle */}
                <div className="flex-shrink-0 flex items-center">
                  <button
                    onClick={() =>
                      collectionStore.toggleEpisodeWatched(
                        showId,
                        seasonNum,
                        episode.episode_number
                      )
                    }
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isWatched
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-white/20 hover:border-purple-400'
                    }`}
                  >
                    {isWatched && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default SeasonDetailPage