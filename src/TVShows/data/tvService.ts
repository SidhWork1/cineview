import { TMDB_BASE_URL, TMDB_API_KEY } from '../../Common/constants'
import { TVShowDetailSchema, SeasonDetailSchema } from '../core'

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

export const getTVShowDetail = async (id: string) => {
  const data = await fetchFromTMDB(`/tv/${id}`)
  return TVShowDetailSchema.parse(data)
}

export const getSeasonDetail = async (id: string, seasonNumber: string) => {
  const data = await fetchFromTMDB(`/tv/${id}/season/${seasonNumber}`)
  return SeasonDetailSchema.parse(data)
}