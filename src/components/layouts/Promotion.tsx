import { fullLayout } from './fullLayout'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'
import bonusData1 from '../../assets/images/imageBonus/bonusData1.jpg'
import bonusData2 from '../../assets/images/imageBonus/bonusData2.jpg'
import bonusData3 from '../../assets/images/imageBonus/bonusData3.jpg'
import bonusData4 from '../../assets/images/imageBonus/bonusData4.jpg'
import bonusData5 from '../../assets/images/imageBonus/bonusData5.jpg'
import { useI18n } from '../../i18n/I18nProvider'

const BONUS_IMAGES = [bonusData1, bonusData2, bonusData3, bonusData4, bonusData5]

export default function Promotion() {
  const { m, t } = useI18n()
  const items = m.promotion.items.map((entry, index) => ({
    ...entry,
    image: BONUS_IMAGES[index]!
  }))
  const [featured, ...listCards] = items

  return (
    <section
      id="promotion"
      className={`${fullLayout} py-16`}
      style={layoutSectionStyle(layoutBgImages.promotion)}
    >
      <div className="container relative z-10 mx-auto w-full min-w-0 max-w-[1200px] px-4 sm:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-yellow-400 section-title neon-glow sm:text-4xl">
          {t('promotion.sectionTitle')}
        </h2>

        <div className="stagger-animation grid grid-cols-1 gap-6 lg:min-h-0 lg:grid-cols-12 lg:gap-8 lg:items-stretch">
          <article className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-600/50 bg-zinc-950/90 shadow-xl backdrop-blur-sm lg:col-span-5 lg:h-full lg:min-h-0">
            <div className="relative aspect-[16/10] w-full shrink-0 bg-zinc-800 lg:min-h-0 lg:flex-1 lg:basis-0 lg:aspect-auto">
              <img
                src={featured.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="shrink-0 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
              <h3 className="text-left text-lg font-bold leading-snug text-white sm:text-xl">{featured.title}</h3>
              <p className="mt-2 line-clamp-3 text-left text-sm leading-relaxed text-zinc-400">
                {featured.description}
              </p>
            </div>
          </article>

          <div className="flex min-h-0 flex-col gap-4 lg:col-span-7 lg:h-full lg:min-h-0">
            {listCards.map((item, index) => (
              <article
                key={index}
                className="flex shrink-0 gap-3 overflow-hidden rounded-2xl border border-zinc-600/50 bg-zinc-950/90 p-3 shadow-lg backdrop-blur-sm sm:gap-4 sm:p-3.5"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-800 sm:h-[5.5rem] sm:w-[7.25rem]">
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pr-1">
                  <h4 className="line-clamp-2 text-left text-sm font-bold leading-snug text-white sm:text-[0.9375rem]">
                    {item.title}
                  </h4>
                  <p className="line-clamp-2 text-left text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
