import MovieCard from '../MovieCard'
import LoadingSpinner from '../../../Common/components/LoadingSpinner'
import ErrorMessage from '../../../Common/components/ErrorMessage'
import type { Movie } from '../../core'

interface ContentRowProps {
  title: string
  items: Movie[]
  isLoading: boolean
  error?: string | null
}

const ContentRow = ({ title, items, isLoading, error }: ContentRowProps) => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="text-white font-semibold text-lg">{title}</h2>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-white/30 text-sm px-6">Nothing to show here.</p>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
          {items.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ContentRow