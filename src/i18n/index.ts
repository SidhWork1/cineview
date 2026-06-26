import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import enMovies from './locales/en/movies.json'
import enWatchlist from './locales/en/watchlist.json'
import enSettings from './locales/en/settings.json'

import hiCommon from './locales/hi/common.json'
import hiMovies from './locales/hi/movies.json'
import hiWatchlist from './locales/hi/watchlist.json'
import hiSettings from './locales/hi/settings.json'

const getSavedLanguage = (): string => {
  try {
    const stored = localStorage.getItem('cineview_preferences')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.language ?? 'en'
    }
  } catch {
    return 'en'
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      movies: enMovies,
      watchlist: enWatchlist,
      settings: enSettings,
    },
    hi: {
      common: hiCommon,
      movies: hiMovies,
      watchlist: hiWatchlist,
      settings: hiSettings,
    },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n