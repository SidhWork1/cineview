import { useState, useEffect } from 'react'
import HeroBanner from '../HeroBanner'
import ContentRow from '../ContentRow'
import GenreFilter from '../GenreFilter'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import ErrorBoundary from '../../../Common/components/ErrorBoundary'
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getGenres,
  getMovieVideos,
} from '../../data'
import type { Movie, Genre } from '../../core'

const HomePage = () => {
  const [trending, setTrending] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [upcoming, setUpcoming] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  const [heroLoading, setHeroLoading] = useState(true)
  const [popularLoading, setPopularLoading] = useState(true)
  const [topRatedLoading, setTopRatedLoading] = useState(true)
  const [upcomingLoading, setUpcomingLoading] = useState(true)
  const [genresLoading, setGenresLoading] = useState(true)

  const [popularError, setPopularError] = useState<string | null>(null)
  const [topRatedError, setTopRatedError] = useState<string | null>(null)
  const [upcomingError, setUpcomingError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending()
        setTrending(data.results)

        if (data.results[0]) {
          try {
            const videos = await getMovieVideos(String(data.results[0].id))
            const trailer = videos.results.find(
              (v) => v.site === 'YouTube' && v.type === 'Trailer'
            )
            setTrailerKey(trailer?.key ?? null)
          } catch {
            setTrailerKey(null)
          }
        }
      } catch {
        setTrending([])
      } finally {
        setHeroLoading(false)
      }
    }

    const fetchPopular = async () => {
      try {
        const data = await getPopularMovies()
        setPopular(data.results)
      } catch {
        setPopularError('Failed to load popular movies.')
      } finally {
        setPopularLoading(false)
      }
    }

    const fetchTopRated = async () => {
      try {
        const data = await getTopRatedMovies()
        setTopRated(data.results)
      } catch {
        setTopRatedError('Failed to load top rated movies.')
      } finally {
        setTopRatedLoading(false)
      }
    }

    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingMovies()
        setUpcoming(data.results)
      } catch {
        setUpcomingError('Failed to load upcoming movies.')
      } finally {
        setUpcomingLoading(false)
      }
    }

    const fetchGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(data.genres)
      } catch {
        setGenres([])
      } finally {
        setGenresLoading(false)
      }
    }

    fetchTrending()
    fetchPopular()
    fetchTopRated()
    fetchUpcoming()
    fetchGenres()
  }, [])

  const filterByGenre = (movies: Movie[]) => {
    if (!activeGenreId) return movies
    return movies.filter((m) => m.genre_ids?.includes(activeGenreId))
  }

  const heroMovie = trending[0]

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <ErrorBoundary>
        {heroLoading ? (
          <div className="h-[70vh] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : heroMovie ? (
          <HeroBanner movie={heroMovie} trailerKey={trailerKey} />
        ) : null}
      </ErrorBoundary>

      <div className="mt-8">
        {/* Genre Filter */}
        {!genresLoading && genres.length > 0 && (
          <ErrorBoundary>
            <div className="mb-6">
              <GenreFilter
                genres={genres}
                activeGenreId={activeGenreId}
                onSelect={(id) =>
                  setActiveGenreId((prev) => (prev === id ? null : id))
                }
              />
            </div>
          </ErrorBoundary>
        )}

        {/* Content Rows */}
        <ErrorBoundary>
          <ContentRow
            title="Trending Today"
            items={filterByGenre(trending)}
            isLoading={heroLoading}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <ContentRow
            title="Popular Movies"
            items={filterByGenre(popular)}
            isLoading={popularLoading}
            error={popularError}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <ContentRow
            title="Top Rated Movies"
            items={filterByGenre(topRated)}
            isLoading={topRatedLoading}
            error={topRatedError}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <ContentRow
            title="Upcoming Movies"
            items={filterByGenre(upcoming)}
            isLoading={upcomingLoading}
            error={upcomingError}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default HomePage