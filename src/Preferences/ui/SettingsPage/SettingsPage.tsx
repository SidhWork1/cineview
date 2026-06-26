import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { preferencesStore } from '../../data'
import { clearSession } from '../../../Auth/data'
import i18n from '../../../i18n'

const REGIONS = [
  { code: 'US', label: 'United States' },
  { code: 'IN', label: 'India' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
]

const SettingsPage = observer(() => {
  const { t } = useTranslation('settings')
  const navigate = useNavigate()

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    preferencesStore.setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      localStorage.removeItem('cineview_collection')
    }
  }

  const handleResetApp = () => {
    if (window.confirm('Are you sure you want to reset the entire application?')) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/login'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
      <p className="text-white/50 text-sm mb-10">{t('subtitle')}</p>

      {/* Preferences Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-6">{t('preferences')}</h2>

        {/* Language */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white text-sm font-medium">{t('language')}</p>
          </div>
          <select
            value={preferencesStore.language}
            onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'hi')}
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="en">English (US)</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {/* Region */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">{t('region')}</p>
          </div>
          <select
            value={preferencesStore.region}
            onChange={(e) => preferencesStore.setRegion(e.target.value)}
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">{t('appearance')}</h2>
            <p className="text-white/40 text-xs mt-1">{t('appearanceSubtitle')}</p>
          </div>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => preferencesStore.setTheme('light')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                preferencesStore.theme === 'light'
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t('light')}
            </button>
            <button
              onClick={() => preferencesStore.setTheme('dark')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                preferencesStore.theme === 'dark'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t('dark')}
            </button>
          </div>
        </div>
      </div>

      {/* Collection Maintenance */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">{t('collection')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white text-sm font-medium mb-1">{t('clearWatchlist')}</p>
            <p className="text-white/40 text-xs mb-4">{t('clearWatchlistDesc')}</p>
            <button
              onClick={handleClearWatchlist}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg transition-colors"
            >
              {t('clearWatchlistBtn')}
            </button>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white text-sm font-medium mb-1">{t('resetApp')}</p>
            <p className="text-white/40 text-xs mb-4">{t('resetAppDesc')}</p>
            <button
              onClick={handleResetApp}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg transition-colors"
            >
              {t('resetAppBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Storage Note */}
      <p className="text-white/20 text-xs text-center mb-8">{t('storageNote')}</p>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium rounded-xl transition-colors"
      >
        {t('nav.logout', { ns: 'common' })}
      </button>
    </div>
  )
})

export default SettingsPage