import PartnersMarquee from './PartnersMarquee'
import { fullLayout } from './fullLayout'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'
import { promoSlideImageUrls } from './promoSlideImages'

export default function Games() {
  return (
    <section
      id="games"
      className={`${fullLayout} relative py-10 scroll-animate`}
      style={layoutSectionStyle(layoutBgImages.partners)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1200px] flex-col items-center justify-center gap-10 px-3 sm:px-4 md:gap-14">
        <header className="max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-orange-400/90 md:text-xs md:tracking-[0.45em]">
            Liên minh thương hiệu
          </p>
          <h2 className="mt-3 bg-gradient-to-b from-white to-white/80 bg-clip-text text-3xl font-black uppercase tracking-[0.14em] text-transparent drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] md:mt-4 md:text-5xl md:tracking-[0.2em]">
            Games
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60 md:mt-5 md:text-base">
            Các thương hiệu đồng hành — đa dạng nền tảng, cam kết chất lượng cho hội viên.
          </p>
        </header>

        <div className="w-full min-w-0">
          <PartnersMarquee images={promoSlideImageUrls} speed={40} />
        </div>
      </div>
    </section>
  )
}
