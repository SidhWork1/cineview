import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation('common')

  return (
    <footer className="border-t border-white/10 mt-16 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-sm">
            Cine<span className="text-purple-500">View</span>
          </p>
          <p className="text-white/30 text-xs mt-1">
            {t('footer.dataBy')}
          </p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">{t('footer.about')}</a>
          <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">{t('footer.terms')}</a>
          <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">{t('footer.contact')}</a>
        </div>
        <p className="text-white/20 text-xs">© 2024 CineView. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer