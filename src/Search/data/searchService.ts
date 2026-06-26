import { TMDB_BASE_URL, TMDB_API_KEY } from '../../Common/constants'
import { SearchResponseSchema } from '../core'

const RECENT_SEARCHES_KEY = 'cineview_recent_searches'
const MAX_RECENT_SEARCHES = 5

export const searchMulti = async (query: string) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  )
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  const data = await response.json()
  return SearchResponseSchema.parse(data)
}

export const getRecentSearches = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveRecentSearch = (query: string): void => {
  const current = getRecentSearches()
  const updated = [query, ...current.filter((q) => q !== query)].slice(
    0,
    MAX_RECENT_SEARCHES
  )
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
}

export const clearRecentSearches = (): void => {
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}