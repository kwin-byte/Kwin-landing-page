import { useMemo, useState } from 'react'
import logo from '../assets/images/logo.png'
import { SECTION_IDS, type SectionId, useSlideNav } from '../context/SlideNavContext'
import LanguageSwitcher from '../i18n/LanguageSwitcher'
import { useI18n } from '../i18n/I18nProvider'

const SITE_URL = 'https://khmerwin.vip/'
const DOWNLOAD_URL = 'https://khmerwin.pro/'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { activeIndex, goToSlide } = useSlideNav()
  const { m, t } = useI18n()

  const navLabels: Record<SectionId, string> = {
    home: m.nav.home,
    games: m.nav.games,
    promotion: m.nav.promotion,
    statistics: m.nav.statistics,
    news: m.nav.news
  }

  const navItems = useMemo(
    () =>
      SECTION_IDS.map((id, index) => ({
        index,
        id,
        href: `#${id}` as const,
        label: navLabels[id]
      })),
    [navLabels]
  )

  const linkBase =
    'transition-colors font-medium rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

  const linkClass = (index: number) =>
    [
      linkBase,
      activeIndex === index
        ? 'text-orange-400 font-bold underline decoration-2 underline-offset-8 decoration-orange-400'
        : 'text-white/90 hover:text-orange-300'
    ].join(' ')

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-50">
      <div className="pointer-events-auto bg-gradient-to-b from-[#171717cc] to-[#17171700]">
        <div className="mx-auto w-full max-w-[1200px] px-4">
          <div className="flex h-24 items-center justify-between gap-3">
            <div className="flex min-w-0 shrink-0 items-center space-x-3">
              <a
                href="#home"
                className="block shrink-0"
                aria-label={t('header.backToTop')}
                onClick={(e) => {
                  e.preventDefault()
                  goToSlide(0)
                }}
              >
                <img src={logo} alt={t('header.logoAlt')} className="w-32 rounded-full" />
              </a>
            </div>

            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-6"
              aria-label={t('header.mainNav')}
            >
              {navItems.map(({ index, href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={linkClass(index)}
                  aria-current={activeIndex === index ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    goToSlide(index)
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
              <LanguageSwitcher />
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-2 text-xs font-bold text-black shadow-md transition hover:from-yellow-500 hover:to-yellow-700 xl:px-4 xl:text-sm"
              >
                {t('header.playNow')}
              </a>
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-app whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold xl:px-4 xl:text-sm"
              >
                {t('header.downloadApp')}
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <LanguageSwitcher compact />
              <button
                type="button"
                className="p-2 -mr-2"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="space-y-1">
                  <div className="w-6 h-0.5 bg-white" />
                  <div className="w-6 h-0.5 bg-white" />
                  <div className="w-6 h-0.5 bg-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="pointer-events-auto lg:hidden bg-gradient-to-r from-gray-800 via-gray-700 to-blue-600 border-t border-gray-600">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-4">
            <nav className="flex flex-col space-y-3" aria-label={t('header.mainNav')}>
              {navItems.map(({ index, href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={linkClass(index)}
                  aria-current={activeIndex === index ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    goToSlide(index)
                    setIsMenuOpen(false)
                  }}
                >
                  {label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 py-3 text-center text-base font-bold text-black transition hover:from-yellow-500 hover:to-yellow-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.playNow')}
                </a>
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-app block w-full rounded-lg py-3 text-center text-base font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.downloadApp')}
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
