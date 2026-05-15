import { fullLayout } from './fullLayout'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'
import logo from '../../assets/images/logo.png'
import { useI18n } from '../../i18n/I18nProvider'

export default function Home() {
  const { t } = useI18n()

  return (
    <section
      id="home"
      className={`${fullLayout} !pt-28 pb-12`}
      style={layoutSectionStyle(layoutBgImages.hero)}
    >
      <div className="container relative z-10 mx-auto w-full min-w-0 max-w-[1200px]">
        <div className="w-full max-w-4xl lg:w-1/2 text-left">
          <div className="mb-0 animate-fade-in-up">
            <img
              src={logo}
              alt={t('home.logoAlt')}
              className="h-auto w-48 sm:w-56 md:w-64 lg:w-72"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white -mt-6 mb-8 animate-fade-in-up text-reveal">
            <span>{t('home.headline')}</span>
          </h2>
          <p className="text-xl text-yellow-200 mb-8 max-w-3xl animate-fade-in-up">{t('home.tagline')}</p>
        </div>
      </div>
    </section>
  )
}
