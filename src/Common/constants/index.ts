export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string
export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL as string
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string

export const IMAGE_SIZES = {
  poster: {
    small: '/w185',
    medium: '/w342',
    large: '/w500',
    original: '/original',
  },
  backdrop: {
    small: '/w300',
    medium: '/w780',
    large: '/w1280',
    original: '/original',
  },
  profile: {
    small: '/w45',
    medium: '/w185',
    large: '/h632',
  },
}