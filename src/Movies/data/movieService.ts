import { TMDB_BASE_URL, TMDB_API_KEY } from '../../Common/constants'
import {
  MovieListResponseSchema,
  MovieDetailSchema,
  MovieCreditsSchema,
  MovieVideosSchema,
  GenreListSchema,
} from '../core'

const fetchFromTMDB = async (endpoint: string) => {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  )
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  return response.json()
}

export const getTrending = async () => {
  const data = await fetchFromTMDB('/trending/movie/day')
  return MovieListResponseSchema.parse(data)
}

export const getPopularMovies = async () => {
  const data = await fetchFromTMDB('/movie/popular')
  return MovieListResponseSchema.parse(data)
}

export const getTopRatedMovies = async () => {
  const data = await fetchFromTMDB('/movie/top_rated')
  return MovieListResponseSchema.parse(data)
}

export const getUpcomingMovies = async () => {
  const data = await fetchFromTMDB('/movie/upcoming')
  return MovieListResponseSchema.parse(data)
}

export const getGenres = async () => {
  const data = await fetchFromTMDB('/genre/movie/list')
  return GenreListSchema.parse(data)
}

export const getMovieDetail = async (id: string) => {
  const data = await fetchFromTMDB(`/movie/${id}`)
  return MovieDetailSchema.parse(data)
}

export const getMovieCredits = async (id: string) => {
  const data = await fetchFromTMDB(`/movie/${id}/credits`)
  return MovieCreditsSchema.parse(data)
}

export const getMovieVideos = async (id: string) => {
  const data = await fetchFromTMDB(`/movie/${id}/videos`)
  return MovieVideosSchema.parse(data)
}

export const getSimilarMovies = async (id: string) => {
  const data = await fetchFromTMDB(`/movie/${id}/similar`)
  return MovieListResponseSchema.parse(data)
}

export const getRecommendedMovies = async (id: string) => {
  const data = await fetchFromTMDB(`/movie/${id}/recommendations`)
  return MovieListResponseSchema.parse(data)
}