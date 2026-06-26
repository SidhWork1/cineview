import { useState, useEffect, useRef } from 'react'
import SearchResultGroup from '../SearchResultGroup'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import {
  searchMulti,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
} from '../../data'
import type { SearchMovie, SearchTV, SearchPerson } from '../../core'

const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<SearchMovie[]>([])
  const [tvShows, setTVShows] = useState<SearchTV[]>([])
  const [people, setPeople] = useState<SearchPerson[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      setTVShows([])
      setPeople([])
      setSearched(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchMulti(query.trim())
        const allMovies = data.results.filter(
          (r): r is SearchMovie => r.media_type === 'movie'
        )
        const allTV = data.results.filter(
          (r): r is SearchTV => r.media_type === 'tv'
        )
        const allPeople = data.results.filter(
          (r): r is SearchPerson => r.media_type === 'person'
        )
        setMovies(allMovies)
        setTVShows(allTV)
        setPeople(allPeople)
        setSearched(true)
        saveRecentSearch(query.trim())
        setRecentSearches(getRecentSearches())
      } catch {
        setMovies([])
        setTVShows([])
        setPeople([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleClearHistory = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const hasResults = movies.length > 0 || tvShows.length > 0 || people.length > 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Search Input */}
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows, people..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">Recent Searches</h2>
            <button
              onClick={handleClearHistory}
              className="text-white/30 hover:text-white text-xs transition-colors"
            >
              Clear History
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => setQuery(search)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white text-xs transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Results */}
      {!loading && hasResults && (
        <>
          <SearchResultGroup title="Movies" items={movies} />
          <SearchResultGroup title="TV Shows" items={tvShows} />
          <SearchResultGroup title="People" items={people} />
        </>
      )}

      {/* Empty State */}
      {!loading && searched && !hasResults && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/30 text-sm">
            No results found for "{query}"
          </p>
        </div>
      )}

      {/* Initial State */}
      {!query && recentSearches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/30 text-sm">
            Start typing to search movies, TV shows, and people.
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
