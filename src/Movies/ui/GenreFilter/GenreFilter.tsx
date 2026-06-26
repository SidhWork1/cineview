import type { Genre } from '../../core'

interface GenreFilterProps {
  genres: Genre[]
  activeGenreId: number | null
  onSelect: (id: number) => void
}

const GenreFilter = ({ genres, activeGenreId, onSelect }: GenreFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto px-6 pb-2 scrollbar-hide">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeGenreId === genre.id
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}

export default GenreFilter