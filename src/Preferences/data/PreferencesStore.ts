import { makeAutoObservable } from 'mobx'

type Theme = 'light' | 'dark'
type Language = 'en' | 'hi'

const PREFERENCES_KEY = 'cineview_preferences'

const getOSTheme = (): Theme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyTheme = (theme: Theme) => {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  }
}

class PreferencesStore {
  language: Language = 'en'
  theme: Theme = 'dark'
  region: string = 'US'

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        this.language = parsed.language ?? 'en'
        this.theme = parsed.theme ?? getOSTheme()
        this.region = parsed.region ?? 'US'
      } else {
        this.theme = getOSTheme()
      }
    } catch {
      this.theme = getOSTheme()
    }
    applyTheme(this.theme)
  }

  private saveToStorage() {
    localStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify({
        language: this.language,
        theme: this.theme,
        region: this.region,
      })
    )
  }

  setLanguage(language: Language) {
    this.language = language
    this.saveToStorage()
  }

  setTheme(theme: Theme) {
    this.theme = theme
    applyTheme(theme)
    this.saveToStorage()
  }

  setRegion(region: string) {
    this.region = region
    this.saveToStorage()
  }
}

export const preferencesStore = new PreferencesStore()
export default PreferencesStore