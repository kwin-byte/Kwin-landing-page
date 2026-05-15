import { fullLayout } from './fullLayout'
import { layoutBgImages, layoutSectionStyle } from './layoutBackgrounds'
import bonusData1 from '../../assets/images/imageBonus/bonusData1.jpg'
import bonusData2 from '../../assets/images/imageBonus/bonusData2.jpg'
import bonusData3 from '../../assets/images/imageBonus/bonusData3.jpg'
import bonusData4 from '../../assets/images/imageBonus/bonusData4.jpg'
import bonusData5 from '../../assets/images/imageBonus/bonusData5.jpg'

type BonusEntry = {
  image: string
  title: string
  description: string
}

const BONUS_ITEMS: BonusEntry[] = [
  {
    image: bonusData1,
    title: 'OKVIP ĐỒNG HÀNH CÙNG THƯƠNG HIỆU — ƯU ĐÃI KHỦNG MÙA MỚI',
    description:
      'Chuỗi ưu đãi độc quyền dành cho hội viên: thưởng nạp, hoàn trả và quà tặng sự kiện được cập nhật liên tục trên mọi nền tảng...'
  },
  {
    image: bonusData2,
    title: 'Hoàn trả cao — chơi càng nhiều nhận càng lớn',
    description: 'Hoàn trả lên đến 50% cho đa dạng trò chơi, tự động ghi có theo tuần...'
  },
  {
    image: bonusData3,
    title: 'Chương trình đại lý: hoa hồng hấp dẫn, thu nhập thụ động',
    description: 'Đăng ký đại lý OKVIP, nhận hoa hồng đa tầng và công cụ theo dõi realtime...'
  },
  {
    image: bonusData4,
    title: 'App mobile tối ưu — trải nghiệm mượt trên mọi thiết bị',
    description: 'Tải app chính thức, đăng nhập nhanh và nhận thêm gói quà dành riêng app...'
  },
  {
    image: bonusData5,
    title: 'Bảo mật đa lớp — an tâm nạp rút mọi lúc',
    description: 'Hệ thống mã hóa, xác minh đa tầng và đội ngũ giám sát giao dịch 24/7...'
  }
]

const [FEATURED, ...REST] = BONUS_ITEMS
const LIST_CARDS: BonusEntry[] = REST

export default function Promotion() {
  return (
    <section
      id="promotion"
      className={`${fullLayout} py-16`}
      style={layoutSectionStyle(layoutBgImages.promotion)}
    >
      <div className="container relative z-10 mx-auto w-full min-w-0 max-w-[1200px] px-4 sm:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-yellow-400 section-title neon-glow sm:text-4xl">
          ƯU ĐÃI VƯỢT TRỘI
        </h2>

        <div className="stagger-animation grid grid-cols-1 gap-6 lg:min-h-0 lg:grid-cols-12 lg:gap-8 lg:items-stretch">
          {/* Cột trái — 5/12 */}
          <article className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-600/50 bg-zinc-950/90 shadow-xl backdrop-blur-sm lg:col-span-5 lg:h-full lg:min-h-0">
            <div className="relative aspect-[16/10] w-full shrink-0 bg-zinc-800 lg:min-h-0 lg:flex-1 lg:basis-0 lg:aspect-auto">
              <img
                src={FEATURED.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="shrink-0 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
              <h3 className="text-left text-lg font-bold leading-snug text-white sm:text-xl">{FEATURED.title}</h3>
              <p className="mt-2 line-clamp-3 text-left text-sm leading-relaxed text-zinc-400">
                {FEATURED.description}
              </p>
            </div>
          </article>

          {/* Cột phải — 7/12 */}
          <div className="flex min-h-0 flex-col gap-4 lg:col-span-7 lg:h-full lg:min-h-0">
            {LIST_CARDS.map((item) => (
              <article
                key={item.title}
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
