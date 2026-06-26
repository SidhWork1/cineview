import ImageWithFallback from '../../../Common/components/ImageWithFallback'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../../Common/constants'
import type { CastMember } from '../../core'

interface CastCarouselProps {
  cast: CastMember[]
}

const CastCarousel = ({ cast }: CastCarouselProps) => {
  if (cast.length === 0) return null

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {cast.slice(0, 10).map((member) => {
        const profileUrl = member.profile_path
          ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.profile.medium}${member.profile_path}`
          : null

        return (
          <div key={member.id} className="flex-shrink-0 w-24 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2">
              <ImageWithFallback
                src={profileUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white text-xs font-medium truncate">{member.name}</p>
            <p className="text-white/40 text-xs truncate">{member.character}</p>
          </div>
        )
      })}
    </div>
  )
}

export default CastCarousel