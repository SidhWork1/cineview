import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { clearSession } from '../../../Auth/data'

const Navbar = observer(() => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const NAV_LINKS = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.search'), path: '/search' },
    { label: t('nav.watchlist'), path: '/watchlist' },
    { label: t('nav.lists'), path: '/lists' },
    { label: t('nav.settings'), path: '/settings' },
  ]

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="text-white font-bold text-xl tracking-tight">
          Cine<span className="text-purple-500">View</span>
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          {t('nav.logout')}
        </button>

      </div>
    </nav>
  )
})

export default Navbar