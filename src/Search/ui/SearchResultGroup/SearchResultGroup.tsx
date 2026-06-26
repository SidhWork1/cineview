import { Link } from 'react-router-dom'
import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import type { SearchResult } from '../../core'

interface SearchResultGroupProps {
  title: string
  items: SearchResult[]
}

const SearchResultGroup = ({ title, items }: SearchResultGroupProps) => {
  if (items.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-white font-semibold text-lg mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          if (item.media_type === 'movie') {
            const posterUrl = item.poster_path
              ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.medium}${item.poster_path}`
              : null
            return (
              <Link key={item.id} to={`/movies/${item.id}`} className="group">
                <div className="rounded-xl overflow-hidden aspect-[2/3] mb-2">
                  <ImageWithFallback
                    src={posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-white/80 text-xs font-medium truncate">
                  {item.title}
                </p>
                <p className="text-white/40 text-xs">
                  ★ {item.vote_average.toFixed(1)}
                </p>
              </Link>
            )
          }

          if (item.media_type === 'tv') {
            const posterUrl = item.poster_path
              ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster.medium}${item.poster_path}`
              : null
            return (
              <Link key={item.id} to={`/tv/${item.id}`} className="group">
                <div className="rounded-xl overflow-hidden aspect-[2/3] mb-2">
                  <ImageWithFallback
                    src={posterUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-white/80 text-xs font-medium truncate">
                  {item.name}
                </p>
                <p className="text-white/40 text-xs">
                  ★ {item.vote_average.toFixed(1)}
                </p>
              </Link>
            )
          }

          if (item.media_type === 'person') {
            const profileUrl = item.profile_path
              ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.profile.medium}${item.profile_path}`
              : null
            return (
              <div key={item.id} className="text-center">
                <div className="rounded-full overflow-hidden aspect-square mb-2 w-20 mx-auto">
                  <ImageWithFallback
                    src={profileUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white/80 text-xs font-medium truncate">
                  {item.name}
                </p>
                {item.known_for_department && (
                  <p className="text-white/40 text-xs truncate">
                    {item.known_for_department}
                  </p>
                )}
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

export default SearchResultGroup